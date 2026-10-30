import {
    WarTypes_Constants,
} from "../../internal.ts";
import type { MpwWarSettings } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";

export function getNormalMapIdForMpwWarSettings(warSettings: MpwWarSettings): number | null {
    const settings = warSettings.getSettingsForAtw()
        ?? warSettings.getSettingsForCcw()
        ?? warSettings.getSettingsForMcw()
        ?? warSettings.getSettingsForMmw()
        ?? warSettings.getSettingsForMrw();
    return settings ? settings.getNormalMapId() : null;
}

export function getWarTypeByMpwWarSettings(warInfo: MpwWarSettings): WarTypes_Constants.WarTypeId {
    const instanceWarRule   = warInfo.getSettingsForCommon()?.getInstanceWarRule();
    const hasFog            = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault();
    if (hasFog == null) {
        return WarTypes_Constants.WarTypeId.Undefined;
    }

    if (warInfo.getSettingsForMcw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.McwFog : WarTypes_Constants.WarTypeId.McwStd;
    } else if (warInfo.getSettingsForMfw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd;
    } else if (warInfo.getSettingsForMrw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd;
    } else if (warInfo.getSettingsForMmw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.MmwFog : WarTypes_Constants.WarTypeId.MmwStd;
    } else if (warInfo.getSettingsForAtw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.AtwFog : WarTypes_Constants.WarTypeId.AtwStd;
    } else if (warInfo.getSettingsForCcw()) {
        return hasFog ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd;
    } else {
        return WarTypes_Constants.WarTypeId.Undefined;
    }
}
