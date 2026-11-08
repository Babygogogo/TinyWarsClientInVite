import {
    Units_Constants,
    Bots_Utils,
    Timer_TimerModel,
    type Bots_CommonParams,
    type Units_Unit,
    type Bots_Types,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

const _CANDIDATE_UNITS_PER_ROUND    = 10;

export async function getActionForPhase08(commonParams: Bots_CommonParams.CommonParams): Promise<WoContainer | null> {
    await Timer_TimerModel.checkAndCallLater();

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
        let bestScoreAndAction: Bots_Types.ScoreAndAction | null = null;
        for (let j = 0; j < _CANDIDATE_UNITS_PER_ROUND; ++j) {
            const index = i * _CANDIDATE_UNITS_PER_ROUND + j;
            if (index >= candidateUnits.length) {
                return bestScoreAndAction?.action ?? null;
            }

            const newData = await Bots_Utils.getBestScoreAndActionForCandidateUnit(commonParams, candidateUnits[index]);
            if (newData != null) {
                bestScoreAndAction = Bots_Utils.getBetterScoreAndAction(bestScoreAndAction, newData, commonParams);
            }
        }

        if (bestScoreAndAction != null) {
            return bestScoreAndAction.action;
        }
    }
}

async function getCandidateUnitsForPhase8(commonParams: Bots_CommonParams.CommonParams): Promise<Units_Unit.Unit[]> {
    await Timer_TimerModel.checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : Units_Unit.Unit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === Units_Constants.ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
            (unit.getActionState() === Units_Constants.ActionStateId.Idle)    &&
            (unit.checkCanAiDoAction())
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === Units_Constants.ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(Bots_Utils.candidateUnitSorter).slice(0, 10);
}
