import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { ModeId } from "./Constants.ts";
import type { MpwWarSettings } from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import { RuleAvailability } from "../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { WarTypeId } from "../warTypes/Constants.ts";

export function getGameModeIdByMpwWarSettings(warSettings: MpwWarSettings): ModeId | null {
    if (warSettings.checkHasSettingsForAtw()) {
        return ModeId.AutoTourney;
    } else if (warSettings.checkHasSettingsForCcw()) {
        return ModeId.Coop;
    } else if (warSettings.checkHasSettingsForMcw()) {
        return ModeId.Versus;
    } else if (warSettings.checkHasSettingsForMrw()) {
        return ModeId.RankedMatch;
    } else if (warSettings.checkHasSettingsForMmw()) {
        return ModeId.UnrankedMatch;
    } else if (warSettings.checkHasSettingsForMfw()) {
        return ModeId.Free;
    } else {
        return null;
    }
}
export function getGameModeIdByWarData(warData: SerialWar): ModeId | null {
    if (warData.getSettingsForMcw()) {
        return ModeId.Versus;
    } else if (warData.getSettingsForMfw()) {
        return ModeId.Free;
    } else if (warData.getSettingsForMrw()) {
        return ModeId.RankedMatch;
    } else if (warData.getSettingsForMmw()) {
        return ModeId.UnrankedMatch;
    } else if (warData.getSettingsForAtw()) {
        return ModeId.AutoTourney;
    } else if (warData.getSettingsForScw()) {
        return ModeId.SingleCustom;
    } else if (warData.getSettingsForSfw()) {
        return ModeId.SingleSandbox;
    } else if (warData.getSettingsForCcw()) {
        return ModeId.Coop;
    } else if (warData.getSettingsForSrw()) {
        return ModeId.WarRoom;
    } else if (warData.getSettingsForCaw()) {
        return ModeId.SingleCampaign;
    } else {
        return null;
    }
}

export function getEnum(warType: WarTypeId): ModeId | null {
    switch (warType) {
        case WarTypeId.AtwFog      : return ModeId.AutoTourney;
        case WarTypeId.AtwStd      : return ModeId.AutoTourney;
        case WarTypeId.CampFog     : return ModeId.SingleCampaign;
        case WarTypeId.CampStd     : return ModeId.SingleCampaign;
        case WarTypeId.CcwFog      : return ModeId.Coop;
        case WarTypeId.CcwStd      : return ModeId.Coop;
        case WarTypeId.McwFog      : return ModeId.Versus;
        case WarTypeId.McwStd      : return ModeId.Versus;
        case WarTypeId.Me          : return null;
        case WarTypeId.MfwFog      : return ModeId.Free;
        case WarTypeId.MfwStd      : return ModeId.Free;
        case WarTypeId.MmwFog      : return ModeId.UnrankedMatch;
        case WarTypeId.MmwStd      : return ModeId.UnrankedMatch;
        case WarTypeId.MrwFog      : return ModeId.RankedMatch;
        case WarTypeId.MrwStd      : return ModeId.RankedMatch;
        case WarTypeId.ScwFog      : return ModeId.SingleCustom;
        case WarTypeId.ScwStd      : return ModeId.SingleCustom;
        case WarTypeId.SfwFog      : return ModeId.SingleSandbox;
        case WarTypeId.SfwStd      : return ModeId.SingleSandbox;
        case WarTypeId.SrwFog      : return ModeId.WarRoom;
        case WarTypeId.SrwStd      : return ModeId.WarRoom;
        case WarTypeId.Test        : return null;
        case WarTypeId.Undefined   : return null;
        default                                     : return null;
    }
}
export function getEnumArray(ruleAvailability: Undefinable<RuleAvailability>): ModeId[] {
    const arr: ModeId[] = [];
    if (ruleAvailability) {
        if (ruleAvailability.getCanCcw()) { arr.push(ModeId.Coop); }
        if (ruleAvailability.getCanMcw()) { arr.push(ModeId.Versus); }
        if (ruleAvailability.getCanMrw()) { arr.push(ModeId.RankedMatch); }
        if (ruleAvailability.getCanSrw()) { arr.push(ModeId.WarRoom); }
    }
    return arr;
}
export function getRuleAvailability(enumArray: number[]): RuleAvailability {
    const enumSet       = new Set(enumArray);
    const availability  = new RuleAvailability();
    if (enumSet.has(ModeId.Coop))         { availability.setCanCcw(true); }
    if (enumSet.has(ModeId.Versus))       { availability.setCanMcw(true); }
    if (enumSet.has(ModeId.RankedMatch))  { availability.setCanMrw(true); }
    if (enumSet.has(ModeId.WarRoom))      { availability.setCanSrw(true); }
    return availability;
}
