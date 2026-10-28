import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { Parser } from "../expressionParsers/Parser.ts";
import { TextType } from "../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getFormattedText, getText, getTextForYesOrNo } from "../lang/Utils.ts";
import type { TaskObjective } from "../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import { TaskObjectiveFullData } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import {ExpressionInfoDict, Common} from "./Constants.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export function checkIsValid(data: TaskObjective, customCounterNameSet: Set<string>): boolean {
    return getErrorCode(data, customCounterNameSet) === ClientErrorCode.NoError;
}
export function getErrorCode(data: TaskObjective, customCounterNameSet: Set<string>): ClientErrorCode {
    if ((data.getObjectiveId()) < 0) {
        return ClientErrorCode.PhTaskObjective_GetErrorCode_00;
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getDesc(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxDescLength,
        minTextCount    : 1
    })) {
        return ClientErrorCode.PhTaskObjective_GetErrorCode_01;
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return ClientErrorCode.PhTaskObjective_GetErrorCode_02;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : data.getUpdaterForCurrentProgress(),
            expressionInfo          : ExpressionInfoDict.UpdaterForCurrentProgress,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return ClientErrorCode.PhTaskObjective_GetErrorCode_03;
        }
    }

    return ClientErrorCode.NoError;
}
export function getErrorText(data: TaskObjective, customCounterNameSet: Set<string>): string | null {
    if ((data.getObjectiveId()) < 0) {
        return getFormattedText(TextType.F0091, getText(TextType.B0792));
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getDesc(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxDescLength,
        minTextCount    : 1
    })) {
        return getFormattedText(TextType.F0091, getText(TextType.B1215));
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return getFormattedText(TextType.F0091, getText(TextType.B1216));
    }

    {
        const info      = ExpressionInfoDict.UpdaterForCurrentProgress;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getUpdaterForCurrentProgress(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}
export function getFullDesc(data: TaskObjective): string {
    return [
        `${getText(TextType.B1215)}: ${data.getDesc()?.map(v => v.getText()).join(`\n${getText(TextType.B1215)}: `)}`,
        `${getText(TextType.B1217)}: ${getTextForYesOrNo(data.getIsMain())}`,
        `${getText(TextType.B1216)}: ${data.getMaxProgress() ?? `--`}`,
        `${getText(TextType.B1218)}: ${data.getScoreForCompletion()}`,
        `${getText(TextType.B1219)}: ${data.getScoreForProgress()}`,
        `${getText(TextType.B1226)}: ${data.getUpdaterForCurrentProgress() ?? `--`}`,
    ].join(`\n`);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidFullData(data: TaskObjectiveFullData, customCounterNameSet: Set<string>): boolean {
    return getErrorCodeForFullData(data, customCounterNameSet) === ClientErrorCode.NoError;
}
export function getErrorCodeForFullData(data: TaskObjectiveFullData, customCounterNameSet: Set<string>): ClientErrorCode {
    const array = data.getTaskObjectiveArray();
    if (array.length > Common.MaxObjectivesCount) {
        return ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_00;
    }

    const objectiveIdSet = new Set<number>();
    for (const taskObjective of data.getTaskObjectiveArray()) {
        const errorCode = getErrorCode(taskObjective, customCounterNameSet);
        if (errorCode) {
            return errorCode;
        }

        const objectiveId = taskObjective.getObjectiveId();
        if (objectiveIdSet.has(objectiveId)) {
            return ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_01;
        }
        objectiveIdSet.add(objectiveId);
    }

    return ClientErrorCode.NoError;
}

export function trimAndClone(srcData: Undefinable<TaskObjectiveFullData>, objectiveIds: Undefinable<number[]>): TaskObjectiveFullData | null {
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
        taskObjectiveArray  : dstTaskObjectiveArray.map(v => v.toJson()),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidState(data: TaskObjectiveState, fullData: Undefinable<TaskObjectiveFullData>): boolean {
    return getErrorCodeForState(data, fullData) === ClientErrorCode.NoError;
}
export function getErrorCodeForState(data: TaskObjectiveState, fullData: Undefinable<TaskObjectiveFullData>): ClientErrorCode {
    const objectiveId = data.getObjectiveId();
    if (objectiveId < 0) {
        return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_00;
    }

    // const currentProgress = data.getCurrentProgress() ?? 0;
    // if (currentProgress < 0) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_01;
    // }

    const taskObjective = fullData?.getTaskObjectiveArray().find(v => (v.getObjectiveId()) === objectiveId);
    if (taskObjective == null) {
        return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_02;
    }

    // const maxProgress = taskObjective.maxProgress;
    // if ((maxProgress != null) && (currentProgress > maxProgress)) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_03;
    // }

    return ClientErrorCode.NoError;
}
