import {
    PlayerRules_Constants,
    Cos_Constants,
    Helpers_Collection,
    ForceSkins_Utils,
    Utils_ClientErrorCode,
    Players_Constants,
    Teams_Constants,
    WarTypes_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import { PlayerRule } from "../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { RuleAvailability } from "../proto/schema/CommonProto/WarRule/RuleAvailability.ts";

export function createDefaultPlayerRule(playerIndex: number, gcData: GameConfigs_GameConfig.GameConfig): PlayerRule {
    return PlayerRule.fromJson({
        playerIndex                 : playerIndex,
        teamIndex                   : playerIndex,
        bannedCoCategoryIdArray     : [],
        bannedUnitTypeArray         : [],
        initialFund                 : PlayerRules_Constants.InitialFund.Default,
        incomeMultiplier            : PlayerRules_Constants.IncomeMultiplier.Default,
        maxUnitsCount               : null,
        energyAddPctOnCoBoard       : PlayerRules_Constants.EnergyAddPctOnCoBoard.Default,
        energyLossPctOnCoDie        : PlayerRules_Constants.EnergyLossPctOnCoDie.Default,
        energyGrowthMultiplier      : PlayerRules_Constants.EnergyGrowthMultiplier.Default,
        canActivateCoSkill          : true,
        canCoBoard                  : true,
        canUnitJoin                 : true,
        moveRangeModifier           : PlayerRules_Constants.MoveRangeModifier.Default,
        unitVisionRangeModifier     : PlayerRules_Constants.UnitVisionRangeModifier.Default,
        tileVisionRangeModifier     : PlayerRules_Constants.TileVisionRangeModifier.Default,
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
        attackPowerModifier         : PlayerRules_Constants.AttackPowerModifier.Default,
        defenseModifier             : PlayerRules_Constants.DefenseModifier.Default,
        luckLowerLimit              : PlayerRules_Constants.Luck.DefaultLowerLimit,
        luckUpperLimit              : gcData.getSystemCfg().getDefaultLuckUpperLimit(),
    });
}
export function createDefaultPlayerRuleList(playersCountUnneutral: number, gcData: GameConfigs_GameConfig.GameConfig): PlayerRule[] {
    const playerRuleDataList: PlayerRule[] = [];
    for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        playerRuleDataList.push(createDefaultPlayerRule(playerIndex, gcData));
    }
    return playerRuleDataList;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode({ playerRule, gameConfig, playersCountUnneutral, isCampaignMap }: {
    playerRule              : PlayerRule;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    isCampaignMap           : boolean;
}): Utils_ClientErrorCode.ClientErrorCode {
    {
        const playerIndex = playerRule.getPlayerIndex();
        if ((playerIndex == null)                                   ||
            (playerIndex <  Players_Constants.PlayerIndex.First)  ||
            (playerIndex >  playersCountUnneutral)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_01;
        }
    }

    {
        const teamIndex = playerRule.getTeamIndex();
        if ((teamIndex == null)                                 ||
            (teamIndex <  Teams_Constants.TeamIndex.First)    ||
            (teamIndex >  playersCountUnneutral)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_02;
        }
    }

    {
        const initialFund = playerRule.getInitialFund();
        if ((initialFund == null)                                           ||
            (initialFund > PlayerRules_Constants.InitialFund.MaxLimit)    ||
            (initialFund < PlayerRules_Constants.InitialFund.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_03;
        }
    }

    {
        const incomeMultiplier = playerRule.getIncomeMultiplier();
        if ((incomeMultiplier == null)                                              ||
            (incomeMultiplier > PlayerRules_Constants.IncomeMultiplier.MaxLimit)  ||
            (incomeMultiplier < PlayerRules_Constants.IncomeMultiplier.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_04;
        }
    }

    {
        const energyAddPctOnCoBoard = playerRule.getEnergyAddPctOnCoBoard();
        if ((energyAddPctOnCoBoard > PlayerRules_Constants.EnergyAddPctOnCoBoard.MaxLimit)    ||
            (energyAddPctOnCoBoard < PlayerRules_Constants.EnergyAddPctOnCoBoard.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_05;
        }
    }

    {
        const energyGrowthMultiplier = playerRule.getEnergyGrowthMultiplier();
        if ((energyGrowthMultiplier == null)                                                    ||
            (energyGrowthMultiplier > PlayerRules_Constants.EnergyGrowthMultiplier.MaxLimit)  ||
            (energyGrowthMultiplier < PlayerRules_Constants.EnergyGrowthMultiplier.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_06;
        }
    }

    {
        const moveRangeModifier = playerRule.getMoveRangeModifier();
        if ((moveRangeModifier == null)                                                 ||
            (moveRangeModifier > PlayerRules_Constants.MoveRangeModifier.MaxLimit)    ||
            (moveRangeModifier < PlayerRules_Constants.MoveRangeModifier.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_07;
        }
    }

    {
        const energyLossPctOnCoDie = playerRule.getEnergyLossPctOnCoDie();
        if ((energyLossPctOnCoDie > PlayerRules_Constants.EnergyLossPctOnCoDie.MaxLimit)   ||
            (energyLossPctOnCoDie < PlayerRules_Constants.EnergyLossPctOnCoDie.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_08;
        }
    }

    {
        const unitVisionRangeModifier = playerRule.getUnitVisionRangeModifier();
        if ((unitVisionRangeModifier == null)                                                       ||
            (unitVisionRangeModifier > PlayerRules_Constants.UnitVisionRangeModifier.MaxLimit)    ||
            (unitVisionRangeModifier < PlayerRules_Constants.UnitVisionRangeModifier.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_09;
        }
    }

    {
        const tileVisionRangeModifier = playerRule.getTileVisionRangeModifier();
        if ((tileVisionRangeModifier > PlayerRules_Constants.TileVisionRangeModifier.MaxLimit)    ||
            (tileVisionRangeModifier < PlayerRules_Constants.TileVisionRangeModifier.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_10;
        }
    }

    {
        const luckLowerLimit = playerRule.getLuckLowerLimit();
        if ((luckLowerLimit == null)                                    ||
            (luckLowerLimit > PlayerRules_Constants.Luck.MaxLimit)    ||
            (luckLowerLimit < PlayerRules_Constants.Luck.MinLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_11;
        }

        const luckUpperLimit = playerRule.getLuckUpperLimit();
        if ((luckUpperLimit == null)                                    ||
            (luckUpperLimit > PlayerRules_Constants.Luck.MaxLimit)    ||
            (luckUpperLimit < PlayerRules_Constants.Luck.MinLimit)    ||
            (luckUpperLimit < luckLowerLimit)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_12;
        }
    }

    {
        const bannedCoCategoryIdArray = playerRule.getBannedCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(bannedCoCategoryIdArray)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_13;
        }
    }

    {
        const bannedUnitTypeArray = playerRule.getBannedUnitTypeArray();
        if (!gameConfig.checkIsValidUnitTypeSubset(bannedUnitTypeArray)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_14;
        }
    }

    {
        const srwAiCoId = playerRule.getSrwAiCoId();
        if (srwAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(srwAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === Cos_Constants.CategoryId.Random)
            ) {
                return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_15;
            }
        }
    }

    {
        const ccwAiCoId = playerRule.getCcwAiCoId();
        if (ccwAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(ccwAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === Cos_Constants.CategoryId.Random)
            ) {
                return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_16;
            }
        }
    }

    {
        const arr = playerRule.getSrwHumanCoCategoryIdArray();
        if ((arr.includes(Cos_Constants.CategoryId.Random))   ||
            (!gameConfig.checkIsValidCoCategoryIdSubset(arr))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_17;
        }
    }

    {
        const arr = playerRule.getMcwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_18;
        }
    }

    {
        const arr = playerRule.getCcwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_19;
        }
    }

    {
        const arr = playerRule.getMmwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_20;
        }
    }

    {
        const arr = playerRule.getMrwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_21;
        }
    }

    {
        const arr = playerRule.getAtwHumanCoCategoryIdArray();
        if (!gameConfig.checkIsValidCoCategoryIdSubset(arr)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_22;
        }
    }

    {
        const arr = playerRule.getCampaignHumanCoIdArray();
        if ((!gameConfig.checkIsValidCoIdSubset(arr))                                                       ||
            (arr.some(v => gameConfig.getCoBasicCfg(v)?.getCoCategoryId() === Cos_Constants.CategoryId.Random))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_23;
        }
    }

    {
        const campaignAiCoId = playerRule.getCampaignAiCoId();
        if (campaignAiCoId != null) {
            const cfg = gameConfig.getCoBasicCfg(campaignAiCoId);
            if ((cfg == null)                                           ||
                (cfg.getCoCategoryId() === Cos_Constants.CategoryId.Random)
            ) {
                return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_24;
            }
        }
    }

    {
        const skinId = playerRule.getCampaignSkinId();
        if ((skinId != null)                                                &&
            (!ForceSkins_Utils.checkIsValidSkinId(skinId, false))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_25;
        }
    }

    if (isCampaignMap) {
        {
            if (playerRule.getCampaignAiCoId() == null) {
                if (!playerRule.getCampaignHumanCoIdArray().length) {
                    return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_26;
                }
            } else {
                // if (campaignHumanCoIdArray.length) {
                //     return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_18;
                // }
            }
        }

        if (playerRule.getCampaignSkinId() == null) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_27;
        }
    }

    {
        const maxUnitsCount = playerRule.getMaxUnitsCount();
        if ((maxUnitsCount != null)                                              &&
            ((maxUnitsCount > PlayerRules_Constants.MaxUnitsCount.MaxLimit)    ||
             (maxUnitsCount < PlayerRules_Constants.MaxUnitsCount.MinLimit))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_28;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function getErrorCodeForPlayerRuleList({ playerRuleList, gameConfig, playersCountUnneutral, ruleAvailability, isCampaignMap }: {
    playerRuleList          : PlayerRule[];
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    ruleAvailability        : RuleAvailability | null;
    isCampaignMap           : boolean;
}): Utils_ClientErrorCode.ClientErrorCode {
    if ((playerRuleList == null) || (playerRuleList.length !== playersCountUnneutral)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_00;
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
            if (errorCode !== Utils_ClientErrorCode.ClientErrorCode.NoError) {
                return errorCode;
            }
        }

        const playerIndex = data.getPlayerIndex();
        if ((playerIndex == null)                                   ||
            (allPlayerIndexSet.has(playerIndex))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_01;
        }

        const teamIndex = data.getTeamIndex();
        if (teamIndex == null) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_02;
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
                    return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_20;
                }

                campaignAllSkinIdSet.add(skinId);
            }
        }
    }

    if (allPlayerIndexSet.size !== playersCountUnneutral) {
        return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_21;
    }
    if (allTeamIndexSet.size <= 1) {
        return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_22;
    }

    if (canSrw) {
        if (!srwAiTeamIndexSet.size) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_23;
        }
        if (srwHumanTeamIndexSet.size !== 1) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_24;
        }
    }

    if (canCcw) {
        if (!ccwAiPlayerIndexSet.size) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_25;
        }
        if (ccwHumanPlayerIndexSet.size <= 1) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_26;
        }
    }

    if (isCampaignMap) {
        if (!campaignAiTeamIndexSet.size) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_27;
        }
        if (campaignHumanTeamIndexSet.size !== 1) {
            return Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_28;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
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

    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getBannedCoCategoryIdArray()),
        new Set(playerRule2.getBannedCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getBannedUnitTypeArray()),
        new Set(playerRule2.getBannedUnitTypeArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getSrwHumanCoCategoryIdArray()),
        new Set(playerRule2.getSrwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getMcwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMcwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getCcwHumanCoCategoryIdArray()),
        new Set(playerRule2.getCcwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getMmwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMmwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getMrwHumanCoCategoryIdArray()),
        new Set(playerRule2.getMrwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
        new Set(playerRule1.getAtwHumanCoCategoryIdArray()),
        new Set(playerRule2.getAtwHumanCoCategoryIdArray())
    )) {
        return false;
    }
    if (!Helpers_Collection.checkIsSameSet(
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
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.ScwFog : WarTypes_Constants.WarTypeId.ScwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalSrwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
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
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.SrwFog : WarTypes_Constants.WarTypeId.SrwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalSfwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.SfwFog : WarTypes_Constants.WarTypeId.SfwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMfwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault : boolean;
    includeRandom   : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : null,
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMcwHumanCoIdSet({ playerRule, gameConfiguration, hasFogByDefault, includeRandom }: {
    playerRule          : PlayerRule;
    gameConfiguration   : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault     : boolean;
    includeRandom       : boolean;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : null,
        specifiedCoCategoryIdArray  : playerRule.getMcwHumanCoCategoryIdArray(),
        gcData                      : gameConfiguration,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.McwFog : WarTypes_Constants.WarTypeId.McwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalCcwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom }: {
    playerRule      : PlayerRule;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
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
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMmwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getMmwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.MmwFog : WarTypes_Constants.WarTypeId.MmwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalMrwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getMrwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd,
        includeRandom               : includeRandom,
    });
}

export function getFinalAtwHumanCoIdSet({ playerRule, gameConfig, hasFogByDefault, includeRandom, bannedCoCategoryIdSetByBp }: {
    playerRule                  : PlayerRule;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    hasFogByDefault             : boolean;
    includeRandom               : boolean;
    bannedCoCategoryIdSetByBp   : Set<number>;
}): Set<number> {
    return getFinalHumanCoIdSet({
        ruleBannedCoCategoryIdArray : playerRule.getBannedCoCategoryIdArray(),
        bpBannedCoCategoryIdSet     : bannedCoCategoryIdSetByBp,
        specifiedCoCategoryIdArray  : playerRule.getAtwHumanCoCategoryIdArray(),
        gcData                      : gameConfig,
        warType                     : hasFogByDefault ? WarTypes_Constants.WarTypeId.AtwFog : WarTypes_Constants.WarTypeId.AtwStd,
        includeRandom               : includeRandom,
    });
}

function getFinalHumanCoIdSet({ ruleBannedCoCategoryIdArray, bpBannedCoCategoryIdSet, specifiedCoCategoryIdArray, gcData, warType, includeRandom }: {
    ruleBannedCoCategoryIdArray : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
    bpBannedCoCategoryIdSet     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<Set<number>>;
    specifiedCoCategoryIdArray  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
    gcData                      : GameConfigs_GameConfig.GameConfig;
    warType                     : WarTypes_Constants.WarTypeId;
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
                && ((includeRandom) || (categoryId !== Cos_Constants.CategoryId.Random));
        }).map(v => v.getCoId()));
        return coIdSet.size > 0 ? coIdSet : new Set([Cos_Constants.CoId.Empty]);

    } else {
        const coIdSet = new Set(cfgEnabledCoCfgArray.filter(v => {
            const categoryId = v.getCoCategoryId();
            return (specifiedCoCategoryIdSet.has(categoryId))
                && (!bannedCoCategoryIdSet.has(categoryId))
                && ((includeRandom) || (categoryId !== Cos_Constants.CategoryId.Random));
        }).map(v => v.getCoId()));
        return coIdSet.size > 0 ? coIdSet : new Set([Cos_Constants.CoId.Empty]);
    }
}
