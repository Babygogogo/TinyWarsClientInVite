import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetWeatherSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type WeaSetWeatherSimple    = ProtoSchemaCommonProtoWarEventWeaSetWeatherSimple.WeaSetWeatherSimple;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigGcData.GcData): boolean {
    if (action == null) {
        return false;
    }

    const weatherType = action.getWeatherType();
    return (weatherType != null)
        && (gameConfig.checkIsValidWeatherType(weatherType))
        && (action.getWeatherTurnsCount() != null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    }

    const weatherTurnsCount = HelpersMisc.getExisted(data.getWeatherTurnsCount(), UtilsClientErrorCode.ClientErrorCode.WarEventHelper_GetDescForDeprecatedWeaSetWeather_00);
    const weatherName       = LangUtils.getWeatherName(HelpersMisc.getExisted(data.getWeatherType(), UtilsClientErrorCode.ClientErrorCode.WarEventHelper_GetDescForDeprecatedWeaSetWeather_01), gameConfig);
    return (weatherTurnsCount == 0)
        ? LangUtils.getFormattedText(LangConstants.TextType.F0077, weatherName)
        : LangUtils.getFormattedText(LangConstants.TextType.F0076, weatherName, weatherTurnsCount);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetWeatherSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSetWeatherSimple, gameConfig: GameConfigGcData.GcData): string | null {
    const weatherType = data.getWeatherType();
    if ((weatherType == null) || (!gameConfig.checkIsValidWeatherType(weatherType))) {
        return LangUtils.getText(LangConstants.TextType.A0252);
    }

    if (data.getWeatherTurnsCount() == null) {
        return LangUtils.getText(LangConstants.TextType.A0253);
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetWeatherSimple, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const weatherManager = war.getWeatherManager();
    weatherManager.setForceWeatherType(HelpersMisc.getExisted(action.getWeatherType()));

    const weatherTurnsCount = HelpersMisc.getExisted(action.getWeatherTurnsCount());
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
