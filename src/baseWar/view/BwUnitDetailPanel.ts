import {
    type Notifications_Mapping,
    AuxiliaryTypes_DamageCalculatorPlayerData,
    Common_Model_CommonModel,
    ForceSkins_Utils,
    ActionPlanners_States_Idle,
    MultiPlayerWar_Model_MpwWar,
    ActionPlanners_States_RequestingPlayerDeleteUnit,
    FloatText,
    CoSkills_Constants,
    ForceSkins_Constants,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    Ui_Components_UiTileView,
    Ui_Components_UiUnitView,
    Units_Unit,
    Common_View_CommonDamageCalculatorPanel,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    GamePanels_Manager,
    Helpers_Misc,
    Helpers_Collection,
    Locations_Utils,
    Notifications_Dispatcher,
    Lang_Utils,
    GamePanels_Dict,
    Turns_Constants,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Tiles_Constants_Common,
    GameVersions_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Types_UiUnitViewData,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Constants,
    WarTypes_Utils,
    Units_Utils_Serialization,
    Units_Utils_Common,
    Users_Model,
    WarTypes_Constants,
    type Egret_Egret,
    type Units_IUnit,
} from "../../internal.ts";

import { GridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";

 
const enum UnitInfoType {
    Hp,
    ProductionCost,
    EnergyPerNormalizedHp,
    Movement,
    Fuel,
    Promotion,
    AttackRange,
    Vision,
    PrimaryWeaponAmmo,
    FlareAmmo,
    BuildMaterial,
    ProduceMaterial,
    ActionState,
    IsDiving,
    IsCoOnboard,
    LoadUnit,
    Tag,
    AiMode,
    AiWeightedDestination,
    ForbiddenLocations,
    Buff,
}

export interface OpenData {
    unit        : Units_IUnit.IUnit;
    canDelete   : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutName!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyName!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _conUnitView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnUnitsInfo!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDamageCalculator!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDamage!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupDamageTitle!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listInfo!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _layoutOffense!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelOffense!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub1!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutDefense!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefense!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub2!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMoveCost!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupMoveCostTitle!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMoveCost!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();
    private _isShowDamage                   = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "UnitAnimationTick",           callback : this._onNotifyUnitAnimationTick },
            { type : "StateIndicatorTick",          callback : this._onNotifyUnitStateIndicatorTick },
            { type : "ActionPlannerStateSet",     callback : this._onNotifyBwPlannerStateChanged },
            { type : "BwUnitBuffChanged",           callback : this._onNotifyBwUnitBuffChanged },
            { type : "BwUnitCustomNameIdChanged",   callback : this._onNotifyUnitCustomNameIdChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnModifyName,          callback : this._onTouchedBtnModifyName },
            { ui : this._btnUnitsInfo,           callback : this._onTouchedBtnUnitsInfo },
            { ui : this._btnDamageCalculator,    callback : this._onTouchedBtnDamageCalculator },
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnDelete,              callback : this._onTouchedBtnDelete },
            { ui : this._groupDamageTitle,       callback : this._onTouchedGroupDamageTitle },
            { ui : this._groupMoveCostTitle,     callback : this._onTouchedGroupMoveCostTitle },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listDamageChart.setItemRendererClass(DamageRenderer);
        this._listInfo.setItemRendererClass(InfoRenderer);
        this._listMoveCost.setItemRendererClass(MoveCostRenderer);
        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listDamageChart.removeAllItems(),
            this._listInfo.removeAllItems(),
            this._listMoveCost.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        // this.close();
    }

    private _onNotifyBwUnitBuffChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwUnitBuffChanged"]>): void {
        if ((Helpers_Misc.getExisted(e.data)).unit === this.getOpenData()?.unit) {
            this.updateUnitView();
            this._updateListInfo();
        }
    }

    private _onNotifyUnitCustomNameIdChanged(): void {
        this._updateLabelName();
    }

    private _onTouchedBtnModifyName(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const war = unit.getWar();
        if (!war.getCanCheat()) {
            return;
        }

        const arr = war.getUnitMap().getUnitCustomNameArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1433),
            availableNumberArray : Helpers_Collection.createRange(0, Units_Constants.CustomName.MaxId + 1, 1),
            currentNumber        : unit.getCustomNameId(),
            columnsCount         : 4,
            showNumber           : true,
            getNumberMainText    : num => {
                if (num === 0) {
                    return `(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`;
                } else {
                    return Lang_Utils.getLanguageText({ textArray : arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeUnitCustomNameListPanel, { war : war });
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm : num => unit.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnUnitsInfo(): void {
        const gameConfig = this.getOpenData()?.unit.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageChartPanel, {
            gameConfig : gameConfig,
        });
        this.closePanel();
    }
    private _onTouchedBtnDamageCalculator(): void {
        const attackerUnit = this.getOpenData()?.unit;
        if (attackerUnit == null) {
            return;
        }

        const attackerPlayerIndex   = attackerUnit.getPlayerIndex();
        const attackerPlayer        = attackerUnit.getPlayer();
        const attackerGridIndex     = attackerUnit.getGridIndex();
        const war                   = attackerUnit.getWar();
        const tileMap               = war.getTileMap();
        const gameConfig            = war.getGcData();
        const commonSettingsManager = war.getCommonSettingManager();
        const hasFog                = war.getFogMap().checkHasFogCurrently();
        const attackerTile          = tileMap.getTile(attackerGridIndex);
        const allTiles              = tileMap.getAllTiles();
        const allCities             = allTiles.filter(v => v.getTileTypeId() === Tiles_Constants_Common.TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === Tiles_Constants_Common.TileTypeId.CommandTower);
        const defenderData          = Common_View_CommonDamageCalculatorPanel.Panel.createDefaultPlayerData(gameConfig);
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
        const playerRule            = commonSettingsManager.getPlayerRule(attackerPlayerIndex);
        const getIsAffectedByCo1    = Helpers_Misc.createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType : true,
            data                 : {
                gameConfig   : war.getGcData(),
                weatherType  : war.getWeatherManager().getCurrentWeatherType(),
                attackerData : new AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId        : attackerPlayer.getCoId(),
                    coSkillType : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? attackerPlayer.getCoUsingSkillType()
                        : (getIsAffectedByCo1() ? CoSkills_Constants.SkillTypeId.Passive : null),
                    unitType               : attackerUnit.getUnitType(),
                    unitHp                 : attackerUnit.getCurrentHp(),
                    unitWeaponType         : null,
                    unitPromotion          : attackerUnit.getCurrentPromotion(),
                    tileType               : attackerTile.getTileTypeId(),
                    tileCustomBuildingData : attackerTile.getCustomBuildingData(),
                    towersCount            : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                    offenseBonus           : playerRule.getAttackPowerModifier(),
                    defenseBonus           : playerRule.getDefenseModifier(),
                    upperLuck              : playerRule.getLuckUpperLimit(),
                    lowerLuck              : playerRule.getLuckLowerLimit(),
                    hasPrimaryAmmo         : !!attackerUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard              : attackerUnit.getIsCoOnboard(),
                    fund                   : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                    citiesCount            : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
                }),
                defenderData,
            },
        });
        this.closePanel();
    }

    private _onTouchedBtnDelete(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const war = unit.getWar();
        if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
            return;
        }

        const unitMap   = war.getUnitMap();
        const gridIndex = unit.getGridIndex();
        if (war.getCanCheat()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0029),
                callback   : () => {
                    if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
                        return;
                    }

                    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
                        unitMap.removeUnitLoaded(u.getUnitId()).stopRunning();
                    }
                    if (unit.getLoaderUnitId() == null) {
                        unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
                    } else {
                        unitMap.removeUnitLoaded(unit.getUnitId()).stopRunning();
                    }

                    if (unit.getIsCoOnboard()) {
                        war.getTileMap().getView().updateCoZone();
                    }

                    unit.getLoaderUnit()?.updateView();
                    ActionPlanners_States_Idle.Idle.getInstance().apply(war.getActionPlanner());
                    Notifications_Dispatcher.dispatch("BwUnitChanged", { gridIndex });

                    this.closePanel();
                },
            });

        } else {
            if (unit.getActionState() !== Units_Constants.ActionStateId.Idle) {
                FloatText.showLang(Lang_Constants.TextType.A0985);
                return;
            }

            if (unit.getLoaderUnitId() != null) {
                FloatText.showLang(Lang_Constants.TextType.A0986);
                return;
            }

            const playerInTurn = war.getPlayerInTurn();
            if (playerInTurn.getUserId() !== Users_Model.getSelfUserId()) {
                FloatText.showLang(Lang_Constants.TextType.A0987);
                return;
            }

            const playerIndex = unit.getPlayerIndex();
            if (playerIndex !== playerInTurn.getPlayerIndex()) {
                FloatText.showLang(Lang_Constants.TextType.A0988);
                return;
            }

            if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0076));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if ((unitMap.getUnitOnMap(gridIndex) !== unit)                                      ||
                (war.getTurnManager().getPhaseCode() !== Turns_Constants.PhaseCode.Main)      ||
                (actionPlanner.checkIsStateRequesting())                                        ||
                (actionPlanner.getStateId() === ActionPlanners_Constants.StateId.ExecutingAction)
            ) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if ((war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) ||
                (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar)
            ) {
                actionPlanner.cancelCurrentState();
                war.getCursor().setGridIndex(gridIndex);

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0081),
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0029),
                    callback   : () => {
                        ActionPlanners_States_RequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(actionPlanner);
                        this.closePanel();
                    },
                });

            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }
        }
    }

    private _onTouchedGroupDamageTitle(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = true;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this.updateUnitView();
        this._updateLabelName();
        this._updateBtnModifyName();
        this._updateGroupDamage();
        this._updateGroupMoveCost();
        this._updateListInfo();
        this._updateButtons();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0423);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0081);
        this._labelOffense.setLangText(Lang_Constants.TextType.B0694);
        this._labelDefense.setLangText(Lang_Constants.TextType.B0695);
        this._labelMain1.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub1.setLangText(Lang_Constants.TextType.B0693);
        this._labelMain2.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub2.setLangText(Lang_Constants.TextType.B0693);
        this._labelMoveCostTitle1.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCost1.setLangText(Lang_Constants.TextType.B1282);
        this._labelMoveCost2.setLangText(Lang_Constants.TextType.B1282);

        this._layoutOffense.arrangeItems();
        this._layoutDefense.arrangeItems();
        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
    }

    private async _updateGroupDamage(): Promise<void> {
        const group = this._groupDamage;
        if (!this._isShowDamage) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listDamageChart.bindData(this._createDataForListDamageChart(), true);
        }
    }

    private async _updateGroupMoveCost(): Promise<void> {
        const group = this._groupMoveCost;
        if (this._isShowDamage) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listMoveCost.bindData(this._createDataForListMoveCost(), true);
        }
    }

    public updateUnitView(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const unitData = unit.serialize();
        unitData.setGridIndex(GridIndex.fromJson({ x : 0, y : 0 }));

        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : unit.getGcData(),
            skinId           : unit.getSkinId(),
            overridingSkinId : ForceSkins_Utils.getRawOverridingSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitData         : unitData,
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _updateLabelName(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const languageType1 = Lang_Utils.getCurrentLanguageType();
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        const customName    = unit.getCustomName(languageType1);
        const customName1   = unit.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? Lang_Constants.UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const unitType      = unit.getUnitType();
            const gameConfig    = unit.getGcData();
            labelName.setText(Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError);
            labelName1.setText(Lang_Utils.getUnitName(unitType, gameConfig, languageType2) ?? Lang_Constants.UndefinedError);
        }
        this._layoutName.arrangeItems();
    }

    private _updateBtnModifyName(): void {
        this._btnModifyName.setIsVisible(!!this.getOpenData()?.unit.getWar().getCanCheat());
    }

    private async _updateListInfo(): Promise<void> {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const war       = unit.getWar();
        const dataArray : DataForInfoRenderer[] = Helpers_Collection.getNonNullElements([
            this._createInfoHp(war, unit),
            this._createInfoProductionCost(war, unit),
            this._createInfoEnergyPerNormalizedHp(war, unit),
            this._createInfoMovement(war, unit),
            this._createInfoFuel(war, unit),
            this._createInfoPromotion(war, unit),
            this._createInfoAttackRange(war, unit),
            this._createInfoVision(war, unit),
            this._createInfoPrimaryWeaponAmmo(war, unit),
            this._createInfoBuildMaterial(war, unit),
            this._createInfoProduceMaterial(war, unit),
            this._createInfoFlareAmmo(war, unit),
            this._createInfoActionState(war, unit),
            this._createInfoDiving(war, unit),
            this._createInfoIsCoOnboard(war, unit),
            this._createInfoLoadUnit(war, unit),
            this._createInfoTag(war, unit),
            this._createInfoAiMode(war, unit),
            this._createInfoAiWeightedDestination(war, unit),
            this._createInfoForbiddenLocation(war, unit),
            this._createInfoForBuff(war, unit),
        ]);
        let index = 0;
        for (const data of dataArray) {
            data.index = index++;
        }

        await this._listInfo.bindData(dataArray);
    }

    private _updateButtons(): void {
        this._btnDelete.setIsVisible(!!this.getOpenData()?.canDelete);
    }

    private _createInfoHp(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Hp,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoProductionCost(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.ProductionCost,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoEnergyPerNormalizedHp(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== GameVersions_Constants.TypeName.Test) &&
            (gameVersion !== GameVersions_Constants.TypeName.Trilogy)
        ) {
            return null;
        } else {
            return {
                index    : 0,
                infoType : UnitInfoType.EnergyPerNormalizedHp,
                war      : war,
                unit     : unit,
                panel    : this,
            };
        }
    }
    private _createInfoMovement(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Movement,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoFuel(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Fuel,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoPromotion(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Promotion,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoAttackRange(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getMinAttackRange() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.AttackRange,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoVision(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Vision,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoPrimaryWeaponAmmo(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getPrimaryWeaponMaxAmmo() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.PrimaryWeaponAmmo,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoBuildMaterial(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getMaxBuildMaterial() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.BuildMaterial,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoProduceMaterial(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getMaxProduceMaterial() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.ProduceMaterial,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoFlareAmmo(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getFlareMaxAmmo() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.FlareAmmo,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoActionState(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.ActionState,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoDiving(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return !unit.checkIsDiver()
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.IsDiving,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoIsCoOnboard(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return {
            index    : 0,
            infoType : UnitInfoType.IsCoOnboard,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoLoadUnit(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return unit.getLoadUnitCategoryId() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.LoadUnit,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoTag(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Tag,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoAiMode(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypes_Constants.WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.AiMode,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoAiWeightedDestination(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypes_Constants.WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.AiWeightedDestination,
                war      : war,
                unit     : unit,
                panel    : this,
            };
    }
    private _createInfoForbiddenLocation(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.ForbiddenLocations,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }
    private _createInfoForBuff(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_IUnit.IUnit): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Buff,
            war      : war,
            unit     : unit,
            panel    : this,
        };
    }

    private _createDataForListDamageChart(): DataForDamageRenderer[] {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return [];
        }

        const gameConfig        = unit.getGcData();
        const attackUnitType    = unit.getUnitType();
        const playerIndex       = unit.getPlayerIndex();
        const skinId            = unit.getSkinId();
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(unit.getWar(), playerIndex);
        const dataList          : DataForDamageRenderer[] = [];
        let index               = 0;
        for (const targetUnitType of gameConfig.getAllUnitTypeArray()) {
            dataList.push({
                gameConfig       : gameConfig,
                index            : index,
                attackUnitType   : attackUnitType,
                targetUnitType   : targetUnitType,
                playerIndex      : playerIndex,
                skinId           : skinId,
                overridingSkinId : overridingSkinId,
            });
            ++index;
        }
        for (const targetTileType of gameConfig.getTileTypeArrayForDamageChart()) {
            dataList.push({
                gameConfig       : gameConfig,
                index            : index,
                playerIndex      : playerIndex,
                attackUnitType   : attackUnitType,
                targetTileType   : targetTileType,
                skinId           : skinId,
                overridingSkinId : overridingSkinId,
            });
            ++index;
        }

        return dataList.sort(sorterForDataForList);
    }

    private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return [];
        }

        const dataArray     : DataForMoveCostRenderer[] = [];
        const gameConfig    = unit.getGcData();
        const unitType      = unit.getUnitType();
        let index           = 0;
        for (const tileType of gameConfig.getTileTypeArrayForTileChart()) {
            dataArray.push({
                tileType   : tileType,
                gameConfig : gameConfig,
                unitType   : unitType,
                index      : index++,
            });
        }

        return dataArray;
    }
}

function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
    return a.attackUnitType - b.attackUnitType;
}

interface DataForInfoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    infoType    : UnitInfoType;
    war         : BaseWar_Interface_IBwWar.IBwWar;
    unit        : Units_IUnit.IUnit;
    panel       : Panel;
}
class InfoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupExtra!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTouchValue!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupTouchModify! : Ui_Interfaces_IUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupTouchValue,        callback : this._onTouchedGroupTouchValue },
            { ui : this._groupTouchModify,       callback : this._onTouchedGroupTouchModify },
            { ui : this._labelValue,             callback : this._onTouchedLabelValue },
            { ui : this._labelTitle,             callback : this._onTouchedLabelTitle },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedGroupTouchValue(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if (infoType === UnitInfoType.ActionState) {
            this._showValueAsActionState();
        } else if (infoType === UnitInfoType.AttackRange) {
            this._showValueAsAttackRange();
        } else if (infoType === UnitInfoType.BuildMaterial) {
            this._showValueAsBuildMaterial();
        } else if (infoType === UnitInfoType.FlareAmmo) {
            this._showValueAsFlareAmmo();
        } else if (infoType === UnitInfoType.Fuel) {
            this._showValueAsFuel();
        } else if (infoType === UnitInfoType.IsCoOnboard) {
            this._showValueAsIsCoOnboard();
        } else if (infoType === UnitInfoType.Hp) {
            this._showValueAsHp();
        } else if (infoType === UnitInfoType.IsDiving) {
            this._showValueAsIsDiving();
        } else if (infoType === UnitInfoType.Movement) {
            this._showValueAsMovement();
        } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
            this._showValueAsPrimaryWeaponAmmo();
        } else if (infoType === UnitInfoType.ProduceMaterial) {
            this._showValueAsProduceMaterial();
        } else if (infoType === UnitInfoType.ProductionCost) {
            this._showValueAsProductionCost();
        } else if (infoType === UnitInfoType.EnergyPerNormalizedHp) {
            this._showValueAsEnergyPerNormalizedHp();
        } else if (infoType === UnitInfoType.Promotion) {
            this._showValueAsPromotion();
        } else if (infoType === UnitInfoType.Vision) {
            this._showValueAsVision();
        } else if (infoType === UnitInfoType.LoadUnit) {
            this._showValueAsLoadUnit();
        } else if (infoType === UnitInfoType.Tag) {
            this._showValueAsTag();
        } else if (infoType === UnitInfoType.AiMode) {
            this._showValueAsAiMode();
        } else if (infoType === UnitInfoType.AiWeightedDestination) {
            this._showValueAsAiWeightedDestination();
        } else if (infoType === UnitInfoType.ForbiddenLocations) {
            this._showValueAsForbiddenLocations();
        } else if (infoType === UnitInfoType.Buff) {
            this._showValueAsBuff();
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupTouchModify(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if (infoType === UnitInfoType.ActionState) {
            this._modifyAsActionState();
        } else if (infoType === UnitInfoType.AttackRange) {
            this._modifyAsAttackRange();
        } else if (infoType === UnitInfoType.BuildMaterial) {
            this._modifyAsBuildMaterial();
        } else if (infoType === UnitInfoType.FlareAmmo) {
            this._modifyAsFlareAmmo();
        } else if (infoType === UnitInfoType.Fuel) {
            this._modifyAsFuel();
        } else if (infoType === UnitInfoType.IsCoOnboard) {
            this._modifyAsIsCoOnboard();
        } else if (infoType === UnitInfoType.Hp) {
            this._modifyAsHp();
        } else if (infoType === UnitInfoType.IsDiving) {
            this._modifyAsIsDiving();
        } else if (infoType === UnitInfoType.Movement) {
            this._modifyAsMovement();
        } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
            this._modifyAsPrimaryWeaponAmmo();
        } else if (infoType === UnitInfoType.ProduceMaterial) {
            this._modifyAsProduceMaterial();
        } else if (infoType === UnitInfoType.ProductionCost) {
            this._modifyAsProductionCost();
        } else if (infoType === UnitInfoType.EnergyPerNormalizedHp) {
            this._modifyAsEnergyPerNormalizedHp();
        } else if (infoType === UnitInfoType.Promotion) {
            this._modifyAsPromotion();
        } else if (infoType === UnitInfoType.Vision) {
            this._modifyAsVision();
        } else if (infoType === UnitInfoType.LoadUnit) {
            this._modifyAsLoadUnit();
        } else if (infoType === UnitInfoType.Tag) {
            this._modifyAsTag();
        } else if (infoType === UnitInfoType.AiMode) {
            this._modifyAsAiMode();
        } else if (infoType === UnitInfoType.AiWeightedDestination) {
            this._modifyAsAiWeightedDestination();
        } else if (infoType === UnitInfoType.ForbiddenLocations) {
            this._modifyAsForbiddenLocations();
        } else if (infoType === UnitInfoType.Buff) {
            this._modifyAsBuff();
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedLabelValue(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if (infoType === UnitInfoType.AiMode) {
            this._onTouchedLabelAsAiMode();
        } else {
            // nothing to do
        }
    }
    private _onTouchedLabelTitle(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const infoType = openData.infoType;
        if (infoType === UnitInfoType.EnergyPerNormalizedHp) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0984),
            });
        } else if (infoType === UnitInfoType.IsDiving) {
            const unit      = openData.unit;
            const diveCfg   = unit.getTemplateCfg().getDiveCfg();
            if (diveCfg) {
                const gcData = unit.getGcData();
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0208,
                        diveCfg.getDivedFuelConsumption(),
                        diveCfg.getCanBeAttackedByUnitTypeArray().map(v => Lang_Utils.getUnitName(v, gcData)).join(`, `),
                    ),
                });
            }
        } else {
            // nothing to do
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if (infoType === UnitInfoType.ActionState) {
            this._updateViewAsActionState();
        } else if (infoType === UnitInfoType.AttackRange) {
            this._updateViewAsAttackRange();
        } else if (infoType === UnitInfoType.BuildMaterial) {
            this._updateViewAsBuildMaterial();
        } else if (infoType === UnitInfoType.FlareAmmo) {
            this._updateViewAsFlareAmmo();
        } else if (infoType === UnitInfoType.Fuel) {
            this._updateViewAsFuel();
        } else if (infoType === UnitInfoType.IsCoOnboard) {
            this._updateViewAsIsCoOnboard();
        } else if (infoType === UnitInfoType.Hp) {
            this._updateViewAsHp();
        } else if (infoType === UnitInfoType.IsDiving) {
            this._updateViewAsIsDiving();
        } else if (infoType === UnitInfoType.Movement) {
            this._updateViewAsMovement();
        } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
            this._updateViewAsPrimaryWeaponAmmo();
        } else if (infoType === UnitInfoType.ProduceMaterial) {
            this._updateViewAsProduceMaterial();
        } else if (infoType === UnitInfoType.ProductionCost) {
            this._updateViewAsProductionCost();
        } else if (infoType === UnitInfoType.EnergyPerNormalizedHp) {
            this._updateViewAsEnergyPerNormalizedHp();
        } else if (infoType === UnitInfoType.Promotion) {
            this._updateViewAsPromotion();
        } else if (infoType === UnitInfoType.Vision) {
            this._updateViewAsVision();
        } else if (infoType === UnitInfoType.LoadUnit) {
            this._updateViewAsLoadUnit();
        } else if (infoType === UnitInfoType.Tag) {
            this._updateViewAsTag();
        } else if (infoType === UnitInfoType.AiMode) {
            this._updateViewAsAiMode();
        } else if (infoType === UnitInfoType.AiWeightedDestination) {
            this._updateViewAsAiWeightedDestination();
        } else if (infoType === UnitInfoType.ForbiddenLocations) {
            this._updateViewAsForbiddenLocations();
        } else if (infoType === UnitInfoType.Buff) {
            this._updateViewAsBuff();
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.B0367);
        this._labelValue.setText(Lang_Utils.getUnitActionStateText(openData.unit.getActionState()) ?? Lang_Constants.UndefinedError);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsAttackRange(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const minRange              = unit.getMinAttackRange();
        const maxRange              = unit.getFinalMaxAttackRange();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);
        this._groupTouchModify.setIsVisible(false);

        const groupExtra = this._groupExtra;
        if (!unit.getFinalCanAttackAfterMoving()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(Lang_Constants.TextType.B0697);
        }
    }
    private _updateViewAsBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentBuildMaterial();
        const maxValue              = unit.getMaxBuildMaterial();
        this._labelTitle.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFlareCurrentAmmo();
        const maxValue              = unit.getFlareMaxAmmo();
        this._labelTitle.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentFuel();
        const maxValue              = unit.getMaxFuel();
        this._labelTitle.setLangText(Lang_Constants.TextType.Fuel);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));

        const fuelConsumption   = unit.getFuelConsumptionPerTurn();
        const groupExtra        = this._groupExtra;
        if (fuelConsumption == 0) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(fuelConsumption < 0 ? `+${-fuelConsumption}` : `-${fuelConsumption}`);
        }
    }
    private _updateViewAsIsCoOnboard(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.CoOnboard);
        this._labelValue.setLangText(openData.unit.getIsCoOnboard() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentHp();
        const maxValue              = unit.getMaxHp();
        this._labelTitle.setLangText(Lang_Constants.TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit = openData.unit;
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0371)} ?`);
        this._labelValue.setLangText(unit.getIsDiving() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) && (unit.checkIsDiver()));
    }
    private _updateViewAsMovement(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                      = openData.unit;
        const currentValue              = unit.getFinalMoveRange();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(Lang_Utils.getMoveTypeName(unit.getMoveTypeId(), unit.getGcData()) ?? Lang_Constants.UndefinedError);
        this._groupTouchModify.setIsVisible(false);
    }
    private _updateViewAsPrimaryWeaponAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit          = openData.unit;
        const currentValue  = unit.getPrimaryWeaponCurrentAmmo();
        const maxValue      = unit.getPrimaryWeaponMaxAmmo();
        this._labelTitle.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(Lang_Utils.getUnitName(
                Helpers_Misc.getExisted(unit.getProduceUnitTypeId()),
                unit.getGcData(),
            ) ?? Lang_Constants.UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.B0341);
        this._labelValue.setText(`${openData.unit.getProductionFinalCost()}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(false);
    }
    private _updateViewAsEnergyPerNormalizedHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit      = openData.unit;
        const energy    = unit.getTemplateCfg().getEnergyPerNormalizedHp();
        const gcData    = unit.getGcData();
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1474)} ?`);
        this._labelValue.setText(`${energy * gcData.getTrilogyEnergyGainRateForAttacker() / 100} / ${energy * gcData.getTrilogyEnergyGainRateForDefender() / 100}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(false);
    }
    private _updateViewAsPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentPromotion();
        const maxValue              = unit.getMaxPromotion();
        this._labelTitle.setLangText(Lang_Constants.TextType.Promotion);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex());
        this._labelTitle.setLangText(Lang_Constants.TextType.VisionRange);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(false);
    }
    private _updateViewAsLoadUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        this._labelTitle.setLangText(Lang_Constants.TextType.B0698);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));

        const unit          = openData.unit;
        const maxValue      = unit.getMaxLoadUnitsCount();
        const labelValue    = this._labelValue;
        const groupExtra    = this._groupExtra;
        if (maxValue == null) {
            labelValue.setText(`--`);
            groupExtra.setIsVisible(false);
        } else {
            const canShowValue          = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(unit.getTeamIndex()));
            labelValue.setText(`${canShowValue ? unit.getLoadedUnitsCount() : `??`} / ${maxValue}`);
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(Lang_Utils.getUnitCategoryName(
                Helpers_Misc.getExisted(unit.getLoadUnitCategoryId()),
                war.getGcData(),
            ) ?? Lang_Constants.UndefinedError);
        }
    }
    private _updateViewAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tagIdArray            = openData.unit.getTagIdArray(true);
        this._labelTitle.setLangText(Lang_Constants.TextType.Tags);
        this._labelValue.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`,`));
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.AiMode);
        this._labelValue.setText(Lang_Utils.getUnitAiModeName(openData.unit.getAiMode()) ?? Lang_Constants.UndefinedError);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const destination           = openData.unit.getAiWeightedDestination();
        this._labelTitle.setLangText(Lang_Constants.TextType.AiDestination);
        this._labelValue.setText(destination ? `${destination.gridIndex.getX()}, ${destination.gridIndex.getY()} (${destination.weight})` : `--`);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsForbiddenLocations(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const locationIdArray       = Locations_Utils.decode(openData.unit.getForbiddenGroupedLocationIdArray());
        this._labelTitle.setLangText(Lang_Constants.TextType.NoEntryLocations);
        this._labelValue.setText(!locationIdArray.length ? `--` : locationIdArray.join(`/`));
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const buffsCount            = openData.unit.getBuffList()?.length;
        this._labelTitle.setLangText(Lang_Constants.TextType.AbnormalStates);
        this._labelValue.setText(`${buffsCount > 0 ? buffsCount : `--`}`);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }

    private _showValueAsActionState(): void {
        // nothing to do
    }
    private _showValueAsAttackRange(): void {
        // nothing to do
    }
    private _showValueAsBuildMaterial(): void {
        // nothing to do
    }
    private _showValueAsFlareAmmo(): void {
        // nothing to do
    }
    private _showValueAsFuel(): void {
        // nothing to do
    }
    private _showValueAsIsCoOnboard(): void {
        // nothing to do
    }
    private _showValueAsHp(): void {
        // nothing to do
    }
    private _showValueAsIsDiving(): void {
        // nothing to do
    }
    private _showValueAsMovement(): void {
        // nothing to do
    }
    private _showValueAsPrimaryWeaponAmmo(): void {
        // nothing to do
    }
    private _showValueAsProduceMaterial(): void {
        // nothing to do
    }
    private _showValueAsProductionCost(): void {
        // nothing to do
    }
    private _showValueAsEnergyPerNormalizedHp(): void {
        // nothing to do
    }
    private _showValueAsPromotion(): void {
        // nothing to do
    }
    private _showValueAsVision(): void {
        // nothing to do
    }
    private _showValueAsLoadUnit(): void {
        // nothing to do
    }
    private _showValueAsTag(): void {
        // nothing to do
    }
    private _showValueAsAiMode(): void {
        // nothing to do
    }
    private _showValueAsAiWeightedDestination(): void {
        // nothing to do
    }
    private _showValueAsForbiddenLocations(): void {
        // nothing to do
    }
    private _showValueAsBuff(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBuffListPanel, {
            unit      : unit,
            canModify : unit.getWar().getCanCheat(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _modifyAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const state     = unit.getActionState();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0113),
            callback   : () => {
                unit.setActionState(state === Units_Constants.ActionStateId.Acted ? Units_Constants.ActionStateId.Idle : Units_Constants.ActionStateId.Acted);
                unit.updateView();
                ActionPlanners_States_Idle.Idle.getInstance().apply(war.getActionPlanner());
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsAttackRange(): void {
        // nothing to do
    }
    private _modifyAsBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { unit, war } = openData;
        const maxValue      = unit.getMaxBuildMaterial();
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const minValue  = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
            currentValue : unit.getCurrentBuildMaterial(),
            minValue,
            maxValue,
            callback     : value => {
                unit.setCurrentBuildMaterial(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { unit, war } = openData;
        const maxValue      = unit.getFlareMaxAmmo();
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const minValue      = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
            currentValue : unit.getFlareCurrentAmmo(),
            minValue,
            maxValue,
            callback     : value => {
                unit.setFlareCurrentAmmo(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentFuel();
        const maxValue  = unit.getMaxFuel();
        const minValue  = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                unit.setCurrentFuel(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsIsCoOnboard(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const isCoOnboard   = unit.getIsCoOnboard();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0243),
            callback   : () => {
                unit.setIsCoOnboard(!isCoOnboard);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();

                war.getTileMap().getView().updateCoZone();
            },
        });
    }
    private _modifyAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentHp();
        const maxValue  = unit.getMaxHp();
        const minValue  = 1;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                unit.setCurrentHp(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const isDiving  = unit.getIsDiving();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0114),
            callback   : () => {
                unit.setIsDiving(!isDiving);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsMovement(): void {
        // nothing to do
    }
    private _modifyAsPrimaryWeaponAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit      = openData.unit;
        const maxValue  = unit.getPrimaryWeaponMaxAmmo();
        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getPrimaryWeaponCurrentAmmo();
        const minValue  = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
            currentValue : currValue,
            minValue     : minValue,
            maxValue     : maxValue,
            callback     : value => {
                unit.setAndValidatePrimaryWeaponCurrentAmmo(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit      = openData.unit;
        const maxValue  = unit.getMaxProduceMaterial();
        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentProduceMaterial();
        const minValue  = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
            currentValue : currValue,
            minValue     : minValue,
            maxValue     : maxValue,
            callback     : value => {
                unit.setAndValidateCurrentProduceMaterial(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsProductionCost(): void {
        // nothing to do
    }
    private _modifyAsEnergyPerNormalizedHp(): void {
        // nothing to do
    }
    private _modifyAsPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { unit, war } = openData;
        const maxValue      = unit.getMaxPromotion();
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentPromotion();
        const minValue  = 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                unit.setCurrentPromotion(value);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            },
        });
    }
    private _modifyAsVision(): void {
        // nothing to do
    }
    private _modifyAsLoadUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
            return;
        }

        const loaderUnit    = openData.unit;
        const maxLoadCount  = loaderUnit.getMaxLoadUnitsCount();
        if (!maxLoadCount) {
            return;
        }
        if (loaderUnit.getLoadedUnitsCount() >= maxLoadCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0274));
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const playerIndex   = loaderUnit.getPlayerIndex();
        const gameConfig    = loaderUnit.getGcData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleUnitTypePanel, {
            getTitleText     : () => Lang_Utils.getText(Lang_Constants.TextType.B0098),
            playerIndex      : playerIndex,
            skinId           : loaderUnit.getSkinId(),
            overridingSkinId : ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex),
            unitTypeArray    : gameConfig.getUnitTypesByCategory(Helpers_Misc.getExisted(loaderUnit.getLoadUnitCategoryId())) ?? [],
            currentUnitType  : null,
            gameConfig       : gameConfig,
            callback         : unitType => {
                if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                    FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
                    return;
                }

                const unitMap   = war.getUnitMap();
                const unitId    = unitMap.getNextUnitId();
                const newUnit   = new Units_Unit.Unit();
                const unitData  = Units_Utils_Serialization.createDefault({
                    gridIndex   : loaderUnit.getGridIndex().getXY(),
                    unitTypeId  : unitType,
                    playerIndex : playerIndex,
                    unitId      : unitId,
                    gcData      : gameConfig,
                });
                unitData.setLoaderUnitId(loaderUnit.getUnitId());

                newUnit.init(unitData, gameConfig);
                newUnit.startRunning(war);
                newUnit.startRunningView();

                unitMap.setUnitLoaded(newUnit);
                unitMap.setNextUnitId(unitId + 1);

                loaderUnit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
                ActionPlanners_States_Idle.Idle.getInstance().apply(war.getActionPlanner());

                Notifications_Dispatcher.dispatch("BwUnitChanged", { gridIndex : loaderUnit.getGridIndex() });
            },
        });
    }
    private _modifyAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseUnitTagPanel, {
            currentTagIdList : unit.getTagIdArray(true),
            war              : openData.war,
            callback         : tagIdArray => {
                unit.setGroupedTagId(Units_Utils_Common.getEncodedTagId(tagIdArray));
                this._updateView();
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
            },
        });
    }
    private _modifyAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypes_Utils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const aiMode    = unit.getAiMode();
        if (aiMode === Units_Constants.AiModeId.NoMove) {
            unit.setAiMode(Units_Constants.AiModeId.Normal);
        } else if (aiMode === Units_Constants.AiModeId.Normal) {
            unit.setAiMode(Units_Constants.AiModeId.WaitUntilCanAttack);
        } else {
            unit.setAiMode(Units_Constants.AiModeId.NoMove);
        }
        this._updateView();
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0724));
    }
    private _modifyAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const destination   = unit.getAiWeightedDestination();
        const mapSize       = war.getTileMap().getMapSize();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue     : 0,
            maxValue     : mapSize.getWidth() - 1,
            currentValue : destination?.gridIndex.getX() ?? 0,
            callback     : newX => {
                if (newX == null) {
                    unit.setAiWeightedDestinationWithProto(null);
                    this._updateView();
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                        minValue     : 0,
                        maxValue     : mapSize.getHeight() - 1,
                        currentValue : destination?.gridIndex.getY() ?? 0,
                        callback     : newY => {
                            if (newY == null) {
                                unit.setAiWeightedDestinationWithProto(null);
                                this._updateView();
                            } else {
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1094),
                                    currentValue : destination?.weight ?? 0,
                                    minValue     : -99999999,
                                    maxValue     : 99999999,
                                    getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0432),
                                    callback     : value => {
                                        unit.setAiWeightedDestinationWithProto(WeightedGridIndex.fromJson({
                                            gridIndex : { x : newX, y : newY },
                                            weight    : value,
                                        }));
                                        this._updateView();
                                    },
                                });
                            }
                        },
                    });
                }
            },
        });
    }
    private _modifyAsForbiddenLocations(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility : false,
            currentGroupedLocationIds    : unit.getForbiddenGroupedLocationIdArray().concat(),
            war                          : openData.war,
            getTitleText                 : () => Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations),
            callback                     : locationIdArray => {
                unit.setForbiddenGroupedLocationIdArray(Locations_Utils.encode(locationIdArray));
                this._updateView();
            },
        });
    }
    private _modifyAsBuff(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBuffListPanel, {
            unit      : unit,
            canModify : unit.getWar().getCanCheat(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedLabelAsAiMode(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.AiMode),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0010),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForDamageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    index               : number;
    attackUnitType      : number;
    playerIndex         : number;
    targetUnitType?     : number;
    targetTileType?     : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
class DamageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tileView!             : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelPrimaryAttack!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPrimaryDefend!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryDefend! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "UnitAnimationTick",       callback : this._onNotifyUnitAnimationTick },
            { type : "StateIndicatorTick",      callback : this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 1);

        const gameConfig        = openData.gameConfig;
        const attackUnitType    = openData.attackUnitType;
        const targetUnitType    = openData.targetUnitType;
        if (targetUnitType != null) {
            const playerIndex = openData.playerIndex;
            this._unitView.setIsVisible(true);
            this._tileView.setIsVisible(false);
            this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
                gameConfig       : gameConfig,
                skinId           : openData.skinId,
                overridingSkinId : openData.overridingSkinId,
                unitData         : Units_Utils_Serialization.createDefault({
                    gridIndex   : { x : 0, y : 0 },
                    unitTypeId  : targetUnitType,
                    unitId      : -1,
                    playerIndex : playerIndex,
                    gcData      : gameConfig,
                }),
            }), Common_Model_CommonModel.getUnitAnimationTickCount());

            const attackCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = Helpers_Misc.getExisted(openData.targetTileType);
            const attackCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = Helpers_Misc.getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                themeType  : Tiles_Constants_Common.ThemeTypeId.Normal,
                skinId     : ForceSkins_Constants.SkinId.Neutral,
                objectType : Helpers_Misc.getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark     : false,
                shapeId    : 0,
                tickCount  : Common_Model_CommonModel.getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView          = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",   callback : this._onNotifyTileAnimationTick },
        ]);

        const conView   = this._conView;
        const tileView  = this._tileView;
        conView.addUiChild(tileView.getImgBase());
        conView.addUiChild(tileView.getImgDecoration());
        conView.addUiChild(tileView.getImgObject());
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        this._imgBg.setIsVisible(data.index % 4 === 2);

        const gameConfig            = data.gameConfig;
        const tileType              = data.tileType;
        const moveCostCfg           = Helpers_Misc.getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost              = moveCostCfg[Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(data.unitType)?.getMoveTypeId())].getCost();
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);

        const tileView          = this._tileView;
        const tileTemplateCfg   = gameConfig.getTileTemplateCfg(tileType);
        tileView.init({
            tileBaseType          : tileTemplateCfg?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : tileTemplateCfg?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId     : 0,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
        tileView.updateView();
    }
}
