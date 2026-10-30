import {
    Utils_ClientErrorCode,
    WarEvents_Actions_Constants_SetWeatherExpr,
    Lang_Utils,
    Numbers_Utils,
    Numbers_Constants,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Weather,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetWeatherExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getWeatherType(),
            expressionInfo          : WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getWeatherTurnsCount(),
            expressionInfo          : WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0012,
        data.getWeatherType() ?? Lang_Constants.UndefinedError,
        data.getWeatherTurnsCount() ?? Lang_Constants.UndefinedError,
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherExpr>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetWeatherExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getWeatherType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getWeatherTurnsCount(),
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
export async function applyWithExtraData(action: WeaSetWeatherExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetWeatherExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const weatherManager = war.getWeatherManager();
    try {
        const context           = new ExpressionParsers_Contexts_Weather.Weather(weatherManager);
        const rawWeatherType    = ExpressionParsers_Parser.Parser.getParseResult(action.getWeatherType() ?? ``).eval(context, false);
        if (!(rawWeatherType instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid rawWeatherType.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_00);
        }

        const weatherType = Math.floor(rawWeatherType.num);
        if (!war.getGcData().checkIsValidWeatherType(weatherType)) {
            throw Helpers_Misc.newError(`Invalid rawWeatherType: ${weatherType}.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
        }

        const rawTurnsCount = ExpressionParsers_Parser.Parser.getParseResult(action.getWeatherTurnsCount() ?? ``).eval(context, false);
        if (!(rawTurnsCount instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid rawTurnsCount.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_02);
        }

        const turnsCount = Math.floor(rawTurnsCount.num);
        if (!isFinite(turnsCount)) {
            throw Helpers_Misc.newError(`Invalid turnsCount: ${turnsCount}.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_03);
        }

        weatherManager.setForceWeatherType(weatherType);
        if (turnsCount <= 0) {
            weatherManager.setExpirePlayerIndex(null);
            weatherManager.setExpireTurnIndex(null);
        } else {
            const turnManager = war.getTurnManager();
            weatherManager.setExpirePlayerIndex(turnManager.getPlayerIndexInTurn());
            weatherManager.setExpireTurnIndex(Numbers_Utils.getValueInRange({
                minValue: 0,
                maxValue: Numbers_Constants.MaxInt32,
                rawValue: turnsCount + turnManager.getTurnIndex()
            }));
        }

        if (!isFast) {
            weatherManager.getView().resetView(false);
        }

    } catch {
        // ignored
    }
}
