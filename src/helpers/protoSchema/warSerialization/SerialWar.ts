import type { SerialWar } from "../../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { WarTypeId } from "../../../warTypes/Constants.ts";

type SerialWarSchema    = SerialWar;

export function getNormalMapId(warData: SerialWarSchema): number | null {
    const settings = warData.getSettingsForMcw()
        ?? warData.getSettingsForMrw()
        ?? warData.getSettingsForMmw()
        ?? warData.getSettingsForAtw()
        ?? warData.getSettingsForScw()
        ?? warData.getSettingsForCcw()
        ?? warData.getSettingsForSrw();
    return settings ? settings.getNormalMapId() ?? 0 : null;
}

export function getWarTypeId(warData: SerialWarSchema): WarTypeId {
    const instanceWarRule = warData.getSettingsForCommon()?.getInstanceWarRule();
    if (instanceWarRule == null) {
        return WarTypeId.Undefined;
    }

    const hasFog = !!instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
    if (warData.getSettingsForMcw()) {
        return hasFog ? WarTypeId.McwFog : WarTypeId.McwStd;
    } else if (warData.getSettingsForMfw()) {
        return hasFog ? WarTypeId.MfwFog : WarTypeId.MfwStd;
    } else if (warData.getSettingsForMrw()) {
        return hasFog ? WarTypeId.MrwFog : WarTypeId.MrwStd;
    } else if (warData.getSettingsForMmw()) {
        return hasFog ? WarTypeId.MmwFog : WarTypeId.MmwStd;
    } else if (warData.getSettingsForAtw()) {
        return hasFog ? WarTypeId.AtwFog : WarTypeId.AtwStd;
    } else if (warData.getSettingsForScw()) {
        return hasFog ? WarTypeId.ScwFog : WarTypeId.ScwStd;
    } else if (warData.getSettingsForSfw()) {
        return hasFog ? WarTypeId.SfwFog : WarTypeId.SfwStd;
    } else if (warData.getSettingsForCcw()) {
        return hasFog ? WarTypeId.CcwFog : WarTypeId.CcwStd;
    } else if (warData.getSettingsForSrw()) {
        return hasFog ? WarTypeId.SrwFog : WarTypeId.SrwStd;
    } else if (warData.getSettingsForCaw()) {
        return hasFog ? WarTypeId.CampFog : WarTypeId.CampStd;
    } else {
        return WarTypeId.Undefined;
    }
}
