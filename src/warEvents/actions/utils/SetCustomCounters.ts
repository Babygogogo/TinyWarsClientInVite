import {
    CustomCounters_Utils,
    ExpressionParsers_Contexts_CustomCounter,
    WarEvents_Actions_Constants_SetCustomCounters,
    Lang_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetCustomCounters } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCounters>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getIdExpression(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.IdExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getValueExpression(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.ValueExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCounters>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0042,
        data.getIdExpression(),
        data.getValueExpression()
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCounters>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetCustomCounters, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.IdExpression;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getIdExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.ValueExpression;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getValueExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCounters): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetCustomCounters, _isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const customCounterIdArray: number[] = [];
    try {
        const idResult = ExpressionParsers_Parser.Parser.getParseResult(action.getIdExpression() ?? "").eval(new ExpressionParsers_Contexts_War.War(war), false);
        if (idResult instanceof ExpressionParsers_Results_Num.Num) {
            customCounterIdArray.push(idResult.num);
        } else if (idResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            customCounterIdArray.push(...idResult.numberArray);
        } else {
            return;
        }
    } catch {
        return;
    }

    const customCounterIdSet    = new Set(customCounterIdArray.map(v => Math.floor(v)).filter(v => CustomCounters_Utils.checkIsValidId(v)));
    const expression            = ExpressionParsers_Parser.Parser.getParseResult(action.getValueExpression() ?? "");
    const newValueDict          = new Map<number, number>();
    for (const counterId of customCounterIdSet) {
        try {
            const rawValue = expression.eval(new ExpressionParsers_Contexts_CustomCounter.CustomCounter(counterId, war), false);
            if ((rawValue instanceof ExpressionParsers_Results_Num.Num)                               &&
                (CustomCounters_Utils.checkIsValidValue(rawValue.num))
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
