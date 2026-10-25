import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { War } from "../../../expressionParsers/contexts/War.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { checkIsValidForcedFogCode } from "../../../fogMaps/Utils.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { WeaSetForceFogCodeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";
import { ExpressionInfoDict } from "../constants/SetForceFogCodeExpr.ts";

export function checkIsValid(action: Undefinable<WeaSetForceFogCodeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getForceFogCode(),
            expressionInfo          : ExpressionInfoDict.ForceFogCode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getTurnsCount(),
            expressionInfo          : ExpressionInfoDict.TurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0047, data.getForceFogCode() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getTurnsCount() ? `${ExpressionInfoDict.TurnsCount.getTitleText()}: ${data.getTurnsCount()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0047, data.getForceFogCode() ?? UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetForceFogCodeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ForceFogCode;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getForceFogCode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.TurnsCount;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getTurnsCount(),
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
export async function applyWithExtraData(_action: WeaSetForceFogCodeExpr): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetForceFogCodeExpr, _isFast: boolean, war: IBwWar): Promise<void> {
    const forceFogCode = getForceFogCode(action.getForceFogCode() ?? ``, war);
    if (forceFogCode == null) {
        return;
    }

    const turnsCount = getTurnsCount(action.getTurnsCount() ?? ``, war);
    if (turnsCount == null) {
        return;
    }

    const fogMap = war.getFogMap();
    fogMap.setForceFogCode(forceFogCode);

    if (turnsCount <= 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
    } else {
        const turnManager         = war.getTurnManager();
        const expirePlayerIndex   = turnManager.getPlayerIndexInTurn();
        const turnIndex           = turnManager.getTurnIndex();
        const expireTurnIndex     = getValueInRange({
            minValue    : turnIndex,
            maxValue    : MaxInt32,
            rawValue    : turnIndex + turnsCount
        });
        fogMap.setForceExpirePlayerIndex(expirePlayerIndex);
        fogMap.setForceExpireTurnIndex(expireTurnIndex);
    }
}
function getForceFogCode(str: string, war: IBwWar): number | null {
    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        if (result instanceof Num) {
            const code = Math.floor(result.num);
            if (checkIsValidForcedFogCode(code)) {
                return code;
            }
        }
        return null;

    } catch (Exception) {
        return null;
    }
}
function getTurnsCount(str: string, war: IBwWar): number | null {
    if (!str) {
        return 0;
    }

    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        if (result instanceof Num) {
            return Math.floor(result.num);
        } else {
            return null;
        }

    } catch (Exception) {
        return null;
    }
}
