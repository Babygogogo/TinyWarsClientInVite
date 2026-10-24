import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarModelBwWar from "../baseWar/model/BwWar.ts";
import * as ExpressionParsersContextsTaskObjective from "../expressionParsers/contexts/TaskObjective.ts";
import * as ExpressionParsersParser from "../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../expressionParsers/results/Num.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NumbersUtils from "../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";
import type * as TaskObjectivesITaskObjectiveManager from "./ITaskObjectiveManager.ts";
import * as TaskObjectivesUtils from "./Utils.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type IBwWar                         = BaseWarModelBwWar.BwWar;

export class TaskObjectiveManager implements TaskObjectivesITaskObjectiveManager.ITaskObjectiveManager {
    private _stateArray             : ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[] = [];
    private _war?                   : IBwWar;

    public init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager>, taskObjectiveFullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData>): void {
        if (data == null) {
            return;
        }

        const stateArray            = data.getStateArray();
        const taskObjectiveIdSet    = new Set<number>();
        for (const state of stateArray) {
            const objectiveId = state.getObjectiveId() ?? 0;
            if (taskObjectiveIdSet.has(objectiveId)) {
                throw HelpersMisc.newError(`Duplicated objectiveId: ${objectiveId}`);
            }
            taskObjectiveIdSet.add(objectiveId);

            const errorCode = TaskObjectivesUtils.getErrorCodeForState(state, taskObjectiveFullData);
            if (errorCode) {
                throw HelpersMisc.newError(`Invalid state.`, errorCode);
            }
        }

        this._setStateArray(stateArray);
    }
    public fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager>): void {
        this._setStateArray(data?.getStateArray() ?? []);
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager {
        return ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager.fromJson({
            stateArray  : this.getStateArray().map(v => v.toJson()),
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager {
        return this.serialize();
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war, UtilsClientErrorCode.ClientErrorCode.BwWeatherManager_GetWar_00);
    }

    private _setStateArray(stateArray: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[]): void {
        const arr = this.getStateArray();
        arr.length = 0;
        arr.push(...stateArray);
    }
    public getStateArray(): ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[] {
        return this._stateArray;
    }
    public updateState(state: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState): boolean {
        const objectiveId   = state.getObjectiveId() ?? 0;
        const array         = this.getStateArray();
        const existingData  = array.find(v => (v.getObjectiveId() ?? 0) === objectiveId);
        if (existingData == null) {
            array.push(state.clone());
            return true;
        } else {
            let isUpdated = false;
            {
                const isHidden = state.getIsHidden();
                if ((existingData.getIsHidden() ?? false) !== (isHidden ?? false)) {
                    isUpdated = true;
                    existingData.setIsHidden(isHidden);
                }
            }
            {
                const progress = state.getCurrentProgress();
                if ((existingData.getCurrentProgress() ?? 0) !== (progress ?? 0)) {
                    isUpdated = true;
                    existingData.setCurrentProgress(progress);
                }
            }
            {
                const isDisabled = state.getIsProgressUpdaterDisabled();
                if ((existingData.getIsProgressUpdaterDisabled() ?? false) !== (isDisabled ?? false)) {
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

        const newStateList    : ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[] = [];
        const stateArray      = this.getStateArray();
        for (const taskObjective of allTaskObjectiveArray) {
            const updater = taskObjective.getUpdaterForCurrentProgress();
            if (!updater) {
                continue;
            }

            const objectiveId   = taskObjective.getObjectiveId() ?? 0;
            const state         = stateArray.find(v => (v.getObjectiveId() ?? 0) === objectiveId);
            if (state?.getIsProgressUpdaterDisabled()) {
                continue;
            }

            const currentProgress = state?.getCurrentProgress() ?? 0;
            const newProgress     = evalProgress(war, updater, objectiveId, currentProgress);
            if (newProgress != currentProgress) {
                const newState = state?.clone() ?? new ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState();
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
            const progress = state.getCurrentProgress() ?? 0;
            if (progress == 0) {
                continue;
            }

            const objectiveId     = state.getObjectiveId() ?? 0;
            const taskObjective   = taskObjectiveArray?.find(v => (v.getObjectiveId() ?? 0) === objectiveId);
            if (taskObjective == null) {
                continue;
            }

            score += progress * (taskObjective.getScoreForProgress() ?? 0);

            const maxProgress = taskObjective.getMaxProgress();
            if ((maxProgress != null) && (maxProgress <= progress)) {
                score += (taskObjective.getScoreForCompletion() ?? 0);
            }
        }

        return score;
    }
}

function evalProgress(war: IBwWar, updater: string, objectiveId: number, defaultValue: number): number {
    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(updater).eval(new ExpressionParsersContextsTaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
