import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { getErrorCode as DialoguesUtilsMapSmallDialogueGetErrorCode } from "../../dialogues/utils/MapSmallDialogue.ts";
import { Common } from "../Constants.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getLanguageText, checkIsValidLanguageTextArray } from "../../lang/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MapExtraText } from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type {
    TemplateWarRule as ProtoSchemaCommonProtoWarRuleTemplateWarRule,
} from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { getErrorCodeForFullData } from "../../taskObjectives/Utils.ts";
import { getErrorCodeForTileCustomNameArray } from "../../tiles/utils/CustomName.ts";
import { checkIsUnitIdCompact } from "../../units/utils/Common.ts";
import { getErrorCodeForUnitCustomNameArray } from "../../units/utils/CustomName.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { getAllWarEventIdArray, getErrorCodeForWarEventFullData } from "../../warEvents/fullDatas/Utils.ts";
import { getErrorCodeForTemplateWarRuleArray } from "../../warRules/utils/Template.ts";

type MapRawDataSchema   = MapRawData;
type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule;

/** 此函数允许 WarRuleAvailability 全空 */
export async function getErrorCode({ mapRawData, allowRedundantWarEvents, allowRedundantMapSimpleDialogues }: {
    mapRawData                          : MapRawDataSchema;
    allowRedundantWarEvents             : boolean;
    allowRedundantMapSimpleDialogues    : boolean;
}): Promise<ClientErrorCode> {
    const gameConfig = await getLatestGameConfig();
    if (gameConfig == null) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_00;
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
        const errorCode = getErrorCodeForTileCustomNameArray(mapRawData.getTileCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    {
        const errorCode = getErrorCodeForUnitCustomNameArray(mapRawData.getUnitCustomNameArray());
        if (errorCode) {
            return errorCode;
        }
    }

    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if (playersCountUnneutral == null) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_02;
    }

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (!templateWarRuleArray?.length) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_03;
    }

    const isCampaignMap = mapRawData.getCampaignMapData() != null;
    if ((isCampaignMap) && (!getLanguageText({ textArray: mapRawData.getMapExtraText()?.getMapDescription() }))) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_04;
    }

    const warEventFullData  = mapRawData.getWarEventFullData();
    const warRuleError      = getErrorCodeForTemplateWarRuleArray({
        templateWarRuleArray        : templateWarRuleArray,
        playersCountUnneutral       : getExisted(mapRawData.getPlayersCountUnneutral()),
        allWarEventIdArray          : getAllWarEventIdArray(warEventFullData),
        gameConfig                  : gameConfig,
        allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray()?.map(v => v.getDialogueId() ?? 0) ?? [],
        isCampaignMap               : isCampaignMap,
        allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray()?.map(v => v.getObjectiveId() ?? 0)),
    });
    if (warRuleError) {
        return warRuleError;
    }

    const mapSize = MapSize.createWithMapRawData(mapRawData);
    if (mapSize == null) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_05;
    }

    const warEventError = getErrorCodeForWarEventFullData({ warEventFullData, gameConfig, mapSize, playersCountUnneutral });
    if (warEventError) {
        return warEventError;
    }

    if ((!allowRedundantWarEvents) && (!checkIsEveryWarEventInUse(warEventFullData, templateWarRuleArray))) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_06;
    }

    {
        const mapSimpleDialogueArray    = mapRawData.getMapSimpleDialogueArray();
        const simpleDialogueIdArray     = mapSimpleDialogueArray.map(v => v.getDialogueId() ?? 0);
        if (mapSimpleDialogueArray.length != new Set(simpleDialogueIdArray).size) {
            return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_07;
        }
        if ((!allowRedundantMapSimpleDialogues)                                                                                     &&
            (simpleDialogueIdArray.some(v => !templateWarRuleArray.some(r => r.getMapSimpleDialogueIdArray().indexOf(v) >= 0)))
        ) {
            return ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_08;
        }

        for (const mapSimpleDialogue of mapSimpleDialogueArray) {
            const errorCode = DialoguesUtilsMapSmallDialogueGetErrorCode(mapSimpleDialogue, playersCountUnneutral, gameConfig);
            if (errorCode) {
                return errorCode;
            }
        }
    }

    {
        const taskObjectiveFullData = mapRawData.getTaskObjectiveFullData();
        if (taskObjectiveFullData != null) {
            const errorCode = getErrorCodeForFullData(
                taskObjectiveFullData,
                new Set(mapRawData.getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``))
            );
            if (errorCode) {
                return errorCode;
            }
        }
    }

    return await new (getTwWarClass())().getErrorCodeForInitByMapRawData(mapRawData, gameConfig);
}
function getErrorCodeForMapDesigner(mapDesigner: Undefinable<string>): ClientErrorCode {
    if ((mapDesigner == null)                                       ||
        (mapDesigner.length <= 0)                                   ||
        (mapDesigner.length > Common.MaxDesignerLength)
    ) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapDesigner_00;
    } else {
        return ClientErrorCode.NoError;
    }
}
function getErrorCodeForMapNameArray(mapNameList: Undefinable<LanguageText[]>): ClientErrorCode {
    if (!checkIsValidLanguageTextArray({
        list            : mapNameList ?? [],
        maxTextLength   : Common.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 1,
    })) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapNameArray_00;
    }

    return ClientErrorCode.NoError;
}
function getErrorCodeForMapExtraText(mapExtraText: Undefinable<MapExtraText>): ClientErrorCode {
    if (mapExtraText == null) {
        return ClientErrorCode.NoError;
    }

    const mapDescription = mapExtraText.getMapDescription();
    if ((mapDescription?.length)                &&
        (!checkIsValidLanguageTextArray({
            list            : mapDescription,
            minTextCount    : 1,
            minTextLength   : 1,
            maxTextLength   : Common.MaxDescLength,
        }))
    ) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForMapExtraText_00;
    }

    return ClientErrorCode.NoError;
}
function getErrorCodeForPlayersCountUnneutral(mapRawData: MapRawDataSchema): ClientErrorCode {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null)                                 ||
        (playersCountUnneutral <= PlayerIndex.First)  ||
        (playersCountUnneutral > PlayerIndex.Max)
    ) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_00;
    }

    const playerIndexSet = new Set<number>();
    for (const tileData of mapRawData.getTileDataArray()) {
        const playerIndex = tileData.getPlayerIndex() ?? 0;
        if ((playerIndex < PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            return ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_01;
        }
        playerIndexSet.add(playerIndex);
    }
    for (const unitData of mapRawData.getUnitDataArray()) {
        const playerIndex = unitData.getPlayerIndex() ?? 0;
        if ((playerIndex < PlayerIndex.First)     ||
            (playerIndex > playersCountUnneutral)
        ) {
            return ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_02;
        }
        playerIndexSet.add(playerIndex);
    }

    for (const playerIndex of playerIndexSet) {
        if ((playerIndex > PlayerIndex.First) &&
            (!playerIndexSet.has(playerIndex - 1))
        ) {
            return ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_03;
        }
    }

    if (Math.max(...playerIndexSet) !== playersCountUnneutral) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_04;
    }

    return ClientErrorCode.NoError;
}
function checkIsEveryWarEventInUse(warEventFullData: Undefinable<WarEventFullData>, templateWarRuleArray: TemplateWarRule[]): boolean {  // DONE
    const eventArray = warEventFullData?.getEventArray();
    return (!eventArray?.length)
        || (eventArray.every(warEvent => {
            const eventId = warEvent.getEventId();
            return (eventId != null) && (templateWarRuleArray.some(v => (v.getWarEventIdArray().indexOf(eventId) ?? -1) >= 0));
        }));
}
function getErrorCodeForUnitArray(unitArray: Undefinable<SerialUnit[]>): ClientErrorCode {
    if (!checkIsUnitIdCompact(unitArray?.map(v => v.getUnitId()) ?? [])) {
        return ClientErrorCode.MeHelpers_GetErrorCodeForUnitArray_00;
    }

    return ClientErrorCode.NoError;
}
