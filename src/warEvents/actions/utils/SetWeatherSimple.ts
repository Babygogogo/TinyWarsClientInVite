import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getWeatherName, getFormattedText, getText } from "../../../lang/Utils.ts";
import type { WeaSetWeatherSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function checkIsValid(action: Undefinable<WeaSetWeatherSimple>, gameConfig: GcData): boolean {
    if (action == null) {
        return false;
    }

    const weatherType = action.getWeatherType();
    return (weatherType != null)
        && (gameConfig.checkIsValidWeatherType(weatherType))
        && (action.getWeatherTurnsCount() != null);
}

export function getBriefDesc(data: Undefinable<WeaSetWeatherSimple>, gameConfig: GcData): string | null {
    if (data == null) {
        return null;
    }

    const weatherTurnsCount = getExisted(data.getWeatherTurnsCount(), ClientErrorCode.WarEventHelper_GetDescForDeprecatedWeaSetWeather_00);
    const weatherName       = getWeatherName(getExisted(data.getWeatherType(), ClientErrorCode.WarEventHelper_GetDescForDeprecatedWeaSetWeather_01), gameConfig);
    return (weatherTurnsCount == 0)
        ? getFormattedText(TextType.F0077, weatherName)
        : getFormattedText(TextType.F0076, weatherName, weatherTurnsCount);
}
export function getDetailDesc(data: Undefinable<WeaSetWeatherSimple>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSetWeatherSimple, gameConfig: GcData): string | null {
    const weatherType = data.getWeatherType();
    if ((weatherType == null) || (!gameConfig.checkIsValidWeatherType(weatherType))) {
        return getText(TextType.A0252);
    }

    if (data.getWeatherTurnsCount() == null) {
        return getText(TextType.A0253);
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: IBwWar): Promise<void> {
    const weatherManager = war.getWeatherManager();
    weatherManager.setForceWeatherType(getExisted(action.getWeatherType()));

    const weatherTurnsCount = getExisted(action.getWeatherTurnsCount());
    if (weatherTurnsCount == 0) {
        weatherManager.setExpirePlayerIndex(null);
        weatherManager.setExpireTurnIndex(null);
    } else {
        weatherManager.setExpirePlayerIndex(war.getPlayerIndexInTurn());
        weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + weatherTurnsCount);
    }

    if (!isFast) {
        weatherManager.getView().resetView(false);
    }
}
