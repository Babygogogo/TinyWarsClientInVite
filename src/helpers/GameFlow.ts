import { ActionPlanner } from "../actionPlanners/ActionPlanner.ts";
import { ActionPlannerView } from "../actionPlanners/ActionPlannerView.ts";
import { init } from "../autoTourneys/mains/Gateway.ts";
import { init as AutoTourneysRoomsGatewayInit } from "../autoTourneys/rooms/Gateway.ts";
import { War } from "../autoTourneys/wars/War.ts";
import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable, CustomError } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { BwCommonSettingManager } from "../baseWar/model/BwCommonSettingManager.ts";
import { BwCursor } from "../baseWar/model/BwCursor.ts";
import { BwDrawVoteManager } from "../baseWar/model/BwDrawVoteManager.ts";
import { BwExecutedOperationManager } from "../baseWar/model/BwExecutedOperationManager.ts";
import { BwGridVisualEffect } from "../baseWar/model/BwGridVisualEffect.ts";
import { BwRandomNumberManager } from "../baseWar/model/BwRandomNumberManager.ts";
import { BwWarEventManager } from "../baseWar/model/BwWarEventManager.ts";
import { BwWarStatisticsManager } from "../baseWar/model/BwWarStatisticsManager.ts";
import { BwCursorView } from "../baseWar/view/BwCursorView.ts";
import { BwGridVisualEffectView } from "../baseWar/view/BwGridVisualEffectView.ts";
import { BwWarView } from "../baseWar/view/BwWarView.ts";
import { init as BroadcastsGatewayInit } from "../broadcasts/Gateway.ts";
import { init as CampaignsMainsGatewayInit } from "../campaigns/mains/Gateway.ts";
import { init as CampaignsManagementsGatewayInit } from "../campaigns/managements/Gateway.ts";
import { War as CampaignsWarsWar } from "../campaigns/wars/War.ts";
import { init as ChangeLogModelChangeLogProxyInit } from "../changeLogs/Gateway.ts";
import { Common, ToCategoryId } from "../chat/Constants.ts";
import { init as ChatProxyInit, reqChatAddMessage } from "../chat/Proxy.ts";
import { init as CommonModelCommonModelInit } from "../common/model/CommonModel.ts";
import { init as CommonModelCommonProxyInit } from "../common/model/CommonProxy.ts";
import { init as CoopCustomRoomModelCcrProxyInit } from "../coopCustomRoom/model/CcrProxy.ts";
import { CcwWar } from "../coopCustomWar/model/CcwWar.ts";
import { Field } from "../fields/Field.ts";
import { FieldView } from "../fields/FieldView.ts";
import { show } from "../FloatText.ts";
import { FogMap } from "../fogMaps/FogMap.ts";
import { ReviewStatus } from "../maps/Constants.ts";
import { init as GameConfigGcModelInit, getGameConfig, getLatestGameConfig } from "../gameConfig/GcModel.ts";
import { init as GameConfigGcProxyInit } from "../gameConfig/GcProxy.ts";
import { SyncRequestType } from "../gameConfig/GcWar.ts";
import { init as GameHelpersGhFactoryInit, getTwWarClass, getMeWarClass } from "../gameHelpers/GhFactory.ts";
import { getDict } from "../gamePanels/Dict.ts";
import { closeAllPanelsExcept, openPanel } from "../gamePanels/Manager.ts";
import { init as GmModelGmProxyInit } from "../gm/model/GmProxy.ts";
import { init as HalfwayReplayWarModelHrwModelInit, unloadWar, loadWar, getWar } from "../halfwayReplayWar/model/HrwModel.ts";
import { HrwWar } from "../halfwayReplayWar/model/HrwWar.ts";
import { init as HelpersCompatibilityInit } from "./Compatibility.ts";
import * as HelpersGameFlow from "./GameFlow.ts";
import { getExisted, newError } from "./Misc.ts";
import { init as KeyboardKbManagerInit } from "../keyboard/KbManager.ts";
import { CommonText } from "../lang/CommonText.ts";
import { TextType, UndefinedError } from "../lang/Constants.ts";
import { init as LangUtilsInit, getText, getErrorText, getLanguageText } from "../lang/Utils.ts";
import { init as LeaderboardModelLeaderboardProxyInit } from "../leaderboard/model/LeaderboardProxy.ts";
import { init as LocalDataDeprecatedStorageInit } from "../localData/DeprecatedStorage.ts";
import { init as LocalDataStorage2Init, getStageScale, getScreenOrientation } from "../localData/Storage.ts";
import { init as MailModelMailProxyInit } from "../mail/model/MailProxy.ts";
import { MeDrawer } from "../mapEditor/model/MeDrawer.ts";
import { reviseInstanceWarRuleForAi, getWarData, resetData } from "../mapEditor/model/MeMfwModel.ts";
import {
    init as MapEditorModelMeModelInit,
    unloadWar as MapEditorModelMeModelUnloadWar,
    loadWar as MapEditorModelMeModelLoadWar,
    getMapEditorData,
    getWar as MapEditorModelMeModelGetWar,
} from "../mapEditor/model/MeModel.ts";
import { init as MapEditorModelMeProxyInit } from "../mapEditor/model/MeProxy.ts";
import {
    getWarData as MapEditorModelMeSimModelGetWarData,
    resetData as MapEditorModelMeSimModelResetData,
} from "../mapEditor/model/MeSimModel.ts";
import { MeWar } from "../mapEditor/model/MeWar.ts";
import { init as MultiCustomRoomModelMcrProxyInit } from "../multiCustomRoom/model/McrProxy.ts";
import { McwWar } from "../multiCustomWar/model/McwWar.ts";
import { init as MultiFreeRoomModelMfrProxyInit } from "../multiFreeRoom/model/MfrProxy.ts";
import { MfrRoomCreator } from "../multiFreeRoom/model/MfrRoomCreator.ts";
import { MfwWar } from "../multiFreeWar/model/MfwWar.ts";
import { init as MultiMatchRoomModelMmrProxyInit } from "../multiMatchRoom/model/MmrProxy.ts";
import { MmwWar } from "../multiMatchWar/model/MmwWar.ts";
import type { IMpwWar } from "../multiPlayerWar/interface/IMpwWar.ts";
import {
    init as MultiPlayerWarModelMpwModelInit,
    unloadWar as MultiPlayerWarModelMpwModelUnloadWar,
    loadWar as MultiPlayerWarModelMpwModelLoadWar,
    getWar as MultiPlayerWarModelMpwModelGetWar,
} from "../multiPlayerWar/model/MpwModel.ts";
import { init as MultiPlayerWarModelMpwProxyInit, reqMpwCommonSyncWar } from "../multiPlayerWar/model/MpwProxy.ts";
import { MpwWar } from "../multiPlayerWar/model/MpwWar.ts";
import { init as MultiRankRoomModelMrrProxyInit } from "../multiRankRoom/model/MrrProxy.ts";
import { MrwWar } from "../multiRankWar/model/MrwWar.ts";
import { checkAndOverrideGameVersion, addListeners, init as NetworksManagerInit } from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { init as NormalMapModelNormalMapModelInit } from "../normalMap/model/NormalMapModel.ts";
import { init as NormalMapModelNormalMapProxyInit } from "../normalMap/model/NormalMapProxy.ts";
import { addEventListeners } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { Player } from "../players/Player.ts";
import { PlayerManager } from "../players/PlayerManager.ts";
import type { MapRawData as ProtoSchemaCommonProtoMapMapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { GridMarkData as ProtoSchemaCommonProtoStructureGridMarkData } from "../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type {
    SerialWar as ProtoSchemaCommonProtoWarSerializationSerialWar,
} from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { IRwWarBase } from "../replayWar/interface/IRwWarBase.ts";
import {
    init as ReplayWarModelRwModelInit,
    unloadWar as ReplayWarModelRwModelUnloadWar,
    loadWar as ReplayWarModelRwModelLoadWar,
    getWar as ReplayWarModelRwModelGetWar,
} from "../replayWar/model/RwModel.ts";
import { init as ReplayWarModelRwProxyInit } from "../replayWar/model/RwProxy.ts";
import { RwWar } from "../replayWar/model/RwWar.ts";
import { RwWarBase } from "../replayWar/model/RwWarBase.ts";
import type { OpenData } from "../replayWar/view/RwReplayListPanel.ts";
import { init as ResManager2Init, loadMainRes, checkIsLoadedMainResource } from "../ResManager.ts";
import { ScwWar } from "../singleCustomWar/model/ScwWar.ts";
import { SfwWar } from "../singleFreeWar/model/SfwWar.ts";
import { init as SinglePlayerModeModelSpmModelInit } from "../singlePlayerMode/model/SpmModel.ts";
import { init as SinglePlayerModeModelSpmProxyInit } from "../singlePlayerMode/model/SpmProxy.ts";
import type { ISpwWar } from "../singlePlayerWar/interface/ISpwWar.ts";
import {
    init as SinglePlayerWarModelSpwModelInit,
    unloadWar as SinglePlayerWarModelSpwModelUnloadWar,
    loadWar as SinglePlayerWarModelSpwModelLoadWar,
    checkAndHandleAutoActionsAndRobotRecursively,
    getWar as SinglePlayerWarModelSpwModelGetWar,
} from "../singlePlayerWar/model/SpwModel.ts";
import { SpwRetractManager } from "../singlePlayerWar/model/SpwRetractManager.ts";
import { SpwWar } from "../singlePlayerWar/model/SpwWar.ts";
import { SrwWar } from "../singleRankWar/model/SrwWar.ts";
import { playBgm, playCoBgmWithWar } from "../sounds/SoundPlayer.ts";
import { init as StagesStageManagerInit, setStageScale } from "../stages/StageManager.ts";
import { TaskObjectiveManager } from "../taskObjectives/TaskObjectiveManager.ts";
import { TwWar } from "../testWar/model/TwWar.ts";
import { Tile } from "../tiles/Tile.ts";
import { TileMap } from "../tiles/TileMap.ts";
import { TileMapView } from "../tiles/TileMapView.ts";
import { TileView } from "../tiles/TileView.ts";
import { init as TimerTimerModelInit } from "../timer/TimerModel.ts";
import { init as TimerTimerProxyInit } from "../timer/TimerProxy.ts";
import { TurnManager } from "../turns/TurnManager.ts";
import { UiButton } from "../ui/components/UiButton.ts";
import { UiCoInfo } from "../ui/components/UiCoInfo.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import { UiContainerBase } from "../ui/components/UiContainerBase.ts";
import { UiImage } from "../ui/components/UiImage.ts";
import { UiLabel } from "../ui/components/UiLabel.ts";
import { UiLayer } from "../ui/components/UiLayer.ts";
import { UiLayout } from "../ui/components/UiLayout.ts";
import { UiLayoutBase } from "../ui/components/UiLayoutBase.ts";
import { UiList } from "../ui/components/UiList.ts";
import { UiListItemRenderer } from "../ui/components/UiListItemRenderer.ts";
import { UiMapInfo } from "../ui/components/UiMapInfo.ts";
import { UiOpenableComponent } from "../ui/components/UiOpenableComponent.ts";
import { UiPanel } from "../ui/components/UiPanel.ts";
import { UiProgressBar } from "../ui/components/UiProgressBar.ts";
import { UiPromptedInput } from "../ui/components/UiPromptedInput.ts";
import { UiRadioButton } from "../ui/components/UiRadioButton.ts";
import { UiScroller } from "../ui/components/UiScroller.ts";
import { UiScrollerBase } from "../ui/components/UiScrollerBase.ts";
import { UiScrollList } from "../ui/components/UiScrollList.ts";
import { UiSwitch } from "../ui/components/UiSwitch.ts";
import { UiTab } from "../ui/components/UiTab.ts";
import { UiTextInput } from "../ui/components/UiTextInput.ts";
import { UiTileView } from "../ui/components/UiTileView.ts";
import { UiUnitView } from "../ui/components/UiUnitView.ts";
import { UiZoomableComponent } from "../ui/components/UiZoomableComponent.ts";
import { UiZoomableMap } from "../ui/components/UiZoomableMap.ts";
import { init as UiUtilsUiFactoryInit } from "../ui/utils/UiFactory.ts";
import { init as UiUtilsUiSizerHelpersInit } from "../ui/utils/UiSizerHelpers.ts";
import { Unit } from "../units/Unit.ts";
import { UnitMap } from "../units/UnitMap.ts";
import { UnitMapView } from "../units/UnitMapView.ts";
import { UnitView } from "../units/UnitView.ts";
import { Common as UsersConstantsCommon } from "../users/Constants.ts";
import {
    init as UsersModelInit,
    getSelfSettingsBgmCodeForLobby,
    getSelfSettingsCoBgmCodeArray,
    getSelfSettingsBgmCodeForMapEditor,
    getIsLoggedIn,
    getSelfAccount,
    getSelfPassword,
    getSelfGuestUserId,
    updateOnMsgUserLogout,
} from "../users/Model.ts";
import { init as UsersProxyInit, reqLogin, reqUserLoginAsGuest } from "../users/Proxy.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { Stage } from "../vendor/egret/Egret.ts";
import { WarTypeId } from "../warTypes/Constants.ts";
import { init as WatchWarModelWwProxyInit } from "../watchWar/model/WwProxy.ts";
import { Manager } from "../weathers/Manager.ts";
import { View } from "../weathers/View.ts";

type SerialWar                  = ProtoSchemaCommonProtoWarSerializationSerialWar;
type MapRawData                 = ProtoSchemaCommonProtoMapMapRawData;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type GridMarkData               = ProtoSchemaCommonProtoStructureGridMarkData;

const _NET_EVENTS = [
    { msgCode: MessageCodes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
];
const _NOTIFY_EVENTS = [
    { type: TypeId.NetworkConnected,                callback: _onNotifyNetworkConnected, },
    { type: TypeId.MsgUserLogin,                    callback: _onMsgUserLogin },
    { type: TypeId.MsgUserLoginAsGuest,             callback: _onMsgUserLoginAsGuest },
    { type: TypeId.MsgUserLogout,                   callback: _onMsgUserLogout },
    { type: TypeId.MsgCommonLatestConfigVersion,    callback: _onMsgCommonLatestConfigVersion },
];

let _hasOnceWentToLobby = false;

export function startGame(stage: Stage): void {
    bootUpTest();
    checkAndOverrideGameVersion();

    doStartGame(stage);
}
function bootUpTest(): void {
    if (window.CLIENT_VERSION !== "DEVELOP") {
        return;
    }
    console.warn("Boot Up Test begin.");

    const rawDict       = CommonText;
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

            const dict1 = getExisted(dict.get(text1));
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

async function doStartGame(stage: Stage): Promise<void> {
    initListenerForWindowOnError();

    KeyboardKbManagerInit();
    HelpersCompatibilityInit();
    addListeners(_NET_EVENTS);
    addEventListeners(_NOTIFY_EVENTS, HelpersGameFlow);
    UiUtilsUiSizerHelpersInit();
    UiUtilsUiFactoryInit({
        uiButton            : UiButton,
        uiCoInfo            : UiCoInfo,
        uiContainer         : UiContainer,
        uiContainerBase     : UiContainerBase as unknown as any,
        uiImage             : UiImage,
        uiLabel             : UiLabel,
        uiLayer             : UiLayer,
        uiLayout            : UiLayout,
        uiLayoutBase        : UiLayoutBase as unknown as any,
        uiList              : UiList,
        uiListItemRenderer  : UiListItemRenderer as unknown as any,
        uiMapInfo           : UiMapInfo,
        uiOpenableComponent : UiOpenableComponent as unknown as any,
        uiPanel             : UiPanel as unknown as any,
        uiProgressBar       : UiProgressBar,
        uiPromptedInput     : UiPromptedInput,
        uiRadioButton       : UiRadioButton,
        uiScroller          : UiScroller,
        uiScrollerBase      : UiScrollerBase as unknown as any,
        uiScrollList        : UiScrollList,
        uiSwitch            : UiSwitch,
        uiTab               : UiTab,
        uiTextInput         : UiTextInput,
        uiTileView          : UiTileView,
        uiUnitView          : UiUnitView,
        uiZoomableComponent : UiZoomableComponent,
        uiZoomableMap       : UiZoomableMap,
    });
    GameHelpersGhFactoryInit({
        actionPlanner               : ActionPlanner,
        actionPlannerView           : ActionPlannerView,
        bwCommonSettingManager      : BwCommonSettingManager,
        bwCursor                    : BwCursor,
        bwCursorView                : BwCursorView,
        bwDrawVoteManager           : BwDrawVoteManager,
        bwExecutedOperationManager  : BwExecutedOperationManager,
        bwGridVisualEffect          : BwGridVisualEffect,
        bwGridVisualEffectView      : BwGridVisualEffectView,
        bwRandomNumberManager       : BwRandomNumberManager,
        bwWarEventManager           : BwWarEventManager,
        bwWarStatisticsManager      : BwWarStatisticsManager,
        bwWarView                   : BwWarView,
        bwWeatherManager            : Manager,
        bwWeatherManagerView        : View,

        atwWar                      : War,

        cawWar                      : CampaignsWarsWar,

        ccwWar                      : CcwWar,

        field                       : Field,
        fieldView                   : FieldView,

        fogMap                      : FogMap,

        hrwWar                      : HrwWar,

        mcwWar                      : McwWar,

        meDrawer                    : MeDrawer,
        meWar                       : MeWar,

        mfwWar                      : MfwWar,

        mmwWar                      : MmwWar,

        mpwWar                      : MpwWar as unknown as new () => IMpwWar,

        mrwWar                      : MrwWar,

        player                      : Player,
        playerManager               : PlayerManager,

        rwWar                       : RwWar,
        rwWarBase                   : RwWarBase as unknown as new () => IRwWarBase,

        scwWar                      : ScwWar,

        sfwWar                      : SfwWar,

        spwRetractManager           : SpwRetractManager,
        spwWar                      : SpwWar as unknown as new () => ISpwWar,

        srwWar                      : SrwWar,

        taskObjectiveManager        : TaskObjectiveManager,

        tile                        : Tile,
        tileMap                     : TileMap,
        tileMapView                 : TileMapView,
        tileView                    : TileView,

        turnManager                 : TurnManager,

        twWar                       : TwWar,

        unit                        : Unit,
        unitMap                     : UnitMap,
        unitMapView                 : UnitMapView,
        unitView                    : UnitView,
    });
    StagesStageManagerInit(stage);
    await Promise.all([
        LocalDataStorage2Init(),
        LocalDataDeprecatedStorageInit(),
        ResManager2Init(),
    ]);
    setStageScale(getStageScale());
    try {
        window.TW_APK_INJECT?.setScreenOrientation(getScreenOrientation());
    } catch {
        // nothing to do
    }

    LangUtilsInit();
    GameConfigGcProxyInit();
    GameConfigGcModelInit();
    NetworksManagerInit();
    MultiPlayerWarModelMpwProxyInit();
    MultiPlayerWarModelMpwModelInit();
    TimerTimerProxyInit();
    TimerTimerModelInit();
    UsersProxyInit();
    UsersModelInit();
    NormalMapModelNormalMapProxyInit();
    NormalMapModelNormalMapModelInit();
    MultiCustomRoomModelMcrProxyInit();
    MultiRankRoomModelMrrProxyInit();
    MultiMatchRoomModelMmrProxyInit();
    MultiFreeRoomModelMfrProxyInit();
    CoopCustomRoomModelCcrProxyInit();
    WatchWarModelWwProxyInit();
    ReplayWarModelRwProxyInit();
    ReplayWarModelRwModelInit();
    HalfwayReplayWarModelHrwModelInit();
    SinglePlayerModeModelSpmProxyInit();
    SinglePlayerModeModelSpmModelInit();
    SinglePlayerWarModelSpwModelInit();
    MapEditorModelMeProxyInit();
    MapEditorModelMeModelInit();
    ChatProxyInit();
    CommonModelCommonProxyInit();
    CommonModelCommonModelInit();
    BroadcastsGatewayInit();
    ChangeLogModelChangeLogProxyInit();
    MailModelMailProxyInit();
    LeaderboardModelLeaderboardProxyInit();
    init();
    AutoTourneysRoomsGatewayInit();
    CampaignsMainsGatewayInit();
    CampaignsManagementsGatewayInit();
    GmModelGmProxyInit();

    _removeLoadingDom();
    gotoLogin();

    await loadMainRes();
    (_checkCanFirstGoToLobby()) && (gotoLobby());
}

export function gotoLogin(): void {
    MultiPlayerWarModelMpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().UserLoginBackgroundPanel,
        getDict().UserLoginPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().UserLoginBackgroundPanel, void 0);
    openPanel(getDict().UserLoginPanel, void 0);
    openPanel(getDict().BroadcastPanel, void 0);

    playBgm(getSelfSettingsBgmCodeForLobby());
}
export function gotoLobby(): void {
    _hasOnceWentToLobby = true;

    MultiPlayerWarModelMpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();
    closeAllPanelsExcept([
        getDict().BroadcastPanel,
        getDict().LobbyBackgroundPanel,
        getDict().LobbyBottomPanel,
        getDict().LobbyTopPanel,
        getDict().LobbyTopRightPanel,
        getDict().LobbyPanel,
    ]);
    openPanel(getDict().BroadcastPanel, void 0);
    openPanel(getDict().LobbyBackgroundPanel, void 0);
    openPanel(getDict().LobbyBottomPanel, void 0);
    openPanel(getDict().LobbyTopPanel, void 0);
    openPanel(getDict().LobbyTopRightPanel, void 0);
    openPanel(getDict().LobbyPanel, void 0);

    playBgm(getSelfSettingsBgmCodeForLobby());
}

export async function gotoMultiPlayerWar(data: SerialWar): Promise<void> {
    const war = await MultiPlayerWarModelMpwModelLoadWar(data);
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BwBackgroundPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().BwBackgroundPanel, void 0);
    openPanel(getDict().MpwTopPanel, { war });
    openPanel(getDict().MpwSidePanel, { war });
    openPanel(getDict().BwWarPanel, { war });
    openPanel(getDict().ActionPlannerPanel, { war });
    openPanel(getDict().BwTileBriefPanel, { war });
    openPanel(getDict().BwUnitBriefPanel, { war });
    openPanel(getDict().BroadcastPanel, void 0);

    playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoReplayWar(warData: SerialWar, replayId: number): Promise<void> {
    const war = await ReplayWarModelRwModelLoadWar(warData, replayId);
    unloadWar();
    MultiPlayerWarModelMpwModelUnloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BwBackgroundPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().BwBackgroundPanel, void 0);
    openPanel(getDict().RwTopPanel, { war });
    openPanel(getDict().BwWarPanel, { war });
    openPanel(getDict().ActionPlannerPanel, { war });
    openPanel(getDict().BwTileBriefPanel, { war });
    openPanel(getDict().BwUnitBriefPanel, { war });
    openPanel(getDict().BroadcastPanel, void 0);

    playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoHalfwayReplayWar(warData: SerialWar): Promise<void> {
    const war = await loadWar(warData);
    ReplayWarModelRwModelUnloadWar();
    MultiPlayerWarModelMpwModelUnloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BwBackgroundPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().BwBackgroundPanel, void 0);
    openPanel(getDict().HrwTopPanel, { war });
    openPanel(getDict().BwWarPanel, { war });
    openPanel(getDict().ActionPlannerPanel, { war });
    openPanel(getDict().BwTileBriefPanel, { war });
    openPanel(getDict().BwUnitBriefPanel, { war });
    openPanel(getDict().BroadcastPanel, void 0);

    playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData, overridingBgmCode }: {
    slotIndex           : number | null;
    slotExtraData       : SpmWarSaveSlotExtraData | null;
    warData             : SerialWar;
    overridingBgmCode?  : number | null;
}): Promise<void> {
    const war = await SinglePlayerWarModelSpwModelLoadWar({ warData, slotIndex, slotExtraData });
    war.setOverridingBgmCode(overridingBgmCode ?? null);

    MultiPlayerWarModelMpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BwBackgroundPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().BwBackgroundPanel, void 0);
    openPanel(getDict().SpwTopPanel, { war });
    openPanel(getDict().SpwSidePanel, { war });
    openPanel(getDict().BwWarPanel, { war });
    openPanel(getDict().ActionPlannerPanel, { war });
    openPanel(getDict().BwTileBriefPanel, { war });
    openPanel(getDict().BwUnitBriefPanel, { war });
    openPanel(getDict().BroadcastPanel, void 0);

    playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });

    await checkAndHandleAutoActionsAndRobotRecursively(war);
}
export async function gotoMapEditorWar({ mapRawData, slotIndex, isReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    mapRawData                  : Undefinable<MapRawData>;
    slotIndex                   : number;
    isReview                    : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : Undefinable<GridMarkData>;
 }): Promise<void> {
    const war = await MapEditorModelMeModelLoadWar({
        mapRawData                  : mapRawData,
        slotIndex                   : slotIndex,
        isReview                    : isReview,
        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
        gridMarkData                : gridMarkData,
    });
    MultiPlayerWarModelMpwModelUnloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();

    closeAllPanelsExcept([
        getDict().BwBackgroundPanel,
        getDict().BroadcastPanel,
    ]);
    openPanel(getDict().BwBackgroundPanel, void 0);
    openPanel(getDict().MeTopPanel, void 0);
    openPanel(getDict().BwWarPanel, { war });
    openPanel(getDict().ActionPlannerPanel, { war });
    openPanel(getDict().BwTileBriefPanel, { war });
    openPanel(getDict().BwUnitBriefPanel, { war });
    openPanel(getDict().BroadcastPanel, void 0);

    playBgm(getSelfSettingsBgmCodeForMapEditor());
}

export function gotoMyWarListPanel(warType: WarTypeId): void {
    if ((warType === WarTypeId.AtwFog) || (warType === WarTypeId.AtwStd)    ||
        (warType === WarTypeId.CcwFog) || (warType === WarTypeId.CcwStd)    ||
        (warType === WarTypeId.McwFog) || (warType === WarTypeId.McwStd)    ||
        (warType === WarTypeId.MfwFog) || (warType === WarTypeId.MfwStd)    ||
        (warType === WarTypeId.MmwFog) || (warType === WarTypeId.MmwStd)    ||
        (warType === WarTypeId.MrwFog) || (warType === WarTypeId.MrwStd)
    ) {
        _gotoMpwMyWarListPanel();
    } else if (
        (warType === WarTypeId.ScwFog)  || (warType === WarTypeId.ScwStd)   ||
        (warType === WarTypeId.SfwFog)  || (warType === WarTypeId.SfwStd)   ||
        (warType === WarTypeId.SrwFog)  || (warType === WarTypeId.SrwStd)   ||
        (warType === WarTypeId.CampFog) || (warType === WarTypeId.CampStd)
    ) {
        _gotoSpmWarListPanel();
    } else if (warType === WarTypeId.Me) {
        openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : false,
            needNonEmptySlot        : false,
            allowPlay               : true,
            getHelpText             : null,
            callback                : async slotIndex => {
                const mapEditorData             = await getMapEditorData(slotIndex);
                const reviewStatus              = mapEditorData?.reviewStatus;
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (reviewStatus === ReviewStatus.Rejected) {
                    openPanel(getDict().CommonAlertPanel, {
                        getTitle   : () => getText(TextType.B0305),
                        getContent : () => mapEditorData?.reviewComment || getText(TextType.None),
                        callback: () => {
                            gotoMapEditorWar({
                                mapRawData                  : getExisted(mapEditorData?.mapRawData),
                                slotIndex                   : slotIndex,
                                isReview                    : false,
                                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                                gridMarkData                : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                } else if (reviewStatus === ReviewStatus.Accepted) {
                    openPanel(getDict().CommonAlertPanel, {
                        getTitle   : () => getText(TextType.B0326),
                        getContent : () => mapEditorData?.reviewComment || getText(TextType.None),
                        callback: () => {
                            gotoMapEditorWar({
                                mapRawData                  : getExisted(mapEditorData?.mapRawData),
                                slotIndex                   : slotIndex,
                                isReview                    : false,
                                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                                gridMarkData                : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                } else {
                    if (srcNormalMapIdForAddEvent == null) {
                        gotoMapEditorWar({
                            mapRawData                  : mapEditorData?.mapRawData,
                            slotIndex                   : slotIndex,
                            isReview                    : false,
                            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                            gridMarkData                : mapEditorData?.gridMarkData,
                        });
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent     : () => getText(TextType.R0015),
                            callback    : () => {
                                gotoMapEditorWar({
                                    mapRawData                  : mapEditorData?.mapRawData,
                                    slotIndex                   : slotIndex,
                                    isReview                    : false,
                                    srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                                    gridMarkData                : mapEditorData?.gridMarkData,
                                });
                            },
                        });
                    }
                }
            },
        });
    } else {
        throw newError(`gotoMyWarListPanel() invalid warType: ${warType}.`, ClientErrorCode.FlowManager_GotoMyWarListPanel_00);
    }
}
export function gotoRwReplayListPanel(openData?: OpenData): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().RwReplayListPanel, openData ?? {
        filter                  : null,
        usePreviousFilter       : true,
        usePreviousPageIndex    : true,
    });
}
export function gotoWatchWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().WwOngoingWarsPanel, void 0);
}

export function gotoMcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().McrRoomInfoPanel, { roomId });
}
export function gotoCcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().CcrRoomInfoPanel, { roomId });
}
export function gotoMfrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().MfrRoomInfoPanel, { roomId });
}

export async function gotoMfrCreateSettingsPanel(warData: SerialWar): Promise<void> {
    MultiPlayerWarModelMpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BroadcastPanel,
        getDict().LobbyTopRightPanel,
        getDict().LobbyBackgroundPanel,
    ]);
    openPanel(getDict().BroadcastPanel, void 0);
    openPanel(getDict().LobbyTopRightPanel, void 0);
    openPanel(getDict().LobbyBackgroundPanel, void 0);

    openPanel(getDict().MfrCreateSettingsPanel, {
        roomCreator: new MfrRoomCreator(
            await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion())),
            warData
        ),
    });

    playBgm(getSelfSettingsBgmCodeForLobby());
}

export function gotoSrrCreateMapListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().SrrCreateMapListPanel, {
        mapFilter               : null,
        mapSorter               : null,
        usePreviousFilter       : true,
        usePreviousPageIndex    : true,
    });
}

export function gotoCampaignCreateMapsPanel(campaignId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().CampaignCreateMapsPanel, {
        campaignId  : campaignId,
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Callbacks.
////////////////////////////////////////////////////////////////////////////////////////////////////
function _onNotifyNetworkConnected(): void {
    if ((_hasOnceWentToLobby) && (!getIsLoggedIn())) {
        {
            const account   = getSelfAccount();
            const password  = getSelfPassword();
            if ((account != null) && (password != null)) {
                reqLogin(account, password, true);
                return;
            }
        }

        {
            const guestUserId = getSelfGuestUserId();
            if (guestUserId != null) {
                reqUserLoginAsGuest(guestUserId, true);
                return;
            }
        }
    }
}

function _onMsgCommonServerDisconnect(): void {
    // _hasOnceWentToLobby = false;
    // UserModel.clearLoginInfo();
    // gotoLogin();

    openPanel(getDict().CommonAlertPanel, {
        getTitle   : () => getText(TextType.B0025),
        getContent : () => getText(TextType.A0020),
    });
}

function _onMsgUserLogin(): void {
    if (_checkCanFirstGoToLobby()) {
        gotoLobby();
    } else {
        const mcwWar = MultiPlayerWarModelMpwModelGetWar();
        if (mcwWar) {
            reqMpwCommonSyncWar(mcwWar, SyncRequestType.ReconnectionRequest);
        }
    }
}
function _onMsgUserLoginAsGuest(): void {
    _onMsgUserLogin();
}

function _onMsgUserLogout(): void {
    _hasOnceWentToLobby = false;
    updateOnMsgUserLogout();
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
        && (getIsLoggedIn())
        && (checkIsLoadedMainResource());
}

function _removeLoadingDom(): void {
    const document = window.document;
    if (document) {
        const outLoadingLayer = document.getElementById("outLoadingLayer");
        (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
    }
}

export function unloadAllWarsAndOpenCommonPanels(): void {
    MultiPlayerWarModelMpwModelUnloadWar();
    ReplayWarModelRwModelUnloadWar();
    unloadWar();
    SinglePlayerWarModelSpwModelUnloadWar();
    MapEditorModelMeModelUnloadWar();

    closeAllPanelsExcept([
        getDict().BroadcastPanel,
        getDict().LobbyBackgroundPanel,
        getDict().LobbyTopRightPanel,
    ]);
    openPanel(getDict().BroadcastPanel, void 0);
    openPanel(getDict().LobbyBackgroundPanel, void 0);
    openPanel(getDict().LobbyTopRightPanel, void 0);

    playBgm(getSelfSettingsBgmCodeForLobby());
}

function _gotoMpwMyWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().MpwMyWarListPanel, void 0);
}
function _gotoSpmWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    openPanel(getDict().SpmWarListPanel, void 0);
}

export function getOngoingWar(): Undefinable<IBwWar> {
    return (MultiPlayerWarModelMpwModelGetWar())
        ?? (ReplayWarModelRwModelGetWar())
        ?? (getWar())
        ?? (SinglePlayerWarModelSpwModelGetWar())
        ?? (MapEditorModelMeModelGetWar());
}

function initListenerForWindowOnError(): void {
    window.onerror = (message, filename, row, col, err) => {
        if (err) {
            showErrorText(`Code: ${(err as CustomError).errorCode ?? `--`}\n${message}\n${err.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unknown error.`);
        }
    };
    window.addEventListener('unhandledrejection', (err) => {
        const reason = err.reason;
        if (reason instanceof Error) {
            showErrorText(`Code: ${(reason as CustomError).errorCode ?? `--`}\n${reason.message}\n${reason.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unhandled rejection in promise, reason:\n${reason}`);
        }
    });
}
function showErrorText(text: string): void {
    console.warn(text);
    openPanel(getDict().CommonErrorPanel, {
        content: text,
    });
    reqChatAddMessage(
        text.substring(0, Common.MaxErrorLength),
        ToCategoryId.Private,
        UsersConstantsCommon.AdminUserId,
    );
}

export async function checkAndCreateSimulation(mapRawData: MapRawData, gridMarkData: Undefinable<GridMarkData>): Promise<void> {
    const callbackForChosenWarRule = async () => {
        const warData   = MapEditorModelMeSimModelGetWarData();
        const errorCode = new (getTwWarClass())().getErrorCodeForInitForSfw(warData, await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            show(getErrorText(errorCode));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0931),
                callback    : () => {
                    warData.createIfNotExistsSettingsForSfw();
                    gotoSinglePlayerWar({
                        warData         : warData,
                        slotIndex       : null,
                        slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                            mpwWarId                : war.getWarId(),
                            overridingSkinIdArray   : [],
                            gridMarkData            : gridMarkData?.toJson(),
                        }),
                    });
                }
            });
        }
    };

    const war = new (getMeWarClass())();
    await war.initWithMapRawData({
        mapRawData                  : mapRawData,
        slotIndex                   : 0,
        gameConfig                  : await getLatestGameConfig(),
        srcNormalMapIdForAddEvent   : null,
        gridMarkData                : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        MapEditorModelMeSimModelResetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : templateWarRuleArray.map(v => v.getRuleId() ?? 0),
            showNumber              : true,
            getTitleText            : () => getText(TextType.B1242),
            getNumberMainText       : ruleId => getLanguageText({ textArray: templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId)?.getRuleNameArray() }) ?? UndefinedError,
            callbackOnConfirm       : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId);
                if (warRule) {
                    MapEditorModelMeSimModelResetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
export async function checkAndCreateMultiFreeWar(mapRawData: MapRawData): Promise<void> {
    const callbackForChosenWarRule = async () => {
        reviseInstanceWarRuleForAi();
        const warData   = getWarData();
        const errorCode = new (getTwWarClass())().getErrorCodeForInitForMfw(warData, await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            show(getErrorText(errorCode));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => `${getText(TextType.R0007)}\n\n\n${getText(TextType.A0201)}`,
                callback    : () => gotoMfrCreateSettingsPanel(warData),
            });
        }
    };

    const war = new (getMeWarClass())();
    await war.initWithMapRawData({
        mapRawData                  : mapRawData,
        slotIndex                   : 0,
        gameConfig                  : await getLatestGameConfig(),
        srcNormalMapIdForAddEvent   : null,
        gridMarkData                : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : templateWarRuleArray.map(v => v.getRuleId() ?? 0),
            showNumber              : true,
            getTitleText            : () => getText(TextType.B1242),
            getNumberMainText       : ruleId => getLanguageText({ textArray: templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId)?.getRuleNameArray() }) ?? UndefinedError,
            callbackOnConfirm       : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId);
                if (warRule) {
                    resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
