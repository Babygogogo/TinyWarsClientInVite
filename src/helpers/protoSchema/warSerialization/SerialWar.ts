import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as WarTypesConstants from "../../../warTypes/Constants.ts";

type SerialWarSchema    = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

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

export function getWarTypeId(warData: SerialWarSchema): WarTypesConstants.WarTypeId {
    const instanceWarRule = warData.getSettingsForCommon()?.getInstanceWarRule();
    if (instanceWarRule == null) {
        return WarTypesConstants.WarTypeId.Undefined;
    }

    const hasFog = !!instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
    if (warData.getSettingsForMcw()) {
        return hasFog ? WarTypesConstants.WarTypeId.McwFog : WarTypesConstants.WarTypeId.McwStd;
    } else if (warData.getSettingsForMfw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MfwFog : WarTypesConstants.WarTypeId.MfwStd;
    } else if (warData.getSettingsForMrw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MrwFog : WarTypesConstants.WarTypeId.MrwStd;
    } else if (warData.getSettingsForMmw()) {
        return hasFog ? WarTypesConstants.WarTypeId.MmwFog : WarTypesConstants.WarTypeId.MmwStd;
    } else if (warData.getSettingsForAtw()) {
        return hasFog ? WarTypesConstants.WarTypeId.AtwFog : WarTypesConstants.WarTypeId.AtwStd;
    } else if (warData.getSettingsForScw()) {
        return hasFog ? WarTypesConstants.WarTypeId.ScwFog : WarTypesConstants.WarTypeId.ScwStd;
    } else if (warData.getSettingsForSfw()) {
        return hasFog ? WarTypesConstants.WarTypeId.SfwFog : WarTypesConstants.WarTypeId.SfwStd;
    } else if (warData.getSettingsForCcw()) {
        return hasFog ? WarTypesConstants.WarTypeId.CcwFog : WarTypesConstants.WarTypeId.CcwStd;
    } else if (warData.getSettingsForSrw()) {
        return hasFog ? WarTypesConstants.WarTypeId.SrwFog : WarTypesConstants.WarTypeId.SrwStd;
    } else if (warData.getSettingsForCaw()) {
        return hasFog ? WarTypesConstants.WarTypeId.CampFog : WarTypesConstants.WarTypeId.CampStd;
    } else {
        return WarTypesConstants.WarTypeId.Undefined;
    }
}
