import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { IsNeedVisibility } from "../Utils.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitBeLoaded(commonParams: CommonParams, unit: IBwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    const unitGridIndex = unit.getGridIndex();
    if (gridIndex.checkIsEqual(unitGridIndex)) {
        return null;
    }

    const loader = commonParams.getWar().getUnitMap().getUnitOnMap(gridIndex);
    if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
        return null;
    }

    const score = await getScoreForActionUnitBeLoaded(commonParams, unit, gridIndex);
    return {
        score   : score,
        action  : WoContainer.fromJson({ WoUnitBeLoaded: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitBeLoaded(commonParams: CommonParams, unit: IBwUnit, gridIndex: GridIndex): Promise<number> {
    await checkAndCallLater();

    const war       = commonParams.getWar();
    const loader    = getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00);
    if (!loader.checkCanLoadUnit(unit)) {
        throw newError(`Can't load the unit.`, ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01);
    }

    const passiveScaler = unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.getUnitValueRatio()) * (unit.getIsCoOnboard() ? 2 : 1);
    let totalScore      = 0;
    if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
        totalScore += (unit.getMaxHp() - unit.getCurrentHp()) * passiveScaler;
    }

    if (loader.checkCanSupplyLoadedUnit()) {
        {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo) {
                const currentAmmo   = getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_02);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }

        {
            const maxFuel   = unit.getMaxFuel();
            totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
        }

        if (IsNeedVisibility) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                const currentAmmo   = getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_03);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
    }

    return totalScore;
}
