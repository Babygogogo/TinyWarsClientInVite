import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsWar from "../../../expressionParsers/contexts/War.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as FogMapsUtils from "../../../fogMaps/Utils.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";
import * as WarEventsActionsConstantsSetForceFogCodeExpr from "../constants/SetForceFogCodeExpr.ts";

type WeaSetForceFogCodeExpr = ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr.WeaSetForceFogCodeExpr;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getForceFogCode(),
            expressionInfo          : WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getTurnsCount(),
            expressionInfo          : WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0047, data.getForceFogCode() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getTurnsCount() ? `${WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount.getTitleText()}: ${data.getTurnsCount()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0047, data.getForceFogCode() ?? LangConstants.UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetForceFogCodeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getForceFogCode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getTurnsCount(),
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
export async function applyWithExtraData(_action: WeaSetForceFogCodeExpr): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaSetForceFogCodeExpr, _isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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
        const expireTurnIndex     = NumbersUtils.getValueInRange({
            minValue    : turnIndex,
            maxValue    : NumbersConstants.MaxInt32,
            rawValue    : turnIndex + turnsCount
        });
        fogMap.setForceExpirePlayerIndex(expirePlayerIndex);
        fogMap.setForceExpireTurnIndex(expireTurnIndex);
    }
}
function getForceFogCode(str: string, war: BaseWarInterfaceIBwWar.IBwWar): number | null {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        if (result instanceof ExpressionParsersResultsNum.Num) {
            const code = Math.floor(result.num);
            if (FogMapsUtils.checkIsValidForcedFogCode(code)) {
                return code;
            }
        }
        return null;

    } catch (Exception) {
        return null;
    }
}
function getTurnsCount(str: string, war: BaseWarInterfaceIBwWar.IBwWar): number | null {
    if (!str) {
        return 0;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        if (result instanceof ExpressionParsersResultsNum.Num) {
            return Math.floor(result.num);
        } else {
            return null;
        }

    } catch (Exception) {
        return null;
    }
}
