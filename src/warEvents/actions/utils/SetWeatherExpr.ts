import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsWeather from "../../../expressionParsers/contexts/Weather.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarEventsActionsConstantsSetWeatherExpr from "../constants/SetWeatherExpr.ts";

type WeaSetWeatherExpr  = ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr.WeaSetWeatherExpr;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getWeatherType(),
            expressionInfo          : WarEventsActionsConstantsSetWeatherExpr.ExpressionInfoDict.WeatherType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getWeatherTurnsCount(),
            expressionInfo          : WarEventsActionsConstantsSetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0012,
        data.getWeatherType() ?? LangConstants.UndefinedError,
        data.getWeatherTurnsCount() ?? LangConstants.UndefinedError,
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherExpr>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetWeatherExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetWeatherExpr.ExpressionInfoDict.WeatherType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getWeatherType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getWeatherTurnsCount(),
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
export async function applyWithExtraData(action: WeaSetWeatherExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetWeatherExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const weatherManager = war.getWeatherManager();
    try {
        const context           = new ExpressionParsersContextsWeather.Weather(weatherManager);
        const rawWeatherType    = ExpressionParsersParser.Parser.getParseResult(action.getWeatherType() ?? ``).eval(context, false);
        if (!(rawWeatherType instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid rawWeatherType.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_00);
        }

        const weatherType = Math.floor(rawWeatherType.num);
        if (!war.getGcData().checkIsValidWeatherType(weatherType)) {
            throw HelpersMisc.newError(`Invalid rawWeatherType: ${weatherType}.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
        }

        const rawTurnsCount = ExpressionParsersParser.Parser.getParseResult(action.getWeatherTurnsCount() ?? ``).eval(context, false);
        if (!(rawTurnsCount instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid rawTurnsCount.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_02);
        }

        const turnsCount = Math.floor(rawTurnsCount.num);
        if (!isFinite(turnsCount)) {
            throw HelpersMisc.newError(`Invalid turnsCount: ${turnsCount}.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_03);
        }

        weatherManager.setForceWeatherType(weatherType);
        if (turnsCount <= 0) {
            weatherManager.setExpirePlayerIndex(null);
            weatherManager.setExpireTurnIndex(null);
        } else {
            const turnManager = war.getTurnManager();
            weatherManager.setExpirePlayerIndex(turnManager.getPlayerIndexInTurn());
            weatherManager.setExpireTurnIndex(NumbersUtils.getValueInRange({
                minValue: 0,
                maxValue: NumbersConstants.MaxInt32,
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
