import {
    AuxiliaryTypes_AttackableArea,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    Destructions_Utils,
    Helpers_Misc,
    Helpers_Team,
    Numbers_Utils,
    Tiles_Constants_MapWeapon,
    Timer_TimerModel,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    type BaseWar_Model_War,
    type Tiles_Tile,
    type Turns_Manager,
    type Units_Unit,
} from "../../../internal.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<void> {
    const war               = turnManager.getWar();
    const playerIndex       = war.getPlayerIndexInTurn();
    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const allTileArray      = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            await handleMapWeaponTileCrystalForOuterWar(war, tile, isFastExecute);
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCrystalData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCrystalArray) {
            await handleMapWeaponTileCrystalForOuterWar(war, tile, isFastExecute);
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            await handleMapWeaponTileCannonForOuterWar(war, tile, isFastExecute);
        }
    }
    {
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCannonData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCannonArray) {
            await handleMapWeaponTileCannonForOuterWar(war, tile, isFastExecute);
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            await handleMapWeaponTileLaserTurretForOuterWar(war, tile, isFastExecute);
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalLaserTurretData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customLaserTurretArray) {
            await handleMapWeaponTileLaserTurretForOuterWar(war, tile, isFastExecute);
        }
    }
}

async function handleMapWeaponTileCrystalForOuterWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        await Timer_TimerModel.wait(400);
    }
}

async function handleMapWeaponTileCannonForOuterWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }
}

async function handleMapWeaponTileLaserTurretForOuterWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        await Timer_TimerModel.wait(400);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function runAsInnerWar(turnManager: Turns_Manager.Manager): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    return runAsLocalWar(turnManager, true);
}

export function runAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    return runAsLocalWar(turnManager, isFastExecute);
}

async function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const war           = turnManager.getWar();
    const playerIndex   = war.getPlayerIndexInTurn();
    const tileMap       = war.getTileMap();
    const mapSize       = tileMap.getMapSize();
    const allTileArray  = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCrystalForLocalWar(war, tile, isFastExecute));
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCrystalData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCrystalArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCrystalForLocalWar(war, tile, isFastExecute));
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCannonForLocalWar(war, tile, isFastExecute));
        }
    }
    {
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCannonData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCannonArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCannonForLocalWar(war, tile, isFastExecute));
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            changedThings.mergeFrom(await handleMapWeaponTileLaserTurretForLocalWar(war, tile, isFastExecute));
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalLaserTurretData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customLaserTurretArray) {
            changedThings.mergeFrom(await handleMapWeaponTileLaserTurretForLocalWar(war, tile, isFastExecute));
        }
    }

    return changedThings;
}

async function handleMapWeaponTileCrystalForLocalWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const unitMap           = war.getUnitMap();
    const playerIndexInTurn = tile.getPlayerIndex();
    const teamIndexInTurn   = tile.getTeamIndex();
    const data              = Helpers_Misc.getExisted(tile.getFinalCrystalData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileCrystal_00);
    const affectedUnits     = new Set<Units_Unit.Unit>();
    const canAffectAlly     = data.getCanAffectAlly();
    const canAffectEnemy    = data.getCanAffectEnemy();
    const canAffectSelf     = data.getCanAffectSelf();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    {
        const deltaFund             = data.getOffsetFund();
        const deltaEnergyPercentage = data.getOffsetEnergyPercentage();
        if (deltaFund || deltaEnergyPercentage) {
            for (const player of war.getPlayerManager().getAllPlayers()) {
                const teamIndex = player.getTeamIndex();
                if (((canAffectSelf) && (player.getPlayerIndex() === playerIndexInTurn))    ||
                    ((canAffectAlly) && (teamIndex === teamIndexInTurn))                    ||
                    ((canAffectEnemy) && (teamIndex !== teamIndexInTurn))
                ) {
                    if (deltaFund) {
                        player.setFund(Math.max(0, player.getFund() + deltaFund));
                        changedThings.addPlayer(player);
                    }

                    if (deltaEnergyPercentage) {
                        if (deltaEnergyPercentage < 0) {
                            player.addAndValidateCoCurrentEnergy(player.getCoCurrentEnergy() * deltaEnergyPercentage / 100);
                        } else {
                            player.addAndValidateCoCurrentEnergy(player.getCoMaxEnergy() * deltaEnergyPercentage / 100);
                        }
                        changedThings.addPlayer(player);
                    }
                }
            }
        }
    }
    {
        const deltaHp                       = data.getOffsetHp();
        const deltaFuelPercentage           = data.getOffsetFuelPercentage();
        const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const canBeFatal            = data.getCanBeFatal();
            for (const gridIndex of tile.getGridIndex().getGridsWithinDistance({ minDistance : 0, maxDistance : data.getRadius(), mapSize : unitMap.getMapSize() })) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if (unit == null) {
                    continue;
                }

                const unitTeamIndex = unit.getTeamIndex();
                if (((canAffectSelf) && (unit.getPlayerIndex() === playerIndexInTurn))    ||
                    ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))              ||
                    ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
                ) {
                    if (deltaFuelPercentage) {
                        if (deltaFuelPercentage < 0) {
                            unit.setCurrentFuel(Math.max(
                                0,
                                Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                            ));
                        } else {
                            const maxFuel = unit.getMaxFuel();
                            unit.setCurrentFuel(Math.min(
                                maxFuel,
                                Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                            ));
                        }
                        changedThings.addUnit(unit);
                    }

                    if (deltaPrimaryAmmoPercentage) {
                        const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                        if (maxAmmo != null) {
                            const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                            if (deltaPrimaryAmmoPercentage < 0) {
                                unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                            } else {
                                unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                            }
                            changedThings.addUnit(unit);
                        }
                    }

                    if (deltaHp) {
                        const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                        const warStatisticsUpdater  = () => {
                            const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                            if (offsetNormalizedHp != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
                                if (observerTeamIndexes != null) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : unit.getUnitTypeId(),
                                        dstPlayerIndex             : unit.getPlayerIndex(),
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                        normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        };

                        if (deltaHp > 0) {
                            unit.setCurrentHp(Math.min(
                                unit.getMaxHp(),
                                (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                            );
                            warStatisticsUpdater();

                        } else {
                            const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                            if ((rawNewHp <= 0) && (canBeFatal)) {
                                changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
                            } else {
                                unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                    rawValue : rawNewHp,
                                    minValue : 1,
                                    maxValue : unit.getMaxHp(),
                                }));
                                warStatisticsUpdater();
                            }
                        }

                        changedThings.addUnit(unit);
                    }

                    affectedUnits.add(unit);
                }
            }
        }
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.flushDataToView();
        }
        await Timer_TimerModel.wait(400);
    }

    return changedThings;
}

async function handleMapWeaponTileCannonForLocalWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const warStatisticsManager          = war.getWarStatisticsManager();
    const data                          = Helpers_Misc.getExisted(tile.getFinalCannonData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileCannon_00);
    const getCandidateUnitArray         = Helpers_Misc.createLazyFunc(() => generateCandidateUnitArrayForCannonForLocalWar(war, tile));
    const maxTargetCount                = data.getMaxTargetCount();
    const deltaHp                       = data.getOffsetHp();
    const deltaFuelPercentage           = data.getOffsetFuelPercentage();
    const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
    const canBeFatal                    = data.getCanBeFatal();
    const affectedUnits                 = new Set<Units_Unit.Unit>();
    const changedThings                 = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    for (let i = 0; i < maxTargetCount; ++i) {
        const unit = getCandidateUnitArray()[i];
        if (unit == null) {
            break;
        }

        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            if (deltaFuelPercentage) {
                if (deltaFuelPercentage < 0) {
                    unit.setCurrentFuel(Math.max(
                        0,
                        Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                    ));
                } else {
                    const maxFuel = unit.getMaxFuel();
                    unit.setCurrentFuel(Math.min(
                        maxFuel,
                        Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                    ));
                }
                changedThings.addUnit(unit);
            }

            if (deltaPrimaryAmmoPercentage) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo != null) {
                    const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                    if (deltaPrimaryAmmoPercentage < 0) {
                        unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                    } else {
                        unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                    }
                    changedThings.addUnit(unit);
                }
            }

            if (deltaHp) {
                const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                const warStatisticsUpdater  = () => {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : unit.getUnitTypeId(),
                                dstPlayerIndex             : unit.getPlayerIndex(),
                                unitGain                   : 0,
                                unitLoss                   : 0,
                                normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                };

                if (deltaHp > 0) {
                    unit.setCurrentHp(Math.min(
                        unit.getMaxHp(),
                        (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                    );
                    warStatisticsUpdater();

                } else {
                    const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                    if ((rawNewHp <= 0) && (canBeFatal)) {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute));
                    } else {
                        unit.setCurrentHp(Numbers_Utils.getValueInRange({
                            rawValue : rawNewHp,
                            minValue : 1,
                            maxValue : unit.getMaxHp(),
                        }));
                        warStatisticsUpdater();
                    }
                }

                changedThings.addUnit(unit);
            }

            affectedUnits.add(unit);
        }
    }

    if (!isFastExecute) {
        if (affectedUnits.size) {
            for (const unit of affectedUnits) {
                gridVisualEffect?.showEffectDamage(unit.getGridIndex());
            }
            await Timer_TimerModel.wait(200);

            for (const unit of affectedUnits) {
                unit.flushDataToView();
            }
            await Timer_TimerModel.wait(400);
        }
    }

    return changedThings;
}

async function handleMapWeaponTileLaserTurretForLocalWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const data                  = Helpers_Misc.getExisted(tile.getFinalLaserTurretData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileLaserTurret_00);
    const candidateUnitArray    = generateCandidateUnitArrayForLaserTurretForLocalWar(war, tile);
    const affectedUnits         = new Set<Units_Unit.Unit>();
    const changedThings         = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    {
        const deltaHp                       = data.getOffsetHp();
        const deltaFuelPercentage           = data.getOffsetFuelPercentage();
        const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const canBeFatal            = data.getCanBeFatal();
            for (const unit of candidateUnitArray) {
                if (deltaFuelPercentage) {
                    if (deltaFuelPercentage < 0) {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                        ));
                    } else {
                        const maxFuel = unit.getMaxFuel();
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                        ));
                    }
                    changedThings.addUnit(unit);
                }

                if (deltaPrimaryAmmoPercentage) {
                    const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                    if (maxAmmo != null) {
                        const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                        if (deltaPrimaryAmmoPercentage < 0) {
                            unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                        } else {
                            unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                        }
                        changedThings.addUnit(unit);
                    }
                }

                if (deltaHp) {
                    const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                    const warStatisticsUpdater  = () => {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                   : unit.getUnitTypeId(),
                                    dstPlayerIndex             : unit.getPlayerIndex(),
                                    unitGain                   : 0,
                                    unitLoss                   : 0,
                                    normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    };

                    if (deltaHp > 0) {
                        unit.setCurrentHp(Math.min(
                            unit.getMaxHp(),
                            (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                        );
                        warStatisticsUpdater();

                    } else {
                        const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                        if ((rawNewHp <= 0) && (canBeFatal)) {
                            changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute));
                        } else {
                            unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                rawValue : rawNewHp,
                                minValue : 1,
                                maxValue : unit.getMaxHp(),
                            }));
                            warStatisticsUpdater();
                        }
                    }

                    changedThings.addUnit(unit);
                }

                affectedUnits.add(unit);
            }
        }
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.flushDataToView();
        }
        await Timer_TimerModel.wait(400);
    }

    return changedThings;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function generateCandidateUnitArrayForCannonForLocalWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile): Units_Unit.Unit[] {
    const data              = Helpers_Misc.getExisted(tile.getFinalCannonData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_GenerateCandidateUnitArrayForCannon_00);
    const playerIndexInTurn = tile.getPlayerIndex();
    const teamIndexInTurn   = tile.getTeamIndex();
    const tileX             = tile.getGridX();
    const tileY             = tile.getGridY();
    const canAffectAlly     = data.getCanAffectAlly();
    const canAffectEnemy    = data.getCanAffectEnemy();
    const canAffectSelf     = data.getCanAffectSelf();
    const rangeForDown      = data.getRangeForDown();
    const rangeForUp        = data.getRangeForUp();
    const rangeForLeft      = data.getRangeForLeft();
    const rangeForRight     = data.getRangeForRight();

    const unitAndFinalCostArray: { unit: Units_Unit.Unit, cost: number }[] = [];
    for (const unit of [...Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndexInTurn]))].filter(u => {
        const unitTeamIndex = u.getTeamIndex();
        if (((canAffectSelf) && (u.getPlayerIndex() === playerIndexInTurn))     ||
            ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))            ||
            ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
        ) {
            const deltaX = u.getGridX() - tileX;
            const deltaY = u.getGridY() - tileY;
            return ((rangeForDown) && (Math.abs(deltaX) < Math.abs(deltaY)) && (deltaY > 0) && (deltaY <= rangeForDown))
                || ((rangeForUp) && (Math.abs(deltaX) < Math.abs(deltaY)) && (deltaY < 0) && (Math.abs(deltaY) <= rangeForUp))
                || ((rangeForLeft) && (Math.abs(deltaY) < Math.abs(deltaX)) && (deltaX < 0) && (Math.abs(deltaX) <= rangeForLeft))
                || ((rangeForRight) && (Math.abs(deltaY) < Math.abs(deltaX)) && (deltaX > 0) && (deltaX <= rangeForRight));
        } else {
            return false;
        }
    })) {
        unitAndFinalCostArray.push({
            unit : unit,
            cost : Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp()),
        });
    }
    unitAndFinalCostArray.sort((info1, info2) => {
        const cost1 = info1.cost;
        const cost2 = info2.cost;
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return info1.unit.getUnitId() - info2.unit.getUnitId();
        }
    });

    const candidateUnitArray: Units_Unit.Unit[] = [];
    for (const info of unitAndFinalCostArray) {
        candidateUnitArray.push(info.unit);
    }

    return candidateUnitArray;
}

function generateCandidateUnitArrayForLaserTurretForLocalWar(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile): Units_Unit.Unit[] {
    const data                  = Helpers_Misc.getExisted(tile.getFinalLaserTurretData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_GenerateCandidateUnitArrayForLaserTurret_00);
    const playerIndexInTurn     = tile.getPlayerIndex();
    const teamIndexInTurn       = tile.getTeamIndex();
    const tileGridX             = tile.getGridX();
    const tileGridY             = tile.getGridY();
    const unitMap               = war.getUnitMap();
    const mapSize               = unitMap.getMapSize();
    const rangeForUp            = data.getRangeForUp();
    const rangeForDown          = data.getRangeForDown();
    const rangeForLeft          = data.getRangeForLeft();
    const rangeForRight         = data.getRangeForRight();
    const canAffectAlly         = data.getCanAffectAlly();
    const canAffectEnemy        = data.getCanAffectEnemy();
    const canAffectSelf         = data.getCanAffectSelf();
    const candidateUnitArray    : Units_Unit.Unit[] = [];
    const checkAndAddUnit       = (gridIndex: AuxiliaryTypes_GridIndex.GridIndex) => {
        const unit = unitMap.getUnitOnMap(gridIndex);
        if (unit == null) {
            return;
        }

        const unitTeamIndex = unit.getTeamIndex();
        if (((canAffectSelf) && (unit.getPlayerIndex() === playerIndexInTurn))    ||
            ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))              ||
            ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
        ) {
            candidateUnitArray.push(unit);
        }
    };

    for (let deltaX = 0; deltaX < rangeForRight; ++deltaX) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX + deltaX + 1, tileGridY);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaX = 0; deltaX < rangeForLeft; ++deltaX) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX - deltaX - 1, tileGridY);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaY = 0; deltaY < rangeForDown; ++deltaY) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX, tileGridY + deltaY + 1);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaY = 0; deltaY < rangeForUp; ++deltaY) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX, tileGridY - deltaY - 1);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }

    return candidateUnitArray;
}
