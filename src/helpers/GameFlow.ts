import {
    Chat_Constants,
    GameConfigs_Provider,
    AutoTourneys_Mains_Gateway,
    Broadcasts_Gateway,
    Campaigns_Mains_Gateway,
    CoopCustomRoom_Model_CcrProxy,
    ChangeLogs_Gateway,
    Common_Model_CommonModel,
    Common_Model_CommonProxy,
    GameConfigs_Gateway,
    Campaigns_Managements_Gateway,
    Chat_Proxy,
    AutoTourneys_Rooms_Gateway,
    Maps_Constants,
    FloatText,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Interface_IBwWar,
    Notifications_Dispatcher,
    Networks_Manager,
    SinglePlayerWar_Model_SpwModel,
    ResManager,
    GamePanels_Manager,
    Lang_CommonText,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Misc,
    HalfwayReplayWar_Model_HrwModel,
    MapEditor_Model_MeModel,
    MapEditor_Model_MeMfwModel,
    MapEditor_Model_MeSimModel,
    MultiPlayerWar_Model_MpwModel,
    ReplayWar_Model_RwModel,
    LocalData_Storage,
    Helpers_GameFlow,
    Helpers_Compatibility,
    LocalData_DeprecatedStorage,
    Gm_Model_GmProxy,
    Keyboard_KbManager,
    Leaderboard_Model_LeaderboardProxy,
    Mail_Model_MailProxy,
    MultiCustomRoom_Model_McrProxy,
    MapEditor_Model_MeProxy,
    MultiFreeRoom_Model_MfrProxy,
    MultiMatchRoom_Model_MmrProxy,
    MultiPlayerWar_Model_MpwProxy,
    MultiRankRoom_Model_MrrProxy,
    NormalMap_Model_NormalMapModel,
    NormalMap_Model_NormalMapProxy,
    ReplayWar_Model_RwProxy,
    SinglePlayerMode_Model_SpmModel,
    SinglePlayerMode_Model_SpmProxy,
    Stages_StageManager,
    Timer_TimerModel,
    Timer_TimerProxy,
    Networks_MessageCodes,
    MultiFreeRoom_Model_MfrRoomCreator,
    Sounds_SoundPlayer,
    Lang_Constants,
    Notifications_TypeId,
    type ReplayWar_View_RwReplayListPanel,
    Utils_ClientErrorCode,
    Users_Model,
    Ui_Utils_UiSizerHelpers,
    Users_Proxy,
    WatchWar_Model_WwProxy,
    Wars_Constants,
    Users_Constants,
    WarTypes_Constants,
    type Egret_Egret,
    MapEditor_Model_MeWar,
    TestWar_Model_TwWar,
} from "../internal.ts";

import type { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { GridMarkData } from "../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

const _NET_EVENTS = [
    { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonServerDisconnect, callback : _onMsgCommonServerDisconnect },
];
const _NOTIFY_EVENTS = [
    { type : Notifications_TypeId.TypeId.NetworkConnected,                callback : _onNotifyNetworkConnected },
    { type : Notifications_TypeId.TypeId.MsgUserLogin,                    callback : _onMsgUserLogin },
    { type : Notifications_TypeId.TypeId.MsgUserLoginAsGuest,             callback : _onMsgUserLoginAsGuest },
    { type : Notifications_TypeId.TypeId.MsgUserLogout,                   callback : _onMsgUserLogout },
    { type : Notifications_TypeId.TypeId.MsgCommonLatestConfigVersion,    callback : _onMsgCommonLatestConfigVersion },
];

let _hasOnceWentToLobby = false;

export function startGame(stage: Egret_Egret.Stage): void {
    bootUpTest();
    Networks_Manager.checkAndOverrideGameVersion();

    doStartGame(stage);
}
function bootUpTest(): void {
    if (window.CLIENT_VERSION !== "DEVELOP") {
        return;
    }
    console.warn("Boot Up Test begin.");

    const rawDict       = Lang_CommonText.CommonText;
    const dict          = new Map<string, Map<string, string>>();   // text1, text2, key
    const emptyIdSet    = new Set<string>();
    for (const key in rawDict) {
        const textArray = rawDict[key];
        const text1     = textArray[0];
        const text2     = textArray[1];
        const text3     = textArray[2];
        {
            if ((text1 == null) ||
                (text2 == null) ||
                (text3 == null) ||
                (!text1.length) ||
                (!text2.length) ||
                (!text3.length)
            ) {
                emptyIdSet.add(key);
            }
        }
        {
            if (!dict.has(text1)) {
                dict.set(text1, new Map());
            }

            const dict1 = Helpers_Misc.getExisted(dict.get(text1));
            if (!dict1.has(text2)) {
                dict1.set(text2, key);
            } else {
                console.warn(`duplicated text: ${dict1.get(text2)}, ${key}`);
            }
        }
    }

    {
        if (emptyIdSet.size) {
            console.log(`Empty text: `, [...emptyIdSet].join(`, `));
        }
    }

    console.warn("Boot Up Test end.");
}

async function doStartGame(stage: Egret_Egret.Stage): Promise<void> {
    initListenerForWindowOnError();

    Keyboard_KbManager.init();
    Helpers_Compatibility.init();
    Networks_Manager.addListeners(_NET_EVENTS);
    Notifications_Dispatcher.addEventListeners(_NOTIFY_EVENTS, Helpers_GameFlow);
    Ui_Utils_UiSizerHelpers.init();

    Stages_StageManager.init(stage);
    await Promise.all([
        LocalData_Storage.init(),
        LocalData_DeprecatedStorage.init(),
        ResManager.init(),
    ]);
    Stages_StageManager.setStageScale(LocalData_Storage.getStageScale());
    try {
        window.TW_APK_INJECT?.setScreenOrientation(LocalData_Storage.getScreenOrientation());
    } catch {
        // nothing to do
    }

    Lang_Utils.init();
    GameConfigs_Gateway.init();
    GameConfigs_Provider.init();
    Networks_Manager.init();
    MultiPlayerWar_Model_MpwProxy.init();
    MultiPlayerWar_Model_MpwModel.init();
    Timer_TimerProxy.init();
    Timer_TimerModel.init();
    Users_Proxy.init();
    Users_Model.init();
    NormalMap_Model_NormalMapProxy.init();
    NormalMap_Model_NormalMapModel.init();
    MultiCustomRoom_Model_McrProxy.init();
    MultiRankRoom_Model_MrrProxy.init();
    MultiMatchRoom_Model_MmrProxy.init();
    MultiFreeRoom_Model_MfrProxy.init();
    CoopCustomRoom_Model_CcrProxy.init();
    WatchWar_Model_WwProxy.init();
    ReplayWar_Model_RwProxy.init();
    ReplayWar_Model_RwModel.init();
    HalfwayReplayWar_Model_HrwModel.init();
    SinglePlayerMode_Model_SpmProxy.init();
    SinglePlayerMode_Model_SpmModel.init();
    SinglePlayerWar_Model_SpwModel.init();
    MapEditor_Model_MeProxy.init();
    MapEditor_Model_MeModel.init();
    Chat_Proxy.init();
    Common_Model_CommonProxy.init();
    Common_Model_CommonModel.init();
    Broadcasts_Gateway.init();
    ChangeLogs_Gateway.init();
    Mail_Model_MailProxy.init();
    Leaderboard_Model_LeaderboardProxy.init();
    AutoTourneys_Mains_Gateway.init();
    AutoTourneys_Rooms_Gateway.init();
    Campaigns_Mains_Gateway.init();
    Campaigns_Managements_Gateway.init();
    Gm_Model_GmProxy.init();

    _removeLoadingDom();
    gotoLogin();

    await ResManager.loadMainRes();
    (_checkCanFirstGoToLobby()) && (gotoLobby());
}

export function gotoLogin(): void {
    MultiPlayerWar_Model_MpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().UserLoginBackgroundPanel,
        GamePanels_Dict.getDict().UserLoginPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserLoginBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserLoginPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForLobby());
}
export function gotoLobby(): void {
    _hasOnceWentToLobby = true;

    MultiPlayerWar_Model_MpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();
    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BroadcastPanel,
        GamePanels_Dict.getDict().LobbyBackgroundPanel,
        GamePanels_Dict.getDict().LobbyBottomPanel,
        GamePanels_Dict.getDict().LobbyTopPanel,
        GamePanels_Dict.getDict().LobbyTopRightPanel,
        GamePanels_Dict.getDict().LobbyPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopRightPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyPanel, void 0);

    Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForLobby());
}

export async function gotoMultiPlayerWar(data: SerialWar): Promise<void> {
    const war = await MultiPlayerWar_Model_MpwModel.loadWar(data);
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BwBackgroundPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwTopPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwSidePanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ActionPlannerPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playCoBgmWithWar({
        war                            : war,
        force                          : true,
        coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoReplayWar(warData: SerialWar, replayId: number): Promise<void> {
    const war = await ReplayWar_Model_RwModel.loadWar(warData, replayId);
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    MultiPlayerWar_Model_MpwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BwBackgroundPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwTopPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ActionPlannerPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playCoBgmWithWar({
        war                            : war,
        force                          : true,
        coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoHalfwayReplayWar(warData: SerialWar): Promise<void> {
    const war = await HalfwayReplayWar_Model_HrwModel.loadWar(warData);
    ReplayWar_Model_RwModel.unloadWar();
    MultiPlayerWar_Model_MpwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BwBackgroundPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().HrwTopPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ActionPlannerPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playCoBgmWithWar({
        war                            : war,
        force                          : true,
        coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData, overridingBgmCode }: {
    slotIndex           : number | null;
    slotExtraData       : SpmWarSaveSlotExtraData | null;
    warData             : SerialWar;
    overridingBgmCode?  : number | null;
}): Promise<void> {
    const war = await SinglePlayerWar_Model_SpwModel.loadWar({ warData, slotIndex, slotExtraData });
    war.setOverridingBgmCode(overridingBgmCode ?? null);

    MultiPlayerWar_Model_MpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BwBackgroundPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpwTopPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpwSidePanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ActionPlannerPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playCoBgmWithWar({
        war                            : war,
        force                          : true,
        coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });

    await SinglePlayerWar_Model_SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
}
export async function gotoMapEditorWar({ mapRawData, slotIndex, isReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    mapRawData                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapRawData>;
    slotIndex                   : number;
    isReview                    : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<GridMarkData>;
 }): Promise<void> {
    const war = await MapEditor_Model_MeModel.loadWar({
        mapRawData                : mapRawData,
        slotIndex                 : slotIndex,
        isReview                  : isReview,
        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
        gridMarkData              : gridMarkData,
    });
    MultiPlayerWar_Model_MpwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BwBackgroundPanel,
        GamePanels_Dict.getDict().BroadcastPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTopPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ActionPlannerPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitBriefPanel, { war });
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);

    Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForMapEditor());
}

export function gotoMyWarListPanel(warType: WarTypes_Constants.WarTypeId): void {
    if ((warType === WarTypes_Constants.WarTypeId.AtwFog) || (warType === WarTypes_Constants.WarTypeId.AtwStd)    ||
        (warType === WarTypes_Constants.WarTypeId.CcwFog) || (warType === WarTypes_Constants.WarTypeId.CcwStd)    ||
        (warType === WarTypes_Constants.WarTypeId.McwFog) || (warType === WarTypes_Constants.WarTypeId.McwStd)    ||
        (warType === WarTypes_Constants.WarTypeId.MfwFog) || (warType === WarTypes_Constants.WarTypeId.MfwStd)    ||
        (warType === WarTypes_Constants.WarTypeId.MmwFog) || (warType === WarTypes_Constants.WarTypeId.MmwStd)    ||
        (warType === WarTypes_Constants.WarTypeId.MrwFog) || (warType === WarTypes_Constants.WarTypeId.MrwStd)
    ) {
        _gotoMpwMyWarListPanel();
    } else if (
        (warType === WarTypes_Constants.WarTypeId.ScwFog)  || (warType === WarTypes_Constants.WarTypeId.ScwStd)   ||
        (warType === WarTypes_Constants.WarTypeId.SfwFog)  || (warType === WarTypes_Constants.WarTypeId.SfwStd)   ||
        (warType === WarTypes_Constants.WarTypeId.SrwFog)  || (warType === WarTypes_Constants.WarTypeId.SrwStd)   ||
        (warType === WarTypes_Constants.WarTypeId.CampFog) || (warType === WarTypes_Constants.WarTypeId.CampStd)
    ) {
        _gotoSpmWarListPanel();
    } else if (warType === WarTypes_Constants.WarTypeId.Me) {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex     : 0,
            needConfirmOverwrite : false,
            needNonEmptySlot     : false,
            allowPlay            : true,
            getHelpText          : null,
            callback             : async slotIndex => {
                const mapEditorData             = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                const reviewStatus              = mapEditorData?.reviewStatus;
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (reviewStatus === Maps_Constants.ReviewStatus.Rejected) {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0305),
                        getContent : () => mapEditorData?.reviewComment || Lang_Utils.getText(Lang_Constants.TextType.None),
                        callback   : () => {
                            gotoMapEditorWar({
                                mapRawData                : Helpers_Misc.getExisted(mapEditorData?.mapRawData),
                                slotIndex                 : slotIndex,
                                isReview                  : false,
                                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                                gridMarkData              : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                } else if (reviewStatus === Maps_Constants.ReviewStatus.Accepted) {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0326),
                        getContent : () => mapEditorData?.reviewComment || Lang_Utils.getText(Lang_Constants.TextType.None),
                        callback   : () => {
                            gotoMapEditorWar({
                                mapRawData                : Helpers_Misc.getExisted(mapEditorData?.mapRawData),
                                slotIndex                 : slotIndex,
                                isReview                  : false,
                                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                                gridMarkData              : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                } else {
                    if (srcNormalMapIdForAddEvent == null) {
                        gotoMapEditorWar({
                            mapRawData                : mapEditorData?.mapRawData,
                            slotIndex                 : slotIndex,
                            isReview                  : false,
                            srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                            gridMarkData              : mapEditorData?.gridMarkData,
                        });
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0015),
                            callback   : () => {
                                gotoMapEditorWar({
                                    mapRawData                : mapEditorData?.mapRawData,
                                    slotIndex                 : slotIndex,
                                    isReview                  : false,
                                    srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                                    gridMarkData              : mapEditorData?.gridMarkData,
                                });
                            },
                        });
                    }
                }
            },
        });
    } else {
        throw Helpers_Misc.newError(`gotoMyWarListPanel() invalid warType: ${warType}.`, Utils_ClientErrorCode.ClientErrorCode.FlowManager_GotoMyWarListPanel_00);
    }
}
export function gotoRwReplayListPanel(openData?: ReplayWar_View_RwReplayListPanel.OpenData): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwReplayListPanel, openData ?? {
        filter               : null,
        usePreviousFilter    : true,
        usePreviousPageIndex : true,
    });
}
export function gotoWatchWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwOngoingWarsPanel, void 0);
}

export function gotoMcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrRoomInfoPanel, { roomId });
}
export function gotoCcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrRoomInfoPanel, { roomId });
}
export function gotoMfrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrRoomInfoPanel, { roomId });
}

export async function gotoMfrCreateSettingsPanel(warData: SerialWar): Promise<void> {
    MultiPlayerWar_Model_MpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BroadcastPanel,
        GamePanels_Dict.getDict().LobbyTopRightPanel,
        GamePanels_Dict.getDict().LobbyBackgroundPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopRightPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBackgroundPanel, void 0);

    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrCreateSettingsPanel, {
        roomCreator : new MultiFreeRoom_Model_MfrRoomCreator.MfrRoomCreator(
            await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())),
            warData,
        ),
    });

    Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForLobby());
}

export function gotoSrrCreateMapListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateMapListPanel, {
        mapFilter            : null,
        mapSorter            : null,
        usePreviousFilter    : true,
        usePreviousPageIndex : true,
    });
}

export function gotoCampaignCreateMapsPanel(campaignId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateMapsPanel, {
        campaignId : campaignId,
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Callbacks.
////////////////////////////////////////////////////////////////////////////////////////////////////
function _onNotifyNetworkConnected(): void {
    if ((_hasOnceWentToLobby) && (!Users_Model.getIsLoggedIn())) {
        {
            const account   = Users_Model.getSelfAccount();
            const password  = Users_Model.getSelfPassword();
            if ((account != null) && (password != null)) {
                Users_Proxy.reqLogin(account, password, true);
                return;
            }
        }

        {
            const guestUserId = Users_Model.getSelfGuestUserId();
            if (guestUserId != null) {
                Users_Proxy.reqUserLoginAsGuest(guestUserId, true);
                return;
            }
        }
    }
}

function _onMsgCommonServerDisconnect(): void {
    // _hasOnceWentToLobby = false;
    // UserModel.clearLoginInfo();
    // gotoLogin();

    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0025),
        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0020),
    });
}

function _onMsgUserLogin(): void {
    if (_checkCanFirstGoToLobby()) {
        gotoLobby();
    } else {
        const mcwWar = MultiPlayerWar_Model_MpwModel.getWar();
        if (mcwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwCommonSyncWar(mcwWar, Wars_Constants.SyncRequestTypeId.ReconnectionRequest);
        }
    }
}
function _onMsgUserLoginAsGuest(): void {
    _onMsgUserLogin();
}

function _onMsgUserLogout(): void {
    _hasOnceWentToLobby = false;
    Users_Model.updateOnMsgUserLogout();
    gotoLogin();
}

function _onMsgCommonLatestConfigVersion(): void {
    if (_checkCanFirstGoToLobby()) {
        gotoLobby();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Other private functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
function _checkCanFirstGoToLobby(): boolean {
    return (!_hasOnceWentToLobby)
        && (Users_Model.getIsLoggedIn())
        && (ResManager.checkIsLoadedMainResource());
}

function _removeLoadingDom(): void {
    const document = window.document;
    if (document) {
        const outLoadingLayer = document.getElementById("outLoadingLayer");
        (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
    }
}

export function unloadAllWarsAndOpenCommonPanels(): void {
    MultiPlayerWar_Model_MpwModel.unloadWar();
    ReplayWar_Model_RwModel.unloadWar();
    HalfwayReplayWar_Model_HrwModel.unloadWar();
    SinglePlayerWar_Model_SpwModel.unloadWar();
    MapEditor_Model_MeModel.unloadWar();

    GamePanels_Manager.closeAllPanelsExcept([
        GamePanels_Dict.getDict().BroadcastPanel,
        GamePanels_Dict.getDict().LobbyBackgroundPanel,
        GamePanels_Dict.getDict().LobbyTopRightPanel,
    ]);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBackgroundPanel, void 0);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopRightPanel, void 0);

    Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForLobby());
}

function _gotoMpwMyWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyWarListPanel, void 0);
}
function _gotoSpmWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmWarListPanel, void 0);
}

export function getOngoingWar(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar> {
    return (MultiPlayerWar_Model_MpwModel.getWar())
        ?? (ReplayWar_Model_RwModel.getWar())
        ?? (HalfwayReplayWar_Model_HrwModel.getWar())
        ?? (SinglePlayerWar_Model_SpwModel.getWar())
        ?? (MapEditor_Model_MeModel.getWar());
}

function initListenerForWindowOnError(): void {
    window.onerror = (message, filename, row, col, err) => {
        if (err) {
            showErrorText(`Code: ${(err as AuxiliaryTypes_AuxiliaryTypes.CustomError).errorCode ?? `--`}\n${message}\n${err.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unknown error.`);
        }
    };
    window.addEventListener('unhandledrejection', (err) => {
        const reason = err.reason;
        if (reason instanceof Error) {
            showErrorText(`Code: ${(reason as AuxiliaryTypes_AuxiliaryTypes.CustomError).errorCode ?? `--`}\n${reason.message}\n${reason.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unhandled rejection in promise, reason:\n${reason}`);
        }
    });
}
function showErrorText(text: string): void {
    console.warn(text);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonErrorPanel, {
        content : text,
    });
    Chat_Proxy.reqChatAddMessage(
        text.substring(0, Chat_Constants.Common.MaxErrorLength),
        Chat_Constants.ToCategoryId.Private,
        Users_Constants.Common.AdminUserId,
    );
}

export async function checkAndCreateSimulation(mapRawData: MapRawData, gridMarkData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<GridMarkData>): Promise<void> {
    const callbackForChosenWarRule = async () => {
        const warData   = MapEditor_Model_MeSimModel.getWarData();
        const errorCode = new TestWar_Model_TwWar.TwWar().getErrorCodeForInitForSfw(warData, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            FloatText.show(Lang_Utils.getErrorText(errorCode));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0931),
                callback   : () => {
                    warData.createIfNotExistsSettingsForSfw();
                    gotoSinglePlayerWar({
                        warData       : warData,
                        slotIndex     : null,
                        slotExtraData : SpmWarSaveSlotExtraData.fromJson({
                            mpwWarId              : war.getWarId(),
                            overridingSkinIdArray : [],
                            gridMarkData          : gridMarkData?.toJson(),
                        }),
                    });
                },
            });
        }
    };

    const war = new MapEditor_Model_MeWar.MeWar();
    await war.initWithMapRawData({
        mapRawData                : mapRawData,
        slotIndex                 : 0,
        gameConfig                : await GameConfigs_Provider.getLatestGameConfig(),
        srcNormalMapIdForAddEvent : null,
        gridMarkData              : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        MapEditor_Model_MeSimModel.resetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : null,
            availableNumberArray : templateWarRuleArray.map(v => v.getRuleId()),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1242),
            getNumberMainText    : ruleId => Lang_Utils.getLanguageText({ textArray : templateWarRuleArray.find(v => (v.getRuleId()) === ruleId)?.getRuleNameArray() }) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId()) === ruleId);
                if (warRule) {
                    MapEditor_Model_MeSimModel.resetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
export async function checkAndCreateMultiFreeWar(mapRawData: MapRawData): Promise<void> {
    const callbackForChosenWarRule = async () => {
        MapEditor_Model_MeMfwModel.reviseInstanceWarRuleForAi();
        const warData   = MapEditor_Model_MeMfwModel.getWarData();
        const errorCode = new TestWar_Model_TwWar.TwWar().getErrorCodeForInitForMfw(warData, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            FloatText.show(Lang_Utils.getErrorText(errorCode));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => `${Lang_Utils.getText(Lang_Constants.TextType.R0007)}\n\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0201)}`,
                callback   : () => gotoMfrCreateSettingsPanel(warData),
            });
        }
    };

    const war = new MapEditor_Model_MeWar.MeWar();
    await war.initWithMapRawData({
        mapRawData                : mapRawData,
        slotIndex                 : 0,
        gameConfig                : await GameConfigs_Provider.getLatestGameConfig(),
        srcNormalMapIdForAddEvent : null,
        gridMarkData              : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        MapEditor_Model_MeMfwModel.resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : null,
            availableNumberArray : templateWarRuleArray.map(v => v.getRuleId()),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1242),
            getNumberMainText    : ruleId => Lang_Utils.getLanguageText({ textArray : templateWarRuleArray.find(v => (v.getRuleId()) === ruleId)?.getRuleNameArray() }) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId()) === ruleId);
                if (warRule) {
                    MapEditor_Model_MeMfwModel.resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
