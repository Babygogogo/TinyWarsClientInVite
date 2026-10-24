import * as ActionPlannersActionPlanner from "../actionPlanners/ActionPlanner.ts";
import * as ActionPlannersActionPlannerView from "../actionPlanners/ActionPlannerView.ts";
import * as AutoTourneysMainsGateway from "../autoTourneys/mains/Gateway.ts";
import * as AutoTourneysRoomsGateway from "../autoTourneys/rooms/Gateway.ts";
import * as AutoTourneysWarsWar from "../autoTourneys/wars/War.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as BaseWarModelBwCommonSettingManager from "../baseWar/model/BwCommonSettingManager.ts";
import * as BaseWarModelBwCursor from "../baseWar/model/BwCursor.ts";
import * as BaseWarModelBwDrawVoteManager from "../baseWar/model/BwDrawVoteManager.ts";
import * as BaseWarModelBwExecutedOperationManager from "../baseWar/model/BwExecutedOperationManager.ts";
import * as BaseWarModelBwGridVisualEffect from "../baseWar/model/BwGridVisualEffect.ts";
import * as BaseWarModelBwRandomNumberManager from "../baseWar/model/BwRandomNumberManager.ts";
import * as BaseWarModelBwWarEventManager from "../baseWar/model/BwWarEventManager.ts";
import * as BaseWarModelBwWarStatisticsManager from "../baseWar/model/BwWarStatisticsManager.ts";
import * as BaseWarViewBwCursorView from "../baseWar/view/BwCursorView.ts";
import * as BaseWarViewBwGridVisualEffectView from "../baseWar/view/BwGridVisualEffectView.ts";
import * as BaseWarViewBwWarView from "../baseWar/view/BwWarView.ts";
import * as BroadcastsGateway from "../broadcasts/Gateway.ts";
import * as CampaignsMainsGateway from "../campaigns/mains/Gateway.ts";
import * as CampaignsManagementsGateway from "../campaigns/managements/Gateway.ts";
import * as CampaignsWarsWar from "../campaigns/wars/War.ts";
import * as ChangeLogModelChangeLogProxy from "../changeLog/model/ChangeLogProxy.ts";
import * as ChatConstants from "../chat/Constants.ts";
import * as ChatProxy from "../chat/Proxy.ts";
import * as CommonModelCommonModel from "../common/model/CommonModel.ts";
import * as CommonModelCommonProxy from "../common/model/CommonProxy.ts";
import * as CoopCustomRoomModelCcrProxy from "../coopCustomRoom/model/CcrProxy.ts";
import * as CoopCustomWarModelCcwWar from "../coopCustomWar/model/CcwWar.ts";
import * as FieldsField from "../fields/Field.ts";
import * as FieldsFieldView from "../fields/FieldView.ts";
import * as FloatText2 from "../FloatText.ts";
import * as FogMapsFogMap from "../fogMaps/FogMap.ts";
import * as GameConfigGcMap from "../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../gameConfig/GcModel.ts";
import * as GameConfigGcProxy from "../gameConfig/GcProxy.ts";
import * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../gamePanels/Dict.ts";
import * as GamePanelsManager from "../gamePanels/Manager.ts";
import * as GmModelGmProxy from "../gm/model/GmProxy.ts";
import * as HalfwayReplayWarModelHrwModel from "../halfwayReplayWar/model/HrwModel.ts";
import * as HalfwayReplayWarModelHrwWar from "../halfwayReplayWar/model/HrwWar.ts";
import * as HelpersCompatibility from "./Compatibility.ts";
import * as HelpersGameFlow from "./GameFlow.ts";
import * as HelpersMisc from "./Misc.ts";
import * as KeyboardKbManager from "../keyboard/KbManager.ts";
import * as LangCommonText from "../lang/CommonText.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as LeaderboardModelLeaderboardProxy from "../leaderboard/model/LeaderboardProxy.ts";
import * as LocalDataDeprecatedStorage from "../localData/DeprecatedStorage.ts";
import * as LocalDataStorage2 from "../localData/Storage.ts";
import * as MailModelMailProxy from "../mail/model/MailProxy.ts";
import * as MapEditorModelMeDrawer from "../mapEditor/model/MeDrawer.ts";
import * as MapEditorModelMeMfwModel from "../mapEditor/model/MeMfwModel.ts";
import * as MapEditorModelMeModel from "../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../mapEditor/model/MeProxy.ts";
import * as MapEditorModelMeSimModel from "../mapEditor/model/MeSimModel.ts";
import * as MapEditorModelMeWar from "../mapEditor/model/MeWar.ts";
import * as MultiCustomRoomModelMcrProxy from "../multiCustomRoom/model/McrProxy.ts";
import * as MultiCustomWarModelMcwWar from "../multiCustomWar/model/McwWar.ts";
import * as MultiFreeRoomModelMfrProxy from "../multiFreeRoom/model/MfrProxy.ts";
import * as MultiFreeRoomModelMfrRoomCreator from "../multiFreeRoom/model/MfrRoomCreator.ts";
import * as MultiFreeWarModelMfwWar from "../multiFreeWar/model/MfwWar.ts";
import * as MultiMatchRoomModelMmrProxy from "../multiMatchRoom/model/MmrProxy.ts";
import * as MultiMatchWarModelMmwWar from "../multiMatchWar/model/MmwWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../multiPlayerWar/interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwModel from "../multiPlayerWar/model/MpwModel.ts";
import * as MultiPlayerWarModelMpwProxy from "../multiPlayerWar/model/MpwProxy.ts";
import * as MultiPlayerWarModelMpwWar from "../multiPlayerWar/model/MpwWar.ts";
import * as MultiRankRoomModelMrrProxy from "../multiRankRoom/model/MrrProxy.ts";
import * as MultiRankWarModelMrwWar from "../multiRankWar/model/MrwWar.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NormalMapModelNormalMapModel from "../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../normalMap/model/NormalMapProxy.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as PlayersPlayer from "../players/Player.ts";
import * as PlayersPlayerManager from "../players/PlayerManager.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoStructureGridMarkData from "../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../replayWar/interface/IRwWarBase.ts";
import * as ReplayWarModelRwModel from "../replayWar/model/RwModel.ts";
import * as ReplayWarModelRwProxy from "../replayWar/model/RwProxy.ts";
import * as ReplayWarModelRwWar from "../replayWar/model/RwWar.ts";
import * as ReplayWarModelRwWarBase from "../replayWar/model/RwWarBase.ts";
import type * as ReplayWarViewRwReplayListPanel from "../replayWar/view/RwReplayListPanel.ts";
import * as ResManager2 from "../ResManager.ts";
import * as SingleCustomWarModelScwWar from "../singleCustomWar/model/ScwWar.ts";
import * as SingleFreeWarModelSfwWar from "../singleFreeWar/model/SfwWar.ts";
import * as SinglePlayerModeModelSpmModel from "../singlePlayerMode/model/SpmModel.ts";
import * as SinglePlayerModeModelSpmProxy from "../singlePlayerMode/model/SpmProxy.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../singlePlayerWar/interface/ISpwWar.ts";
import * as SinglePlayerWarModelSpwModel from "../singlePlayerWar/model/SpwModel.ts";
import * as SinglePlayerWarModelSpwRetractManager from "../singlePlayerWar/model/SpwRetractManager.ts";
import * as SinglePlayerWarModelSpwWar from "../singlePlayerWar/model/SpwWar.ts";
import * as SingleRankWarModelSrwWar from "../singleRankWar/model/SrwWar.ts";
import * as SoundsSoundPlayer from "../sounds/SoundPlayer.ts";
import * as StagesStageManager from "../stages/StageManager.ts";
import * as TaskObjectivesTaskObjectiveManager from "../taskObjectives/TaskObjectiveManager.ts";
import * as TestWarModelTwWar from "../testWar/model/TwWar.ts";
import * as TilesTile from "../tiles/Tile.ts";
import * as TilesTileMap from "../tiles/TileMap.ts";
import * as TilesTileMapView from "../tiles/TileMapView.ts";
import * as TilesTileView from "../tiles/TileView.ts";
import * as TimerTimerModel from "../timer/TimerModel.ts";
import * as TimerTimerProxy from "../timer/TimerProxy.ts";
import * as TurnsTurnManager from "../turns/TurnManager.ts";
import * as UiComponentsUiButton from "../ui/components/UiButton.ts";
import * as UiComponentsUiCoInfo from "../ui/components/UiCoInfo.ts";
import * as UiComponentsUiContainer from "../ui/components/UiContainer.ts";
import * as UiComponentsUiContainerBase from "../ui/components/UiContainerBase.ts";
import * as UiComponentsUiImage from "../ui/components/UiImage.ts";
import * as UiComponentsUiLabel from "../ui/components/UiLabel.ts";
import * as UiComponentsUiLayer from "../ui/components/UiLayer.ts";
import * as UiComponentsUiLayout from "../ui/components/UiLayout.ts";
import * as UiComponentsUiLayoutBase from "../ui/components/UiLayoutBase.ts";
import * as UiComponentsUiList from "../ui/components/UiList.ts";
import * as UiComponentsUiListItemRenderer from "../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiMapInfo from "../ui/components/UiMapInfo.ts";
import * as UiComponentsUiOpenableComponent from "../ui/components/UiOpenableComponent.ts";
import * as UiComponentsUiPanel from "../ui/components/UiPanel.ts";
import * as UiComponentsUiProgressBar from "../ui/components/UiProgressBar.ts";
import * as UiComponentsUiPromptedInput from "../ui/components/UiPromptedInput.ts";
import * as UiComponentsUiRadioButton from "../ui/components/UiRadioButton.ts";
import * as UiComponentsUiScroller from "../ui/components/UiScroller.ts";
import * as UiComponentsUiScrollerBase from "../ui/components/UiScrollerBase.ts";
import * as UiComponentsUiScrollList from "../ui/components/UiScrollList.ts";
import * as UiComponentsUiSwitch from "../ui/components/UiSwitch.ts";
import * as UiComponentsUiTab from "../ui/components/UiTab.ts";
import * as UiComponentsUiTextInput from "../ui/components/UiTextInput.ts";
import * as UiComponentsUiTileView from "../ui/components/UiTileView.ts";
import * as UiComponentsUiUnitView from "../ui/components/UiUnitView.ts";
import * as UiComponentsUiZoomableComponent from "../ui/components/UiZoomableComponent.ts";
import * as UiComponentsUiZoomableMap from "../ui/components/UiZoomableMap.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UiUtilsUiSizerHelpers from "../ui/utils/UiSizerHelpers.ts";
import * as UnitsUnit from "../units/Unit.ts";
import * as UnitsUnitMap from "../units/UnitMap.ts";
import * as UnitsUnitMapView from "../units/UnitMapView.ts";
import * as UnitsUnitView from "../units/UnitView.ts";
import * as UsersConstants from "../users/Constants.ts";
import * as UsersModel from "../users/Model.ts";
import * as UsersProxy from "../users/Proxy.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../warTypes/Constants.ts";
import * as WatchWarModelWwProxy from "../watchWar/model/WwProxy.ts";
import * as WeathersManager from "../weathers/Manager.ts";
import * as WeathersView from "../weathers/View.ts";

type SerialWar                  = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type MapRawData                 = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type GridMarkData               = ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;

const _NET_EVENTS = [
    { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
];
const _NOTIFY_EVENTS = [
    { type: NotificationsTypeId.TypeId.NetworkConnected,                callback: _onNotifyNetworkConnected, },
    { type: NotificationsTypeId.TypeId.MsgUserLogin,                    callback: _onMsgUserLogin },
    { type: NotificationsTypeId.TypeId.MsgUserLoginAsGuest,             callback: _onMsgUserLoginAsGuest },
    { type: NotificationsTypeId.TypeId.MsgUserLogout,                   callback: _onMsgUserLogout },
    { type: NotificationsTypeId.TypeId.MsgCommonLatestConfigVersion,    callback: _onMsgCommonLatestConfigVersion },
];

let _hasOnceWentToLobby = false;

export function startGame(stage: VendorEgretEgret.Stage): void {
    bootUpTest();
    NetworksManager.checkAndOverrideGameVersion();

    doStartGame(stage);
}
function bootUpTest(): void {
    if (window.CLIENT_VERSION !== "DEVELOP") {
        return;
    }
    console.warn("Boot Up Test begin.");

    const rawDict       = LangCommonText.CommonText;
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

            const dict1 = HelpersMisc.getExisted(dict.get(text1));
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

async function doStartGame(stage: VendorEgretEgret.Stage): Promise<void> {
    initListenerForWindowOnError();

    KeyboardKbManager.init();
    HelpersCompatibility.init();
    NetworksManager.addListeners(_NET_EVENTS);
    NotificationsDispatcher.addEventListeners(_NOTIFY_EVENTS, HelpersGameFlow);
    UiUtilsUiSizerHelpers.init();
    UiUtilsUiFactory.init({
        uiButton            : UiComponentsUiButton.UiButton,
        uiCoInfo            : UiComponentsUiCoInfo.UiCoInfo,
        uiContainer         : UiComponentsUiContainer.UiContainer,
        uiContainerBase     : UiComponentsUiContainerBase.UiContainerBase as unknown as any,
        uiImage             : UiComponentsUiImage.UiImage,
        uiLabel             : UiComponentsUiLabel.UiLabel,
        uiLayer             : UiComponentsUiLayer.UiLayer,
        uiLayout            : UiComponentsUiLayout.UiLayout,
        uiLayoutBase        : UiComponentsUiLayoutBase.UiLayoutBase as unknown as any,
        uiList              : UiComponentsUiList.UiList,
        uiListItemRenderer  : UiComponentsUiListItemRenderer.UiListItemRenderer as unknown as any,
        uiMapInfo           : UiComponentsUiMapInfo.UiMapInfo,
        uiOpenableComponent : UiComponentsUiOpenableComponent.UiOpenableComponent as unknown as any,
        uiPanel             : UiComponentsUiPanel.UiPanel as unknown as any,
        uiProgressBar       : UiComponentsUiProgressBar.UiProgressBar,
        uiPromptedInput     : UiComponentsUiPromptedInput.UiPromptedInput,
        uiRadioButton       : UiComponentsUiRadioButton.UiRadioButton,
        uiScroller          : UiComponentsUiScroller.UiScroller,
        uiScrollerBase      : UiComponentsUiScrollerBase.UiScrollerBase as unknown as any,
        uiScrollList        : UiComponentsUiScrollList.UiScrollList,
        uiSwitch            : UiComponentsUiSwitch.UiSwitch,
        uiTab               : UiComponentsUiTab.UiTab,
        uiTextInput         : UiComponentsUiTextInput.UiTextInput,
        uiTileView          : UiComponentsUiTileView.UiTileView,
        uiUnitView          : UiComponentsUiUnitView.UiUnitView,
        uiZoomableComponent : UiComponentsUiZoomableComponent.UiZoomableComponent,
        uiZoomableMap       : UiComponentsUiZoomableMap.UiZoomableMap,
    });
    GameHelpersGhFactory.init({
        actionPlanner               : ActionPlannersActionPlanner.ActionPlanner,
        actionPlannerView           : ActionPlannersActionPlannerView.ActionPlannerView,
        bwCommonSettingManager      : BaseWarModelBwCommonSettingManager.BwCommonSettingManager,
        bwCursor                    : BaseWarModelBwCursor.BwCursor,
        bwCursorView                : BaseWarViewBwCursorView.BwCursorView,
        bwDrawVoteManager           : BaseWarModelBwDrawVoteManager.BwDrawVoteManager,
        bwExecutedOperationManager  : BaseWarModelBwExecutedOperationManager.BwExecutedOperationManager,
        bwGridVisualEffect          : BaseWarModelBwGridVisualEffect.BwGridVisualEffect,
        bwGridVisualEffectView      : BaseWarViewBwGridVisualEffectView.BwGridVisualEffectView,
        bwRandomNumberManager       : BaseWarModelBwRandomNumberManager.BwRandomNumberManager,
        bwWarEventManager           : BaseWarModelBwWarEventManager.BwWarEventManager,
        bwWarStatisticsManager      : BaseWarModelBwWarStatisticsManager.BwWarStatisticsManager,
        bwWarView                   : BaseWarViewBwWarView.BwWarView,
        bwWeatherManager            : WeathersManager.Manager,
        bwWeatherManagerView        : WeathersView.View,

        atwWar                      : AutoTourneysWarsWar.War,

        cawWar                      : CampaignsWarsWar.War,

        ccwWar                      : CoopCustomWarModelCcwWar.CcwWar,

        field                       : FieldsField.Field,
        fieldView                   : FieldsFieldView.FieldView,

        fogMap                      : FogMapsFogMap.FogMap,

        hrwWar                      : HalfwayReplayWarModelHrwWar.HrwWar,

        mcwWar                      : MultiCustomWarModelMcwWar.McwWar,

        meDrawer                    : MapEditorModelMeDrawer.MeDrawer,
        meWar                       : MapEditorModelMeWar.MeWar,

        mfwWar                      : MultiFreeWarModelMfwWar.MfwWar,

        mmwWar                      : MultiMatchWarModelMmwWar.MmwWar,

        mpwWar                      : MultiPlayerWarModelMpwWar.MpwWar as unknown as new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar,

        mrwWar                      : MultiRankWarModelMrwWar.MrwWar,

        player                      : PlayersPlayer.Player,
        playerManager               : PlayersPlayerManager.PlayerManager,

        rwWar                       : ReplayWarModelRwWar.RwWar,
        rwWarBase                   : ReplayWarModelRwWarBase.RwWarBase as unknown as new () => ReplayWarInterfaceIRwWarBase.IRwWarBase,

        scwWar                      : SingleCustomWarModelScwWar.ScwWar,

        sfwWar                      : SingleFreeWarModelSfwWar.SfwWar,

        spwRetractManager           : SinglePlayerWarModelSpwRetractManager.SpwRetractManager,
        spwWar                      : SinglePlayerWarModelSpwWar.SpwWar as unknown as new () => SinglePlayerWarInterfaceISpwWar.ISpwWar,

        srwWar                      : SingleRankWarModelSrwWar.SrwWar,

        taskObjectiveManager        : TaskObjectivesTaskObjectiveManager.TaskObjectiveManager,

        tile                        : TilesTile.Tile,
        tileMap                     : TilesTileMap.TileMap,
        tileMapView                 : TilesTileMapView.TileMapView,
        tileView                    : TilesTileView.TileView,

        turnManager                 : TurnsTurnManager.TurnManager,

        twWar                       : TestWarModelTwWar.TwWar,

        unit                        : UnitsUnit.Unit,
        unitMap                     : UnitsUnitMap.UnitMap,
        unitMapView                 : UnitsUnitMapView.UnitMapView,
        unitView                    : UnitsUnitView.UnitView,
    });
    StagesStageManager.init(stage);
    await Promise.all([
        LocalDataStorage2.init(),
        LocalDataDeprecatedStorage.init(),
        ResManager2.init(),
    ]);
    StagesStageManager.setStageScale(LocalDataStorage2.getStageScale());
    try {
        window.TW_APK_INJECT?.setScreenOrientation(LocalDataStorage2.getScreenOrientation());
    } catch {
        // nothing to do
    }

    LangUtils.init();
    GameConfigGcProxy.init();
    GameConfigGcModel.init();
    NetworksManager.init();
    MultiPlayerWarModelMpwProxy.init();
    MultiPlayerWarModelMpwModel.init();
    TimerTimerProxy.init();
    TimerTimerModel.init();
    UsersProxy.init();
    UsersModel.init();
    NormalMapModelNormalMapProxy.init();
    NormalMapModelNormalMapModel.init();
    MultiCustomRoomModelMcrProxy.init();
    MultiRankRoomModelMrrProxy.init();
    MultiMatchRoomModelMmrProxy.init();
    MultiFreeRoomModelMfrProxy.init();
    CoopCustomRoomModelCcrProxy.init();
    WatchWarModelWwProxy.init();
    ReplayWarModelRwProxy.init();
    ReplayWarModelRwModel.init();
    HalfwayReplayWarModelHrwModel.init();
    SinglePlayerModeModelSpmProxy.init();
    SinglePlayerModeModelSpmModel.init();
    SinglePlayerWarModelSpwModel.init();
    MapEditorModelMeProxy.init();
    MapEditorModelMeModel.init();
    ChatProxy.init();
    CommonModelCommonProxy.init();
    CommonModelCommonModel.init();
    BroadcastsGateway.init();
    ChangeLogModelChangeLogProxy.init();
    MailModelMailProxy.init();
    LeaderboardModelLeaderboardProxy.init();
    AutoTourneysMainsGateway.init();
    AutoTourneysRoomsGateway.init();
    CampaignsMainsGateway.init();
    CampaignsManagementsGateway.init();
    GmModelGmProxy.init();

    _removeLoadingDom();
    gotoLogin();

    await ResManager2.loadMainRes();
    (_checkCanFirstGoToLobby()) && (gotoLobby());
}

export function gotoLogin(): void {
    MultiPlayerWarModelMpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().UserLoginBackgroundPanel,
        GamePanelsDict.getDict().UserLoginPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().UserLoginBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().UserLoginPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForLobby());
}
export function gotoLobby(): void {
    _hasOnceWentToLobby = true;

    MultiPlayerWarModelMpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();
    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BroadcastPanel,
        GamePanelsDict.getDict().LobbyBackgroundPanel,
        GamePanelsDict.getDict().LobbyBottomPanel,
        GamePanelsDict.getDict().LobbyTopPanel,
        GamePanelsDict.getDict().LobbyTopRightPanel,
        GamePanelsDict.getDict().LobbyPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopRightPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyPanel, void 0);

    SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForLobby());
}

export async function gotoMultiPlayerWar(data: SerialWar): Promise<void> {
    const war = await MultiPlayerWarModelMpwModel.loadWar(data);
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BwBackgroundPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwTopPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwSidePanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().ActionPlannerPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoReplayWar(warData: SerialWar, replayId: number): Promise<void> {
    const war = await ReplayWarModelRwModel.loadWar(warData, replayId);
    HalfwayReplayWarModelHrwModel.unloadWar();
    MultiPlayerWarModelMpwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BwBackgroundPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().RwTopPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().ActionPlannerPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoHalfwayReplayWar(warData: SerialWar): Promise<void> {
    const war = await HalfwayReplayWarModelHrwModel.loadWar(warData);
    ReplayWarModelRwModel.unloadWar();
    MultiPlayerWarModelMpwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BwBackgroundPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().HrwTopPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().ActionPlannerPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });
}
export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData, overridingBgmCode }: {
    slotIndex           : number | null;
    slotExtraData       : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData | null;
    warData             : SerialWar;
    overridingBgmCode?  : number | null;
}): Promise<void> {
    const war = await SinglePlayerWarModelSpwModel.loadWar({ warData, slotIndex, slotExtraData });
    war.setOverridingBgmCode(overridingBgmCode ?? null);

    MultiPlayerWarModelMpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BwBackgroundPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().SpwTopPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().SpwSidePanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().ActionPlannerPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playCoBgmWithWar({
        war                             : war,
        force                           : true,
        coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
    });

    await SinglePlayerWarModelSpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
}
export async function gotoMapEditorWar({ mapRawData, slotIndex, isReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    mapRawData                  : Undefinable<MapRawData>;
    slotIndex                   : number;
    isReview                    : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : Undefinable<GridMarkData>;
 }): Promise<void> {
    const war = await MapEditorModelMeModel.loadWar({
        mapRawData                  : mapRawData,
        slotIndex                   : slotIndex,
        isReview                    : isReview,
        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
        gridMarkData                : gridMarkData,
    });
    MultiPlayerWarModelMpwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BwBackgroundPanel,
        GamePanelsDict.getDict().BroadcastPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTopPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().ActionPlannerPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitBriefPanel, { war });
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);

    SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForMapEditor());
}

export function gotoMyWarListPanel(warType: WarTypesConstants.WarTypeId): void {
    if ((warType === WarTypesConstants.WarTypeId.AtwFog) || (warType === WarTypesConstants.WarTypeId.AtwStd)    ||
        (warType === WarTypesConstants.WarTypeId.CcwFog) || (warType === WarTypesConstants.WarTypeId.CcwStd)    ||
        (warType === WarTypesConstants.WarTypeId.McwFog) || (warType === WarTypesConstants.WarTypeId.McwStd)    ||
        (warType === WarTypesConstants.WarTypeId.MfwFog) || (warType === WarTypesConstants.WarTypeId.MfwStd)    ||
        (warType === WarTypesConstants.WarTypeId.MmwFog) || (warType === WarTypesConstants.WarTypeId.MmwStd)    ||
        (warType === WarTypesConstants.WarTypeId.MrwFog) || (warType === WarTypesConstants.WarTypeId.MrwStd)
    ) {
        _gotoMpwMyWarListPanel();
    } else if (
        (warType === WarTypesConstants.WarTypeId.ScwFog)  || (warType === WarTypesConstants.WarTypeId.ScwStd)   ||
        (warType === WarTypesConstants.WarTypeId.SfwFog)  || (warType === WarTypesConstants.WarTypeId.SfwStd)   ||
        (warType === WarTypesConstants.WarTypeId.SrwFog)  || (warType === WarTypesConstants.WarTypeId.SrwStd)   ||
        (warType === WarTypesConstants.WarTypeId.CampFog) || (warType === WarTypesConstants.WarTypeId.CampStd)
    ) {
        _gotoSpmWarListPanel();
    } else if (warType === WarTypesConstants.WarTypeId.Me) {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : false,
            needNonEmptySlot        : false,
            allowPlay               : true,
            getHelpText             : null,
            callback                : async slotIndex => {
                const mapEditorData             = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                const reviewStatus              = mapEditorData?.reviewStatus;
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (reviewStatus === GameConfigGcMap.ReviewStatus.Rejected) {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                        getTitle   : () => LangUtils.getText(LangConstants.TextType.B0305),
                        getContent : () => mapEditorData?.reviewComment || LangUtils.getText(LangConstants.TextType.None),
                        callback: () => {
                            gotoMapEditorWar({
                                mapRawData                  : HelpersMisc.getExisted(mapEditorData?.mapRawData),
                                slotIndex                   : slotIndex,
                                isReview                    : false,
                                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                                gridMarkData                : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                } else if (reviewStatus === GameConfigGcMap.ReviewStatus.Accepted) {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                        getTitle   : () => LangUtils.getText(LangConstants.TextType.B0326),
                        getContent : () => mapEditorData?.reviewComment || LangUtils.getText(LangConstants.TextType.None),
                        callback: () => {
                            gotoMapEditorWar({
                                mapRawData                  : HelpersMisc.getExisted(mapEditorData?.mapRawData),
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
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent     : () => LangUtils.getText(LangConstants.TextType.R0015),
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
        throw HelpersMisc.newError(`gotoMyWarListPanel() invalid warType: ${warType}.`, UtilsClientErrorCode.ClientErrorCode.FlowManager_GotoMyWarListPanel_00);
    }
}
export function gotoRwReplayListPanel(openData?: ReplayWarViewRwReplayListPanel.OpenData): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().RwReplayListPanel, openData ?? {
        filter                  : null,
        usePreviousFilter       : true,
        usePreviousPageIndex    : true,
    });
}
export function gotoWatchWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().WwOngoingWarsPanel, void 0);
}

export function gotoMcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().McrRoomInfoPanel, { roomId });
}
export function gotoCcrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrRoomInfoPanel, { roomId });
}
export function gotoMfrRoomInfoPanel(roomId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrRoomInfoPanel, { roomId });
}

export async function gotoMfrCreateSettingsPanel(warData: SerialWar): Promise<void> {
    MultiPlayerWarModelMpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BroadcastPanel,
        GamePanelsDict.getDict().LobbyTopRightPanel,
        GamePanelsDict.getDict().LobbyBackgroundPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopRightPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBackgroundPanel, void 0);

    GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrCreateSettingsPanel, {
        roomCreator: new MultiFreeRoomModelMfrRoomCreator.MfrRoomCreator(
            await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())),
            warData
        ),
    });

    SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForLobby());
}

export function gotoSrrCreateMapListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().SrrCreateMapListPanel, {
        mapFilter               : null,
        mapSorter               : null,
        usePreviousFilter       : true,
        usePreviousPageIndex    : true,
    });
}

export function gotoCampaignCreateMapsPanel(campaignId: number): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateMapsPanel, {
        campaignId  : campaignId,
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Callbacks.
////////////////////////////////////////////////////////////////////////////////////////////////////
function _onNotifyNetworkConnected(): void {
    if ((_hasOnceWentToLobby) && (!UsersModel.getIsLoggedIn())) {
        {
            const account   = UsersModel.getSelfAccount();
            const password  = UsersModel.getSelfPassword();
            if ((account != null) && (password != null)) {
                UsersProxy.reqLogin(account, password, true);
                return;
            }
        }

        {
            const guestUserId = UsersModel.getSelfGuestUserId();
            if (guestUserId != null) {
                UsersProxy.reqUserLoginAsGuest(guestUserId, true);
                return;
            }
        }
    }
}

function _onMsgCommonServerDisconnect(): void {
    // _hasOnceWentToLobby = false;
    // UserModel.clearLoginInfo();
    // gotoLogin();

    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
        getTitle   : () => LangUtils.getText(LangConstants.TextType.B0025),
        getContent : () => LangUtils.getText(LangConstants.TextType.A0020),
    });
}

function _onMsgUserLogin(): void {
    if (_checkCanFirstGoToLobby()) {
        gotoLobby();
    } else {
        const mcwWar = MultiPlayerWarModelMpwModel.getWar();
        if (mcwWar) {
            MultiPlayerWarModelMpwProxy.reqMpwCommonSyncWar(mcwWar, GameConfigGcWar.SyncRequestType.ReconnectionRequest);
        }
    }
}
function _onMsgUserLoginAsGuest(): void {
    _onMsgUserLogin();
}

function _onMsgUserLogout(): void {
    _hasOnceWentToLobby = false;
    UsersModel.updateOnMsgUserLogout();
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
        && (UsersModel.getIsLoggedIn())
        && (ResManager2.checkIsLoadedMainResource());
}

function _removeLoadingDom(): void {
    const document = window.document;
    if (document) {
        const outLoadingLayer = document.getElementById("outLoadingLayer");
        (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
    }
}

export function unloadAllWarsAndOpenCommonPanels(): void {
    MultiPlayerWarModelMpwModel.unloadWar();
    ReplayWarModelRwModel.unloadWar();
    HalfwayReplayWarModelHrwModel.unloadWar();
    SinglePlayerWarModelSpwModel.unloadWar();
    MapEditorModelMeModel.unloadWar();

    GamePanelsManager.closeAllPanelsExcept([
        GamePanelsDict.getDict().BroadcastPanel,
        GamePanelsDict.getDict().LobbyBackgroundPanel,
        GamePanelsDict.getDict().LobbyTopRightPanel,
    ]);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBackgroundPanel, void 0);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopRightPanel, void 0);

    SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForLobby());
}

function _gotoMpwMyWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyWarListPanel, void 0);
}
function _gotoSpmWarListPanel(): void {
    unloadAllWarsAndOpenCommonPanels();
    GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmWarListPanel, void 0);
}

export function getOngoingWar(): Undefinable<BaseWarInterfaceIBwWar.IBwWar> {
    return (MultiPlayerWarModelMpwModel.getWar())
        ?? (ReplayWarModelRwModel.getWar())
        ?? (HalfwayReplayWarModelHrwModel.getWar())
        ?? (SinglePlayerWarModelSpwModel.getWar())
        ?? (MapEditorModelMeModel.getWar());
}

function initListenerForWindowOnError(): void {
    window.onerror = (message, filename, row, col, err) => {
        if (err) {
            showErrorText(`Code: ${(err as AuxiliaryTypesAuxiliaryTypes.CustomError).errorCode ?? `--`}\n${message}\n${err.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unknown error.`);
        }
    };
    window.addEventListener('unhandledrejection', (err) => {
        const reason = err.reason;
        if (reason instanceof Error) {
            showErrorText(`Code: ${(reason as AuxiliaryTypesAuxiliaryTypes.CustomError).errorCode ?? `--`}\n${reason.message}\n${reason.stack ?? "No available call stack."}`);
        } else {
            showErrorText(`Unhandled rejection in promise, reason:\n${reason}`);
        }
    });
}
function showErrorText(text: string): void {
    console.warn(text);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonErrorPanel, {
        content: text,
    });
    ChatProxy.reqChatAddMessage(
        text.substring(0, ChatConstants.Common.MaxErrorLength),
        ChatConstants.ToCategoryId.Private,
        UsersConstants.Common.AdminUserId,
    );
}

export async function checkAndCreateSimulation(mapRawData: MapRawData, gridMarkData: Undefinable<GridMarkData>): Promise<void> {
    const callbackForChosenWarRule = async () => {
        const warData   = MapEditorModelMeSimModel.getWarData();
        const errorCode = new (GameHelpersGhFactory.getTwWarClass())().getErrorCodeForInitForSfw(warData, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            FloatText2.show(LangUtils.getErrorText(errorCode));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0931),
                callback    : () => {
                    warData.createIfNotExistsSettingsForSfw();
                    gotoSinglePlayerWar({
                        warData         : warData,
                        slotIndex       : null,
                        slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
                            mpwWarId                : war.getWarId(),
                            overridingSkinIdArray   : [],
                            gridMarkData            : gridMarkData?.toJson(),
                        }),
                    });
                }
            });
        }
    };

    const war = new (GameHelpersGhFactory.getMeWarClass())();
    await war.initWithMapRawData({
        mapRawData                  : mapRawData,
        slotIndex                   : 0,
        gameConfig                  : await GameConfigGcModel.getLatestGameConfig(),
        srcNormalMapIdForAddEvent   : null,
        gridMarkData                : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        MapEditorModelMeSimModel.resetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : templateWarRuleArray.map(v => v.getRuleId() ?? 0),
            showNumber              : true,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1242),
            getNumberMainText       : ruleId => LangUtils.getLanguageText({ textArray: templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId)?.getRuleNameArray() }) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId);
                if (warRule) {
                    MapEditorModelMeSimModel.resetData(mapRawData, war.serializeForCreateSfwWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
export async function checkAndCreateMultiFreeWar(mapRawData: MapRawData): Promise<void> {
    const callbackForChosenWarRule = async () => {
        MapEditorModelMeMfwModel.reviseInstanceWarRuleForAi();
        const warData   = MapEditorModelMeMfwModel.getWarData();
        const errorCode = new (GameHelpersGhFactory.getTwWarClass())().getErrorCodeForInitForMfw(warData, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
        if (errorCode) {
            FloatText2.show(LangUtils.getErrorText(errorCode));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => `${LangUtils.getText(LangConstants.TextType.R0007)}\n\n\n${LangUtils.getText(LangConstants.TextType.A0201)}`,
                callback    : () => gotoMfrCreateSettingsPanel(warData),
            });
        }
    };

    const war = new (GameHelpersGhFactory.getMeWarClass())();
    await war.initWithMapRawData({
        mapRawData                  : mapRawData,
        slotIndex                   : 0,
        gameConfig                  : await GameConfigGcModel.getLatestGameConfig(),
        srcNormalMapIdForAddEvent   : null,
        gridMarkData                : null,
    });
    war.startRunning();

    const templateWarRuleArray = mapRawData.getTemplateWarRuleArray();
    if (templateWarRuleArray.length <= 1) {
        MapEditorModelMeMfwModel.resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(templateWarRuleArray[0]));
        war.stopRunning();
        callbackForChosenWarRule();
    } else {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : templateWarRuleArray.map(v => v.getRuleId() ?? 0),
            showNumber              : true,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1242),
            getNumberMainText       : ruleId => LangUtils.getLanguageText({ textArray: templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId)?.getRuleNameArray() }) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : ruleId => {
                const warRule = templateWarRuleArray.find(v => (v.getRuleId() ?? 0) === ruleId);
                if (warRule) {
                    MapEditorModelMeMfwModel.resetData(mapRawData, war.serializeForCreateMfrWithTemplateWarRule(warRule));
                    war.stopRunning();
                    callbackForChosenWarRule();
                }
            },
        });
    }
}
