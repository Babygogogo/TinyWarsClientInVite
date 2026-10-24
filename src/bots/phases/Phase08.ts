import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type WoContainer        = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

const _CANDIDATE_UNITS_PER_ROUND    = 10;

export async function getActionForPhase08(commonParams: BotsCommonParams.CommonParams): Promise<WoContainer | null> {
    await TimerTimerModel.checkAndCallLater();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // const bestActionDict = commonParams.bestActionDict;
    // for (const unit of await getCandidateUnitsForPhase8(commonParams)) {
    //     {
    //         const existingBestAction = bestActionDict.get(unit);
    //         if (existingBestAction) {
    //             return existingBestAction;
    //         }
    //     }

    //     const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //     if (action == null) {
    //         continue;
    //     }

    //     bestActionDict.set(unit, action);
    //     return action;
    // }

    // return null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // const promiseArray: Promise<ScoreAndAction | null>[] = [];
    // for (const unit of await getCandidateUnitsForPhase8(commonParams)) {
    //     promiseArray.push(getBestScoreAndActionForCandidateUnit(commonParams, unit));
    // }

    // return (getBestScoreAndAction(await Promise.all(promiseArray), commonParams))?.action ?? null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const candidateUnits = await getCandidateUnitsForPhase8(commonParams);
    for (let i = 0; ; ++i) {
        let bestScoreAndAction: GrScoreAndAction | null = null;
        for (let j = 0; j < _CANDIDATE_UNITS_PER_ROUND; ++j) {
            const index = i * _CANDIDATE_UNITS_PER_ROUND + j;
            if (index >= candidateUnits.length) {
                return bestScoreAndAction?.action ?? null;
            }

            const newData = await BotsUtils.getBestScoreAndActionForCandidateUnit(commonParams, candidateUnits[index]);
            if (newData != null) {
                bestScoreAndAction = BotsUtils.getBetterScoreAndAction(bestScoreAndAction, newData, commonParams);
            }
        }

        if (bestScoreAndAction != null) {
            return bestScoreAndAction.action;
        }
    }
}

async function getCandidateUnitsForPhase8(commonParams: BotsCommonParams.CommonParams): Promise<IBwUnit[]> {
    await TimerTimerModel.checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : IBwUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === UnitsConstants.ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === UnitsConstants.ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === UnitsConstants.ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(BotsUtils.candidateUnitSorter).slice(0, 10);
}
