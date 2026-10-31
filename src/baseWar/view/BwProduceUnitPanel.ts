import {
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwWar,
    ActionPlanners_States_Idle,
    ActionPlanners_States_RequestingPlayerProduceUnit,
    FloatText,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Unit,
    Units_UnitView,
    Keyboard_KbManager,
    Units_Utils_Serialization,
    Notifications_Dispatcher,
    Keyboard_KbTypes,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Units_Utils_Common,
    GamePanels_Manager,
    Numbers_Utils,
    Units_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    Sounds_Constants,
    Lang_Constants,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
} from "../../internal.ts";

import type { SelfTileEnabledForUnitProduction } from "../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";

const COLUMNS = 4;

export interface OpenData {
    gridIndex   : AuxiliaryTypes_GridIndex.GridIndex;
    war         : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnitList!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDetail!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listUnit!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelNoUnit!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutFund!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFundTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFund!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "ActionPlannerStateSet",     callback : this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this._onTouchedBtnClose },
            { ui : this._btnUnitList,    callback : this._onTouchedBtnUnitList },
            { ui : this._btnDetail,      callback : this._onTouchedBtnDetail },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
        });
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            const actionPlanner = this.getOpenData()?.war.getActionPlanner();
            if (actionPlanner) {
                ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
            }
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
        this._btnClose.setShortSfxCode(Sounds_Constants.ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        Notifications_Dispatcher.dispatch("BwProduceUnitPanelOpened");
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray = this._createDataForList();
        this._labelNoUnit.setIsVisible(!dataArray.length);
        await this._listUnit.bindData(dataArray);
        this.setAndReviseSelectedUnitType(dataArray[0]?.unitType ?? null, true);
    }
    protected override async _onClosed(): Promise<void> {
        Notifications_Dispatcher.dispatch("BwProduceUnitPanelClosed");

        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    public async setAndReviseSelectedUnitType(newUnitType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, needScroll: boolean): Promise<void> {
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
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
        }
    }
    private _onTouchedBtnUnitList(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageChartPanel, {
            gameConfig : gameConfig,
        });
    }
    private _onTouchedBtnDetail(): void {
        const data = this._listUnit.getFirstSelectedData();
        if (data) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitDetailPanel, {
                unit      : data.unit,
                canDelete : false,
            });
        }
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
            const actionPlanner = this.getOpenData()?.war.getActionPlanner();
            if (actionPlanner) {
                ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
            }
            return;
        }

        const list = this._listUnit;
        {
            if ((newKeys.has(Keyboard_KbTypes.KeyCode.J)) || (newKeys.has(Keyboard_KbTypes.KeyCode.Enter))) {
                const data = list.getFirstSelectedData();
                if (data == null) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
                } else {
                    handleProduce(data);
                }
                return;
            }
        }

        if (Keyboard_KbManager.checkHasDirectionKeys(newKeys)) {
            const dataArray = list.getBoundDataArray() ?? [];
            const length    = dataArray.length;
            const index     = list.getFirstSelectedItemIndex();
            if ((length) && (index != null)) {
                const rows      = Math.ceil(length / COLUMNS);
                const currentX  = index % COLUMNS;
                const currentY  = Math.floor(index / COLUMNS);
                const offsetX   = (newKeys.has(Keyboard_KbTypes.KeyCode.A) ? -1 : 0) + (newKeys.has(Keyboard_KbTypes.KeyCode.D) ? 1 : 0);
                const offsetY   = (newKeys.has(Keyboard_KbTypes.KeyCode.W) ? -1 : 0) + (newKeys.has(Keyboard_KbTypes.KeyCode.S) ? 1 : 0);
                // const columns   = (currentY < rows - 1) ? COLUMNS : ((length - 1) % COLUMNS + 1);
                // const newX      = (currentX + columns + offsetX) % columns;
                // const newY      = (currentY + rows + offsetY) % rows;
                const newX      = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : COLUMNS - 1,
                    rawValue : currentX + offsetX,
                });
                const newY      = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : rows - 1,
                    rawValue : currentY + offsetY,
                });
                const newIndex  = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : length - 1,
                    rawValue : newX + newY * COLUMNS,
                });
                if (newIndex !== index) {
                    this.setAndReviseSelectedUnitType(dataArray[newIndex]?.unitType, true);
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelNoUnit.setLangText(Lang_Constants.TextType.B0896);
        this._labelFundTitle.setText(`${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0138, Lang_Utils.getText(Lang_Constants.TextType.Fund))}`);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0954);
        this._btnDetail.setLangText(Lang_Constants.TextType.B0267);

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
        const minNormalizedHp   = skillCfg ? Units_Utils_Common.getNormalizedHp(skillCfg.getHpLowerLimit()) : Units_Utils_Common.getNormalizedHp(Units_Constants.Hp.MaxHp);
        const dataList          : DataForUnitRenderer[] = [];

        for (const unitType of tile.getProducibleUnitTypeArrayForPlayer(playerIndex) ?? []) {
            const unit = new Units_Unit.Unit();
            unit.init(Units_Utils_Serialization.createDefault({
                gridIndex   : gridIndex.getXY(),
                unitId      : -1,
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                gcData      : gameConfig,
            }), gameConfig);
            unit.startRunning(war);

            const costModifier  = player.getUnitCostModifier(unitType);
            const cfgCost       = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
            dataList.push({
                unitType,
                currentFund,
                actionPlanner,
                gridIndex,
                unit,
                cfgCost,
                costModifier,
                unitProductionSkillCfg : skillCfg,
                minCost                : skillCfg
                    ? Math.floor(cfgCost * costModifier * minNormalizedHp * (skillCfg.getCostMultiplierPct()) / Units_Constants.Hp.Normalizer / 100)
                    : Math.floor(cfgCost * costModifier),
                panel : this,
            });
        }

        return dataList.sort(sorterForDataForList);
    }
}

function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
    return a.unitType - b.unitType;
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    unitType                : number;
    unit                    : Units_Unit.Unit;
    minCost                 : number;
    cfgCost                 : number;
    costModifier            : number;
    currentFund             : number;
    actionPlanner           : ActionPlanners_IActionPlanner.IActionPlanner;
    gridIndex               : AuxiliaryTypes_GridIndex.GridIndex;
    unitProductionSkillCfg  : SelfTileEnabledForUnitProduction | null;
    panel                   : Panel;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBottom!    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCost!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupProduce! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgProduce!   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelProduce! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView      = new Units_UnitView.UnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._imgBg,                          callback : this._onTouchedImgBg,         eventType : Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui : this._groupProduce,                   callback : this._onTouchedGroupProduce,  eventType : Helpers_PointerInput.PointerEventType.ReleaseIn },
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedUnitType(openData.unitType, false);
    }

    private _onTouchedGroupProduce(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.unitType !== openData.panel.getSelectedUnitType()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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
        labelName.setText(Lang_Utils.getUnitName(unitType, unit.getGcData()) ?? Lang_Constants.UndefinedError);
        labelName.setTextColor(isFundEnough ? 0xFFFFFF : 0x667A85);
        labelProduce.setTextColor(isFundEnough ? 0x000000 : 0xFFFFFF);
        labelProduce.setLangText(Lang_Constants.TextType.B0691);
        this._imgProduce.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._imgBottom.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._unitView.init(unit).startRunningView();
        this._layoutName.arrangeItems();
    }
}

function handleProduce(data: DataForUnitRenderer): void {
    if (data.currentFund < data.minCost) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0053));
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
        return;
    }

    if (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().BwProduceUnitPanel)) {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
        return;
    }

    const actionPlanner = data.actionPlanner;
    if (actionPlanner.checkIsStateRequesting()) {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
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
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0266, currentUnitsCount, maxUnitsCount));
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            return;
        }
    }

    const skillCfg  = data.unitProductionSkillCfg;
    const unitType  = data.unitType;
    const gridIndex = data.gridIndex;
    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
    if (!skillCfg) {
        ActionPlanners_States_RequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, Units_Constants.Hp.MaxHp);
    } else {
        const rawMinHp = skillCfg.getHpLowerLimit();
        const rawMaxHp = skillCfg.getHpUpperLimit();
        if (rawMinHp === rawMaxHp) {
            ActionPlanners_States_RequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, rawMinHp);
        } else {
            const normalizer    = Units_Constants.Hp.Normalizer;
            const minHp         = rawMinHp;
            const maxHp         = Math.min(
                rawMaxHp,
                Math.floor(data.currentFund * Units_Constants.Hp.MaxHp / (data.cfgCost * data.costModifier * (skillCfg.getCostMultiplierPct()) / 100) / normalizer) * normalizer,
            );
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
                currentValue : maxHp,
                maxValue     : maxHp,
                minValue     : minHp,
                callback     : value => {
                    ActionPlanners_States_RequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, value);
                },
            });
        }
    }
}
