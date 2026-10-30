import {
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetWeatherSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    if (action == null) {
        return false;
    }

    const weatherType = action.getWeatherType();
    return (weatherType != null)
        && (gameConfig.checkIsValidWeatherType(weatherType))
        && (action.getWeatherTurnsCount() != null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (data == null) {
        return null;
    }

    const weatherTurnsCount = data.getWeatherTurnsCount();
    const weatherName       = Lang_Utils.getWeatherName(data.getWeatherType(), gameConfig);
    return (weatherTurnsCount == 0)
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0077, weatherName)
        : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0076, weatherName, weatherTurnsCount);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSetWeatherSimple, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    const weatherType = data.getWeatherType();
    if ((weatherType == null) || (!gameConfig.checkIsValidWeatherType(weatherType))) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0252);
    }

    if (data.getWeatherTurnsCount() == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0253);
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
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
