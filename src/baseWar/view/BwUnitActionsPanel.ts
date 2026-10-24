import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as BaseWarModelBwTypes from "../model/BwTypes.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type IUnit              = UnitsIUnit.IUnit;

const getGridWidth      = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight     = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    destination : AuxiliaryTypesGridIndex.GridIndex;
    actionList  : BaseWarModelBwTypes.DataForUnitAction[];
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listAction!   : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitActionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.ZoomableContentsMoved,      callback: this._onNotifyZoomableContentsMoved },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
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

    private _onKeyboard(eventData: KeyboardKbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (eventData.isHandled) {
            return;
        }
        eventData.isHandled = true;

        const newKeys = eventData.newKeys;
        if ((newKeys.has(KeyboardKbTypes.KeyCode.K)) || (newKeys.has(KeyboardKbTypes.KeyCode.Escape))) {
            this.getOpenData()?.war.getActionPlanner().cancelCurrentState();
            return;
        }

        const list = this._listAction;
        if ((newKeys.has(KeyboardKbTypes.KeyCode.J)) || (newKeys.has(KeyboardKbTypes.KeyCode.Enter))) {
            const data = list.getFirstSelectedData();
            if ((data == null) || (data.war.getActionPlanner().checkIsStateRequesting())) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                data.callback();
            }

            return;
        }

        {
            const offsetIndex   = (newKeys.has(KeyboardKbTypes.KeyCode.W) ? -1 : 0) + (newKeys.has(KeyboardKbTypes.KeyCode.S) ? 1 : 0);
            const length        = list.getBoundDataArray()?.length;
            const index         = list.getFirstSelectedItemIndex();
            if ((offsetIndex !== 0) && (length != null) && (index != null) && (length > 0)) {
                list.setSelectedItemIndex((index + length + offsetIndex) % length);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
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
                    actionType          : data.actionType,
                    callback            : data.callback,
                    unit                : data.unitForDrop || data.unitForLaunch,
                    costForProduceUnit  : data.costForProduceUnit ?? null,
                });
            } else {
                const unitForProduce = new (GameHelpersGhFactory.getUnitClass())();
                unitForProduce.init(UnitsUtilsSerialization.createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitId      : -1,
                    unitTypeId  : produceUnitType,
                    playerIndex : war.getPlayerIndexInTurn(),
                    gcData      : gameConfig,
                }), gameConfig);
                unitForProduce.startRunning(war);

                dataArray.push({
                    war,
                    actionType          : data.actionType,
                    callback            : data.callback,
                    unit                : unitForProduce,
                    costForProduceUnit  : data.costForProduceUnit ?? null,
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
        const stage     = StagesStageManager.getStage();
        const group     = this._group;
        const point     = container.getContentsContainerLocalToGlobal({
            x: (gridIndex.getX() + 1) * getGridWidth(),
            y: (gridIndex.getY() + 1) * getGridHeight(),
        });
        group.setX(Math.max(0, Math.min(point.x, stage.stageWidth - 140)));
        group.setY(Math.max(40, Math.min(point.y, stage.stageHeight - group.getScaledHeight())));
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customScaleX: 0, customScaleY: 0 },
            endProps    : { customScaleX: 1, customScaleY: 1 },
            tweenTime   : 100,
        });

        await TimerTimerModel.wait(100);
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

interface DataForUnitActionRenderer extends UiTypesUiListItemData.UiListItemData {
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    actionType          : UnitsConstants.ActionTypeId;
    callback            : () => void;
    unit?               : IUnit;
    costForProduceUnit  : number | null;
    isLastAction?       : boolean;
}
class UnitActionRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitActionRenderer> {
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelAction!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCost!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conUnitView!      : UiInterfacesIUiContainer.IUiContainer;

    private readonly _unitView      = new (GameHelpersGhFactory.getUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._conUnitView.addUiChild(this._unitView);
        this._applySettingsForWholeTouch(undefined, false, undefined, SoundsConstants.ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.3 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();
        TweenExecutor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelAction.setText(LangUtils.getUnitActionName(openData.actionType) || LangConstants.UndefinedError);

        const unit      = openData.unit;
        const unitView  = this._unitView;
        const labelCost = this._labelCost;
        if (unit == null) {
            labelCost.setText("");
            unitView.setIsVisible(false);
        } else {
            if (openData.actionType !== UnitsConstants.ActionTypeId.ProduceUnit) {
                labelCost.setText(``);
            } else {
                const cost = openData.costForProduceUnit;
                labelCost.setText(`${LangUtils.getText(LangConstants.TextType.B0079)}: ${cost != null ? cost : LangConstants.UndefinedError}`);
            }
            unitView.setIsVisible(true);
            unitView.init(unit).startRunningView();
        }
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getActionPlanner().checkIsStateRequesting()) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
        } else {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
            openData.callback();
        }
    }
}
