import {
    Dialogues_Constants,
    Lang_Utils,
    Players_Utils_Common,
    GamePanels_Dict,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSmallDialogueSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import type { DataForAside } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForAside.ts";
import type { DataForCoDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    if (action == null) {
        return false;
    }

    const dataArray = action.getDataArray();
    if (dataArray == null) {
        return false;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > Dialogues_Constants.Common.MaxCount)) {
        return false;
    }

    for (const data of dataArray) {
        // if (Object.keys(data).length !== 1) {
        //     return false;
        // }

        {
            const subData = data.getDataForCoDialogue();
            if ((subData) && (!checkIsValidDataForCoDialogue(subData, playersCountUnneutral, gameConfig))) {
                return false;
            }
        }

        {
            const subData = data.getDataForAside();
            if ((subData) && (!checkIsValidDataForAside(subData))) {
                return false;
            }
        }
    }

    return true;
}
function checkIsValidDataForCoDialogue(data: DataForCoDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return false;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === Players_Constants.PlayerIndex.Neutral) || (!Players_Utils_Common.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return false;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return false;
    }

    const side = data.getSide();
    if ((side !== Dialogues_Constants.BigDialogueSideId.Left) &&
        (side !== Dialogues_Constants.BigDialogueSideId.Right)
    ) {
        return false;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getTextArray(),
        minTextLength : 1,
        maxTextLength : Dialogues_Constants.Common.MaxTextLength,
        minTextCount  : 1,
    })) {
        return false;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getNameArray(),
        minTextLength : 1,
        maxTextLength : Dialogues_Constants.Common.MaxNameLength,
        minTextCount  : 0,
    })) {
        return false;
    }

    return true;
}
function checkIsValidDataForAside(data: DataForAside): boolean {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getTextArray(),
        minTextLength : 1,
        maxTextLength : Dialogues_Constants.Common.MaxTextLength,
        minTextCount  : 1,
    })) {
        return false;
    }

    const side = data.getSide();
    if ((side !== Dialogues_Constants.SmallDialogueSideId.Bottom) && (side !== Dialogues_Constants.SmallDialogueSideId.Top)) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSmallDialogueSimple, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > Dialogues_Constants.Common.MaxCount)) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0227)} (${dialoguesCount} / ${Dialogues_Constants.Common.MaxCount})`;
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForWeaSimpleDialogueData(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForWeaSimpleDialogueData(dialogueData: DataForDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (!checkIsValidDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (!checkIsValidDataForAside(dataForAside)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0232);
            }

            return null;
        }
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0230);
}

export async function applyWithExtraData(action: WeaSmallDialogueSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSmallDialogueSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    return new Promise<void>(resolve => {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwSmallDialoguePanel, {
            war             : war,
            actionData      : action,
            callbackOnClose : () => resolve(),
        });
    });
}
