import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { getErrorCode as DialoguesUtilsMapSmallDialogueGetErrorCode } from "../../dialogues/utils/MapSmallDialogue.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getCurrentLanguageType, getSecondaryLanguageType, getText, checkIsValidLanguageTextArray } from "../../lang/Utils.ts";
import { createDefaultPlayerRuleList, getErrorCodeForPlayerRuleList } from "../../playerRules/Utils.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { trimAndClone, getErrorCodeForFullData } from "../../taskObjectives/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { trimWarEventFullData, getErrorCodeForWarEventFullData } from "../../warEvents/fullDatas/Utils.ts";
import { Constants } from "../Constants.ts";
import { getErrorCode as WarRulesUtilsCommonDataGetErrorCode } from "./CommonData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

type TemplateWarRuleSchema      = TemplateWarRule;
export function create({ templateWarRule, warEventFullData, allMapSimpleDialogueArray, taskObjectiveFullData }: {
    templateWarRule             : TemplateWarRuleSchema;
    warEventFullData            : Undefinable<WarEventFullData>;
    allMapSimpleDialogueArray   : Undefinable<MapSimpleDialogue[]>;
    taskObjectiveFullData       : Undefinable<TaskObjectiveFullData>;
}): InstanceWarRule {
    return InstanceWarRule.fromJson({
        templateWarRuleId       : templateWarRule.getRuleId(),
        ruleNameArray           : templateWarRule.getRuleNameArray().map(v => v.clone().toJson()),

        warRuleCommonData       : templateWarRule.getWarRuleCommonData()?.clone().toJson(),
        warEventFullData        : trimWarEventFullData(warEventFullData, templateWarRule.getWarEventIdArray(), true).toJson(),
        mapSimpleDialogueArray  : templateWarRule.getMapSimpleDialogueIdArray().map(id => getExisted(allMapSimpleDialogueArray?.find(v => (v.getDialogueId() ?? 0) === id))).map(v => v.clone().toJson()),
        taskObjectiveFullData   : trimAndClone(taskObjectiveFullData, templateWarRule.getTaskObjectiveIdArray())?.toJson(),
    });
}
export function createDefault(playersCount: number, gcData: GameConfig): InstanceWarRule {
    const languageType1 = getCurrentLanguageType();
    const languageType2 = getSecondaryLanguageType();
    return InstanceWarRule.fromJson({
        templateWarRuleId       : null,
        ruleNameArray           : [
            { languageType: languageType1, text: getText(TextType.None, languageType1) },
            { languageType: languageType2, text: getText(TextType.None, languageType2) },
        ],
        warRuleCommonData       : {
            hasFogByDefault     : false,
            defaultWeatherType  : gcData.getDefaultWeatherType(),
            playerRuleList      : createDefaultPlayerRuleList(playersCount, gcData).map(v => v.toJson()),
        },
        warEventFullData        : {
            eventArray              : [],
            actionArray             : [],
            conditionArray          : [],
            conditionNodeArray      : [],
            customCounterNameArray  : [],
        },
        taskObjectiveFullData   : null,
        mapSimpleDialogueArray  : [],
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode({ instanceWarRule, gameConfig, playersCountUnneutral, warType, mapSize }: {
    instanceWarRule         : InstanceWarRule;
    gameConfig              : GameConfig;
    playersCountUnneutral   : number;
    warType                 : WarTypeId;
    mapSize                 : MapSize;
}): ClientErrorCode {
    if (!checkIsValidLanguageTextArray({
        list            : instanceWarRule.getRuleNameArray(),
        minTextLength   : 1,
        maxTextLength   : Constants.MaxNameLength,
        minTextCount    : 1,
    })) {
        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_00;
    }

    const playerRuleList = instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList();
    if (playerRuleList == null) {
        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_01;
    }

    const ruleAvailability = RuleAvailability.fromJson({
        canCcw  : (warType === WarTypeId.CcwFog) || (warType === WarTypeId.CcwStd),
        canMcw  : (warType === WarTypeId.McwFog) || (warType === WarTypeId.McwStd),
        canMrw  : (warType === WarTypeId.MrwFog) || (warType === WarTypeId.MrwStd) || (warType === WarTypeId.MmwStd) || (warType === WarTypeId.MmwFog) || (warType === WarTypeId.AtwStd) || (warType === WarTypeId.AtwFog),
        canSrw  : (warType === WarTypeId.SrwFog) || (warType === WarTypeId.SrwStd),
    });
    const errorCodeForRuleForPlayers = getErrorCodeForPlayerRuleList({
        playerRuleList          : playerRuleList,
        gameConfig              : gameConfig,
        playersCountUnneutral   : playersCountUnneutral,
        ruleAvailability        : ruleAvailability,
        isCampaignMap           : (warType === WarTypeId.CampFog) || (warType === WarTypeId.CampStd),
    });
    if (errorCodeForRuleForPlayers) {
        return errorCodeForRuleForPlayers;
    }

    const ruleForGlobalParams = instanceWarRule.getWarRuleCommonData();
    if (ruleForGlobalParams == null) {
        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_02;
    }

    const errorCodeForGlobalParams = WarRulesUtilsCommonDataGetErrorCode(ruleForGlobalParams, gameConfig);
    if (errorCodeForGlobalParams) {
        return errorCodeForGlobalParams;
    }

    const warEventFullData      = instanceWarRule.getWarEventFullData();
    const errorCodeForWarEvent  = getErrorCodeForWarEventFullData({
        warEventFullData        : warEventFullData,
        mapSize                 : mapSize,
        gameConfig              : gameConfig,
        playersCountUnneutral   : playersCountUnneutral,
    });
    if (errorCodeForWarEvent) {
        return errorCodeForWarEvent;
    }

    {
        const mapSimpleDialogueArray    = instanceWarRule.getMapSimpleDialogueArray();
        const simpleDialogueIdArray     = mapSimpleDialogueArray.map(v => v.getDialogueId() ?? 0);
        if (mapSimpleDialogueArray.length != new Set(simpleDialogueIdArray).size) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_03;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = DialoguesUtilsMapSmallDialogueGetErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = instanceWarRule.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(warEventFullData?.getCustomCounterNameArray()?.map(v => v.getName() ?? ``))
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return ClientErrorCode.NoError;
}
