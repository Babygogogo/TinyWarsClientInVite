import {
    WarEvents_Actions_Constants_SetTaskObjectiveState,
    Lang_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_TaskObjective,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { TaskObjectiveState } from "../../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type { WeaSetTaskObjectiveState } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConTaskObjectiveFilter(),
            expressionInfo          : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActProgress(),
            expressionInfo          : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsHidden(),
            expressionInfo          : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsProgressUpdaterDisabled(),
            expressionInfo          : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0078, data.getConTaskObjectiveFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActProgress()                    ? `${WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress.getTitleText()}: ${data.getActProgress()}`                                   : null,
        data.getActIsHidden()                    ? `${WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getTitleText()}: ${data.getActIsHidden()}`                                   : null,
        data.getActIsProgressUpdaterDisabled()   ? `${WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText()}: ${data.getActIsProgressUpdaterDisabled()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0078, data.getConTaskObjectiveFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetTaskObjectiveState, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConTaskObjectiveFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActProgress(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsHidden(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsProgressUpdaterDisabled(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTaskObjective(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTaskObjectiveFilter() ?? ``).eval(new ExpressionParsers_Contexts_TaskObjective.TaskObjective(war, objectiveId), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

function evalActProgress(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number): number {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) === objectiveId)?.getCurrentProgress() ?? 0;
    const act           = action.getActProgress();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

function evalActIsHidden(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) === objectiveId)?.getIsHidden() ?? false;
    const act           = action.getActIsHidden();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

function evalActIsProgressUpdaterDisabled(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) === objectiveId)?.getIsProgressUpdaterDisabled() ?? false;
    const act           = action.getActIsProgressUpdaterDisabled();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TaskObjective.TaskObjective(war, objectiveId), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
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
export function applyWithoutExtraData(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar): void {
    const newStateArray: TaskObjectiveState[] = [];
    for (const objectiveId of war.getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray().map(v => v.getObjectiveId()).sort((v1, v2) => v1 - v2) ?? []) {
        if (checkIsMeetConditionForTaskObjective(action, war, objectiveId)) {
            newStateArray.push(createNewTaskObjectiveState(action, war, objectiveId));
        }
    }

    const taskObjectiveManager = war.getTaskObjectiveManager();
    for (const newState of newStateArray) {
        taskObjectiveManager.updateState(newState);
    }
}

function createNewTaskObjectiveState(action: WeaSetTaskObjectiveState, war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number): TaskObjectiveState {
    const progress                  = evalActProgress(action, war, objectiveId);
    const isHidden                  = evalActIsHidden(action, war, objectiveId);
    const isProgressUpdaterDisabled = evalActIsProgressUpdaterDisabled(action, war, objectiveId);
    return TaskObjectiveState.fromJson({
        objectiveId                 : objectiveId,
        currentProgress             : progress,
        isHidden                    : isHidden,
        isProgressUpdaterDisabled   : isProgressUpdaterDisabled,
    });
}
