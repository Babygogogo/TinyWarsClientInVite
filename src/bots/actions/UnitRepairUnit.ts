import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitRepairUnit(commonParams: BotsCommonParams.CommonParams, focusUnit: IBwUnit, destination: AuxiliaryTypesGridIndex.GridIndex, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    if (!focusUnit.getTemplateCfg().getCanRepairAdjacentTargetUnit()) {
        return null;
    }

    const war         = commonParams.getWar();
    const unitMap     = war.getUnitMap();
    const playerIndex = focusUnit.getPlayerIndex();
    const candidates  : GrScoreAndAction[] = [];
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
                const currentAmmo = HelpersMisc.getExisted(targetUnit.getPrimaryWeaponCurrentAmmo());
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
            score   : totalScore,
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitRepairUnit: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                targetGridIndex : targetGridIndex.toProto().toJson(),
                launchUnitId    : focusUnit.getLoaderUnitId() == null ? null : focusUnit.getUnitId(),
            } })
        });
    }

    return BotsUtils.getBestScoreAndAction(candidates, commonParams);
}
