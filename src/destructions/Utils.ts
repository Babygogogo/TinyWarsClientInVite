import {
    Cos_Constants,
    CoSkills_Constants,
    Helpers_Misc,
    Helpers_Team,
    Players_Constants,
    Sounds_Constants,
    Sounds_SoundPlayer,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    type AuxiliaryTypes_BattleInfo,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Model_War,
    type Units_Unit,
} from "../internal.ts";
import { WsUnitStatistics } from "../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function destroyUnitOnMap(war: BaseWar_Model_War.War, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, showExplosionEffect: boolean): Units_Unit.Unit[] {
    const unitMap               = war.getUnitMap();
    const unit                  = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex), Utils_ClientErrorCode.ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_00);
    const destroyedUnits        = [unit];
    const observerTeamIndexes   = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
    unitMap.removeUnitOnMap(gridIndex, true)?.dispose();
    war.getTileMap().getTile(gridIndex).updateOnUnitLeave();
    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).dispose();
        destroyedUnits.push(u);
    }

    {
        if (observerTeamIndexes != null) {
            const warStatisticsManager          = war.getWarStatisticsManager();
            const playerIndex                   = unit.getPlayerIndex();
            const groupedObserverTeamIndexes    = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
            for (const u of destroyedUnits) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : u.getUnitType(),
                    normalizedHpGain           : 0,
                    normalizedHpLoss           : u.getNormalizedCurrentHp(),
                    unitGain                   : 0,
                    unitLoss                   : 1,
                    dstPlayerIndex             : playerIndex,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));
            }
        }
    }

    updatePlayersOnUnitDestroyed(destroyedUnits);

    if (showExplosionEffect) {
        war.getGridVisualEffect().showEffectExplosion(gridIndex);
        war.getView()?.showVibration();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
    }

    return destroyedUnits;
}
export function destroyUnitOnMapForWarDamageCalculator({ battleInfo, war, gridIndex, isEstimated }: {
    battleInfo          : AuxiliaryTypes_BattleInfo.BattleInfo;
    war                 : BaseWar_Model_War.War;
    gridIndex           : AuxiliaryTypes_GridIndex.GridIndex;
    isEstimated         : boolean;
}): void {
    const unitMap             = war.getUnitMap();
    const unit                = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex));
    const tile                = war.getTileMap().getTile(gridIndex);
    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
    const destroyedUnits      = [unit];
    const unitId              = unit.getUnitId();
    if (!isEstimated) {
        // battleInfo.affectedThings.add(unit);
    } else {
        if (!battleInfo.oldUnits.has(unitId)) {
            battleInfo.oldUnits.set(unitId, unit.serialize());
        }
    }
    unitMap.removeUnitOnMap(gridIndex, false);

    const gridId = gridIndex.getGridId(unitMap.getMapSize());
    if (!isEstimated) {
        // battleInfo.affectedThings.add(tile);
    } else {
        if (!battleInfo.oldTiles.has(gridId)) {
            battleInfo.oldTiles.set(gridId, tile.serialize());
        }
    }
    tile.updateOnUnitLeave();

    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
        const loadedUnitId = u.getUnitId();
        if (!isEstimated) {
            // battleInfo.affectedThings.add(u);
        } else {
            if (!battleInfo.oldUnits.has(loadedUnitId)) {
                battleInfo.oldUnits.set(loadedUnitId, u.serialize());
            }
        }

        unitMap.removeUnitLoaded(loadedUnitId);
        destroyedUnits.push(u);
    }

    if ((!isEstimated) && (observerTeamIndexes != null)) {
        const warStatisticsManager    = war.getWarStatisticsManager();
        const playerIndex             = unit.getPlayerIndex();
        for (const u of destroyedUnits) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                   : u.getUnitType(),
                normalizedHpGain           : 0,
                normalizedHpLoss           : u.getNormalizedCurrentHp(),
                unitGain                   : 0,
                unitLoss                   : 1,
                dstPlayerIndex             : playerIndex,
                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }

    updatePlayersOnUnitDestroyedForWarDamageCalculator(battleInfo, isEstimated, destroyedUnits, war);
    for (const u of destroyedUnits) {
        battleInfo.destroyedUnits.set(u.getUnitId(), u);
    }
}
export function destroyUnitLoaded(war: BaseWar_Model_War.War, unitId: number): Units_Unit.Unit[] {
    const unitMap           = war.getUnitMap();
    const targetUnit        = Helpers_Misc.getExisted(unitMap.getUnitLoadedById(unitId));
    const destroyedUnits    = [targetUnit];
    unitMap.removeUnitLoaded(unitId).dispose();
    for (const u of unitMap.getUnitsLoadedByLoader(targetUnit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).dispose();
        destroyedUnits.push(u);
    }

    {
        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : targetUnit.getGridIndex() });
        if (observerTeamIndexes != null) {
            const warStatisticsManager          = war.getWarStatisticsManager();
            const playerIndex                   = targetUnit.getPlayerIndex();
            const groupedObserverTeamIndexes    = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
            for (const u of destroyedUnits) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : u.getUnitType(),
                    normalizedHpGain           : 0,
                    normalizedHpLoss           : u.getNormalizedCurrentHp(),
                    unitGain                   : 0,
                    unitLoss                   : 1,
                    dstPlayerIndex             : playerIndex,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));
            }
        }
    }

    updatePlayersOnUnitDestroyed(destroyedUnits);

    return destroyedUnits;
}
/** @param destroyedUnits 必须属于同一个玩家 */
function updatePlayersOnUnitDestroyed(destroyedUnits: Units_Unit.Unit[]): void {
    const destroyedCoUnitsCount = destroyedUnits.filter(u => u.getIsCoOnboard()).length;
    if (destroyedCoUnitsCount > 0) {
        const player            = destroyedUnits[0].getPlayer();
        const playerIndex       = player.getPlayerIndex();
        const restCoUnitsCount  = player.getWar().getUnitMap().getAllCoUnits(playerIndex).length;
        const energy            = player.getCoCurrentEnergy();
        player.setCoIsDestroyedInTurn(true);
        player.addAndValidateCoCurrentEnergy(
            -energy
            * destroyedCoUnitsCount
            / (restCoUnitsCount + destroyedCoUnitsCount)
            * destroyedUnits[0].getWar().getCommonSettingManager().getPlayerRule(playerIndex).getEnergyLossPctOnCoDie()
            / 100,
        );
        if ((restCoUnitsCount <= 0) && (player.getCoEnergyType() === Cos_Constants.EnergyTypeId.Dor)) {
            player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);
        }
    }
}
/** @param destroyedUnits 必须属于同一个玩家 */
function updatePlayersOnUnitDestroyedForWarDamageCalculator(battleInfo: AuxiliaryTypes_BattleInfo.BattleInfo, isEstimated: boolean, destroyedUnits: Units_Unit.Unit[], war: BaseWar_Model_War.War): void {
    const destroyedCoUnitsCount = destroyedUnits.filter(u => u.getIsCoOnboard()).length;
    if (destroyedCoUnitsCount > 0) {
        const player      = destroyedUnits[0].getPlayer();
        const playerIndex = player.getPlayerIndex();
        if (!isEstimated) {
            // battleInfo.affectedThings.add(player);
        } else {
            if (!battleInfo.oldPlayers.has(playerIndex)) {
                battleInfo.oldPlayers.set(playerIndex, player.serialize());
            }
        }

        const restCoUnitsCount    = player.getWar().getUnitMap().getAllCoUnits(playerIndex).length;
        const energy              = player.getCoCurrentEnergy();
        player.setCoIsDestroyedInTurn(true);
        player.addAndValidateCoCurrentEnergy(
            -energy
            * destroyedCoUnitsCount
            / (restCoUnitsCount + destroyedCoUnitsCount)
            * war.getCommonSettingManager().getPlayerRule(playerIndex).getEnergyLossPctOnCoDie()
            / 100,
        );
        if ((restCoUnitsCount <= 0) && (player.getCoEnergyType() === Cos_Constants.EnergyTypeId.Dor)) {
            player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);
        }
    }
}

export function destroyPlayerForce(war: BaseWar_Model_War.War, playerIndex: number, showExplosionEffect: boolean): void {
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const gridVisionEffect      = showExplosionEffect ? war.getGridVisualEffect() : null;
    let hasRemovedUnit          = false;
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if (unit.getPlayerIndex() !== playerIndex) {
            continue;
        }

        hasRemovedUnit = true;

        const gridIndex                     = unit.getGridIndex();
        const observerTeamIndexes           = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
        const groupedObserverTeamIndexes    = observerTeamIndexes != null ? Helpers_Team.encodeTeamIndex(observerTeamIndexes) : null;
        unitMap.removeUnitOnMap(gridIndex, true)?.dispose();
        tileMap.getTile(gridIndex).updateOnUnitLeave();
        gridVisionEffect?.showEffectExplosion(gridIndex);

        if (groupedObserverTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                   : unit.getUnitType(),
                normalizedHpGain           : 0,
                normalizedHpLoss           : unit.getNormalizedCurrentHp(),
                unitGain                   : 0,
                unitLoss                   : 1,
                dstPlayerIndex             : playerIndex,
                groupedObserverTeamIndexes : groupedObserverTeamIndexes,
            }));
        }

        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(loadedUnit.getUnitId()).dispose();

            if (groupedObserverTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : loadedUnit.getUnitType(),
                    normalizedHpGain           : 0,
                    normalizedHpLoss           : loadedUnit.getNormalizedCurrentHp(),
                    unitGain                   : 0,
                    unitLoss                   : 1,
                    dstPlayerIndex             : playerIndex,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));
            }
        }
    }
    if ((showExplosionEffect) && (hasRemovedUnit)) {
        war.getView()?.showVibration();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
    }

    for (const tile of tileMap.getAllTiles()) {
        if (tile.getPlayerIndex() === playerIndex) {
            const hp                = tile.getCurrentHp();
            const buildPoint        = tile.getCurrentBuildPoint();
            const capturePoint      = tile.getCurrentCapturePoint();
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseTypeId(),
                objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectTypeId(),
                playerIndex : Players_Constants.PlayerIndex.Neutral,
            });
            tile.setCurrentHp(hp);
            tile.setCurrentBuildPoint(buildPoint);
            tile.setCurrentCapturePoint(capturePoint);
        }
    }

    war.getFogMap().resetAllMapsForPlayer(playerIndex);

    const player = war.getPlayer(playerIndex);
    player.setAliveState(Players_Constants.AliveStateId.Dead);
    player.setCoIsDestroyedInTurn(true);
    player.setAndValidateCoCurrentEnergy(0);
    player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);

    war.getDrawVoteManager().handlePlayerForceDestruction();
}

export function removeUnitOnMap(war: BaseWar_Model_War.War, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
    war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

    const unitMap   = war.getUnitMap();
    const unit      = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex));
    unitMap.removeUnitOnMap(gridIndex, true)?.dispose();

    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).dispose();
    }
}
