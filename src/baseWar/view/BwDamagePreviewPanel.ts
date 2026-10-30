import {
    AuxiliaryTypes_DamageCalculatorPlayerData,
    DamageCalculators_Utils,
    Common_Model_CommonModel,
    ReplayWar_Model_RwWarBase,
    CoSkills_Constants,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    type BaseWar_Interface_IBwWar,
    Helpers_Misc,
    Graphics_Utils,
    GamePanels_Dict,
    Users_Model,
    Stages_StageManager,
    Lang_Utils,
    Tiles_Constants_Common,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Units_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

const getGridWidth          = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export interface OpenData {
    war: BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutAttack!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelAttackTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAttackValue!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutCounter!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCounterTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCounterValue!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCalculator!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupSettingsSwitch!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupSettings!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupCoz!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCoz!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupCommandTower!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSubCommandTower!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCommandTower!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgCommandTower!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnAddCommandTower!   : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.ZoomableContentsMoved,               callback : this._onNotifyZoomableContentsMoved },
            { type : Notifications_TypeId.TypeId.TileAnimationTick,                   callback : this._onNotifyTileAnimationTick },
            { type : Notifications_TypeId.TypeId.UnitAndTileTextureVersionChanged,    callback : this._onNotifyUnitAndTileTextureVersionChanged },
            { type : Notifications_TypeId.TypeId.BwCursorGridIndexChanged,            callback : this._onNotifyBwCursorGridIndexChanged },
            { type : Notifications_TypeId.TypeId.ActionPlannerMovePathChanged,        callback : this._onNotifyActionPlannerMovePathChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._groupCalculator,            callback : this._onTouchedGroupCalculator },
            { ui : this._groupSettingsSwitch,        callback : this._onTouchedGroupSettingsSwitch },
            { ui : this._groupCoz,                   callback : this._onTouchedGroupCoz },
            { ui : this._btnSubCommandTower,         callback : this._onTouchedBtnSubCommandTower },
            { ui : this._btnAddCommandTower,         callback : this._onTouchedBtnAddCommandTower },
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
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            return;
        }

        const actionPlanner         = war.getActionPlanner();
        const tileMap               = war.getTileMap();
        const commonSettingsManager = war.getCommonSettingManager();
        const gameConfig            = war.getGcData();
        const allTiles              = tileMap.getAllTiles();
        const allCities             = allTiles.filter(v => v.getTileTypeId() === Tiles_Constants_Common.TileTypeId.City);
        const allCommandTowers      = allTiles.filter(v => v.getTileTypeId() === Tiles_Constants_Common.TileTypeId.CommandTower);
        const attackerUnit          = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
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
        const getIsAffectedByCo1    = Helpers_Misc.createLazyFunc((): boolean => {
            if ((attackerUnit.getIsCoOnboard()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.getMaxBoardCount())) {
                return true;
            }

            const distance = attackerGridIndex.getMinDistance(attackerPlayer.getCoGridIndexListOnMap());
            return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
        });
        const getIsAffectedByCo2    = Helpers_Misc.createLazyFunc((): boolean => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageCalculatorPanel, {
            war,
            needReviseWeaponType : false,
            data                 : {
                gameConfig,
                weatherType  : war.getWeatherManager().getCurrentWeatherType(),
                attackerData : new AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId        : attackerPlayer.getCoId(),
                    coSkillType : attackerPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType1
                        : (getIsAffectedByCo1() ? CoSkills_Constants.SkillTypeId.Passive : null),
                    unitType       : attackerUnit.getUnitType(),
                    unitHp         : attackerUnit.getCurrentHp(),
                    unitWeaponType : (attackerUnit.getPrimaryWeaponBaseDamage(defenderArmorType) != null)
                        ? (Units_Constants.WeaponTypeId.Primary)
                        : (attackerUnit.getSecondaryWeaponBaseDamage(defenderArmorType) != null
                            ? Units_Constants.WeaponTypeId.Secondary
                            : null
                        ),
                    unitPromotion          : attackerUnit.getCurrentPromotion(),
                    tileType               : attackerTile.getTileTypeId(),
                    tileCustomBuildingData : attackerTile.getCustomBuildingData(),
                    towersCount            : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                    offenseBonus           : attackerRule.getAttackPowerModifier() + warEventManager.getOpaAttackPowerModifier(attackerUnit, attackerGridIndex),
                    defenseBonus           : attackerRule.getDefenseModifier() + warEventManager.getOpaDefenseModifier(attackerUnit, attackerGridIndex),
                    upperLuck              : Math.max(attackerUpperLuck, attackerLowerLuck),
                    lowerLuck              : Math.min(attackerUpperLuck, attackerLowerLuck),
                    hasPrimaryAmmo         : !!attackerUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard              : attackerUnit.getIsCoOnboard(),
                    fund                   : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                    citiesCount            : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
                }),
                defenderData : new AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData({
                    coId        : defenderPlayer.getCoId(),
                    coSkillType : defenderPlayer.checkCoIsUsingActiveSkill()
                        ? coSkillType2
                        : (getIsAffectedByCo2() ? CoSkills_Constants.SkillTypeId.Passive : null),
                    unitType       : defenderUnit.getUnitType(),
                    unitHp         : defenderUnit.getCurrentHp(),
                    unitWeaponType : (defenderUnit.getPrimaryWeaponBaseDamage(attackerArmorType) != null)
                        ? (Units_Constants.WeaponTypeId.Primary)
                        : (defenderUnit.getSecondaryWeaponBaseDamage(attackerArmorType) != null
                            ? Units_Constants.WeaponTypeId.Secondary
                            : null
                        ),
                    unitPromotion          : defenderUnit.getCurrentPromotion(),
                    tileType               : defenderTile.getTileTypeId(),
                    tileCustomBuildingData : defenderTile.getCustomBuildingData(),
                    towersCount            : allCommandTowers.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length,
                    offenseBonus           : defenderRule.getAttackPowerModifier() + warEventManager.getOpaAttackPowerModifier(defenderUnit, defenderGridIndex),
                    defenseBonus           : defenderRule.getDefenseModifier() + warEventManager.getOpaDefenseModifier(defenderUnit, defenderGridIndex),
                    upperLuck              : Math.max(defenderUpperLuck, defenderLowerLuck),
                    lowerLuck              : Math.min(defenderUpperLuck, defenderLowerLuck),
                    hasPrimaryAmmo         : !!defenderUnit.getPrimaryWeaponCurrentAmmo(),
                    coOnboard              : defenderUnit.getIsCoOnboard(),
                    fund                   : canSeeHiddenInfo2 ? defenderPlayer.getFund() : 0,
                    citiesCount            : canSeeHiddenInfo2 ? allCities.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length : 0,
                }),
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSettingsSwitch(): void {
        const settings = this.getOpenData()?.war.getDamagePreviewSettings();
        if (settings == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (!settings.isEnabled) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0021),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const targetPlayerIndex = war.getUnitMap().getUnitOnMap(war.getCursor().getGridIndex())?.getPlayerIndex();
        if (targetPlayerIndex != null) {
            const settings          = war.getDamagePreviewSettings();
            const settingsForEnemy  = settings.settings.find(v => v.playerIndex === targetPlayerIndex);
            if (settingsForEnemy) {
                settingsForEnemy.isForcedInCoZone = !settingsForEnemy.isForcedInCoZone;
            } else {
                settings.settings.push({
                    playerIndex            : targetPlayerIndex,
                    isForcedInCoZone       : true,
                    extraCommandTowerCount : 0,
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
                    playerIndex            : targetPlayerIndex,
                    isForcedInCoZone       : false,
                    extraCommandTowerCount : 1,
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

        if ((stateId === ActionPlanners_Constants.StateId.ChoosingUnitMovePath)     ||
            (stateId === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget)
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
                const battleInfo        = DamageCalculators_Utils.getEstimatedBattleInfo({
                    war                      : war,
                    movePath1                : movePath,
                    launchUnitId1            : attackerUnit.getLoaderUnitId() == null ? null : attackerUnitId,
                    gridIndex2               : gridIndex2,
                    observerTeamIndexSet     : war instanceof SinglePlayerWar_Model_SpwWar.SpwWar ? war.getPlayerManager().getTeamIndexSet([attackerUnit.getPlayerIndex()]) : null,
                    useDamagePreviewSettings : true,
                    fuelConsumption          : destinationNode.getTotalMoveCost(),
                    isAttackUnit             : unitMap.getVisibleUnitOnMap(gridIndex2) != null,
                });
                if (unitOnDestination) {
                    unitMap.setUnitOnMap(unitOnDestination);
                }

                const target                            = unitMap.getUnitOnMap(gridIndex2) || war.getTileMap().getTile(gridIndex2);
                const { attackDamage, counterDamage }   = DamageCalculators_Utils.getAttackAndCounterDamage({
                    battleDamageInfoArray : battleInfo.damageInfoArray,
                    attackerUnitId        : attackerUnitId,
                    targetGridIndex       : gridIndex2,
                    unitMap               : unitMap,
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
        this._groupSettingsSwitch.setIsVisible(!(this.getOpenData()?.war instanceof ReplayWar_Model_RwWarBase.RwWarBase));
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
        this._imgCommandTower.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
            version    : Users_Model.getSelfSettingsTextureVersion(),
            themeType  : Tiles_Constants_Common.ThemeTypeId.Normal,
            skinId     : targetPlayer?.getUnitAndTileSkinId() ?? 0,
            shapeId    : 0,
            objectType : Tiles_Constants_Common.ObjectTypeId.CommandTower,
            isDark     : false,
            tickCount  : Common_Model_CommonModel.getTileAnimationTickCount(),
        }));
    }

    private _updatePosition(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const container     = war.getView().getFieldContainer();
        const gridIndex     = war.getCursor().getGridIndex();
        const stage         = Stages_StageManager.getStage();
        const group         = this._group;
        const groupWidth    = group.getUnscaledWidth();
        const groupHeight   = group.getUnscaledHeight();
        const point         = container.getContentsContainerLocalToGlobal({
            x : (gridIndex.getX() + 0.5) * getGridWidth(),
            y : (gridIndex.getY()) * getGridHeight(),
        });
        group.setX(Math.max(0, Math.min(point.x - groupWidth / 2, stage.stageWidth - groupWidth)));
        // 原本设计为预览框永远位于画面内，但有玩家反馈会导致操作阻挡，因此改成可以超出屏幕上沿
        // group.setY(Math.max(40, Math.min(point.y - groupHeight, stage.stageHeight - groupHeight)));
        group.setY(Math.max(-(groupHeight - 40), Math.min(point.y - groupHeight, stage.stageHeight - groupHeight)));
    }

    private _updateComponentsForLanguage(): void {
        this._labelAttackTitle.setLangText(Lang_Constants.TextType.B0077);
        this._labelCounterTitle.setLangText(Lang_Constants.TextType.B0078);

        this._layoutAttack.arrangeItems();
        this._layoutCounter.arrangeItems();
    }
}
