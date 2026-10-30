import {
    Lang_Utils,
    Utils_ClientErrorCode,
    TaskObjectives_Constants,
    ExpressionParsers_Parser,
    Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { TaskObjective } from "../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import { TaskObjectiveFullData } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

export function checkIsValid(data: TaskObjective, customCounterNameSet: Set<string>): boolean {
    return getErrorCode(data, customCounterNameSet) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: TaskObjective, customCounterNameSet: Set<string>): Utils_ClientErrorCode.ClientErrorCode {
    if ((data.getObjectiveId()) < 0) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_00;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getDesc(),
        minTextLength : 1,
        maxTextLength : TaskObjectives_Constants.Common.MaxDescLength,
        minTextCount  : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_01;
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_02;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : data.getUpdaterForCurrentProgress(),
            expressionInfo       : TaskObjectives_Constants.ExpressionInfoDict.UpdaterForCurrentProgress,
            customCounterNameSet : customCounterNameSet,
        })) {
            return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_03;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorText(data: TaskObjective, customCounterNameSet: Set<string>): string | null {
    if ((data.getObjectiveId()) < 0) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0792));
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getDesc(),
        minTextLength : 1,
        maxTextLength : TaskObjectives_Constants.Common.MaxDescLength,
        minTextCount  : 1,
    })) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1215));
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1216));
    }

    {
        const info      = TaskObjectives_Constants.ExpressionInfoDict.UpdaterForCurrentProgress;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getUpdaterForCurrentProgress(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}
export function getFullDesc(data: TaskObjective): string {
    return [
        `${Lang_Utils.getText(Lang_Constants.TextType.B1215)}: ${data.getDesc()?.map(v => v.getText()).join(`\n${Lang_Utils.getText(Lang_Constants.TextType.B1215)}: `)}`,
        `${Lang_Utils.getText(Lang_Constants.TextType.B1217)}: ${Lang_Utils.getTextForYesOrNo(data.getIsMain())}`,
        `${Lang_Utils.getText(Lang_Constants.TextType.B1216)}: ${data.getMaxProgress() ?? `--`}`,
        `${Lang_Utils.getText(Lang_Constants.TextType.B1218)}: ${data.getScoreForCompletion()}`,
        `${Lang_Utils.getText(Lang_Constants.TextType.B1219)}: ${data.getScoreForProgress()}`,
        `${Lang_Utils.getText(Lang_Constants.TextType.B1226)}: ${data.getUpdaterForCurrentProgress() ?? `--`}`,
    ].join(`\n`);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidFullData(data: TaskObjectiveFullData, customCounterNameSet: Set<string>): boolean {
    return getErrorCodeForFullData(data, customCounterNameSet) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCodeForFullData(data: TaskObjectiveFullData, customCounterNameSet: Set<string>): Utils_ClientErrorCode.ClientErrorCode {
    const array = data.getTaskObjectiveArray();
    if (array.length > TaskObjectives_Constants.Common.MaxObjectivesCount) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_00;
    }

    const objectiveIdSet = new Set<number>();
    for (const taskObjective of data.getTaskObjectiveArray()) {
        const errorCode = getErrorCode(taskObjective, customCounterNameSet);
        if (errorCode) {
            return errorCode;
        }

        const objectiveId = taskObjective.getObjectiveId();
        if (objectiveIdSet.has(objectiveId)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_01;
        }
        objectiveIdSet.add(objectiveId);
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function trimAndClone(srcData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>, objectiveIds: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): TaskObjectiveFullData | null {
    if ((srcData == null) || (objectiveIds == null)) {
        return null;
    }

    const dstTaskObjectiveArray   : TaskObjective[] = [];
    const srcTaskObjectiveArray   = srcData.getTaskObjectiveArray();
    for (const objectiveId of objectiveIds) {
        const taskObjective = srcTaskObjectiveArray.find(v => (v.getObjectiveId()) === objectiveId);
        if (taskObjective) {
            dstTaskObjectiveArray.push(taskObjective.clone());
        }
    }

    return TaskObjectiveFullData.fromJson({
        taskObjectiveArray : dstTaskObjectiveArray.map(v => v.toJson()),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidState(data: TaskObjectiveState, fullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>): boolean {
    return getErrorCodeForState(data, fullData) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCodeForState(data: TaskObjectiveState, fullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>): Utils_ClientErrorCode.ClientErrorCode {
    const objectiveId = data.getObjectiveId();
    if (objectiveId < 0) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjectiveState_GetErrorCode_00;
    }

    // const currentProgress = data.getCurrentProgress() ?? 0;
    // if (currentProgress < 0) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_01;
    // }

    const taskObjective = fullData?.getTaskObjectiveArray().find(v => (v.getObjectiveId()) === objectiveId);
    if (taskObjective == null) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTaskObjectiveState_GetErrorCode_02;
    }

    // const maxProgress = taskObjective.maxProgress;
    // if ((maxProgress != null) && (currentProgress > maxProgress)) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_03;
    // }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
