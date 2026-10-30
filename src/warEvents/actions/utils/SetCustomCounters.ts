import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    checkIsValidId,
    checkIsValidValue,
} from "../../../customCounters/Utils.ts";
import { CustomCounter } from "../../../expressionParsers/contexts/CustomCounter.ts";
import { War } from "../../../expressionParsers/contexts/War.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type { WeaSetCustomCounters } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";
import { ExpressionInfoDict } from "../constants/SetCustomCounters.ts";

export function checkIsValid(action: Undefinable<WeaSetCustomCounters>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getIdExpression(),
            expressionInfo          : ExpressionInfoDict.IdExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getValueExpression(),
            expressionInfo          : ExpressionInfoDict.ValueExpression,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetCustomCounters>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(
        TextType.F0042,
        data.getIdExpression(),
        data.getValueExpression()
    );
}
export function getDetailDesc(data: Undefinable<WeaSetCustomCounters>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetCustomCounters, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.IdExpression;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getIdExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ValueExpression;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getValueExpression(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCounters): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetCustomCounters, _isFast: boolean, war: IBwWar): Promise<void> {
    const customCounterIdArray: number[] = [];
    try {
        const idResult = Parser.getParseResult(action.getIdExpression() ?? "").eval(new War(war), false);
        if (idResult instanceof Num) {
            customCounterIdArray.push(idResult.num);
        } else if (idResult instanceof NumArray) {
            customCounterIdArray.push(...idResult.numberArray);
        } else {
            return;
        }
    } catch {
        return;
    }

    const customCounterIdSet    = new Set(customCounterIdArray.map(v => Math.floor(v)).filter(v => checkIsValidId(v)));
    const expression            = Parser.getParseResult(action.getValueExpression() ?? "");
    const newValueDict          = new Map<number, number>();
    for (const counterId of customCounterIdSet) {
        try {
            const rawValue = expression.eval(new CustomCounter(counterId, war), false);
            if ((rawValue instanceof Num)                               &&
                (checkIsValidValue(rawValue.num))
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
