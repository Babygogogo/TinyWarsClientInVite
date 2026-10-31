import {
    type Notifications_Mapping,
    MapEditor_Model_MeWar,
    ReplayWar_Model_RwWarBase,
    Ui_Components_UiLabel,
    Ui_Components_UiZoomableComponent,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarView,
    type AuxiliaryTypes_AuxiliaryTypes,
    Notifications_Dispatcher,
    Helpers_Misc,
    Graphics_Utils,
    Lang_Utils,
    Stages_StageManager,
    Numbers_Utils,
    Ui_Components_UiContainer,
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiVerticalAlign,
    Lang_Constants,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiZoomableComponent,
    type Notifications_Types,
    Egret_Egret,
    Users_Model,
} from "../../internal.ts";

const getGridWidth      = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight     = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);
const CENTRAL_PADDING   = 120;

type Padding = {
    left    : number;
    right   : number;
    bottom  : number;
    top     : number;
};
 
const enum PaddingType {
    Default,
    Replay,
    MapEditor,
}
const PADDINGS = new Map<PaddingType, Padding>([
    [PaddingType.Default,   {
        left : 150,    right : 150,     top : 120,   bottom : 20, 
    }],
    [PaddingType.MapEditor, {
        left : 90,     right : 90,      top : 120,   bottom : 120, 
    }],
    [PaddingType.Replay,    {
        left : 150,    right : 150,     top : 60,    bottom : 20, 
    }],
]);

export class BwWarView extends Ui_Components_UiContainer.UiContainer implements BaseWar_Interface_IBwWarView.IBwWarView {
    private _fieldContainer         = new Ui_Components_UiZoomableComponent.UiZoomableComponent();
    private _weatherContainer       = new Ui_Components_UiContainer.UiContainer();
    private _labelPersistentText    = new Ui_Components_UiLabel.UiLabel();

    private _isShowingVibration = false;
    private _vibrationMaxOffset = 4;
    private _vibrationTimeoutId : number | null = null;

    private _war? : BaseWar_Interface_IBwWar.IBwWar;

    private _notifyListeners: Notifications_Types.Listener[] = [
        { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
        { type : "BwFieldZoomedByTouch",    callback : this._onNotifyBwFieldZoomedByTouch },
        { type : "BwFieldDragged",          callback : this._onNotifyBwFieldDragged },
    ];
    private _uiListeners: AuxiliaryTypes_AuxiliaryTypes.UiListener[] = [
        { ui : this,     callback : this._onEnterFrame,   eventType : Egret_Egret.Event.ENTER_FRAME },
    ];

    public constructor() {
        super();

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });

        {
            const fieldContainer = this._fieldContainer;
            resetContainer(fieldContainer);
            this.addUiChild(fieldContainer);
        }

        {
            const weatherContainer = this._weatherContainer;
            weatherContainer.setIsTouchChildrenEnabled(false);
            resetContainer(weatherContainer);
            this.addUiChild(weatherContainer);
        }

        {
            const labelPersistentText = this._labelPersistentText;
            labelPersistentText.setFontSize(12);
            labelPersistentText.setStrokeWidth(2);
            labelPersistentText.setY(60);
            labelPersistentText.setHorizontalAlign(Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center);
            labelPersistentText.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            });
            this.addUiChild(labelPersistentText);
        }
    }

    public init(war: BaseWar_Interface_IBwWar.IBwWar): void {
        const mapSize           = war.getTileMap().getMapSize();
        const fieldContainer    = this._fieldContainer;
        const padding           = getPadding(war);
        this._war               = war;
        fieldContainer.setBoundarySpacings(padding.left, padding.right, padding.top, padding.bottom);
        fieldContainer.removeAllContents();
        fieldContainer.setContentSize(
            mapSize.getWidth() * getGridWidth(),
            mapSize.getHeight() * getGridHeight(),
        );
        fieldContainer.addContent(war.getField().getView());
        fieldContainer.setContentScale(0, true);

        this._weatherContainer.addUiChild(war.getWeatherManager().getView());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fastInit(war: BaseWar_Interface_IBwWar.IBwWar): void {
        // nothing to do
    }

    public startRunningView(): void {
        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
        for (const listener of this._uiListeners) {
            listener.ui.addEventListener(Helpers_Misc.getExisted(listener.eventType), listener.callback as Egret_Egret.EventListener, this);
        }

        this._fieldContainer.setMouseWheelListenerEnabled(true);

        this.updatePersistentText();
    }
    public stopRunning(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
        for (const listener of this._uiListeners) {
            listener.ui.removeEventListener(Helpers_Misc.getExisted(listener.eventType), listener.callback as Egret_Egret.EventListener, this);
        }

        this._fieldContainer.setMouseWheelListenerEnabled(false);
    }

    public getFieldContainer(): Ui_Interfaces_IUiZoomableComponent.IUiZoomableComponent {
        return this._fieldContainer;
    }

    public tweenGridToCentralArea(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const stage             = Stages_StageManager.getStage();
        const container         = this._fieldContainer;
        const stageWidth        = stage.stageWidth;
        const stageHeight       = stage.stageHeight;
        const gridX             = gridIndex.getX();
        const gridY             = gridIndex.getY();
        const currPoint         = container.getContentsContainerLocalToGlobal({ x : (gridX + 0.5) * getGridWidth(),   y : (gridY + 0.5) * getGridHeight() });
        const topLeftPoint      = container.getContentsContainerLocalToGlobal({ x : gridX * getGridWidth(),           y : gridY * getGridHeight() });
        const bottomRightPoint  = container.getContentsContainerLocalToGlobal({ x : (gridX + 1) * getGridWidth(),     y : (gridY + 1) * getGridHeight() });
        const currX             = currPoint.x;
        const currY             = currPoint.y;
        // const padding           = this._padding;
        const newX              = Numbers_Utils.getValueInRange({
            minValue : CENTRAL_PADDING + currX - topLeftPoint.x,
            maxValue : stageWidth - CENTRAL_PADDING + currX - bottomRightPoint.x,
            rawValue : currX,
        });
        const newY              = Numbers_Utils.getValueInRange({
            minValue : CENTRAL_PADDING + currY - topLeftPoint.y,
            maxValue : stageHeight - CENTRAL_PADDING + currY - bottomRightPoint.y,
            rawValue : currY,
        });
        const newPoint  = this._getRevisedContentPointForMoveGrid(gridIndex, newX, newY);
        container.tweenContentToPoint(newPoint.x, newPoint.y, false);
    }
    public moveGridToCenter(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const stage = Stages_StageManager.getStage();
        this._moveGridToPoint(gridIndex, stage.stageWidth / 2, stage.stageHeight / 2);
    }
    private _moveGridToPoint(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, x: number, y: number): void {
        const point     = this._getRevisedContentPointForMoveGrid(gridIndex, x, y);
        const container = this._fieldContainer;
        container.setContentX(point.x, false);
        container.setContentY(point.y, false);
    }
    private _getRevisedContentPointForMoveGrid(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, x: number, y: number): AuxiliaryTypes_AuxiliaryTypes.Point {
        const container = this._fieldContainer;
        const point1    = container.getContentsContainerLocalToGlobal({
            x : (gridIndex.getX() + 0.5) * getGridWidth(),
            y : (gridIndex.getY() + 0.5) * getGridHeight(),
        });
        const point2    = container.getContentsContainerLocalToGlobal({ x : 0, y : 0 });
        return {
            x : container.getRevisedContentX(- point1.x + point2.x + x),
            y : container.getRevisedContentY(- point1.y + point2.y + y),
        };
    }

    public showVibration(duration = 450, maxOffset = 5): void {
        this.stopVibration();

        if (!Users_Model.getSelfSettingsIsScreenVibrationEnabled()) {
            return;
        }

        this._isShowingVibration    = true;
        this._vibrationMaxOffset    = maxOffset;
        this._vibrationTimeoutId    = Egret_Egret.setTimeout(() => {
            this.stopVibration();
        }, this, duration);
    }
    public stopVibration(): void {
        this._isShowingVibration = false;
        resetContainer(this._fieldContainer);

        if (this._vibrationTimeoutId != null) {
            Egret_Egret.clearTimeout(this._vibrationTimeoutId);
            this._vibrationTimeoutId = null;
        }
    }
    private _checkAndVibrate(): void {
        if (this._isShowingVibration) {
            const maxOffset = this._vibrationMaxOffset;
            const offsetX   = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
            const offsetY   = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
            this._fieldContainer.checkAndInitSizerInfo().addSizerOptions({
                verticalAlign   : { offset : offsetX },
                horizontalAlign : { offset : offsetY },
            });
        }
    }

    public updatePersistentText(): void {
        const war   = this._war;
        const label = this._labelPersistentText;
        if (!war?.getIsRunning()) {
            label.setText(``);
            return;
        }

        const warEventManager   = war.getWarEventManager();
        const textArray         : string[] = [];
        for (const actionId of warEventManager.getOpaIdArray()) {
            const action = warEventManager.getWarEventAction(actionId).getWeaPersistentShowText();
            if (action) {
                textArray.push(war.getWarEventManager().handleEscapeText(
                    Lang_Utils.getLanguageText({ textArray : action.getTextArray() }) ?? Lang_Constants.UndefinedError,
                ));
            }
        }
        label.setText(textArray.join(`\n`));
    }

    public zoomField(stageX: number, stageY: number, isZoomIn: boolean): void {
        this._fieldContainer.setZoomByScroll(stageX, stageY, isZoomIn ? 30 : -30);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this.updatePersistentText();
    }

    private _onNotifyBwFieldZoomedByTouch(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwFieldZoomedByTouch"]>): void {
        const data = e.data as Notifications_Mapping.Mapping["BwFieldZoomedByTouch"];
        this._fieldContainer.setZoomByTouches(data.current, data.previous);
    }
    private _onNotifyBwFieldDragged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwFieldDragged"]>): void {
        const data = e.data as Notifications_Mapping.Mapping["BwFieldDragged"];
        this._fieldContainer.setDragByTouches(data.current, data.previous);
    }

    private _onEnterFrame(): void {
        this._checkAndVibrate();
    }
}

function resetContainer(container: Ui_Interfaces_IUiComponent.IUiComponent): void {
    container.checkAndInitSizerInfo().setSizerOptions({
        verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
        horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
        width           : { percentage : 100 },
        height          : { percentage : 100 },
    });
}

function getPadding(war: BaseWar_Interface_IBwWar.IBwWar): Padding {
    if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Helpers_Misc.getExisted(PADDINGS.get(PaddingType.Replay));
    } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return Helpers_Misc.getExisted(PADDINGS.get(PaddingType.MapEditor));
    } else {
        return Helpers_Misc.getExisted(PADDINGS.get(PaddingType.Default));
    }
}
