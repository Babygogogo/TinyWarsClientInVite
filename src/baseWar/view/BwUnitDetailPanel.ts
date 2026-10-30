import { StateId } from "../../actionPlanners/Constants.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import { RequestingPlayerDeleteUnit } from "../../actionPlanners/states/RequestingPlayerDeleteUnit.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { DamageCalculatorPlayerData } from "../../auxiliaryTypes/DamageCalculatorPlayerData.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import {
    getUnitAnimationTickCount,
    getCachedTileObjectImageSource,
    getTileAnimationTickCount,
} from "../../common/model/CommonModel.ts";
import { Panel as ViewCommonDamageCalculatorPanel } from "../../common/view/CommonDamageCalculatorPanel.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import {
    show,
    showLang,
} from "../../FloatText.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import { getRawOverridingSkinId } from "../../forceSkins/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import {
    getMpwWarClass,
    getSpwWarClass,
    getUnitClass,
} from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { TypeName } from "../../gameVersions/Constants.ts";
import {
    createRange,
    getNonNullElements,
} from "../../helpers/Collection.ts";
import {
    createLazyFunc,
    newError,
    getExisted,
} from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
    getCurrentLanguageType,
    getSecondaryLanguageType,
    getUnitName,
    getFormattedText,
    getUnitActionStateText,
    getMoveTypeName,
    getUnitCategoryName,
    getUnitAiModeName,
} from "../../lang/Utils.ts";
import {
    decode,
    encode,
} from "../../locations/Utils.ts";
import type {
    BwUnitBuffChanged,
    BwUnitChanged,
} from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { GridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    TileTypeId,
    ThemeTypeId,
} from "../../tiles/constants/Common.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import {
    getUiUnitViewClass,
    getUiTileViewClass,
} from "../../ui/utils/UiFactory.ts";
import {
    CustomName,
    ActionStateId,
    AiModeId,
    WeaponTypeId,
} from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { getEncodedTagId } from "../../units/utils/Common.ts";
import { createDefault } from "../../units/utils/Serialization.ts";
import {
    getSelfUserId,
    getSelfSettingsTextureVersion,
} from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import { checkCanCheatInWar } from "../../warTypes/Utils.ts";

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
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _layoutName!           : IUiLayout;
    private readonly _labelName!            : IUiLabel;
    private readonly _labelName1!           : IUiLabel;
    private readonly _btnModifyName!        : IUiButton;

    private readonly _conUnitView!          : IUiContainer;
    private readonly _btnUnitsInfo!         : IUiButton;
    private readonly _btnDamageCalculator!  : IUiButton;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnDelete!            : IUiButton;

    private readonly _groupDamage!          : IUiContainer;
    private readonly _groupDamageTitle!     : IUiContainer;
    private readonly _listInfo!             : IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : IUiScrollList<DataForDamageRenderer>;

    private readonly _layoutOffense!        : IUiLayout;
    private readonly _labelOffense!         : IUiLabel;
    private readonly _labelMain1!           : IUiLabel;
    private readonly _labelSub1!            : IUiLabel;

    private readonly _layoutDefense!        : IUiLayout;
    private readonly _labelDefense!         : IUiLabel;
    private readonly _labelMain2!           : IUiLabel;
    private readonly _labelSub2!            : IUiLabel;

    private readonly _groupMoveCost!        : IUiContainer;
    private readonly _groupMoveCostTitle!   : IUiContainer;
    private readonly _layoutMoveCost1!      : IUiLayout;
    private readonly _layoutMoveCost2!      : IUiLayout;
    private readonly _labelMoveCostTitle1!  : IUiLabel;
    private readonly _labelMoveCostTitle2!  : IUiLabel;
    private readonly _labelMoveCost1!       : IUiLabel;
    private readonly _labelMoveCost2!       : IUiLabel;
    private readonly _listMoveCost!         : IUiScrollList<DataForMoveCostRenderer>;

    private readonly _unitView              = new (getUiUnitViewClass())();
    private _isShowDamage                   = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
            { type: TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            { type: TypeId.BwUnitBuffChanged,           callback: this._onNotifyBwUnitBuffChanged },
            { type: TypeId.BwUnitCustomNameIdChanged,   callback: this._onNotifyUnitCustomNameIdChanged },
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
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        // this.close();
    }

    private _onNotifyBwUnitBuffChanged(e: Event): void {
        if ((e.data as BwUnitBuffChanged).unit === this.getOpenData()?.unit) {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B1433),
            availableNumberArray    : createRange(0, CustomName.MaxId + 1, 1),
            currentNumber           : unit.getCustomNameId(),
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${getText(TextType.B0391)})`;
                } else {
                    return getLanguageText({ textArray: arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings     : () => {
                openPanel(getDict().MeUnitCustomNameListPanel, { war: war });
                closePanel(getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm       : num => unit.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnUnitsInfo(): void {
        const gameConfig = this.getOpenData()?.unit.getGcData();
        if (gameConfig == null) {
            return;
        }

        openPanel(getDict().CommonDamageChartPanel, {
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
        const allCities             = allTiles.filter(v => v.getTileTypeId() === TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === TileTypeId.CommandTower);
        const defenderData          = ViewCommonDamageCalculatorPanel.createDefaultPlayerData(gameConfig);
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
        const playerRule            = commonSettingsManager.getPlayerRule(attackerPlayerIndex);
        const getIsAffectedByCo1    = createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        openPanel(getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType    : true,
            data                    : {
                gameConfig      : war.getGcData(),
                weatherType     : war.getWeatherManager().getCurrentWeatherType(),
                attackerData    : new DamageCalculatorPlayerData({
                    coId                    : attackerPlayer.getCoId(),
                    coSkillType             : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? attackerPlayer.getCoUsingSkillType()
                        : (getIsAffectedByCo1() ? SkillTypeId.Passive : null),
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
            show(getText(TextType.A0273));
            return;
        }

        const unitMap   = war.getUnitMap();
        const gridIndex = unit.getGridIndex();
        if (war.getCanCheat()) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0029),
                callback: () => {
                    if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                        show(getText(TextType.A0273));
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
                    Idle.getInstance().apply(war.getActionPlanner());
                    dispatch(TypeId.BwUnitChanged, { gridIndex } as BwUnitChanged);

                    this.closePanel();
                },
            });

        } else {
            if (unit.getActionState() !== ActionStateId.Idle) {
                showLang(TextType.A0985);
                return;
            }

            if (unit.getLoaderUnitId() != null) {
                showLang(TextType.A0986);
                return;
            }

            const playerInTurn = war.getPlayerInTurn();
            if (playerInTurn.getUserId() !== getSelfUserId()) {
                showLang(TextType.A0987);
                return;
            }

            const playerIndex = unit.getPlayerIndex();
            if (playerIndex !== playerInTurn.getPlayerIndex()) {
                showLang(TextType.A0988);
                return;
            }

            if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                show(getText(TextType.A0076));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if ((unitMap.getUnitOnMap(gridIndex) !== unit)                                      ||
                (war.getTurnManager().getPhaseCode() !== PhaseCode.Main)      ||
                (actionPlanner.checkIsStateRequesting())                                        ||
                (actionPlanner.getStateId() === StateId.ExecutingAction)
            ) {
                showLang(TextType.YouCanNotDoThisRightNow);
                return;
            }

            if ((war instanceof getMpwWarClass()) ||
                (war instanceof getSpwWarClass())
            ) {
                actionPlanner.cancelCurrentState();
                war.getCursor().setGridIndex(gridIndex);

                openPanel(getDict().CommonConfirmPanel, {
                    getTitle    : () => getText(TextType.B0081),
                    getContent  : () => getText(TextType.A0029),
                    callback    : () => {
                        RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(actionPlanner);
                        this.closePanel();
                    },
                });

            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }
        }
    }

    private _onTouchedGroupDamageTitle(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

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
        this._labelTitle.setLangText(TextType.B0423);
        this._btnDelete.setLangText(TextType.B0081);
        this._labelOffense.setLangText(TextType.B0694);
        this._labelDefense.setLangText(TextType.B0695);
        this._labelMain1.setLangText(TextType.B0692);
        this._labelSub1.setLangText(TextType.B0693);
        this._labelMain2.setLangText(TextType.B0692);
        this._labelSub2.setLangText(TextType.B0693);
        this._labelMoveCostTitle1.setLangText(TextType.B0351);
        this._labelMoveCostTitle2.setLangText(TextType.B0351);
        this._labelMoveCost1.setLangText(TextType.B1282);
        this._labelMoveCost2.setLangText(TextType.B1282);

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
        unitData.setGridIndex(GridIndex.fromJson({ x: 0, y: 0 }));

        this._unitView.update(new UiUnitViewData({
            gameConfig          : unit.getGcData(),
            skinId              : unit.getSkinId(),
            overridingSkinId    : getRawOverridingSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitData            : unitData,
        }), getUnitAnimationTickCount());
    }

    private _updateLabelName(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const languageType1 = getCurrentLanguageType();
        const languageType2 = getSecondaryLanguageType();
        const customName    = unit.getCustomName(languageType1);
        const customName1   = unit.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const unitType      = unit.getUnitType();
            const gameConfig    = unit.getGcData();
            labelName.setText(getUnitName(unitType, gameConfig) ?? UndefinedError);
            labelName1.setText(getUnitName(unitType, gameConfig, languageType2) ?? UndefinedError);
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
        const dataArray : DataForInfoRenderer[] = getNonNullElements([
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

    private _createInfoHp(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Hp,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoProductionCost(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ProductionCost,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoEnergyPerNormalizedHp(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== TypeName.Test) &&
            (gameVersion !== TypeName.Trilogy)
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
    private _createInfoMovement(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Movement,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoFuel(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Fuel,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoPromotion(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Promotion,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoAttackRange(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoVision(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Vision,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoPrimaryWeaponAmmo(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoBuildMaterial(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoProduceMaterial(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoFlareAmmo(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoActionState(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ActionState,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoDiving(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoIsCoOnboard(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return {
            index       : 0,
            infoType    : UnitInfoType.IsCoOnboard,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoLoadUnit(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
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
    private _createInfoTag(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Tag,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoAiMode(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AiMode,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoAiWeightedDestination(war: IBwWar, unit: IUnit): DataForInfoRenderer | null {
        return ((war.getWarType() !== WarTypeId.Me) && (unit.getPlayer().getUserId() != null))
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AiWeightedDestination,
                war         : war,
                unit        : unit,
                panel       : this,
            };
    }
    private _createInfoForbiddenLocation(war: IBwWar, unit: IUnit): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ForbiddenLocations,
            war         : war,
            unit        : unit,
            panel       : this,
        };
    }
    private _createInfoForBuff(war: IBwWar, unit: IUnit): DataForInfoRenderer {
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
        const overridingSkinId  = getRawOverridingSkinId(unit.getWar(), playerIndex);
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

interface DataForInfoRenderer extends UiListItemData {
    index       : number;
    infoType    : UnitInfoType;
    war         : IBwWar;
    unit        : IUnit;
    panel       : Panel;
}
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : IUiImage;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelValue!       : IUiLabel;
    private readonly _groupExtra!       : IUiContainer;
    private readonly _labelExtraInfo!   : IUiLabel;
    private readonly _groupTouchValue!  : IUiContainer;
    private readonly _groupTouchModify! : IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupTouchValue,        callback: this._onTouchedGroupTouchValue },
            { ui: this._groupTouchModify,       callback: this._onTouchedGroupTouchModify },
            { ui: this._labelValue,             callback: this._onTouchedLabelValue },
            { ui: this._labelTitle,             callback: this._onTouchedLabelTitle },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            throw newError(`Invalid infoType: ${infoType}`);
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
            throw newError(`Invalid infoType: ${infoType}`);
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
            openPanel(getDict().CommonHelpPanel, {
                getContent  : () => getText(TextType.A0984),
            });
        } else if (infoType === UnitInfoType.IsDiving) {
            const unit      = openData.unit;
            const diveCfg   = unit.getTemplateCfg().getDiveCfg();
            if (diveCfg) {
                const gcData = unit.getGcData();
                openPanel(getDict().CommonHelpPanel, {
                    getContent  : () => getFormattedText(
                        TextType.F0208,
                        diveCfg.getDivedFuelConsumption(),
                        diveCfg.getCanBeAttackedByUnitTypeArray().map(v => getUnitName(v, gcData)).join(`, `)
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
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.B0367);
        this._labelValue.setText(getUnitActionStateText(openData.unit.getActionState()) ?? UndefinedError);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsAttackRange(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const minRange              = unit.getMinAttackRange();
        const maxRange              = unit.getFinalMaxAttackRange();
        this._labelTitle.setLangText(TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);
        this._groupTouchModify.setIsVisible(false);

        const groupExtra = this._groupExtra;
        if (!unit.getFinalCanAttackAfterMoving()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(TextType.B0697);
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
        this._labelTitle.setLangText(TextType.BuildMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFlareCurrentAmmo();
        const maxValue              = unit.getFlareMaxAmmo();
        this._labelTitle.setLangText(TextType.FlareAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentFuel();
        const maxValue              = unit.getMaxFuel();
        this._labelTitle.setLangText(TextType.Fuel);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));

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

        this._labelTitle.setLangText(TextType.CoOnboard);
        this._labelValue.setLangText(openData.unit.getIsCoOnboard() ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentHp();
        const maxValue              = unit.getMaxHp();
        this._labelTitle.setLangText(TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit = openData.unit;
        this._labelTitle.setText(`${getText(TextType.B0371)} ?`);
        this._labelValue.setLangText(unit.getIsDiving() ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(openData.war.getWarType())) && (unit.checkIsDiver()));
    }
    private _updateViewAsMovement(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                      = openData.unit;
        const currentValue              = unit.getFinalMoveRange();
        this._labelTitle.setLangText(TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(getMoveTypeName(unit.getMoveTypeId(), unit.getGcData()) ?? UndefinedError);
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
        this._labelTitle.setLangText(TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));
    }
    private _updateViewAsProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getCurrentProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(openData.war.getWarType())) && (currentValue != null));

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(getUnitName(
                getExisted(unit.getProduceUnitTypeId()),
                unit.getGcData()
            ) ?? UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.B0341);
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
        this._labelTitle.setText(`${getText(TextType.B1474)} ?`);
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
        this._labelTitle.setLangText(TextType.Promotion);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit                  = openData.unit;
        const currentValue          = unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex());
        this._labelTitle.setLangText(TextType.VisionRange);
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
        this._labelTitle.setLangText(TextType.B0698);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));

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
            this._labelExtraInfo.setText(getUnitCategoryName(
                getExisted(unit.getLoadUnitCategoryId()),
                war.getGcData()
            ) ?? UndefinedError);
        }
    }
    private _updateViewAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tagIdArray            = openData.unit.getTagIdArray(true);
        this._labelTitle.setLangText(TextType.Tags);
        this._labelValue.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`,`));
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.AiMode);
        this._labelValue.setText(getUnitAiModeName(openData.unit.getAiMode()) ?? UndefinedError);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const destination           = openData.unit.getAiWeightedDestination();
        this._labelTitle.setLangText(TextType.AiDestination);
        this._labelValue.setText(destination ? `${destination.gridIndex.getX()}, ${destination.gridIndex.getY()} (${destination.weight})` : `--`);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsForbiddenLocations(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const locationIdArray       = decode(openData.unit.getForbiddenGroupedLocationIdArray());
        this._labelTitle.setLangText(TextType.NoEntryLocations);
        this._labelValue.setText(!locationIdArray.length ? `--` : locationIdArray.join(`/`));
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const buffsCount            = openData.unit.getBuffList()?.length;
        this._labelTitle.setLangText(TextType.AbnormalStates);
        this._labelValue.setText(`${buffsCount > 0 ? buffsCount : `--`}`);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(openData.war.getWarType()));
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

        openPanel(getDict().BwUnitBuffListPanel, {
            unit        : unit,
            canModify   : unit.getWar().getCanCheat(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _modifyAsActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const state     = unit.getActionState();
        openPanel(getDict().CommonConfirmPanel, {
            getTitle       : () => getText(TextType.B0088),
            getContent     : () => getText(TextType.A0113),
            callback    : () => {
                unit.setActionState(state === ActionStateId.Acted ? ActionStateId.Idle : ActionStateId.Acted);
                unit.updateView();
                Idle.getInstance().apply(war.getActionPlanner());
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
        if (!checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const minValue  = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.BuildMaterial),
            currentValue    : unit.getCurrentBuildMaterial(),
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
        if (!checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const minValue      = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.FlareAmmo),
            currentValue    : unit.getFlareCurrentAmmo(),
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

        if (!checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentFuel();
        const maxValue  = unit.getMaxFuel();
        const minValue  = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Fuel),
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
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const isCoOnboard   = unit.getIsCoOnboard();
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0243),
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

        if (!checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const currValue = unit.getCurrentHp();
        const maxValue  = unit.getMaxHp();
        const minValue  = 1;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Hp),
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

        if (!checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const isDiving  = unit.getIsDiving();
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0114),
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
        if (!checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getPrimaryWeaponCurrentAmmo();
        const minValue  = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.PrimaryWeaponAmmo),
            currentValue    : currValue,
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
        if (!checkCanCheatInWar(openData.war.getWarType()) || (maxValue == null)) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentProduceMaterial();
        const minValue  = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.ProductionMaterial),
            currentValue    : currValue,
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
        if (!checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currValue = unit.getCurrentPromotion();
        const minValue  = 0;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Promotion),
            currentValue    : currValue,
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
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }

        if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
            show(getText(TextType.A0273));
            return;
        }

        const loaderUnit    = openData.unit;
        const maxLoadCount  = loaderUnit.getMaxLoadUnitsCount();
        if (!maxLoadCount) {
            return;
        }
        if (loaderUnit.getLoadedUnitsCount() >= maxLoadCount) {
            show(getText(TextType.A0274));
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const playerIndex   = loaderUnit.getPlayerIndex();
        const gameConfig    = loaderUnit.getGcData();
        openPanel(getDict().CommonChooseSingleUnitTypePanel, {
            getTitleText        : () => getText(TextType.B0098),
            playerIndex         : playerIndex,
            skinId              : loaderUnit.getSkinId(),
            overridingSkinId    : getRawOverridingSkinId(war, playerIndex),
            unitTypeArray       : gameConfig.getUnitTypesByCategory(getExisted(loaderUnit.getLoadUnitCategoryId())) ?? [],
            currentUnitType     : null,
            gameConfig          : gameConfig,
            callback            : unitType => {
                if ((!war.getIsRunning()) || (war.getIsExecutingAction())) {
                    show(getText(TextType.A0273));
                    return;
                }

                const unitMap   = war.getUnitMap();
                const unitId    = unitMap.getNextUnitId();
                const newUnit   = new (getUnitClass())();
                const unitData  = createDefault({
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
                Idle.getInstance().apply(war.getActionPlanner());

                dispatch(TypeId.BwUnitChanged, { gridIndex: loaderUnit.getGridIndex() } as BwUnitChanged);
            },
        });
    }
    private _modifyAsTag(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        openPanel(getDict().CommonChooseUnitTagPanel, {
            currentTagIdList        : unit.getTagIdArray(true),
            war                     : openData.war,
            callback                : tagIdArray => {
                unit.setGroupedTagId(getEncodedTagId(tagIdArray));
                this._updateView();
                show(getText(TextType.OperationSucceeded));
            },
        });
    }
    private _modifyAsAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (!checkCanCheatInWar(openData.war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit      = openData.unit;
        const aiMode    = unit.getAiMode();
        if (aiMode === AiModeId.NoMove) {
            unit.setAiMode(AiModeId.Normal);
        } else if (aiMode === AiModeId.Normal) {
            unit.setAiMode(AiModeId.WaitUntilCanAttack);
        } else {
            unit.setAiMode(AiModeId.NoMove);
        }
        this._updateView();
        show(getText(TextType.B0724));
    }
    private _modifyAsAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war   = openData.war;
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit          = openData.unit;
        const destination   = unit.getAiWeightedDestination();
        const mapSize       = war.getTileMap().getMapSize();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.gridIndex.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unit.setAiWeightedDestinationWithProto(null);
                    this._updateView();
                } else {
                    openPanel(getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => getText(TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.gridIndex.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unit.setAiWeightedDestinationWithProto(null);
                                this._updateView();
                            } else {
                                openPanel(getDict().CommonInputIntegerPanel, {
                                    getTitle           : () => getText(TextType.B1094),
                                    currentValue    : destination?.weight ?? 0,
                                    minValue        : -99999999,
                                    maxValue        : 99999999,
                                    getHelpText     : () => getText(TextType.A0432),
                                    callback        : value => {
                                        unit.setAiWeightedDestinationWithProto(WeightedGridIndex.fromJson({
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
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const unit = openData.unit;
        openPanel(getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : false,
            currentGroupedLocationIds       : unit.getForbiddenGroupedLocationIdArray().concat(),
            war                             : openData.war,
            getTitleText                    : () => getText(TextType.NoEntryLocations),
            callback                        : locationIdArray => {
                unit.setForbiddenGroupedLocationIdArray(encode(locationIdArray));
                this._updateView();
            }
        });
    }
    private _modifyAsBuff(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        openPanel(getDict().BwUnitBuffListPanel, {
            unit        : unit,
            canModify   : unit.getWar().getCanCheat(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedLabelAsAiMode(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.AiMode),
            getContent : () => getText(TextType.R0010),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForDamageRenderer extends UiListItemData {
    gameConfig          : GameConfig;
    index               : number;
    attackUnitType      : number;
    playerIndex         : number;
    targetUnitType?     : number;
    targetTileType?     : number;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
}
class DamageRenderer extends UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : IUiContainer;
    private readonly _imgBg!                : IUiImage;
    private readonly _conView!              : IUiContainer;
    private readonly _tileView!             : IUiImage;
    private readonly _labelPrimaryAttack!   : IUiLabel;
    private readonly _labelSecondaryAttack! : IUiLabel;
    private readonly _labelPrimaryDefend!   : IUiLabel;
    private readonly _labelSecondaryDefend! : IUiLabel;

    private readonly _unitView              = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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
            this._unitView.update(new UiUnitViewData({
                gameConfig          : gameConfig,
                skinId              : openData.skinId,
                overridingSkinId    : openData.overridingSkinId,
                unitData            : createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitTypeId  : targetUnitType,
                    unitId      : -1,
                    playerIndex : playerIndex,
                    gcData      : gameConfig,
                }),
            }), getUnitAnimationTickCount());

            const attackCfg                 = getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = getExisted(openData.targetTileType);
            const attackCfg                 = getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(getCachedTileObjectImageSource({
                version     : getSelfSettingsTextureVersion(),
                themeType   : ThemeTypeId.Normal,
                skinId      : SkinId.Neutral,
                objectType  : getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark      : false,
                shapeId     : 0,
                tickCount   : getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends UiListItemData {
    index           : number;
    gameConfig      : GameConfig;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _conView!          : IUiContainer;
    private readonly _labelMoveCost!    : IUiLabel;

    private readonly _tileView          = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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
        const moveCostCfg           = getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost              = moveCostCfg[getExisted(gameConfig.getUnitTemplateCfg(data.unitType)?.getMoveTypeId())].getCost();
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
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }
}
