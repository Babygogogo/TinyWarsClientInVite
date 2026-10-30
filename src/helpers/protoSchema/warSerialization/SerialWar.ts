import {
    WarTypes_Constants,
} from "../../../internal.ts";
import type { SerialWar } from "../../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export function getNormalMapId(warData: SerialWar): number | null {
    const settings = warData.getSettingsForMcw()
        ?? warData.getSettingsForMrw()
        ?? warData.getSettingsForMmw()
        ?? warData.getSettingsForAtw()
        ?? warData.getSettingsForScw()
        ?? warData.getSettingsForCcw()
        ?? warData.getSettingsForSrw();
    return settings ? settings.getNormalMapId() : null;
}

export function getWarTypeId(warData: SerialWar): WarTypes_Constants.WarTypeId {
    const instanceWarRule = warData.getSettingsForCommon()?.getInstanceWarRule();
    if (instanceWarRule == null) {
        return WarTypes_Constants.WarTypeId.Undefined;
    }

    const hasFog = !!instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
    if (warData.getSettingsForMcw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.McwFog : WarTypes_Constants.WarTypeId.McwStd;
    } else if (warData.getSettingsForMfw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd;
    } else if (warData.getSettingsForMrw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd;
    } else if (warData.getSettingsForMmw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MmwFog : WarTypes_Constants.WarTypeId.MmwStd;
    } else if (warData.getSettingsForAtw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.AtwFog : WarTypes_Constants.WarTypeId.AtwStd;
    } else if (warData.getSettingsForScw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.ScwFog : WarTypes_Constants.WarTypeId.ScwStd;
    } else if (warData.getSettingsForSfw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.SfwFog : WarTypes_Constants.WarTypeId.SfwStd;
    } else if (warData.getSettingsForCcw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd;
    } else if (warData.getSettingsForSrw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.SrwFog : WarTypes_Constants.WarTypeId.SrwStd;
    } else if (warData.getSettingsForCaw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.CampFog : WarTypes_Constants.WarTypeId.CampStd;
    } else {
        return WarTypes_Constants.WarTypeId.Undefined;
    }
}
