import {
    Maps_Constants,
    GameConfigs_Provider,
    Dialogues_Utils_MapSmallDialogue,
    AuxiliaryTypes_MapSize,
    TestWar_Model_TwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Utils_Common,
    Lang_Utils,
    Utils_ClientErrorCode,
    WarEvents_FullDatas_Utils,
    TaskObjectives_Utils,
    WarRules_Utils_Template,
    Tiles_Utils_CustomName,
    Units_Utils_CustomName,
    Players_Constants,
} from "../../internal.ts";

import type { MapExtraText } from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

/** 此函数允许 WarRuleAvailability 全空 */
export async function getErrorCode({ mapRawData, allowRedundantWarEvents, allowRedundantMapSimpleDialogues }: {
    mapRawData                          : MapRawData;
    allowRedundantWarEvents             : boolean;
    allowRedundantMapSimpleDialogues    : boolean;
}): Promise<Utils_ClientErrorCode.ClientErrorCode> {
    const gameConfig = await GameConfigs_Provider.getLatestGameConfig();
    if (gameConfig == null) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_00;
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
        const errorCode = Tiles_Utils_CustomName.getErrorCodeForTileCustomNameArray(mapRawData.getTileCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    {
        const errorCode = Units_Utils_CustomName.getErrorCodeForUnitCustomNameArray(mapRawData.getUnitCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if (playersCountUnneutral == null) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_02;
    }

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (!templateWarRuleArray?.length) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_03;
    }

    const isCampaignMap = mapRawData.getCampaignMapData() != null;
    if ((isCampaignMap) && (!Lang_Utils.getLanguageText({ textArray: mapRawData.getMapExtraText()?.getMapDescription() }))) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_04;
    }

    const warEventFullData  = mapRawData.getWarEventFullData();
    const warRuleError      = WarRules_Utils_Template.getErrorCodeForTemplateWarRuleArray({
        templateWarRuleArray        : templateWarRuleArray,
        playersCountUnneutral       : mapRawData.getPlayersCountUnneutral(),
        allWarEventIdArray          : WarEvents_FullDatas_Utils.getAllWarEventIdArray(warEventFullData),
        gameConfig                  : gameConfig,
        allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray()?.map(v => v.getDialogueId()),
        isCampaignMap               : isCampaignMap,
        allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray()?.map(v => v.getObjectiveId())),
    });
    if (warRuleError) {
        return warRuleError;
    }

    const mapSize = AuxiliaryTypes_MapSize.MapSize.createWithMapRawData(mapRawData);
    if (mapSize == null) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_05;
    }

    const warEventError = WarEvents_FullDatas_Utils.getErrorCodeForWarEventFullData({ warEventFullData, gameConfig, mapSize, playersCountUnneutral });
    if (warEventError) {
        return warEventError;
    }

    if ((!allowRedundantWarEvents) && (!checkIsEveryWarEventInUse(warEventFullData, templateWarRuleArray))) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_06;
    }

    {
        const mapSimpleDialogueArray    = mapRawData.getMapSimpleDialogueArray();
        const simpleDialogueIdArray     = mapSimpleDialogueArray.map(v => v.getDialogueId());
        if (mapSimpleDialogueArray.length != new Set(simpleDialogueIdArray).size) {
            return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_07;
        }
        if ((!allowRedundantMapSimpleDialogues)                                                                                     &&
            (simpleDialogueIdArray.some(v => !templateWarRuleArray.some(r => r.getMapSimpleDialogueIdArray().indexOf(v) >= 0)))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_08;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = Dialogues_Utils_MapSmallDialogue.getErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = mapRawData.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = TaskObjectives_Utils.getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(mapRawData.getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``))
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return await new TestWar_Model_TwWar.TwWar().getErrorCodeForInitByMapRawData(mapRawData, gameConfig);
}
function getErrorCodeForMapDesigner(mapDesigner: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): Utils_ClientErrorCode.ClientErrorCode {
    if ((mapDesigner == null)                                       ||
        (mapDesigner.length <= 0)                                   ||
        (mapDesigner.length > Maps_Constants.Common.MaxDesignerLength)
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapDesigner_00;
    } else {
        return Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
}
function getErrorCodeForMapNameArray(mapNameList: AuxiliaryTypes_AuxiliaryTypes.Undefinable<LanguageText[]>): Utils_ClientErrorCode.ClientErrorCode {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : mapNameList ?? [],
        maxTextLength   : Maps_Constants.Common.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapNameArray_00;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForMapExtraText(mapExtraText: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapExtraText>): Utils_ClientErrorCode.ClientErrorCode {
    if (mapExtraText == null) {
        return Utils_ClientErrorCode.ClientErrorCode.NoError;
    }

    const mapDescription = mapExtraText.getMapDescription();
    if ((mapDescription?.length)                &&
        (!Lang_Utils.checkIsValidLanguageTextArray({
            list            : mapDescription,
            minTextCount    : 1,
            minTextLength   : 1,
            maxTextLength   : Maps_Constants.Common.MaxDescLength,
        }))
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapExtraText_00;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForPlayersCountUnneutral(mapRawData: MapRawData): Utils_ClientErrorCode.ClientErrorCode {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null)                                 ||
        (playersCountUnneutral <= Players_Constants.PlayerIndex.First)  ||
        (playersCountUnneutral > Players_Constants.PlayerIndex.Max)
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_00;
    }

    const playerIndexSet = new Set<number>();
    for (const tileData of mapRawData.getTileDataArray()) {
        const playerIndex = tileData.getPlayerIndex();
        if ((playerIndex < Players_Constants.PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_01;
        }
        playerIndexSet.add(playerIndex);
    }
    for (const unitData of mapRawData.getUnitDataArray()) {
        const playerIndex = unitData.getPlayerIndex();
        if ((playerIndex < Players_Constants.PlayerIndex.First)     ||
            (playerIndex > playersCountUnneutral)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_02;
        }
        playerIndexSet.add(playerIndex);
    }

    for (const playerIndex of playerIndexSet) {
        if ((playerIndex > Players_Constants.PlayerIndex.First) &&
            (!playerIndexSet.has(playerIndex - 1))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_03;
        }
    }

    if (Math.max(...playerIndexSet) !== playersCountUnneutral) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_04;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
function checkIsEveryWarEventInUse(warEventFullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarEventFullData>, templateWarRuleArray: TemplateWarRule[]): boolean {  // DONE
    const eventArray = warEventFullData?.getEventArray();
    return (!eventArray?.length)
        || (eventArray.every(warEvent => {
            const eventId = warEvent.getEventId();
            return (eventId != null) && (templateWarRuleArray.some(v => (v.getWarEventIdArray().indexOf(eventId)) >= 0));
        }));
}
function getErrorCodeForUnitArray(unitArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialUnit[]>): Utils_ClientErrorCode.ClientErrorCode {
    if (!Units_Utils_Common.checkIsUnitIdCompact(unitArray?.map(v => v.getUnitId()) ?? [])) {
        return Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForUnitArray_00;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
