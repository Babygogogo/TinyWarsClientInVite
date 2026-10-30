import {
    AutoTourneys_Rooms_Provider,
    CoopCustomRoom_Model_CcrModel,
    Chat_Model,
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    MultiPlayerWar_Model_MpwModel,
    AutoTourneys_Mains_Provider,
    Mail_Model_MailModel,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    MultiMatchRoom_Model_MmrModel,
    MultiRankRoom_Model_MrrModel,
    WatchWar_Model_WwModel,
    GamePanels_Manager,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Constants,
    Lang_Constants,
} from "../../internal.ts";

export async function checkIsRedForStartButton(): Promise<boolean> {
    if (Chat_Model.checkHasUnreadMessage()) {
        return true;
    }

    return Helpers_Misc.checkIsAnyPromiseTrue([
        checkIsRedForMultiPlayer(true),
        checkIsRedForGameSettings(),
    ]);
}

export async function checkIsRedForGameSettings(): Promise<boolean> {
    if (Mail_Model_MailModel.checkIsRed()) {
        return true;
    }

    return Helpers_Misc.checkIsAnyPromiseTrue([
        NormalMap_Model_NormalMapModel.checkIsRedForMapManagement(),
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
    return Helpers_Misc.checkIsAnyPromiseTrue(promiseArray);
}

export async function checkIsRedForRankedMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars(),
        MultiRankRoom_Model_MrrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyMcwWars(),
        MultiCustomRoom_Model_McrModel.checkIsRed(),
        WatchWar_Model_WwModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyMfwWars(),
        MultiFreeRoom_Model_MfrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyCcwWars(),
        CoopCustomRoom_Model_CcrModel.checkIsRed(),
    ]);
}

export async function checkIsRedForMultiMatchMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyMmwWars(),
        MultiMatchRoom_Model_MmrModel.checkIsRed(),
    ]);
}

export function checkIsRedForAutoTourneyMode(): Promise<boolean> {
    return Helpers_Misc.checkIsAnyPromiseTrue([
        MultiPlayerWar_Model_MpwModel.checkIsRedForMyAtwWars(),
        AutoTourneys_Rooms_Provider.checkIsRed(),
        AutoTourneys_Mains_Provider.checkIsRedForRegistration(),
    ]);
}

export function openMultiPlayerModePanel(currentMode: GameModes_Constants.ModeId): void {
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
        availableNumberArray    : [
            GameModes_Constants.ModeId.Versus,
            GameModes_Constants.ModeId.Coop,
            GameModes_Constants.ModeId.Free,
            GameModes_Constants.ModeId.UnrankedMatch,
            GameModes_Constants.ModeId.RankedMatch,
            GameModes_Constants.ModeId.AutoTourney,
        ],
        currentNumber           : currentMode,
        keepOrder               : true,
        getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1013),
        getNumberMainText           : mode => Lang_Utils.getGameModeName(mode) ?? Lang_Constants.UndefinedError,
        getNumberHelpText       : mode => Lang_Utils.getGameModeHelpText(mode) ?? Lang_Constants.UndefinedError,
        checkIsNumberRed        : mode => {
            switch (mode) {
                case GameModes_Constants.ModeId.Versus           : return checkIsRedForMultiCustomMode();
                case GameModes_Constants.ModeId.Coop             : return checkIsRedForMultiCoopMode();
                case GameModes_Constants.ModeId.Free             : return checkIsRedForMultiFreeMode();
                case GameModes_Constants.ModeId.UnrankedMatch    : return checkIsRedForMultiMatchMode();
                case GameModes_Constants.ModeId.RankedMatch      : return checkIsRedForRankedMode();
                case GameModes_Constants.ModeId.AutoTourney   : return checkIsRedForAutoTourneyMode();
                default                                             : return false;
            }
        },
        callbackOnConfirm       : mode => {
            if (currentMode !== mode) {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().McrMainMenuPanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MfrMainMenuPanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CcrMainMenuPanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MmrMainMenuPanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MrrMainMenuPanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().AtrMainMenuPanel);

                switch (mode) {
                    case GameModes_Constants.ModeId.Versus           : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0); return;
                    case GameModes_Constants.ModeId.Coop             : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrMainMenuPanel, void 0); return;
                    case GameModes_Constants.ModeId.Free             : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrMainMenuPanel, void 0); return;
                    case GameModes_Constants.ModeId.UnrankedMatch    : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrMainMenuPanel, void 0); return;
                    case GameModes_Constants.ModeId.RankedMatch      : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0); return;
                    case GameModes_Constants.ModeId.AutoTourney   : GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtrMainMenuPanel, void 0); return;
                }
            }
        }
    });
}
