import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type MpwWarSettingsSchema = ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings.MpwWarSettings;

export function getNormalMapIdForMpwWarSettings(warSettings: MpwWarSettingsSchema): number | null {
    const settings = warSettings.getSettingsForAtw()
        ?? warSettings.getSettingsForCcw()
        ?? warSettings.getSettingsForMcw()
        ?? warSettings.getSettingsForMmw()
        ?? warSettings.getSettingsForMrw();
    return settings ? settings.getNormalMapId() ?? 0 : null;
}

export function getWarTypeByMpwWarSettings(warInfo: MpwWarSettingsSchema): WarTypesConstants.WarTypeId {
    const instanceWarRule   = warInfo.getSettingsForCommon()?.getInstanceWarRule();
    const hasFog            = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault();
    if (hasFog == null) {
        return WarTypesConstants.WarTypeId.Undefined;
    }

    if (warInfo.getSettingsForMcw()) {
        return hasFog ? WarTypesConstants.WarTypeId.McwFog : WarTypesConstants.WarTypeId.McwStd;
    } else if (warInfo.getSettingsForMfw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MfwFog : WarTypesConstants.WarTypeId.MfwStd;
    } else if (warInfo.getSettingsForMrw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MrwFog : WarTypesConstants.WarTypeId.MrwStd;
    } else if (warInfo.getSettingsForMmw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MmwFog : WarTypesConstants.WarTypeId.MmwStd;
    } else if (warInfo.getSettingsForAtw()) {
        return hasFog ? WarTypesConstants.WarTypeId.AtwFog : WarTypesConstants.WarTypeId.AtwStd;
    } else if (warInfo.getSettingsForCcw()) {
        return hasFog ? WarTypesConstants.WarTypeId.CcwFog : WarTypesConstants.WarTypeId.CcwStd;
    } else {
        return WarTypesConstants.WarTypeId.Undefined;
    }
}
