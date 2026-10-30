import {
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecWeatherAndFog } from "../../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecWeatherAndFog>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0947);
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecWeatherAndFog>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if (weatherTypeArray?.length) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0224,
                weatherTypeArray.map(v => Lang_Utils.getWeatherName(v, gameConfig)).join(` ${Lang_Utils.getText(Lang_Constants.TextType.Or)} `),
            )}`);
        }
    }
    {
        const hasFogCurrently = data.getHasFogCurrently();
        if (hasFogCurrently != null) {
            subTextArray.push(`- ${Lang_Utils.getText(hasFogCurrently ? Lang_Constants.TextType.A0949 : Lang_Constants.TextType.A0950)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    return [
        Lang_Utils.getText(Lang_Constants.TextType.A0948),
        ...subTextArray,
    ].join(`\n`);
}
export function getErrorTip(data: WecWeatherAndFog, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    const gameConfig = war.getGcData();
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if ((weatherTypeArray?.length) && (weatherTypeArray.some(v => !gameConfig.checkIsValidWeatherType(v)))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Weather));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecWeatherAndFog>, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    if (condition == null) {
        return false;
    }

    if (condition.getWeatherTypeArray()?.some(v => !gameConfig.checkIsValidWeatherType(v))) {
        return false;
    }

    return true;
}

export function checkIsMeet(condition: WecWeatherAndFog, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const weatherTypeArray  = condition.getWeatherTypeArray();
    if ((weatherTypeArray?.length) && (weatherTypeArray.indexOf(war.getWeatherManager().getCurrentWeatherType()) < 0)) {
        return false;
    }

    const hasFogCurrently = condition.getHasFogCurrently();
    if ((hasFogCurrently != null) && (war.getFogMap().checkHasFogCurrently() != hasFogCurrently)) {
        return false;
    }

    return true;
}
