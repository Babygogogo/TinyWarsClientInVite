import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GameModesConstants from "./Constants.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as WarTypesConstants from "../warTypes/Constants.ts";

export function getGameModeIdByMpwWarSettings(warSettings: ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings.MpwWarSettings): GameModesConstants.ModeId | null {
    if (warSettings.checkHasSettingsForAtw()) {
        return GameModesConstants.ModeId.AutoTourney;
    } else if (warSettings.checkHasSettingsForCcw()) {
        return GameModesConstants.ModeId.Coop;
    } else if (warSettings.checkHasSettingsForMcw()) {
        return GameModesConstants.ModeId.Versus;
    } else if (warSettings.checkHasSettingsForMrw()) {
        return GameModesConstants.ModeId.RankedMatch;
    } else if (warSettings.checkHasSettingsForMmw()) {
        return GameModesConstants.ModeId.UnrankedMatch;
    } else if (warSettings.checkHasSettingsForMfw()) {
        return GameModesConstants.ModeId.Free;
    } else {
        return null;
    }
}
export function getGameModeIdByWarData(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): GameModesConstants.ModeId | null {
    if (warData.getSettingsForMcw()) {
        return GameModesConstants.ModeId.Versus;
    } else if (warData.getSettingsForMfw()) {
        return GameModesConstants.ModeId.Free;
    } else if (warData.getSettingsForMrw()) {
        return GameModesConstants.ModeId.RankedMatch;
    } else if (warData.getSettingsForMmw()) {
        return GameModesConstants.ModeId.UnrankedMatch;
    } else if (warData.getSettingsForAtw()) {
        return GameModesConstants.ModeId.AutoTourney;
    } else if (warData.getSettingsForScw()) {
        return GameModesConstants.ModeId.SingleCustom;
    } else if (warData.getSettingsForSfw()) {
        return GameModesConstants.ModeId.SingleSandbox;
    } else if (warData.getSettingsForCcw()) {
        return GameModesConstants.ModeId.Coop;
    } else if (warData.getSettingsForSrw()) {
        return GameModesConstants.ModeId.WarRoom;
    } else if (warData.getSettingsForCaw()) {
        return GameModesConstants.ModeId.SingleCampaign;
    } else {
        return null;
    }
}

export function getEnum(warType: WarTypesConstants.WarTypeId): GameModesConstants.ModeId | null {
    switch (warType) {
        case WarTypesConstants.WarTypeId.AtwFog      : return GameModesConstants.ModeId.AutoTourney;
        case WarTypesConstants.WarTypeId.AtwStd      : return GameModesConstants.ModeId.AutoTourney;
        case WarTypesConstants.WarTypeId.CampFog     : return GameModesConstants.ModeId.SingleCampaign;
        case WarTypesConstants.WarTypeId.CampStd     : return GameModesConstants.ModeId.SingleCampaign;
        case WarTypesConstants.WarTypeId.CcwFog      : return GameModesConstants.ModeId.Coop;
        case WarTypesConstants.WarTypeId.CcwStd      : return GameModesConstants.ModeId.Coop;
        case WarTypesConstants.WarTypeId.McwFog      : return GameModesConstants.ModeId.Versus;
        case WarTypesConstants.WarTypeId.McwStd      : return GameModesConstants.ModeId.Versus;
        case WarTypesConstants.WarTypeId.Me          : return null;
        case WarTypesConstants.WarTypeId.MfwFog      : return GameModesConstants.ModeId.Free;
        case WarTypesConstants.WarTypeId.MfwStd      : return GameModesConstants.ModeId.Free;
        case WarTypesConstants.WarTypeId.MmwFog      : return GameModesConstants.ModeId.UnrankedMatch;
        case WarTypesConstants.WarTypeId.MmwStd      : return GameModesConstants.ModeId.UnrankedMatch;
        case WarTypesConstants.WarTypeId.MrwFog      : return GameModesConstants.ModeId.RankedMatch;
        case WarTypesConstants.WarTypeId.MrwStd      : return GameModesConstants.ModeId.RankedMatch;
        case WarTypesConstants.WarTypeId.ScwFog      : return GameModesConstants.ModeId.SingleCustom;
        case WarTypesConstants.WarTypeId.ScwStd      : return GameModesConstants.ModeId.SingleCustom;
        case WarTypesConstants.WarTypeId.SfwFog      : return GameModesConstants.ModeId.SingleSandbox;
        case WarTypesConstants.WarTypeId.SfwStd      : return GameModesConstants.ModeId.SingleSandbox;
        case WarTypesConstants.WarTypeId.SrwFog      : return GameModesConstants.ModeId.WarRoom;
        case WarTypesConstants.WarTypeId.SrwStd      : return GameModesConstants.ModeId.WarRoom;
        case WarTypesConstants.WarTypeId.Test        : return null;
        case WarTypesConstants.WarTypeId.Undefined   : return null;
        default                                     : return null;
    }
}
export function getEnumArray(ruleAvailability: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability>): GameModesConstants.ModeId[] {
    const arr: GameModesConstants.ModeId[] = [];
    if (ruleAvailability) {
        if (ruleAvailability.getCanCcw()) { arr.push(GameModesConstants.ModeId.Coop); }
        if (ruleAvailability.getCanMcw()) { arr.push(GameModesConstants.ModeId.Versus); }
        if (ruleAvailability.getCanMrw()) { arr.push(GameModesConstants.ModeId.RankedMatch); }
        if (ruleAvailability.getCanSrw()) { arr.push(GameModesConstants.ModeId.WarRoom); }
    }
    return arr;
}
export function getRuleAvailability(enumArray: number[]): ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability {
    const enumSet       = new Set(enumArray);
    const availability  = new ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability();
    if (enumSet.has(GameModesConstants.ModeId.Coop))         { availability.setCanCcw(true); }
    if (enumSet.has(GameModesConstants.ModeId.Versus))       { availability.setCanMcw(true); }
    if (enumSet.has(GameModesConstants.ModeId.RankedMatch))  { availability.setCanMrw(true); }
    if (enumSet.has(GameModesConstants.ModeId.WarRoom))      { availability.setCanSrw(true); }
    return availability;
}
