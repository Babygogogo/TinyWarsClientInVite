import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as DialoguesConstants from "../Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForAside from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForCoDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type MapSimpleDialogueSchema            = ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue;

export function getErrorCode(data: MapSimpleDialogueSchema, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): UtilsClientErrorCode.ClientErrorCode {
    if (data == null) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_00;
    }

    const dataArray = data.getDataArray();
    if (dataArray == null) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_01;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > DialoguesConstants.Common.MaxCount)) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_02;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!LangUtils.checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : DialoguesConstants.Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_03;
        }
    }

    for (const dialogueData of dataArray) {
        // if (Object.keys(dialogueData).length !== 1) {
        //     return ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_04;
        // }

        {
            const subData = dialogueData.getDataForCoDialogue();
            if (subData) {
                const errorCode = getErrorCodeForDataForCoDialogue(subData, playersCountUnneutral, gameConfig);
                if (errorCode) {
                    return errorCode;
                }
            }
        }

        {
            const subData = dialogueData.getDataForAside();
            if (subData) {
                const errorCode = getErrorCodeForDataForAside(subData);
                if (errorCode) {
                    return errorCode;
                }
            }
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForDataForCoDialogue(data: ProtoSchemaCommonProtoMapMapSimpleDialogueDataForCoDialogue.DataForCoDialogue, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): UtilsClientErrorCode.ClientErrorCode {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_00;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === PlayersConstants.PlayerIndex.Neutral) || (!PlayersUtilsCommon.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_01;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_02;
    }

    const side = data.getSide();
    if ((side !== DialoguesConstants.SmallDialogueSideId.Top)     &&
        (side !== DialoguesConstants.SmallDialogueSideId.Bottom)
    ) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_03;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_04;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getNameArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxNameLength,
        minTextCount    : 0,
    })) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_05;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForDataForAside(data: ProtoSchemaCommonProtoMapMapSimpleDialogueDataForAside.DataForAside): UtilsClientErrorCode.ClientErrorCode {
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_00;
    }

    const side = data.getSide();
    if ((side !== DialoguesConstants.SmallDialogueSideId.Bottom) && (side !== DialoguesConstants.SmallDialogueSideId.Top)) {
        return UtilsClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_01;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function getDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<MapSimpleDialogueSchema>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    } else {
        const coIdSet           = new Set<number>();
        const playerIndexSet    = new Set<number>();
        for (const dialogueData of data.getDataArray()) {
            const coId = dialogueData.getDataForCoDialogue()?.getCoId();
            (coId != null) && (coIdSet.add(coId));

            const playerIndex = dialogueData.getDataForCoDialogue()?.getPlayerIndex();
            (playerIndex != null) && (playerIndexSet.add(playerIndex));
        }

        const coNameArray: string[] = [];
        for (const coId of coIdSet) {
            coNameArray.push(gameConfig.getCoNameAndTierText(coId) ?? LangConstants.UndefinedError);
        }
        for (const playerIndex of playerIndexSet) {
            coNameArray.push(`P${playerIndex}`);
        }

        return LangUtils.getFormattedText(LangConstants.TextType.F0085, coNameArray.join(`, `));
    }
}

export function getErrorTip(data: MapSimpleDialogueSchema, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > DialoguesConstants.Common.MaxCount)) {
        return `${LangUtils.getText(LangConstants.TextType.A0227)} (${dialoguesCount} / ${DialoguesConstants.Common.MaxCount})`;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!LangUtils.checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : DialoguesConstants.Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0162));
        }
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForDataForDialogue(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForDataForDialogue(dialogueData: ProtoSchemaCommonProtoMapMapSimpleDialogueDataForDialogue.DataForDialogue, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (getErrorCodeForDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return LangUtils.getText(LangConstants.TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (getErrorCodeForDataForAside(dataForAside)) {
                return LangUtils.getText(LangConstants.TextType.A0232);
            }

            return null;
        }
    }

    return LangUtils.getText(LangConstants.TextType.A0230);
}
