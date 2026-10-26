import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText, getWeatherName } from "../../../lang/Utils.ts";
import type { WecWeatherAndFog } from "../../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";

export function getBriefDesc(data: Undefinable<WecWeatherAndFog>): string | null {
    if (data == null) {
        return null;
    }

    return getText(TextType.A0947);
}
export function getDetailedDesc(data: Undefinable<WecWeatherAndFog>, gameConfig: GcData): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if (weatherTypeArray?.length) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0224,
                weatherTypeArray.map(v => getWeatherName(v, gameConfig)).join(` ${getText(TextType.Or)} `)
            )}`);
        }
    }
    {
        const hasFogCurrently = data.getHasFogCurrently();
        if (hasFogCurrently != null) {
            subTextArray.push(`- ${getText(hasFogCurrently ? TextType.A0949 : TextType.A0950)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(getText(TextType.A0944));
    }

    return [
        getText(TextType.A0948),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecWeatherAndFog, war: IBwWar): string | null {
    const gameConfig = war.getGcData();
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if ((weatherTypeArray?.length) && (weatherTypeArray.some(v => !gameConfig.checkIsValidWeatherType(v)))) {
            return getFormattedText(TextType.F0091, getText(TextType.Weather));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecWeatherAndFog>, gameConfig: GcData): boolean {
    if (condition == null) {
        return false;
    }

    if (condition.getWeatherTypeArray()?.some(v => !gameConfig.checkIsValidWeatherType(v))) {
        return false;
    }

    return true;
}

export function checkIsMeet(condition: WecWeatherAndFog, war: IBwWar): boolean {
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
