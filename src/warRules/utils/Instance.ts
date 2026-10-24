import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as DialoguesUtilsMapSmallDialogue from "../../dialogues/utils/MapSmallDialogue.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as TaskObjectivesUtils from "../../taskObjectives/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";
import * as WarRulesConstants from "../Constants.ts";
import * as WarRulesUtilsCommonData from "./CommonData.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type TemplateWarRuleSchema      = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
type TaskObjectiveFullData      = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData;

export function create({ templateWarRule, warEventFullData, allMapSimpleDialogueArray, taskObjectiveFullData }: {
    templateWarRule             : TemplateWarRuleSchema;
    warEventFullData            : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData>;
    allMapSimpleDialogueArray   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue[]>;
    taskObjectiveFullData       : AuxiliaryTypesAuxiliaryTypes.Undefinable<TaskObjectiveFullData>;
}): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
    return ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule.fromJson({
        templateWarRuleId       : templateWarRule.getRuleId(),
        ruleNameArray           : templateWarRule.getRuleNameArray().map(v => v.clone().toJson()),

        warRuleCommonData       : templateWarRule.getWarRuleCommonData()?.clone().toJson(),
        warEventFullData        : WarEventsFullDatasUtils.trimWarEventFullData(warEventFullData, templateWarRule.getWarEventIdArray(), true).toJson(),
        mapSimpleDialogueArray  : templateWarRule.getMapSimpleDialogueIdArray().map(id => HelpersMisc.getExisted(allMapSimpleDialogueArray?.find(v => (v.getDialogueId() ?? 0) === id))).map(v => v.clone().toJson()),
        taskObjectiveFullData   : TaskObjectivesUtils.trimAndClone(taskObjectiveFullData, templateWarRule.getTaskObjectiveIdArray())?.toJson(),
    });
}
export function createDefault(playersCount: number, gcData: GameConfigGcData.GcData): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
    const languageType1 = LangUtils.getCurrentLanguageType();
    const languageType2 = LangUtils.getSecondaryLanguageType();
    return ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule.fromJson({
        templateWarRuleId       : null,
        ruleNameArray           : [
            { languageType: languageType1, text: LangUtils.getText(LangConstants.TextType.None, languageType1) },
            { languageType: languageType2, text: LangUtils.getText(LangConstants.TextType.None, languageType2) },
        ],
        warRuleCommonData       : {
            hasFogByDefault     : false,
            defaultWeatherType  : gcData.getDefaultWeatherType(),
            playerRuleList      : PlayerRulesUtils.createDefaultPlayerRuleList(playersCount, gcData).map(v => v.toJson()),
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
    instanceWarRule         : ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
    gameConfig              : GameConfigGcData.GcData;
    playersCountUnneutral   : number;
    warType                 : WarTypesConstants.WarTypeId;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
}): UtilsClientErrorCode.ClientErrorCode {
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : instanceWarRule.getRuleNameArray(),
        minTextLength   : 1,
        maxTextLength   : WarRulesConstants.Constants.MaxNameLength,
        minTextCount    : 1,
    })) {
        return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_00;
    }

    const playerRuleList = instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList();
    if (playerRuleList == null) {
        return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_01;
    }

    const ruleAvailability = ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability.fromJson({
        canCcw  : (warType === WarTypesConstants.WarTypeId.CcwFog) || (warType === WarTypesConstants.WarTypeId.CcwStd),
        canMcw  : (warType === WarTypesConstants.WarTypeId.McwFog) || (warType === WarTypesConstants.WarTypeId.McwStd),
        canMrw  : (warType === WarTypesConstants.WarTypeId.MrwFog) || (warType === WarTypesConstants.WarTypeId.MrwStd) || (warType === WarTypesConstants.WarTypeId.MmwStd) || (warType === WarTypesConstants.WarTypeId.MmwFog) || (warType === WarTypesConstants.WarTypeId.AtwStd) || (warType === WarTypesConstants.WarTypeId.AtwFog),
        canSrw  : (warType === WarTypesConstants.WarTypeId.SrwFog) || (warType === WarTypesConstants.WarTypeId.SrwStd),
    });
    const errorCodeForRuleForPlayers = PlayerRulesUtils.getErrorCodeForPlayerRuleList({
        playerRuleList          : playerRuleList,
        gameConfig              : gameConfig,
        playersCountUnneutral   : playersCountUnneutral,
        ruleAvailability        : ruleAvailability,
        isCampaignMap           : (warType === WarTypesConstants.WarTypeId.CampFog) || (warType === WarTypesConstants.WarTypeId.CampStd),
    });
    if (errorCodeForRuleForPlayers) {
        return errorCodeForRuleForPlayers;
    }

    const ruleForGlobalParams = instanceWarRule.getWarRuleCommonData();
    if (ruleForGlobalParams == null) {
        return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_02;
    }

    const errorCodeForGlobalParams = WarRulesUtilsCommonData.getErrorCode(ruleForGlobalParams, gameConfig);
    if (errorCodeForGlobalParams) {
        return errorCodeForGlobalParams;
    }

    const warEventFullData      = instanceWarRule.getWarEventFullData();
    const errorCodeForWarEvent  = WarEventsFullDatasUtils.getErrorCodeForWarEventFullData({
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
            return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_03;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = DialoguesUtilsMapSmallDialogue.getErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = instanceWarRule.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = TaskObjectivesUtils.getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(warEventFullData?.getCustomCounterNameArray()?.map(v => v.getName() ?? ``))
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
