import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { Common, SmallDialogueSideId } from "../Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getFormattedText, getText } from "../../lang/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { checkIsValidPlayerIndex } from "../../players/utils/Common.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { DataForAside } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import type { DataForCoDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type MapSimpleDialogueSchema            = MapSimpleDialogue;

export function getErrorCode(data: MapSimpleDialogueSchema, playersCountUnneutral: number, gameConfig: GcData): ClientErrorCode {
    if (data == null) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_00;
    }

    const dataArray = data.getDataArray();
    if (dataArray == null) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_01;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > Common.MaxCount)) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_02;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_03;
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

    return ClientErrorCode.NoError;
}
function getErrorCodeForDataForCoDialogue(data: DataForCoDialogue, playersCountUnneutral: number, gameConfig: GcData): ClientErrorCode {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_00;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === PlayerIndex.Neutral) || (!checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_01;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_02;
    }

    const side = data.getSide();
    if ((side !== SmallDialogueSideId.Top)     &&
        (side !== SmallDialogueSideId.Bottom)
    ) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_03;
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_04;
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getNameArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxNameLength,
        minTextCount    : 0,
    })) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_05;
    }

    return ClientErrorCode.NoError;
}
function getErrorCodeForDataForAside(data: DataForAside): ClientErrorCode {
    if (!checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_00;
    }

    const side = data.getSide();
    if ((side !== SmallDialogueSideId.Bottom) && (side !== SmallDialogueSideId.Top)) {
        return ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_01;
    }

    return ClientErrorCode.NoError;
}

export function getDesc(data: Undefinable<MapSimpleDialogueSchema>, gameConfig: GcData): string | null {
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
            coNameArray.push(gameConfig.getCoNameAndTierText(coId) ?? UndefinedError);
        }
        for (const playerIndex of playerIndexSet) {
            coNameArray.push(`P${playerIndex}`);
        }

        return getFormattedText(TextType.F0085, coNameArray.join(`, `));
    }
}

export function getErrorTip(data: MapSimpleDialogueSchema, playersCountUnneutral: number, gameConfig: GcData): string | null {
    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > Common.MaxCount)) {
        return `${getText(TextType.A0227)} (${dialoguesCount} / ${Common.MaxCount})`;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B0162));
        }
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForDataForDialogue(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return getFormattedText(TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForDataForDialogue(dialogueData: DataForDialogue, playersCountUnneutral: number, gameConfig: GcData): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (getErrorCodeForDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return getText(TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (getErrorCodeForDataForAside(dataForAside)) {
                return getText(TextType.A0232);
            }

            return null;
        }
    }

    return getText(TextType.A0230);
}
