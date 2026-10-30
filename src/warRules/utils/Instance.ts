import {
    Lang_Utils,
    Utils_ClientErrorCode,
    WarRules_Constants,
    PlayerRules_Utils,
    WarRules_Utils_CommonData,
    TaskObjectives_Utils,
    WarEvents_FullDatas_Utils,
    Helpers_Misc,
    Dialogues_Utils_MapSmallDialogue,
    Lang_Constants,
    WarTypes_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export function create({ templateWarRule, warEventFullData, allMapSimpleDialogueArray, taskObjectiveFullData }: {
    templateWarRule             : TemplateWarRule;
    warEventFullData            : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarEventFullData>;
    allMapSimpleDialogueArray   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapSimpleDialogue[]>;
    taskObjectiveFullData       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>;
}): InstanceWarRule {
    return InstanceWarRule.fromJson({
        templateWarRuleId : templateWarRule.getRuleId(),
        ruleNameArray     : templateWarRule.getRuleNameArray().map(v => v.clone().toJson()),

        warRuleCommonData      : templateWarRule.getWarRuleCommonData()?.clone().toJson(),
        warEventFullData       : WarEvents_FullDatas_Utils.trimWarEventFullData(warEventFullData, templateWarRule.getWarEventIdArray(), true).toJson(),
        mapSimpleDialogueArray : templateWarRule.getMapSimpleDialogueIdArray().map(id => Helpers_Misc.getExisted(allMapSimpleDialogueArray?.find(v => (v.getDialogueId()) === id))).map(v => v.clone().toJson()),
        taskObjectiveFullData  : TaskObjectives_Utils.trimAndClone(taskObjectiveFullData, templateWarRule.getTaskObjectiveIdArray())?.toJson(),
    });
}
export function createDefault(playersCount: number, gcData: GameConfigs_GameConfig.GameConfig): InstanceWarRule {
    const languageType1 = Lang_Utils.getCurrentLanguageType();
    const languageType2 = Lang_Utils.getSecondaryLanguageType();
    return InstanceWarRule.fromJson({
        templateWarRuleId : null,
        ruleNameArray     : [
            { languageType : languageType1, text : Lang_Utils.getText(Lang_Constants.TextType.None, languageType1) },
            { languageType : languageType2, text : Lang_Utils.getText(Lang_Constants.TextType.None, languageType2) },
        ],
        warRuleCommonData : {
            hasFogByDefault    : false,
            defaultWeatherType : gcData.getDefaultWeatherType(),
            playerRuleList     : PlayerRules_Utils.createDefaultPlayerRuleList(playersCount, gcData).map(v => v.toJson()),
        },
        warEventFullData : {
            eventArray             : [],
            actionArray            : [],
            conditionArray         : [],
            conditionNodeArray     : [],
            customCounterNameArray : [],
        },
        taskObjectiveFullData  : null,
        mapSimpleDialogueArray : [],
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode({ instanceWarRule, gameConfig, playersCountUnneutral, warType, mapSize }: {
    instanceWarRule         : InstanceWarRule;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    warType                 : WarTypes_Constants.WarTypeId;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
}): Utils_ClientErrorCode.ClientErrorCode {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : instanceWarRule.getRuleNameArray(),
        minTextLength : 1,
        maxTextLength : WarRules_Constants.Constants.MaxNameLength,
        minTextCount  : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_00;
    }

    const playerRuleList = instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList();
    if (playerRuleList == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_01;
    }

    const ruleAvailability = RuleAvailability.fromJson({
        canCcw : (warType === WarTypes_Constants.WarTypeId.CcwFog) || (warType === WarTypes_Constants.WarTypeId.CcwStd),
        canMcw : (warType === WarTypes_Constants.WarTypeId.McwFog) || (warType === WarTypes_Constants.WarTypeId.McwStd),
        canMrw : (warType === WarTypes_Constants.WarTypeId.MrwFog) || (warType === WarTypes_Constants.WarTypeId.MrwStd) || (warType === WarTypes_Constants.WarTypeId.MmwStd) || (warType === WarTypes_Constants.WarTypeId.MmwFog) || (warType === WarTypes_Constants.WarTypeId.AtwStd) || (warType === WarTypes_Constants.WarTypeId.AtwFog),
        canSrw : (warType === WarTypes_Constants.WarTypeId.SrwFog) || (warType === WarTypes_Constants.WarTypeId.SrwStd),
    });
    const errorCodeForRuleForPlayers = PlayerRules_Utils.getErrorCodeForPlayerRuleList({
        playerRuleList        : playerRuleList,
        gameConfig            : gameConfig,
        playersCountUnneutral : playersCountUnneutral,
        ruleAvailability      : ruleAvailability,
        isCampaignMap         : (warType === WarTypes_Constants.WarTypeId.CampFog) || (warType === WarTypes_Constants.WarTypeId.CampStd),
    });
    if (errorCodeForRuleForPlayers) {
        return errorCodeForRuleForPlayers;
    }

    const ruleForGlobalParams = instanceWarRule.getWarRuleCommonData();
    if (ruleForGlobalParams == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_02;
    }

    const errorCodeForGlobalParams = WarRules_Utils_CommonData.getErrorCode(ruleForGlobalParams, gameConfig);
    if (errorCodeForGlobalParams) {
        return errorCodeForGlobalParams;
    }

    const warEventFullData      = instanceWarRule.getWarEventFullData();
    const errorCodeForWarEvent  = WarEvents_FullDatas_Utils.getErrorCodeForWarEventFullData({
        warEventFullData      : warEventFullData,
        mapSize               : mapSize,
        gameConfig            : gameConfig,
        playersCountUnneutral : playersCountUnneutral,
    });
    if (errorCodeForWarEvent) {
        return errorCodeForWarEvent;
    }

    {
        const mapSimpleDialogueArray    = instanceWarRule.getMapSimpleDialogueArray();
        const simpleDialogueIdArray     = mapSimpleDialogueArray.map(v => v.getDialogueId());
        if (mapSimpleDialogueArray.length != new Set(simpleDialogueIdArray).size) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_03;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = Dialogues_Utils_MapSmallDialogue.getErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = instanceWarRule.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = TaskObjectives_Utils.getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(warEventFullData?.getCustomCounterNameArray()?.map(v => v.getName() ?? ``)),
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
