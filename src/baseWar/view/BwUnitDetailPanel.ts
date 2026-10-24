import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import * as ActionPlannersStatesRequestingPlayerDeleteUnit from "../../actionPlanners/states/RequestingPlayerDeleteUnit.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesDamageCalculatorPlayerData from "../../auxiliaryTypes/DamageCalculatorPlayerData.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CommonViewCommonDamageCalculatorPanel from "../../common/view/CommonDamageCalculatorPanel.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GameVersionsConstants from "../../gameVersions/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureGridIndex from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";
import * as WarTypesUtils from "../../warTypes/Utils.ts";

type IUnit                  = UnitsIUnit.IUnit;

// eslint-disable-next-line no-shadow
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
    unit        : IUnit;
    canDelete   : boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutName!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyName!        : UiInterfacesIUiButton.IUiButton;

    private readonly _conUnitView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnUnitsInfo!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDamageCalculator!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDamage!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupDamageTitle!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listInfo!             : UiInterfacesIUiScrollList.IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : UiInterfacesIUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _layoutOffense!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelOffense!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub1!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutDefense!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDefense!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub2!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMoveCost!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupMoveCostTitle!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMoveCost!         : UiInterfacesIUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();
    private _isShowDamage                   = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            { type: NotificationsTypeId.TypeId.BwUnitBuffChanged,           callback: this._onNotifyBwUnitBuffChanged },
            { type: NotificationsTypeId.TypeId.BwUnitCustomNameIdChanged,   callback: this._onNotifyUnitCustomNameIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnModifyName,          callback: this._onTouchedBtnModifyName },
            { ui: this._btnUnitsInfo,           callback: this._onTouchedBtnUnitsInfo },
            { ui: this._btnDamageCalculator,    callback: this._onTouchedBtnDamageCalculator },
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
            { ui: this._groupDamageTitle,       callback: this._onTouchedGroupDamageTitle },
            { ui: this._groupMoveCostTitle,     callback: this._onTouchedGroupMoveCostTitle },
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
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        // this.close();
    }

    private _onNotifyBwUnitBuffChanged(e: VendorEgretEgret.Event): void {
        if ((e.data as NotificationsDataTypes.BwUnitBuffChanged).unit === this.getOpenData()?.unit) {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1433),
            availableNumberArray    : HelpersCollection.createRange(0, UnitsConstants.CustomName.MaxId + 1, 1),
            currentNumber           : unit.getCustomNameId(),
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${LangUtils.getText(LangConstants.TextType.B0391)})`;
                } else {
                    return LangUtils.getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings     : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MeUnitCustomNameListPanel, { war: war });
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm       : num => unit.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnUnitsInfo(): void {
        const gameConfig = this.getOpenData()?.unit.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageChartPanel, {
            gameConfig  : gameConfig,
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
        const allCities             = allTiles.filter(v => v.getTileTypeId() === TilesConstantsCommon.TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === TilesConstantsCommon.TileTypeId.CommandTower);
        const defenderData          = CommonViewCommonDamageCalculatorPanel.Panel.createDefaultPlayerData(gameConfig);
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
        const playerRule            = commonSettingsManager.getPlayerRule(attackerPlayerIndex);
        const getIsAffectedByCo1    = HelpersMisc.createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType    : true,
            data                    : {
                gameConfig      : war.getGcData(),
                weatherType     : war.getWeatherManager().getCurrentWeatherType(),
                attackerData    : new AuxiliaryTypesDamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId                    : attackerPlayer.getCoId(),
                    coSkillType             : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? attackerPlayer.getCoUsingSkillType()
                        : (getIsAffectedByCo1() ? CoSkillsConstants.SkillTypeId.Passive : null),
                    unitType                : attackerUnit.getUnitType(),
                    unitHp                  : attackerUnit.getCurrentHp(),
                    unitWeaponType          : null,
                    unitPromotion           : attackerUnit.getCurrentPromotion(),
                    tileType                : attackerTile.getTileTypeId(),
                    tileCustomBuildingData  : attackerTile.getCustomBuildingData(),
                    towersCount             : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                    offenseBonus            : playerRule.getAttackPowerModifier(),
                    defenseBonus            : playerRule.getDefenseModifier(),
                    upperLuck               : playerRule.getLuckUpperLimit(),
                    lowerLuck               : playerRule.getLuckLowerLimit(),
                    hasPrimaryAmmo          : !!attackerUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard               : attackerUnit.getIsCoOnboard(),
                    fund                    : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                    citiesCount             : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
            return;
        }

        const unitMap   = war.getUnitMap();
        const gridIndex = unit.getGridIndex();
        if (war.getCanCheat()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0029),
                callback: () => {
                    if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
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
                    ActionPlannersStatesIdle.Idle.getInstance().apply(war.getActionPlanner());
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex } as NotificationsDataTypes.BwUnitChanged);

                    this.closePanel();
                },
            });

        } else {
            if (unit.getActionState() !== UnitsConstants.ActionStateId.Idle) {
                FloatText2.showLang(LangConstants.TextType.A0985);
                return;
            }

            if (unit.getLoaderUnitId() != null) {
                FloatText2.showLang(LangConstants.TextType.A0986);
                return;
            }

            const playerInTurn = war.getPlayerInTurn();
            if (playerInTurn.getUserId() !== UsersModel.getSelfUserId()) {
                FloatText2.showLang(LangConstants.TextType.A0987);
                return;
            }

            const playerIndex = unit.getPlayerIndex();
            if (playerIndex !== playerInTurn.getPlayerIndex()) {
                FloatText2.showLang(LangConstants.TextType.A0988);
                return;
            }

            if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0076));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if ((unitMap.getUnitOnMap(gridIndex) !== unit)                                      ||
                (war.getTurnManager().getPhaseCode() !== TurnsConstants.PhaseCode.Main)      ||
                (actionPlanner.checkIsStateRequesting())                                        ||
                (actionPlanner.getStateId() === ActionPlannersConstants.StateId.ExecutingAction)
            ) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if ((war instanceof GameHelpersGhFactory.getMpwWarClass()) ||
                (war instanceof GameHelpersGhFactory.getSpwWarClass())
            ) {
                actionPlanner.cancelCurrentState();
                war.getCursor().setGridIndex(gridIndex);

                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle    : () => LangUtils.getText(LangConstants.TextType.B0081),
                    getContent  : () => LangUtils.getText(LangConstants.TextType.A0029),
                    callback    : () => {
                        ActionPlannersStatesRequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(actionPlanner);
                        this.closePanel();
                    },
                });

            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }
        }
    }

    private _onTouchedGroupDamageTitle(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

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
        this._labelTitle.setLangText(LangConstants.TextType.B0423);
        this._btnDelete.setLangText(LangConstants.TextType.B0081);
        this._labelOffense.setLangText(LangConstants.TextType.B0694);
        this._labelDefense.setLangText(LangConstants.TextType.B0695);
        this._labelMain1.setLangText(LangConstants.TextType.B0692);
        this._labelSub1.setLangText(LangConstants.TextType.B0693);
        this._labelMain2.setLangText(LangConstants.TextType.B0692);
        this._labelSub2.setLangText(LangConstants.TextType.B0693);
        this._labelMoveCostTitle1.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCost1.setLangText(LangConstants.TextType.B1282);
        this._labelMoveCost2.setLangText(LangConstants.TextType.B1282);

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
        unitData.setGridIndex(ProtoSchemaCommonProtoStructureGridIndex.GridIndex.fromJson({ x: 0, y: 0 }));

        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : unit.getGcData(),
            skinId              : unit.getSkinId(),
            overridingSkinId    : ForceSkinsUtils.getRawOverridingSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitData            : unitData,
        }), CommonModelCommonModel.getUnitAnimationTickCount());
    }

    private _updateLabelName(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const languageType1 = LangUtils.getCurrentLanguageType();
        const languageType2 = LangUtils.getSecondaryLanguageType();
        const customName    = unit.getCustomName(languageType1);
        const customName1   = unit.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? LangConstants.UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const unitType      = unit.getUnitType();
            const gameConfig    = unit.getGcData();
            labelName.setText(LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError);
            labelName1.setText(LangUtils.getUnitName(unitType, gameConfig, languageType2) ?? LangConstants.UndefinedError);
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
        const dataArray : DataForInfoRenderer[] = HelpersCollection.getNonNullElements([
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

    private _createInfoHp(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Hp,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoProductionCost(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ProductionCost,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoEnergyPerNormalizedHp(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== GameVersionsConstants.TypeName.Test) &&
            (gameVersion !== GameVersionsConstants.TypeName.Trilogy)
        ) {
            return null;
        } else {
            return {
                index       : 0,
                infoType    : UnitInfoType.EnergyPerNormalizedHp,
                war         : war,
                unit        : unit,
                panel       : this,
            };
        }
    }
    private _createInfoMovement(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Movement,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoFuel(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Fuel,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoPromotion(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Promotion,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoAttackRange(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getMinAttackRange() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AttackRange,
                war         : war,
                unit        : unit,
                panel       : this,
                };
    }
    private _createInfoVision(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Vision,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoPrimaryWeaponAmmo(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getPrimaryWeaponMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.PrimaryWeaponAmmo,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoBuildMaterial(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getMaxBuildMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.BuildMaterial,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoProduceMaterial(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getMaxProduceMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.ProduceMaterial,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoFlareAmmo(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getFlareMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.FlareAmmo,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoActionState(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ActionState,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoDiving(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return !unit.checkIsDiver()
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.IsDiving,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoIsCoOnboard(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return {
            index       : 0,
            infoType    : UnitInfoType.IsCoOnboard,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoLoadUnit(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return unit.getLoadUnitCategoryId() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.LoadUnit,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoTag(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Tag,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoAiMode(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypesConstants.WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AiMode,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoAiWeightedDestination(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypesConstants.WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AiWeightedDestination,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoForbiddenLocation(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ForbiddenLocations,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoForBuff(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Buff,
            war         : war,
            unit        : unit,
            panel       : this,
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
        const overridingSkinId  = ForceSkinsUtils.getRawOverridingSkinId(unit.getWar(), playerIndex);
        const dataList          : DataForDamageRenderer[] = [];
        let index               = 0;
        for (const targetUnitType of gameConfig.getAllUnitTypeArray()) {
            dataList.push({
                gameConfig          : gameConfig,
                index               : index,
                attackUnitType      : attackUnitType,
                targetUnitType      : targetUnitType,
                playerIndex         : playerIndex,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
            });
            ++index;
        }
        for (const targetTileType of gameConfig.getTileTypeArrayForDamageChart()) {
            dataList.push({
                gameConfig          : gameConfig,
                index               : index,
                playerIndex         : playerIndex,
                attackUnitType      : attackUnitType,
                targetTileType      : targetTileType,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
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
                tileType    : tileType,
                gameConfig  : gameConfig,
                unitType    : unitType,
                index       : index++,
            });
        }

        return dataArray;
    }
}

function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
    return a.attackUnitType - b.attackUnitType;
}

interface DataForInfoRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    infoType    : UnitInfoType;
    war         : BaseWarInterfaceIBwWar.IBwWar;
    unit        : IUnit;
    panel       : Panel;
}
class InfoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupExtra!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTouchValue!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupTouchModify! : UiInterfacesIUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupTouchValue,        callback: this._onTouchedGroupTouchValue },
            { ui: this._groupTouchModify,       callback: this._onTouchedGroupTouchModify },
            { ui: this._labelValue,             callback: this._onTouchedLabelValue },
            { ui: this._labelTitle,             callback: this._onTouchedLabelTitle },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
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
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent  : () => LangUtils.getText(LangConstants.TextType.A0984),
            });
        } else if (infoType === UnitInfoType.IsDiving) {
            const unit      = openData.unit;
            const diveCfg   = unit.getTemplateCfg().getDiveCfg();
            if (diveCfg) {
                const gcData = unit.getGcData();
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent  : () => LangUtils.getFormattedText(
                        LangConstants.TextType.F0208,
                        diveCfg.getDivedFuelConsumption(),
                        diveCfg.getCanBeAttackedByUnitTypeArray().map(v => LangUtils.getUnitName(v, gcData)).join(`, `)
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
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.B0367);
        this._labelValue.setText(LangUtils.getUnitActionStateText(openData.unit.getActionState()) ?? LangConstants.UndefinedError);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsAttackRange(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const minRange              = unit.getMinAttackRange();
        const maxRange              = unit.getFinalMaxAttackRange();
        this._labelTitle.setLangText(LangConstants.TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);
        this._groupTouchModify.setIsVisible(false);

        const groupExtra = this._groupExtra;
        if (!unit.getFinalCanAttackAfterMoving()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(LangConstants.TextType.B0697);
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
        this._labelTitle.setLangText(LangConstants.TextType.BuildMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFlareCurrentAmmo();
        const maxValue              = unit.getFlareMaxAmmo();
        this._labelTitle.setLangText(LangConstants.TextType.FlareAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentFuel();
        const maxValue              = unit.getMaxFuel();
        this._labelTitle.setLangText(LangConstants.TextType.Fuel);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));

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

        this._labelTitle.setLangText(LangConstants.TextType.CoOnboard);
        this._labelValue.setText(openData.unit.getIsCoOnboard() ? LangUtils.getText(LangConstants.TextType.Yes) : LangUtils.getText(LangConstants.TextType.No));
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentHp();
        const maxValue              = unit.getMaxHp();
        this._labelTitle.setLangText(LangConstants.TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit = openData.unit;
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0371)} ?`);
        this._labelValue.setText(unit.getIsDiving() ? LangUtils.getText(LangConstants.TextType.Yes) : LangUtils.getText(LangConstants.TextType.No));
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) && (unit.checkIsDiver()));
    }
    private _updateViewAsMovement(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                      = openData.unit;
        const currentValue              = unit.getFinalMoveRange();
        this._labelTitle.setLangText(LangConstants.TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(LangUtils.getMoveTypeName(unit.getMoveTypeId(), unit.getGcData()) ?? LangConstants.UndefinedError);
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
        this._labelTitle.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(LangConstants.TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(LangUtils.getUnitName(
                HelpersMisc.getExisted(unit.getProduceUnitTypeId()),
                unit.getGcData()
            ) ?? LangConstants.UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.B0341);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1474)} ?`);
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
        this._labelTitle.setLangText(LangConstants.TextType.Promotion);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex());
        this._labelTitle.setLangText(LangConstants.TextType.VisionRange);
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
        this._labelTitle.setLangText(LangConstants.TextType.B0698);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));

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
            this._labelExtraInfo.setText(LangUtils.getUnitCategoryName(
                HelpersMisc.getExisted(unit.getLoadUnitCategoryId()),
                war.getGcData()
            ) ?? LangConstants.UndefinedError);
        }
    }
    private _updateViewAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tagIdArray            = openData.unit.getTagIdArray(true);
        this._labelTitle.setLangText(LangConstants.TextType.Tags);
        this._labelValue.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`,`));
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.AiMode);
        this._labelValue.setText(LangUtils.getUnitAiModeName(openData.unit.getAiMode()) ?? LangConstants.UndefinedError);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const destination           = openData.unit.getAiWeightedDestination();
        this._labelTitle.setLangText(LangConstants.TextType.AiDestination);
        this._labelValue.setText(destination ? `${destination.gridIndex.getX()}, ${destination.gridIndex.getY()} (${destination.weight})` : `--`);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsForbiddenLocations(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const locationIdArray       = LocationsUtils.decode(openData.unit.getForbiddenGroupedLocationIdArray() ?? []);
        this._labelTitle.setLangText(LangConstants.TextType.NoEntryLocations);
        this._labelValue.setText(!locationIdArray.length ? `--` : locationIdArray.join(`/`));
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const buffsCount            = openData.unit.getBuffList()?.length ?? 0;
        this._labelTitle.setLangText(LangConstants.TextType.AbnormalStates);
        this._labelValue.setText(`${buffsCount > 0 ? buffsCount : `--`}`);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()));
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBuffListPanel, {
            unit        : unit,
            canModify   : unit.getWar().getCanCheat(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _modifyAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const state     = unit.getActionState();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B0088),
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0113),
            callback    : () => {
                unit.setActionState(state === UnitsConstants.ActionStateId.Acted ? UnitsConstants.ActionStateId.Idle : UnitsConstants.ActionStateId.Acted);
                unit.updateView();
                ActionPlannersStatesIdle.Idle.getInstance().apply(war.getActionPlanner());
                this._updateView();
                openData.panel.updateUnitView();
            }
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const minValue  = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
            currentValue    : unit.getCurrentBuildMaterial() ?? 0,
            minValue,
            maxValue,
            callback        : value => {
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const minValue      = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
            currentValue    : unit.getFlareCurrentAmmo() ?? 0,
            minValue,
            maxValue,
            callback        : value => {
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

        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentFuel();
        const maxValue  = unit.getMaxFuel();
        const minValue  = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Fuel),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const isCoOnboard   = unit.getIsCoOnboard();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0243),
            callback: () => {
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

        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentHp();
        const maxValue  = unit.getMaxHp();
        const minValue  = 1;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Hp),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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

        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const isDiving  = unit.getIsDiving();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0114),
            callback    : () => {
                unit.setIsDiving(!isDiving);
                unit.updateView();
                this._updateView();
                openData.panel.updateUnitView();
            }
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
        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getPrimaryWeaponCurrentAmmo();
        const minValue  = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
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
        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentProduceMaterial();
        const minValue  = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentPromotion();
        const minValue  = 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Promotion),
            currentValue    : currValue ?? 0,
            minValue,
            maxValue,
            callback        : value => {
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
            return;
        }

        const loaderUnit    = openData.unit;
        const maxLoadCount  = loaderUnit.getMaxLoadUnitsCount();
        if (!maxLoadCount) {
            return;
        }
        if (loaderUnit.getLoadedUnitsCount() >= maxLoadCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0274));
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const playerIndex   = loaderUnit.getPlayerIndex();
        const gameConfig    = loaderUnit.getGcData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleUnitTypePanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0098),
            playerIndex         : playerIndex,
            skinId              : loaderUnit.getSkinId(),
            overridingSkinId    : ForceSkinsUtils.getRawOverridingSkinId(war, playerIndex),
            unitTypeArray       : gameConfig.getUnitTypesByCategory(HelpersMisc.getExisted(loaderUnit.getLoadUnitCategoryId())) ?? [],
            currentUnitType     : null,
            gameConfig          : gameConfig,
            callback            : unitType => {
                if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                    FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
                    return;
                }

                const unitMap   = war.getUnitMap();
                const unitId    = unitMap.getNextUnitId();
                const newUnit   = new (GameHelpersGhFactory.getUnitClass())();
                const unitData  = UnitsUtilsSerialization.createDefault({
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
                ActionPlannersStatesIdle.Idle.getInstance().apply(war.getActionPlanner());

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex: loaderUnit.getGridIndex() } as NotificationsDataTypes.BwUnitChanged);
            },
        });
    }
    private _modifyAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseUnitTagPanel, {
            currentTagIdList        : unit.getTagIdArray(true),
            war                     : openData.war,
            callback                : tagIdArray => {
                unit.setGroupedTagId(UnitsUtilsCommon.getEncodedTagId(tagIdArray));
                this._updateView();
                FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
            },
        });
    }
    private _modifyAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!WarTypesUtils.checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const aiMode    = unit.getAiMode();
        if (aiMode === UnitsConstants.AiModeId.NoMove) {
            unit.setAiMode(UnitsConstants.AiModeId.Normal);
        } else if (aiMode === UnitsConstants.AiModeId.Normal) {
            unit.setAiMode(UnitsConstants.AiModeId.WaitUntilCanAttack);
        } else {
            unit.setAiMode(UnitsConstants.AiModeId.NoMove);
        }
        this._updateView();
        FloatText2.show(LangUtils.getText(LangConstants.TextType.B0724));
    }
    private _modifyAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const destination   = unit.getAiWeightedDestination();
        const mapSize       = war.getTileMap().getMapSize();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.gridIndex.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unit.setAiWeightedDestinationWithProto(null);
                    this._updateView();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => LangUtils.getText(LangConstants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.gridIndex.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unit.setAiWeightedDestinationWithProto(null);
                                this._updateView();
                            } else {
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1094),
                                    currentValue    : destination?.weight ?? 0,
                                    minValue        : -99999999,
                                    maxValue        : 99999999,
                                    getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0432),
                                    callback        : value => {
                                        unit.setAiWeightedDestinationWithProto(ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : value,
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : false,
            currentGroupedLocationIds       : unit.getForbiddenGroupedLocationIdArray().concat(),
            war                             : openData.war,
            getTitleText                    : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
            callback                        : locationIdArray => {
                unit.setForbiddenGroupedLocationIdArray(LocationsUtils.encode(locationIdArray));
                this._updateView();
            }
        });
    }
    private _modifyAsBuff(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBuffListPanel, {
            unit        : unit,
            canModify   : unit.getWar().getCanCheat(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedLabelAsAiMode(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.AiMode),
            getContent : () => LangUtils.getText(LangConstants.TextType.R0010),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForDamageRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig          : GameConfigGcData.GcData;
    index               : number;
    attackUnitType      : number;
    playerIndex         : number;
    targetUnitType?     : number;
    targetTileType?     : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
class DamageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!                : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tileView!             : UiInterfacesIUiImage.IUiImage;
    private readonly _labelPrimaryAttack!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPrimaryDefend!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryDefend! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
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
            this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
                gameConfig          : gameConfig,
                skinId              : openData.skinId,
                overridingSkinId    : openData.overridingSkinId,
                unitData            : UnitsUtilsSerialization.createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitTypeId  : targetUnitType,
                    unitId      : -1,
                    playerIndex : playerIndex,
                    gcData      : gameConfig,
                }),
            }), CommonModelCommonModel.getUnitAnimationTickCount());

            const attackCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = HelpersMisc.getExisted(openData.targetTileType);
            const attackCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = HelpersMisc.getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(CommonModelCommonModel.getCachedTileObjectImageSource({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                skinId      : ForceSkinsConstants.SkinId.Neutral,
                objectType  : HelpersMisc.getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark      : false,
                shapeId     : 0,
                tickCount   : CommonModelCommonModel.getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigGcData.GcData;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView          = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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
        const moveCostCfg           = HelpersMisc.getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost              = moveCostCfg[HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(data.unitType)?.getMoveTypeId())].getCost();
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);

        const tileView          = this._tileView;
        const tileTemplateCfg   = gameConfig.getTileTemplateCfg(tileType);
        tileView.init({
            tileBaseType            : tileTemplateCfg?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : tileTemplateCfg?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId       : 0,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }
}
