import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitBeLoaded(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

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
        action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitBeLoaded: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitBeLoaded(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    const war       = commonParams.getWar();
    const loader    = HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00);
    if (!loader.checkCanLoadUnit(unit)) {
        throw HelpersMisc.newError(`Can't load the unit.`, UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01);
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
                const currentAmmo   = HelpersMisc.getExisted(unit.getPrimaryWeaponCurrentAmmo(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_02);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }

        {
            const maxFuel   = unit.getMaxFuel();
            totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
        }

        if (BotsUtils.IsNeedVisibility) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                const currentAmmo   = HelpersMisc.getExisted(unit.getFlareCurrentAmmo(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_03);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
    }

    return totalScore;
}
