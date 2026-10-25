import { checkIsRedForRegistration } from "../../autoTourneys/mains/Provider.ts";
import { checkIsRed } from "../../autoTourneys/rooms/Provider.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { checkIsRed as CoopCustomRoomModelCcrModelCheckIsRed } from "../../coopCustomRoom/model/CcrModel.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { checkIsAnyPromiseTrue } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getGameModeName, getGameModeHelpText } from "../../lang/Utils.ts";
import { checkIsRed as MailModelMailModelCheckIsRed } from "../../mail/model/MailModel.ts";
import { checkIsRed as MultiCustomRoomModelMcrModelCheckIsRed } from "../../multiCustomRoom/model/McrModel.ts";
import { checkIsRed as MultiFreeRoomModelMfrModelCheckIsRed } from "../../multiFreeRoom/model/MfrModel.ts";
import { checkIsRed as MultiMatchRoomModelMmrModelCheckIsRed } from "../../multiMatchRoom/model/MmrModel.ts";
import {
    checkIsRedForMyMrwWars,
    checkIsRedForMyMcwWars,
    checkIsRedForMyMfwWars,
    checkIsRedForMyCcwWars,
    checkIsRedForMyMmwWars,
    checkIsRedForMyAtwWars,
} from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed as MultiRankRoomModelMrrModelCheckIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { checkIsRedForMapManagement } from "../../normalMap/model/NormalMapModel.ts";
import { checkIsRed as WatchWarModelWwModelCheckIsRed } from "../../watchWar/model/WwModel.ts";

export async function checkIsRedForStartButton(): Promise<boolean> {
    if (checkHasUnreadMessage()) {
        return true;
    }

    return checkIsAnyPromiseTrue([
        checkIsRedForMultiPlayer(true),
        checkIsRedForGameSettings(),
    ]);
}

export async function checkIsRedForGameSettings(): Promise<boolean> {
    if (MailModelMailModelCheckIsRed()) {
        return true;
    }

    return checkIsAnyPromiseTrue([
        checkIsRedForMapManagement(),
    ]);
}

export async function checkIsRedForMultiPlayer(includeRanked = false): Promise<boolean> {
    const promiseArray = [
        checkIsRedForMultiCustomMode(),
        checkIsRedForMultiFreeMode(),
        checkIsRedForMultiCoopMode(),
        checkIsRedForMultiMatchMode(),
        checkIsRedForAutoTourneyMode(),
    ];
    if (includeRanked) {
        promiseArray.push(checkIsRedForRankedMode());
    }
    return checkIsAnyPromiseTrue(promiseArray);
}

export async function checkIsRedForRankedMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyMrwWars(),
        MultiRankRoomModelMrrModelCheckIsRed(),
    ]);
}

export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyMcwWars(),
        MultiCustomRoomModelMcrModelCheckIsRed(),
        WatchWarModelWwModelCheckIsRed(),
    ]);
}

export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyMfwWars(),
        MultiFreeRoomModelMfrModelCheckIsRed(),
    ]);
}

export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyCcwWars(),
        CoopCustomRoomModelCcrModelCheckIsRed(),
    ]);
}

export async function checkIsRedForMultiMatchMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyMmwWars(),
        MultiMatchRoomModelMmrModelCheckIsRed(),
    ]);
}

export function checkIsRedForAutoTourneyMode(): Promise<boolean> {
    return checkIsAnyPromiseTrue([
        checkIsRedForMyAtwWars(),
        checkIsRed(),
        checkIsRedForRegistration(),
    ]);
}

export function openMultiPlayerModePanel(currentMode: ModeId): void {
    openPanel(getDict().CommonChooseSingleNumberPanel, {
        availableNumberArray    : [
            ModeId.Versus,
            ModeId.Coop,
            ModeId.Free,
            ModeId.UnrankedMatch,
            ModeId.RankedMatch,
            ModeId.AutoTourney,
        ],
        currentNumber           : currentMode,
        keepOrder               : true,
        getTitleText            : () => getText(TextType.B1013) ?? UndefinedError,
        getNumberMainText           : mode => getGameModeName(mode) ?? UndefinedError,
        getNumberHelpText       : mode => getGameModeHelpText(mode) ?? UndefinedError,
        checkIsNumberRed        : mode => {
            switch (mode) {
                case ModeId.Versus           : return checkIsRedForMultiCustomMode();
                case ModeId.Coop             : return checkIsRedForMultiCoopMode();
                case ModeId.Free             : return checkIsRedForMultiFreeMode();
                case ModeId.UnrankedMatch    : return checkIsRedForMultiMatchMode();
                case ModeId.RankedMatch      : return checkIsRedForRankedMode();
                case ModeId.AutoTourney   : return checkIsRedForAutoTourneyMode();
                default                                             : return false;
            }
        },
        callbackOnConfirm       : mode => {
            if (currentMode !== mode) {
                closePanel(getDict().McrMainMenuPanel);
                closePanel(getDict().MfrMainMenuPanel);
                closePanel(getDict().CcrMainMenuPanel);
                closePanel(getDict().MmrMainMenuPanel);
                closePanel(getDict().MrrMainMenuPanel);
                closePanel(getDict().AtrMainMenuPanel);

                switch (mode) {
                    case ModeId.Versus           : openPanel(getDict().McrMainMenuPanel, void 0); return;
                    case ModeId.Coop             : openPanel(getDict().CcrMainMenuPanel, void 0); return;
                    case ModeId.Free             : openPanel(getDict().MfrMainMenuPanel, void 0); return;
                    case ModeId.UnrankedMatch    : openPanel(getDict().MmrMainMenuPanel, void 0); return;
                    case ModeId.RankedMatch      : openPanel(getDict().MrrMainMenuPanel, void 0); return;
                    case ModeId.AutoTourney   : openPanel(getDict().AtrMainMenuPanel, void 0); return;
                }
            }
        }
    });
}
