import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { CategoryId, CoId } from "../cos/Constants.ts";
import { checkIsValidSkinId } from "../forceSkins/Utils.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import { checkIsSameSet } from "../helpers/Collection.ts";
import {
    InitialFund,
    IncomeMultiplier,
    EnergyAddPctOnCoBoard,
    EnergyLossPctOnCoDie,
    EnergyGrowthMultiplier,
    MoveRangeModifier,
    UnitVisionRangeModifier,
    TileVisionRangeModifier,
    AttackPowerModifier,
    DefenseModifier,
    Luck,
    MaxUnitsCount,
} from "./Constants.ts";
import { PlayerIndex } from "../players/Constants.ts";
import { PlayerRule } from "../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { RuleAvailability } from "../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import { TeamIndex } from "../teams/Constants.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { WarTypeId } from "../warTypes/Constants.ts";

export function createDefaultPlayerRule(playerIndex: number, gcData: GcData): PlayerRule {
    return PlayerRule.fromJson({
        playerIndex                 : playerIndex,
        teamIndex                   : playerIndex,
        bannedCoCategoryIdArray     : [],
        bannedUnitTypeArray         : [],
        initialFund                 : InitialFund.Default,
        incomeMultiplier            : IncomeMultiplier.Default,
        maxUnitsCount               : null,
        energyAddPctOnCoBoard       : EnergyAddPctOnCoBoard.Default,
        energyLossPctOnCoDie        : EnergyLossPctOnCoDie.Default,
        energyGrowthMultiplier      : EnergyGrowthMultiplier.Default,
        canActivateCoSkill          : true,
        canCoBoard                  : true,
        canUnitJoin                 : true,
        moveRangeModifier           : MoveRangeModifier.Default,
        unitVisionRangeModifier     : UnitVisionRangeModifier.Default,
        tileVisionRangeModifier     : TileVisionRangeModifier.Default,
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
        luckLowerLimit              : Luck.DefaultLowerLimit,
        luckUpperLimit              : gcData.getSystemCfg().getDefaultLuckUpperLimit(),
    });
}
export function createDefaultPlayerRuleList(playersCountUnneutral: number, gcData: GcData): PlayerRule[] {
    const playerRuleDataList: PlayerRule[] = [];
    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        playerRuleDataList.push(createDefaultPlayerRule(playerIndex, gcData));
    }
    return playerRuleDataList;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode({ playerRule, gameConfig, playersCountUnneutral, isCampaignMap }: {
    playerRule              : PlayerRule;
    gameConfig              : GcData;
    playersCountUnneutral   : number;
    isCampaignMap           : boolean;
}): ClientErrorCode {
    {
        const playerIndex = playerRule.getPlayerIndex();
        if ((playerIndex == null)                                   ||
            (playerIndex <  PlayerIndex.First)  ||
            (playerIndex >  playersCountUnneutral)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_01;
        }
    }

    {
        const teamIndex = playerRule.getTeamIndex();
        if ((teamIndex == null)                                 ||
            (teamIndex <  TeamIndex.First)    ||
            (teamIndex >  playersCountUnneutral)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_02;
        }
    }

    {
        const initialFund = playerRule.getInitialFund();
        if ((initialFund == null)                                           ||
            (initialFund > InitialFund.MaxLimit)    ||
            (initialFund < InitialFund.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_03;
        }
    }

    {
        const incomeMultiplier = playerRule.getIncomeMultiplier();
        if ((incomeMultiplier == null)                                              ||
            (incomeMultiplier > IncomeMultiplier.MaxLimit)  ||
            (incomeMultiplier < IncomeMultiplier.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_04;
        }
    }

    {
        const energyAddPctOnCoBoard = playerRule.getEnergyAddPctOnCoBoard() ?? 0;
        if ((energyAddPctOnCoBoard > EnergyAddPctOnCoBoard.MaxLimit)    ||
            (energyAddPctOnCoBoard < EnergyAddPctOnCoBoard.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_05;
        }
    }

    {
        const energyGrowthMultiplier = playerRule.getEnergyGrowthMultiplier();
        if ((energyGrowthMultiplier == null)                                                    ||
            (energyGrowthMultiplier > EnergyGrowthMultiplier.MaxLimit)  ||
            (energyGrowthMultiplier < EnergyGrowthMultiplier.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_06;
        }
    }

    {
        const moveRangeModifier = playerRule.getMoveRangeModifier();
        if ((moveRangeModifier == null)                                                 ||
            (moveRangeModifier > MoveRangeModifier.MaxLimit)    ||
            (moveRangeModifier < MoveRangeModifier.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_07;
        }
    }

    {
        const energyLossPctOnCoDie = playerRule.getEnergyLossPctOnCoDie();
        if ((energyLossPctOnCoDie > EnergyLossPctOnCoDie.MaxLimit)   ||
            (energyLossPctOnCoDie < EnergyLossPctOnCoDie.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_08;
        }
    }

    {
        const unitVisionRangeModifier = playerRule.getUnitVisionRangeModifier();
        if ((unitVisionRangeModifier == null)                                                       ||
            (unitVisionRangeModifier > UnitVisionRangeModifier.MaxLimit)    ||
            (unitVisionRangeModifier < UnitVisionRangeModifier.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_09;
        }
    }

    {
        const tileVisionRangeModifier = playerRule.getTileVisionRangeModifier() ?? 0;
        if ((tileVisionRangeModifier > TileVisionRangeModifier.MaxLimit)    ||
            (tileVisionRangeModifier < TileVisionRangeModifier.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_10;
        }
    }

    {
        const luckLowerLimit = playerRule.getLuckLowerLimit();
        if ((luckLowerLimit == null)                                    ||
            (luckLowerLimit > Luck.MaxLimit)    ||
            (luckLowerLimit < Luck.MinLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_11;
        }

        const luckUpperLimit = playerRule.getLuckUpperLimit();
        if ((luckUpperLimit == null)                                    ||
            (luckUpperLimit > Luck.MaxLimit)    ||
            (luckUpperLimit < Luck.MinLimit)    ||
            (luckUpperLimit < luckLowerLimit)
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_12;
        }
    }

    {
        const bannedCoCategoryIdArray = playerRule.getBannedCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(bannedCoCategoryIdArray)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_13;
        }
    }

    {
        const bannedUnitTypeArray = playerRule.getBannedUnitTypeArray();
        if (!gameConfig.checkIsValidUnitTypeSubset(bannedUnitTypeArray)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_14;
        }
    }

    {
        const srwAiCoId = playerRule.getSrwAiCoId();
        if (srwAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(srwAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === CategoryId.Random)
            ) {
                return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_15;
            }
        }
    }

    {
        const ccwAiCoId = playerRule.getCcwAiCoId();
        if (ccwAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(ccwAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === CategoryId.Random)
            ) {
                return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_16;
            }
        }
    }

    {
        const arr = playerRule.getSrwHumanCoCategoryIdArray();
        if ((arr.includes(CategoryId.Random))   ||
            (!gameConfig.checkIsValidCoCategoryIdSubset(arr))
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_17;
        }
    }

    {
        const arr = playerRule.getMcwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_18;
        }
    }

    {
        const arr = playerRule.getCcwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_19;
        }
    }

    {
        const arr = playerRule.getMmwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_20;
        }
    }

    {
        const arr = playerRule.getMrwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_21;
        }
    }

    {
        const arr = playerRule.getAtwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_22;
        }
    }

    {
        const arr = playerRule.getCampaignHumanCoIdArray();
        if ((!gameConfig.checkIsValidCoIdSubset(arr))                                                       ||
            (arr.some(v => gameConfig.getCoBasicCfg(v)?.getCoCategoryId() === CategoryId.Random))
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_23;
        }
    }

    {
        const campaignAiCoId = playerRule.getCampaignAiCoId();
        if (campaignAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(campaignAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === CategoryId.Random)
            ) {
                return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_24;
            }
        }
    }

    {
        const skinId = playerRule.getCampaignSkinId();
        if ((skinId != null)                                                &&
            (!checkIsValidSkinId(skinId, false))
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_25;
        }
    }

    if (isCampaignMap) {
        {
            if (playerRule.getCampaignAiCoId() == null) {
                if (!playerRule.getCampaignHumanCoIdArray().length) {
                    return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_26;
                }
            } else {
                // if (campaignHumanCoIdArray.length) {
                //     return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_18;
                // }
            }
        }

        if (playerRule.getCampaignSkinId() == null) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_27;
        }
    }

    {
        const maxUnitsCount = playerRule.getMaxUnitsCount();
        if ((maxUnitsCount != null)                                              &&
            ((maxUnitsCount > MaxUnitsCount.MaxLimit)    ||
             (maxUnitsCount < MaxUnitsCount.MinLimit))
        ) {
            return ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_28;
        }
    }

    return ClientErrorCode.NoError;
}

export function getErrorCodeForPlayerRuleList({ playerRuleList, gameConfig, playersCountUnneutral, ruleAvailability, isCampaignMap }: {
    playerRuleList          : PlayerRule[];
    gameConfig              : GcData;
    playersCountUnneutral   : number;
    ruleAvailability        : RuleAvailability | null;
    isCampaignMap           : boolean;
}): ClientErrorCode {
    if ((playerRuleList == null) || (playerRuleList.length !== playersCountUnneutral)) {
        return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_00;
    }

    const canSrw                    = ruleAvailability?.getCanSrw();
    const canCcw                    = ruleAvailability?.getCanCcw();
    const allPlayerIndexSet         = new Set<number>();
    const allTeamIndexSet           = new Set<number>();
    const srwHumanTeamIndexSet      = new Set<number>();
    const srwAiTeamIndexSet         = new Set<number>();
    const ccwHumanPlayerIndexSet    = new Set<number>();
    const ccwAiPlayerIndexSet       = new Set<number>();
    const campaignAllSkinIdSet      = new Set<number>();
    const campaignHumanTeamIndexSet = new Set<number>();
    const campaignAiTeamIndexSet    = new Set<number>();

    for (const data of playerRuleList) {
        {
            const errorCode = getErrorCode({
                playerRule              : data,
                gameConfig              : gameConfig,
                playersCountUnneutral   : playersCountUnneutral,
                isCampaignMap           : isCampaignMap,
            });
            if (errorCode !== ClientErrorCode.NoError) {
                return errorCode;
            }
        }

        const playerIndex = data.getPlayerIndex();
        if ((playerIndex == null)                                   ||
            (allPlayerIndexSet.has(playerIndex))
        ) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_01;
        }

        const teamIndex = data.getTeamIndex();
        if (teamIndex == null) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_02;
        }

        allPlayerIndexSet.add(playerIndex);
        allTeamIndexSet.add(teamIndex);

        {
            const srwAiCoId = data.getSrwAiCoId();
            if (srwAiCoId == null) {
                if (canSrw) {
                    srwHumanTeamIndexSet.add(teamIndex);
                }
            } else {
                srwAiTeamIndexSet.add(teamIndex);
            }
        }

        {
            const ccwAiCoId = data.getCcwAiCoId();
            if (ccwAiCoId == null) {
                if (canCcw) {
                    ccwHumanPlayerIndexSet.add(playerIndex);
                }
            } else {
                ccwAiPlayerIndexSet.add(playerIndex);
            }
        }

        if (isCampaignMap) {
            {
                const campaignAiCoId = data.getCampaignAiCoId();
                if (campaignAiCoId == null) {
                    campaignHumanTeamIndexSet.add(teamIndex);
                } else {
                    campaignAiTeamIndexSet.add(teamIndex);
                }
            }

            {
                const skinId = data.getCampaignSkinId();
                if ((skinId == null)                                                ||
                    (campaignAllSkinIdSet.has(skinId))
                ) {
                    return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_20;
                }

                campaignAllSkinIdSet.add(skinId);
            }
        }
    }

    if (allPlayerIndexSet.size !== playersCountUnneutral) {
        return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_21;
    }
    if (allTeamIndexSet.size <= 1) {
        return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_22;
    }

    if (canSrw) {
        if (!srwAiTeamIndexSet.size) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_23;
        }
        if (srwHumanTeamIndexSet.size !== 1) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_24;
        }
    }

    if (canCcw) {
        if (!ccwAiPlayerIndexSet.size) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_25;
        }
        if (ccwHumanPlayerIndexSet.size <= 1) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_26;
        }
    }

    if (isCampaignMap) {
        if (!campaignAiTeamIndexSet.size) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_27;
        }
        if (campaignHumanTeamIndexSet.size !== 1) {
            return ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_28;
        }
    }

    return ClientErrorCode.NoError;
}

export function checkIsSame(playerRule1: PlayerRule, playerRule2: PlayerRule): boolean {
    if (
        (playerRule1.getPlayerIndex()               != playerRule2.getPlayerIndex())                ||
        (playerRule1.getTeamIndex()                 != playerRule2.getTeamIndex())                  ||
        (playerRule1.getCanActivateCoSkill()        != playerRule2.getCanActivateCoSkill())         ||
        (playerRule1.getCanCoBoard()                != playerRule2.getCanCoBoard())                 ||
        (playerRule1.getCanUnitJoin()               != playerRule2.getCanUnitJoin())                ||
        (playerRule1.getInitialFund()               != playerRule2.getInitialFund())                ||
        (playerRule1.getIncomeMultiplier()          != playerRule2.getIncomeMultiplier())           ||
        (playerRule1.getMaxUnitsCount()             != playerRule2.getMaxUnitsCount())              ||
        (playerRule1.getEnergyAddPctOnCoBoard()     != playerRule2.getEnergyAddPctOnCoBoard())      ||
        (playerRule1.getEnergyLossPctOnCoDie()      != playerRule2.getEnergyLossPctOnCoDie())       ||
        (playerRule1.getEnergyGrowthMultiplier()    != playerRule2.getEnergyGrowthMultiplier())     ||
        (playerRule1.getMoveRangeModifier()         != playerRule2.getMoveRangeModifier())          ||
        (playerRule1.getUnitVisionRangeModifier()   != playerRule2.getUnitVisionRangeModifier())    ||
        (playerRule1.getTileVisionRangeModifier()   != playerRule2.getTileVisionRangeModifier())    ||
        (playerRule1.getCcwAiCoId()                 != playerRule2.getCcwAiCoId())                  ||
        (playerRule1.getSrwAiCoId()                 != playerRule2.getSrwAiCoId())                  ||
        (playerRule1.getCampaignAiCoId()            != playerRule2.getCampaignAiCoId())             ||
        (playerRule1.getCampaignSkinId()            != playerRule2.getCampaignSkinId())             ||
        (playerRule1.getAttackPowerModifier()       != playerRule2.getAttackPowerModifier())        ||
        (playerRule1.getDefenseModifier()           != playerRule2.getDefenseModifier())            ||
        (playerRule1.getLuckLowerLimit()            != playerRule2.getLuckLowerLimit())             ||
        (playerRule1.getLuckUpperLimit()            != playerRule2.getLuckUpperLimit())
    ) {
        return false;
    }

    if (!checkIsSameSet(
        new Set(playerRule1.getBannedCoCategoryIdArray()),
        new Set(playerRule2.getBannedCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getBannedUnitTypeArray()),
        new Set(playerRule2.getBannedUnitTypeArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getSrwHumanCoCategoryIdArray()),
        new Set(playerRule2.getSrwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getMcwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMcwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getCcwHumanCoCategoryIdArray()),
        new Set(playerRule2.getCcwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getMmwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMmwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getMrwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMrwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getAtwHumanCoCategoryIdArray()),
        new Set(playerRule2.getAtwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!checkIsSameSet(
        new Set(playerRule1.getCampaignHumanCoIdArray()),
        new Set(playerRule2.getCampaignHumanCoIdArray())
    )) {
        return false;
    }

    return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getFinalScwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GcData;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.ScwFog : WarTypeId.ScwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalSrwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GcData;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    if (playerRule.getSrwAiCoId() != null) {
        return new Set();
    }

    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : playerRule.getSrwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.SrwFog : WarTypeId.SrwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalSfwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GcData;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.SfwFog : WarTypeId.SfwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMfwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GcData;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.MfwFog : WarTypeId.MfwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMcwHumanCoIdSet({ playerRule, gameConfiguration, hasFogByDefault, includeRandom }: {
    playerRule          : PlayerRule;
    gameConfiguration   : GcData;
    hasFogByDefault     : boolean;
    includeRandom       : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : playerRule.getMcwHumanCoCategoryIdArray(),
        gcData                      : gameConfiguration,
        warType                     : hasFogByDefault ? WarTypeId.McwFog : WarTypeId.McwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalCcwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GcData;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    if (playerRule.getCcwAiCoId() != null) {
        return new Set();
    }

    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : playerRule.getCcwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.CcwFog : WarTypeId.CcwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMmwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GcData;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getMmwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.MmwFog : WarTypeId.MmwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMrwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GcData;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getMrwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.MrwFog : WarTypeId.MrwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalAtwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GcData;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getAtwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypeId.AtwFog : WarTypeId.AtwStd,
        includeRandom               : includeRandom,
    });
}

function getFinalHumanCoIdSet({ ruleBannedCoCategoryIdArray, bpBannedCoCategoryIdSet, specifiedCoCategoryIdArray, gcData, warType, includeRandom }: {
    ruleBannedCoCategoryIdArray : Undefinable<number[]>;
    bpBannedCoCategoryIdSet     : Undefinable<Set<number>>;
    specifiedCoCategoryIdArray  : Undefinable<number[]>;
    gcData                      : GcData;
    warType                     : WarTypeId;
    includeRandom               : boolean;
}): Set<number> {
    const cfgEnabledCoCfgArray      = gcData.getEnabledCoArray(warType);
    const specifiedCoCategoryIdSet  = new Set(specifiedCoCategoryIdArray);
    const bannedCoCategoryIdSet     = new Set(bpBannedCoCategoryIdSet);

    if (specifiedCoCategoryIdSet.size === 0) {
        for (const categoryId of ruleBannedCoCategoryIdArray ?? []) {
            bannedCoCategoryIdSet.add(categoryId);
        }

        const coIdSet = new Set(cfgEnabledCoCfgArray.filter(v => {
            const categoryId = v.getCoCategoryId();
            return (!bannedCoCategoryIdSet.has(categoryId))
                && ((includeRandom) || (categoryId !== CategoryId.Random));
        }).map(v => v.getCoId()));
        return coIdSet.size > 0 ? coIdSet : new Set([CoId.Empty]);

    } else {
        const coIdSet = new Set(cfgEnabledCoCfgArray.filter(v => {
            const categoryId = v.getCoCategoryId();
            return (specifiedCoCategoryIdSet.has(categoryId))
                && (!bannedCoCategoryIdSet.has(categoryId))
                && ((includeRandom) || (categoryId !== CategoryId.Random));
        }).map(v => v.getCoId()));
        return coIdSet.size > 0 ? coIdSet : new Set([CoId.Empty]);
    }
}
