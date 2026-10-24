import * as AutoTourneysMainsProvider from "../../autoTourneys/mains/Provider.ts";
import * as AutoTourneysRoomsProvider from "../../autoTourneys/rooms/Provider.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MailModelMailModel from "../../mail/model/MailModel.ts";
import * as MultiCustomRoomModelMcrModel from "../../multiCustomRoom/model/McrModel.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiMatchRoomModelMmrModel from "../../multiMatchRoom/model/MmrModel.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as MultiRankRoomModelMrrModel from "../../multiRankRoom/model/MrrModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";

export async function checkIsRedForStartButton(): Promise<boolean> {
    if (ChatModel.checkHasUnreadMessage()) {
        return true;
    }

    return HelpersMisc.checkIsAnyPromiseTrue([
        checkIsRedForMultiPlayer(true),
        checkIsRedForGameSettings(),
    ]);
}

export async function checkIsRedForGameSettings(): Promise<boolean> {
    if (MailModelMailModel.checkIsRed()) {
        return true;
    }

    return HelpersMisc.checkIsAnyPromiseTrue([
        NormalMapModelNormalMapModel.checkIsRedForMapManagement(),
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
    return HelpersMisc.checkIsAnyPromiseTrue(promiseArray);
}

export async function checkIsRedForRankedMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyMrwWars(),
        MultiRankRoomModelMrrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyMcwWars(),
        MultiCustomRoomModelMcrModel.checkIsRed(),
        WatchWarModelWwModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyMfwWars(),
        MultiFreeRoomModelMfrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyCcwWars(),
        CoopCustomRoomModelCcrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiMatchMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyMmwWars(),
        MultiMatchRoomModelMmrModel.checkIsRed(),
    ]);
}

export function checkIsRedForAutoTourneyMode(): Promise<boolean> {
    return HelpersMisc.checkIsAnyPromiseTrue([
        MultiPlayerWarModelMpwModel.checkIsRedForMyAtwWars(),
        AutoTourneysRoomsProvider.checkIsRed(),
        AutoTourneysMainsProvider.checkIsRedForRegistration(),
    ]);
}

export function openMultiPlayerModePanel(currentMode: GameModesConstants.ModeId): void {
    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
        availableNumberArray    : [
            GameModesConstants.ModeId.Versus,
            GameModesConstants.ModeId.Coop,
            GameModesConstants.ModeId.Free,
            GameModesConstants.ModeId.UnrankedMatch,
            GameModesConstants.ModeId.RankedMatch,
            GameModesConstants.ModeId.AutoTourney,
        ],
        currentNumber           : currentMode,
        keepOrder               : true,
        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1013) ?? LangConstants.UndefinedError,
        getNumberMainText           : mode => LangUtils.getGameModeName(mode) ?? LangConstants.UndefinedError,
        getNumberHelpText       : mode => LangUtils.getGameModeHelpText(mode) ?? LangConstants.UndefinedError,
        checkIsNumberRed        : mode => {
            switch (mode) {
                case GameModesConstants.ModeId.Versus           : return checkIsRedForMultiCustomMode();
                case GameModesConstants.ModeId.Coop             : return checkIsRedForMultiCoopMode();
                case GameModesConstants.ModeId.Free             : return checkIsRedForMultiFreeMode();
                case GameModesConstants.ModeId.UnrankedMatch    : return checkIsRedForMultiMatchMode();
                case GameModesConstants.ModeId.RankedMatch      : return checkIsRedForRankedMode();
                case GameModesConstants.ModeId.AutoTourney   : return checkIsRedForAutoTourneyMode();
                default                                             : return false;
            }
        },
        callbackOnConfirm       : mode => {
            if (currentMode !== mode) {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().McrMainMenuPanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().MfrMainMenuPanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CcrMainMenuPanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().MmrMainMenuPanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().MrrMainMenuPanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().AtrMainMenuPanel);

                switch (mode) {
                    case GameModesConstants.ModeId.Versus           : GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0); return;
                    case GameModesConstants.ModeId.Coop             : GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrMainMenuPanel, void 0); return;
                    case GameModesConstants.ModeId.Free             : GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrMainMenuPanel, void 0); return;
                    case GameModesConstants.ModeId.UnrankedMatch    : GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrMainMenuPanel, void 0); return;
                    case GameModesConstants.ModeId.RankedMatch      : GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0); return;
                    case GameModesConstants.ModeId.AutoTourney   : GamePanelsManager.openPanel(GamePanelsDict.getDict().AtrMainMenuPanel, void 0); return;
                }
            }
        }
    });
}
