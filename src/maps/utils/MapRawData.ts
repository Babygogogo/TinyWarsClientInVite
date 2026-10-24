import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as DialoguesUtilsMapSmallDialogue from "../../dialogues/utils/MapSmallDialogue.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMapMapExtraText from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as TaskObjectivesUtils from "../../taskObjectives/Utils.ts";
import * as TilesUtilsCustomName from "../../tiles/utils/CustomName.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsCustomName from "../../units/utils/CustomName.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";
import * as WarRulesUtilsTemplate from "../../warRules/utils/Template.ts";

type MapRawDataSchema   = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

/** 此函数允许 WarRuleAvailability 全空 */
export async function getErrorCode({ mapRawData, allowRedundantWarEvents, allowRedundantMapSimpleDialogues }: {
    mapRawData                          : MapRawDataSchema;
    allowRedundantWarEvents             : boolean;
    allowRedundantMapSimpleDialogues    : boolean;
}): Promise<UtilsClientErrorCode.ClientErrorCode> {
    const gameConfig = await GameConfigGcModel.getLatestGameConfig();
    if (gameConfig == null) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_00;
    }

    const designerNameError = getErrorCodeForMapDesigner(mapRawData.getDesignerName());
    if (designerNameError) {
        return designerNameError;
    }

    const mapNameArrayError = getErrorCodeForMapNameArray(mapRawData.getMapNameArray());
    if (mapNameArrayError) {
        return mapNameArrayError;
    }

    const mapExtraTextError = getErrorCodeForMapExtraText(mapRawData.getMapExtraText());
    if (mapExtraTextError) {
        return mapExtraTextError;
    }

    const unitArrayError = getErrorCodeForUnitArray(mapRawData.getUnitDataArray());
    if (unitArrayError) {
        return unitArrayError;
    }

    const playersCountUnneutralError = getErrorCodeForPlayersCountUnneutral(mapRawData);
    if (playersCountUnneutralError) {
        return playersCountUnneutralError;
    }

    {
        const errorCode = TilesUtilsCustomName.getErrorCodeForTileCustomNameArray(mapRawData.getTileCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    {
        const errorCode = UnitsUtilsCustomName.getErrorCodeForUnitCustomNameArray(mapRawData.getUnitCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if (playersCountUnneutral == null) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_02;
    }

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (!templateWarRuleArray?.length) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_03;
    }

    const isCampaignMap = mapRawData.getCampaignMapData() != null;
    if ((isCampaignMap) && (!LangUtils.getLanguageText({ textArray: mapRawData.getMapExtraText()?.getMapDescription() }))) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_04;
    }

    const warEventFullData  = mapRawData.getWarEventFullData();
    const warRuleError      = WarRulesUtilsTemplate.getErrorCodeForTemplateWarRuleArray({
        templateWarRuleArray        : templateWarRuleArray,
        playersCountUnneutral       : HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral()),
        allWarEventIdArray          : WarEventsFullDatasUtils.getAllWarEventIdArray(warEventFullData),
        gameConfig                  : gameConfig,
        allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray()?.map(v => v.getDialogueId() ?? 0) ?? [],
        isCampaignMap               : isCampaignMap,
        allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray()?.map(v => v.getObjectiveId() ?? 0)),
    });
    if (warRuleError) {
        return warRuleError;
    }

    const mapSize = AuxiliaryTypesMapSize.MapSize.createWithMapRawData(mapRawData);
    if (mapSize == null) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_05;
    }

    const warEventError = WarEventsFullDatasUtils.getErrorCodeForWarEventFullData({ warEventFullData, gameConfig, mapSize, playersCountUnneutral });
    if (warEventError) {
        return warEventError;
    }

    if ((!allowRedundantWarEvents) && (!checkIsEveryWarEventInUse(warEventFullData, templateWarRuleArray))) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_06;
    }

    {
        const mapSimpleDialogueArray    = mapRawData.getMapSimpleDialogueArray();
        const simpleDialogueIdArray     = mapSimpleDialogueArray.map(v => v.getDialogueId() ?? 0);
        if (mapSimpleDialogueArray.length != new Set(simpleDialogueIdArray).size) {
            return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_07;
        }
        if ((!allowRedundantMapSimpleDialogues)                                                                                     &&
            (simpleDialogueIdArray.some(v => !templateWarRuleArray.some(r => r.getMapSimpleDialogueIdArray().indexOf(v) >= 0)))
        ) {
            return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_08;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = DialoguesUtilsMapSmallDialogue.getErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = mapRawData.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = TaskObjectivesUtils.getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(mapRawData.getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``))
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return await new (GameHelpersGhFactory.getTwWarClass())().getErrorCodeForInitByMapRawData(mapRawData, gameConfig);
}
function getErrorCodeForMapDesigner(mapDesigner: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): UtilsClientErrorCode.ClientErrorCode {
    if ((mapDesigner == null)                                       ||
        (mapDesigner.length <= 0)                                   ||
        (mapDesigner.length > GameConfigGcMap.Constants.MaxDesignerLength)
    ) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapDesigner_00;
    } else {
        return UtilsClientErrorCode.ClientErrorCode.NoError;
    }
}
function getErrorCodeForMapNameArray(mapNameList: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]>): UtilsClientErrorCode.ClientErrorCode {
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : mapNameList ?? [],
        maxTextLength   : GameConfigGcMap.Constants.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 1,
    })) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapNameArray_00;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForMapExtraText(mapExtraText: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoMapMapExtraText.MapExtraText>): UtilsClientErrorCode.ClientErrorCode {
    if (mapExtraText == null) {
        return UtilsClientErrorCode.ClientErrorCode.NoError;
    }

    const mapDescription = mapExtraText.getMapDescription();
    if ((mapDescription?.length)                &&
        (!LangUtils.checkIsValidLanguageTextArray({
            list            : mapDescription,
            minTextCount    : 1,
            minTextLength   : 1,
            maxTextLength   : GameConfigGcMap.Constants.MaxDescLength,
        }))
    ) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapExtraText_00;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForPlayersCountUnneutral(mapRawData: MapRawDataSchema): UtilsClientErrorCode.ClientErrorCode {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null)                                 ||
        (playersCountUnneutral <= PlayersConstants.PlayerIndex.First)  ||
        (playersCountUnneutral > PlayersConstants.PlayerIndex.Max)
    ) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_00;
    }

    const playerIndexSet = new Set<number>();
    for (const tileData of mapRawData.getTileDataArray()) {
        const playerIndex = tileData.getPlayerIndex() ?? 0;
        if ((playerIndex < PlayersConstants.PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_01;
        }
        playerIndexSet.add(playerIndex);
    }
    for (const unitData of mapRawData.getUnitDataArray()) {
        const playerIndex = unitData.getPlayerIndex() ?? 0;
        if ((playerIndex < PlayersConstants.PlayerIndex.First)     ||
            (playerIndex > playersCountUnneutral)
        ) {
            return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_02;
        }
        playerIndexSet.add(playerIndex);
    }

    for (const playerIndex of playerIndexSet) {
        if ((playerIndex > PlayersConstants.PlayerIndex.First) &&
            (!playerIndexSet.has(playerIndex - 1))
        ) {
            return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_03;
        }
    }

    if (Math.max(...playerIndexSet) !== playersCountUnneutral) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_04;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
function checkIsEveryWarEventInUse(warEventFullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData>, templateWarRuleArray: TemplateWarRule[]): boolean {  // DONE
    const eventArray = warEventFullData?.getEventArray();
    return (!eventArray?.length)
        || (eventArray.every(warEvent => {
            const eventId = warEvent.getEventId();
            return (eventId != null) && (templateWarRuleArray.some(v => (v.getWarEventIdArray().indexOf(eventId) ?? -1) >= 0));
        }));
}
function getErrorCodeForUnitArray(unitArray: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[]>): UtilsClientErrorCode.ClientErrorCode {
    if (!UnitsUtilsCommon.checkIsUnitIdCompact(unitArray?.map(v => v.getUnitId()) ?? [])) {
        return UtilsClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForUnitArray_00;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
