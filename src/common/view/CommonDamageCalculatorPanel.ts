import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { DamageCalculatorPlayerData } from "../../auxiliaryTypes/DamageCalculatorPlayerData.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getUnitAnimationTickCount } from "../model/CommonModel.ts";
import { CoId } from "../../cos/Constants.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getTotalOffsetPctForDamageCalculatorPanel } from "../../coSkills/utils/persistent/SelfUnitDefense.ts";
import { getTotalOffsetForDamageCalculatorPanel } from "../../coSkills/utils/persistent/SelfUnitLuckRange.ts";
import {
    getTotalOffsetPctForDamageCalculatorPanel as CoSkillsUtilsPersistentSelfUnitOffenseGetTotalOffsetPctForDamageCalculatorPanel,
} from "../../coSkills/utils/persistent/SelfUnitOffense.ts";
import { getDamageMultiplierForDefenseBonus } from "../../damageCalculators/Utils.ts";
import { show } from "../../FloatText.ts";
import { getDefaultSkinId, getRawOverridingSkinId } from "../../forceSkins/Utils.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted, createLazyFunc, createLazyFunc2 } from "../../helpers/Misc.ts";
import { format } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTextForYesOrNo, getWeatherName, getCoSkillTypeName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { Luck, DefenseModifier } from "../../playerRules/Constants.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type {
    TileCustomBuildingData as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData,
} from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { ObjectTypeId, TileTypeId } from "../../tiles/constants/Common.ts";
import { checkCanDefendUnit, getDefenseAmount } from "../../tiles/utils/Common.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { UiTileViewData } from "../../ui/types/UiTileViewData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass, getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { Hp, WeaponTypeId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { getNormalizedHp } from "../../units/utils/Common.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

type TileCustomBuildingData         = ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData;
type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

type CalculatorData = {
    gameConfig      : GcData;
    weatherType     : number;
    attackerData    : DamageCalculatorPlayerData;
    defenderData    : DamageCalculatorPlayerData;
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
    war                     : IBwWar | null;
    data                    : CalculatorData | null;
    needReviseWeaponType    : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _labelPlayer1!         : IUiLabel;
    private readonly _btnSelect1!           : IUiButton;
    private readonly _labelPlayer2!         : IUiLabel;
    private readonly _btnSelect2!           : IUiButton;

    private readonly _imgCo1!               : IUiImage;
    private readonly _imgCo2!               : IUiImage;
    private readonly _btnSkill1!            : IUiButton;
    private readonly _btnSkill2!            : IUiButton;

    private readonly _conTileView1!         : IUiContainer;
    private readonly _conTileView2!         : IUiContainer;
    private readonly _btnTileView1!         : IUiButton;
    private readonly _btnTileView2!         : IUiButton;

    private readonly _conUnitView1!         : IUiContainer;
    private readonly _conUnitView2!         : IUiContainer;
    private readonly _btnUnitView1!         : IUiButton;
    private readonly _btnUnitView2!         : IUiButton;

    private readonly _btnHp1!               : IUiButton;
    private readonly _btnHp2!               : IUiButton;
    private readonly _labelHp1!             : IUiLabel;
    private readonly _labelHp2!             : IUiLabel;

    private readonly _btnWeapon1!           : IUiButton;
    private readonly _btnWeapon2!           : IUiButton;
    private readonly _labelWeapon1!         : IUiLabel;
    private readonly _labelWeapon2!         : IUiLabel;

    private readonly _btnPromotion1!        : IUiButton;
    private readonly _btnPromotion2!        : IUiButton;
    private readonly _labelPromotion1!      : IUiLabel;
    private readonly _labelPromotion2!      : IUiLabel;

    private readonly _btnTower1!            : IUiButton;
    private readonly _btnTower2!            : IUiButton;
    private readonly _labelTower1!          : IUiLabel;
    private readonly _labelTower2!          : IUiLabel;

    private readonly _btnOffenseBonus1!     : IUiButton;
    private readonly _btnOffenseBonus2!     : IUiButton;
    private readonly _labelOffenseBonus1!   : IUiLabel;
    private readonly _labelOffenseBonus2!   : IUiLabel;

    private readonly _btnDefenseBonus1!     : IUiButton;
    private readonly _btnDefenseBonus2!     : IUiButton;
    private readonly _labelDefenseBonus1!   : IUiLabel;
    private readonly _labelDefenseBonus2!   : IUiLabel;

    private readonly _btnLuck1!             : IUiButton;
    private readonly _btnLuck2!             : IUiButton;
    private readonly _labelLuck1!           : IUiLabel;
    private readonly _labelLuck2!           : IUiLabel;

    private readonly _btnCoOnboard1!        : IUiButton;
    private readonly _btnCoOnboard2!        : IUiButton;
    private readonly _labelCoOnboard1!      : IUiLabel;
    private readonly _labelCoOnboard2!      : IUiLabel;

    private readonly _btnFund1!             : IUiButton;
    private readonly _btnFund2!             : IUiButton;
    private readonly _labelFund1!           : IUiLabel;
    private readonly _labelFund2!           : IUiLabel;

    private readonly _btnCity1!             : IUiButton;
    private readonly _btnCity2!             : IUiButton;
    private readonly _labelCity1!           : IUiLabel;
    private readonly _labelCity2!           : IUiLabel;

    private readonly _btnSwitchPlayer!      : IUiButton;
    private readonly _btnSaveState!         : IUiButton;
    private readonly _btnLoadState!         : IUiButton;

    private readonly _btnWeather!           : IUiButton;
    private readonly _labelWeather!         : IUiLabel;

    private readonly _layoutDamage!         : IUiLayout;
    private readonly _layoutAttackDamage!   : IUiLayout;
    private readonly _labelAttackTitle!     : IUiLabel;
    private readonly _labelAttackDamage!    : IUiLabel;

    private readonly _layoutDefendDamage!   : IUiLayout;
    private readonly _labelDefendTitle!     : IUiLabel;
    private readonly _labelDefendDamage!    : IUiLabel;

    private readonly _unitView1             = new (getUiUnitViewClass())();
    private readonly _unitView2             = new (getUiUnitViewClass())();
    private readonly _tileView1             = new (getUiTileViewClass())();
    private readonly _tileView2             = new (getUiTileViewClass())();

    private _calculatorData?                : CalculatorData;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnSelect1,                 callback: this._onTouchedBtnSelect1 },
            { ui: this._btnSelect2,                 callback: this._onTouchedBtnSelect2 },
            { ui: this._imgCo1,                     callback: this._onTouchedImgCo1, },
            { ui: this._imgCo2,                     callback: this._onTouchedImgCo2, },
            { ui: this._btnSkill1,                  callback: this._onTouchedBtnSkill1 },
            { ui: this._btnSkill2,                  callback: this._onTouchedBtnSkill2 },
            { ui: this._btnUnitView1,               callback: this._onTouchedBtnUnitView1 },
            { ui: this._btnUnitView2,               callback: this._onTouchedBtnUnitView2 },
            { ui: this._btnTileView1,               callback: this._onTouchedBtnTileView1 },
            { ui: this._btnTileView2,               callback: this._onTouchedBtnTileView2 },
            { ui: this._btnHp1,                     callback: this._onTouchedBtnHp1 },
            { ui: this._btnHp2,                     callback: this._onTouchedBtnHp2 },
            { ui: this._btnWeapon1,                 callback: this._onTouchedBtnWeapon1 },
            { ui: this._btnWeapon2,                 callback: this._onTouchedBtnWeapon2 },
            { ui: this._btnPromotion1,              callback: this._onTouchedBtnPromotion1 },
            { ui: this._btnPromotion2,              callback: this._onTouchedBtnPromotion2 },
            { ui: this._btnTower1,                  callback: this._onTouchedBtnTower1 },
            { ui: this._btnTower2,                  callback: this._onTouchedBtnTower2 },
            { ui: this._btnOffenseBonus1,           callback: this._onTouchedBtnOffenseBonus1 },
            { ui: this._btnOffenseBonus2,           callback: this._onTouchedBtnOffenseBonus2 },
            { ui: this._btnDefenseBonus1,           callback: this._onTouchedBtnDefenseBonus1 },
            { ui: this._btnDefenseBonus2,           callback: this._onTouchedBtnDefenseBonus2 },
            { ui: this._btnLuck1,                   callback: this._onTouchedBtnLuck1 },
            { ui: this._btnLuck2,                   callback: this._onTouchedBtnLuck2 },
            { ui: this._btnCoOnboard1,              callback: this._onTouchedBtnCoOnboard1 },
            { ui: this._btnCoOnboard2,              callback: this._onTouchedBtnCoOnboard2 },
            { ui: this._btnFund1,                   callback: this._onTouchedBtnFund1 },
            { ui: this._btnFund2,                   callback: this._onTouchedBtnFund2 },
            { ui: this._btnCity1,                   callback: this._onTouchedBtnCity1 },
            { ui: this._btnCity2,                   callback: this._onTouchedBtnCity2 },
            { ui: this._btnSwitchPlayer,            callback: this._onTouchedBtnSwitchPlayer },
            { ui: this._btnSaveState,               callback: this._onTouchedBtnSaveState },
            { ui: this._btnLoadState,               callback: this._onTouchedBtnLoadState },
            { ui: this._btnWeather,                 callback: this._onTouchedBtnWeather },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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

    public static createDefaultPlayerData(gameConfig: GcData): DamageCalculatorPlayerData {
        const unitType = gameConfig.getFirstUnitType();
        return new DamageCalculatorPlayerData({
            coId                    : CoId.Empty,
            coSkillType             : SkillTypeId.Passive,
            unitType                : unitType,
            unitHp                  : Hp.MaxHp,
            unitWeaponType          : WeaponTypeId.Primary,
            unitPromotion           : 0,
            tileType                : getExisted(gameConfig.getTileType(gameConfig.getDefaultTileBaseType(), ObjectTypeId.Empty)),
            tileCustomBuildingData  : null,
            towersCount             : 0,
            offenseBonus            : 0,
            defenseBonus            : 0,
            upperLuck               : gameConfig.getSystemCfg().getDefaultLuckUpperLimit(),
            lowerLuck               : Luck.DefaultLowerLimit,
            coOnboard               : false,
            hasPrimaryAmmo          : !!gameConfig.getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo(),
            fund                    : 0,
            citiesCount             : 0,
        });
    }

    private _setCalculatorData(data: CalculatorData): void {
        this._calculatorData = data;
    }
    private _getCalculatorData(): CalculatorData {
        return getExisted(this._calculatorData);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B1111),
            getContent : () => getText(TextType.A0033),
        });
    }

    private _onTouchedBtnSelect1(): void {
        const war = getExisted(this.getOpenData()?.war);
        openPanel(getDict().BwUnitListPanel, {
            war                     : war,
            callbackForMoveCursor   : () => {
                // nothing to do
            },
            callbackForSelectUnit   : unit => {
                this._getCalculatorData().attackerData = this._createPlayerDataForUnit(unit);
                this._reviseWeaponType();
                this._updateView();
                closePanel(getDict().BwUnitListPanel);
            },
        });
    }
    private _onTouchedBtnSelect2(): void {
        const war = getExisted(this.getOpenData()?.war);
        openPanel(getDict().BwUnitListPanel, {
            war                     : war,
            callbackForMoveCursor   : () => {
                // nothing to do
            },
            callbackForSelectUnit   : unit => {
                this._getCalculatorData().defenderData = this._createPlayerDataForUnit(unit);
                this._reviseWeaponType();
                this._updateView();
                closePanel(getDict().BwUnitListPanel);
            },
        });
    }
    private _createPlayerDataForUnit(attackerUnit: IUnit): DamageCalculatorPlayerData {
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
        return new DamageCalculatorPlayerData({
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
        });
    }

    private _onTouchedImgCo1(): void {
        this._handleTouchedImgCo(this._getCalculatorData().attackerData);
    }
    private _onTouchedImgCo2(): void {
        this._handleTouchedImgCo(this._getCalculatorData().defenderData);
    }
    private _handleTouchedImgCo(playerData: DamageCalculatorPlayerData): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : playerData.coId,
            availableCoIdArray  : gameConfig.getAllEnabledCoArray().map(v => v.getCoId()),
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                playerData.coId = newCoId;
                this._updateView();
            },
        });

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnSkill1(): void {
        this._handleTouchedBtnSkill(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnSkill2(): void {
        this._handleTouchedBtnSkill(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnSkill(playerData: DamageCalculatorPlayerData): void {
        playerData.coSkillType  = getNextCoSkillType(this._getCalculatorData().gameConfig, playerData.coId, playerData.coSkillType);
        this._updateView();
    }

    private _onTouchedBtnUnitView1(): void {
        this._handleTouchedConUnitView(this.getOpenData()?.war, this._getCalculatorData().attackerData, 1);
    }
    private _onTouchedBtnUnitView2(): void {
        this._handleTouchedConUnitView(this.getOpenData()?.war, this._getCalculatorData().defenderData, 2);
    }
    private _handleTouchedConUnitView(war: AuxiliaryTypesAuxiliaryTypesUndefinable<IBwWar>, playerData: DamageCalculatorPlayerData, playerIndex: number): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        openPanel(getDict().CommonChooseSingleUnitTypePanel, {
            gameConfig          : gameConfig,
            currentUnitType     : playerData.unitType,
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            playerIndex         : playerIndex,
            skinId              : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? getDefaultSkinId(playerIndex),
            overridingSkinId    : war == null ? undefined : getRawOverridingSkinId(war, playerIndex),
            callback            : unitType => {
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
    private _doReviseWeaponType(playerData1: DamageCalculatorPlayerData, playerData2: DamageCalculatorPlayerData): void {
        const gameConfig    = this._getCalculatorData().gameConfig;
        const armorType2    = getExisted(gameConfig.getUnitTemplateCfg(playerData2.unitType)?.getArmorTypeId());
        const damageCfg     = (gameConfig.getDamageChartCfgs(playerData1.unitType) ?? {})[armorType2];
        if ((damageCfg[WeaponTypeId.Primary].getDamage() != null) && (playerData1.hasPrimaryAmmo)) {
            playerData1.unitWeaponType = WeaponTypeId.Primary;
        } else if (damageCfg[WeaponTypeId.Secondary].getDamage() != null) {
            playerData1.unitWeaponType = WeaponTypeId.Secondary;
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
    private _handleTouchedConTileView(playerData: DamageCalculatorPlayerData): void {
        const gameConfig = this._getCalculatorData().gameConfig;
        openPanel(getDict().CommonChooseSingleTileTypePanel, {
            gameConfig          : gameConfig,
            currentTileType     : playerData.tileType,
            tileTypeArray       : gameConfig.getTileTypeArrayForTileChart(),
            callback            : tileType => {
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
    private _handleTouchedBtnHp(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.unitHp;
        const minValue      = 1;
        const maxValue      = Hp.MaxHp;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Hp),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
    private _handleTouchedBtnWeapon(playerData: DamageCalculatorPlayerData): void {
        playerData.unitWeaponType = getNextUnitWeaponType(this._getCalculatorData().gameConfig, playerData.unitType, playerData.unitWeaponType);
        this._updateView();
    }

    private _onTouchedBtnPromotion1(): void {
        this._handleTouchedBtnPromotion(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnPromotion2(): void {
        this._handleTouchedBtnPromotion(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnPromotion(playerData: DamageCalculatorPlayerData): void {
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
    private _handleTouchedBtnTower(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.towersCount;
        const minValue      = 0;
        const maxValue      = 999;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0833),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
    private _handleTouchedBtnOffenseBonus(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.offenseBonus;
        const minValue      = -10000;
        const maxValue      = 10000;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0183),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
    private _handleTouchedBtnDefenseBonus(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.defenseBonus;
        const minValue      = DefenseModifier.MinLimit;
        const maxValue      = DefenseModifier.MaxLimit;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.DefBonus$),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
    private _handleTouchedBtnLuck(playerData: DamageCalculatorPlayerData): void {
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0189),
            currentValue    : playerData.lowerLuck,
            minValue        : -10000,
            maxValue        : playerData.upperLuck,
            callback        : newLowerLuck => {
                playerData.lowerLuck = newLowerLuck;
                this._updateView();

                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle           : () => getText(TextType.B0190),
                    currentValue    : playerData.upperLuck,
                    minValue        : playerData.lowerLuck,
                    maxValue        : 10000,
                    callback        : newUpperLuck => {
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
    private _handleTouchedBtnCoOnboard(playerData: DamageCalculatorPlayerData): void {
        playerData.coOnboard = !playerData.coOnboard;
        this._updateView();
    }

    private _onTouchedBtnFund1(): void {
        this._handleTouchedBtnFund(this._getCalculatorData().attackerData);
    }
    private _onTouchedBtnFund2(): void {
        this._handleTouchedBtnFund(this._getCalculatorData().defenderData);
    }
    private _handleTouchedBtnFund(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.fund;
        const minValue      = -10000000;
        const maxValue      = 10000000;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Fund),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
    private _handleTouchedBtnProperty(playerData: DamageCalculatorPlayerData): void {
        const currValue     = playerData.citiesCount;
        const minValue      = 0;
        const maxValue      = 999;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0834),
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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

        show(getText(TextType.A0288));
    }
    private _onTouchedBtnLoadState(): void {
        const savedData = _savedData;
        if (savedData == null) {
            show(getText(TextType.A0289));
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
        const tickCount = getUnitAnimationTickCount();
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
        this._imgCo1.loadSource(getCoEye(gameConfig, attackerData.coId, true) ?? UndefinedError);
        this._imgCo2.loadSource(getCoEye(gameConfig, defenderData.coId, true) ?? UndefinedError);
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
        this._labelCoOnboard1.setText(getTextForYesOrNo(attackerData.coOnboard));
        this._labelCoOnboard2.setText(getTextForYesOrNo(defenderData.coOnboard));
        this._labelCity1.setText(`${attackerData.citiesCount}`);
        this._labelCity2.setText(`${defenderData.citiesCount}`);
        this._labelWeapon1.setText(getWeaponTypeName(attackerData.unitWeaponType));
        this._labelWeapon2.setText(getWeaponTypeName(defenderData.unitWeaponType));
        this._labelWeather.setText(getWeatherName(data.weatherType, gameConfig) ?? UndefinedError);
        this._unitView1.update(createUnitViewData(war, attackerData.unitType, 1, gameConfig));
        this._unitView2.update(createUnitViewData(war, defenderData.unitType, 2, gameConfig));
        this._tileView1.init(createTileViewData(war, attackerData.tileType, 1, gameConfig)).updateView();
        this._tileView2.init(createTileViewData(war, defenderData.tileType, 2, gameConfig)).updateView();

        {
            const coSkillType1  = attackerData.coSkillType;
            const coSkillType2  = defenderData.coSkillType;
            this._btnSkill1.setText(coSkillType1 == null ? getText(TextType.B0829) : (getCoSkillTypeName(coSkillType1) ?? UndefinedError));
            this._btnSkill2.setText(coSkillType2 == null ? getText(TextType.B0829) : (getCoSkillTypeName(coSkillType2) ?? UndefinedError));
        }

        this._updateComponentsForDamage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0828);
        this._labelPlayer1.setLangText(TextType.B0831);
        this._labelPlayer2.setLangText(TextType.B0832);
        this._btnSelect1.setLangText(TextType.B0258);
        this._btnSelect2.setLangText(TextType.B0258);
        this._btnHp1.setLangText(TextType.Hp);
        this._btnHp2.setLangText(TextType.Hp);
        this._btnWeapon1.setLangText(TextType.B0830);
        this._btnWeapon2.setLangText(TextType.B0830);
        this._btnPromotion1.setLangText(TextType.Promotion);
        this._btnPromotion2.setLangText(TextType.Promotion);
        this._btnTower1.setLangText(TextType.B0833);
        this._btnTower2.setLangText(TextType.B0833);
        this._btnOffenseBonus1.setLangText(TextType.B0183);
        this._btnOffenseBonus2.setLangText(TextType.B0183);
        this._btnDefenseBonus1.setLangText(TextType.DefBonus$);
        this._btnDefenseBonus2.setLangText(TextType.DefBonus$);
        this._btnLuck1.setLangText(TextType.B1352);
        this._btnLuck2.setLangText(TextType.B1352);
        this._btnCoOnboard1.setLangText(TextType.CoOnboard);
        this._btnCoOnboard2.setLangText(TextType.CoOnboard);
        this._btnFund1.setLangText(TextType.Fund);
        this._btnFund2.setLangText(TextType.Fund);
        this._btnCity1.setLangText(TextType.B0834);
        this._btnCity2.setLangText(TextType.B0834);
        this._btnSwitchPlayer.setLangText(TextType.B0835);
        this._btnSaveState.setLangText(TextType.B0844);
        this._btnLoadState.setLangText(TextType.B0845);
        this._btnWeather.setLangText(TextType.Weather);
        this._labelAttackTitle.setText(`${getText(TextType.B0039)}:`);
        this._labelDefendTitle.setText(`${getText(TextType.B0837)}:`);
    }

    private _updateComponentsForDamage(): void {
        const calculatorData        = this._getCalculatorData();
        const attackDamageInfoArray = getAttackDamageInfoArray(calculatorData, false);
        const labelAttackDamage     = this._labelAttackDamage;
        if (!attackDamageInfoArray.length) {
            labelAttackDamage.setLangText(TextType.B0836);
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
            const normalizedHp  = getNormalizedHp(unitHp);
            if (counterDamageDict.has(normalizedHp)) {
                getExisted(counterDamageDict.get(normalizedHp)).possibility += info.possibility;
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
            const textForPossibility    = `(${format(`%.2f`, info.possibility * 100)}%)`;
            if (range == null) {
                textArray.push(`@${normalizedHp}HP${textForPossibility}: ${getText(TextType.B0836)}`);
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
        gameConfig      : data.gameConfig,
        weatherType     : data.weatherType,
        attackerData    : data.attackerData.clone(),
        defenderData    : data.defenderData.clone(),
    };
}

async function createDefaultCalculatorData(): Promise<CalculatorData> {
    const gameConfig = await getLatestGameConfig();
    return {
        gameConfig,
        weatherType     : gameConfig.getDefaultWeatherType(),
        attackerData    : Panel.createDefaultPlayerData(gameConfig),
        defenderData    : Panel.createDefaultPlayerData(gameConfig),
    };
}
function getNextCoSkillType(gameConfig: GcData, coId: number, skillType: Undefinable<SkillTypeId>): SkillTypeId | null {
    if (coId === CoId.Empty) {
        return null;
    }

    const cfg = gameConfig.getCoBasicCfg(coId);
    if (skillType == null) {
        return SkillTypeId.Passive;

    } else if (skillType === SkillTypeId.Passive) {
        if (cfg?.getPowerSkillIds()?.length) {
            return SkillTypeId.Power;
        } else {
            return getNextCoSkillType(gameConfig, coId, SkillTypeId.Power);
        }

    } else if (skillType === SkillTypeId.Power) {
        if (cfg?.getSuperPowerSkillIds()?.length) {
            return SkillTypeId.SuperPower;
        } else {
            return getNextCoSkillType(gameConfig, coId, SkillTypeId.SuperPower);
        }

    } else {
        return null;
    }
}
function getNextUnitWeaponType(gameConfig: GcData, unitType: number, weaponType: Undefinable<WeaponTypeId>): WeaponTypeId | null {
    const cfg = gameConfig.getUnitTemplateCfg(unitType);
    if (weaponType == null) {
        if (cfg?.getPrimaryWeaponMaxAmmo() != null) {
            return WeaponTypeId.Primary;
        } else {
            return getNextUnitWeaponType(gameConfig, unitType, WeaponTypeId.Primary);
        }

    } else if (weaponType === WeaponTypeId.Primary) {
        if (gameConfig.checkHasSecondaryWeapon(unitType)) {
            return WeaponTypeId.Secondary;
        } else {
            return getNextUnitWeaponType(gameConfig, unitType, WeaponTypeId.Secondary);
        }

    } else {
        return null;
    }
}
function createUnitViewData(war: AuxiliaryTypesAuxiliaryTypesUndefinable<IBwWar>, unitType: number, playerIndex: number, gameConfig: GcData): UiUnitViewData {
    return new UiUnitViewData({
        gameConfig          : gameConfig,
        skinId              : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? getDefaultSkinId(playerIndex),
        overridingSkinId    : war == null ? undefined : getRawOverridingSkinId(war, playerIndex),
        unitData            : createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitTypeId  : unitType,
            playerIndex : playerIndex,
            unitId      : -1,
            gcData      : gameConfig,
        }),
    });
}
function createTileViewData(war: AuxiliaryTypesAuxiliaryTypesUndefinable<IBwWar>, tileType: number, playerIndex: number, gameConfig: GcData): UiTileViewData {
    const objectType    = getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
    const baseType      = getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
    if (gameConfig.checkIsValidPlayerIndexForTileObject({
        playerIndex     : playerIndex,
        tileObjectType  : objectType
    })) {
        return {
            tileBaseType            : baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : objectType,
            tileObjectShapeId       : 0,
            skinId                  : war?.getPlayer(playerIndex).getUnitAndTileSkinId() ?? getDefaultSkinId(playerIndex),
            overridingSkinId        : war == null ? undefined : getRawOverridingSkinId(war, playerIndex),
            gameConfig              : gameConfig,
        };
    } else {
        return {
            tileBaseType            : baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : objectType,
            tileObjectShapeId       : 0,
            skinId                  : getDefaultSkinId(PlayerIndex.Neutral),
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        };
    }
}

function getWeaponTypeName(weaponType: Undefinable<WeaponTypeId>): string {
    if (weaponType == null) {
        return getText(TextType.None);
    } else {
        return getText(weaponType === WeaponTypeId.Primary ? TextType.B0692 : TextType.B0693);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function getAttackDamageInfoArray(calculatorData: CalculatorData, isCounter: boolean): DamageInfo[] {
    const gameConfig        = calculatorData.gameConfig;
    const attackerData      = calculatorData.attackerData;
    const defenderData      = calculatorData.defenderData;
    const attackerUnitType  = attackerData.unitType;
    const defenderUnitType  = defenderData.unitType;
    const cfgAttackDamage   = getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
    if (cfgAttackDamage == null) {
        return [];
    }

    const damageInfoArray   : DamageInfo[] = [];
    const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
    for (let luckValue = attackerLuckLimit.lower; luckValue <= attackerLuckLimit.upper; ++luckValue) {
        const damage    = getAttackDamage({ luckValue, isCounter, calculatorData, cfgAttackDamage });
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
    const cfgAttackDamage   = getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
    if (cfgAttackDamage == null) {
        return null;
    }

    const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
    return {
        minDamage   : getAttackDamage({
            luckValue       : attackerLuckLimit.lower,
            isCounter,
            calculatorData,
            cfgAttackDamage,
        }),
        maxDamage   : getAttackDamage({
            luckValue       : attackerLuckLimit.upper,
            isCounter,
            calculatorData,
            cfgAttackDamage,
        }),
    };
}

function getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType }: {
    gameConfig          : GcData;
    attackerUnitType    : number;
    defenderUnitType    : number;
    weaponType          : Undefinable<WeaponTypeId>;
}): AuxiliaryTypesAuxiliaryTypesUndefinable<number> {
    if (weaponType == null) {
        return null;
    }

    const armorType = getExisted(gameConfig.getUnitTemplateCfg(defenderUnitType)?.getArmorTypeId());
    return getExisted(gameConfig.getDamageChartCfgs(attackerUnitType))[armorType][weaponType].getDamage();
}
function getLuckLimitModifierByCo(calculatorData: CalculatorData): { lower: number, upper: number } {
    const gameConfig            = calculatorData.gameConfig;
    const attackerData          = calculatorData.attackerData;
    const attackerUnitTypeId    = attackerData.unitType;
    let lowerModifier           = 0;
    let upperModifier           = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, attackerData.coId, attackerData.coSkillType)) {
        const offsets = getTotalOffsetForDamageCalculatorPanel({
            cfg         : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitLuckRange(),
            gameConfig  : gameConfig,
            unitTypeId  : attackerUnitTypeId,
        });
        lowerModifier += offsets.lower;
        upperModifier += offsets.upper;
    }

    return {
        lower   : lowerModifier,
        upper   : upperModifier,
    };
}
function getAttackerLuckLimit(calculatorData: CalculatorData): { lower: number, upper: number } {
    const attackerData  = calculatorData.attackerData;
    const limitFromCo   = getLuckLimitModifierByCo(calculatorData);
    return {
        lower   : attackerData.lowerLuck + limitFromCo.lower,
        upper   : attackerData.upperLuck + limitFromCo.upper,
    };
}
function getTileDefenseAmountForUnit({ gameConfig, unitType, unitHp, tileType, tileCustomBuildingData, coId, coSkillType }: {
    gameConfig              : GcData;
    unitType                : number;
    unitHp                  : number;
    tileType                : number;
    tileCustomBuildingData  : Undefinable<TileCustomBuildingData>;
    coId                    : number;
    coSkillType             : Undefinable<number>;
}): number {
    const tileTemplateCfg = getExisted(gameConfig.getTileTemplateCfg(tileType));
    if (!checkCanDefendUnit({
        templateCfg         : tileTemplateCfg,
        customBuildingData  : tileCustomBuildingData,
        gameConfig          : gameConfig,
        unitType            : unitType,
    })) {
        return 0;
    }

    const rawDefenseAmount = getDefenseAmount(tileTemplateCfg, tileCustomBuildingData);
    for (const skillId of getCoSkillIdArray(gameConfig, coId, coSkillType)) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId);
        if (skillCfg == null) {
            continue;
        }

        {
            const cfg = skillCfg.getPersistent()?.getSelfDefenseBonusByTileIgnoreHp();
            if ((cfg)                                                                   &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))
            ) {
                return rawDefenseAmount;
            }
        }
    }

    return rawDefenseAmount * getNormalizedHp(unitHp) / getNormalizedHp(Hp.MaxHp);
}
function getCoSkillIdArray(gameConfig: GcData, coId: number, skillType: Undefinable<SkillTypeId>): number[] {
    if (skillType == null) {
        return [];
    } else {
        const cfg = gameConfig.getCoBasicCfg(coId);
        if (skillType === SkillTypeId.Passive) {
            return cfg?.getPassiveSkillIds() ?? [];
        } else if (skillType === SkillTypeId.Power) {
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
    if ((attackerCoId === CoId.Empty) || (attackerCoSkillType == null)) {
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
    const attackerTileCfg                   = getExisted(gameConfig.getTileTemplateCfg(attackerTileTypeId));
    const attackerTileDefenseAmount         = getDefenseAmount(attackerTileCfg, attackerTileCustomBuildingData);
    const canAttackerTileDefendUnit         = checkCanDefendUnit({
        gameConfig          : gameConfig,
        templateCfg         : attackerTileCfg,
        customBuildingData  : attackerTileCustomBuildingData,
        unitType            : attackerUnitTypeId
    });
    const weatherTypeId                     = calculatorData.weatherType;
    const getOwnTilesCount                  = createLazyFunc2(() => attackerData.citiesCount);  // TODO: 这里做了简化处理（因为只有kindle有这个技能），以后如果有类似的新技能，就需要完整实现地形计数逻辑
    let modifier                            = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, attackerCoId, attackerCoSkillType)) {
        modifier += CoSkillsUtilsPersistentSelfUnitOffenseGetTotalOffsetPctForDamageCalculatorPanel({
            cfg                 : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitOffense(),
            gameConfig          : gameConfig,
            unitTypeId          : attackerUnitTypeId,
            tileTypeId          : attackerTileTypeId,
            weatherTypeId       : weatherTypeId,
            fund                : attackerFund,
            promotion           : attackerPromotion,
            hp                  : attackerHp,
            isCounter           : isCounter,
            isCoOnboard         : attackerIsCoOnboard,
            tileDefenseAmount   : attackerTileDefenseAmount,
            canTileDefendUnit   : canAttackerTileDefendUnit,
            getOwnTilesCount    : getOwnTilesCount,
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
            (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg.getUnitCategoryId() ?? 0))  &&
            (gameConfig.checkIsTileTypeInCategory(attackerTileType, cfg.getTileCategoryId() ?? 0))  &&
            (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId() ?? 0))
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
    if ((attackerCoId === CoId.Empty) || (attackerCoSkillType == null)) {
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
                (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg.getUnitCategoryId() ?? 0))
            ) {
                result[0] += cfg.getPierceTilePct() ?? 0;
                result[1] += cfg.getPiercePromotionPct() ?? 0;
                result[2] += cfg.getPierceCoPct() ?? 0;
                result[3] += cfg.getPierceGlobalTilePct() ?? 0;
                result[4] += cfg.getPierceRulePct() ?? 0;
                result[5] += cfg.getPierceWarEventPct() ?? 0;
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
    const commandTowerTemplateCfg   = gameConfig.getTileTemplateCfg(TileTypeId.CommandTower);
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
    if ((defenderCoId === CoId.Empty) || (defenderCoSkillType == null)) {
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
    const defenderTileCfg                   = getExisted(gameConfig.getTileTemplateCfg(defenderTileTypeId));
    const defenderTileDefenseAmount         = getDefenseAmount(defenderTileCfg, defenderTileCustomBuildingData);
    const getOwnTilesCount                  = createLazyFunc2(() => defenderData.towersCount);
    const canDefenderTileDefendUnit         = checkCanDefendUnit({
        gameConfig          : gameConfig,
        templateCfg         : defenderTileCfg,
        customBuildingData  : defenderTileCustomBuildingData,
        unitType            : defenderUnitTypeId
    });
    let modifier                            = 0;
    for (const skillId of getCoSkillIdArray(gameConfig, defenderCoId, defenderCoSkillType)) {
        modifier += getTotalOffsetPctForDamageCalculatorPanel({
            cfg                 : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitDefense(),
            gameConfig          : gameConfig,
            unitTypeId1         : calculatorData.attackerData.unitType,
            unitTypeId2         : defenderUnitTypeId,
            tileTypeId2         : defenderTileTypeId,
            weatherTypeId       : weatherTypeId,
            fund                : defenderFund,
            promotion           : defenderPromotion,
            hp                  : defenderHp,
            tileDefenseAmount   : defenderTileDefenseAmount,
            canTileDefendUnit   : canDefenderTileDefendUnit,
            getOwnTilesCount    : getOwnTilesCount,
        }) ?? 0;
    }
    return modifier;
}
function getDefenseBonusMultiplier(calculatorData: CalculatorData): number {
    const gameConfig                = calculatorData.gameConfig;
    const defenderData              = calculatorData.defenderData;
    const commandTowerTemplateCfg   = gameConfig.getTileTemplateCfg(TileTypeId.CommandTower);
    const amountFromPromotion       = gameConfig.getUnitPromotionDefenseBonus(defenderData.unitPromotion);
    const amountFromCo              = getDefenseModifierByCo(calculatorData);
    const amountFromGlobalTiles     = defenderData.towersCount * (commandTowerTemplateCfg == null ? 0 : commandTowerTemplateCfg.getGlobalDefenseBonus());
    const amountFromTile            = getTileDefenseAmountForUnit({
        gameConfig              : gameConfig,
        unitType                : defenderData.unitType,
        unitHp                  : defenderData.unitHp,
        tileType                : defenderData.tileType,
        tileCustomBuildingData  : defenderData.tileCustomBuildingData,
        coId                    : defenderData.coId,
        coSkillType             : defenderData.coSkillType,
    });
    const attackerOffensePierce = getAttackerOffensePierce(calculatorData);

    return getDamageMultiplierForDefenseBonus(
        gameConfig,
        amountFromTile              * (100 - attackerOffensePierce[0]) / 100 +
        amountFromPromotion         * (100 - attackerOffensePierce[1]) / 100 +
        amountFromCo                * (100 - attackerOffensePierce[2]) / 100 +
        amountFromGlobalTiles       * (100 - attackerOffensePierce[3]) / 100 +
        defenderData.defenseBonus   * (100 - attackerOffensePierce[4]) / 100    // TODO 计算器界面没有区分规则/事件导致的防御加成，所以这里无法准确计算
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
        (getNormalizedHp(attackerHp) / 10)     *
        defenseBonusMultiplier
    ));
}
