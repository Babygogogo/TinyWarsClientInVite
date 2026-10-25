import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { TaskObjective } from "../../../expressionParsers/contexts/TaskObjective.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import { TaskObjectiveState } from "../../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type {
    WeaSetTaskObjectiveState as ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import { ExpressionInfoDict } from "../constants/SetTaskObjectiveState.ts";

type WeaSetTaskObjectiveState   = ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState;

export function checkIsValid(action: Undefinable<WeaSetTaskObjectiveState>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConTaskObjectiveFilter(),
            expressionInfo          : ExpressionInfoDict.ConTaskObjectiveFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActProgress(),
            expressionInfo          : ExpressionInfoDict.ActProgress,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsHidden(),
            expressionInfo          : ExpressionInfoDict.ActIsHidden,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsProgressUpdaterDisabled(),
            expressionInfo          : ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0078, data.getConTaskObjectiveFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetTaskObjectiveState>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActProgress()                    ? `${ExpressionInfoDict.ActProgress.getTitleText()}: ${data.getActProgress()}`                                   : null,
        data.getActIsHidden()                    ? `${ExpressionInfoDict.ActIsHidden.getTitleText()}: ${data.getActIsHidden()}`                                   : null,
        data.getActIsProgressUpdaterDisabled()   ? `${ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText()}: ${data.getActIsProgressUpdaterDisabled()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0078, data.getConTaskObjectiveFilter() ?? UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetTaskObjectiveState, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConTaskObjectiveFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConTaskObjectiveFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActProgress;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActProgress(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsHidden;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsHidden(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsProgressUpdaterDisabled;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsProgressUpdaterDisabled(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTaskObjective(action: WeaSetTaskObjectiveState, war: IBwWar, objectiveId: number): boolean {
    try {
        const result = Parser.getParseResult(action.getConTaskObjectiveFilter() ?? ``).eval(new TaskObjective(war, objectiveId), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

function evalActProgress(action: WeaSetTaskObjectiveState, war: IBwWar, objectiveId: number): number {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getCurrentProgress() ?? 0;
    const act           = action.getActProgress();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new TaskObjective(war, objectiveId), false);
        if (epResult instanceof Num) {
            return getValueInInt32(epResult.num);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

function evalActIsHidden(action: WeaSetTaskObjectiveState, war: IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsHidden() ?? false;
    const act           = action.getActIsHidden();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new TaskObjective(war, objectiveId), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

function evalActIsProgressUpdaterDisabled(action: WeaSetTaskObjectiveState, war: IBwWar, objectiveId: number): boolean {
    const defaultValue  = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsProgressUpdaterDisabled() ?? false;
    const act           = action.getActIsProgressUpdaterDisabled();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new TaskObjective(war, objectiveId), false);
        if (epResult instanceof Num) {
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
export function applyWithoutExtraData(action: WeaSetTaskObjectiveState, war: IBwWar): void {
    const newStateArray: TaskObjectiveState[] = [];
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

function createNewTaskObjectiveState(action: WeaSetTaskObjectiveState, war: IBwWar, objectiveId: number): TaskObjectiveState {
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
