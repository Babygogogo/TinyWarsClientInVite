import {
    CoSkills_Utils_Persistent_SelfTileEnabledForUnitProduction,
    GameConfigs_GameConfig,
    ForceSkins_Utils,
    CoSkills_Utils_Persistent_SelfTileIncome,
    AuxiliaryTypes_GridIndex,
    ReplayWar_Model_RwWar,
    Tiles_TileView,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Interface_IBwWar,
    Tiles_Constants_MapWeapon,
    TileBuffs_Constants,
    Tiles_Utils_CustomTileData,
    Tiles_Constants_DefaultCustomTileData,
    Units_Constants,
    Tiles_Utils_Common,
    Locations_Utils,
    TileBuffs_Utils_Common,
    Visibilities_Utils,
    TileObjects_Utils,
    TileBases_Utils,
    TileDecorations_Utils,
    Utils_ClientErrorCode,
    Maps_Constants,
    Tiles_Utils_Serialization,
    Helpers_Misc,
    Helpers_Collection,
    Notifications_Dispatcher,
    Lang_Utils,
    Units_Utils_Common,
    Locations_Constants,
    Tiles_Constants_Common,
    Players_Constants,
    Notifications_TypeId,
    type Notifications_DataTypes,
    type Players_IPlayer,
    type Tiles_ITile,
    type Tiles_ITileView,
    type Units_IUnit,
} from "../internal.ts";

import type { SelfTileEnabledForUnitProduction } from "../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import type { MoveCostCfg } from "../proto/schema/CommonProto/Config/MoveCostCfg.ts";
import type { TileTemplateCfg } from "../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { TileBuff } from "../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { TileCustomBuildingData } from "../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";

export class Tile implements Tiles_ITile.ITile {
    private _gameConfig?                : GameConfigs_GameConfig.GameConfig;
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
    private _customNameId               : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    private _customCrystalData          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCrystalData>;
    private _customCannonData           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCannonData>;
    private _customLaserTurretData      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomLaserTurretData>;
    private _customBuildingData         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomBuildingData>;

    private readonly _view  = new Tiles_TileView.TileView();
    private _hasFog         = false;
    private _war?           : BaseWar_Interface_IBwWar.IBwWar;

    public init(data: SerialTile, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this.deserialize(data, gameConfig);
        this.setHasFog(false);
    }
    public fastInit(data: SerialTile, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this.init(data, gameConfig);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }
    public startRunningView(): void {
        this.flushDataToView();
    }

    public getErrorCodeForTileData(data: SerialTile, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
        const playerIndex = data.getPlayerIndex();
        if (playerIndex > playersCountUnneutral) {
            return Utils_ClientErrorCode.ClientErrorCode.BwTile_GetErrorCodeForTileData_00;
        }

        try {
            this.init(data, gameConfig);
        } catch (e) {
            return (e as AuxiliaryTypes_AuxiliaryTypes.CustomError).errorCode ?? Utils_ClientErrorCode.ClientErrorCode.BwTile_GetErrorCodeForTileData_01;
        }

        return Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
    public deserialize(data: SerialTile, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._setGameConfig(gameConfig);

        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_00);
        const gridX     = gridIndex.getX();
        const gridY     = gridIndex.getY();
        if ((gridX < 0)                                                 ||
            (gridY < 0)                                                 ||
            ((gridX + 1) * (gridY + 1) > Maps_Constants.Common.MaxGridsCount)
        ) {
            throw Helpers_Misc.newError(`Invalid gridX and/or gridY: ${gridX}, ${gridY}`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_01);
        }

        const objectType    = data.getObjectType();
        const baseType      = data.getBaseType();
        const playerIndex   = data.getPlayerIndex();
        if (!TileObjects_Utils.checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType : objectType })) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_04);
        }

        const baseShapeId = data.getBaseShapeId();
        if (!TileBases_Utils.checkIsValidTileBaseShapeId(baseType, baseShapeId)) {
            throw Helpers_Misc.newError(`Invalid baseShapeId: ${baseShapeId}`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_12);
        }

        const objectShapeId = data.getObjectShapeId();
        if (!TileObjects_Utils.checkIsValidTileObjectShapeId(objectType, objectShapeId)) {
            throw Helpers_Misc.newError(`Invalid objectShapeId: ${objectShapeId}`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_13);
        }

        const decorationType    = data.getDecorationType();
        const decorationShapeId = data.getDecorationShapeId();
        if (!TileDecorations_Utils.checkIsValidTileDecorationShapeId(decorationType, decorationShapeId)) {
            throw Helpers_Misc.newError(`Invalid decorationType/shapeId: ${decorationType}, ${decorationShapeId}`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_14);
        }

        const templateCfg       = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(Helpers_Misc.getExisted(gameConfig.getTileType(baseType, objectType))));
        const mapWeaponType     = templateCfg.getMapWeaponTypeId();
        const customCrystalData = data.getCustomCrystalData();
        if ((customCrystalData != null) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            throw Helpers_Misc.newError(`CustomCrystalData is present while the tile is not CustomCrystal.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_15);
        }
        if ((customCrystalData != null) && (!Tiles_Utils_CustomTileData.Crystal.checkIsValid(customCrystalData))) {
            throw Helpers_Misc.newError(`Invalid customCrystalData.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_16);
        }

        const customCannonData = data.getCustomCannonData();
        if ((customCannonData != null) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            throw Helpers_Misc.newError(`CustomCannonData is present while the tile is not CustomCannon.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_17);
        }
        if ((customCannonData != null) && (!Tiles_Utils_CustomTileData.Cannon.checkIsValid(customCannonData))) {
            throw Helpers_Misc.newError(`Invalid customCannonData.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_18);
        }

        const customLaserTurretData = data.getCustomLaserTurretData();
        if ((customLaserTurretData != null) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            throw Helpers_Misc.newError(`CustomLaserTurretData is present while the tile is not CustomLaserTurret.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_19);
        }
        if ((customLaserTurretData != null) && (!Tiles_Utils_CustomTileData.LaserTurret.checkIsValid(customLaserTurretData))) {
            throw Helpers_Misc.newError(`Invalid customLaserTurretData.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_20);
        }

        const customBuildingData = data.getCustomBuildingData();
        if (customBuildingData != null) {
            if (!templateCfg.getIsCustomizableBuilding()) {
                throw Helpers_Misc.newError(`Invalid customBuildingData.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_21);
            }
            if (!Tiles_Utils_CustomTileData.Building.checkIsValid(customBuildingData, gameConfig)) {
                throw Helpers_Misc.newError(`Invalid customBuildingData.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_22);
            }
        }

        const unfixedBuffArray = data.getUnfixedBuffArray();
        if (unfixedBuffArray?.some(v => !TileBuffs_Utils_Common.checkIsValid(v))) {
            throw Helpers_Misc.newError(`Invalid buffArray.`, Utils_ClientErrorCode.ClientErrorCode.BwTile_Deserialize_23);
        }

        this._setTemplateCfg(templateCfg);
        this._setGridX(gridX);
        this._setGridY(gridY);
        this.setBaseType(baseType);
        this.setDecorationType(decorationType);
        this.setObjectType(objectType);
        this.setPlayerIndex(playerIndex);
        this.setCustomBuildingData(customBuildingData?.clone());

        this.setBaseShapeId(baseShapeId);
        this.setDecorationShapeId(decorationShapeId);
        this.setObjectShapeId(objectShapeId);
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
        return Tiles_Utils_Serialization.create({
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
        if (Visibilities_Utils.checkIsTileVisibleToTeams(war, gridIndex, teamIndexes)) {
            return this.serialize();

        } else {
            return Tiles_Utils_Serialization.create({
                gridIndex      : gridIndex.toProto().toJson(),
                baseType       : this.getBaseType(),
                objectType     : this.getObjectType(),
                decorationType : this.getDecorationType(),
                playerIndex    : this.getTemplateCfg().getIsAlwaysShowOwner() ? this.getPlayerIndex() : Players_Constants.PlayerIndex.Neutral,

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

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    public getGameConfig(): GameConfigs_GameConfig.GameConfig {
        return Helpers_Misc.getExisted(this._gameConfig);
    }
    private _setGameConfig(config: GameConfigs_GameConfig.GameConfig): void {
        this._gameConfig = config;
    }

    private _setTemplateCfg(cfg: TileTemplateCfg): void {
        this._templateCfg = cfg;
    }
    public getTemplateCfg(): TileTemplateCfg {
        return Helpers_Misc.getExisted(this._templateCfg);
    }

    public updateOnUnitLeave(): void {
        this.setCurrentBuildPoint(0);
        this.setCurrentCapturePoint(0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    public getView(): Tiles_ITileView.ITileView {
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
            overridingSkinId : ForceSkins_Utils.getRawOverridingSkinId(war, this.getPlayerIndex()),
            themeType        : this.getTileThemeType(),
            isFullReplay     : war instanceof ReplayWar_Model_RwWar.RwWar,
        });
        view.updateView();
    }

    public setBaseType(baseType: number): void {
        this._baseType = baseType;
    }
    public getBaseType(): number {
        return this._baseType;
    }

    public setObjectType(objectType: number): void {
        this._objectType = objectType;
    }
    public getObjectType(): number {
        return this._objectType;
    }

    public setDecorationType(decorationType: number): void {
        this._decorationType = decorationType;
    }
    public getDecorationType(): number {
        return this._decorationType;
    }

    public setBaseShapeId(id: number): void {
        this._baseShapeId = id;
    }
    public getBaseShapeId(): number {
        return this._baseShapeId;
    }

    public setObjectShapeId(id: number): void {
        this._objectShapeId = id;
    }
    public getObjectShapeId(): number {
        return this._objectShapeId;
    }

    public setDecorationShapeId(id: number): void {
        this._decorationShapeId = id;
    }
    public getDecorationShapeId(): number {
        return this._decorationShapeId;
    }

    public getSkinId(): number {
        return this.getPlayer().getUnitAndTileSkinId();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hp and armor.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxHp(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this.getTemplateCfg().getMaxHp();
    }

    public getCurrentHp(): number {
        return this._currentHp;
    }
    public setCurrentHp(hp: number): void {
        if ((hp < 0) || (hp > (this.getMaxHp() ?? 0))) {
            throw Helpers_Misc.newError(`Invalid hp: ${hp}`);
        }

        this._currentHp = hp;
    }

    public getArmorType(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this.getTemplateCfg().getArmorTypeId();
    }

    public checkIsArmorAffectByLuck(): boolean {
        return !!this.getTemplateCfg().getIsAffectedByLuck();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxBuildPoint(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this.getTemplateCfg().getMaxBuildPoint();
    }

    public getCurrentBuildPoint(): number {
        return this._currentBuildPoint;
    }
    public setCurrentBuildPoint(point: number): void {
        if ((point < 0) || (point > (this.getMaxBuildPoint() ?? 0))) {
            throw Helpers_Misc.newError(`Invalid build point: ${point}`);
        }

        this._currentBuildPoint = point;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxCapturePoint(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return Tiles_Utils_Common.getMaxCapturePoint(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    public getCurrentCapturePoint(): number {
        return this._currentCapturePoint;
    }
    public setCurrentCapturePoint(point: number): void {
        if ((point < 0) || (point > (this.getMaxCapturePoint() ?? 0))) {
            throw Helpers_Misc.newError(`Invalid capture point: ${point}`);
        }

        this._currentCapturePoint = point;
    }

    public getRemainingCapturePoint(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        const maxCapturePoint = this.getMaxCapturePoint();
        return maxCapturePoint == null
            ? null
            : maxCapturePoint - (this.getCurrentCapturePoint());
    }

    public getIsDefeatedOnCapture(): boolean {
        return Tiles_Utils_Common.getIsDefeatedOnCapture(this.getTemplateCfg(), this.getCustomBuildingData());
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

        for (let i = 0; i < Locations_Constants.GroupCount; ++i) {
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

        const groupedLocationId = idArray[Math.floor((locationId - 1) / Locations_Constants.GroupSize)];
        return !!((groupedLocationId >>> ((locationId - 1) % Locations_Constants.GroupSize)) & 1);
    }
    public setHasLocationId(locationId: number, hasId: boolean): void {
        const groupedLocationIdArray  = this._groupedLocationIdArray ??= new Array<number>(Locations_Constants.GroupCount).fill(0);
        const index                   = Math.floor((locationId - 1) / Locations_Constants.GroupSize);
        if (hasId) {
            groupedLocationIdArray[index] |= 1 << ((locationId - 1) % Locations_Constants.GroupSize);
        } else {
            groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % Locations_Constants.GroupSize));
        }

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileHasLocationIdSet, this as Notifications_DataTypes.BwTileHasLocationIdSet);
    }
    public setHasLocationIdWithLocationIdArray(locationIdArray: number[], hasId: boolean): void {
        const groupedLocationIdArray = this._groupedLocationIdArray ??= new Array<number>(Locations_Constants.GroupCount).fill(0);
        for (const locationId of locationIdArray) {
            const index = Math.floor((locationId - 1) / Locations_Constants.GroupSize);
            if (hasId) {
                groupedLocationIdArray[index] |= 1 << ((locationId - 1) % Locations_Constants.GroupSize);
            } else {
                groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % Locations_Constants.GroupSize));
            }
        }

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileHasLocationIdSet, this as Notifications_DataTypes.BwTileHasLocationIdSet);
    }
    public getLocationIdList(hasId: boolean): number[] {
        const locationIdArray: number[] = [];
        for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
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
        return this._isHighlighted;
    }
    public setIsHighlighted(isHighlighted: boolean): void {
        if (this._isHighlighted !== isHighlighted) {
            this._isHighlighted = isHighlighted;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileIsHighlightedChanged, this as Notifications_DataTypes.BwTileIsHighlightChanged);
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
            if (TileBuffs_Utils_Common.checkIsExpired(buffArray[i], turnIndex, playerIndex)) {
                isUpdated = true;
                buffArray.splice(i--, 1);
            }
        }

        if (isUpdated) {
            if (updateView) {
                this.flushDataToView();
            }
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileBuffChanged, {
                tile : this,
            } as Notifications_DataTypes.BwTileBuffChanged);
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
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileBuffChanged, {
            tile : this,
        } as Notifications_DataTypes.BwTileBuffChanged);
    }
    public deleteUnfixedBuff(buff: TileBuff, updateView: boolean): boolean {
        const buffArray = this.getUnfixedBuffList();
        if (buffArray == null) {
            return false;
        }

        if (!Helpers_Collection.deleteElementFromList(buffArray, buff)) {
            return false;
        }

        if (updateView) {
            this.flushDataToView();
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileBuffChanged, {
            tile : this,
        } as Notifications_DataTypes.BwTileBuffChanged);

        return true;
    }

    public checkHasUnfixedBuff(buffTypeId: number): boolean {
        return this.getUnfixedBuffList().some(v => v.getBuffTypeId() === buffTypeId);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for defense amount for units.
    ////////////////////////////////////////////////////////////////////////////////
    public getDefenseAmount(): number {
        return Tiles_Utils_Common.getDefenseAmount(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getDefenseAmountForUnit(unit: Units_IUnit.IUnit, observerTeamIndexSet: AuxiliaryTypes_AuxiliaryTypes.Undefinable<Set<number>>, useDamagePreviewSettings: boolean): number {
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
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() =>
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
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId()))               &&
                    ((isCoOnboard) || (isInCozByPreviewSettings) || (gridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
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

    public getDefenseUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getDefenseUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }
    public checkCanDefendUnit(unit: Units_IUnit.IUnit): boolean {
        return Tiles_Utils_Common.checkCanDefendUnit({
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
        return this._gridX;
    }

    private _setGridY(y: number): void {
        this._gridY = y;
    }
    public getGridY(): number {
        return this._gridY;
    }

    public getGridIndex(): AuxiliaryTypes_GridIndex.GridIndex {
        return new AuxiliaryTypes_GridIndex.GridIndex(
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
        if (!TileObjects_Utils.checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType : objectType })) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}, baseType: ${baseType}, objectType: ${objectType}`);
        }

        const newCfg            = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(baseType, objectType));
        const isSameTileType    = this.getTileTypeId() === newCfg.getTileTypeId();
        const data              = Tiles_Utils_Serialization.create({
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
        const objectType    = Tiles_Constants_Common.ObjectTypeId.Empty;
        const newCfg        = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(baseType, objectType));

        const data          = Tiles_Utils_Serialization.create({
            gridIndex              : this.getGridIndex().toProto().toJson(),
            playerIndex            : Players_Constants.PlayerIndex.Neutral,
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
        return Tiles_Utils_Common.getIncomePerTurn(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getIncomeForPlayer(playerIndex: number): number {
        if ((this.getPlayerIndex() !== playerIndex)                                                                 ||
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoIncome))
        ) {
            return 0;
        }

        const war                       = this.getWar();
        const gameConfig                = war.getGcData();
        const player                    = this.getPlayer();
        const selfTileTypeId                  = this.getTileTypeId();
        const selfGridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
        let modifierForSkill            = 1;
        for (const skillId of player.getCoCurrentSkills()) {
            modifierForSkill *= CoSkills_Utils_Persistent_SelfTileIncome.getTotalMultiplier({
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
        return this._playerIndex;
    }

    public getPlayer(): Players_IPlayer.IPlayer {
        return this.getWar().getPlayer(this.getPlayerIndex());
    }

    public getTeamIndex(): number {
        return this.getWar().getPlayer(this.getPlayerIndex()).getTeamIndex();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for move cost.
    ////////////////////////////////////////////////////////////////////////////////
    private _getMoveCostCfg(): { [moveType: number]: MoveCostCfg } {
        return Helpers_Misc.getExisted(this.getGameConfig().getMoveCostCfg(this.getTileTypeId()));
    }
    public checkCanBlockEnemyUnitType(unitType: number): boolean {
        return Tiles_Utils_Common.checkCanBlockEnemyUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public getBlockEnemyUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getBlockEnemyUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    public getMoveCostByMoveType(moveType: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this._getMoveCostCfg()[moveType]?.getCost();
    }
    public getMoveCostByUnit(unit: Units_IUnit.IUnit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        const unitType      = unit.getUnitType();
        const war           = this.getWar();
        if ((this.getTeamIndex() !== unit.getTeamIndex()) && (this.checkCanBlockEnemyUnitType(unitType))) {
            return null;
        }

        if (Locations_Utils.checkHasAnyOverlap(this.getGroupedLocationIdArray(), unit.getForbiddenGroupedLocationIdArray())) {
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
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of player.getCoCurrentSkills() || []) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitMoveCost();
            if ((cfg)                                                                                   &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId()))          &&
                (gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId()))          &&
                (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId())) &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                    coZoneRadius             : coZoneRadius,
                }))
            ) {
                return Math.min(rawCost, cfg.getFixedCost());
            }
        }

        return rawCost;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for repair/supply unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getRepairNormalizedHp(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return Tiles_Utils_Common.getRepairNormalizedHp(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    public getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number } {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGameConfig();
        const gridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
        let amountModifier              = 0;
        let costMultiplierPct           = 100;
        for (const skillId of player.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfRepairAmountBonus();
            if ((cfg)                                               &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    coZoneRadius             : coZoneRadius,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                }))
            ) {
                amountModifier      += cfg.getRepairOffsetFromTile();
                costMultiplierPct   = costMultiplierPct * (cfg.getCostMultiplierPct()) / 100;
            }
        }

        return { amountModifier, costMultiplierPct };
    }

    public checkCanRepairOrSupplyUnitType(unitType: number): boolean {
        return Tiles_Utils_Common.checkCanRepairOrSupplyUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public getRepairUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getRepairUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    public getRepairHpAndCostForUnit(unit: Units_IUnit.IUnit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.RepairHpAndCost> {
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
        const normalizedCurrentHp   = Units_Utils_Common.getNormalizedHp(currentHp);
        const normalizedRepairHp    = Math.min(
            normalizedMaxHp - normalizedCurrentHp,
            cfgNormalizedRepairHp + modifier.amountModifier,
            productionCost > 0
                ? Math.floor(Math.max(0, unit.getPlayer().getFund()) * normalizedMaxHp / productionCost)
                : Number.MAX_SAFE_INTEGER,
        );
        return {
            hp   : (normalizedRepairHp + normalizedCurrentHp) * Units_Constants.Hp.Normalizer - currentHp,
            cost : Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hide unit.
    ////////////////////////////////////////////////////////////////////////////////
    public checkCanHideUnitType(unitType: number): boolean {
        return Tiles_Utils_Common.checkCanHideUnitType({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
            unitType           : unitType,
        });
    }
    public checkIsUnitHider(): boolean {
        return !!this.getHideUnitTypeArray()?.length;
    }
    public getHideUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getHideUnitTypeArray({
            gameConfig         : this.getGameConfig(),
            templateCfg        : this.getTemplateCfg(),
            customBuildingData : this.getCustomBuildingData(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SelfTileEnabledForUnitProduction> {
        const war       = this.getWar();
        const player    = war.getPlayerManager().getPlayer(playerIndex);
        if ((!player.getCoId()) || (this.getPlayerIndex() !== playerIndex)) {
            return null;
        }

        const gameConfig                = war.getGcData();
        const selfTileTypeId            = this.getTileTypeId();
        const coZoneRadius              = player.getCoZoneRadius();
        const selfGridIndex             = this.getGridIndex();
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of player.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfTileEnabledForUnitProduction();
            if (CoSkills_Utils_Persistent_SelfTileEnabledForUnitProduction.checkIsEffective({
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
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoProduction))
        ) {
            return false;
        }

        const war               = this.getWar();
        const effectiveCoSkill  = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTypeArray     = effectiveCoSkill
            ? war.getGcData().getUnitCategoryCfg(effectiveCoSkill.getUnitCategoryId() ?? Units_Constants.CategoryId.All)?.getUnitTypeIds()
            : this.getRegularProducibleUnitTypeArray();
        return unitTypeArray?.some(v => war.checkCanProduceUnitByOpaAndRule(playerIndex, v)) ?? false;
    }

    /** 把co技能，事件，规则，buff全都考虑了进去 */
    public getProducibleUnitTypeArrayForPlayer(playerIndex: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        if ((this.getPlayerIndex() !== playerIndex)                                                                             ||
            (this.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoProduction))
        ) {
            return null;
        }

        const war               = this.getWar();
        const effectiveCoSkill  = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTypeArray     = effectiveCoSkill
            ? war.getGcData().getUnitCategoryCfg(effectiveCoSkill.getUnitCategoryId() ?? Units_Constants.CategoryId.All)?.getUnitTypeIds()
            : this.getRegularProducibleUnitTypeArray();
        return unitTypeArray?.filter(v => war.checkCanProduceUnitByOpaAndRule(playerIndex, v));
    }

    /** 只考虑地形本身属性，不考虑co技能、事件、规则、buff */
    public getRegularProducibleUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getProducibleUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for vision.
    ////////////////////////////////////////////////////////////////////////////////
    public getCfgVisionRange(): number {
        return Tiles_Utils_Common.getVisionRange(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getIsVisionEnabledForAllPlayers(): boolean {
        return Tiles_Utils_Common.getIsVisionEnabledForAllPlayers(this.getTemplateCfg(), this.getCustomBuildingData());
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
        return Tiles_Utils_Common.getGlobalAttackBonus(this.getTemplateCfg(), this.getCustomBuildingData());
    }
    public getGlobalDefenseBonus(): number {
        return Tiles_Utils_Common.getGlobalDefenseBonus(this.getTemplateCfg(), this.getCustomBuildingData());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for load co.
    ////////////////////////////////////////////////////////////////////////////////
    public getCoBoardUnitTypeArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
        return Tiles_Utils_Common.getCoBoardUnitTypeArray(this.getTemplateCfg(), this.getCustomBuildingData(), this.getGameConfig());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // custom name
    ////////////////////////////////////////////////////////////////////////////////
    public getCustomNameId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this._customNameId;
    }
    public setCustomNameId(nameId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
        if ((nameId != null)                                        &&
            ((!Tiles_Utils_Common.checkIsValidCustomNameId(nameId)))
        ) {
            throw Helpers_Misc.newError(`Invalid nameId: ${nameId}`);
        }

        if (this.getCustomNameId() !== nameId) {
            this._customNameId = nameId;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileCustomNameIdChanged);
        }
    }

    public getCustomName(languageType = Lang_Utils.getCurrentLanguageType()): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
        const nameId = this.getCustomNameId();
        return Lang_Utils.getLanguageText({
            textArray    : this.getWar().getTileMap().getTileCustomNameArray()?.find(v => (v.getNameId()) === nameId)?.getNameTextArray(),
            languageType : languageType,
            useAlternate : false,
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for map weapon.
    ////////////////////////////////////////////////////////////////////////////////
    public getMapWeaponType(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this.getTemplateCfg().getMapWeaponTypeId();
    }
    public checkIsMapWeapon(): boolean {
        return this.getTemplateCfg().getMapWeaponTypeId() != null;
    }
    public checkIsCustomMapWeapon(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType != null) && (Tiles_Constants_MapWeapon.AllCustomizableTypeIdArray.indexOf(mapWeaponType) >= 0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for crystal data.
    ////////////////////////////////////////////////////////////////////////////////
    public getFinalCrystalData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCrystalData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.Crystal) {
            return Tiles_Constants_DefaultCustomTileData.Crystal;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CustomCrystal) {
            return this.getCustomCrystalData() ?? Tiles_Constants_DefaultCustomTileData.Crystal;
        } else {
            return null;
        }
    }
    public getCustomCrystalData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCrystalData> {
        return this._customCrystalData;
    }
    private _setCustomCrystalData(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCrystalData>): void {
        this._customCrystalData = data;
    }

    public checkIsNormalCrystal(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.Crystal);
    }
    private _initCustomCrystalData(): TileCustomCrystalData {
        return this._customCrystalData ??= Tiles_Constants_DefaultCustomTileData.Crystal.clone();
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
    public getFinalCannonData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCannonData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonDown) {
            return Tiles_Constants_DefaultCustomTileData.CannonDown;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonLeft) {
            return Tiles_Constants_DefaultCustomTileData.CannonLeft;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonUp) {
            return Tiles_Constants_DefaultCustomTileData.CannonUp;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonRight) {
            return Tiles_Constants_DefaultCustomTileData.CannonRight;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CustomCannon) {
            return this.getCustomCannonData() ?? Tiles_Constants_DefaultCustomTileData.CustomCannon;
        } else {
            return null;
        }
    }
    public getCustomCannonData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCannonData> {
        return this._customCannonData;
    }
    private _setCustomCannonData(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCannonData>): void {
        this._customCannonData = data;
    }

    public checkIsNormalCannon(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonRight)
            || (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonUp)
            || (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonLeft)
            || (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CannonDown);
    }
    private _initCustomCannonData(): TileCustomCannonData {
        return this._customCannonData ??= Tiles_Constants_DefaultCustomTileData.CustomCannon.clone();
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
    public getFinalLaserTurretData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomLaserTurretData> {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.LaserTurret) {
            return Tiles_Constants_DefaultCustomTileData.CustomLaserTurret;
        } else if (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) {
            return this.getCustomLaserTurretData() ?? Tiles_Constants_DefaultCustomTileData.CustomLaserTurret;
        } else {
            return null;
        }
    }
    public getCustomLaserTurretData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomLaserTurretData> {
        return this._customLaserTurretData;
    }
    private _setCustomLaserTurretData(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomLaserTurretData>): void {
        this._customLaserTurretData = data;
    }

    public checkIsNormalLaserTurret(): boolean {
        const mapWeaponType = this.getTemplateCfg().getMapWeaponTypeId();
        return (mapWeaponType === Tiles_Constants_MapWeapon.TypeId.LaserTurret);
    }
    private _initCustomLaserTurretData(): TileCustomLaserTurretData {
        return this._customLaserTurretData ??= Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.clone();
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
    public setCustomBuildingData(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomBuildingData>): void {
        this._customBuildingData = data;
    }
    public getCustomBuildingData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomBuildingData> {
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

        const data = Tiles_Utils_Serialization.create({
            gridIndex              : this.getGridIndex().toProto().toJson(),
            baseType               : this.getBaseType(),
            decorationType         : this.getDecorationType(),
            objectType             : this.getObjectType(),
            playerIndex            : this.getTemplateCfg().getIsAlwaysShowOwner() ? this.getPlayerIndex() : Players_Constants.PlayerIndex.Neutral,
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
            ?? Helpers_Misc.getExisted(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getTileTheme());
    }
}

function getNewObjectShapeIdOnObjectDestroyed(oldType: number, oldShapeId: number): number {
    const shapeIdArray = Helpers_Misc.getExisted(TileObjects_Utils.getTileObjectCfg(oldType)?.shapeIdsAfterDestruction);
    for (let i = 1; i < shapeIdArray.length; i += 2) {
        if (shapeIdArray[i] === oldShapeId) {
            return shapeIdArray[i + 1];
        }
    }
    return shapeIdArray[0];
}
