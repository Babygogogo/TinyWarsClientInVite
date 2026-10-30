import {
    Lang_Utils,
    Players_Utils_Common,
    Utils_ClientErrorCode,
    Dialogues_Constants,
    Players_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { DataForAside } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import type { DataForCoDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";

export function getErrorCode(data: MapSimpleDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
    if (data == null) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_00;
    }

    const dataArray = data.getDataArray();
    if (dataArray == null) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_01;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > Dialogues_Constants.Common.MaxCount)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_02;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!Lang_Utils.checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : Dialogues_Constants.Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCode_03;
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

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForDataForCoDialogue(data: DataForCoDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_00;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === Players_Constants.PlayerIndex.Neutral) || (!Players_Utils_Common.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_01;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_02;
    }

    const side = data.getSide();
    if ((side !== Dialogues_Constants.SmallDialogueSideId.Top)     &&
        (side !== Dialogues_Constants.SmallDialogueSideId.Bottom)
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_03;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Dialogues_Constants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_04;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : data.getNameArray(),
        minTextLength   : 1,
        maxTextLength   : Dialogues_Constants.Common.MaxNameLength,
        minTextCount    : 0,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForCoDialogue_05;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
function getErrorCodeForDataForAside(data: DataForAside): Utils_ClientErrorCode.ClientErrorCode {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Dialogues_Constants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_00;
    }

    const side = data.getSide();
    if ((side !== Dialogues_Constants.SmallDialogueSideId.Bottom) && (side !== Dialogues_Constants.SmallDialogueSideId.Top)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhMapSimpleDialogue_GetErrorCodeForDataForAside_01;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function getDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapSimpleDialogue>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
            coNameArray.push(gameConfig.getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError);
        }
        for (const playerIndex of playerIndexSet) {
            coNameArray.push(`P${playerIndex}`);
        }

        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0085, coNameArray.join(`, `));
    }
}

export function getErrorTip(data: MapSimpleDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > Dialogues_Constants.Common.MaxCount)) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0227)} (${dialoguesCount} / ${Dialogues_Constants.Common.MaxCount})`;
    }

    {
        const dialogueNameArray = data.getDialogueNameArray();
        if ((dialogueNameArray == null)                                     ||
            (!Lang_Utils.checkIsValidLanguageTextArray({
                list            : dialogueNameArray,
                maxTextLength   : Dialogues_Constants.Common.DialogueNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0162));
        }
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForDataForDialogue(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForDataForDialogue(dialogueData: DataForDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (getErrorCodeForDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (getErrorCodeForDataForAside(dataForAside)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0232);
            }

            return null;
        }
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0230);
}
