import {
    WarRules_Utils_CommonData,
    Helpers_Collection,
    WarRules_Utils_Availability,
    Lang_Utils,
    Utils_ClientErrorCode,
    WarRules_Constants,
    PlayerRules_Utils,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export function createDefault(ruleId: number, playersCount: number, gcData: GameConfigs_GameConfig.GameConfig): TemplateWarRule {
    return TemplateWarRule.fromJson({
        ruleId  : ruleId,
        // ruleNameArray   : [
        //     { languageType: LanguageType.Chinese, text: Lang.getText(LangTextType.B0277, LanguageType.Chinese) },
        //     { languageType: LanguageType.English, text: Lang.getText(LangTextType.B0277, LanguageType.English) },
        // ],
        ruleAvailability: {
            canMcw  : false,
            canMrw  : false,
            canSrw  : false,
            canCcw  : false,
        },
        warRuleCommonData   : {
            hasFogByDefault     : false,
            defaultWeatherType  : gcData.getDefaultWeatherType(),
            playerRuleList      : PlayerRules_Utils.createDefaultPlayerRuleList(playersCount, gcData).map(v => v.toJson()),
        },
        warEventIdArray             : [],
        ruleNameArray               : [],
        mapSimpleDialogueIdArray    : [],
        taskObjectiveIdArray        : [],
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Validators.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode({ templateWarRule, allWarEventIdArray, gameConfig, playersCountUnneutral, allMapSimpleDialogueIdArray, isCampaignMap, allTaskObjectiveIdSet }: {
    templateWarRule             : TemplateWarRule;
    allWarEventIdArray          : number[];
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral       : number;
    allMapSimpleDialogueIdArray : number[];
    isCampaignMap               : boolean;
    allTaskObjectiveIdSet       : Set<number>;
}): Utils_ClientErrorCode.ClientErrorCode {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : templateWarRule.getRuleNameArray(),
        minTextLength   : 1,
        maxTextLength   : WarRules_Constants.Constants.MaxNameLength,
        minTextCount    : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_00;
    }

    const ruleForPlayers = templateWarRule.getWarRuleCommonData()?.getPlayerRuleList();
    if (ruleForPlayers == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_01;
    }

    const ruleAvailability = templateWarRule.getRuleAvailability();
    if ((!isCampaignMap)                                                                &&
        ((!ruleAvailability) || (!WarRules_Utils_Availability.checkIsValid(ruleAvailability)))
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_02;
    }

    const errorCodeForRuleForPlayers = PlayerRules_Utils.getErrorCodeForPlayerRuleList({
        playerRuleList          : ruleForPlayers,
        gameConfig              : gameConfig,
        playersCountUnneutral   : playersCountUnneutral,
        ruleAvailability        : ruleAvailability ?? null,
        isCampaignMap           : isCampaignMap,
    });
    if (errorCodeForRuleForPlayers) {
        return errorCodeForRuleForPlayers;
    }

    const ruleForGlobalParams = templateWarRule.getWarRuleCommonData();
    if (ruleForGlobalParams == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_03;
    }

    const errorCodeForGlobalParams = WarRules_Utils_CommonData.getErrorCode(ruleForGlobalParams, gameConfig);
    if (errorCodeForGlobalParams) {
        return errorCodeForGlobalParams;
    }

    for (const warEventId of templateWarRule.getWarEventIdArray()) {
        if (allWarEventIdArray.indexOf(warEventId) < 0) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_04;
        }
    }

    {
        const mapSimpleDialogueIdArray = templateWarRule.getMapSimpleDialogueIdArray();
        if ((mapSimpleDialogueIdArray.length != new Set(mapSimpleDialogueIdArray).size)     ||
            (mapSimpleDialogueIdArray.some(v => allMapSimpleDialogueIdArray.indexOf(v) < 0))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_05;
        }
    }

    {
        const taskObjectiveIdArray = templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            if (taskObjectiveIdArray.length !== new Set(taskObjectiveIdArray).size) {
                return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_06;
            }
            if (taskObjectiveIdArray.some(v => !allTaskObjectiveIdSet.has(v))) {
                return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_07;
            }
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCodeForTemplateWarRuleArray({ templateWarRuleArray, playersCountUnneutral, allWarEventIdArray, gameConfig, allMapSimpleDialogueIdArray, isCampaignMap, allTaskObjectiveIdSet }: {
    templateWarRuleArray        : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TemplateWarRule[]>;
    playersCountUnneutral       : number;
    allWarEventIdArray          : number[];
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    allMapSimpleDialogueIdArray : number[];
    isCampaignMap               : boolean;
    allTaskObjectiveIdSet       : Set<number>;
}): Utils_ClientErrorCode.ClientErrorCode {
    if (templateWarRuleArray == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_00;
    }

    const rulesCount = templateWarRuleArray.length;
    if (rulesCount <= 0) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_01;
    }

    if (((isCampaignMap) && (rulesCount !== 1))                 ||
        ((!isCampaignMap) && (rulesCount > WarRules_Constants.Constants.MaxCount))
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_02;
    }

    const ruleIdSet         = new Set<number>();
    const validRuleArray    : TemplateWarRule[] = [];
    for (const templateWarRule of templateWarRuleArray) {
        const ruleId = templateWarRule.getRuleId();
        if ((ruleId < 0) || (ruleIdSet.has(ruleId))) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_03;
        }
        ruleIdSet.add(ruleId);

        const warRuleErrorCode = getErrorCode({
            templateWarRule             : templateWarRule,
            allWarEventIdArray          : allWarEventIdArray,
            gameConfig                  : gameConfig,
            playersCountUnneutral       : playersCountUnneutral,
            allMapSimpleDialogueIdArray : allMapSimpleDialogueIdArray,
            isCampaignMap               : isCampaignMap,
            allTaskObjectiveIdSet       : allTaskObjectiveIdSet,
        });
        if (warRuleErrorCode) {
            return warRuleErrorCode;
        }

        if ((!isCampaignMap)                                                                        &&
            (validRuleArray.some(v => checkIsInterchangeable(v, templateWarRule)))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_04;
        }
        validRuleArray.push(templateWarRule);
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsInterchangeable(rule1: TemplateWarRule, rule2: TemplateWarRule): boolean {
    if (!Helpers_Collection.checkIsSameList(rule1.getWarEventIdArray(), rule2.getWarEventIdArray())) {
        return false;
    }

    if (!Helpers_Collection.checkIsSameList(rule1.getTaskObjectiveIdArray(), rule2.getTaskObjectiveIdArray())) {
        return false;
    }

    // if (!Helpers.checkIsSameSet(new Set(rule1.getMapSimpleDialogueIdArray()), new Set(rule2.getMapSimpleDialogueIdArray()))) {
    //     return false;
    // }

    {
        const data1 = rule1.getWarRuleCommonData();
        const data2 = rule2.getWarRuleCommonData();
        if (!data1) {
            if (data2) {
                return false;
            }
        } else {
            if (!data2) {
                return false;
            }
            if (!WarRules_Utils_CommonData.checkIsSame(data1, data2)) {
                return false;
            }
        }
    }

    return true;
}
