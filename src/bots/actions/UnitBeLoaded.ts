import {
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Bots_Utils,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_Unit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitBeLoaded(commonParams: Bots_CommonParams.CommonParams, unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

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
        score  : score,
        action : WoContainer.fromJson({
            WoUnitBeLoaded : {
                path : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            }, 
        }),
    };
}

async function getScoreForActionUnitBeLoaded(commonParams: Bots_CommonParams.CommonParams, unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    const war       = commonParams.getWar();
    const loader    = Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00);
    if (!loader.checkCanLoadUnit(unit)) {
        throw Helpers_Misc.newError(`Can't load the unit.`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01);
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
                const currentAmmo   = unit.getPrimaryWeaponCurrentAmmo();
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }

        {
            const maxFuel   = unit.getMaxFuel();
            totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
        }

        if (Bots_Utils.IsNeedVisibility) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                const currentAmmo   = unit.getFlareCurrentAmmo();
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
    }

    return totalScore;
}
