import type { IActionPlanner } from "../../actionPlanners/IActionPlanner.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import { RequestingPlayerProduceUnit } from "../../actionPlanners/states/RequestingPlayerProduceUnit.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { show } from "../../FloatText.ts";
import { getUnitClass, getUnitViewClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, getRunningPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { PointerEventType } from "../../helpers/PointerInput.ts";
import { checkHasDirectionKeys } from "../../keyboard/KbManager.ts";
import { type EventData, KeyCode } from "../../keyboard/KbTypes.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getUnitName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import type {
    SelfTileEnabledForUnitProduction,
} from "../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { Hp } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { getNormalizedHp } from "../../units/utils/Common.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

const COLUMNS = 4;

export interface OpenData {
    gridIndex   : GridIndex;
    war         : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnUnitList!      : IUiButton;
    private readonly _btnDetail!        : IUiButton;

    private readonly _listUnit!         : IUiScrollList<DataForUnitRenderer>;
    private readonly _labelNoUnit!      : IUiLabel;

    private readonly _layoutFund!       : IUiLayout;
    private readonly _labelFundTitle!   : IUiLabel;
    private readonly _labelFund!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
            { ui: this._btnUnitList,    callback: this._onTouchedBtnUnitList },
            { ui: this._btnDetail,      callback: this._onTouchedBtnDetail },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
        });
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            const actionPlanner = this.getOpenData()?.war.getActionPlanner();
            if (actionPlanner) {
                Idle.getInstance().apply(actionPlanner);
            }
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
        this._btnClose.setShortSfxCode(ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        dispatch(TypeId.BwProduceUnitPanelOpened);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray = this._createDataForList();
        this._labelNoUnit.setIsVisible(!dataArray.length);
        await this._listUnit.bindData(dataArray);
        this.setAndReviseSelectedUnitType(dataArray[0]?.unitType ?? null, true);
    }
    protected override async _onClosed(): Promise<void> {
        dispatch(TypeId.BwProduceUnitPanelClosed);

        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    public async setAndReviseSelectedUnitType(newUnitType: Undefinable<number>, needScroll: boolean): Promise<void> {
        const listUnit  = this._listUnit;
        const index     = listUnit.getRevisedFirstIndex(v => v?.unitType === newUnitType);
        if (index != null) {
            listUnit.setSelectedItemIndex(index);

            if (needScroll) {
                listUnit.scrollToItem(index);
            }
        }

        this._updateLabelFund();
    }
    public getSelectedUnitType(): number | null {
        return this._listUnit.getFirstSelectedData()?.unitType ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        this.closePanel();
    }

    private _onTouchedBtnClose(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner) {
            Idle.getInstance().apply(actionPlanner);
        }
    }
    private _onTouchedBtnUnitList(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        openPanel(getDict().CommonDamageChartPanel, {
            gameConfig  : gameConfig,
        });
    }
    private _onTouchedBtnDetail(): void {
        const data = this._listUnit.getFirstSelectedData();
        if (data) {
            openPanel(getDict().BwUnitDetailPanel, {
                unit        : data.unit,
                canDelete   : false,
            });
        }
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
            const actionPlanner = this.getOpenData()?.war.getActionPlanner();
            if (actionPlanner) {
                Idle.getInstance().apply(actionPlanner);
            }
            return;
        }

        const list = this._listUnit;
        {
            if ((newKeys.has(KeyCode.J)) || (newKeys.has(KeyCode.Enter))) {
                const data = list.getFirstSelectedData();
                if (data == null) {
                    playShortSfx(ShortSfxCode.ButtonForbidden01);
                } else {
                    handleProduce(data);
                }
                return;
            }
        }

        if (checkHasDirectionKeys(newKeys)) {
            const dataArray = list.getBoundDataArray() ?? [];
            const length    = dataArray.length;
            const index     = list.getFirstSelectedItemIndex();
            if ((length) && (index != null)) {
                const rows      = Math.ceil(length / COLUMNS);
                const currentX  = index % COLUMNS;
                const currentY  = Math.floor(index / COLUMNS);
                const offsetX   = (newKeys.has(KeyCode.A) ? -1 : 0) + (newKeys.has(KeyCode.D) ? 1 : 0);
                const offsetY   = (newKeys.has(KeyCode.W) ? -1 : 0) + (newKeys.has(KeyCode.S) ? 1 : 0);
                // const columns   = (currentY < rows - 1) ? COLUMNS : ((length - 1) % COLUMNS + 1);
                // const newX      = (currentX + columns + offsetX) % columns;
                // const newY      = (currentY + rows + offsetY) % rows;
                const newX      = getValueInRange({
                    minValue    : 0,
                    maxValue    : COLUMNS - 1,
                    rawValue    : currentX + offsetX,
                });
                const newY      = getValueInRange({
                    minValue    : 0,
                    maxValue    : rows - 1,
                    rawValue    : currentY + offsetY,
                });
                const newIndex  = getValueInRange({
                    minValue    : 0,
                    maxValue    : length - 1,
                    rawValue    : newX + newY * COLUMNS,
                });
                if (newIndex !== index) {
                    this.setAndReviseSelectedUnitType(dataArray[newIndex]?.unitType, true);
                    playShortSfx(ShortSfxCode.CursorMove01);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelNoUnit.setText(getText(TextType.B0896));
        this._labelFundTitle.setText(`${getFormattedText(TextType.F0138, getText(TextType.Fund))}`);
        this._labelTitle.setText(getText(TextType.B0954));
        this._btnDetail.setText(getText(TextType.B0267));

        this._layoutFund.arrangeItems();
    }

    private _updateLabelFund(): void {
        const minCost   = this._listUnit.getFirstSelectedData()?.minCost;
        const labelFund = this._labelFund;
        if (minCost == null) {
            labelFund.setText(`--`);
        } else {
            const fund = this.getOpenData()?.war.getPlayerInTurn().getFund();
            labelFund.setText(`${fund} - ${minCost} = ${(fund ?? 0) - minCost}`);
        }
        this._layoutFund.arrangeItems();
    }

    private _createDataForList(): DataForUnitRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const war               = openData.war;
        const gridIndex         = openData.gridIndex;
        const gameConfig        = war.getGcData();
        const tile              = war.getTileMap().getTile(gridIndex);
        const player            = tile.getPlayer();
        const currentFund       = player.getFund();
        const playerIndex       = player.getPlayerIndex();
        const actionPlanner     = war.getActionPlanner();
        const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex) ?? null;
        const minNormalizedHp   = skillCfg ? getNormalizedHp(skillCfg.getHpLowerLimit() ?? 0) : getNormalizedHp(Hp.MaxHp);
        const dataList          : DataForUnitRenderer[] = [];

        for (const unitType of tile.getProducibleUnitTypeArrayForPlayer(playerIndex) ?? []) {
            const unit = new (getUnitClass())();
            unit.init(createDefault({
                gridIndex   : gridIndex.getXY(),
                unitId      : -1,
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                gcData      : gameConfig,
            }), gameConfig);
            unit.startRunning(war);

            const costModifier  = player.getUnitCostModifier(unitType);
            const cfgCost       = getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
            dataList.push({
                unitType,
                currentFund,
                actionPlanner,
                gridIndex,
                unit,
                cfgCost,
                costModifier,
                unitProductionSkillCfg  : skillCfg,
                minCost                 : skillCfg
                    ? Math.floor(cfgCost * costModifier * minNormalizedHp * (skillCfg.getCostMultiplierPct() ?? 0) / Hp.Normalizer / 100)
                    : Math.floor(cfgCost * costModifier),
                panel   : this,
            });
        }

        return dataList.sort(sorterForDataForList);
    }
}

function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
    return a.unitType - b.unitType;
}

interface DataForUnitRenderer extends UiListItemData {
    unitType                : number;
    unit                    : IUnit;
    minCost                 : number;
    cfgCost                 : number;
    costModifier            : number;
    currentFund             : number;
    actionPlanner           : IActionPlanner;
    gridIndex               : GridIndex;
    unitProductionSkillCfg  : SelfTileEnabledForUnitProduction | null;
    panel                   : Panel;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _conUnitView!  : IUiContainer;
    private readonly _imgBottom!    : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelName!    : IUiLabel;
    private readonly _labelCost!    : IUiLabel;

    private readonly _groupProduce! : IUiContainer;
    private readonly _imgProduce!   : IUiImage;
    private readonly _labelProduce! : IUiLabel;

    private readonly _unitView      = new (getUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._imgBg,                          callback: this._onTouchedImgBg,         eventType: PointerEventType.ReleaseIn },
            { ui: this._groupProduce,                   callback: this._onTouchedGroupProduce,  eventType: PointerEventType.ReleaseIn },
        ]);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgBg(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedUnitType(openData.unitType, false);
    }

    private _onTouchedGroupProduce(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.unitType !== openData.panel.getSelectedUnitType()) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            openData.panel.setAndReviseSelectedUnitType(openData.unitType, false);

            return;
        }

        handleProduce(openData);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitType      = openData.unitType;
        const isFundEnough  = openData.currentFund >= openData.minCost;
        const labelCost     = this._labelCost;
        const labelName     = this._labelName;
        const labelProduce  = this._labelProduce;
        const unit          = openData.unit;
        labelCost.setText(`${openData.minCost}G`);
        labelCost.setTextColor(isFundEnough ? 0xFFFFFF : 0x667A85);
        labelName.setText(getUnitName(unitType, unit.getGcData()) ?? UndefinedError);
        labelName.setTextColor(isFundEnough ? 0xFFFFFF : 0x667A85);
        labelProduce.setTextColor(isFundEnough ? 0x000000 : 0xFFFFFF);
        labelProduce.setText(getText(TextType.B0691));
        this._imgProduce.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._imgBottom.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._unitView.init(unit).startRunningView();
        this._layoutName.arrangeItems();
    }
}

function handleProduce(data: DataForUnitRenderer): void {
    if (data.currentFund < data.minCost) {
        show(getText(TextType.B0053));
        playShortSfx(ShortSfxCode.ButtonForbidden01);
        return;
    }

    if (!getRunningPanel(getDict().BwProduceUnitPanel)) {
        playShortSfx(ShortSfxCode.ButtonForbidden01);
        return;
    }

    const actionPlanner = data.actionPlanner;
    if (actionPlanner.checkIsStateRequesting()) {
        playShortSfx(ShortSfxCode.ButtonForbidden01);
        return;
    }

    {
        const war               = actionPlanner.getWar();
        const playerIndex       = war.getPlayerInTurn().getPlayerIndex();
        const currentUnitsCount = war.getUnitMap().countAllUnitsForPlayer(playerIndex);
        const maxUnitsCount     = war.getCommonSettingManager()
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndex)
            ?.getMaxUnitsCount();
        if ((maxUnitsCount != null) && (currentUnitsCount >= maxUnitsCount)) {
            show(getFormattedText(TextType.F0266, currentUnitsCount, maxUnitsCount));
            playShortSfx(ShortSfxCode.ButtonForbidden01);
            return;
        }
    }

    const skillCfg  = data.unitProductionSkillCfg;
    const unitType  = data.unitType;
    const gridIndex = data.gridIndex;
    playShortSfx(ShortSfxCode.ButtonConfirm01);
    if (!skillCfg) {
        RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, Hp.MaxHp);
    } else {
        const rawMinHp = skillCfg.getHpLowerLimit() ?? 0;
        const rawMaxHp = skillCfg.getHpUpperLimit() ?? 0;
        if (rawMinHp === rawMaxHp) {
            RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, rawMinHp);
        } else {
            const normalizer    = Hp.Normalizer;
            const minHp         = rawMinHp;
            const maxHp         = Math.min(
                rawMaxHp,
                Math.floor(data.currentFund * Hp.MaxHp / (data.cfgCost * data.costModifier * (skillCfg.getCostMultiplierPct() ?? 0) / 100) / normalizer) * normalizer
            );
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.Hp),
                currentValue    : maxHp,
                maxValue        : maxHp,
                minValue        : minHp,
                callback        : value => {
                    RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, value);
                },
            });
        }
    }
}
