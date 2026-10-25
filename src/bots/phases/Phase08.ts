import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getBestScoreAndActionForCandidateUnit, getBetterScoreAndAction, candidateUnitSorter } from "../Utils.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { ActionStateId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

const _CANDIDATE_UNITS_PER_ROUND    = 10;

export async function getActionForPhase08(commonParams: CommonParams): Promise<WoContainer | null> {
    await checkAndCallLater();

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

            const newData = await getBestScoreAndActionForCandidateUnit(commonParams, candidateUnits[index]);
            if (newData != null) {
                bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, newData, commonParams);
            }
        }

        if (bestScoreAndAction != null) {
            return bestScoreAndAction.action;
        }
    }
}

async function getCandidateUnitsForPhase8(commonParams: CommonParams): Promise<IBwUnit[]> {
    await checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : IBwUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(candidateUnitSorter).slice(0, 10);
}
