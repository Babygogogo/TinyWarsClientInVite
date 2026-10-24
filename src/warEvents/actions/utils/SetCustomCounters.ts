import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CustomCountersUtils from "../../../customCounters/Utils.ts";
import * as ExpressionParsersContextsCustomCounter from "../../../expressionParsers/contexts/CustomCounter.ts";
import * as ExpressionParsersContextsWar from "../../../expressionParsers/contexts/War.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCounters from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";
import * as WarEventsActionsConstantsSetCustomCounters from "../constants/SetCustomCounters.ts";

type WeaSetCustomCounters   = ProtoSchemaCommonProtoWarEventWeaSetCustomCounters.WeaSetCustomCounters;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCounters>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getIdExpression(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCounters.ExpressionInfoDict.IdExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getValueExpression(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCounters.ExpressionInfoDict.ValueExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCounters>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0042,
        data.getIdExpression(),
        data.getValueExpression()
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCounters>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetCustomCounters, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetCustomCounters.ExpressionInfoDict.IdExpression;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getIdExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCounters.ExpressionInfoDict.ValueExpression;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getValueExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCounters): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetCustomCounters, _isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const customCounterIdArray: number[] = [];
    try {
        const idResult = ExpressionParsersParser.Parser.getParseResult(action.getIdExpression() ?? "").eval(new ExpressionParsersContextsWar.War(war), false);
        if (idResult instanceof ExpressionParsersResultsNum.Num) {
            customCounterIdArray.push(idResult.num);
        } else if (idResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            customCounterIdArray.push(...idResult.numberArray);
        } else {
            return;
        }
    } catch {
        return;
    }

    const customCounterIdSet    = new Set(customCounterIdArray.map(v => Math.floor(v)).filter(v => CustomCountersUtils.checkIsValidId(v)));
    const expression            = ExpressionParsersParser.Parser.getParseResult(action.getValueExpression() ?? "");
    const newValueDict          = new Map<number, number>();
    for (const counterId of customCounterIdSet) {
        try {
            const rawValue = expression.eval(new ExpressionParsersContextsCustomCounter.CustomCounter(counterId, war), false);
            if ((rawValue instanceof ExpressionParsersResultsNum.Num)                               &&
                (CustomCountersUtils.checkIsValidValue(rawValue.num))
            ) {
                newValueDict.set(counterId, rawValue.num);
            }
        } catch {
            // nothing to do
        }
    }

    const warEventManager = war.getWarEventManager();
    for (const [counterId, counterValue] of newValueDict) {
        warEventManager.setCustomCounter(counterId, counterValue);
    }
}
