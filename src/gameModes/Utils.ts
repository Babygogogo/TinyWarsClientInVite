import {
    GameModes_Constants,
    WarTypes_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { MpwWarSettings } from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import { RuleAvailability } from "../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export function getGameModeIdByMpwWarSettings(warSettings: MpwWarSettings): GameModes_Constants.ModeId | null {
    if (warSettings.checkHasSettingsForAtw()) {
        return GameModes_Constants.ModeId.AutoTourney;
    } else if (warSettings.checkHasSettingsForCcw()) {
        return GameModes_Constants.ModeId.Coop;
    } else if (warSettings.checkHasSettingsForMcw()) {
        return GameModes_Constants.ModeId.Versus;
    } else if (warSettings.checkHasSettingsForMrw()) {
        return GameModes_Constants.ModeId.RankedMatch;
    } else if (warSettings.checkHasSettingsForMmw()) {
        return GameModes_Constants.ModeId.UnrankedMatch;
    } else if (warSettings.checkHasSettingsForMfw()) {
        return GameModes_Constants.ModeId.Free;
    } else {
        return null;
    }
}
export function getGameModeIdByWarData(warData: SerialWar): GameModes_Constants.ModeId | null {
    if (warData.getSettingsForMcw()) {
        return GameModes_Constants.ModeId.Versus;
    } else if (warData.getSettingsForMfw()) {
        return GameModes_Constants.ModeId.Free;
    } else if (warData.getSettingsForMrw()) {
        return GameModes_Constants.ModeId.RankedMatch;
    } else if (warData.getSettingsForMmw()) {
        return GameModes_Constants.ModeId.UnrankedMatch;
    } else if (warData.getSettingsForAtw()) {
        return GameModes_Constants.ModeId.AutoTourney;
    } else if (warData.getSettingsForScw()) {
        return GameModes_Constants.ModeId.SingleCustom;
    } else if (warData.getSettingsForSfw()) {
        return GameModes_Constants.ModeId.SingleSandbox;
    } else if (warData.getSettingsForCcw()) {
        return GameModes_Constants.ModeId.Coop;
    } else if (warData.getSettingsForSrw()) {
        return GameModes_Constants.ModeId.WarRoom;
    } else if (warData.getSettingsForCaw()) {
        return GameModes_Constants.ModeId.SingleCampaign;
    } else {
        return null;
    }
}

export function getEnum(warType: WarTypes_Constants.WarTypeId): GameModes_Constants.ModeId | null {
    switch (warType) {
        case WarTypes_Constants.WarTypeId.AtwFog      : return GameModes_Constants.ModeId.AutoTourney;
        case WarTypes_Constants.WarTypeId.AtwStd      : return GameModes_Constants.ModeId.AutoTourney;
        case WarTypes_Constants.WarTypeId.CampFog     : return GameModes_Constants.ModeId.SingleCampaign;
        case WarTypes_Constants.WarTypeId.CampStd     : return GameModes_Constants.ModeId.SingleCampaign;
        case WarTypes_Constants.WarTypeId.CcwFog      : return GameModes_Constants.ModeId.Coop;
        case WarTypes_Constants.WarTypeId.CcwStd      : return GameModes_Constants.ModeId.Coop;
        case WarTypes_Constants.WarTypeId.McwFog      : return GameModes_Constants.ModeId.Versus;
        case WarTypes_Constants.WarTypeId.McwStd      : return GameModes_Constants.ModeId.Versus;
        case WarTypes_Constants.WarTypeId.Me          : return null;
        case WarTypes_Constants.WarTypeId.MfwFog      : return GameModes_Constants.ModeId.Free;
        case WarTypes_Constants.WarTypeId.MfwStd      : return GameModes_Constants.ModeId.Free;
        case WarTypes_Constants.WarTypeId.MmwFog      : return GameModes_Constants.ModeId.UnrankedMatch;
        case WarTypes_Constants.WarTypeId.MmwStd      : return GameModes_Constants.ModeId.UnrankedMatch;
        case WarTypes_Constants.WarTypeId.MrwFog      : return GameModes_Constants.ModeId.RankedMatch;
        case WarTypes_Constants.WarTypeId.MrwStd      : return GameModes_Constants.ModeId.RankedMatch;
        case WarTypes_Constants.WarTypeId.ScwFog      : return GameModes_Constants.ModeId.SingleCustom;
        case WarTypes_Constants.WarTypeId.ScwStd      : return GameModes_Constants.ModeId.SingleCustom;
        case WarTypes_Constants.WarTypeId.SfwFog      : return GameModes_Constants.ModeId.SingleSandbox;
        case WarTypes_Constants.WarTypeId.SfwStd      : return GameModes_Constants.ModeId.SingleSandbox;
        case WarTypes_Constants.WarTypeId.SrwFog      : return GameModes_Constants.ModeId.WarRoom;
        case WarTypes_Constants.WarTypeId.SrwStd      : return GameModes_Constants.ModeId.WarRoom;
        case WarTypes_Constants.WarTypeId.Test        : return null;
        case WarTypes_Constants.WarTypeId.Undefined   : return null;
        default                                     : return null;
    }
}
export function getEnumArray(ruleAvailability: AuxiliaryTypes_AuxiliaryTypes.Undefinable<RuleAvailability>): GameModes_Constants.ModeId[] {
    const arr: GameModes_Constants.ModeId[] = [];
    if (ruleAvailability) {
        if (ruleAvailability.getCanCcw()) { arr.push(GameModes_Constants.ModeId.Coop); }
        if (ruleAvailability.getCanMcw()) { arr.push(GameModes_Constants.ModeId.Versus); }
        if (ruleAvailability.getCanMrw()) { arr.push(GameModes_Constants.ModeId.RankedMatch); }
        if (ruleAvailability.getCanSrw()) { arr.push(GameModes_Constants.ModeId.WarRoom); }
    }
    return arr;
}
export function getRuleAvailability(enumArray: number[]): RuleAvailability {
    const enumSet       = new Set(enumArray);
    const availability  = new RuleAvailability();
    if (enumSet.has(GameModes_Constants.ModeId.Coop))         { availability.setCanCcw(true); }
    if (enumSet.has(GameModes_Constants.ModeId.Versus))       { availability.setCanMcw(true); }
    if (enumSet.has(GameModes_Constants.ModeId.RankedMatch))  { availability.setCanMrw(true); }
    if (enumSet.has(GameModes_Constants.ModeId.WarRoom))      { availability.setCanSrw(true); }
    return availability;
}
