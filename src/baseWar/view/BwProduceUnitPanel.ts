import type * as ActionPlannersIActionPlanner from "../../actionPlanners/IActionPlanner.ts";
import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import * as ActionPlannersStatesRequestingPlayerProduceUnit from "../../actionPlanners/states/RequestingPlayerProduceUnit.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as KeyboardKbManager from "../../keyboard/KbManager.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction from "../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type IActionPlanner     = ActionPlannersIActionPlanner.IActionPlanner;
type IUnit              = UnitsIUnit.IUnit;

const COLUMNS = 4;

export interface OpenData {
    gridIndex   : AuxiliaryTypesGridIndex.GridIndex;
    war         : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnitList!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDetail!        : UiInterfacesIUiButton.IUiButton;

    private readonly _listUnit!         : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelNoUnit!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutFund!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFundTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFund!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
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
                ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
            }
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
        this._btnClose.setShortSfxCode(SoundsConstants.ShortSfxCode.None);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwProduceUnitPanelOpened);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray = this._createDataForList();
        this._labelNoUnit.setIsVisible(!dataArray.length);
        await this._listUnit.bindData(dataArray);
        this.setAndReviseSelectedUnitType(dataArray[0]?.unitType ?? null, true);
    }
    protected override async _onClosed(): Promise<void> {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwProduceUnitPanelClosed);

        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    public async setAndReviseSelectedUnitType(newUnitType: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, needScroll: boolean): Promise<void> {
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
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
        }
    }
    private _onTouchedBtnUnitList(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageChartPanel, {
            gameConfig  : gameConfig,
        });
    }
    private _onTouchedBtnDetail(): void {
        const data = this._listUnit.getFirstSelectedData();
        if (data) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitDetailPanel, {
                unit        : data.unit,
                canDelete   : false,
            });
        }
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
            const actionPlanner = this.getOpenData()?.war.getActionPlanner();
            if (actionPlanner) {
                ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
            }
            return;
        }

        const list = this._listUnit;
        {
            if ((newKeys.has(KeyboardKbTypes.KeyCode.J)) || (newKeys.has(KeyboardKbTypes.KeyCode.Enter))) {
                const data = list.getFirstSelectedData();
                if (data == null) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
                } else {
                    handleProduce(data);
                }
                return;
            }
        }

        if (KeyboardKbManager.checkHasDirectionKeys(newKeys)) {
            const dataArray = list.getBoundDataArray() ?? [];
            const length    = dataArray.length;
            const index     = list.getFirstSelectedItemIndex();
            if ((length) && (index != null)) {
                const rows      = Math.ceil(length / COLUMNS);
                const currentX  = index % COLUMNS;
                const currentY  = Math.floor(index / COLUMNS);
                const offsetX   = (newKeys.has(KeyboardKbTypes.KeyCode.A) ? -1 : 0) + (newKeys.has(KeyboardKbTypes.KeyCode.D) ? 1 : 0);
                const offsetY   = (newKeys.has(KeyboardKbTypes.KeyCode.W) ? -1 : 0) + (newKeys.has(KeyboardKbTypes.KeyCode.S) ? 1 : 0);
                // const columns   = (currentY < rows - 1) ? COLUMNS : ((length - 1) % COLUMNS + 1);
                // const newX      = (currentX + columns + offsetX) % columns;
                // const newY      = (currentY + rows + offsetY) % rows;
                const newX      = NumbersUtils.getValueInRange({
                    minValue    : 0,
                    maxValue    : COLUMNS - 1,
                    rawValue    : currentX + offsetX,
                });
                const newY      = NumbersUtils.getValueInRange({
                    minValue    : 0,
                    maxValue    : rows - 1,
                    rawValue    : currentY + offsetY,
                });
                const newIndex  = NumbersUtils.getValueInRange({
                    minValue    : 0,
                    maxValue    : length - 1,
                    rawValue    : newX + newY * COLUMNS,
                });
                if (newIndex !== index) {
                    this.setAndReviseSelectedUnitType(dataArray[newIndex]?.unitType, true);
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelNoUnit.setText(LangUtils.getText(LangConstants.TextType.B0896));
        this._labelFundTitle.setText(`${LangUtils.getFormattedText(LangConstants.TextType.F0138, LangUtils.getText(LangConstants.TextType.Fund))}`);
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0954));
        this._btnDetail.setText(LangUtils.getText(LangConstants.TextType.B0267));

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
        const minNormalizedHp   = skillCfg ? UnitsUtilsCommon.getNormalizedHp(skillCfg.getHpLowerLimit() ?? 0) : UnitsUtilsCommon.getNormalizedHp(UnitsConstants.Hp.MaxHp);
        const dataList          : DataForUnitRenderer[] = [];

        for (const unitType of tile.getProducibleUnitTypeArrayForPlayer(playerIndex) ?? []) {
            const unit = new (GameHelpersGhFactory.getUnitClass())();
            unit.init(UnitsUtilsSerialization.createDefault({
                gridIndex   : gridIndex.getXY(),
                unitId      : -1,
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                gcData      : gameConfig,
            }), gameConfig);
            unit.startRunning(war);

            const costModifier  = player.getUnitCostModifier(unitType);
            const cfgCost       = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
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
                    ? Math.floor(cfgCost * costModifier * minNormalizedHp * (skillCfg.getCostMultiplierPct() ?? 0) / UnitsConstants.Hp.Normalizer / 100)
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

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    unitType                : number;
    unit                    : IUnit;
    minCost                 : number;
    cfgCost                 : number;
    costModifier            : number;
    currentFund             : number;
    actionPlanner           : IActionPlanner;
    gridIndex               : AuxiliaryTypesGridIndex.GridIndex;
    unitProductionSkillCfg  : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction.SelfTileEnabledForUnitProduction | null;
    panel                   : Panel;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBottom!    : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCost!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupProduce! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgProduce!   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelProduce! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView      = new (GameHelpersGhFactory.getUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._imgBg,                          callback: this._onTouchedImgBg,         eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupProduce,                   callback: this._onTouchedGroupProduce,  eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedUnitType(openData.unitType, false);
    }

    private _onTouchedGroupProduce(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.unitType !== openData.panel.getSelectedUnitType()) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        labelName.setText(LangUtils.getUnitName(unitType, unit.getGcData()) ?? LangConstants.UndefinedError);
        labelName.setTextColor(isFundEnough ? 0xFFFFFF : 0x667A85);
        labelProduce.setTextColor(isFundEnough ? 0x000000 : 0xFFFFFF);
        labelProduce.setText(LangUtils.getText(LangConstants.TextType.B0691));
        this._imgProduce.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._imgBottom.loadSource(isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`);
        this._unitView.init(unit).startRunningView();
        this._layoutName.arrangeItems();
    }
}

function handleProduce(data: DataForUnitRenderer): void {
    if (data.currentFund < data.minCost) {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.B0053));
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
        return;
    }

    if (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().BwProduceUnitPanel)) {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
        return;
    }

    const actionPlanner = data.actionPlanner;
    if (actionPlanner.checkIsStateRequesting()) {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
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
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0266, currentUnitsCount, maxUnitsCount));
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            return;
        }
    }

    const skillCfg  = data.unitProductionSkillCfg;
    const unitType  = data.unitType;
    const gridIndex = data.gridIndex;
    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
    if (!skillCfg) {
        ActionPlannersStatesRequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, UnitsConstants.Hp.MaxHp);
    } else {
        const rawMinHp = skillCfg.getHpLowerLimit() ?? 0;
        const rawMaxHp = skillCfg.getHpUpperLimit() ?? 0;
        if (rawMinHp === rawMaxHp) {
            ActionPlannersStatesRequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, rawMinHp);
        } else {
            const normalizer    = UnitsConstants.Hp.Normalizer;
            const minHp         = rawMinHp;
            const maxHp         = Math.min(
                rawMaxHp,
                Math.floor(data.currentFund * UnitsConstants.Hp.MaxHp / (data.cfgCost * data.costModifier * (skillCfg.getCostMultiplierPct() ?? 0) / 100) / normalizer) * normalizer
            );
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.Hp),
                currentValue    : maxHp,
                maxValue        : maxHp,
                minValue        : minHp,
                callback        : value => {
                    ActionPlannersStatesRequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner, gridIndex, unitType, value);
                },
            });
        }
    }
}
