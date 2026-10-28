import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getWeatherName, getFormattedText, getText } from "../../../lang/Utils.ts";
import type { WeaSetWeatherSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";

export function checkIsValid(action: Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfig): boolean {
    if (action == null) {
        return false;
    }

    const weatherType = action.getWeatherType();
    return (weatherType != null)
        && (gameConfig.checkIsValidWeatherType(weatherType))
        && (action.getWeatherTurnsCount() != null);
}

export function getBriefDesc(data: Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfig): string | null {
    if (data == null) {
        return null;
    }

    const weatherTurnsCount = data.getWeatherTurnsCount();
    const weatherName       = getWeatherName(data.getWeatherType(), gameConfig);
    return (weatherTurnsCount == 0)
        ? getFormattedText(TextType.F0077, weatherName)
        : getFormattedText(TextType.F0076, weatherName, weatherTurnsCount);
}
export function getDetailDesc(data: Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSetWeatherSimple, gameConfig: GameConfig): string | null {
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
    weatherManager.setForceWeatherType(action.getWeatherType());

    const weatherTurnsCount = action.getWeatherTurnsCount();
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
