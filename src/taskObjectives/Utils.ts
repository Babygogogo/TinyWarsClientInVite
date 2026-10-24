import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersParser from "../expressionParsers/Parser.ts";
import * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import * as TaskObjectivesConstants from "./Constants.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type TaskObjective              = ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;
type TaskObjectiveState         = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState;

export function checkIsValid(data: TaskObjective, customCounterNameSet: Set<string>): boolean {
    return getErrorCode(data, customCounterNameSet) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: TaskObjective, customCounterNameSet: Set<string>): UtilsClientErrorCode.ClientErrorCode {
    if ((data.getObjectiveId() ?? 0) < 0) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_00;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getDesc(),
        minTextLength   : 1,
        maxTextLength   : GameConfigGcWar.TaskObjectives.MaxDescLength,
        minTextCount    : 1
    })) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_01;
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_02;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : data.getUpdaterForCurrentProgress(),
            expressionInfo          : TaskObjectivesConstants.ExpressionInfoDict.UpdaterForCurrentProgress,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return UtilsClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_03;
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorText(data: TaskObjective, customCounterNameSet: Set<string>): string | null {
    if ((data.getObjectiveId() ?? 0) < 0) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0792));
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getDesc(),
        minTextLength   : 1,
        maxTextLength   : GameConfigGcWar.TaskObjectives.MaxDescLength,
        minTextCount    : 1
    })) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1215));
    }

    const maxProgress = data.getMaxProgress();
    if ((maxProgress != null) && (maxProgress <= 0)) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1216));
    }

    {
        const info      = TaskObjectivesConstants.ExpressionInfoDict.UpdaterForCurrentProgress;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getUpdaterForCurrentProgress(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}
export function getFullDesc(data: TaskObjective): string {
    return [
        `${LangUtils.getText(LangConstants.TextType.B1215)}: ${data.getDesc()?.map(v => v.getText()).join(`\n${LangUtils.getText(LangConstants.TextType.B1215)}: `) ?? LangConstants.UndefinedError}`,
        `${LangUtils.getText(LangConstants.TextType.B1217)}: ${LangUtils.getTextForYesOrNo(data.getIsMain())}`,
        `${LangUtils.getText(LangConstants.TextType.B1216)}: ${data.getMaxProgress() ?? `--`}`,
        `${LangUtils.getText(LangConstants.TextType.B1218)}: ${data.getScoreForCompletion() ?? 0}`,
        `${LangUtils.getText(LangConstants.TextType.B1219)}: ${data.getScoreForProgress() ?? 0}`,
        `${LangUtils.getText(LangConstants.TextType.B1226)}: ${data.getUpdaterForCurrentProgress() ?? `--`}`,
    ].join(`\n`);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidFullData(data: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData, customCounterNameSet: Set<string>): boolean {
    return getErrorCodeForFullData(data, customCounterNameSet) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCodeForFullData(data: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData, customCounterNameSet: Set<string>): UtilsClientErrorCode.ClientErrorCode {
    const array = data.getTaskObjectiveArray();
    if (array.length > GameConfigGcWar.TaskObjectives.MaxObjectivesCount) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_00;
    }

    const objectiveIdSet = new Set<number>();
    for (const taskObjective of data.getTaskObjectiveArray()) {
        const errorCode = getErrorCode(taskObjective, customCounterNameSet);
        if (errorCode) {
            return errorCode;
        }

        const objectiveId = taskObjective.getObjectiveId() ?? 0;
        if (objectiveIdSet.has(objectiveId)) {
            return UtilsClientErrorCode.ClientErrorCode.PhTaskObjectiveFullData_GetErrorCode_01;
        }
        objectiveIdSet.add(objectiveId);
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function trimAndClone(srcData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData>, objectiveIds: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData | null {
    if ((srcData == null) || (objectiveIds == null)) {
        return null;
    }

    const dstTaskObjectiveArray   : TaskObjective[] = [];
    const srcTaskObjectiveArray   = srcData.getTaskObjectiveArray();
    for (const objectiveId of objectiveIds) {
        const taskObjective = srcTaskObjectiveArray.find(v => (v.getObjectiveId() ?? 0) === objectiveId);
        if (taskObjective) {
            dstTaskObjectiveArray.push(taskObjective.clone());
        }
    }

    return ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData.fromJson({
        taskObjectiveArray  : dstTaskObjectiveArray.map(v => v.toJson()),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidState(data: TaskObjectiveState, fullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData>): boolean {
    return getErrorCodeForState(data, fullData) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCodeForState(data: TaskObjectiveState, fullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData>): UtilsClientErrorCode.ClientErrorCode {
    const objectiveId = data.getObjectiveId() ?? 0;
    if (objectiveId < 0) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjectiveState_GetErrorCode_00;
    }

    // const currentProgress = data.getCurrentProgress() ?? 0;
    // if (currentProgress < 0) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_01;
    // }

    const taskObjective = fullData?.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId);
    if (taskObjective == null) {
        return UtilsClientErrorCode.ClientErrorCode.PhTaskObjectiveState_GetErrorCode_02;
    }

    // const maxProgress = taskObjective.maxProgress;
    // if ((maxProgress != null) && (currentProgress > maxProgress)) {
    //     return ClientErrorCode.PhTaskObjectiveState_GetErrorCode_03;
    // }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
