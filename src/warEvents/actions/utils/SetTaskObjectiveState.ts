import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTaskObjective from "../../../expressionParsers/contexts/TaskObjective.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState from "../../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import * as WarEventsActionsConstantsSetTaskObjectiveState from "../constants/SetTaskObjectiveState.ts";

type WeaSetTaskObjectiveState   = ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState.WeaSetTaskObjectiveState;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTaskObjectiveFilter(),
            expressionInfo          : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActProgress(),
            expressionInfo          : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsHidden(),
            expressionInfo          : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsProgressUpdaterDisabled(),
            expressionInfo          : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0078, data.getConTaskObjectiveFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActProgress()                    ? `${WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress.getTitleText()}: ${data.getActProgress()}`                                   : null,
        data.getActIsHidden()                    ? `${WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getTitleText()}: ${data.getActIsHidden()}`                                   : null,
        data.getActIsProgressUpdaterDisabled()   ? `${WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText()}: ${data.getActIsProgressUpdaterDisabled()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0078, data.getConTaskObjectiveFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetTaskObjectiveState, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConTaskObjectiveFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActProgress(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsHidden(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsProgressUpdaterDisabled(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTaskObjective(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTaskObjectiveFilter() ?? ``).eval(new ExpressionParsersContextsTaskObjective.TaskObjective(war, objectiveId), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

function evalActProgress(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number): number {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getCurrentProgress() ?? 0;
    const act           = action.getActProgress();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

function evalActIsHidden(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsHidden() ?? false;
    const act           = action.getActIsHidden();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

function evalActIsProgressUpdaterDisabled(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsProgressUpdaterDisabled() ?? false;
    const act           = action.getActIsProgressUpdaterDisabled();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applyWithExtraData(_action: WeaSetTaskObjectiveState): void {
    // nothing to do
}
export function applyWithoutExtraData(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar): void {
    const newStateArray: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[] = [];
    for (const objectiveId of war.getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray().map(v => v.getObjectiveId() ?? 0).sort((v1, v2) => v1 - v2) ?? []) {
        if (checkIsMeetConditionForTaskObjective(action, war, objectiveId)) {
            newStateArray.push(createNewTaskObjectiveState(action, war, objectiveId));
        }
    }

    const taskObjectiveManager = war.getTaskObjectiveManager();
    for (const newState of newStateArray) {
        taskObjectiveManager.updateState(newState);
    }
}

function createNewTaskObjectiveState(action: WeaSetTaskObjectiveState, war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number): ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState {
    const progress                  = evalActProgress(action, war, objectiveId);
    const isHidden                  = evalActIsHidden(action, war, objectiveId);
    const isProgressUpdaterDisabled = evalActIsProgressUpdaterDisabled(action, war, objectiveId);
    return ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState.fromJson({
        objectiveId                 : objectiveId,
        currentProgress             : progress,
        isHidden                    : isHidden,
        isProgressUpdaterDisabled   : isProgressUpdaterDisabled,
    });
}
