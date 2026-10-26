import type {
    CustomError,
    RepairHpAndCost,
    Undefinable,
} from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { checkIsEffective } from "../coSkills/utils/persistent/SelfTileEnabledForUnitProduction.ts";
import { getTotalMultiplier } from "../coSkills/utils/persistent/SelfTileIncome.ts";
import { getRawOverridingSkinId } from "../forceSkins/Utils.ts";
import { GameConfig } from "../gameConfigs/GameConfig.ts";
import { getRwWarClass, getTileViewClass } from "../gameHelpers/GhFactory.ts";
import { deleteElementFromList } from "../helpers/Collection.ts";
import { createLazyFunc, getExisted, newError } from "../helpers/Misc.ts";
import { getCurrentLanguageType, getLanguageText } from "../lang/Utils.ts";
import { GroupCount, GroupSize, MaxId, MinId } from "../locations/Constants.ts";
import { checkHasAnyOverlap } from "../locations/Utils.ts";
import { Common } from "../maps/Constants.ts";
import type { BwTileBuffChanged, BwTileHasLocationIdSet, BwTileIsHighlightChanged } from "../notifications/DataTypes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import type {
    SelfTileEnabledForUnitProduction,
} from "../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import type { MoveCostCfg } from "../proto/schema/CommonProto/Config/MoveCostCfg.ts";
import type { TileTemplateCfg } from "../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { TileBuff } from "../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { TileCustomBuildingData } from "../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import { checkIsValidTileBaseShapeId } from "../tileBases/Utils.ts";
import { BuffTypeId } from "../tileBuffs/Constants.ts";
import { checkIsExpired, checkIsValid } from "../tileBuffs/utils/Common.ts";
import { checkIsValidTileDecorationShapeId } from "../tileDecorations/Utils.ts";
import { checkIsValidPlayerIndexForTileObject, checkIsValidTileObjectShapeId, getTileObjectCfg } from "../tileObjects/Utils.ts";
import { CategoryId, Hp } from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import { getNormalizedHp } from "../units/utils/Common.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { checkIsTileVisibleToTeams } from "../visibilities/Utils.ts";
import { ObjectTypeId } from "./constants/Common.ts";
import {
    CannonDown,
    CannonLeft,
    CannonRight,
    CannonUp,
    Crystal,
    CustomCannon,
    CustomLaserTurret,
} from "./constants/DefaultCustomTileData.ts";
import { AllCustomizableTypeIdArray, TypeId as TilesConstantsMapWeaponTypeId } from "./constants/MapWeapon.ts";
import type { ITile } from "./ITile.ts";
import type { ITileView } from "./ITileView.ts";
import {
    checkCanBlockEnemyUnitType,
    checkCanDefendUnit,
    checkCanHideUnitType,
    checkCanRepairOrSupplyUnitType,
    checkIsValidCustomNameId,
    getBlockEnemyUnitTypeArray,
    getCoBoardUnitTypeArray,
    getDefenseAmount,
    getDefenseUnitTypeArray,
    getGlobalAttackBonus,
    getGlobalDefenseBonus,
    getHideUnitTypeArray,
    getIncomePerTurn,
    getIsDefeatedOnCapture,
    getIsVisionEnabledForAllPlayers,
    getMaxCapturePoint,
    getProducibleUnitTypeArray,
    getRepairNormalizedHp,
    getRepairUnitTypeArray,
    getVisionRange,
} from "./utils/Common.ts";
import { Building, Cannon, LaserTurret, Crystal as TilesUtilsCustomTileDataCrystal } from "./utils/CustomTileData.ts";
import { create } from "./utils/Serialization.ts";

export class Tile implements ITile {
    private _gameConfig?                : GameConfig;
    private _templateCfg?               : TileTemplateCfg;
    private _gridX                      = 0;
    private _gridY                      = 0;
    private _playerIndex                = 0;
    private _baseType                   = 0;
    private _decorationType             = 0;
    private _objectType                 = 0;

    private _baseShapeId                = 0;
    private _decorationShapeId          = 0;
    private _objectShapeId              = 0;
    private _currentHp                  = 0;
    private _currentBuildPoint          = 0;
    private _currentCapturePoint        = 0;
    private _groupedLocationIdArray     : number[] = [];
    private _isHighlighted              = false;
    private _unfixedBuffList            : TileBuff[] = [];
    private _customNameId               : Undefinable<number>;

    private _customCrystalData          : Undefinable<TileCustomCrystalData>;
    private _customCannonData           : Undefinable<TileCustomCannonData>;
    private _customLaserTurretData      : Undefinable<TileCustomLaserTurretData>;
    private _customBuildingData         : Undefinable<TileCustomBuildingData>;

    private readonly _view  = new (getTileViewClass())();
    private _hasFog         = false;
    private _war?           : IBwWar;

    public init(data: SerialTile, gameConfig: GameConfig): void {
        this.deserialize(data, gameConfig);
        this.setHasFog(false);
    }
    public fastInit(data: SerialTile, gameConfig: GameConfig): void {
        this.init(data, gameConfig);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }
    public startRunningView(): void {
        this.flushDataToView();
    }

    public getErrorCodeForTileData(data: SerialTile, playersCountUnneutral: number, gameConfig: GameConfig): ClientErrorCode {
        const playerIndex = data.getPlayerIndex();
        if (playerIndex > playersCountUnneutral) {
            return ClientErrorCode.BwTile_GetErrorCodeForTileData_00;
        }

        try {
            this.init(data, gameConfig);
        } catch (e) {
            return (e as CustomError).errorCode ?? ClientErrorCode.BwTile_GetErrorCodeForTileData_01;
        }

        return ClientErrorCode.NoError;
    }
    public deserialize(data: SerialTile, gameConfig: GameConfig): void {
        this._setGameConfig(gameConfig);

        const gridIndex = getExisted(GridIndex.convertGridIndex(data.getGridIndex()), ClientErrorCode.BwTile_Deserialize_00);
        const gridX     = gridIndex.getX();
        const gridY     = gridIndex.getY();
        if ((gridX < 0)                                                 ||
            (gridY < 0)                                                 ||
            ((gridX + 1) * (gridY + 1) > Common.MaxGridsCount)
        ) {
            throw newError(`Invalid gridX and/or gridY: ${gridX}, ${gridY}`, ClientErrorCode.BwTile_Deserialize_01);
        }

        const objectType    = data.getObjectType();
        const baseType      = data.getBaseType();
        const playerIndex   = data.getPlayerIndex();
        if (!checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType : objectType })) {
            throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTile_Deserialize_04);
        }

        const baseShapeId = data.getBaseShapeId();
        if (!checkIsValidTileBaseShapeId(baseType, baseShapeId)) {
            throw newError(`Invalid baseShapeId: ${baseShapeId}`, ClientErrorCode.BwTile_Deserialize_12);
        }

        const objectShapeId = data.getObjectShapeId();
        if (!checkIsValidTileObjectShapeId(objectType, objectShapeId)) {
            throw newError(`Invalid objectShapeId: ${objectShapeId}`, ClientErrorCode.BwTile_Deserialize_13);
        }

        const decorationType    = data.getDecorationType();
        const decorationShapeId = data.getDecorationShapeId();
        if (!checkIsValidTileDecorationShapeId(decorationType, decorationShapeId)) {
            throw newError(`Invalid decorationType/shapeId: ${decorationType}, ${decorationShapeId}`, ClientErrorCode.BwTile_Deserialize_14);
        }

        const templateCfg       = getExisted(gameConfig.getTileTemplateCfg(getExisted(gameConfig.getTileType(baseType, objectType))));
        const mapWeaponType     = templateCfg.getMapWeaponTypeId();
        const customCrystalData = data.getCustomCrystalData();
        if ((customCrystalData != null) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            throw newError(`CustomCrystalData is present while the tile is not CustomCrystal.`, ClientErrorCode.BwTile_Deserialize_15);
        }
        if ((customCrystalData != null) && (!TilesUtilsCustomTileDataCrystal.checkIsValid(customCrystalData))) {
            throw newError(`Invalid customCrystalData.`, ClientErrorCode.BwTile_Deserialize_16);
        }

        const customCannonData = data.getCustomCannonData();
        if ((customCannonData != null) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            throw newError(`CustomCannonData is present while the tile is not CustomCannon.`, ClientErrorCode.BwTile_Deserialize_17);
        }
        if ((customCannonData != null) && (!Cannon.checkIsValid(customCannonData))) {
            throw newError(`Invalid customCannonData.`, ClientErrorCode.BwTile_Deserialize_18);
        }

        const customLaserTurretData = data.getCustomLaserTurretData();
        if ((customLaserTurretData != null) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            throw newError(`CustomLaserTurretData is present while the tile is not CustomLaserTurret.`, ClientErrorCode.BwTile_Deserialize_19);
        }
        if ((customLaserTurretData != null) && (!LaserTurret.checkIsValid(customLaserTurretData))) {
            throw newError(`Invalid customLaserTurretData.`, ClientErrorCode.BwTile_Deserialize_20);
        }

        const customBuildingData = data.getCustomBuildingData();
        if (customBuildingData != null) {
            if (!templateCfg.getIsCustomizableBuilding()) {
                throw newError(`Invalid customBuildingData.`, ClientErrorCode.BwTile_Deserialize_21);
            }
            if (!Building.checkIsValid(customBuildingData, gameConfig)) {
                throw newError(`Invalid customBuildingData.`, ClientErrorCode.BwTile_Deserialize_22);
            }
        }

        const unfixedBuffArray = data.getUnfixedBuffArray();
        if (unfixedBuffArray?.some(v => !checkIsValid(v))) {
            throw newError(`Invalid buffArray.`, ClientErrorCode.BwTile_Deserialize_23);
        }

        this._setTemplateCfg(templateCfg);
        this._setGridX(gridX);
        this._setGridY(gridY);
        this.setBaseType(baseType);
        this.setDecorationType(decorationType);
        this.setObjectType(objectType);
        this.setPlayerIndex(playerIndex);
        this.setCustomBuildingData(customBuildingData?.clone());

        this.setBaseShapeId(baseShapeId ?? 0);
        this.setDecorationShapeId(decorationShapeId);
        this.setObjectShapeId(objectShapeId ?? 0);
        this.setCurrentHp(data.getCurrentHp());
        this.setCurrentBuildPoint(data.getCurrentBuildPoint());
        this.setCurrentCapturePoint(data.getCurrentCapturePoint());
        this.setGroupedLocationIdArray(data.getGroupedLocationIdArray());
        this.setIsHighlighted(data.getIsHighlighted());
        this.setUnfixedBuffList(unfixedBuffArray.map(v => v.clone()));
        this.setCustomNameId(data.getCustomNameId());

        this._setCustomCrystalData(customCrystalData?.clone());
        this._setCustomCannonData(customCannonData?.clone());
        this._setCustomLaserTurretData(customLaserTurretData?.clone());
    }
    public serialize(): SerialTile {
        return create({
            gridIndex : this.getGridIndex().toProto().toJson(),

            baseType       : this.getBaseType(),
            objectType     : this.getObjectType(),
            decorationType : this.getDecorationType(),
            playerIndex    : this.getPlayerIndex(),

            currentBuildPoint   : this.getCurrentBuildPoint(),
            currentCapturePoint : this.getCurrentCapturePoint(),
            currentHp           : this.getCurrentHp(),

            customCrystalData     : this.getCustomCrystalData()?.toJson() ?? null,
            customCannonData      : this.getCustomCannonData()?.toJson() ?? null,
            customLaserTurretData : this.getCustomLaserTurretData()?.toJson() ?? null,
            customBuildingData    : this.getCustomBuildingData()?.toJson() ?? null,

            baseShapeId            : this.getBaseShapeId(),
            objectShapeId          : this.getObjectShapeId(),
            decorationShapeId      : this.getDecorationShapeId(),
            groupedLocationIdArray : this.getGroupedLocationIdArray(),

            isHighlighted    : this.getIsHighlighted(),
            unfixedBuffArray : this.getUnfixedBuffList().map(v => v.toJson()),
            customNameId     : this.getCustomNameId() ?? null,
        });
    }
    public serializeForCreateSfw(): SerialTile {
        const war = this.getWar();
        return war.getShouldSerializeFullInfoForFreeModeGames()
            ? this.serialize()
            : this.serializeForTeamIndexes(war.getPlayerManager().getWatcherTeamIndexesForSelf());
    }
    public serializeForCreateMfr(): SerialTile {
        return this.serializeForCreateSfw();
    }
    public serializeForTeamIndexes(teamIndexes: Set<number>): SerialTile {
        const war       = this.getWar();
        const gridIndex = this.getGridIndex();
        if (checkIsTileVisibleToTeams(war, gridIndex, teamIndexes)) {
            return this.serialize();

        } else {
            return create({
                gridIndex      : gridIndex.toProto().toJson(),
                baseType       : this.getBaseType(),
                objectType     : this.getObjectType(),
                decorationType : this.getDecorationType(),
                playerIndex    : this.getTemplateCfg().getIsAlwaysShowOwner() ? this.getPlayerIndex() : PlayerIndex.Neutral,

                currentHp           : this.getCurrentHp(),
                currentBuildPoint   : null,
                currentCapturePoint : null,

                customCrystalData     : this.getCustomCrystalData()?.toJson() ?? null,
                customCannonData      : this.getCustomCannonData()?.toJson() ?? null,
                customLaserTurretData : this.getCustomLaserTurretData()?.toJson() ?? null,
                customBuildingData    : this.getCustomBuildingData()?.toJson() ?? null,

                baseShapeId            : this.getBaseShapeId(),
                objectShapeId          : this.getObjectShapeId(),
                decorationShapeId      : this.getDecorationShapeId(),
                groupedLocationIdArray : this.getGroupedLocationIdArray(),

                isHighlighted    : this.getIsHighlighted(),
                unfixedBuffArray : this.getUnfixedBuffList().map(v => v.toJson()),
                customNameId     : this.getCustomNameId() ?? null,
            });
        }
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    public getGameConfig(): GameConfig {
        return getExisted(this._gameConfig);
    }
    private _setGameConfig(config: GameConfig): void {
        this._gameConfig = config;
    }

    private _setTemplateCfg(cfg: TileTemplateCfg): void {
        this._templateCfg = cfg;
    }
    public getTemplateCfg(): TileTemplateCfg {
        return getExisted(this._templateCfg);
    }

    public updateOnUnitLeave(): void {
        this.setCurrentBuildPoint(0);
        this.setCurrentCapturePoint(0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    public getView(): ITileView {
        return this._view;
    }
    public flushDataToView(): void {
        const view  = this.getView();
        const war   = this.getWar();
        view.setData({
            gameConfig       : this.getGameConfig(),
            tileData         : this.serialize(),
            hasFog           : this.getHasFog(),
            skinId           : this.getSkinId(),
            overridingSkinId : getRawOverridingSkinId(war, this.getPlayerIndex()),
            themeType        : this.getTileThemeType(),
            isFullReplay     : war instanceof getRwWarClass(),
        });
        view.updateView();
    }

    public setBaseType(baseType: number): void {
        this._baseType = baseType;
    }
    public getBaseType(): number {
        return getExisted(this._baseType);
    }

    public setObjectType(objectType: number): void {
        this._objectType = objectType;
    }
    public getObjectType(): number {
        return getExisted(this._objectType);
    }

    public setDecorationType(decorationType: number): void {
        this._decorationType = decorationType;
    }
    public getDecorationType(): number {
        return getExisted(this._decorationType, ClientErrorCode.BwTile_GetDecorationType_00);
    }

    public setBaseShapeId(id: number): void {
        this._baseShapeId = id;
    }
    public getBaseShapeId(): number {
        return getExisted(this._baseShapeId);
    }

    public setObjectShapeId(id: number): void {
        this._objectShapeId = id;
    }
    public getObjectShapeId(): number {
        return getExisted(this._objectShapeId);
    }

    public setDecorationShapeId(id: number): void {
        this._decorationShapeId = id;
    }
    public getDecorationShapeId(): number {
        return getExisted(this._decorationShapeId, ClientErrorCode.BwTile_GetDecorationShapeId_00);
    }

    public getSkinId(): number {
        return this.getPlayer().getUnitAndTileSkinId();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hp and armor.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxHp(): Undefinable<number> {
        return this.getTemplateCfg().getMaxHp();
    }

    public getCurrentHp(): number {
        return this._currentHp;
    }
    public setCurrentHp(hp: number): void {
        if ((hp < 0) || (hp > (this.getMaxHp() ?? 0))) {
            throw newError(`Invalid hp: ${hp}`);
        }

        this._currentHp = hp;
    }

    public getArmorType(): Undefinable<number> {
        return this.getTemplateCfg().getArmorTypeId();
    }

    public checkIsArmorAffectByLuck(): boolean {
        return !!this.getTemplateCfg().getIsAffectedByLuck();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxBuildPoint(): Undefinable<number> {
        return this.getTemplateCfg().getMaxBuildPoint();
    }

    public getCurrentBuildPoint(): number {
        return this._currentBuildPoint;
    }
    public setCurrentBuildPoint(point: number): void {
        if ((point < 0) || (point > (this.getMaxBuildPoint() ?? 0))) {
            throw newError(`Invalid build point: ${point}`);
        }

        this._currentBuildPoint = point;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxCapturePoint(): Undefinable<number> {
        return getMaxCapturePoint(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    public getCurrentCapturePoint(): number {
        return this._currentCapturePoint;
    }
    public setCurrentCapturePoint(point: number): void {
        if ((point < 0) || (point > (this.getMaxCapturePoint() ?? 0))) {
            throw newError(`Invalid capture point: ${point}`);
        }

        this._currentCapturePoint = point;
    }

    public getRemainingCapturePoint(): Undefinable<number> {
        const maxCapturePoint = this.getMaxCapturePoint();
        return maxCapturePoint == null
            ? null
            : maxCapturePoint - (this.getCurrentCapturePoint() ?? 0);
    }

    public getIsDefeatedOnCapture(): boolean {
        return getIsDefeatedOnCapture(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for location flags.
    ////////////////////////////////////////////////////////////////////////////////
    public setGroupedLocationIdArray(groupedLocationIdArray: number[]): void {
        this._groupedLocationIdArray = groupedLocationIdArray.concat();
    }
    public getGroupedLocationIdArray(): number[] {
        return this._groupedLocationIdArray;
    }

    public checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray: number[]): boolean {
        const currArray = this.getGroupedLocationIdArray();
        if (currArray == null) {
            return false;
        }

        for (let i = 0; i < GroupCount; ++i) {
            if (currArray[i] & groupedLocationIdArray[i]) {
                return true;
            }
        }

        return false;
    }

    public getHasLocationId(locationId: number): boolean {
        const idArray = this.getGroupedLocationIdArray();
        if (idArray == null) {
            return false;
        }

        const groupedLocationId = idArray[Math.floor((locationId - 1) / GroupSize)];
        return !!((groupedLocationId >>> ((locationId - 1) % GroupSize)) & 1);
    }
    public setHasLocationId(locationId: number, hasId: boolean): void {
        const groupedLocationIdArray  = this._groupedLocationIdArray ??= new Array<number>(GroupCount).fill(0);
        const index                   = Math.floor((locationId - 1) / GroupSize);
        if (hasId) {
            groupedLocationIdArray[index] |= 1 << ((locationId - 1) % GroupSize);
        } else {
            groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % GroupSize));
        }

        dispatch(TypeId.BwTileHasLocationIdSet, this as BwTileHasLocationIdSet);
    }
    public setHasLocationIdWithLocationIdArray(locationIdArray: number[], hasId: boolean): void {
        const groupedLocationIdArray = this._groupedLocationIdArray ??= new Array<number>(GroupCount).fill(0);
        for (const locationId of locationIdArray) {
            const index = Math.floor((locationId - 1) / GroupSize);
            if (hasId) {
                groupedLocationIdArray[index] |= 1 << ((locationId - 1) % GroupSize);
            } else {
                groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % GroupSize));
            }
        }

        dispatch(TypeId.BwTileHasLocationIdSet, this as BwTileHasLocationIdSet);
    }
    public getLocationIdList(hasId: boolean): number[] {
        const locationIdArray: number[] = [];
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
            if (hasId === this.getHasLocationId(locationId)) {
                locationIdArray.push(locationId);
            }
        }
        return locationIdArray;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for highlight.
    ////////////////////////////////////////////////////////////////////////////////
    public getIsHighlighted(): boolean {
        return getExisted(this._isHighlighted);
    }
    public setIsHighlighted(isHighlighted: boolean): void {
        if (this._isHighlighted !== isHighlighted) {
            this._isHighlighted = isHighlighted;
            dispatch(TypeId.BwTileIsHighlightedChanged, this as BwTileIsHighlightChanged);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for buff.
    ////////////////////////////////////////////////////////////////////////////////
    public getAllBuffTypeIdSet(): Set<number> {
        return new Set(this.getUnfixedBuffList()?.map(v => v.getBuffTypeId()));
    }

    public getUnfixedBuffList(): TileBuff[] {
        return this._unfixedBuffList;
    }
    public setUnfixedBuffList(buffArray: TileBuff[]): void {
        this._unfixedBuffList = buffArray.concat();
    }

    public updateUnfixedBuffArrayOnPlayerTurnSwitched(updateView: boolean): boolean {
        const buffArray = this.getUnfixedBuffList();
        if (!buffArray?.length) {
            return false;
        }

        const turnManager   = this.getWar().getTurnManager();
        const turnIndex     = turnManager.getTurnIndex();
        const playerIndex   = turnManager.getPlayerIndexInTurn();
        let isUpdated       = false;
        for (let i = 0; i < buffArray.length; ++i) {
            if (checkIsExpired(buffArray[i], turnIndex, playerIndex)) {
                isUpdated = true;
                buffArray.splice(i--, 1);
            }
        }

        if (isUpdated) {
            if (updateView) {
                this.flushDataToView();
            }
            dispatch(TypeId.BwTileBuffChanged, {
                tile : this,
            } as BwTileBuffChanged);
        }

        return isUpdated;
    }
    public addUnfixedBuff(buff: TileBuff, updateView: boolean): void {
        const buffArray = this.getUnfixedBuffList();
        if (buffArray) {
            buffArray.push(buff);
        } else {
            this.setUnfixedBuffList([buff]);
        }

        if (updateView) {
            this.flushDataToView();
        }
        dispatch(TypeId.BwTileBuffChanged, {
            tile : this,
        } as BwTileBuffChanged);
    }
    public deleteUnfixedBuff(buff: TileBuff, updateView: boolean): boolean {
        const buffArray = this.getUnfixedBuffList();
        if (buffArray == null) {
            return false;
        }

        if (!deleteElementFromList(buffArray, buff)) {
            return false;
        }

        if (updateView) {
            this.flushDataToView();
        }
        dispatch(TypeId.BwTileBuffChanged, {
            tile : this,
        } as BwTileBuffChanged);

        return true;
    }

    public checkHasUnfixedBuff(buffTypeId: number): boolean {
        return this.getUnfixedBuffList().some(v => v.getBuffTypeId() === buffTypeId) ?? false;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for defense amount for units.
    ////////////////////////////////////////////////////////////////////////////////
    public getDefenseAmount(): number {
        return getDefenseAmount(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getDefenseAmountForUnit(unit: IUnit, observerTeamIndexSet: Undefinable<Set<number>>, useDamagePreviewSettings: boolean): number {
        if (!this.checkCanDefendUnit(unit)) {
            return 0;
        }

        const war                       = this.getWar();
        const rawDefenseAmount          = this.getDefenseAmount();
        const unitType                  = unit.getUnitType();
        const gameConfig                = war.getGcData();
        const unitPlayer                = unit.getPlayer();
        const unitPlayerIndex           = unitPlayer.getPlayerIndex();
        const gridIndex                 = this.getGridIndex();
        const coZoneRadius              = unitPlayer.getCoZoneRadius();
        const isCoOnboard               = unit.getIsCoOnboard();
        const damagePreviewSettings     = war.getDamagePreviewSettings();
        const isInCozByPreviewSettings  = ((useDamagePreviewSettings) && (damagePreviewSettings.isEnabled))
            ? damagePreviewSettings.settings.find(v => v.playerIndex === unitPlayerIndex)?.isForcedInCoZone ?? false
            : false;
        const getCoGridIndexArrayOnMap  = createLazyFunc(() =>
            observerTeamIndexSet == null
                ? unitPlayer.getCoGridIndexListOnMap()
                : unitPlayer.getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet)
        );

        for (const skillId of unitPlayer.getCoCurrentSkills()) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            if (skillCfg == null) {
                continue;
            }

            {
                const cfg = skillCfg.getPersistent()?.getSelfDefenseBonusByTileIgnoreHp();
                if ((cfg)                                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))               &&
                    ((isCoOnboard) || (isInCozByPreviewSettings) || (gridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                        coZoneRadius             : coZoneRadius
                    })))
                ) {
                    return rawDefenseAmount;
                }
            }
        }

        return rawDefenseAmount * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
    }

    public getDefenseUnitTypeArray(): Undefinable<number[]> {
        return getDefenseUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }
    public checkCanDefendUnit(unit: IUnit): boolean {
        return checkCanDefendUnit({
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            gameConfig         : this.getGameConfig(),
            unitType           : unit.getUnitType(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for grid position.
    ////////////////////////////////////////////////////////////////////////////////
    private _setGridX(x: number): void {
        this._gridX = x;
    }
    public getGridX(): number {
        return getExisted(this._gridX);
    }

    private _setGridY(y: number): void {
        this._gridY = y;
    }
    public getGridY(): number {
        return getExisted(this._gridY);
    }

    public getGridIndex(): GridIndex {
        return new GridIndex(
            this.getGridX(),
            this.getGridY(),
        );
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for type.
    ////////////////////////////////////////////////////////////////////////////////
    public getTileTypeId(): number {
        return this.getTemplateCfg().getTileTypeId();
    }

    public resetByTypeAndPlayerIndex({ baseType, objectType, playerIndex }: {
        baseType        : number;
        objectType      : number;
        playerIndex     : number;
    }): void {
        const gameConfig = this.getGameConfig();
        if (!checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType : objectType })) {
            throw newError(`Invalid playerIndex: ${playerIndex}, baseType: ${baseType}, objectType: ${objectType}`);
        }

        const newCfg            = getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(baseType, objectType));
        const isSameTileType    = this.getTileTypeId() === newCfg.getTileTypeId();
        const data              = create({
            gridIndex              : this.getGridIndex().toProto().toJson(),
            objectType             : objectType,
            baseType               : baseType,
            playerIndex            : playerIndex,
            baseShapeId            : baseType === this.getBaseType() ? this.getBaseShapeId() : null,
            objectShapeId          : objectType === this.getObjectType() ? this.getObjectShapeId() : null,
            decorationType         : this.getDecorationType(),
            decorationShapeId      : this.getDecorationShapeId(),
            groupedLocationIdArray : this.getGroupedLocationIdArray(),

            currentBuildPoint   : Math.min(this.getCurrentBuildPoint(),     newCfg.getMaxBuildPoint() ?? 0),
            currentCapturePoint : Math.min(this.getCurrentCapturePoint(),   newCfg.getMaxCapturePoint() ?? 0),
            currentHp           : Math.min(this.getCurrentHp(),             newCfg.getMaxHp() ?? 0),

            customBuildingData    : isSameTileType ? this.getCustomBuildingData()?.toJson() ?? null : null,
            customCannonData      : isSameTileType ? this.getCustomCannonData()?.toJson() ?? null : null,
            customCrystalData     : isSameTileType ? this.getCustomCrystalData()?.toJson() ?? null : null,
            customLaserTurretData : isSameTileType ? this.getCustomLaserTurretData()?.toJson() ?? null : null,

            isHighlighted    : this.getIsHighlighted(),
            unfixedBuffArray : this.getUnfixedBuffList().map(v => v.toJson()),
            customNameId     : this.getCustomNameId() ?? null,
        });

        this.init(data, gameConfig);
        this.startRunning(this.getWar());
    }

    public resetOnTileObjectDestroyed(): void {
        const gameConfig    = this.getGameConfig();
        const baseType      = this.getBaseType();
        const objectType    = ObjectTypeId.Empty;
        const newCfg        = getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(baseType, objectType));

        const data          = create({
            gridIndex              : this.getGridIndex().toProto().toJson(),
            playerIndex            : PlayerIndex.Neutral,
            baseType               : baseType,
            baseShapeId            : this.getBaseShapeId(),
            objectType             : objectType,
            objectShapeId          : getNewObjectShapeIdOnObjectDestroyed(this.getObjectType(), this.getObjectShapeId()),
            decorationType         : this.getDecorationType(),
            decorationShapeId      : this.getDecorationShapeId(),
            groupedLocationIdArray : this.getGroupedLocationIdArray(),

            isHighlighted    : this.getIsHighlighted(),
            unfixedBuffArray : this.getUnfixedBuffList().map(v => v.toJson()),
            customNameId     : this.getCustomNameId() ?? null,

            currentBuildPoint   : Math.min(this.getCurrentBuildPoint(),     newCfg.getMaxBuildPoint() ?? 0),
            currentCapturePoint : Math.min(this.getCurrentCapturePoint(),   newCfg.getMaxCapturePoint() ?? 0),
            currentHp           : Math.min(this.getCurrentHp(),             newCfg.getMaxHp() ?? 0),

            customBuildingData    : null,
            customCannonData      : null,
            customCrystalData     : null,
            customLaserTurretData : null,
        });

        this.init(data, gameConfig);
        this.startRunning(this.getWar());
    }

    public deleteTileDecoration(): void {
        this.setDecorationType(0);
        this.setDecorationShapeId(0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for income.
    ////////////////////////////////////////////////////////////////////////////////
    public getIncomePerTurn(): number {
        return getIncomePerTurn(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getIncomeForPlayer(playerIndex: number): number {
        if ((this.getPlayerIndex() !== playerIndex)                                                                 ||
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoIncome))
        ) {
            return 0;
        }

        const war                       = this.getWar();
        const gameConfig                = war.getGcData();
        const player                    = this.getPlayer();
        const selfTileTypeId                  = this.getTileTypeId();
        const selfGridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let modifierForSkill            = 1;
        for (const skillId of player.getCoCurrentSkills()) {
            modifierForSkill *= getTotalMultiplier({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfTileIncome(),
                gameConfig               : gameConfig,
                tileTypeId               : selfTileTypeId,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }

        return Math.floor(
            this.getIncomePerTurn()
            * war.getCommonSettingManager().getPlayerRule(playerIndex).getIncomeMultiplier()
            / 100
            * modifierForSkill
        );
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for player index.
    ////////////////////////////////////////////////////////////////////////////////
    public setPlayerIndex(index: number): void {
        this._playerIndex = index;
    }
    public getPlayerIndex(): number {
        return getExisted(this._playerIndex);
    }

    public getPlayer(): IPlayer {
        return this.getWar().getPlayer(this.getPlayerIndex());
    }

    public getTeamIndex(): number {
        return this.getWar().getPlayer(this.getPlayerIndex()).getTeamIndex();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for move cost.
    ////////////////////////////////////////////////////////////////////////////////
    private _getMoveCostCfg(): { [moveType: number]: MoveCostCfg } {
        return getExisted(this.getGameConfig().getMoveCostCfg(this.getTileTypeId()));
    }
    public checkCanBlockEnemyUnitType(unitType: number): boolean {
        return checkCanBlockEnemyUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public getBlockEnemyUnitTypeArray(): Undefinable<number[]> {
        return getBlockEnemyUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    public getMoveCostByMoveType(moveType: number): Undefinable<number> {
        return this._getMoveCostCfg()[moveType]?.getCost();
    }
    public getMoveCostByUnit(unit: IUnit): Undefinable<number> {
        const unitType      = unit.getUnitType();
        const war           = this.getWar();
        if ((this.getTeamIndex() !== unit.getTeamIndex()) && (this.checkCanBlockEnemyUnitType(unitType))) {
            return null;
        }

        if (checkHasAnyOverlap(this.getGroupedLocationIdArray(), unit.getForbiddenGroupedLocationIdArray())) {
            return null;
        }

        const rawCost = this.getMoveCostByMoveType(unit.getMoveTypeId());
        if (rawCost == null) {
            return null;
        }

        const tileType                  = this.getTileTypeId();
        const gameConfig                = war.getGcData();
        const weatherType               = war.getWeatherManager().getCurrentWeatherType();
        const player                    = unit.getPlayer();
        const gridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of player.getCoCurrentSkills() || []) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitMoveCost();
            if ((cfg)                                                                                   &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))          &&
                (gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId() ?? 0))          &&
                (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId() ?? 0)) &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                    coZoneRadius             : coZoneRadius,
                }))
            ) {
                return Math.min(rawCost, cfg.getFixedCost() ?? 0);
            }
        }

        return rawCost;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for repair/supply unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getRepairNormalizedHp(): Undefinable<number> {
        return getRepairNormalizedHp(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    public getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number } {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGameConfig();
        const gridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let amountModifier              = 0;
        let costMultiplierPct           = 100;
        for (const skillId of player.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfRepairAmountBonus();
            if ((cfg)                                               &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                    coZoneRadius             : coZoneRadius,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                }))
            ) {
                amountModifier      += cfg.getRepairOffsetFromTile() ?? 0;
                costMultiplierPct   = costMultiplierPct * (cfg.getCostMultiplierPct() ?? 0) / 100;
            }
        }

        return { amountModifier, costMultiplierPct };
    }

    public checkCanRepairOrSupplyUnitType(unitType: number): boolean {
        return checkCanRepairOrSupplyUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public getRepairUnitTypeArray(): Undefinable<number[]> {
        return getRepairUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    public getRepairHpAndCostForUnit(unit: IUnit): Undefinable<RepairHpAndCost> {
        if ((this.getTeamIndex() !== unit.getTeamIndex()) || (!this.checkCanRepairOrSupplyUnitType(unit.getUnitType()))) {
            return null;
        }

        const cfgNormalizedRepairHp = this.getRepairNormalizedHp();
        if (cfgNormalizedRepairHp == null) {
            return {
                hp   : 0,
                cost : 0,
            };
        }

        const modifier              = this.getNormalizedRepairAmountAndCostModifier();
        const productionCost        = Math.floor(unit.getProductionFinalCost() * modifier.costMultiplierPct / 100);
        const currentHp             = unit.getCurrentHp();
        const normalizedMaxHp       = unit.getNormalizedMaxHp();
        const normalizedCurrentHp   = getNormalizedHp(currentHp);
        const normalizedRepairHp    = Math.min(
            normalizedMaxHp - normalizedCurrentHp,
            cfgNormalizedRepairHp + modifier.amountModifier,
            productionCost > 0
                ? Math.floor(Math.max(0, unit.getPlayer().getFund()) * normalizedMaxHp / productionCost)
                : Number.MAX_SAFE_INTEGER,
        );
        return {
            hp   : (normalizedRepairHp + normalizedCurrentHp) * Hp.Normalizer - currentHp,
            cost : Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hide unit.
    ////////////////////////////////////////////////////////////////////////////////
    public checkCanHideUnitType(unitType: number): boolean {
        return checkCanHideUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public checkIsUnitHider(): boolean {
        return !!this.getHideUnitTypeArray()?.length;
    }
    public getHideUnitTypeArray(): Undefinable<number[]> {
        return getHideUnitTypeArray({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): Undefinable<SelfTileEnabledForUnitProduction> {
        const war       = this.getWar();
        const player    = war.getPlayerManager().getPlayer(playerIndex);
        if ((!player.getCoId()) || (this.getPlayerIndex() !== playerIndex)) {
            return null;
        }

        const gameConfig                = war.getGcData();
        const selfTileTypeId            = this.getTileTypeId();
        const coZoneRadius              = player.getCoZoneRadius();
        const selfGridIndex             = this.getGridIndex();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of player.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfTileEnabledForUnitProduction();
            if (checkIsEffective({
                cfg                      : cfg,
                gameConfig               : gameConfig,
                tileTypeId               : selfTileTypeId,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            })) {
                return cfg;
            }
        }

        return null;
    }

    /** 把co技能，事件，规则，buff全都考虑了进去 */
    public checkIsUnitProducerForPlayer(playerIndex: number): boolean {
        if ((this.getPlayerIndex() !== playerIndex)                                                                             ||
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoProduction))
        ) {
            return false;
        }

        const war               = this.getWar();
        const effectiveCoSkill  = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTypeArray     = effectiveCoSkill
            ? war.getGcData().getUnitCategoryCfg(effectiveCoSkill.getUnitCategoryId() ?? CategoryId.All)?.getUnitTypeIds()
            : this.getRegularProducibleUnitTypeArray();
        return unitTypeArray?.some(v => war.checkCanProduceUnitByOpaAndRule(playerIndex, v)) ?? false;
    }

    /** 把co技能，事件，规则，buff全都考虑了进去 */
    public getProducibleUnitTypeArrayForPlayer(playerIndex: number): Undefinable<number[]> {
        if ((this.getPlayerIndex() !== playerIndex)                                                                             ||
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoProduction))
        ) {
            return null;
        }

        const war               = this.getWar();
        const effectiveCoSkill  = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTypeArray     = effectiveCoSkill
            ? war.getGcData().getUnitCategoryCfg(effectiveCoSkill.getUnitCategoryId() ?? CategoryId.All)?.getUnitTypeIds()
            : this.getRegularProducibleUnitTypeArray();
        return unitTypeArray?.filter(v => war.checkCanProduceUnitByOpaAndRule(playerIndex, v));
    }

    /** 只考虑地形本身属性，不考虑co技能、事件、规则、buff */
    public getRegularProducibleUnitTypeArray(): Undefinable<number[]> {
        return getProducibleUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for vision.
    ////////////////////////////////////////////////////////////////////////////////
    public getCfgVisionRange(): number {
        return getVisionRange(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getIsVisionEnabledForAllPlayers(): boolean {
        return getIsVisionEnabledForAllPlayers(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    public getFinalVisionRange(): number {
        const war                   = this.getWar();
        const tileVisionFixedCfg    = war.getWeatherManager().getCurrentWeatherCfg().getTileVisionFixed();
        if ((tileVisionFixedCfg)                                                                        &&
            (war.getGcData().checkIsTileTypeInCategory(this.getTileTypeId(), tileVisionFixedCfg[0]))
        ) {
            return tileVisionFixedCfg[1];
        }

        return Math.max(
            0,
            this.getCfgVisionRange() + war.getCommonSettingManager().getPlayerRule(this.getPlayerIndex()).getTileVisionRangeModifier()
        );
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for global attack/defense bonus.
    ////////////////////////////////////////////////////////////////////////////////
    public getGlobalAttackBonus(): number {
        return getGlobalAttackBonus(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getGlobalDefenseBonus(): number {
        return getGlobalDefenseBonus(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for load co.
    ////////////////////////////////////////////////////////////////////////////////
    public getCoBoardUnitTypeArray(): Undefinable<number[]> {
        return getCoBoardUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // custom name
    ////////////////////////////////////////////////////////////////////////////////
    public getCustomNameId(): Undefinable<number> {
        return this._customNameId;
    }
    public setCustomNameId(nameId: Undefinable<number>): void {
        if ((nameId != null)                                        &&
            ((!checkIsValidCustomNameId(nameId)))
        ) {
            throw newError(`Invalid nameId: ${nameId}`);
        }

        if (this.getCustomNameId() !== nameId) {
            this._customNameId = nameId;
            dispatch(TypeId.BwTileCustomNameIdChanged);
        }
    }

    public getCustomName(languageType = getCurrentLanguageType()): Undefinable<string> {
        const nameId = this.getCustomNameId();
        return getLanguageText({
            textArray    : this.getWar().getTileMap().getTileCustomNameArray()?.find(v => (v.getNameId() ?? 0) === nameId)?.getNameTextArray(),
            languageType : languageType,
            useAlternate : false,
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for map weapon.
    ////////////////////////////////////////////////////////////////////////////////
    public getMapWeaponType(): Undefinable<number> {
        return this.getTemplateCfg().getMapWeaponTypeId();
    }
    public checkIsMapWeapon(): boolean {
        return this.getTemplateCfg().getMapWeaponTypeId() != null;
    }
    public checkIsCustomMapWeapon(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType != null) && (AllCustomizableTypeIdArray.indexOf(mapWeaponType) >= 0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for crystal data.
    ////////////////////////////////////////////////////////////////////////////////
    public getFinalCrystalData(): Undefinable<TileCustomCrystalData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === TilesConstantsMapWeaponTypeId.Crystal) {
            return Crystal;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CustomCrystal) {
            return this.getCustomCrystalData() ?? Crystal;
        } else {
            return null;
        }
    }
    public getCustomCrystalData(): Undefinable<TileCustomCrystalData> {
        return this._customCrystalData;
    }
    private _setCustomCrystalData(data: Undefinable<TileCustomCrystalData>): void {
        this._customCrystalData = data;
    }

    public checkIsNormalCrystal(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === TilesConstantsMapWeaponTypeId.Crystal);
    }
    private _initCustomCrystalData(): TileCustomCrystalData {
        return this._customCrystalData ??= Crystal.clone();
    }
    public setCustomCrystalRadius(radius: number): void {
        this._initCustomCrystalData().setRadius(radius);
    }
    public setCustomCrystalPriority(priority: number): void {
        this._initCustomCrystalData().setPriority(priority);
    }
    public setCustomCrystalCanAffectSelf(canAffect: boolean): void {
        this._initCustomCrystalData().setCanAffectSelf(canAffect);
    }
    public setCustomCrystalCanAffectAlly(canAffect: boolean): void {
        this._initCustomCrystalData().setCanAffectAlly(canAffect);
    }
    public setCustomCrystalCanAffectEnemy(canAffect: boolean): void {
        this._initCustomCrystalData().setCanAffectEnemy(canAffect);
    }
    public setCustomCrystalDeltaFund(deltaFund: number): void {
        this._initCustomCrystalData().setOffsetFund(deltaFund);
    }
    public setCustomCrystalDeltaEnergyPercentage(percentage: number): void {
        this._initCustomCrystalData().setOffsetEnergyPercentage(percentage);
    }
    public setCustomCrystalOffsetHp(deltaHp: number): void {
        this._initCustomCrystalData().setOffsetHp(deltaHp);
    }
    public setCustomCrystalCanBeFatal(value: boolean): void {
        this._initCustomCrystalData().setCanBeFatal(value);
    }
    public setCustomCrystalDeltaPrimaryAmmoPercentage(percentage: number): void {
        this._initCustomCrystalData().setOffsetPrimaryAmmoPercentage(percentage);
    }
    public setCustomCrystalDeltaFuelPercentage(percentage: number): void {
        this._initCustomCrystalData().setOffsetFuelPercentage(percentage);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for cannon data.
    ////////////////////////////////////////////////////////////////////////////////
    public getFinalCannonData(): Undefinable<TileCustomCannonData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonDown) {
            return CannonDown;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonLeft) {
            return CannonLeft;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonUp) {
            return CannonUp;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonRight) {
            return CannonRight;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CustomCannon) {
            return this.getCustomCannonData() ?? CustomCannon;
        } else {
            return null;
        }
    }
    public getCustomCannonData(): Undefinable<TileCustomCannonData> {
        return this._customCannonData;
    }
    private _setCustomCannonData(data: Undefinable<TileCustomCannonData>): void {
        this._customCannonData = data;
    }

    public checkIsNormalCannon(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonRight)
            || (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonUp)
            || (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonLeft)
            || (mapWeaponType === TilesConstantsMapWeaponTypeId.CannonDown);
    }
    private _initCustomCannonData(): TileCustomCannonData {
        return this._customCannonData ??= CustomCannon.clone();
    }

    public setCustomCannonRangeForUp(rangeForUp: number): void {
        this._initCustomCannonData().setRangeForUp(rangeForUp);
    }
    public setCustomCannonRangeForDown(rangeForDown: number): void {
        this._initCustomCannonData().setRangeForDown(rangeForDown);
    }
    public setCustomCannonRangeForLeft(rangeForLeft: number): void {
        this._initCustomCannonData().setRangeForLeft(rangeForLeft);
    }
    public setCustomCannonRangeForRight(rangeForRight: number): void {
        this._initCustomCannonData().setRangeForRight(rangeForRight);
    }

    public setCustomCannonPriority(priority: number): void {
        this._initCustomCannonData().setPriority(priority);
    }
    public setCustomCannonMaxTargetCount(count: number): void {
        this._initCustomCannonData().setMaxTargetCount(count);
    }

    public setCustomCannonCanAffectSelf(canAffect: boolean): void {
        this._initCustomCannonData().setCanAffectSelf(canAffect);
    }
    public setCustomCannonCanAffectAlly(canAffect: boolean): void {
        this._initCustomCannonData().setCanAffectAlly(canAffect);
    }
    public setCustomCannonCanAffectEnemy(canAffect: boolean): void {
        this._initCustomCannonData().setCanAffectEnemy(canAffect);
    }

    public setCustomCannonOffsetHp(deltaHp: number): void {
        this._initCustomCannonData().setOffsetHp(deltaHp);
    }
    public setCustomCannonCanBeFatal(value: boolean): void {
        this._initCustomCannonData().setCanBeFatal(value);
    }
    public setCustomCannonDeltaPrimaryAmmoPercentage(percentage: number): void {
        this._initCustomCannonData().setOffsetPrimaryAmmoPercentage(percentage);
    }
    public setCustomCannonDeltaFuelPercentage(percentage: number): void {
        this._initCustomCannonData().setOffsetFuelPercentage(percentage);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for cannon data.
    ////////////////////////////////////////////////////////////////////////////////
    public getFinalLaserTurretData(): Undefinable<TileCustomLaserTurretData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === TilesConstantsMapWeaponTypeId.LaserTurret) {
            return CustomLaserTurret;
        } else if (mapWeaponType === TilesConstantsMapWeaponTypeId.CustomLaserTurret) {
            return this.getCustomLaserTurretData() ?? CustomLaserTurret;
        } else {
            return null;
        }
    }
    public getCustomLaserTurretData(): Undefinable<TileCustomLaserTurretData> {
        return this._customLaserTurretData;
    }
    private _setCustomLaserTurretData(data: Undefinable<TileCustomLaserTurretData>): void {
        this._customLaserTurretData = data;
    }

    public checkIsNormalLaserTurret(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === TilesConstantsMapWeaponTypeId.LaserTurret);
    }
    private _initCustomLaserTurretData(): TileCustomLaserTurretData {
        return this._customLaserTurretData ??= CustomLaserTurret.clone();
    }

    public setCustomLaserTurretRangeForUp(rangeForUp: number): void {
        this._initCustomLaserTurretData().setRangeForUp(rangeForUp);
    }
    public setCustomLaserTurretRangeForDown(rangeForDown: number): void {
        this._initCustomLaserTurretData().setRangeForDown(rangeForDown);
    }
    public setCustomLaserTurretRangeForLeft(rangeForLeft: number): void {
        this._initCustomLaserTurretData().setRangeForLeft(rangeForLeft);
    }
    public setCustomLaserTurretRangeForRight(rangeForRight: number): void {
        this._initCustomLaserTurretData().setRangeForRight(rangeForRight);
    }

    public setCustomLaserTurretPriority(priority: number): void {
        this._initCustomLaserTurretData().setPriority(priority);
    }

    public setCustomLaserTurretCanAffectSelf(canAffect: boolean): void {
        this._initCustomLaserTurretData().setCanAffectSelf(canAffect);
    }
    public setCustomLaserTurretCanAffectAlly(canAffect: boolean): void {
        this._initCustomLaserTurretData().setCanAffectAlly(canAffect);
    }
    public setCustomLaserTurretCanAffectEnemy(canAffect: boolean): void {
        this._initCustomLaserTurretData().setCanAffectEnemy(canAffect);
    }

    public setCustomLaserTurretOffsetHp(deltaHp: number): void {
        this._initCustomLaserTurretData().setOffsetHp(deltaHp);
    }
    public setCustomLaserTurretCanBeFatal(value: boolean): void {
        this._initCustomLaserTurretData().setCanBeFatal(value);
    }
    public setCustomLaserTurretDeltaPrimaryAmmoPercentage(percentage: number): void {
        this._initCustomLaserTurretData().setOffsetPrimaryAmmoPercentage(percentage);
    }
    public setCustomLaserTurretDeltaFuelPercentage(percentage: number): void {
        this._initCustomLaserTurretData().setOffsetFuelPercentage(percentage);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for custom building data.
    ////////////////////////////////////////////////////////////////////////////////
    public setCustomBuildingData(data: Undefinable<TileCustomBuildingData>): void {
        this._customBuildingData = data;
    }
    public getCustomBuildingData(): Undefinable<TileCustomBuildingData> {
        return this._customBuildingData;
    }

    public getIsCustomizableBuilding(): boolean {
        return this.getTemplateCfg().getIsCustomizableBuilding();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for fog.
    ////////////////////////////////////////////////////////////////////////////////
    public setHasFog(hasFog: boolean): void {
        this._hasFog = hasFog;
    }
    public getHasFog(): boolean {
        return this._hasFog;
    }

    public resetTileDataAsHasFog(): void {
        this.setHasFog(true);

        const data = create({
            gridIndex              : this.getGridIndex().toProto().toJson(),
            baseType               : this.getBaseType(),
            decorationType         : this.getDecorationType(),
            objectType             : this.getObjectType(),
            playerIndex            : this.getTemplateCfg().getIsAlwaysShowOwner() ? this.getPlayerIndex() : PlayerIndex.Neutral,
            baseShapeId            : this.getBaseShapeId(),
            decorationShapeId      : this.getDecorationShapeId(),
            objectShapeId          : this.getObjectShapeId(),
            groupedLocationIdArray : this.getGroupedLocationIdArray(),

            currentHp           : this.getCurrentHp(),
            currentBuildPoint   : null,
            currentCapturePoint : null,

            customCannonData      : this.getCustomCannonData()?.toJson() ?? null,
            customCrystalData     : this.getCustomCrystalData()?.toJson() ?? null,
            customLaserTurretData : this.getCustomLaserTurretData()?.toJson() ?? null,
            customBuildingData    : this.getCustomBuildingData()?.toJson() ?? null,

            isHighlighted    : this.getIsHighlighted(),
            unfixedBuffArray : this.getUnfixedBuffList().map(v => v.toJson()),
            customNameId     : this.getCustomNameId() ?? null,
        });

        this.deserialize(data, this.getGameConfig());
    }

    public getTileThemeType(): number {
        const war = this.getWar();
        return war.getInstanceWarRule().getWarRuleCommonData()?.getFixedTileTheme()
            ?? getExisted(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getTileTheme());
    }
}

function getNewObjectShapeIdOnObjectDestroyed(oldType: number, oldShapeId: number): number {
    const shapeIdArray = getExisted(getTileObjectCfg(oldType)?.shapeIdsAfterDestruction);
    for (let i = 1; i < shapeIdArray.length; i += 2) {
        if (shapeIdArray[i] === oldShapeId) {
            return shapeIdArray[i + 1];
        }
    }
    return shapeIdArray[0];
}
