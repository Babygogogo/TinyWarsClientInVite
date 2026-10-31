import {
    Utils_ClientErrorCode,
    TaskObjectives_Utils,
    Helpers_Misc,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_TaskObjective,
    type BaseWar_Model_BwWar,
    type TaskObjectives_ITaskObjectiveManager,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { TaskObjectiveFullData } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import { SerialTaskObjectiveManager } from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";

export class TaskObjectiveManager implements TaskObjectives_ITaskObjectiveManager.ITaskObjectiveManager {
    private readonly _stateArray             : TaskObjectiveState[] = [];
    private _war?                   : BaseWar_Model_BwWar.BwWar;

    public init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTaskObjectiveManager>, taskObjectiveFullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>): void {
        if (data == null) {
            return;
        }

        const stateArray            = data.getStateArray();
        const taskObjectiveIdSet    = new Set<number>();
        for (const state of stateArray) {
            const objectiveId = state.getObjectiveId();
            if (taskObjectiveIdSet.has(objectiveId)) {
                throw Helpers_Misc.newError(`Duplicated objectiveId: ${objectiveId}`);
            }
            taskObjectiveIdSet.add(objectiveId);

            const errorCode = TaskObjectives_Utils.getErrorCodeForState(state, taskObjectiveFullData);
            if (errorCode) {
                throw Helpers_Misc.newError(`Invalid state.`, errorCode);
            }
        }

        this._setStateArray(stateArray);
    }
    public fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTaskObjectiveManager>): void {
        this._setStateArray(data?.getStateArray() ?? []);
    }

    public serialize(): SerialTaskObjectiveManager {
        return SerialTaskObjectiveManager.fromJson({
            stateArray : this.getStateArray().map(v => v.toJson()),
        });
    }
    public serializeForCreateMfr(): SerialTaskObjectiveManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): SerialTaskObjectiveManager {
        return this.serialize();
    }

    public startRunning(war: BaseWar_Model_BwWar.BwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BaseWar_Model_BwWar.BwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Model_BwWar.BwWar {
        return Helpers_Misc.getExisted(this._war, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManager_GetWar_00);
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

function evalProgress(war: BaseWar_Model_BwWar.BwWar, updater: string, objectiveId: number, defaultValue: number): number {
    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(updater).eval(new ExpressionParsers_Contexts_TaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
