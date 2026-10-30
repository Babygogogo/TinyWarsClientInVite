import {
    Tiles_Utils_Common,
    TileObjects_Utils,
    GamePanels_Manager,
    Cos_Constants,
    Helpers_Misc,
    AuxiliaryTypes_DamageCalculatorPlayerData,
    PlayerRules_Constants,
    Helpers_Text,
    GameConfigs_GameConfig,
    Helpers_ImageSource,
    Lang_Utils,
    DamageCalculators_Utils,
    ForceSkins_Utils,
    TileBases_Utils,
    GamePanels_Dict,
    GameConfigs_Provider,
    CoSkills_Utils_Persistent_SelfUnitDefense,
    CoSkills_Utils_Persistent_SelfUnitLuckRange,
    CoSkills_Utils_Persistent_SelfUnitOffense,
    Tiles_Constants_Common,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    CoSkills_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Types_UiTileViewData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Utils_Serialization,
    Units_Utils_Common,
    Common_Model_CommonModel,
    Units_Constants,
    type Units_IUnit,
} from "../../internal.ts";
import type { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";

type CalculatorData = {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    weatherType     : number;
    attackerData    : AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData;
    defenderData    : AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData;
};
type DamageInfo = {
    damage      : number;
    times       : number;
    possibility : number;
};
type DamageRange = {
    minDamage   : number;
    maxDamage   : number;
};
let _savedData: CalculatorData | null = null;

export interface OpenData {
    war                     : BaseWar_Interface_IBwWar.IBwWar | null;
    data                    : CalculatorData | null;
    needReviseWeaponType    : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayer1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSelect1!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayer2!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSelect2!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _imgCo1!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo2!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnSkill1!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSkill2!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _conTileView1!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView2!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnTileView1!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTileView2!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _conUnitView1!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conUnitView2!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnUnitView1!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnitView2!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnHp1!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHp2!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelHp1!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHp2!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnWeapon1!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnWeapon2!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelWeapon1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWeapon2!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnPromotion1!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPromotion2!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPromotion1!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPromotion2!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTower1!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTower2!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTower1!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTower2!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnOffenseBonus1!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOffenseBonus2!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelOffenseBonus1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOffenseBonus2!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDefenseBonus1!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDefenseBonus2!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelDefenseBonus1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDefenseBonus2!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnLuck1!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLuck2!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelLuck1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLuck2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCoOnboard1!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCoOnboard2!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCoOnboard1!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCoOnboard2!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnFund1!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFund2!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelFund1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFund2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCity1!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCity2!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCity1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCity2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnSwitchPlayer!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSaveState!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLoadState!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnWeather!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelWeather!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutDamage!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutAttackDamage!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelAttackTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAttackDamage!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutDefendDamage!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefendTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDefendDamage!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView1             = new Ui_Components_UiUnitView.UiUnitView();
    private readonly _unitView2             = new Ui_Components_UiUnitView.UiUnitView();
    private readonly _tileView1             = new Ui_Components_UiTileView.UiTileView();
    private readonly _tileView2             = new Ui_Components_UiTileView.UiTileView();

    private _calculatorData?                : CalculatorData;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnClose,                   callback : this.closePanel },

            { ui : this._btnSelect1,                 callback : this._onTouchedBtnSelect1 },
            { ui : this._btnSelect2,                 callback : this._onTouchedBtnSelect2 },
            { ui : this._imgCo1,                     callback : this._onTouchedImgCo1 },
            { ui : this._imgCo2,                     callback : this._onTouchedImgCo2 },
            { ui : this._btnSkill1,                  callback : this._onTouchedBtnSkill1 },
            { ui : this._btnSkill2,                  callback : this._onTouchedBtnSkill2 },
            { ui : this._btnUnitView1,               callback : this._onTouchedBtnUnitView1 },
            { ui : this._btnUnitView2,               callback : this._onTouchedBtnUnitView2 },
            { ui : this._btnTileView1,               callback : this._onTouchedBtnTileView1 },
            { ui : this._btnTileView2,               callback : this._onTouchedBtnTileView2 },
            { ui : this._btnHp1,                     callback : this._onTouchedBtnHp1 },
            { ui : this._btnHp2,                     callback : this._onTouchedBtnHp2 },
            { ui : this._btnWeapon1,                 callback : this._onTouchedBtnWeapon1 },
            { ui : this._btnWeapon2,                 callback : this._onTouchedBtnWeapon2 },
            { ui : this._btnPromotion1,              callback : this._onTouchedBtnPromotion1 },
            { ui : this._btnPromotion2,              callback : this._onTouchedBtnPromotion2 },
            { ui : this._btnTower1,                  callback : this._onTouchedBtnTower1 },
            { ui : this._btnTower2,                  callback : this._onTouchedBtnTower2 },
            { ui : this._btnOffenseBonus1,           callback : this._onTouchedBtnOffenseBonus1 },
            { ui : this._btnOffenseBonus2,           callback : this._onTouchedBtnOffenseBonus2 },
            { ui : this._btnDefenseBonus1,           callback : this._onTouchedBtnDefenseBonus1 },
            { ui : this._btnDefenseBonus2,           callback : this._onTouchedBtnDefenseBonus2 },
            { ui : this._btnLuck1,                   callback : this._onTouchedBtnLuck1 },
            { ui : this._btnLuck2,                   callback : this._onTouchedBtnLuck2 },
            { ui : this._btnCoOnboard1,              callback : this._onTouchedBtnCoOnboard1 },
            { ui : this._btnCoOnboard2,              callback : this._onTouchedBtnCoOnboard2 },
            { ui : this._btnFund1,                   callback : this._onTouchedBtnFund1 },
            { ui : this._btnFund2,                   callback : this._onTouchedBtnFund2 },
            { ui : this._btnCity1,                   callback : this._onTouchedBtnCity1 },
            { ui : this._btnCity2,                   callback : this._onTouchedBtnCity2 },
            { ui : this._btnSwitchPlayer,            callback : this._onTouchedBtnSwitchPlayer },
            { ui : this._btnSaveState,               callback : this._onTouchedBtnSaveState },
            { ui : this._btnLoadState,               callback : this._onTouchedBtnLoadState },
            { ui : this._btnWeather,                 callback : this._onTouchedBtnWeather },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UnitAnimationTick,   callback : this._onNotifyUnitAnimationTick },
            { type : Notifications_TypeId.TypeId.TileAnimationTick,   callback : this._onNotifyTileAnimationTick },
        ]);

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._imgCo1.setIsTouchEnabled(true);
        this._imgCo2.setIsTouchEnabled(true);
        this._conUnitView1.addUiChild(this._unitView1);
        this._conUnitView2.addUiChild(this._unitView2);

        {
            const conTileView   = this._conTileView1;
            const tileView      = this._tileView1;
            conTileView.addUiChild(tileView.getImgBase());
            conTileView.addUiChild(tileView.getImgDecoration());
            conTileView.addUiChild(tileView.getImgObject());
        }

        {
            const conTileView   = this._conTileView2;
            const tileView      = this._tileView2;
            conTileView.addUiChild(tileView.getImgBase());
            conTileView.addUiChild(tileView.getImgDecoration());
            conTileView.addUiChild(tileView.getImgObject());
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const calculatorData = openData.data;
        this._setCalculatorData(calculatorData ? cloneCalculatorData(calculatorData) : await createDefaultCalculatorData());
        if (openData.needReviseWeaponType) {
            this._reviseWeaponType();
        }

        this._updateView();
    }

    public static createDefaultPlayerData(gameConfig: GameConfigs_GameConfig.GameConfig): AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData {
        const unitType = gameConfig.getFirstUnitType();
        return new AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData({
            coId                   : Cos_Constants.CoId.Empty,
            coSkillType            : CoSkills_Constants.SkillTypeId.Passive,
            unitType               : unitType,
            unitHp                 : Units_Constants.Hp.MaxHp,
            unitWeaponType         : Units_Constants.WeaponTypeId.Primary,
            unitPromotion          : 0,
            tileType               : Helpers_Misc.getExisted(gameConfig.getTileType(TileBases_Utils.getDefaultTileBaseType(), Tiles_Constants_Common.ObjectTypeId.Empty)),
            tileCustomBuildingData : null,
            towersCount            : 0,
            offenseBonus           : 0,
            defenseBonus           : 0,
            upperLuck              : gameConfig.getSystemCfg().getDefaultLuckUpperLimit(),
            lowerLuck              : PlayerRules_Constants.Luck.DefaultLowerLimit,
            coOnboard              : false,
            hasPrimaryAmmo         : !!gameConfig.getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo(),
            fund                   : 0,
            citiesCount            : 0,
        });
    }

    private _setCalculatorData(data: CalculatorData): void {
        this._calculatorData = data;
    }
    private _getCalculatorData(): CalculatorData {
        return Helpers_Misc.getExisted(this._calculatorData);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1111),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0033),
        });
    }

    private _onTouchedBtnSelect1(): void {
        const war = Helpers_Misc.getExisted(this.getOpenData()?.war);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitListPanel, {
            war                   : war,
            callbackForMoveCursor : () => {
                // nothing to do
            },
            callbackForSelectUnit : unit => {
                this._getCalculatorData().attackerData = this._createPlayerDataForUnit(unit);
                this._reviseWeaponType();
                this._updateView();
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitListPanel);
            },
        });
    }
    private _onTouchedBtnSelect2(): void {
        const war = Helpers_Misc.getExisted(this.getOpenData()?.war);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitListPanel, {
            war                   : war,
            callbackForMoveCursor : () => {
                // nothing to do
            },
            callbackForSelectUnit : unit => {
                this._getCalculatorData().defenderData = this._createPlayerDataForUnit(unit);
                this._reviseWeaponType();
                this._updateView();
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitListPanel);
            },
        });
    }
    private _createPlayerDataForUnit(attackerUnit: Units_IUnit.IUnit): AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData {
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
        return new AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData({
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
        });
    }

    private _onTouchedImgCo1(): void {
        this._handleTouchedImgCo(this._getCalculatorData().attackerData);
    }
    private _onTouchedImgCo2(): void {
        this._handleTouchedImgCo(this._getCalculatorData().defenderData);
    }
    private _handleTouchedImgCo(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : gameConfig,
            currentCoId        : playerData.coId,
            availableCoIdArray : gameConfig.getAllEnabledCoArray().map(v => v.getCoId()),
            isBan              : false,
            callbackOnConfirm  : newCoId => {
                playerData.coId = newCoId;
                this._updateView();
            },
        });

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnSkill1(): void {
        this._handleTouchedBtnSkill(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnSkill2(): void {
        this._handleTouchedBtnSkill(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnSkill(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        playerData.coSkillType  = getNextCoSkillType(this._getCalculatorData().gameConfig, playerData.coId, playerData.coSkillType);
        this._updateView();
    }

    private _onTouchedBtnUnitView1(): void {
        this._handleTouchedConUnitView(this.getOpenData()?.war, this._getCalculatorData().attackerData, 1);
    }
    private _onTouchedBtnUnitView2(): void {
        this._handleTouchedConUnitView(this.getOpenData()?.war, this._getCalculatorData().defenderData, 2);
    }
    private _handleTouchedConUnitView(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>, playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData, playerIndex: number): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleUnitTypePanel, {
            gameConfig       : gameConfig,
            currentUnitType  : playerData.unitType,
            unitTypeArray    : gameConfig.getAllUnitTypeArray(),
            playerIndex      : playerIndex,
            skinId           : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : war == null ? undefined : ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex),
            callback         : unitType => {
                if (playerData.unitType !== unitType) {
                    playerData.unitType         = unitType;
                    playerData.hasPrimaryAmmo   = !!gameConfig.getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo();

                    this._reviseWeaponType();
                    this._updateView();
                }
            },
        });
    }
    private _reviseWeaponType(): void {
        const calculatorData    = this._getCalculatorData();
        const playerData1       = calculatorData.attackerData;
        const playerData2       = calculatorData.defenderData;
        this._doReviseWeaponType(playerData1, playerData2);
        this._doReviseWeaponType(playerData2, playerData1);
    }
    private _doReviseWeaponType(playerData1: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData, playerData2: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const gameConfig    = this._getCalculatorData().gameConfig;
        const armorType2    = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(playerData2.unitType)?.getArmorTypeId());
        const damageCfg     = (gameConfig.getDamageChartCfgs(playerData1.unitType) ?? {})[armorType2];
        if ((damageCfg[Units_Constants.WeaponTypeId.Primary].getDamage() != null) && (playerData1.hasPrimaryAmmo)) {
            playerData1.unitWeaponType = Units_Constants.WeaponTypeId.Primary;
        } else if (damageCfg[Units_Constants.WeaponTypeId.Secondary].getDamage() != null) {
            playerData1.unitWeaponType = Units_Constants.WeaponTypeId.Secondary;
        } else {
            playerData1.unitWeaponType = null;
        }
    }

    private _onTouchedBtnTileView1(): void {
        this._handleTouchedConTileView(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnTileView2(): void {
        this._handleTouchedConTileView(this._getCalculatorData().defenderData);
    }
    private _handleTouchedConTileView(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleTileTypePanel, {
            gameConfig      : gameConfig,
            currentTileType : playerData.tileType,
            tileTypeArray   : gameConfig.getTileTypeArrayForTileChart(),
            callback        : tileType => {
                playerData.tileType = tileType;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnHp1(): void {
        this._handleTouchedBtnHp(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnHp2(): void {
        this._handleTouchedBtnHp(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnHp(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.unitHp;
        const minValue      = 1;
        const maxValue      = Units_Constants.Hp.MaxHp;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.unitHp = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnWeapon1(): void {
        this._handleTouchedBtnWeapon(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnWeapon2(): void {
        this._handleTouchedBtnWeapon(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnWeapon(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        playerData.unitWeaponType = getNextUnitWeaponType(this._getCalculatorData().gameConfig, playerData.unitType, playerData.unitWeaponType);
        this._updateView();
    }

    private _onTouchedBtnPromotion1(): void {
        this._handleTouchedBtnPromotion(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnPromotion2(): void {
        this._handleTouchedBtnPromotion(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnPromotion(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const minValue              = 0;
        const maxValue              = this._getCalculatorData().gameConfig.getUnitMaxPromotion();
        const newValue              = playerData.unitPromotion + 1;
        playerData.unitPromotion    = newValue > maxValue ? minValue : newValue;
        this._updateView();
    }

    private _onTouchedBtnTower1(): void {
        this._handleTouchedBtnTower(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnTower2(): void {
        this._handleTouchedBtnTower(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnTower(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.towersCount;
        const minValue      = 0;
        const maxValue      = 999;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0833),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.towersCount = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnOffenseBonus1(): void {
        this._handleTouchedBtnOffenseBonus(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnOffenseBonus2(): void {
        this._handleTouchedBtnOffenseBonus(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnOffenseBonus(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.offenseBonus;
        const minValue      = -10000;
        const maxValue      = 10000;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0183),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.offenseBonus = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnDefenseBonus1(): void {
        this._handleTouchedBtnDefenseBonus(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnDefenseBonus2(): void {
        this._handleTouchedBtnDefenseBonus(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnDefenseBonus(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.defenseBonus;
        const minValue      = PlayerRules_Constants.DefenseModifier.MinLimit;
        const maxValue      = PlayerRules_Constants.DefenseModifier.MaxLimit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.DefBonus$),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.defenseBonus = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnLuck1(): void {
        this._handleTouchedBtnLuck(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnLuck2(): void {
        this._handleTouchedBtnLuck(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnLuck(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0189),
            currentValue : playerData.lowerLuck,
            minValue     : -10000,
            maxValue     : playerData.upperLuck,
            callback     : newLowerLuck => {
                playerData.lowerLuck = newLowerLuck;
                this._updateView();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0190),
                    currentValue : playerData.upperLuck,
                    minValue     : playerData.lowerLuck,
                    maxValue     : 10000,
                    callback     : newUpperLuck => {
                        playerData.upperLuck = newUpperLuck;
                        this._updateView();
                    },
                });
            },
        });
    }

    private _onTouchedBtnCoOnboard1(): void {
        this._handleTouchedBtnCoOnboard(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnCoOnboard2(): void {
        this._handleTouchedBtnCoOnboard(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnCoOnboard(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        playerData.coOnboard = !playerData.coOnboard;
        this._updateView();
    }

    private _onTouchedBtnFund1(): void {
        this._handleTouchedBtnFund(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnFund2(): void {
        this._handleTouchedBtnFund(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnFund(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.fund;
        const minValue      = -10000000;
        const maxValue      = 10000000;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fund),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.fund = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnCity1(): void {
        this._handleTouchedBtnProperty(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnCity2(): void {
        this._handleTouchedBtnProperty(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnProperty(playerData: AuxiliaryTypes_DamageCalculatorPlayerData.DamageCalculatorPlayerData): void {
        const currValue     = playerData.citiesCount;
        const minValue      = 0;
        const maxValue      = 999;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0834),
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                playerData.citiesCount = value;
                this._updateView();
            },
        });
    }

    private _onTouchedBtnSwitchPlayer(): void {
        const data                              = this._getCalculatorData();
        [data.attackerData, data.defenderData]  = [data.defenderData, data.attackerData];
        this._updateView();
    }

    private _onTouchedBtnSaveState(): void {
        _savedData = cloneCalculatorData(this._getCalculatorData());

        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0288));
    }
    private _onTouchedBtnLoadState(): void {
        const savedData = _savedData;
        if (savedData == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0289));
        } else {
            this._setCalculatorData(cloneCalculatorData(savedData));
            this._updateView();
        }
    }

    private _onTouchedBtnWeather(): void {
        const data          = this._getCalculatorData();
        const typeArray     = data.gameConfig.getAllWeatherTypeArray();
        data.weatherType    = typeArray[(typeArray.indexOf(data.weatherType) + 1) % typeArray.length];
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        const tickCount = Common_Model_CommonModel.getUnitAnimationTickCount();
        this._unitView1.updateOnAnimationTick(tickCount);
        this._unitView2.updateOnAnimationTick(tickCount);
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView1.updateOnAnimationTick();
        this._tileView2.updateOnAnimationTick();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        const data          = this._getCalculatorData();
        const attackerData  = data.attackerData;
        const defenderData  = data.defenderData;
        const gameConfig    = data.gameConfig;
        const war           = this.getOpenData()?.war;
        const canSelect     = war != null;
        this._btnSelect1.setIsVisible(canSelect);
        this._btnSelect2.setIsVisible(canSelect);
        this._imgCo1.loadSource(Helpers_ImageSource.getCoEye(gameConfig, attackerData.coId, true) ?? Lang_Constants.UndefinedError);
        this._imgCo2.loadSource(Helpers_ImageSource.getCoEye(gameConfig, defenderData.coId, true) ?? Lang_Constants.UndefinedError);
        this._labelHp1.setText(`${attackerData.unitHp}`);
        this._labelHp2.setText(`${defenderData.unitHp}`);
        this._labelPromotion1.setText(`${attackerData.unitPromotion}`);
        this._labelPromotion2.setText(`${defenderData.unitPromotion}`);
        this._labelTower1.setText(`${attackerData.towersCount}`);
        this._labelTower2.setText(`${defenderData.towersCount}`);
        this._labelOffenseBonus1.setText(`${attackerData.offenseBonus}`);
        this._labelOffenseBonus2.setText(`${defenderData.offenseBonus}`);
        this._labelDefenseBonus1.setText(`${attackerData.defenseBonus}`);
        this._labelDefenseBonus2.setText(`${defenderData.defenseBonus}`);
        this._labelLuck1.setText(`${attackerData.lowerLuck}\n${attackerData.upperLuck}`);
        this._labelLuck2.setText(`${defenderData.lowerLuck}\n${defenderData.upperLuck}`);
        this._labelFund1.setText(`${attackerData.fund}`);
        this._labelFund2.setText(`${defenderData.fund}`);
        this._labelCoOnboard1.setLangText(attackerData.coOnboard ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._labelCoOnboard2.setLangText(defenderData.coOnboard ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._labelCity1.setText(`${attackerData.citiesCount}`);
        this._labelCity2.setText(`${defenderData.citiesCount}`);
        this._labelWeapon1.setText(getWeaponTypeName(attackerData.unitWeaponType));
        this._labelWeapon2.setText(getWeaponTypeName(defenderData.unitWeaponType));
        this._labelWeather.setText(Lang_Utils.getWeatherName(data.weatherType, gameConfig) ?? Lang_Constants.UndefinedError);
        this._unitView1.update(createUnitViewData(war, attackerData.unitType, 1, gameConfig));
        this._unitView2.update(createUnitViewData(war, defenderData.unitType, 2, gameConfig));
        this._tileView1.init(createTileViewData(war, attackerData.tileType, 1, gameConfig)).updateView();
        this._tileView2.init(createTileViewData(war, defenderData.tileType, 2, gameConfig)).updateView();

        {
            const coSkillType1  = attackerData.coSkillType;
            const coSkillType2  = defenderData.coSkillType;
            this._btnSkill1.setText(coSkillType1 == null ? Lang_Utils.getText(Lang_Constants.TextType.B0829) : (Lang_Utils.getCoSkillTypeName(coSkillType1) ?? Lang_Constants.UndefinedError));
            this._btnSkill2.setText(coSkillType2 == null ? Lang_Utils.getText(Lang_Constants.TextType.B0829) : (Lang_Utils.getCoSkillTypeName(coSkillType2) ?? Lang_Constants.UndefinedError));
        }

        this._updateComponentsForDamage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0828);
        this._labelPlayer1.setLangText(Lang_Constants.TextType.B0831);
        this._labelPlayer2.setLangText(Lang_Constants.TextType.B0832);
        this._btnSelect1.setLangText(Lang_Constants.TextType.B0258);
        this._btnSelect2.setLangText(Lang_Constants.TextType.B0258);
        this._btnHp1.setLangText(Lang_Constants.TextType.Hp);
        this._btnHp2.setLangText(Lang_Constants.TextType.Hp);
        this._btnWeapon1.setLangText(Lang_Constants.TextType.B0830);
        this._btnWeapon2.setLangText(Lang_Constants.TextType.B0830);
        this._btnPromotion1.setLangText(Lang_Constants.TextType.Promotion);
        this._btnPromotion2.setLangText(Lang_Constants.TextType.Promotion);
        this._btnTower1.setLangText(Lang_Constants.TextType.B0833);
        this._btnTower2.setLangText(Lang_Constants.TextType.B0833);
        this._btnOffenseBonus1.setLangText(Lang_Constants.TextType.B0183);
        this._btnOffenseBonus2.setLangText(Lang_Constants.TextType.B0183);
        this._btnDefenseBonus1.setLangText(Lang_Constants.TextType.DefBonus$);
        this._btnDefenseBonus2.setLangText(Lang_Constants.TextType.DefBonus$);
        this._btnLuck1.setLangText(Lang_Constants.TextType.B1352);
        this._btnLuck2.setLangText(Lang_Constants.TextType.B1352);
        this._btnCoOnboard1.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnCoOnboard2.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnFund1.setLangText(Lang_Constants.TextType.Fund);
        this._btnFund2.setLangText(Lang_Constants.TextType.Fund);
        this._btnCity1.setLangText(Lang_Constants.TextType.B0834);
        this._btnCity2.setLangText(Lang_Constants.TextType.B0834);
        this._btnSwitchPlayer.setLangText(Lang_Constants.TextType.B0835);
        this._btnSaveState.setLangText(Lang_Constants.TextType.B0844);
        this._btnLoadState.setLangText(Lang_Constants.TextType.B0845);
        this._btnWeather.setLangText(Lang_Constants.TextType.Weather);
        this._labelAttackTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0039)}:`);
        this._labelDefendTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0837)}:`);
    }

    private _updateComponentsForDamage(): void {
        const calculatorData        = this._getCalculatorData();
        const attackDamageInfoArray = getAttackDamageInfoArray(calculatorData, false);
        const labelAttackDamage     = this._labelAttackDamage;
        if (!attackDamageInfoArray.length) {
            labelAttackDamage.setLangText(Lang_Constants.TextType.B0836);
        } else {
            labelAttackDamage.setText(`${attackDamageInfoArray[0].damage} ~ ${attackDamageInfoArray[attackDamageInfoArray.length - 1].damage}`);
        }

        const revisedAttackDamageInfoArray: DamageInfo[] = attackDamageInfoArray.length
            ? attackDamageInfoArray
            : [{
                damage      : 0,
                times       : 1,
                possibility : 1,
            }];
        const counterDamageDict = new Map<number, { range: DamageRange | null, possibility: number }>();
        for (const info of revisedAttackDamageInfoArray) {
            const unitHp        = Math.max(calculatorData.defenderData.unitHp - info.damage, 0);
            const normalizedHp  = Units_Utils_Common.getNormalizedHp(unitHp);
            if (counterDamageDict.has(normalizedHp)) {
                Helpers_Misc.getExisted(counterDamageDict.get(normalizedHp)).possibility += info.possibility;
                continue;
            }

            const data                              = cloneCalculatorData(calculatorData);
            [data.attackerData, data.defenderData]  = [data.defenderData, data.attackerData];
            data.attackerData.unitHp                = unitHp;
            counterDamageDict.set(normalizedHp, {
                range       : getAttackDamageRange(data, true),
                possibility : info.possibility,
            });
        }
        const textArray: string[] = [];
        for (const [normalizedHp, info] of counterDamageDict) {
            const range                 = info.range;
            const textForPossibility    = `(${Helpers_Text.format(`%.2f`, info.possibility * 100)}%)`;
            if (range == null) {
                textArray.push(`@${normalizedHp}HP${textForPossibility}: ${Lang_Utils.getText(Lang_Constants.TextType.B0836)}`);
            } else {
                textArray.push(`@${normalizedHp}HP${textForPossibility}: ${range.minDamage} ~ ${range.maxDamage}`);
            }
        }
        this._labelDefendDamage.setText(textArray.join(`\n`));

        this._layoutAttackDamage.arrangeItems();
        this._layoutDefendDamage.arrangeItems();
        this._layoutDamage.arrangeItems();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function cloneCalculatorData(data: CalculatorData): CalculatorData {
    return {
        gameConfig   : data.gameConfig,
        weatherType  : data.weatherType,
        attackerData : data.attackerData.clone(),
        defenderData : data.defenderData.clone(),
    };
}

async function createDefaultCalculatorData(): Promise<CalculatorData> {
    const gameConfig = await GameConfigs_Provider.getLatestGameConfig();
    return {
        gameConfig,
        weatherType  : gameConfig.getDefaultWeatherType(),
        attackerData : Panel.createDefaultPlayerData(gameConfig),
        defenderData : Panel.createDefaultPlayerData(gameConfig),
    };
}
function getNextCoSkillType(gameConfig: GameConfigs_GameConfig.GameConfig, coId: number, skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId>): CoSkills_Constants.SkillTypeId | null {
    if (coId === Cos_Constants.CoId.Empty) {
        return null;
    }

    const cfg = gameConfig.getCoBasicCfg(coId);
    if (skillType == null) {
        return CoSkills_Constants.SkillTypeId.Passive;

    } else if (skillType === CoSkills_Constants.SkillTypeId.Passive) {
        if (cfg?.getPowerSkillIds()?.length) {
            return CoSkills_Constants.SkillTypeId.Power;
        } else {
            return getNextCoSkillType(gameConfig, coId, CoSkills_Constants.SkillTypeId.Power);
        }

    } else if (skillType === CoSkills_Constants.SkillTypeId.Power) {
        if (cfg?.getSuperPowerSkillIds()?.length) {
            return CoSkills_Constants.SkillTypeId.SuperPower;
        } else {
            return getNextCoSkillType(gameConfig, coId, CoSkills_Constants.SkillTypeId.SuperPower);
        }

    } else {
        return null;
    }
}
function getNextUnitWeaponType(gameConfig: GameConfigs_GameConfig.GameConfig, unitType: number, weaponType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<Units_Constants.WeaponTypeId>): Units_Constants.WeaponTypeId | null {
    const cfg = gameConfig.getUnitTemplateCfg(unitType);
    if (weaponType == null) {
        if (cfg?.getPrimaryWeaponMaxAmmo() != null) {
            return Units_Constants.WeaponTypeId.Primary;
        } else {
            return getNextUnitWeaponType(gameConfig, unitType, Units_Constants.WeaponTypeId.Primary);
        }

    } else if (weaponType === Units_Constants.WeaponTypeId.Primary) {
        if (gameConfig.checkHasSecondaryWeapon(unitType)) {
            return Units_Constants.WeaponTypeId.Secondary;
        } else {
            return getNextUnitWeaponType(gameConfig, unitType, Units_Constants.WeaponTypeId.Secondary);
        }

    } else {
        return null;
    }
}
function createUnitViewData(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>, unitType: number, playerIndex: number, gameConfig: GameConfigs_GameConfig.GameConfig): Ui_Types_UiUnitViewData.UiUnitViewData {
    return new Ui_Types_UiUnitViewData.UiUnitViewData({
        gameConfig       : gameConfig,
        skinId           : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? ForceSkins_Utils.getDefaultSkinId(playerIndex),
        overridingSkinId : war == null ? undefined : ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex),
        unitData         : Units_Utils_Serialization.createDefault({
            gridIndex   : { x : 0, y : 0 },
            unitTypeId  : unitType,
            playerIndex : playerIndex,
            unitId      : -1,
            gcData      : gameConfig,
        }),
    });
}
function createTileViewData(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>, tileType: number, playerIndex: number, gameConfig: GameConfigs_GameConfig.GameConfig): Ui_Types_UiTileViewData.UiTileViewData {
    const objectType    = Helpers_Misc.getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
    const baseType      = Helpers_Misc.getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
    if (TileObjects_Utils.checkIsValidPlayerIndexForTileObject({
        playerIndex    : playerIndex,
        tileObjectType : objectType,
    })) {
        return {
            tileBaseType          : baseType,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : objectType,
            tileObjectShapeId     : 0,
            skinId                : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId      : war == null ? undefined : ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex),
            gameConfig            : gameConfig,
        };
    } else {
        return {
            tileBaseType          : baseType,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : objectType,
            tileObjectShapeId     : 0,
            skinId                : ForceSkins_Utils.getDefaultSkinId(Players_Constants.PlayerIndex.Neutral),
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        };
    }
}

function getWeaponTypeName(weaponType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<Units_Constants.WeaponTypeId>): string {
    if (weaponType == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.None);
    } else {
        return Lang_Utils.getText(weaponType === Units_Constants.WeaponTypeId.Primary ? Lang_Constants.TextType.B0692 : Lang_Constants.TextType.B0693);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function getAttackDamageInfoArray(calculatorData: CalculatorData, isCounter: boolean): DamageInfo[] {
    const gameConfig        = calculatorData.gameConfig;
    const attackerData      = calculatorData.attackerData;
    const defenderData      = calculatorData.defenderData;
    const attackerUnitType  = attackerData.unitType;
    const defenderUnitType  = defenderData.unitType;
    const cfgAttackDamage   = getCfgDamage({
        gameConfig, attackerUnitType, defenderUnitType, weaponType : attackerData.unitWeaponType,
    });
    if (cfgAttackDamage == null) {
        return [];
    }

    const damageInfoArray   : DamageInfo[] = [];
    const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
    for (let luckValue = attackerLuckLimit.lower; luckValue <= attackerLuckLimit.upper; ++luckValue) {
        const damage    = getAttackDamage({
            luckValue, isCounter, calculatorData, cfgAttackDamage,
        });
        const info      = damageInfoArray.find(v => v.damage === damage);
        if (info) {
            ++info.times;
        } else {
            damageInfoArray.push({
                damage,
                times       : 1,
                possibility : 0,
            });
        }
    }

    const totalTimes = attackerLuckLimit.upper - attackerLuckLimit.lower + 1;
    for (const info of damageInfoArray) {
        info.possibility = info.times / totalTimes;
    }

    return damageInfoArray.sort((v1, v2) => (v1.damage - v2.damage));
}
function getAttackDamageRange(calculatorData: CalculatorData, isCounter: boolean): DamageRange | null {
    const gameConfig        = calculatorData.gameConfig;
    const attackerData      = calculatorData.attackerData;
    const defenderData      = calculatorData.defenderData;
    const attackerUnitType  = attackerData.unitType;
    const defenderUnitType  = defenderData.unitType;
    const cfgAttackDamage   = getCfgDamage({
        gameConfig, attackerUnitType, defenderUnitType, weaponType : attackerData.unitWeaponType,
    });
    if (cfgAttackDamage == null) {
        return null;
    }

    const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
    return {
        minDamage : getAttackDamage({
            luckValue : attackerLuckLimit.lower,
            isCounter,
            calculatorData,
            cfgAttackDamage,
        }),
        maxDamage : getAttackDamage({
            luckValue : attackerLuckLimit.upper,
            isCounter,
            calculatorData,
            cfgAttackDamage,
        }),
    };
}

function getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType }: {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    attackerUnitType    : number;
    defenderUnitType    : number;
    weaponType          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<Units_Constants.WeaponTypeId>;
}): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    if (weaponType == null) {
        return null;
    }

    const armorType = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(defenderUnitType)?.getArmorTypeId());
    return Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType))[armorType][weaponType].getDamage();
}
function getLuckLimitModifierByCo(calculatorData: CalculatorData): { lower: number, upper: number } {
    const gameConfig            = calculatorData.gameConfig;
    const attackerData          = calculatorData.attackerData;
    const attackerUnitTypeId    = attackerData.unitType;
    let lowerModifier           = 0;
    let upperModifier           = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, attackerData.coId, attackerData.coSkillType)) {
        const offsets = CoSkills_Utils_Persistent_SelfUnitLuckRange.getTotalOffsetForDamageCalculatorPanel({
            cfg        : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitLuckRange(),
            gameConfig : gameConfig,
            unitTypeId : attackerUnitTypeId,
        });
        lowerModifier += offsets.lower;
        upperModifier += offsets.upper;
    }

    return {
        lower : lowerModifier,
        upper : upperModifier,
    };
}
function getAttackerLuckLimit(calculatorData: CalculatorData): { lower: number, upper: number } {
    const attackerData  = calculatorData.attackerData;
    const limitFromCo   = getLuckLimitModifierByCo(calculatorData);
    return {
        lower : attackerData.lowerLuck + limitFromCo.lower,
        upper : attackerData.upperLuck + limitFromCo.upper,
    };
}
function getTileDefenseAmountForUnit({ gameConfig, unitType, unitHp, tileType, tileCustomBuildingData, coId, coSkillType }: {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    unitType                : number;
    unitHp                  : number;
    tileType                : number;
    tileCustomBuildingData  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomBuildingData>;
    coId                    : number;
    coSkillType             : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}): number {
    const tileTemplateCfg = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(tileType));
    if (!Tiles_Utils_Common.checkCanDefendUnit({
        templateCfg        : tileTemplateCfg,
        customBuildingData : tileCustomBuildingData,
        gameConfig         : gameConfig,
        unitType           : unitType,
    })) {
        return 0;
    }

    const rawDefenseAmount = Tiles_Utils_Common.getDefenseAmount(tileTemplateCfg, tileCustomBuildingData);
    for (const skillId of getCoSkillIdArray(gameConfig, coId, coSkillType)) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId);
        if (skillCfg == null) {
            continue;
        }

        {
            const cfg = skillCfg.getPersistent()?.getSelfDefenseBonusByTileIgnoreHp();
            if ((cfg)                                                                   &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId()))
            ) {
                return rawDefenseAmount;
            }
        }
    }

    return rawDefenseAmount * Units_Utils_Common.getNormalizedHp(unitHp) / Units_Utils_Common.getNormalizedHp(Units_Constants.Hp.MaxHp);
}
function getCoSkillIdArray(gameConfig: GameConfigs_GameConfig.GameConfig, coId: number, skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId>): number[] {
    if (skillType == null) {
        return [];
    } else {
        const cfg = gameConfig.getCoBasicCfg(coId);
        if (skillType === CoSkills_Constants.SkillTypeId.Passive) {
            return cfg?.getPassiveSkillIds() ?? [];
        } else if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            return cfg?.getPowerSkillIds() ?? [];
        } else {
            return cfg?.getSuperPowerSkillIds() ?? [];
        }
    }
}
function getAttackModifierByCo({ isCounter, calculatorData }: {
    isCounter       : boolean;
    calculatorData  : CalculatorData;
}): number {
    const attackerData          = calculatorData.attackerData;
    const attackerCoId          = attackerData.coId;
    const attackerCoSkillType   = attackerData.coSkillType;
    if ((attackerCoId === Cos_Constants.CoId.Empty) || (attackerCoSkillType == null)) {
        return 0;
    }

    const gameConfig                        = calculatorData.gameConfig;
    const attackerUnitTypeId                = attackerData.unitType;
    const attackerTileTypeId                = attackerData.tileType;
    const attackerFund                      = attackerData.fund;
    const attackerHp                        = attackerData.unitHp;
    const attackerPromotion                 = attackerData.unitPromotion;
    const attackerTileCustomBuildingData    = attackerData.tileCustomBuildingData;
    const attackerIsCoOnboard               = attackerData.coOnboard;
    const attackerTileCfg                   = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(attackerTileTypeId));
    const attackerTileDefenseAmount         = Tiles_Utils_Common.getDefenseAmount(attackerTileCfg, attackerTileCustomBuildingData);
    const canAttackerTileDefendUnit         = Tiles_Utils_Common.checkCanDefendUnit({
        gameConfig         : gameConfig,
        templateCfg        : attackerTileCfg,
        customBuildingData : attackerTileCustomBuildingData,
        unitType           : attackerUnitTypeId,
    });
    const weatherTypeId                     = calculatorData.weatherType;
    const getOwnTilesCount                  = Helpers_Misc.createLazyFunc2(() => attackerData.citiesCount);  // TODO: 这里做了简化处理（因为只有kindle有这个技能），以后如果有类似的新技能，就需要完整实现地形计数逻辑
    let modifier                            = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, attackerCoId, attackerCoSkillType)) {
        modifier += CoSkills_Utils_Persistent_SelfUnitOffense.getTotalOffsetPctForDamageCalculatorPanel({
            cfg               : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCommonAttributes(),
            gameConfig        : gameConfig,
            unitTypeId        : attackerUnitTypeId,
            tileTypeId        : attackerTileTypeId,
            weatherTypeId     : weatherTypeId,
            fund              : attackerFund,
            promotion         : attackerPromotion,
            hp                : attackerHp,
            isCounter         : isCounter,
            isCoOnboard       : attackerIsCoOnboard,
            tileDefenseAmount : attackerTileDefenseAmount,
            canTileDefendUnit : canAttackerTileDefendUnit,
            getOwnTilesCount  : getOwnTilesCount,
        });
    }

    return modifier;
}
function getAttackModifierByWeather(calculatorData: CalculatorData): number {
    const gameConfig        = calculatorData.gameConfig;
    const weatherType       = calculatorData.weatherType;
    const offenseBonusCfg   = gameConfig.getWeatherCfg(weatherType)?.getOffenseBonus();
    if (offenseBonusCfg == null) {
        return 0;
    }

    const attackerData      = calculatorData.attackerData;
    const attackerUnitType  = attackerData.unitType;
    const attackerTileType  = attackerData.tileType;
    const modifier          = offenseBonusCfg[2];
    if ((!modifier)                                                                     ||
        (!gameConfig.checkIsUnitTypeInCategory(attackerUnitType, offenseBonusCfg[0]))   ||
        (!gameConfig.checkIsTileTypeInCategory(attackerTileType, offenseBonusCfg[1]))
    ) {
        return 0;
    }

    for (const skillId of getCoSkillIdArray(gameConfig, attackerData.coId, attackerData.coSkillType)) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitIgnoreWeather();
        if ((cfg)                                                                                   &&
            (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg.getUnitCategoryId()))  &&
            (gameConfig.checkIsTileTypeInCategory(attackerTileType, cfg.getTileCategoryId()))  &&
            (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId()))
        ) {
            return 0;
        }
    }

    return modifier;
}
function getAttackerOffensePierce(calculatorData: CalculatorData): number[] {
    const result                = new Array<number>(6).fill(0);
    const attackerData          = calculatorData.attackerData;
    const attackerCoId          = attackerData.coId;
    const attackerCoSkillType   = attackerData.coSkillType;
    if ((attackerCoId === Cos_Constants.CoId.Empty) || (attackerCoSkillType == null)) {
        return result;
    }

    const gameConfig                = calculatorData.gameConfig;
    const attackerUnitType          = attackerData.unitType;
    for (const skillId of getCoSkillIdArray(gameConfig, attackerCoId, attackerCoSkillType)) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId);
        if (skillCfg == null) {
            continue;
        }

        {
            const cfg = skillCfg.getPersistent()?.getSelfOffensePierce();
            if ((cfg)                                                                           &&
                (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg.getUnitCategoryId()))
            ) {
                result[0] += cfg.getPierceTilePct();
                result[1] += cfg.getPiercePromotionPct();
                result[2] += cfg.getPierceCoPct();
                result[3] += cfg.getPierceGlobalTilePct();
                result[4] += cfg.getPierceRulePct();
                result[5] += cfg.getPierceWarEventPct();
            }
        }
    }

    return result;
}
function getAttackBonusMultiplier({ isCounter, calculatorData }: {
    isCounter           : boolean;
    calculatorData      : CalculatorData;
}): number {
    const gameConfig                = calculatorData.gameConfig;
    const attackerData              = calculatorData.attackerData;
    const commandTowerTemplateCfg   = gameConfig.getTileTemplateCfg(Tiles_Constants_Common.TileTypeId.CommandTower);
    const amountFromPromotion       = gameConfig.getUnitPromotionAttackBonus(attackerData.unitPromotion);
    const amountFromWarRule         = attackerData.offenseBonus;
    const amountFromGlobalTiles     = attackerData.towersCount * (commandTowerTemplateCfg == null ? 0 : commandTowerTemplateCfg.getGlobalAttackBonus());
    const amountFromCo              = getAttackModifierByCo({ isCounter, calculatorData });

    const totalAmount = amountFromWarRule
        + amountFromPromotion
        + amountFromCo
        + getAttackModifierByWeather(calculatorData)
        + amountFromGlobalTiles;
    return Math.max(1 + totalAmount / 100, 0);
}
function getDefenseModifierByCo(calculatorData: CalculatorData): number {
    const defenderData          = calculatorData.defenderData;
    const defenderCoId          = defenderData.coId;
    const defenderCoSkillType   = defenderData.coSkillType;
    if ((defenderCoId === Cos_Constants.CoId.Empty) || (defenderCoSkillType == null)) {
        return 0;
    }

    const gameConfig                        = calculatorData.gameConfig;
    const weatherTypeId                     = calculatorData.weatherType;
    const defenderUnitTypeId                = defenderData.unitType;
    const defenderTileTypeId                = defenderData.tileType;
    const defenderPromotion                 = defenderData.unitPromotion;
    const defenderFund                      = defenderData.fund;
    const defenderHp                        = defenderData.unitHp;
    const defenderTileCustomBuildingData    = defenderData.tileCustomBuildingData;
    const defenderTileCfg                   = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(defenderTileTypeId));
    const defenderTileDefenseAmount         = Tiles_Utils_Common.getDefenseAmount(defenderTileCfg, defenderTileCustomBuildingData);
    const getOwnTilesCount                  = Helpers_Misc.createLazyFunc2(() => defenderData.towersCount);
    const canDefenderTileDefendUnit         = Tiles_Utils_Common.checkCanDefendUnit({
        gameConfig         : gameConfig,
        templateCfg        : defenderTileCfg,
        customBuildingData : defenderTileCustomBuildingData,
        unitType           : defenderUnitTypeId,
    });
    let modifier                            = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, defenderCoId, defenderCoSkillType)) {
        modifier += CoSkills_Utils_Persistent_SelfUnitDefense.getTotalDefensePercentOffsetForDamageCalculatorPanel({
            cfg               : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCommonAttributes(),
            gameConfig        : gameConfig,
            unitTypeId1       : calculatorData.attackerData.unitType,
            unitTypeId2       : defenderUnitTypeId,
            tileTypeId2       : defenderTileTypeId,
            weatherTypeId     : weatherTypeId,
            fund              : defenderFund,
            promotion         : defenderPromotion,
            hp                : defenderHp,
            tileDefenseAmount : defenderTileDefenseAmount,
            canTileDefendUnit : canDefenderTileDefendUnit,
            getOwnTilesCount  : getOwnTilesCount,
        });
    }
    return modifier;
}
function getDefenseBonusMultiplier(calculatorData: CalculatorData): number {
    const gameConfig                = calculatorData.gameConfig;
    const defenderData              = calculatorData.defenderData;
    const commandTowerTemplateCfg   = gameConfig.getTileTemplateCfg(Tiles_Constants_Common.TileTypeId.CommandTower);
    const amountFromPromotion       = gameConfig.getUnitPromotionDefenseBonus(defenderData.unitPromotion);
    const amountFromCo              = getDefenseModifierByCo(calculatorData);
    const amountFromGlobalTiles     = defenderData.towersCount * (commandTowerTemplateCfg == null ? 0 : commandTowerTemplateCfg.getGlobalDefenseBonus());
    const amountFromTile            = getTileDefenseAmountForUnit({
        gameConfig             : gameConfig,
        unitType               : defenderData.unitType,
        unitHp                 : defenderData.unitHp,
        tileType               : defenderData.tileType,
        tileCustomBuildingData : defenderData.tileCustomBuildingData,
        coId                   : defenderData.coId,
        coSkillType            : defenderData.coSkillType,
    });
    const attackerOffensePierce = getAttackerOffensePierce(calculatorData);

    return DamageCalculators_Utils.getDamageMultiplierForDefenseBonus(
        gameConfig,
        amountFromTile              * (100 - attackerOffensePierce[0]) / 100 +
        amountFromPromotion         * (100 - attackerOffensePierce[1]) / 100 +
        amountFromCo                * (100 - attackerOffensePierce[2]) / 100 +
        amountFromGlobalTiles       * (100 - attackerOffensePierce[3]) / 100 +
        defenderData.defenseBonus   * (100 - attackerOffensePierce[4]) / 100,    // TODO 计算器界面没有区分规则/事件导致的防御加成，所以这里无法准确计算
    );
}
function getAttackDamage({ luckValue, isCounter, calculatorData, cfgAttackDamage }: {
    luckValue           : number;
    isCounter           : boolean;
    calculatorData      : CalculatorData;
    cfgAttackDamage     : number;
}): number {
    const attackerData  = calculatorData.attackerData;
    const attackerHp    = attackerData.unitHp;
    if (attackerHp <= 0) {
        return 0;
    }

    const attackBonusMultiplier     = getAttackBonusMultiplier({ isCounter, calculatorData });
    const defenseBonusMultiplier    = getDefenseBonusMultiplier(calculatorData);
    return Math.max(0, Math.floor(0.000001 +
        (cfgAttackDamage * attackBonusMultiplier + luckValue)   *
        (Units_Utils_Common.getNormalizedHp(attackerHp) / 10)     *
        defenseBonusMultiplier,
    ));
}
