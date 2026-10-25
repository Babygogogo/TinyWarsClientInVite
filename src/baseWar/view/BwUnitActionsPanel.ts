import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { DataForUnitAction } from "../model/BwTypes.ts";
import { getUnitClass, getUnitViewClass } from "../../gameHelpers/GhFactory.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import { createLazyFunc } from "../../helpers/Misc.ts";
import { type EventData, KeyCode } from "../../keyboard/KbTypes.ts";
import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { getUnitActionName, getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getStage } from "../../stages/StageManager.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { ActionTypeId } from "../../units/Constants.ts";
import type { IUnit as UnitsIUnit } from "../../units/IUnit.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

type IUnit              = UnitsIUnit;

const getGridWidth      = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight     = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war         : IBwWar;
    destination : GridIndex;
    actionList  : DataForUnitAction[];
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!        : IUiContainer;
    private readonly _listAction!   : IUiScrollList<DataForUnitActionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.ZoomableContentsMoved,      callback: this._onNotifyZoomableContentsMoved },
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

    private _onKeyboard(eventData: EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (eventData.isHandled) {
            return;
        }
        eventData.isHandled = true;

        const newKeys = eventData.newKeys;
        if ((newKeys.has(KeyCode.K)) || (newKeys.has(KeyCode.Escape))) {
            this.getOpenData()?.war.getActionPlanner().cancelCurrentState();
            return;
        }

        const list = this._listAction;
        if ((newKeys.has(KeyCode.J)) || (newKeys.has(KeyCode.Enter))) {
            const data = list.getFirstSelectedData();
            if ((data == null) || (data.war.getActionPlanner().checkIsStateRequesting())) {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            } else {
                playShortSfx(ShortSfxCode.CursorConfirm01);
                data.callback();
            }

            return;
        }

        {
            const offsetIndex   = (newKeys.has(KeyCode.W) ? -1 : 0) + (newKeys.has(KeyCode.S) ? 1 : 0);
            const length        = list.getBoundDataArray()?.length;
            const index         = list.getFirstSelectedItemIndex();
            if ((offsetIndex !== 0) && (length != null) && (index != null) && (length > 0)) {
                list.setSelectedItemIndex((index + length + offsetIndex) % length);
                playShortSfx(ShortSfxCode.CursorMove01);
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
                const unitForProduce = new (getUnitClass())();
                unitForProduce.init(createDefault({
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
        const stage     = getStage();
        const group     = this._group;
        const point     = container.getContentsContainerLocalToGlobal({
            x: (gridIndex.getX() + 1) * getGridWidth(),
            y: (gridIndex.getY() + 1) * getGridHeight(),
        });
        group.setX(Math.max(0, Math.min(point.x, stage.stageWidth - 140)));
        group.setY(Math.max(40, Math.min(point.y, stage.stageHeight - group.getScaledHeight())));
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customScaleX: 0, customScaleY: 0 },
            endProps    : { customScaleX: 1, customScaleY: 1 },
            tweenTime   : 100,
        });

        await wait(100);
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

interface DataForUnitActionRenderer extends UiListItemData {
    war                 : IBwWar;
    actionType          : ActionTypeId;
    callback            : () => void;
    unit?               : IUnit;
    costForProduceUnit  : number | null;
    isLastAction?       : boolean;
}
class UnitActionRenderer extends UiListItemRenderer<DataForUnitActionRenderer> {
    private readonly _imgSelected!      : IUiImage;
    private readonly _labelAction!      : IUiLabel;
    private readonly _labelCost!        : IUiLabel;
    private readonly _conUnitView!      : IUiContainer;

    private readonly _unitView      = new (getUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._conUnitView.addUiChild(this._unitView);
        this._applySettingsForWholeTouch(undefined, false, undefined, ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.3 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();
        Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelAction.setText(getUnitActionName(openData.actionType) || UndefinedError);

        const unit      = openData.unit;
        const unitView  = this._unitView;
        const labelCost = this._labelCost;
        if (unit == null) {
            labelCost.setText("");
            unitView.setIsVisible(false);
        } else {
            if (openData.actionType !== ActionTypeId.ProduceUnit) {
                labelCost.setText(``);
            } else {
                const cost = openData.costForProduceUnit;
                labelCost.setText(`${getText(TextType.B0079)}: ${cost != null ? cost : UndefinedError}`);
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
            playShortSfx(ShortSfxCode.ButtonForbidden01);
        } else {
            playShortSfx(ShortSfxCode.CursorConfirm01);
            openData.callback();
        }
    }
}
