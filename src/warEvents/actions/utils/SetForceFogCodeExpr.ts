import {
    FogMaps_Utils,
    WarEvents_Actions_Constants_SetForceFogCodeExpr,
    Lang_Utils,
    Numbers_Utils,
    Numbers_Constants,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetForceFogCodeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getForceFogCode(),
            expressionInfo          : WarEvents_Actions_Constants_SetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getTurnsCount(),
            expressionInfo          : WarEvents_Actions_Constants_SetForceFogCodeExpr.ExpressionInfoDict.TurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0047, data.getForceFogCode() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getTurnsCount() ? `${WarEvents_Actions_Constants_SetForceFogCodeExpr.ExpressionInfoDict.TurnsCount.getTitleText()}: ${data.getTurnsCount()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0047, data.getForceFogCode() ?? Lang_Constants.UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetForceFogCodeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getForceFogCode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetForceFogCodeExpr.ExpressionInfoDict.TurnsCount;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getTurnsCount(),
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
export async function applyWithExtraData(_action: WeaSetForceFogCodeExpr): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetForceFogCodeExpr, _isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
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
        const expireTurnIndex     = Numbers_Utils.getValueInRange({
            minValue    : turnIndex,
            maxValue    : Numbers_Constants.MaxInt32,
            rawValue    : turnIndex + turnsCount
        });
        fogMap.setForceExpirePlayerIndex(expirePlayerIndex);
        fogMap.setForceExpireTurnIndex(expireTurnIndex);
    }
}
function getForceFogCode(str: string, war: BaseWar_Interface_IBwWar.IBwWar): number | null {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        if (result instanceof ExpressionParsers_Results_Num.Num) {
            const code = Math.floor(result.num);
            if (FogMaps_Utils.checkIsValidForcedFogCode(code)) {
                return code;
            }
        }
        return null;

    } catch (Exception) {
        return null;
    }
}
function getTurnsCount(str: string, war: BaseWar_Interface_IBwWar.IBwWar): number | null {
    if (!str) {
        return 0;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        if (result instanceof ExpressionParsers_Results_Num.Num) {
            return Math.floor(result.num);
        } else {
            return null;
        }

    } catch (Exception) {
        return null;
    }
}
