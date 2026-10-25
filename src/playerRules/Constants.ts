import { PlayerIndex } from "../players/Constants.ts";
import { PlayerRule } from "../proto/schema/CommonProto/WarRule/PlayerRule.ts";

// eslint-disable-next-line no-shadow
export const enum RuleTypeId {
    TeamIndex,
    BannedCoCategoryIdArray,
    BannedUnitTypeArray,
    CanActivateCoSkill,
    CanCoBoard,
    CanUnitJoin,
    InitialFund,
    IncomeMultiplier,
    MaxUnitsCount,
    EnergyAddPctOnCoBoard,
    EnergyLossPctOnCoDie,
    EnergyGrowthMultiplier,
    MoveRangeModifier,
    AttackPowerModifier,
    DefenseModifier,
    UnitVisionRangeModifier,
    TileVisionRangeModifier,
    LuckLowerLimit,
    LuckUpperLimit,

    CcwAiCoId,
    WarRoomAiCoId,
    WarRoomHumanCoCategoryIdArray,
    McwHumanCoCategoryIdArray,
    CcwHumanCoCategoryIdArray,
    MmwHumanCoCategoryIdArray,
    MrwHumanCoCategoryIdArray,
    AtwHumanCoCategoryIdArray,

    CampaignAiCoId,
    CampaignHumanCoIdArray,
    CampaignSkinId,
}

// eslint-disable-next-line no-shadow
export const enum AttackPowerModifier {
    Default         = 0,
    MinLimit        = -999999999,
    MaxLimit        = 999999999,
}

// eslint-disable-next-line no-shadow
export const enum DefenseModifier {
    Default         = 0,
    MinLimit        = -999999999,
    MaxLimit        = 999999999,
}

// eslint-disable-next-line no-shadow
export const enum BannedUnitTypeConst {
    DefaultCount    = 0,
}

// eslint-disable-next-line no-shadow
export const enum TileVisionRangeModifier {
    MinLimit   = -2147483648,   // GameConfig.GcMisc.Number.MinInt32,
    MaxLimit   = 2147483647,    // GameConfig.GcMisc.Number.MaxInt32,
    Default    = 0,
}

// eslint-disable-next-line no-shadow
export const enum EnergyGrowthMultiplier {
    MinLimit        = 0,
    MaxLimit        = 10000,
    Default         = 100,
}

// eslint-disable-next-line no-shadow
export const enum IncomeMultiplier {
    MinLimit        = 0,
    MaxLimit        = 10000,
    Default         = 100,
}

// eslint-disable-next-line no-shadow
export const enum EnergyAddPctOnCoBoard {
    MinLimit        = 0,
    MaxLimit        = 100,
    Default         = 0,
}

// eslint-disable-next-line no-shadow
export const enum EnergyLossPctOnCoDie {
    MinLimit        = 0,
    MaxLimit        = 100000000,
    Default         = 100,
}

// eslint-disable-next-line no-shadow
export const enum InitialFund {
    MinLimit        = 0,
    MaxLimit        = 1000000,
    Default         = 0,
}

// eslint-disable-next-line no-shadow
export const enum Luck {
    MinLimit            = -100,
    MaxLimit            = 100,
    DefaultLowerLimit   = 0,
}

// eslint-disable-next-line no-shadow
export const enum MoveRangeModifier {
    MinLimit            = -10,
    MaxLimit            = 10,
    Default             = 0,
}

// eslint-disable-next-line no-shadow
export const enum UnitVisionRangeModifier {
    MinLimit            = -10,
    MaxLimit            = 10,
    Default             = 0,
}

// eslint-disable-next-line no-shadow
export const enum MaxUnitsCount {
    MinLimit        = 0,
    MaxLimit        = 10000,
}

export const NeutralPlayerRule = PlayerRule.fromJson({
    playerIndex                 : PlayerIndex.Neutral,
    teamIndex                   : 0,
    bannedCoCategoryIdArray     : [],
    bannedUnitTypeArray         : [],
    initialFund                 : 0,
    incomeMultiplier            : 100,
    maxUnitsCount               : null,
    energyAddPctOnCoBoard       : EnergyAddPctOnCoBoard.Default,
    energyLossPctOnCoDie        : EnergyLossPctOnCoDie.Default,
    energyGrowthMultiplier      : 100,
    canActivateCoSkill          : true,
    canCoBoard                  : true,
    canUnitJoin                 : true,
    moveRangeModifier           : 0,
    unitVisionRangeModifier     : 0,
    tileVisionRangeModifier     : 0,
    mcwHumanCoCategoryIdArray   : [],
    mmwHumanCoCategoryIdArray   : [],
    mrwHumanCoCategoryIdArray   : [],
    atwHumanCoCategoryIdArray   : [],
    ccwHumanCoCategoryIdArray   : [],
    srwHumanCoCategoryIdArray   : [],
    campaignHumanCoIdArray      : [],
    ccwAiCoId                   : null,
    srwAiCoId                   : null,
    campaignAiCoId              : null,
    campaignSkinId              : null,
    attackPowerModifier         : AttackPowerModifier.Default,
    defenseModifier             : DefenseModifier.Default,
    luckLowerLimit              : 0,
    luckUpperLimit              : 0,
});
