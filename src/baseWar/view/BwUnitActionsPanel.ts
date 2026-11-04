import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Model_BwTypes,
    Graphics_Utils,
    Helpers_Misc,
    Keyboard_KbTypes,
    Lang_Constants,
    Lang_Utils,
    Sounds_Constants,
    Sounds_SoundPlayer,
    Stages_StageManager,
    Timer_TimerModel,
    Tween_Executor,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Constants,
    Units_Unit,
    Units_UnitView,
    Units_UnitViewPool,
    Units_Utils_Serialization,
} from "../../internal.ts";

const getGridWidth      = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight     = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    destination : AuxiliaryTypes_GridIndex.GridIndex;
    actionList  : BaseWar_Model_BwTypes.DataForUnitAction[];
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listAction!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitActionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "ZoomableContentsMoved",      callback : this._onNotifyZoomableContentsMoved },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
        });
        this._listAction.setItemRendererClass(UnitActionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
        this._updatePosition();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listAction.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyZoomableContentsMoved(): void {
        this._updatePosition();
    }

    private _onKeyboard(eventData: Keyboard_KbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (eventData.isHandled) {
            return;
        }
        eventData.isHandled = true;

        const newKeys = eventData.newKeys;
        if ((newKeys.has(Keyboard_KbTypes.KeyCode.K)) || (newKeys.has(Keyboard_KbTypes.KeyCode.Escape))) {
            this.getOpenData()?.war.getActionPlanner().cancelCurrentState();
            return;
        }

        const list = this._listAction;
        if ((newKeys.has(Keyboard_KbTypes.KeyCode.J)) || (newKeys.has(Keyboard_KbTypes.KeyCode.Enter))) {
            const data = list.getFirstSelectedData();
            if ((data == null) || (data.war.getActionPlanner().checkIsStateRequesting())) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                data.callback();
            }

            return;
        }

        {
            const offsetIndex   = (newKeys.has(Keyboard_KbTypes.KeyCode.W) ? -1 : 0) + (newKeys.has(Keyboard_KbTypes.KeyCode.S) ? 1 : 0);
            const length        = list.getBoundDataArray()?.length;
            const index         = list.getFirstSelectedItemIndex();
            if ((offsetIndex !== 0) && (length != null) && (index != null) && (length > 0)) {
                list.setSelectedItemIndex((index + length + offsetIndex) % length);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
                return;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const gameConfig    = war.getGcData();
        const dataArray     : DataForUnitActionRenderer[] = [];
        for (const data of openData.actionList) {
            const produceUnitType = data.produceUnitType;
            if (produceUnitType == null) {
                dataArray.push({
                    war,
                    actionType         : data.actionType,
                    callback           : data.callback,
                    unit               : data.unitForDrop || data.unitForLaunch,
                    costForProduceUnit : data.costForProduceUnit ?? null,
                });
            } else {
                const unitForProduce = new Units_Unit.Unit(false);
                unitForProduce.init(Units_Utils_Serialization.createDefault({
                    gridIndex   : { x : 0, y : 0 },
                    unitId      : -1,
                    unitTypeId  : produceUnitType,
                    playerIndex : war.getPlayerIndexInTurn(),
                    gcData      : gameConfig,
                }), gameConfig);
                unitForProduce.startRunning(war);

                dataArray.push({
                    war,
                    actionType         : data.actionType,
                    callback           : data.callback,
                    unit               : unitForProduce,
                    costForProduceUnit : data.costForProduceUnit ?? null,
                });
            }
        }
        dataArray[dataArray.length - 1].isLastAction = true;

        const length = dataArray.length;
        this._group.setUnscaledManualHeight(Math.min(360, length * 60 + (length - 1) * 2));
        await this._listAction.bindData(dataArray, true);
    }

    private _updatePosition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const container = openData.war.getView().getFieldContainer();
        const gridIndex = openData.destination;
        const stage     = Stages_StageManager.getStage();
        const group     = this._group;
        const point     = container.getContentsContainerLocalToGlobal({
            x : (gridIndex.getX() + 1) * getGridWidth(),
            y : (gridIndex.getY() + 1) * getGridHeight(),
        });
        group.setX(Math.max(0, Math.min(point.x, stage.stageWidth - 140)));
        group.setY(Math.max(40, Math.min(point.y, stage.stageHeight - group.getScaledHeight())));
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customScaleX : 0, customScaleY : 0 },
            endProps   : { customScaleX : 1, customScaleY : 1 },
            tweenTime  : 100,
        });

        await Timer_TimerModel.wait(100);
    }
    protected async _showCloseAnimation(): Promise<void> {
        // 为提升操作手感而屏蔽掉
        // Helpers.resetTween({
        //     obj         : this._group,
        //     beginProps  : { scaleX: 1, scaleY: 1 },
        //     endProps    : { scaleX: 0, scaleY: 0 },
        //     tweenTime   : 100,
        // });

        // await Helpers.wait(100);
    }
}

interface DataForUnitActionRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    actionType          : Units_Constants.ActionTypeId;
    callback            : () => void;
    unit?               : Units_Unit.Unit;
    costForProduceUnit  : number | null;
    isLastAction?       : boolean;
}
class UnitActionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitActionRenderer> {
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelAction!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCost!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conUnitView!      : Ui_Interfaces_IUiContainer.IUiContainer;

    private _unitView                   : Units_UnitView.UnitView | undefined;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch(undefined, false, undefined, Sounds_Constants.ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        {
            const imgSelected = this._imgSelected;
            imgSelected.setAlpha(0);
            Tween_Executor.Executor.removeTweens(imgSelected);
            Tween_Executor.Executor.get(imgSelected, { loop : true })
                .to({ customAlpha : 0.3 }, 500)
                .to({ customAlpha : 0 }, 500);
        }

        if (this._unitView == null) {
            const view      = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
            this._unitView  = view;
            this._conUnitView.addUiChild(view);

            this._updateUnitView();
        }
    }
    protected override async _onClosed(): Promise<void> {
        if (this._unitView) {
            const view = this._unitView;
            this._conUnitView.removeUiChild(view);

            Units_UnitViewPool.UnitViewPool.getInstance().release(view);
            delete this._unitView;
        }

        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getActionPlanner().checkIsStateRequesting()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
        } else {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            openData.callback();
        }
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelAction.setText(Lang_Utils.getUnitActionName(openData.actionType) || Lang_Constants.UndefinedError);

        const unit      = openData.unit;
        const labelCost = this._labelCost;
        if (unit == null) {
            labelCost.setText("");
        } else {
            if (openData.actionType !== Units_Constants.ActionTypeId.ProduceUnit) {
                labelCost.setText(``);
            } else {
                const cost = openData.costForProduceUnit;
                labelCost.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0079)}: ${cost != null ? cost : Lang_Constants.UndefinedError}`);
            }
        }

        this._updateUnitView();
    }

    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit      = openData.unit;
        const unitView  = this._unitView;
        if (unit == null) {
            unitView?.setIsVisible(false);
        } else {
            unitView?.setIsVisible(true);
            unitView?.loadViewDataFromUnit(unit, openData.war, true);
            unitView?.refreshAllViews();
        }
    }
}
