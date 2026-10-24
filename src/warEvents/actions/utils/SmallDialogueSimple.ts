import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DialoguesConstants from "../../../dialogues/Constants.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForAside from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForAside.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForCoDialogue from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForCoDialogue.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";

type WeaSmallDialogueSimple             = ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple.WeaSmallDialogueSimple;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): boolean {
    if (action == null) {
        return false;
    }

    const dataArray = action.getDataArray();
    if (dataArray == null) {
        return false;
    }

    const dialogueCount = dataArray.length;
    if ((dialogueCount <= 0) || (dialogueCount > DialoguesConstants.Common.MaxCount)) {
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
function checkIsValidDataForCoDialogue(data: ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForCoDialogue.DataForCoDialogue, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): boolean {
    const coId = data.getCoId();
    if (coId != null) {
        if (gameConfig.getCoBasicCfg(coId) == null) {
            return false;
        }
    }

    const playerIndex = data.getPlayerIndex();
    if (playerIndex != null) {
        if ((playerIndex === PlayersConstants.PlayerIndex.Neutral) || (!PlayersUtilsCommon.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))) {
            return false;
        }
    }

    if ((coId == null) && (playerIndex == null)) {
        return false;
    }

    const side = data.getSide();
    if ((side !== DialoguesConstants.BigDialogueSideId.Left) &&
        (side !== DialoguesConstants.BigDialogueSideId.Right)
    ) {
        return false;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return false;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getNameArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxNameLength,
        minTextCount    : 0,
    })) {
        return false;
    }

    return true;
}
function checkIsValidDataForAside(data: ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForAside.DataForAside): boolean {
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextLength   : 1,
        maxTextLength   : DialoguesConstants.Common.MaxTextLength,
        minTextCount    : 1,
    })) {
        return false;
    }

    const side = data.getSide();
    if ((side !== DialoguesConstants.SmallDialogueSideId.Bottom) && (side !== DialoguesConstants.SmallDialogueSideId.Top)) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, gameConfig: GameConfigGcData.GcData): string | null {
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
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSmallDialogueSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaSmallDialogueSimple, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    const dialoguesArray    = data.getDataArray();
    const dialoguesCount    = dialoguesArray.length;
    if ((dialoguesCount <= 0) || (dialoguesCount > DialoguesConstants.Common.MaxCount)) {
        return `${LangUtils.getText(LangConstants.TextType.A0227)} (${dialoguesCount} / ${DialoguesConstants.Common.MaxCount})`;
    }

    for (let i = 0; i < dialoguesCount; ++i) {
        if (getErrorTipForWeaSimpleDialogueData(dialoguesArray[i], playersCountUnneutral, gameConfig)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0071, i);
        }
    }

    return null;
}
export function getErrorTipForWeaSimpleDialogueData(dialogueData: ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue.DataForDialogue, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    // if (Object.keys(dialogueData).length !== 1) {
    //     return Lang.getText(LangTextType.A0230);
    // }

    {
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        if (dataForCoDialogue) {
            if (!checkIsValidDataForCoDialogue(dataForCoDialogue, playersCountUnneutral, gameConfig)) {
                return LangUtils.getText(LangConstants.TextType.A0231);
            }
            return null;
        }
    }

    {
        const dataForAside = dialogueData.getDataForAside();
        if (dataForAside) {
            if (!checkIsValidDataForAside(dataForAside)) {
                return LangUtils.getText(LangConstants.TextType.A0232);
            }

            return null;
        }
    }

    return LangUtils.getText(LangConstants.TextType.A0230);
}

export async function applyWithExtraData(action: WeaSmallDialogueSimple, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSmallDialogueSimple, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    return new Promise<void>(resolve => {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwSmallDialoguePanel, {
            war             : war,
            actionData      : action,
            callbackOnClose : () => resolve(),
        });
    });
}
