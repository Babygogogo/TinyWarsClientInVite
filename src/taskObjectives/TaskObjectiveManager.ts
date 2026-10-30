import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { BwWar } from "../baseWar/model/BwWar.ts";
import { TaskObjective } from "../expressionParsers/contexts/TaskObjective.ts";
import { Parser } from "../expressionParsers/Parser.ts";
import { Num } from "../expressionParsers/results/Num.ts";
import {
    newError,
    getExisted,
} from "../helpers/Misc.ts";
import { getValueInInt32 } from "../numbers/Utils.ts";
import type { TaskObjectiveFullData } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import { SerialTaskObjectiveManager } from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";
import type { ITaskObjectiveManager } from "./ITaskObjectiveManager.ts";
import { getErrorCodeForState } from "./Utils.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export class TaskObjectiveManager implements ITaskObjectiveManager {
    private _stateArray             : TaskObjectiveState[] = [];
    private _war?                   : BwWar;

    public init(data: Undefinable<SerialTaskObjectiveManager>, taskObjectiveFullData: Undefinable<TaskObjectiveFullData>): void {
        if (data == null) {
            return;
        }

        const stateArray            = data.getStateArray();
        const taskObjectiveIdSet    = new Set<number>();
        for (const state of stateArray) {
            const objectiveId = state.getObjectiveId();
            if (taskObjectiveIdSet.has(objectiveId)) {
                throw newError(`Duplicated objectiveId: ${objectiveId}`);
            }
            taskObjectiveIdSet.add(objectiveId);

            const errorCode = getErrorCodeForState(state, taskObjectiveFullData);
            if (errorCode) {
                throw newError(`Invalid state.`, errorCode);
            }
        }

        this._setStateArray(stateArray);
    }
    public fastInit(data: Undefinable<SerialTaskObjectiveManager>): void {
        this._setStateArray(data?.getStateArray() ?? []);
    }

    public serialize(): SerialTaskObjectiveManager {
        return SerialTaskObjectiveManager.fromJson({
            stateArray  : this.getStateArray().map(v => v.toJson()),
        });
    }
    public serializeForCreateMfr(): SerialTaskObjectiveManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): SerialTaskObjectiveManager {
        return this.serialize();
    }

    public startRunning(war: BwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BwWar): void {
        this._war = war;
    }
    public getWar(): BwWar {
        return getExisted(this._war, ClientErrorCode.BwWeatherManager_GetWar_00);
    }

    private _setStateArray(stateArray: TaskObjectiveState[]): void {
        const arr = this.getStateArray();
        arr.length = 0;
        arr.push(...stateArray);
    }
    public getStateArray(): TaskObjectiveState[] {
        return this._stateArray;
    }
    public updateState(state: TaskObjectiveState): boolean {
        const objectiveId   = state.getObjectiveId();
        const array         = this.getStateArray();
        const existingData  = array.find(v => (v.getObjectiveId()) === objectiveId);
        if (existingData == null) {
            array.push(state.clone());
            return true;
        } else {
            let isUpdated = false;
            {
                const isHidden = state.getIsHidden();
                if ((existingData.getIsHidden()) !== (isHidden)) {
                    isUpdated = true;
                    existingData.setIsHidden(isHidden);
                }
            }
            {
                const progress = state.getCurrentProgress();
                if ((existingData.getCurrentProgress()) !== (progress)) {
                    isUpdated = true;
                    existingData.setCurrentProgress(progress);
                }
            }
            {
                const isDisabled = state.getIsProgressUpdaterDisabled();
                if ((existingData.getIsProgressUpdaterDisabled()) !== (isDisabled)) {
                    isUpdated = true;
                    existingData.setIsProgressUpdaterDisabled(isDisabled);
                }
            }

            return isUpdated;
        }
    }

    public autoUpdateAllCurrentProgresses(): void {
        const war                   = this.getWar();
        const allTaskObjectiveArray = war.getCommonSettingManager().getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray();
        if (!allTaskObjectiveArray?.length) {
            return;
        }

        const newStateList    : TaskObjectiveState[] = [];
        const stateArray      = this.getStateArray();
        for (const taskObjective of allTaskObjectiveArray) {
            const updater = taskObjective.getUpdaterForCurrentProgress();
            if (!updater) {
                continue;
            }

            const objectiveId   = taskObjective.getObjectiveId();
            const state         = stateArray.find(v => (v.getObjectiveId()) === objectiveId);
            if (state?.getIsProgressUpdaterDisabled()) {
                continue;
            }

            const currentProgress = state?.getCurrentProgress() ?? 0;
            const newProgress     = evalProgress(war, updater, objectiveId, currentProgress);
            if (newProgress != currentProgress) {
                const newState = state?.clone() ?? new TaskObjectiveState();
                newState.setObjectiveId(objectiveId);
                newState.setCurrentProgress(newProgress || null);
                newStateList.push(newState);
            }
        }

        for (const newState of newStateList) {
            this.updateState(newState);
        }
    }

    public getScore(): number {
        const taskObjectiveArray    = this.getWar().getCommonSettingManager().getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray();
        let score                   = 0;
        for (const state of this.getStateArray()) {
            const progress = state.getCurrentProgress();
            if (progress == 0) {
                continue;
            }

            const objectiveId     = state.getObjectiveId();
            const taskObjective   = taskObjectiveArray?.find(v => (v.getObjectiveId()) === objectiveId);
            if (taskObjective == null) {
                continue;
            }

            score += progress * (taskObjective.getScoreForProgress());

            const maxProgress = taskObjective.getMaxProgress();
            if ((maxProgress != null) && (maxProgress <= progress)) {
                score += (taskObjective.getScoreForCompletion());
            }
        }

        return score;
    }
}

function evalProgress(war: BwWar, updater: string, objectiveId: number, defaultValue: number): number {
    try {
        const epResult = Parser.getParseResult(updater).eval(new TaskObjective(war, objectiveId), false);
        if (epResult instanceof Num) {
            return getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
