import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWecWeatherAndFog from "../../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";

type WecWeatherAndFog   = ProtoSchemaCommonProtoWarEventWecWeatherAndFog.WecWeatherAndFog;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecWeatherAndFog>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getText(LangConstants.TextType.A0947);
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecWeatherAndFog>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if (weatherTypeArray?.length) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0224,
                weatherTypeArray.map(v => LangUtils.getWeatherName(v, gameConfig)).join(` ${LangUtils.getText(LangConstants.TextType.Or)} `)
            )}`);
        }
    }
    {
        const hasFogCurrently = data.getHasFogCurrently();
        if (hasFogCurrently != null) {
            subTextArray.push(`- ${LangUtils.getText(hasFogCurrently ? LangConstants.TextType.A0949 : LangConstants.TextType.A0950)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    return [
        LangUtils.getText(LangConstants.TextType.A0948),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecWeatherAndFog, war: BaseWarInterfaceIBwWar.IBwWar): string | null {
    const gameConfig = war.getGcData();
    {
        const weatherTypeArray = data.getWeatherTypeArray();
        if ((weatherTypeArray?.length) && (weatherTypeArray.some(v => !gameConfig.checkIsValidWeatherType(v)))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Weather));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecWeatherAndFog>, gameConfig: GameConfigGcData.GcData): boolean {
    if (condition == null) {
        return false;
    }

    if (condition.getWeatherTypeArray()?.some(v => !gameConfig.checkIsValidWeatherType(v))) {
        return false;
    }

    return true;
}

export function checkIsMeet(condition: WecWeatherAndFog, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
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
