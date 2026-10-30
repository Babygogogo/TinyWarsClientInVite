import {
    Dialogues_Constants,
    Sounds_Utils,
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
import type { WeaBigDialogueSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import type { DataForAside } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForAside.ts";
import type { DataForCoDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForDialogue.ts";
import type { DataForMisc } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaBigDialogueSimple>, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    if (action == null) {
        return false;
    }

    const backgroundId = action.getBackgroundId();
    if ((backgroundId != null) && (backgroundId > Dialogues_Constants.Common.BackgroundMaxId)) {
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

        {
            const subData = data.getDataForMisc();
            if ((subData) && (!checkIsValidDataForMisc(subData))) {
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

    return true;
}
function checkIsValidDataForMisc(data: DataForMisc): boolean {
    {
        const dataForPlayBgm = data.getDataForPlayBgm();
        if ((dataForPlayBgm) && (!Sounds_Utils.checkIsBgm(dataForPlayBgm.getBgmCode() ?? 0))) {
            return false;
        }
    }

    {
        const dataForPlaySfx = data.getDataForPlaySfx();
        if ((dataForPlaySfx) && (!Sounds_Utils.checkIsSfx(dataForPlaySfx.getSfxCode() ?? 0))) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaBigDialogueSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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

        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0070, coNameArray.join(`, `));
    }
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaBigDialogueSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaBigDialogueSimple, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    const backgroundId = data.getBackgroundId();
    if ((backgroundId != null) && (backgroundId > Dialogues_Constants.Common.BackgroundMaxId)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0258);
    }

    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > Dialogues_Constants.Common.MaxCount)) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0227)} (${dialoguesCount} / ${Dialogues_Constants.Common.MaxCount})`;
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForWeaDialogueData(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForWeaDialogueData(dialogueData: DataForDialogue, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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

    {
        const data = dialogueData.getDataForMisc();
        if (data) {
            if (!checkIsValidDataForMisc(data)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0496);
            }

            return null;
        }
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0230);
}

export async function applyWithExtraData(action: WeaBigDialogueSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaBigDialogueSimple, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    return new Promise<void>(resolve => {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBigDialoguePanel, {
            war             : war,
            actionData      : action,
            callbackOnClose : () => resolve(),
        });
    });
}
