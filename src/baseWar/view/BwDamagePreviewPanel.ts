import { StateId } from "../../actionPlanners/Constants.ts";
import { DamageCalculatorPlayerData } from "../../auxiliaryTypes/DamageCalculatorPlayerData.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getCachedTileObjectImageSource, getTileAnimationTickCount } from "../../common/model/CommonModel.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getEstimatedBattleInfo, getAttackAndCounterDamage } from "../../damageCalculators/Utils.ts";
import { getSpwWarClass, getRwWarBaseClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import { createLazyFunc, getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getStage } from "../../stages/StageManager.ts";
import { TileTypeId, ThemeTypeId, ObjectTypeId } from "../../tiles/constants/Common.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { WeaponTypeId } from "../../units/Constants.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";

const getGridWidth          = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war: IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!                : IUiContainer;

    private readonly _layoutAttack!         : IUiLayout;
    private readonly _labelAttackTitle!     : IUiLabel;
    private readonly _labelAttackValue!     : IUiLabel;
    private readonly _layoutCounter!        : IUiLayout;
    private readonly _labelCounterTitle!    : IUiLabel;
    private readonly _labelCounterValue!    : IUiLabel;

    private readonly _groupCalculator!      : IUiContainer;
    private readonly _groupSettingsSwitch!  : IUiContainer;

    private readonly _groupSettings!        : IUiContainer;
    private readonly _groupCoz!             : IUiContainer;
    private readonly _imgCoz!               : IUiImage;
    private readonly _groupCommandTower!    : IUiLayout;
    private readonly _btnSubCommandTower!   : IUiButton;
    private readonly _labelCommandTower!    : IUiLabel;
    private readonly _imgCommandTower!      : IUiImage;
    private readonly _btnAddCommandTower!   : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.ZoomableContentsMoved,               callback: this._onNotifyZoomableContentsMoved },
            { type: TypeId.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: TypeId.BwCursorGridIndexChanged,            callback: this._onNotifyBwCursorGridIndexChanged },
            { type: TypeId.ActionPlannerMovePathChanged,        callback: this._onNotifyActionPlannerMovePathChanged },
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
            playShortSfx(ShortSfxCode.ButtonForbidden01);
            return;
        }

        const actionPlanner         = war.getActionPlanner();
        const tileMap               = war.getTileMap();
        const commonSettingsManager = war.getCommonSettingManager();
        const gameConfig            = war.getGcData();
        const allTiles              = tileMap.getAllTiles();
        const allCities             = allTiles.filter(v => v.getTileTypeId() === TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === TileTypeId.CommandTower);
        const attackerUnit          = getExisted(actionPlanner.getFocusUnit());
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
        const getIsAffectedByCo1    = createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        const getIsAffectedByCo2    = createLazyFunc((): boolean => {
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
        openPanel(getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType    : false,
            data                    : {
                gameConfig,
                weatherType     : war.getWeatherManager().getCurrentWeatherType(),
                attackerData    : new DamageCalculatorPlayerData({
                    coId                    : attackerPlayer.getCoId(),
                    coSkillType             : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType1
                        : (getIsAffectedByCo1() ? SkillTypeId.Passive : null),
                    unitType                : attackerUnit.getUnitType(),
                    unitHp                  : attackerUnit.getCurrentHp(),
                    unitWeaponType          : (attackerUnit.getPrimaryWeaponBaseDamage(defenderArmorType) != null)
                        ? (WeaponTypeId.Primary)
                        : (attackerUnit.getSecondaryWeaponBaseDamage(defenderArmorType) != null
                            ? WeaponTypeId.Secondary
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
                defenderData    : new DamageCalculatorPlayerData({
                    coId                    : defenderPlayer.getCoId(),
                    coSkillType             : defenderPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType2
                        : (getIsAffectedByCo2() ? SkillTypeId.Passive : null),
                    unitType                : defenderUnit.getUnitType(),
                    unitHp                  : defenderUnit.getCurrentHp(),
                    unitWeaponType          : (defenderUnit.getPrimaryWeaponBaseDamage(attackerArmorType) != null)
                        ? (WeaponTypeId.Primary)
                        : (defenderUnit.getSecondaryWeaponBaseDamage(attackerArmorType) != null
                            ? WeaponTypeId.Secondary
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
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSettingsSwitch(): void {
        const settings = this.getOpenData()?.war.getDamagePreviewSettings();
        if (settings == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (!settings.isEnabled) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getText(TextType.A0021),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

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

        if ((stateId === StateId.ChoosingUnitMovePath)     ||
            (stateId === StateId.ChoosingUnitAttackTarget)
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
                const battleInfo        = getEstimatedBattleInfo({
                    war                         : war,
                    movePath1                   : movePath,
                    launchUnitId1               : attackerUnit.getLoaderUnitId() == null ? null : attackerUnitId,
                    gridIndex2                  : gridIndex2,
                    observerTeamIndexSet        : war instanceof getSpwWarClass() ? war.getPlayerManager().getTeamIndexSet([attackerUnit.getPlayerIndex()]) : null,
                    useDamagePreviewSettings    : true,
                    fuelConsumption             : destinationNode.getTotalMoveCost(),
                    isAttackUnit                : unitMap.getVisibleUnitOnMap(gridIndex2) != null,
                });
                if (unitOnDestination) {
                    unitMap.setUnitOnMap(unitOnDestination);
                }

                const target                            = unitMap.getUnitOnMap(gridIndex2) || war.getTileMap().getTile(gridIndex2);
                const { attackDamage, counterDamage }   = getAttackAndCounterDamage({
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
        this._groupSettingsSwitch.setIsVisible(!(this.getOpenData()?.war instanceof getRwWarBaseClass()));
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
        this._imgCommandTower.loadSource(getCachedTileObjectImageSource({
            version     : getSelfSettingsTextureVersion(),
            themeType   : ThemeTypeId.Normal,
            skinId      : targetPlayer?.getUnitAndTileSkinId() ?? 0,
            shapeId     : 0,
            objectType  : ObjectTypeId.CommandTower,
            isDark      : false,
            tickCount   : getTileAnimationTickCount(),
        }));
    }

    private _updatePosition(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const container     = war.getView().getFieldContainer();
        const gridIndex     = war.getCursor().getGridIndex();
        const stage         = getStage();
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
        this._labelAttackTitle.setLangText(TextType.B0077);
        this._labelCounterTitle.setLangText(TextType.B0078);

        this._layoutAttack.arrangeItems();
        this._layoutCounter.arrangeItems();
    }
}
