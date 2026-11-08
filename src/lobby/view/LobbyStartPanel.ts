import {
    AuxiliaryTypes_ChatToTarget,
    AutoTourneys_Rooms_Provider,
    CoopCustomRoom_Model_CcrModel,
    Chat_Model,
    Helpers_Misc,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    AutoTourneys_Mains_Provider,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    MultiMatchRoom_Model_MmrModel,
    MultiRankRoom_Model_MrrModel,
    WatchWar_Model_WwModel,
    Tween_Executor,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    Numbers_Utils,
    Helpers_GameFlow,
    Helpers_PointerInput,
    MultiPlayerRooms_Constants,
    GamePanels_Manager,
    AutoTourneys_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    WarTypes_Constants,
    type Egret_Egret,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

 
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
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupContainer!   : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _group0!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCommand0!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCommandRenderer>;

    private readonly _group1!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCommand1!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCommandRenderer>;

    private readonly _group2!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCommand2!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCommandRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._group,          callback : this._onTouchedGroup,  mouseStyle : Helpers_PointerInput.MouseStyleType.Default },
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

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
        group0.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : ListMaxHeight,
            rawValue : count0 * ItemHeight + (count0 - 1) * ItemGap,
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
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateCampaignsPanel, void 0);
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_WarRoom,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateMapListPanel, {
                                    mapFilter            : null,
                                    mapSorter            : null,
                                    usePreviousFilter    : true,
                                    usePreviousPageIndex : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Sandbox,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ScrCreateMapListPanel, {
                                    mapFilter            : null,
                                    mapSorter            : null,
                                    usePreviousFilter    : true,
                                    usePreviousPageIndex : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Continue,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmWarListPanel, void 0);
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
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrPreviewMapListPanel, {
                                                hasFog : false,
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
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrPreviewMapListPanel, {
                                                hasFog : false,
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
                                            const tourneyIdArray = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration))?.map(v => v.getTourneyId());
                                            if (tourneyIdArray.length <= 0) {
                                                FloatText.showLang(Lang_Constants.TextType.A0403);
                                                return;
                                            }

                                            for (const tourneyId of tourneyIdArray) {
                                                AutoTourneys_Mains_Provider.setIsNotifiedForRegistration(tourneyId, true);
                                            }

                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtRegisterPanel, void 0);
                                        },
                                        checkIsRed : () => AutoTourneys_Mains_Provider.checkIsRedForRegistration(),
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_TourneyInfo,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            if ((await AutoTourneys_Mains_Provider.getLastTourneyId()) == null) {
                                                FloatText.showLang(Lang_Constants.TextType.B0278);
                                                return;
                                            }

                                            this.closePanel();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtTourneyInfoPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            const tourneyIdArray = (await AutoTourneys_Mains_Provider.getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId()) ?? [];
                                            if (tourneyIdArray.length <= 0) {
                                                FloatText.showLang(Lang_Constants.TextType.B0278);
                                                return;
                                            }

                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtrPreviewMapListPanel, {
                                                tourneyId : Math.max(...tourneyIdArray),
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                            checkIsRed : () => AutoTourneys_Mains_Provider.checkIsRedForRegistration(),
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
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrCreateMapListPanel, {
                                                mapFilter            : null,
                                                mapSorter            : null,
                                                usePreviousFilter    : true,
                                                usePreviousPageIndex : true,
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_CreateRoom_Ccr,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrCreateMapListPanel, {
                                                mapFilter            : null,
                                                mapSorter            : null,
                                                usePreviousFilter    : true,
                                                usePreviousPageIndex : true,
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
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwJoinRoomListPanel, {
                                    preferredRoomType : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr,
                                    filter            : null,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyRooms,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
                            },
                            checkIsRed : () => Helpers_Misc.checkIsAnyPromiseTrue([
                                MultiRankRoom_Model_MrrModel.checkIsRed(),
                                MultiCustomRoom_Model_McrModel.checkIsRed(),
                                MultiFreeRoom_Model_MfrModel.checkIsRed(),
                                CoopCustomRoom_Model_CcrModel.checkIsRed(),
                                MultiMatchRoom_Model_MmrModel.checkIsRed(),
                                AutoTourneys_Rooms_Provider.checkIsRed(),
                            ]),
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyGames,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyWarListPanel, void 0);
                            },
                            checkIsRed : () => Helpers_Misc.checkIsAnyPromiseTrue([
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars(),
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyMcwWars(),
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyMfwWars(),
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyCcwWars(),
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyMmwWars(),
                                MultiPlayerWar_Model_MpwModel.checkIsRedForMyAtwWars(),
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
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestWarsPanel, {
                                                filter : null,
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_HandleRequest,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwHandleRequestWarsPanel, void 0);
                                        },
                                        checkIsRed : async () => !!WatchWar_Model_WwModel.getRequestedWarIdArray()?.length,
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_DeleteSpectator,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwDeleteWatcherWarsPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_Continue,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwOngoingWarsPanel, void 0);
                                        },
                                    },
                                ]);

                                this._showGroup2();
                            },
                            checkIsRed : () => WatchWar_Model_WwModel.checkIsRed(),
                        },
                        {
                            commandType     : CommandType.C1_Mp_Replay,
                            isExpandVisible : false,
                            callback        : () => {
                                Helpers_GameFlow.unloadAllWarsAndOpenCommonPanels();
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwReplayListPanel, {
                                    filter               : null,
                                    usePreviousFilter    : true,
                                    usePreviousPageIndex : true,
                                });
                            },
                        },
                    ]);

                    this._showGroup1();
                    this._hideGroup2();
                },
                checkIsRed : () => Lobby_Model_LobbyModel.checkIsRedForMultiPlayer(true),
            },
            {
                commandType     : CommandType.C0_MapEditor,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    Helpers_GameFlow.gotoMyWarListPanel(WarTypes_Constants.WarTypeId.Me);
                },
            },
            {
                commandType     : CommandType.C0_Chat,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({}) });
                },
                checkIsRed : async () => Chat_Model.checkHasUnreadMessage(),
            },
            {
                commandType     : CommandType.C0_MyProfile,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, {
                        userId : Helpers_Misc.getExisted(Users_Model.getSelfUserId()),
                    });
                },
            },
            {
                commandType     : CommandType.C0_GameChart,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonGameChartPanel, void 0);
                },
            },
            {
                commandType     : CommandType.C0_GameSettings,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSettingsPanel, void 0);
                },
                checkIsRed : () => Lobby_Model_LobbyModel.checkIsRedForGameSettings(),
            },
        ];
    }

    protected _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgMask,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContainer,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
        });

        return Timer_TimerModel.wait(TweenTime);
    }
    protected _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgMask,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContainer,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });

        return Timer_TimerModel.wait(TweenTime);
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
        group1.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : ListMaxHeight - group1.getY(),
            rawValue : length1 * ItemHeight + (length1 - 1) * ItemGap,
        }));
        list1.setSelectedItemIndex(-1);

        Tween_Executor.Executor.removeTweens(group1);
        Tween_Executor.Executor.get(group1)
            .set({ customVisible : true, customX : 150, customAlpha : 0 })
            .to({ customX : 190, customAlpha : 1 }, TweenTime);
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
        group2.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : ListMaxHeight - group2.getY(),
            rawValue : length2 * ItemHeight + (length2 - 1) * ItemGap,
        }));
        list2.setSelectedItemIndex(-1);

        Tween_Executor.Executor.removeTweens(group2);
        Tween_Executor.Executor.get(group2)
            .set({ customVisible : true, customX : 340, customAlpha : 0 })
            .to({ customX : 380, customAlpha : 1 }, TweenTime);
    }
    private _hideGroup2(): void {
        const group2 = this._group2;
        group2.setIsVisible(false);
        Tween_Executor.Executor.removeTweens(group2);
    }
}

interface DataForCommandRenderer extends Ui_Types_UiListItemData.UiListItemData {
    commandType     : CommandType;
    isExpandVisible : boolean;
    callback        : () => void;
    checkIsRed?     : () => Promise<boolean>;
}
class CommandRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgExpand!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgRed!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this,         callback : this._onTouchedSelf },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }

    private _onTouchedSelf(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
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

        this._labelName.setText(getCommandName(commandType) ?? Lang_Constants.UndefinedError);
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
        case CommandType.C0_SinglePlayer                : return Lang_Utils.getText(Lang_Constants.TextType.B0138);
        case CommandType.C0_MultiPlayer                 : return Lang_Utils.getText(Lang_Constants.TextType.B0137);
        case CommandType.C0_MyProfile                   : return Lang_Utils.getText(Lang_Constants.TextType.B0169);
        case CommandType.C0_Chat                        : return Lang_Utils.getText(Lang_Constants.TextType.B0383);
        case CommandType.C0_GameChart                   : return Lang_Utils.getText(Lang_Constants.TextType.B0900);
        case CommandType.C0_GameSettings                : return Lang_Utils.getText(Lang_Constants.TextType.B0604);
        case CommandType.C0_MapEditor                   : return Lang_Utils.getText(Lang_Constants.TextType.B0271);
        case CommandType.C1_Sp_Campaign                 : return Lang_Utils.getText(Lang_Constants.TextType.B1135);
        case CommandType.C1_Sp_Continue                 : return Lang_Utils.getText(Lang_Constants.TextType.B0024);
        case CommandType.C1_Sp_Sandbox                  : return Lang_Utils.getText(Lang_Constants.TextType.B1262);
        case CommandType.C1_Sp_WarRoom                  : return Lang_Utils.getText(Lang_Constants.TextType.B0614);
        case CommandType.C1_Mp_AutoTourneyMode          : return Lang_Utils.getText(Lang_Constants.TextType.B1022);
        case CommandType.C1_Mp_MatchMode                : return Lang_Utils.getText(Lang_Constants.TextType.B1012);
        case CommandType.C1_Mp_RankedMode               : return Lang_Utils.getText(Lang_Constants.TextType.B0404);
        case CommandType.C1_Mp_CreateRoom               : return Lang_Utils.getText(Lang_Constants.TextType.B0000);
        case CommandType.C1_Mp_JoinRoom                 : return Lang_Utils.getText(Lang_Constants.TextType.B0580);
        case CommandType.C1_Mp_MyRooms                  : return Lang_Utils.getText(Lang_Constants.TextType.B0410);
        case CommandType.C1_Mp_MyGames                  : return Lang_Utils.getText(Lang_Constants.TextType.B1283);
        case CommandType.C1_Mp_Replay                   : return Lang_Utils.getText(Lang_Constants.TextType.B0710);
        case CommandType.C1_Mp_Spectate                 : return Lang_Utils.getText(Lang_Constants.TextType.B0872);
        case CommandType.C2_Mp_CreateRoom_Ccr           : return Lang_Utils.getText(Lang_Constants.TextType.B0646);
        case CommandType.C2_Mp_CreateRoom_Mcr           : return Lang_Utils.getText(Lang_Constants.TextType.B1011);
        case CommandType.C2_Mp_Spectate_Continue        : return Lang_Utils.getText(Lang_Constants.TextType.B0222);
        case CommandType.C2_Mp_Spectate_DeleteSpectator : return Lang_Utils.getText(Lang_Constants.TextType.B0219);
        case CommandType.C2_Mp_Spectate_HandleRequest   : return Lang_Utils.getText(Lang_Constants.TextType.B0208);
        case CommandType.C2_Mp_Spectate_MakeRequest     : return Lang_Utils.getText(Lang_Constants.TextType.B0207);
        case CommandType.C2_Mp_RankedMode_BanMap        : return Lang_Utils.getText(Lang_Constants.TextType.B0084);
        case CommandType.C2_Mp_RankedMode_PreviewMap    : return Lang_Utils.getText(Lang_Constants.TextType.B0594);
        case CommandType.C2_Mp_RankedMode_SetGameNumber : return Lang_Utils.getText(Lang_Constants.TextType.B0413);
        case CommandType.C2_Mp_RankedMode_SetGameTimer  : return Lang_Utils.getText(Lang_Constants.TextType.B1284);
        case CommandType.C2_Mp_MatchMode_BanMap         : return Lang_Utils.getText(Lang_Constants.TextType.B0084);
        case CommandType.C2_Mp_MatchMode_PreviewMap     : return Lang_Utils.getText(Lang_Constants.TextType.B0594);
        case CommandType.C2_Mp_MatchMode_SetGameNumber  : return Lang_Utils.getText(Lang_Constants.TextType.B0413);
        case CommandType.C2_Mp_MatchMode_SetGameTimer   : return Lang_Utils.getText(Lang_Constants.TextType.B1284);
        case CommandType.C2_Mp_AutoTourney_PreviewMap   : return Lang_Utils.getText(Lang_Constants.TextType.B0594);
        case CommandType.C2_Mp_AutoTourney_Registration : return Lang_Utils.getText(Lang_Constants.TextType.B1025);
        case CommandType.C2_Mp_AutoTourney_TourneyInfo  : return Lang_Utils.getText(Lang_Constants.TextType.B0423);
        case CommandType.TODO                           : return `TODO`;
        default                                         : return null;
    }
}
