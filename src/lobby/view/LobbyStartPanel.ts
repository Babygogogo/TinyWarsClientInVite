import * as AutoTourneysConstants from "../../autoTourneys/Constants.ts";
import * as AutoTourneysMainsProvider from "../../autoTourneys/mains/Provider.ts";
import * as AutoTourneysRoomsProvider from "../../autoTourneys/rooms/Provider.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../model/LobbyModel.ts";
import * as MultiCustomRoomModelMcrModel from "../../multiCustomRoom/model/McrModel.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiMatchRoomModelMmrModel from "../../multiMatchRoom/model/MmrModel.ts";
import * as MultiPlayerRoomsConstants from "../../multiPlayerRooms/Constants.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as MultiRankRoomModelMrrModel from "../../multiRankRoom/model/MrrModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";

// eslint-disable-next-line no-shadow
const enum CommandType {
    C0_SinglePlayer,
    C0_MultiPlayer,
    C0_MyProfile,
    C0_MapEditor,
    C0_GameChart,
    C0_GameSettings,
    C0_Chat,

    C1_Sp_Campaign,
    C1_Sp_WarRoom,
    C1_Sp_Sandbox,
    C1_Sp_Continue,

    C1_Mp_RankedMode,
    C1_Mp_MatchMode,
    C1_Mp_AutoTourneyMode,
    C1_Mp_CreateRoom,
    C1_Mp_JoinRoom,
    C1_Mp_MyRooms,
    C1_Mp_MyGames,
    C1_Mp_Replay,
    C1_Mp_Spectate,

    C2_Mp_RankedMode_SetGameNumber,
    C2_Mp_RankedMode_BanMap,
    C2_Mp_RankedMode_SetGameTimer,
    C2_Mp_RankedMode_PreviewMap,

    C2_Mp_MatchMode_SetGameNumber,
    C2_Mp_MatchMode_BanMap,
    C2_Mp_MatchMode_SetGameTimer,
    C2_Mp_MatchMode_PreviewMap,

    C2_Mp_AutoTourney_Registration,
    C2_Mp_AutoTourney_TourneyInfo,
    C2_Mp_AutoTourney_PreviewMap,

    C2_Mp_CreateRoom_Mcr,
    C2_Mp_CreateRoom_Ccr,

    C2_Mp_Spectate_MakeRequest,
    C2_Mp_Spectate_HandleRequest,
    C2_Mp_Spectate_DeleteSpectator,
    C2_Mp_Spectate_Continue,

    TODO,
}
const TweenTime     = 150;
const ItemHeight    = 40;
const ItemGap       = 6;
const ListMaxItems  = 9;
const ListMaxHeight = ItemHeight * ListMaxItems + ItemGap * (ListMaxItems - 1);

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupContainer!   : UiInterfacesIUiContainer.IUiContainer;

    private readonly _group0!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCommand0!     : UiInterfacesIUiScrollList.IUiScrollList<DataForCommandRenderer>;

    private readonly _group1!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCommand1!     : UiInterfacesIUiScrollList.IUiScrollList<DataForCommandRenderer>;

    private readonly _group2!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCommand2!     : UiInterfacesIUiScrollList.IUiScrollList<DataForCommandRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._group,          callback: this._onTouchedGroup,  mouseStyle: HelpersPointerInput.MouseStyleType.Default },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        // this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCommand0.setItemRendererClass(CommandRenderer);
        this._listCommand1.setItemRendererClass(CommandRenderer);
        this._listCommand2.setItemRendererClass(CommandRenderer);

        this._group.setUnscaledManualHeight(ListMaxHeight);
        this._groupContainer.setUnscaledManualHeight(ListMaxHeight);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._resetView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listCommand0.removeAllItems(),
            this._listCommand1.removeAllItems(),
            this._listCommand2.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroup(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _resetView(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray0 = this._createDataForListCommand0();
        await this._listCommand0.bindData(dataArray0);

        const count0    = dataArray0.length;
        const group0    = this._group0;
        group0.setY(Math.max(0, ListMaxItems - count0) * (ItemHeight + ItemGap));
        group0.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight,
            rawValue    : count0 * ItemHeight + (count0 - 1) * ItemGap,
        }));

        this._group1.setIsVisible(false);
        this._group2.setIsVisible(false);
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }

    private _createDataForListCommand0(): DataForCommandRenderer[] {
        return [
            {
                commandType     : CommandType.C0_SinglePlayer,
                isExpandVisible : true,
                callback        : async () => {
                    await this._listCommand1.bindData([
                        {
                            commandType     : CommandType.C1_Sp_Campaign,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateCampaignsPanel, void 0);
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_WarRoom,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().SrrCreateMapListPanel, {
                                    mapFilter               : null,
                                    mapSorter               : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Sandbox,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().ScrCreateMapListPanel, {
                                    mapFilter               : null,
                                    mapSorter               : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Continue,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmWarListPanel, void 0);
                            },
                        },
                    ]);

                    this._showGroup1();
                    this._hideGroup2();
                },
            },
            {
                commandType     : CommandType.C0_MultiPlayer,
                isExpandVisible : true,
                callback        : async () => {
                    await this._listCommand1.bindData([
                        {
                            commandType     : CommandType.C1_Mp_RankedMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_SetGameNumber,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrPreviewMapListPanel, {
                                                hasFog: false,
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_MatchMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_SetGameNumber,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrPreviewMapListPanel, {
                                                hasFog: false,
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_AutoTourneyMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_Registration,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            const tourneyIdArray = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration))?.map(v => v.getTourneyId() ?? 0) ?? [];
                                            if (tourneyIdArray.length <= 0) {
                                                FloatText2.showLang(LangConstants.TextType.A0403);
                                                return;
                                            }

                                            for (const tourneyId of tourneyIdArray) {
                                                AutoTourneysMainsProvider.setIsNotifiedForRegistration(tourneyId, true);
                                            }

                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtRegisterPanel, void 0);
                                        },
                                        checkIsRed      : () => AutoTourneysMainsProvider.checkIsRedForRegistration(),
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_TourneyInfo,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            if ((await AutoTourneysMainsProvider.getLastTourneyId()) == null) {
                                                FloatText2.showLang(LangConstants.TextType.B0278);
                                                return;
                                            }

                                            this.closePanel();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtTourneyInfoPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            const tourneyIdArray = (await AutoTourneysMainsProvider.getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId() ?? 0) ?? [];
                                            if (tourneyIdArray.length <= 0) {
                                                FloatText2.showLang(LangConstants.TextType.B0278);
                                                return;
                                            }

                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtrPreviewMapListPanel, {
                                                tourneyId: Math.max(...tourneyIdArray),
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                            checkIsRed      : () => AutoTourneysMainsProvider.checkIsRedForRegistration(),
                        },
                        {
                            commandType     : CommandType.C1_Mp_CreateRoom,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_CreateRoom_Mcr,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().McrCreateMapListPanel, {
                                                mapFilter               : null,
                                                mapSorter               : null,
                                                usePreviousFilter       : true,
                                                usePreviousPageIndex    : true,
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_CreateRoom_Ccr,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrCreateMapListPanel, {
                                                mapFilter               : null,
                                                mapSorter               : null,
                                                usePreviousFilter       : true,
                                                usePreviousPageIndex    : true,
                                            });
                                        },
                                    },
                                ]);

                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_JoinRoom,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwJoinRoomListPanel, {
                                    preferredRoomType   : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr,
                                    filter              : null
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyRooms,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
                            },
                            checkIsRed      : () => HelpersMisc.checkIsAnyPromiseTrue([
                                MultiRankRoomModelMrrModel.checkIsRed(),
                                MultiCustomRoomModelMcrModel.checkIsRed(),
                                MultiFreeRoomModelMfrModel.checkIsRed(),
                                CoopCustomRoomModelCcrModel.checkIsRed(),
                                MultiMatchRoomModelMmrModel.checkIsRed(),
                                AutoTourneysRoomsProvider.checkIsRed(),
                            ]),
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyGames,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyWarListPanel, void 0);
                            },
                            checkIsRed      : () => HelpersMisc.checkIsAnyPromiseTrue([
                                MultiPlayerWarModelMpwModel.checkIsRedForMyMrwWars(),
                                MultiPlayerWarModelMpwModel.checkIsRedForMyMcwWars(),
                                MultiPlayerWarModelMpwModel.checkIsRedForMyMfwWars(),
                                MultiPlayerWarModelMpwModel.checkIsRedForMyCcwWars(),
                                MultiPlayerWarModelMpwModel.checkIsRedForMyMmwWars(),
                                MultiPlayerWarModelMpwModel.checkIsRedForMyAtwWars(),
                            ]),
                        },
                        {
                            commandType     : CommandType.C1_Mp_Spectate,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_MakeRequest,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestWarsPanel, {
                                                filter: null
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_HandleRequest,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwHandleRequestWarsPanel, void 0);
                                        },
                                        checkIsRed      : async () => !!WatchWarModelWwModel.getRequestedWarIdArray()?.length,
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_DeleteSpectator,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwDeleteWatcherWarsPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_Continue,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwOngoingWarsPanel, void 0);
                                        },
                                    },
                                ]);

                                this._showGroup2();
                            },
                            checkIsRed      : () => WatchWarModelWwModel.checkIsRed(),
                        },
                        {
                            commandType     : CommandType.C1_Mp_Replay,
                            isExpandVisible : false,
                            callback        : () => {
                                HelpersGameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().RwReplayListPanel, {
                                    filter                  : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                    ]);

                    this._showGroup1();
                    this._hideGroup2();
                },
                checkIsRed      : () => LobbyModelLobbyModel.checkIsRedForMultiPlayer(true),
            },
            {
                commandType     : CommandType.C0_MapEditor,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    HelpersGameFlow.gotoMyWarListPanel(WarTypesConstants.WarTypeId.Me);
                },
            },
            {
                commandType     : CommandType.C0_Chat,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({}) });
                },
                checkIsRed      : async () => ChatModel.checkHasUnreadMessage(),
            },
            {
                commandType     : CommandType.C0_MyProfile,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, {
                        userId: HelpersMisc.getExisted(UsersModel.getSelfUserId()),
                    });
                },
            },
            {
                commandType     : CommandType.C0_GameChart,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonGameChartPanel, void 0);
                },
            },
            {
                commandType     : CommandType.C0_GameSettings,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSettingsPanel, void 0);
                },
                checkIsRed      : () => LobbyModelLobbyModel.checkIsRedForGameSettings(),
            },
        ];
    }

    protected _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });

        return TimerTimerModel.wait(TweenTime);
    }
    protected _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        return TimerTimerModel.wait(TweenTime);
    }
    private _showGroup1(): void {
        const list0     = this._listCommand0;
        const list1     = this._listCommand1;
        const index0    = list0.getFirstSelectedItemIndex() ?? 0;
        const length0   = list0.getBoundDataArray()?.length ?? 0;
        const length1   = list1.getBoundDataArray()?.length ?? 0;
        // const offset1   = Math.max(0, length0 - index0 - length1);
        const offset0   = Math.max(0, ListMaxItems - length0);
        const offset1   = Math.max(0, Math.min(offset0 + index0, ListMaxItems - length1));
        const group1    = this._group1;
        // group1.height   = Math.max(0, length1 * ItemHeight + (length1 - 1) * ItemGap);
        // group1.bottom   = offset1 * ItemHeight + offset1 * ItemGap;
        group1.setY(offset1 * (ItemHeight + ItemGap));
        group1.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight - group1.getY(),
            rawValue    : length1 * ItemHeight + (length1 - 1) * ItemGap,
        }));
        list1.setSelectedItemIndex(-1);

        TweenExecutor.Executor.removeTweens(group1);
        TweenExecutor.Executor.get(group1)
            .set({ customVisible: true, customX: 150, customAlpha: 0 })
            .to({ customX: 190, customAlpha: 1 }, TweenTime);
    }
    // private _hideGroup1(): void {
    //     const group1    = this._group1;
    //     group1.visible  = false;
    //     AuxiliaryHelpers.Tween.removeTweens(group1);
    // }
    private _showGroup2(): void {
        const list0     = this._listCommand0;
        const list1     = this._listCommand1;
        const list2     = this._listCommand2;
        const index0    = list0.getFirstSelectedItemIndex() ?? 0;
        const length0   = list0.getBoundDataArray()?.length ?? 0;
        const index1    = list1.getFirstSelectedItemIndex() ?? 0;
        const length1   = list1.getBoundDataArray()?.length ?? 0;
        const length2   = list2.getBoundDataArray()?.length ?? 0;
        // const offset1   = Math.max(0, length0 - index0 - length1);
        // const offset2   = Math.max(0, offset1 + length1 - index1 - length2);
        const offset0   = Math.max(0, ListMaxItems - length0);
        const offset1   = Math.max(0, Math.min(offset0 + index0, ListMaxItems - length1));
        const offset2   = Math.max(0, Math.min(offset1 + index1, ListMaxItems - length2));
        const group2    = this._group2;
        // group2.height   = Math.max(0, length2 * ItemHeight + (length2 - 1) * ItemGap);
        // group2.bottom   = offset2 * ItemHeight + offset2 * ItemGap;
        group2.setY(offset2 * (ItemHeight + ItemGap));
        group2.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight - group2.getY(),
            rawValue    : length2 * ItemHeight + (length2 - 1) * ItemGap,
        }));
        list2.setSelectedItemIndex(-1);

        TweenExecutor.Executor.removeTweens(group2);
        TweenExecutor.Executor.get(group2)
            .set({ customVisible: true, customX: 340, customAlpha: 0 })
            .to({ customX: 380, customAlpha: 1 }, TweenTime);
    }
    private _hideGroup2(): void {
        const group2 = this._group2;
        group2.setIsVisible(false);
        TweenExecutor.Executor.removeTweens(group2);
    }
}

interface DataForCommandRenderer extends UiTypesUiListItemData.UiListItemData {
    commandType     : CommandType;
    isExpandVisible : boolean;
    callback        : () => void;
    checkIsRed?     : () => Promise<boolean>;
}
class CommandRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgExpand!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgRed!           : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this,         callback: this._onTouchedSelf },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }

    private _onTouchedSelf(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        this.getOpenData()?.callback();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._imgExpand.setIsVisible(!!this.getOpenData()?.isExpandVisible);
        this._updateImgRed();
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const commandType = this.getOpenData()?.commandType;
        if (commandType == null) {
            return;
        }

        this._labelName.setText(getCommandName(commandType) ?? LangConstants.UndefinedError);
    }

    private async _updateImgRed(): Promise<void> {
        const func  = this.getOpenData()?.checkIsRed;
        const img   = this._imgRed;
        if (!func) {
            img.setIsVisible(false);
        } else {
            const isRed = await func();
            if (func === this.getOpenData()?.checkIsRed) {
                img.setIsVisible(isRed);
            }
        }
    }
}

function getCommandName(commandType: CommandType): string | null {
    switch (commandType) {
        case CommandType.C0_SinglePlayer                : return LangUtils.getText(LangConstants.TextType.B0138);
        case CommandType.C0_MultiPlayer                 : return LangUtils.getText(LangConstants.TextType.B0137);
        case CommandType.C0_MyProfile                   : return LangUtils.getText(LangConstants.TextType.B0169);
        case CommandType.C0_Chat                        : return LangUtils.getText(LangConstants.TextType.B0383);
        case CommandType.C0_GameChart                   : return LangUtils.getText(LangConstants.TextType.B0900);
        case CommandType.C0_GameSettings                : return LangUtils.getText(LangConstants.TextType.B0604);
        case CommandType.C0_MapEditor                   : return LangUtils.getText(LangConstants.TextType.B0271);
        case CommandType.C1_Sp_Campaign                 : return LangUtils.getText(LangConstants.TextType.B1135);
        case CommandType.C1_Sp_Continue                 : return LangUtils.getText(LangConstants.TextType.B0024);
        case CommandType.C1_Sp_Sandbox                  : return LangUtils.getText(LangConstants.TextType.B1262);
        case CommandType.C1_Sp_WarRoom                  : return LangUtils.getText(LangConstants.TextType.B0614);
        case CommandType.C1_Mp_AutoTourneyMode          : return LangUtils.getText(LangConstants.TextType.B1022);
        case CommandType.C1_Mp_MatchMode                : return LangUtils.getText(LangConstants.TextType.B1012);
        case CommandType.C1_Mp_RankedMode               : return LangUtils.getText(LangConstants.TextType.B0404);
        case CommandType.C1_Mp_CreateRoom               : return LangUtils.getText(LangConstants.TextType.B0000);
        case CommandType.C1_Mp_JoinRoom                 : return LangUtils.getText(LangConstants.TextType.B0580);
        case CommandType.C1_Mp_MyRooms                  : return LangUtils.getText(LangConstants.TextType.B0410);
        case CommandType.C1_Mp_MyGames                  : return LangUtils.getText(LangConstants.TextType.B1283);
        case CommandType.C1_Mp_Replay                   : return LangUtils.getText(LangConstants.TextType.B0710);
        case CommandType.C1_Mp_Spectate                 : return LangUtils.getText(LangConstants.TextType.B0872);
        case CommandType.C2_Mp_CreateRoom_Ccr           : return LangUtils.getText(LangConstants.TextType.B0646);
        case CommandType.C2_Mp_CreateRoom_Mcr           : return LangUtils.getText(LangConstants.TextType.B1011);
        case CommandType.C2_Mp_Spectate_Continue        : return LangUtils.getText(LangConstants.TextType.B0222);
        case CommandType.C2_Mp_Spectate_DeleteSpectator : return LangUtils.getText(LangConstants.TextType.B0219);
        case CommandType.C2_Mp_Spectate_HandleRequest   : return LangUtils.getText(LangConstants.TextType.B0208);
        case CommandType.C2_Mp_Spectate_MakeRequest     : return LangUtils.getText(LangConstants.TextType.B0207);
        case CommandType.C2_Mp_RankedMode_BanMap        : return LangUtils.getText(LangConstants.TextType.B0084);
        case CommandType.C2_Mp_RankedMode_PreviewMap    : return LangUtils.getText(LangConstants.TextType.B0594);
        case CommandType.C2_Mp_RankedMode_SetGameNumber : return LangUtils.getText(LangConstants.TextType.B0413);
        case CommandType.C2_Mp_RankedMode_SetGameTimer  : return LangUtils.getText(LangConstants.TextType.B1284);
        case CommandType.C2_Mp_MatchMode_BanMap         : return LangUtils.getText(LangConstants.TextType.B0084);
        case CommandType.C2_Mp_MatchMode_PreviewMap     : return LangUtils.getText(LangConstants.TextType.B0594);
        case CommandType.C2_Mp_MatchMode_SetGameNumber  : return LangUtils.getText(LangConstants.TextType.B0413);
        case CommandType.C2_Mp_MatchMode_SetGameTimer   : return LangUtils.getText(LangConstants.TextType.B1284);
        case CommandType.C2_Mp_AutoTourney_PreviewMap   : return LangUtils.getText(LangConstants.TextType.B0594);
        case CommandType.C2_Mp_AutoTourney_Registration : return LangUtils.getText(LangConstants.TextType.B1025);
        case CommandType.C2_Mp_AutoTourney_TourneyInfo  : return LangUtils.getText(LangConstants.TextType.B0423);
        case CommandType.TODO                           : return `TODO`;
        default                                         : return null;
    }
}
