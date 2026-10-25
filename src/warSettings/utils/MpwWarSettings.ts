import type { MpwWarSettings } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

type MpwWarSettingsSchema = MpwWarSettings;

export function getNormalMapIdForMpwWarSettings(warSettings: MpwWarSettingsSchema): number | null {
    const settings = warSettings.getSettingsForAtw()
        ?? warSettings.getSettingsForCcw()
        ?? warSettings.getSettingsForMcw()
        ?? warSettings.getSettingsForMmw()
        ?? warSettings.getSettingsForMrw();
    return settings ? settings.getNormalMapId() ?? 0 : null;
}

export function getWarTypeByMpwWarSettings(warInfo: MpwWarSettingsSchema): WarTypeId {
    const instanceWarRule   = warInfo.getSettingsForCommon()?.getInstanceWarRule();
    const hasFog            = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault();
    if (hasFog == null) {
        return WarTypeId.Undefined;
    }

    if (warInfo.getSettingsForMcw()) {
        return hasFog ? WarTypeId.McwFog : WarTypeId.McwStd;
    } else if (warInfo.getSettingsForMfw()) {
        return hasFog ? WarTypeId.MfwFog : WarTypeId.MfwStd;
    } else if (warInfo.getSettingsForMrw()) {
        return hasFog ? WarTypeId.MrwFog : WarTypeId.MrwStd;
    } else if (warInfo.getSettingsForMmw()) {
        return hasFog ? WarTypeId.MmwFog : WarTypeId.MmwStd;
    } else if (warInfo.getSettingsForAtw()) {
        return hasFog ? WarTypeId.AtwFog : WarTypeId.AtwStd;
    } else if (warInfo.getSettingsForCcw()) {
        return hasFog ? WarTypeId.CcwFog : WarTypeId.CcwStd;
    } else {
        return WarTypeId.Undefined;
    }
}
