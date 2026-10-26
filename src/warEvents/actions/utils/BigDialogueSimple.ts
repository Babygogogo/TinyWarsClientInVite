import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Common, BigDialogueSideId } from "../../../dialogues/Constants.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { UndefinedError, TextType } from "../../../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getFormattedText, getText } from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import { checkIsValidPlayerIndex } from "../../../players/utils/Common.ts";
import type { WeaBigDialogueSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import type { DataForAside } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForAside.ts";
import type { DataForCoDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForDialogue.ts";
import type { DataForMisc } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc.ts";
import { checkIsBgm, checkIsSfx } from "../../../sounds/Utils.ts";

export function checkIsValid(action: Undefinable<WeaBigDialogueSimple>, playersCountUnneutral: number, gameConfig: GcData): boolean {
    if (action == null) {
        return false;
    }

    const backgroundId = action.getBackgroundId();
    if ((backgroundId != null) && (backgroundId > Common.BackgroundMaxId)) {
        return false;
    }

    const dataArray = action.getDataArray();
    if (dataArray == null) {
        return false;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > Common.MaxCount)) {
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
function checkIsValidDataForCoDialogue(data: DataForCoDialogue, playersCountUnneutral: number, gameConfig: GcData): boolean {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return false;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === PlayerIndex.Neutral) || (!checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return false;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return false;
    }

    const side = data.getSide();
    if ((side !== BigDialogueSideId.Left) &&
        (side !== BigDialogueSideId.Right)
    ) {
        return false;
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return false;
    }

    if (!checkIsValidLanguageTextArray({
        list            : data.getNameArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxNameLength,
        minTextCount    : 0,
    })) {
        return false;
    }

    return true;
}
function checkIsValidDataForAside(data: DataForAside): boolean {
    if (!checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return false;
    }

    return true;
}
function checkIsValidDataForMisc(data: DataForMisc): boolean {
    {
        const dataForPlayBgm = data.getDataForPlayBgm();
        if ((dataForPlayBgm) && (!checkIsBgm(dataForPlayBgm.getBgmCode() ?? 0))) {
            return false;
        }
    }

    {
        const dataForPlaySfx = data.getDataForPlaySfx();
        if ((dataForPlaySfx) && (!checkIsSfx(dataForPlaySfx.getSfxCode() ?? 0))) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaBigDialogueSimple>, gameConfig: GcData): string | null {
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

        return getFormattedText(TextType.F0070, coNameArray.join(`, `));
    }
}
export function getDetailDesc(data: Undefinable<WeaBigDialogueSimple>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaBigDialogueSimple, playersCountUnneutral: number, gameConfig: GcData): string | null {
    const backgroundId = data.getBackgroundId();
    if ((backgroundId != null) && (backgroundId > Common.BackgroundMaxId)) {
        return getText(TextType.A0258);
    }

    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > Common.MaxCount)) {
        return `${getText(TextType.A0227)} (${dialoguesCount} / ${Common.MaxCount})`;
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForWeaDialogueData(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return getFormattedText(TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForWeaDialogueData(dialogueData: DataForDialogue, playersCountUnneutral: number, gameConfig: GcData): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (!checkIsValidDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return getText(TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (!checkIsValidDataForAside(dataForAside)) {
                return getText(TextType.A0232);
            }

            return null;
        }
    }

    {
        const data = dialogueData.getDataForMisc();
        if (data) {
            if (!checkIsValidDataForMisc(data)) {
                return getText(TextType.A0496);
            }

            return null;
        }
    }

    return getText(TextType.A0230);
}

export async function applyWithExtraData(action: WeaBigDialogueSimple, isFast: boolean, war: IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaBigDialogueSimple, isFast: boolean, war: IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    return new Promise<void>(resolve => {
        openPanel(getDict().BwBigDialoguePanel, {
            war             : war,
            actionData      : action,
            callbackOnClose : () => resolve(),
        });
    });
}
