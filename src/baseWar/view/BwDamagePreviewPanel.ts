import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as AuxiliaryTypesDamageCalculatorPlayerData from "../../auxiliaryTypes/DamageCalculatorPlayerData.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as DamageCalculatorsUtils from "../../damageCalculators/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

const getGridWidth          = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war: BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutAttack!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelAttackTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAttackValue!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutCounter!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCounterTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCounterValue!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCalculator!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupSettingsSwitch!  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupSettings!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupCoz!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCoz!               : UiInterfacesIUiImage.IUiImage;
    private readonly _groupCommandTower!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSubCommandTower!   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCommandTower!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgCommandTower!      : UiInterfacesIUiImage.IUiImage;
    private readonly _btnAddCommandTower!   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ZoomableContentsMoved,               callback: this._onNotifyZoomableContentsMoved },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: NotificationsTypeId.TypeId.BwCursorGridIndexChanged,            callback: this._onNotifyBwCursorGridIndexChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerMovePathChanged,        callback: this._onNotifyActionPlannerMovePathChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupCalculator,            callback: this._onTouchedGroupCalculator },
            { ui: this._groupSettingsSwitch,        callback: this._onTouchedGroupSettingsSwitch },
            { ui: this._groupCoz,                   callback: this._onTouchedGroupCoz },
            { ui: this._btnSubCommandTower,         callback: this._onTouchedBtnSubCommandTower },
            { ui: this._btnAddCommandTower,         callback: this._onTouchedBtnAddCommandTower },
        ]);
        this._btnAddCommandTower.setText(`+`);
        this._btnSubCommandTower.setText(`-`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyZoomableContentsMoved(): void {
        this._updatePosition();
    }
    private _onNotifyTileAnimationTick(): void {
        this._updateImgCommandTower();
    }
    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateImgCommandTower();
    }
    private _onNotifyBwCursorGridIndexChanged(): void {
        this._updateView();
    }
    private _onNotifyActionPlannerMovePathChanged(): void {
        this._updateView();
    }

    private _onTouchedGroupCalculator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const defenderGridIndex = war.getCursor().getGridIndex();
        const defenderUnit      = war.getUnitMap().getUnitOnMap(defenderGridIndex);
        if (defenderUnit == null) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            return;
        }

        const actionPlanner         = war.getActionPlanner();
        const tileMap               = war.getTileMap();
        const commonSettingsManager = war.getCommonSettingManager();
        const gameConfig            = war.getGcData();
        const allTiles              = tileMap.getAllTiles();
        const allCities             = allTiles.filter(v => v.getTileTypeId() === TilesConstantsCommon.TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === TilesConstantsCommon.TileTypeId.CommandTower);
        const attackerUnit          = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
        const attackerPlayer        = attackerUnit.getPlayer();
        const attackerGridIndex     = actionPlanner.getMovePathDestination().getGridIndex();
        const attackerPlayerIndex   = attackerUnit.getPlayerIndex();
        const attackerArmorType     = attackerUnit.getArmorType();
        const attackerTile          = tileMap.getTile(attackerGridIndex);
        const defenderArmorType     = defenderUnit.getArmorType();
        const defenderPlayer        = defenderUnit.getPlayer();
        const defenderPlayerIndex   = defenderUnit.getPlayerIndex();
        const defenderTile          = tileMap.getTile(defenderGridIndex);
        const hasFog                = war.getFogMap().checkHasFogCurrently();
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
        const canSeeHiddenInfo2     = (!hasFog) || (watcherTeamIndexes.has(defenderPlayer.getTeamIndex()));
        const coSkillType1          = attackerPlayer.getCoUsingSkillType();
        const coSkillType2          = defenderPlayer.getCoUsingSkillType();
        const getIsAffectedByCo1    = HelpersMisc.createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        const getIsAffectedByCo2    = HelpersMisc.createLazyFunc((): boolean => {
            if ((defenderUnit.getIsCoOnboard())  || (!gameConfig.getCoBasicCfg(defenderPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = defenderGridIndex.getMinDistance(defenderPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= defenderPlayer.getCoZoneRadius());
        });

        const warEventManager   = war.getWarEventManager();
        const attackerRule      = commonSettingsManager.getPlayerRule(attackerPlayerIndex);
        const defenderRule      = commonSettingsManager.getPlayerRule(defenderPlayerIndex);
        const attackerUpperLuck = attackerRule.getLuckUpperLimit() + warEventManager.getOpaLuckUpperLimitModifier(attackerUnit, attackerGridIndex);
        const attackerLowerLuck = attackerRule.getLuckLowerLimit() + warEventManager.getOpaLuckLowerLimitModifier(attackerUnit, attackerGridIndex);
        const defenderUpperLuck = defenderRule.getLuckUpperLimit() + warEventManager.getOpaLuckUpperLimitModifier(defenderUnit, defenderGridIndex);
        const defenderLowerLuck = defenderRule.getLuckLowerLimit() + warEventManager.getOpaLuckLowerLimitModifier(defenderUnit, defenderGridIndex);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType    : false,
            data                    : {
                gameConfig,
                weatherType     : war.getWeatherManager().getCurrentWeatherType(),
                attackerData    : new AuxiliaryTypesDamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId                    : attackerPlayer.getCoId(),
                    coSkillType             : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType1
                        : (getIsAffectedByCo1() ? CoSkillsConstants.SkillTypeId.Passive : null),
                    unitType                : attackerUnit.getUnitType(),
                    unitHp                  : attackerUnit.getCurrentHp(),
                    unitWeaponType          : (attackerUnit.getPrimaryWeaponBaseDamage(defenderArmorType) != null)
                        ? (UnitsConstants.WeaponTypeId.Primary)
                        : (attackerUnit.getSecondaryWeaponBaseDamage(defenderArmorType) != null
                            ? UnitsConstants.WeaponTypeId.Secondary
                            : null
                        ),
                    unitPromotion           : attackerUnit.getCurrentPromotion(),
                    tileType                : attackerTile.getTileTypeId(),
                    tileCustomBuildingData  : attackerTile.getCustomBuildingData(),
                    towersCount             : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                    offenseBonus            : attackerRule.getAttackPowerModifier() + warEventManager.getOpaAttackPowerModifier(attackerUnit, attackerGridIndex),
                    defenseBonus            : attackerRule.getDefenseModifier() + warEventManager.getOpaDefenseModifier(attackerUnit, attackerGridIndex),
                    upperLuck               : Math.max(attackerUpperLuck, attackerLowerLuck),
                    lowerLuck               : Math.min(attackerUpperLuck, attackerLowerLuck),
                    hasPrimaryAmmo          : !!attackerUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard               : attackerUnit.getIsCoOnboard(),
                    fund                    : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                    citiesCount             : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
                }),
                defenderData    : new AuxiliaryTypesDamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId                    : defenderPlayer.getCoId(),
                    coSkillType             : defenderPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType2
                        : (getIsAffectedByCo2() ? CoSkillsConstants.SkillTypeId.Passive : null),
                    unitType                : defenderUnit.getUnitType(),
                    unitHp                  : defenderUnit.getCurrentHp(),
                    unitWeaponType          : (defenderUnit.getPrimaryWeaponBaseDamage(attackerArmorType) != null)
                        ? (UnitsConstants.WeaponTypeId.Primary)
                        : (defenderUnit.getSecondaryWeaponBaseDamage(attackerArmorType) != null
                            ? UnitsConstants.WeaponTypeId.Secondary
                            : null
                        ),
                    unitPromotion           : defenderUnit.getCurrentPromotion(),
                    tileType                : defenderTile.getTileTypeId(),
                    tileCustomBuildingData  : defenderTile.getCustomBuildingData(),
                    towersCount             : allCommandTowers.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length,
                    offenseBonus            : defenderRule.getAttackPowerModifier() + warEventManager.getOpaAttackPowerModifier(defenderUnit, defenderGridIndex),
                    defenseBonus            : defenderRule.getDefenseModifier() + warEventManager.getOpaDefenseModifier(defenderUnit, defenderGridIndex),
                    upperLuck               : Math.max(defenderUpperLuck, defenderLowerLuck),
                    lowerLuck               : Math.min(defenderUpperLuck, defenderLowerLuck),
                    hasPrimaryAmmo          : !!defenderUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard               : defenderUnit.getIsCoOnboard(),
                    fund                    : canSeeHiddenInfo2 ? defenderPlayer.getFund() : 0,
                    citiesCount             : canSeeHiddenInfo2 ? allCities.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length : 0,
                }),
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSettingsSwitch(): void {
        const settings = this.getOpenData()?.war.getDamagePreviewSettings();
        if (settings == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (!settings.isEnabled) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0021),
            });
        }
        settings.isEnabled = !settings.isEnabled;
        this._updateView();
    }

    private _onTouchedGroupCoz(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const targetPlayerIndex = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayerIndex();
        if (targetPlayerIndex != null) {
            const settings          = war.getDamagePreviewSettings();
            const settingsForEnemy  = settings.settings.find(v => v.playerIndex === targetPlayerIndex);
            if (settingsForEnemy) {
                settingsForEnemy.isForcedInCoZone = !settingsForEnemy.isForcedInCoZone;
            } else {
                settings.settings.push({
                    playerIndex             : targetPlayerIndex,
                    isForcedInCoZone        : true,
                    extraCommandTowerCount  : 0,
                });
            }
            this._updateComponentsForDamage();
            this._updateGroupSettings();
        }
    }

    private _onTouchedBtnSubCommandTower(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const targetPlayerIndex = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayerIndex();
        if (targetPlayerIndex != null) {
            const settingsForEnemy = war.getDamagePreviewSettings().settings.find(v => v.playerIndex === targetPlayerIndex);
            if ((settingsForEnemy) && (settingsForEnemy.extraCommandTowerCount > 0)) {
                --settingsForEnemy.extraCommandTowerCount;

                this._updateComponentsForDamage();
                this._updateGroupSettings();
            }
        }
    }

    private _onTouchedBtnAddCommandTower(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const targetPlayerIndex = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayerIndex();
        if (targetPlayerIndex != null) {
            const settings          = war.getDamagePreviewSettings();
            const settingsForEnemy  = settings.settings.find(v => v.playerIndex === targetPlayerIndex);
            if (settingsForEnemy) {
                ++settingsForEnemy.extraCommandTowerCount;
            } else {
                settings.settings.push({
                    playerIndex             : targetPlayerIndex,
                    isForcedInCoZone        : false,
                    extraCommandTowerCount  : 1,
                });
            }
            this._updateComponentsForDamage();
            this._updateGroupSettings();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForDamage();
        this._updateGroupSettingsSwitch();
        this._updateGroupSettings();
        this._updatePosition();
    }
    private _updateComponentsForDamage(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const stateId       = actionPlanner.getStateId();
        const group         = this._group;

        if ((stateId === ActionPlannersConstants.StateId.ChoosingUnitMovePath)     ||
            (stateId === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget)
        ) {
            const attackerUnit  = actionPlanner.getFocusUnit();
            if (attackerUnit == null) {
                group.setIsVisible(false);
                return;
            }

            const unitMap       = war.getUnitMap();
            const rawMovePath   = actionPlanner.getMovePath();
            const movePath      = rawMovePath.map(v => v.getGridIndex());
            const gridIndex2    = war.getCursor().getGridIndex();
            if (!attackerUnit.checkCanAttackTargetAfterMovePath(movePath, gridIndex2)) {
                group.setIsVisible(false);
            } else {
                const pathLength        = rawMovePath.length;
                const destinationNode   = rawMovePath[pathLength - 1];
                const destination       = destinationNode.getGridIndex();
                const unitOnDestination = pathLength > 1 ? unitMap.getUnitOnMap(destination) : null;
                if (unitOnDestination) {
                    unitMap.removeUnitOnMap(destination, false);
                }

                const attackerUnitId    = attackerUnit.getUnitId();
                const battleInfo        = DamageCalculatorsUtils.getEstimatedBattleInfo({
                    war                         : war,
                    movePath1                   : movePath,
                    launchUnitId1               : attackerUnit.getLoaderUnitId() == null ? null : attackerUnitId,
                    gridIndex2                  : gridIndex2,
                    observerTeamIndexSet        : war instanceof GameHelpersGhFactory.getSpwWarClass() ? war.getPlayerManager().getTeamIndexSet([attackerUnit.getPlayerIndex()]) : null,
                    useDamagePreviewSettings    : true,
                    fuelConsumption             : destinationNode.getTotalMoveCost(),
                    isAttackUnit                : unitMap.getVisibleUnitOnMap(gridIndex2) != null,
                });
                if (unitOnDestination) {
                    unitMap.setUnitOnMap(unitOnDestination);
                }

                const target                            = unitMap.getUnitOnMap(gridIndex2) || war.getTileMap().getTile(gridIndex2);
                const { attackDamage, counterDamage }   = DamageCalculatorsUtils.getAttackAndCounterDamage({
                    battleDamageInfoArray   : battleInfo.damageInfoArray,
                    attackerUnitId          : attackerUnitId,
                    targetGridIndex         : gridIndex2,
                    unitMap                 : unitMap,
                });
                group.setIsVisible(true);
                this._labelAttackValue.setText(`${attackDamage == null ? `---` : attackDamage} / ${target.getCurrentHp()}`);
                this._labelCounterValue.setText(`${counterDamage == null ? `---` : counterDamage} / ${attackerUnit.getCurrentHp()}`);
                this._layoutAttack.arrangeItems();
                this._layoutCounter.arrangeItems();
            }

        } else {
            group.setIsVisible(false);
        }
    }
    private _updateGroupSettingsSwitch(): void {
        this._groupSettingsSwitch.setIsVisible(!(this.getOpenData()?.war instanceof GameHelpersGhFactory.getRwWarBaseClass()));
    }
    private _updateGroupSettings(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const group         = this._group;
        const groupSettings = this._groupSettings;
        const settings      = war.getDamagePreviewSettings();
        if (!settings.isEnabled) {
            if (groupSettings.getIsVisible()) {
                groupSettings.setIsVisible(false);
                group.setUnscaledManualHeight(group.getUnscaledHeight() - groupSettings.getScaledHeight());
            }
            return;
        }

        {
            if (!groupSettings.getIsVisible()) {
                groupSettings.setIsVisible(true);
                group.setUnscaledManualHeight(group.getUnscaledHeight() + groupSettings.getScaledHeight());
            }
        }

        const targetPlayerIndex = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayerIndex();
        const settingsForEnemy  = settings.settings.find(v => v.playerIndex === targetPlayerIndex);
        this._imgCoz.setIsVisible(!!settingsForEnemy?.isForcedInCoZone);
        this._labelCommandTower.setText(`+${settingsForEnemy?.extraCommandTowerCount ?? 0}`);

        this._updateImgCommandTower();
        this._groupCommandTower.arrangeItems();
    }
    private _updateImgCommandTower(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const targetPlayer = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayer();
        this._imgCommandTower.loadSource(CommonModelCommonModel.getCachedTileObjectImageSource({
            version     : UsersModel.getSelfSettingsTextureVersion(),
            themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
            skinId      : targetPlayer?.getUnitAndTileSkinId() ?? 0,
            shapeId     : 0,
            objectType  : TilesConstantsCommon.ObjectTypeId.CommandTower,
            isDark      : false,
            tickCount   : CommonModelCommonModel.getTileAnimationTickCount(),
        }));
    }

    private _updatePosition(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const container     = war.getView().getFieldContainer();
        const gridIndex     = war.getCursor().getGridIndex();
        const stage         = StagesStageManager.getStage();
        const group         = this._group;
        const groupWidth    = group.getUnscaledWidth();
        const groupHeight   = group.getUnscaledHeight();
        const point         = container.getContentsContainerLocalToGlobal({
            x: (gridIndex.getX() + 0.5) * getGridWidth(),
            y: (gridIndex.getY()) * getGridHeight(),
        });
        group.setX(Math.max(0, Math.min(point.x - groupWidth / 2, stage.stageWidth - groupWidth)));
        // 原本设计为预览框永远位于画面内，但有玩家反馈会导致操作阻挡，因此改成可以超出屏幕上沿
        // group.setY(Math.max(40, Math.min(point.y - groupHeight, stage.stageHeight - groupHeight)));
        group.setY(Math.max(-(groupHeight - 40), Math.min(point.y - groupHeight, stage.stageHeight - groupHeight)));
    }

    private _updateComponentsForLanguage(): void {
        this._labelAttackTitle.setText(LangUtils.getText(LangConstants.TextType.B0077));
        this._labelCounterTitle.setText(LangUtils.getText(LangConstants.TextType.B0078));

        this._layoutAttack.arrangeItems();
        this._layoutCounter.arrangeItems();
    }
}
