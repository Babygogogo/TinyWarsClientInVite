import type { BattleInfo } from "../auxiliaryTypes/BattleInfo.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { EnergyTypeId } from "../cos/Constants.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { getExisted } from "../helpers/Misc.ts";
import { encodeTeamIndex } from "../helpers/Team.ts";
import {
    PlayerIndex,
    AliveStateId,
} from "../players/Constants.ts";
import { WsUnitStatistics } from "../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import { ShortSfxCode } from "../sounds/Constants.ts";
import { playShortSfx } from "../sounds/SoundPlayer.ts";
import type { IUnit } from "../units/IUnit.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../visibilities/Utils.ts";

export function destroyUnitOnMap(war: IBwWar, gridIndex: GridIndex, showExplosionEffect: boolean): IUnit[] {
    const unitMap               = war.getUnitMap();
    const unit                  = getExisted(unitMap.getUnitOnMap(gridIndex), ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_00);
    const destroyedUnits        = [unit];
    const observerTeamIndexes   = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
    unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
    war.getTileMap().getTile(gridIndex).updateOnUnitLeave();
    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).stopRunning();
        destroyedUnits.push(u);
    }

    {
        if (observerTeamIndexes != null) {
            const warStatisticsManager          = war.getWarStatisticsManager();
            const playerIndex                   = unit.getPlayerIndex();
            const groupedObserverTeamIndexes    = encodeTeamIndex(observerTeamIndexes);
            for (const u of destroyedUnits) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : u.getUnitType(),
                    normalizedHpGain            : 0,
                    normalizedHpLoss            : u.getNormalizedCurrentHp(),
                    unitGain                    : 0,
                    unitLoss                    : 1,
                    dstPlayerIndex              : playerIndex,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes
                }));
            }
        }
    }

    updatePlayersOnUnitDestroyed(destroyedUnits);

    if (showExplosionEffect) {
        const gridVisionEffect = war.getGridVisualEffect();
        (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

        const warView = war.getView();
        (warView) && (warView.showVibration());
        playShortSfx(ShortSfxCode.Explode);
    }

    return destroyedUnits;
}
export function destroyUnitOnMapForWarDamageCalculator({ battleInfo, war, gridIndex, isEstimated }: {
    battleInfo          : BattleInfo;
    war                 : IBwWar;
    gridIndex           : GridIndex;
    isEstimated         : boolean;
}): void {
    const unitMap             = war.getUnitMap();
    const unit                = getExisted(unitMap.getUnitOnMap(gridIndex));
    const tile                = war.getTileMap().getTile(gridIndex);
    const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
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
                unitType                    : u.getUnitType(),
                normalizedHpGain            : 0,
                normalizedHpLoss            : u.getNormalizedCurrentHp(),
                unitGain                    : 0,
                unitLoss                    : 1,
                dstPlayerIndex              : playerIndex,
                groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }

    updatePlayersOnUnitDestroyedForWarDamageCalculator(battleInfo, isEstimated, destroyedUnits, war);
    for (const u of destroyedUnits) {
        battleInfo.destroyedUnits.set(u.getUnitId(), u);
    }
}
export function destroyUnitLoaded(war: IBwWar, unitId: number): IUnit[] {
    const unitMap           = war.getUnitMap();
    const targetUnit        = getExisted(unitMap.getUnitLoadedById(unitId));
    const destroyedUnits    = [targetUnit];
    unitMap.removeUnitLoaded(unitId).stopRunning();
    for (const u of unitMap.getUnitsLoadedByLoader(targetUnit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).stopRunning();
        destroyedUnits.push(u);
    }

    {
        const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetUnit.getGridIndex() });
        if (observerTeamIndexes != null) {
            const warStatisticsManager          = war.getWarStatisticsManager();
            const playerIndex                   = targetUnit.getPlayerIndex();
            const groupedObserverTeamIndexes    = encodeTeamIndex(observerTeamIndexes);
            for (const u of destroyedUnits) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : u.getUnitType(),
                    normalizedHpGain            : 0,
                    normalizedHpLoss            : u.getNormalizedCurrentHp(),
                    unitGain                    : 0,
                    unitLoss                    : 1,
                    dstPlayerIndex              : playerIndex,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes
                }));
            }
        }
    }

    updatePlayersOnUnitDestroyed(destroyedUnits);

    return destroyedUnits;
}
/** @param destroyedUnits 必须属于同一个玩家 */
function updatePlayersOnUnitDestroyed(destroyedUnits: IUnit[]): void {
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
            / 100
        );
        if ((restCoUnitsCount <= 0) && (player.getCoEnergyType() === EnergyTypeId.Dor)) {
            player.setCoUsingSkillType(SkillTypeId.Passive);
        }
    }
}
/** @param destroyedUnits 必须属于同一个玩家 */
function updatePlayersOnUnitDestroyedForWarDamageCalculator(battleInfo: BattleInfo, isEstimated: boolean, destroyedUnits: IUnit[], war: IBwWar): void {
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
            / 100
        );
        if ((restCoUnitsCount <= 0) && (player.getCoEnergyType() === EnergyTypeId.Dor)) {
            player.setCoUsingSkillType(SkillTypeId.Passive);
        }
    }
}

export function destroyPlayerForce(war: IBwWar, playerIndex: number, showExplosionEffect: boolean): void {
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
        const observerTeamIndexes           = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
        const groupedObserverTeamIndexes    = observerTeamIndexes != null ? encodeTeamIndex(observerTeamIndexes) : null;
        unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
        tileMap.getTile(gridIndex).updateOnUnitLeave();
        (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

        if (groupedObserverTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                    : unit.getUnitType(),
                normalizedHpGain            : 0,
                normalizedHpLoss            : unit.getNormalizedCurrentHp(),
                unitGain                    : 0,
                unitLoss                    : 1,
                dstPlayerIndex              : playerIndex,
                groupedObserverTeamIndexes  : groupedObserverTeamIndexes
            }));
        }

        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(loadedUnit.getUnitId()).stopRunning();

            if (groupedObserverTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : loadedUnit.getUnitType(),
                    normalizedHpGain            : 0,
                    normalizedHpLoss            : loadedUnit.getNormalizedCurrentHp(),
                    unitGain                    : 0,
                    unitLoss                    : 1,
                    dstPlayerIndex              : playerIndex,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes
                }));
            }
        }
    }
    if ((showExplosionEffect) && (hasRemovedUnit)) {
        const warView = war.getView();
        (warView) && (warView.showVibration());
        playShortSfx(ShortSfxCode.Explode);
    }

    for (const tile of tileMap.getAllTiles()) {
        if (tile.getPlayerIndex() === playerIndex) {
            const hp                = tile.getCurrentHp();
            const buildPoint        = tile.getCurrentBuildPoint();
            const capturePoint      = tile.getCurrentCapturePoint();
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseType(),
                objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectType(),
                playerIndex : PlayerIndex.Neutral,
            });
            tile.setCurrentHp(hp);
            tile.setCurrentBuildPoint(buildPoint);
            tile.setCurrentCapturePoint(capturePoint);
        }
    }

    war.getFogMap().resetAllMapsForPlayer(playerIndex);

    const player = war.getPlayer(playerIndex);
    player.setAliveState(AliveStateId.Dead);
    player.setCoIsDestroyedInTurn(true);
    player.setAndValidateCoCurrentEnergy(0);
    player.setCoUsingSkillType(SkillTypeId.Passive);

    war.getDrawVoteManager().handlePlayerForceDestruction();
}

export function removeUnitOnMap(war: IBwWar, gridIndex: GridIndex): void {
    war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

    const unitMap   = war.getUnitMap();
    const unit      = getExisted(unitMap.getUnitOnMap(gridIndex));

    unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
        unitMap.removeUnitLoaded(u.getUnitId()).stopRunning();
    }
}
