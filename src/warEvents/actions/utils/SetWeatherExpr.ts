import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Weather } from "../../../expressionParsers/contexts/Weather.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { newError } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type {
    WeaSetWeatherExpr as ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { ExpressionInfoDict } from "../constants/SetWeatherExpr.ts";

type WeaSetWeatherExpr  = ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr;

export function checkIsValid(action: Undefinable<WeaSetWeatherExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getWeatherType(),
            expressionInfo          : ExpressionInfoDict.WeatherType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getWeatherTurnsCount(),
            expressionInfo          : ExpressionInfoDict.WeatherTurnsCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetWeatherExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(
        TextType.F0012,
        data.getWeatherType() ?? UndefinedError,
        data.getWeatherTurnsCount() ?? UndefinedError,
    );
}
export function getDetailDesc(data: Undefinable<WeaSetWeatherExpr>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetWeatherExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.WeatherType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getWeatherType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.WeatherTurnsCount;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getWeatherTurnsCount(),
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
export async function applyWithExtraData(action: WeaSetWeatherExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetWeatherExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const weatherManager = war.getWeatherManager();
    try {
        const context           = new Weather(weatherManager);
        const rawWeatherType    = Parser.getParseResult(action.getWeatherType() ?? ``).eval(context, false);
        if (!(rawWeatherType instanceof Num)) {
            throw newError(`Invalid rawWeatherType.`, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_00);
        }

        const weatherType = Math.floor(rawWeatherType.num);
        if (!war.getGcData().checkIsValidWeatherType(weatherType)) {
            throw newError(`Invalid rawWeatherType: ${weatherType}.`, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
        }

        const rawTurnsCount = Parser.getParseResult(action.getWeatherTurnsCount() ?? ``).eval(context, false);
        if (!(rawTurnsCount instanceof Num)) {
            throw newError(`Invalid rawTurnsCount.`, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_02);
        }

        const turnsCount = Math.floor(rawTurnsCount.num);
        if (!isFinite(turnsCount)) {
            throw newError(`Invalid turnsCount: ${turnsCount}.`, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_03);
        }

        weatherManager.setForceWeatherType(weatherType);
        if (turnsCount <= 0) {
            weatherManager.setExpirePlayerIndex(null);
            weatherManager.setExpireTurnIndex(null);
        } else {
            const turnManager = war.getTurnManager();
            weatherManager.setExpirePlayerIndex(turnManager.getPlayerIndexInTurn());
            weatherManager.setExpireTurnIndex(getValueInRange({
                minValue: 0,
                maxValue: MaxInt32,
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
