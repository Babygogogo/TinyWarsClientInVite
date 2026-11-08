import {
    Timer_TimerModel,
    Bots_Utils,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_Unit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitRepairUnit(commonParams: Bots_CommonParams.CommonParams, focusUnit: Units_Unit.Unit, destination: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    if (!focusUnit.getTemplateCfg().getCanRepairAdjacentTargetUnit()) {
        return null;
    }

    const war         = commonParams.getWar();
    const unitMap     = war.getUnitMap();
    const playerIndex = focusUnit.getPlayerIndex();
    const candidates  : Bots_Types.ScoreAndAction[] = [];
    for (const targetGridIndex of destination.getAdjacentGrids(commonParams.getMapSize())) {
        const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
        if ((targetUnit == null)                                                                        ||
            (targetUnit == focusUnit)                                                                   ||
            (targetUnit.getPlayerIndex() != playerIndex)                                                ||
            ((targetUnit.getCurrentHp() == targetUnit.getMaxHp()) && (!targetUnit.checkCanBeSupplied()))
        ) {
            continue;
        }

        const passiveScaler = targetUnit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.getUnitValueRatio());
        let totalScore      = (targetUnit.getMaxHp() - targetUnit.getCurrentHp()) * 1 * passiveScaler;
        {
            const maxAmmo = targetUnit.getPrimaryWeaponMaxAmmo();
            if ((maxAmmo) && (targetUnit.checkIsPrimaryWeaponAmmoInShort())) {
                const currentAmmo = targetUnit.getPrimaryWeaponCurrentAmmo();
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
        {
            if (targetUnit.checkIsFuelInShort()) {
                const maxFuel   = targetUnit.getMaxFuel();
                totalScore      += (maxFuel - targetUnit.getCurrentFuel()) / maxFuel * 10 * (targetUnit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
            }
        }

        candidates.push({
            score  : totalScore,
            action : WoContainer.fromJson({
                WoUnitRepairUnit : {
                    path : {
                        nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                        fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                        isBlocked       : false,
                    },
                    targetGridIndex : targetGridIndex.toProto().toJson(),
                    launchUnitId    : focusUnit.getLoaderUnitId() == null ? null : focusUnit.getUnitId(),
                }, 
            }),
        });
    }

    return Bots_Utils.getBestScoreAndAction(candidates, commonParams);
}
