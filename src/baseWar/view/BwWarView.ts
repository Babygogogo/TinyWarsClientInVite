import type { UiListener, Point } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { IBwWarView } from "../interface/IBwWarView.ts";
import { getRwWarBaseClass, getMeWarClass } from "../../gameHelpers/GhFactory.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import { createLazyFunc, getExisted } from "../../helpers/Misc.ts";
import { UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import type { BwFieldZoomedByTouch, BwFieldDragged } from "../../notifications/DataTypes.ts";
import { addEventListeners, removeEventListeners } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { Listener } from "../../notifications/Types.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { getStage } from "../../stages/StageManager.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import type { IUiComponent } from "../../ui/interfaces/IUiComponent.ts";
import type { IUiZoomableComponent } from "../../ui/interfaces/IUiZoomableComponent.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { getUiZoomableComponentClass, getUiContainerClass, getUiLabelClass } from "../../ui/utils/UiFactory.ts";
import { getSelfSettingsIsScreenVibrationEnabled } from "../../users/Model.ts";
import { Event, setTimeout, clearTimeout } from "../../vendor/egret/Egret.ts";

const getGridWidth      = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight     = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);
const CENTRAL_PADDING   = 120;

type Padding = {
    left    : number;
    right   : number;
    bottom  : number;
    top     : number;
};
// eslint-disable-next-line no-shadow
const enum PaddingType {
    Default,
    Replay,
    MapEditor,
}
const PADDINGS = new Map<PaddingType, Padding>([
    [PaddingType.Default,   { left: 150,    right: 150,     top: 120,   bottom: 20 }],
    [PaddingType.MapEditor, { left: 90,     right: 90,      top: 120,   bottom: 120 }],
    [PaddingType.Replay,    { left: 150,    right: 150,     top: 60,    bottom: 20 }],
]);

export class BwWarView extends UiContainer implements IBwWarView {
    private _fieldContainer         = new (getUiZoomableComponentClass())();
    private _weatherContainer       = new (getUiContainerClass());
    private _labelPersistentText    = new (getUiLabelClass());

    private _isShowingVibration = false;
    private _vibrationMaxOffset = 4;
    private _vibrationTimeoutId : number | null = null;

    private _war? : IBwWar;

    private _notifyListeners: Listener[] = [
        { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        { type: TypeId.BwFieldZoomedByTouch,    callback: this._onNotifyBwFieldZoomedByTouch },
        { type: TypeId.BwFieldDragged,          callback: this._onNotifyBwFieldDragged },
    ];
    private _uiListeners: UiListener[] = [
        { ui: this,     callback: this._onEnterFrame,   eventType: Event.ENTER_FRAME },
    ];

    public constructor() {
        super();

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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
            labelPersistentText.setHorizontalAlign(UiHorizontalAlign.Center);
            labelPersistentText.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign: { align: UiHorizontalAlign.Center },
            });
            this.addUiChild(labelPersistentText);
        }
    }

    public init(war: IBwWar): void {
        const mapSize           = war.getTileMap().getMapSize();
        const fieldContainer    = this._fieldContainer;
        const padding           = getPadding(war);
        this._war               = war;
        fieldContainer.setBoundarySpacings(padding.left, padding.right, padding.top, padding.bottom);
        fieldContainer.removeAllContents();
        fieldContainer.setContentSize(
            mapSize.getWidth() * getGridWidth(),
            mapSize.getHeight() * getGridHeight()
        );
        fieldContainer.addContent(war.getField().getView());
        fieldContainer.setContentScale(0, true);

        this._weatherContainer.addUiChild(war.getWeatherManager().getView());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fastInit(war: IBwWar): void {
        // nothing to do
    }

    public startRunningView(): void {
        addEventListeners(this._notifyListeners, this);
        for (const listener of this._uiListeners) {
            listener.ui.addEventListener(getExisted(listener.eventType), listener.callback, this);
        }

        this._fieldContainer.setMouseWheelListenerEnabled(true);

        this.updatePersistentText();
    }
    public stopRunning(): void {
        removeEventListeners(this._notifyListeners, this);
        for (const listener of this._uiListeners) {
            listener.ui.removeEventListener(getExisted(listener.eventType), listener.callback, this);
        }

        this._fieldContainer.setMouseWheelListenerEnabled(false);
    }

    public getFieldContainer(): IUiZoomableComponent {
        return this._fieldContainer;
    }

    public tweenGridToCentralArea(gridIndex: GridIndex): void {
        const stage             = getStage();
        const container         = this._fieldContainer;
        const stageWidth        = stage.stageWidth;
        const stageHeight       = stage.stageHeight;
        const gridX             = gridIndex.getX();
        const gridY             = gridIndex.getY();
        const currPoint         = container.getContentsContainerLocalToGlobal({ x: (gridX + 0.5) * getGridWidth(),   y: (gridY + 0.5) * getGridHeight() });
        const topLeftPoint      = container.getContentsContainerLocalToGlobal({ x: gridX * getGridWidth(),           y: gridY * getGridHeight() });
        const bottomRightPoint  = container.getContentsContainerLocalToGlobal({ x: (gridX + 1) * getGridWidth(),     y: (gridY + 1) * getGridHeight() });
        const currX             = currPoint.x;
        const currY             = currPoint.y;
        // const padding           = this._padding;
        const newX              = getValueInRange({
            minValue    : CENTRAL_PADDING + currX - topLeftPoint.x,
            maxValue    : stageWidth - CENTRAL_PADDING + currX - bottomRightPoint.x,
            rawValue    : currX,
        });
        const newY              = getValueInRange({
            minValue    : CENTRAL_PADDING + currY - topLeftPoint.y,
            maxValue    : stageHeight - CENTRAL_PADDING + currY - bottomRightPoint.y,
            rawValue    : currY,
        });
        const newPoint  = this._getRevisedContentPointForMoveGrid(gridIndex, newX, newY);
        container.tweenContentToPoint(newPoint.x, newPoint.y, false);
    }
    public moveGridToCenter(gridIndex: GridIndex): void {
        const stage = getStage();
        this._moveGridToPoint(gridIndex, stage.stageWidth / 2, stage.stageHeight / 2);
    }
    private _moveGridToPoint(gridIndex: GridIndex, x: number, y: number): void {
        const point     = this._getRevisedContentPointForMoveGrid(gridIndex, x, y);
        const container = this._fieldContainer;
        container.setContentX(point.x, false);
        container.setContentY(point.y, false);
    }
    private _getRevisedContentPointForMoveGrid(gridIndex: GridIndex, x: number, y: number): Point {
        const container = this._fieldContainer;
        const point1    = container.getContentsContainerLocalToGlobal({
            x: (gridIndex.getX() + 0.5) * getGridWidth(),
            y: (gridIndex.getY() + 0.5) * getGridHeight(),
        });
        const point2    = container.getContentsContainerLocalToGlobal({ x: 0, y: 0 });
        return {
            x   : container.getRevisedContentX(- point1.x + point2.x + x),
            y   : container.getRevisedContentY(- point1.y + point2.y + y),
        };
    }

    public showVibration(duration = 450, maxOffset = 5): void {
        this.stopVibration();

        if (!getSelfSettingsIsScreenVibrationEnabled()) {
            return;
        }

        this._isShowingVibration    = true;
        this._vibrationMaxOffset    = maxOffset;
        this._vibrationTimeoutId    = setTimeout(() => {
            this.stopVibration();
        }, this, duration);
    }
    public stopVibration(): void {
        this._isShowingVibration = false;
        resetContainer(this._fieldContainer);

        if (this._vibrationTimeoutId != null) {
            clearTimeout(this._vibrationTimeoutId);
            this._vibrationTimeoutId = null;
        }
    }
    private _checkAndVibrate(): void {
        if (this._isShowingVibration) {
            const maxOffset = this._vibrationMaxOffset;
            const offsetX   = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
            const offsetY   = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
            this._fieldContainer.checkAndInitSizerInfo().addSizerOptions({
                verticalAlign   : { offset  : offsetX },
                horizontalAlign : { offset  : offsetY },
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
                    getLanguageText({ textArray: action.getTextArray() }) ?? UndefinedError,
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

    private _onNotifyBwFieldZoomedByTouch(e: Event): void {
        const data = e.data as BwFieldZoomedByTouch;
        this._fieldContainer.setZoomByTouches(data.current, data.previous);
    }
    private _onNotifyBwFieldDragged(e: Event): void {
        const data = e.data as BwFieldDragged;
        this._fieldContainer.setDragByTouches(data.current, data.previous);
    }

    private _onEnterFrame(): void {
        this._checkAndVibrate();
    }
}

function resetContainer(container: IUiComponent): void {
    container.checkAndInitSizerInfo().setSizerOptions({
        verticalAlign   : { align       : UiVerticalAlign.Middle },
        horizontalAlign : { align       : UiHorizontalAlign.Center },
        width           : { percentage  : 100 },
        height          : { percentage  : 100 },
    });
}

function getPadding(war: IBwWar): Padding {
    if (war instanceof getRwWarBaseClass()) {
        return getExisted(PADDINGS.get(PaddingType.Replay));
    } else if (war instanceof getMeWarClass()) {
        return getExisted(PADDINGS.get(PaddingType.MapEditor));
    } else {
        return getExisted(PADDINGS.get(PaddingType.Default));
    }
}
