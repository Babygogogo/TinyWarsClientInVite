import {
    type Notifications_Mapping,
    type Helpers_PointerInput,
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type AuxiliaryTypes_RoomFilter,
    type Ui_Types_UiListItemData,
    CoopCustomRoom_Model_CcrModel,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    Tween_Executor,
    NormalMap_Model_NormalMapModel,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Wars_Constants,
    MultiPlayerRooms_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    CoopCustomRoom_Model_CcrProxy,
    MultiCustomRoom_Model_McrProxy,
    MultiFreeRoom_Model_MfrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";

export interface OpenData {
    preferredRoomType   : MultiPlayerRooms_Constants.MultiPlayerRoomType;
    filter              : AuxiliaryTypes_RoomFilter.RoomFilter | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseRoom!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSearch!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSearch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRoomList!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listRoom!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized   = false;
    private _hasReceivedMcrData = false;
    private _hasReceivedCcrData = false;
    private _hasReceivedMfrData = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },

            { type : "MsgMcrJoinRoom",                  callback : this._onNotifyMsgMcrJoinRoom },
            { type : "MsgMcrGetRoomPlayerInfo",         callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : "MsgMcrGetRoomStaticInfo",         callback : this._onNotifyMsgMcrGetRoomStaticInfo },
            { type : "MsgMcrGetJoinableRoomIdArray",    callback : this._onNotifyMsgMcrGetJoinableRoomIdArray },

            { type : "MsgCcrJoinRoom",                  callback : this._onNotifyMsgCcrJoinRoom },
            { type : "MsgCcrGetRoomStaticInfo",         callback : this._onNotifyMsgCcrGetRoomStaticInfo },
            { type : "MsgCcrGetRoomPlayerInfo",         callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : "MsgCcrGetJoinableRoomIdArray",    callback : this._onNotifyMsgCcrGetJoinableRoomIdArray },

            { type : "MsgMfrJoinRoom",                  callback : this._onNotifyMsgMfrJoinRoom },
            { type : "MsgMfrGetRoomStaticInfo",         callback : this._onNotifyMsgMfrGetRoomStaticInfo },
            { type : "MsgMfrGetRoomPlayerInfo",         callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : "MsgMfrGetJoinableRoomIdArray",    callback : this._onNotifyMsgMfrGetJoinableRoomIdArray },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
            { ui : this._btnSearch,      callback : this._onTouchedBtnSearch },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listRoom.setItemRendererClass(RoomRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();

        this._updateComponentsForLanguage();

        this._hasReceivedMcrData = false;
        this._hasReceivedCcrData = false;
        this._hasReceivedMfrData = false;
        MultiCustomRoom_Model_McrProxy.reqMcrGetJoinableRoomIdArray();
        CoopCustomRoom_Model_CcrProxy.reqCcrGetJoinableRoomIdArray();
        MultiFreeRoom_Model_MfrProxy.reqMfrGetJoinableRoomIdArray();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateGroupRoomList();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listRoom.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public setAndReviseSelectedRoomId(newRoomId: number | null, needScroll: boolean): void {
        const listRoom  = this._listRoom;
        const index     = listRoom.getRevisedFirstIndex(v => v?.roomId == newRoomId);
        listRoom.setSelectedItemIndex(index);
        this._updateComponentsForTargetRoomInfo();

        if (needScroll) {
            listRoom.scrollToItem(index);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMcrJoinRoom(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMcrJoinRoom"]>): void {
        const data      = (Helpers_Misc.getExisted(e.data)).msg;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrRoomInfoPanel, { roomId });
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrGetRoomStaticInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMcrGetRoomStaticInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMcrGetRoomPlayerInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetJoinableRoomIdArray(): void {
        this._hasReceivedMcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrJoinRoom(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgCcrJoinRoom"]>): void {
        const data      = (Helpers_Misc.getExisted(e.data)).msg;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrRoomInfoPanel, { roomId });
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }
    private _onNotifyMsgCcrGetRoomStaticInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgCcrGetRoomStaticInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgCcrGetRoomPlayerInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetJoinableRoomIdArray(): void {
        this._hasReceivedCcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMfrJoinRoom(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrJoinRoom"]>): void {
        const data      = (Helpers_Misc.getExisted(e.data)).msg;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrRoomInfoPanel, { roomId });
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrGetRoomStaticInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrGetRoomStaticInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrGetRoomPlayerInfo"]>): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr, ((Helpers_Misc.getExisted(e.data)).msg).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetJoinableRoomIdArray(): void {
        this._hasReceivedMfrData = true;
        this._updateGroupRoomList();
    }

    private _onTouchedBtnBack(): void {
        const roomType = this.getOpenData()?.preferredRoomType;
        this.closePanel();
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrMainMenuPanel, void 0);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrMainMenuPanel, void 0);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId),
                MultiCustomRoom_Model_McrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForMcw = roomStaticInfo?.getSettingsForMcw();
            if ((settingsForMcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMcw.getWarPassword();
                if (!password) {
                    MultiCustomRoom_Model_McrProxy.reqMcrJoinRoom(roomId);
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                        title        : Lang_Utils.getText(Lang_Constants.TextType.B0449),
                        currentValue : ``,
                        tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0068, Wars_Constants.Misc.MaxPasswordLength),
                        charRestrict : `0-9`,
                        maxChars     : Wars_Constants.Misc.MaxPasswordLength,
                        isAutoClose  : false,
                        callback     : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText.showLang(Lang_Constants.TextType.A0017);
                            } else {
                                MultiCustomRoom_Model_McrProxy.reqMcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId),
                CoopCustomRoom_Model_CcrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForCcw = roomStaticInfo?.getSettingsForCcw();
            if ((settingsForCcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForCcw.getWarPassword();
                if (!password) {
                    CoopCustomRoom_Model_CcrProxy.reqCcrJoinRoom(roomId);
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                        title        : Lang_Utils.getText(Lang_Constants.TextType.B0449),
                        currentValue : ``,
                        tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0068, Wars_Constants.Misc.MaxPasswordLength),
                        charRestrict : `0-9`,
                        maxChars     : Wars_Constants.Misc.MaxPasswordLength,
                        isAutoClose  : false,
                        callback     : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText.showLang(Lang_Constants.TextType.A0017);
                            } else {
                                CoopCustomRoom_Model_CcrProxy.reqCcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId),
                MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForMfw = Helpers_Misc.getExisted(roomStaticInfo?.getSettingsForMfw());
            if ((settingsForMfw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMfw.getWarPassword();
                if (!password) {
                    MultiFreeRoom_Model_MfrProxy.reqMfrJoinRoom(roomId);
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                        title        : Lang_Utils.getText(Lang_Constants.TextType.B0449),
                        currentValue : ``,
                        tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0068, Wars_Constants.Misc.MaxPasswordLength),
                        charRestrict : `0-9`,
                        maxChars     : Wars_Constants.Misc.MaxPasswordLength,
                        isAutoClose  : false,
                        callback     : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText.showLang(Lang_Constants.TextType.A0017);
                            } else {
                                MultiFreeRoom_Model_MfrProxy.reqMfrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedBtnSearch(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonRoomFilterPanel, {
            roomFilter        : openData.filter,
            isMapNameEnabled  : true,
            callbackOnConfirm : roomFilter => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwJoinRoomListPanel, {
                    preferredRoomType : openData.preferredRoomType,
                    filter            : roomFilter,
                });
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = true;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : Common_View_CommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0002) },
                pageClass   : Common_View_CommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0003) },
                pageClass   : Common_View_CommonWarAdvancedSettingsPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarMapInfoPage(),
            this._updateCommonWarPlayerInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelMultiPlayer.setLangText(Lang_Constants.TextType.B0137);
        this._labelChooseRoom.setLangText(Lang_Constants.TextType.B0580);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoRoom.setLangText(Lang_Constants.TextType.B0582);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0583);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);

        this._groupNavigator.arrangeItems();
    }

    private async _updateGroupRoomList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoRoom   = this._labelNoRoom;
        const listRoom      = this._listRoom;
        if ((!this._hasReceivedMcrData) || (!this._hasReceivedCcrData) || (!this._hasReceivedMfrData)) {
            labelLoading.setIsVisible(true);
            labelNoRoom.setIsVisible(false);
            listRoom.setIsVisible(false);
            await listRoom.removeAllItems();
            this.setAndReviseSelectedRoomId(null, true);

        } else {
            const dataArray = await this._createDataForListRoom();
            labelLoading.setIsVisible(false);
            labelNoRoom.setIsVisible(!dataArray.length);
            listRoom.setIsVisible(true);
            await listRoom.bindData(dataArray);
            this.setAndReviseSelectedRoomId(dataArray[0]?.roomId, true);
        }
    }

    private _checkAndUpdateComponentsForTargetRoomInfo(roomType: MultiPlayerRooms_Constants.MultiPlayerRoomType, roomId: number): void {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        if ((selectedData.roomType === roomType) && (selectedData.roomId === roomId)) {
            this._updateComponentsForTargetRoomInfo();
        }
    }

    private async _updateComponentsForTargetRoomInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        if (this._listRoom.getFirstSelectedData() == null) {
            groupTab.setIsVisible(false);
            btnNextStep.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);
            btnNextStep.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
        }
    }

    private async _updateCommonWarPlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const roomStaticInfo = await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog            : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig        : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(roomStaticInfo.getSettingsForMcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers : null,
                    },
                };
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo = await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog            : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig        : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers : null,
                    },
                };
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const warData = (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();
            return warData == null
                ? null
                : {
                    warInfo : {
                        warData            : warData,
                        showInitialWarData : false,
                        overridingPlayers  : null,
                    },
                };

        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType == MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForListRoom(): Promise<DataForRoomRenderer[]> {
        const filter = this.getOpenData()?.filter;
        const [mcrRoomIdSet, ccrRoomIdSet, mfrRoomIdSet] = await Promise.all([
            MultiCustomRoom_Model_McrModel.getJoinableRoomIdSetWithFilter(filter),
            CoopCustomRoom_Model_CcrModel.getJoinableRoomIdSetWithFilter(filter),
            MultiFreeRoom_Model_MfrModel.getJoinableRoomIdSetWithFilter(filter),
        ]);
        const dataArray : DataForRoomRenderer[] = [];
        for (const roomId of [...mcrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr,
                roomId   : roomId,
                panel    : this,
            });
        }
        for (const roomId of [...ccrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType : MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr,
                roomId   : roomId,
                panel    : this,
            });
        }
        for (const roomId of [...mfrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr,
                roomId   : roomId,
                panel    : this,
            });
        }

        return dataArray;
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 0, customY : 30 },
            endProps   : { customAlpha : 1, customY : 70 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRoomList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 1, customY : 70 },
            endProps   : { customAlpha : 0, customY : 30 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRoomList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name    : string;
}
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}

interface DataForRoomRenderer extends Ui_Types_UiListItemData.UiListItemData {
    roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType;
    roomId      : number;
    panel       : Panel;
}
class RoomRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnHelp!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupName!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMode!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnHelp,    callback : this._onTouchedBtnHelp },
            { ui : this._groupName,  callback : this._onTouchedGroupName },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateBtnHelp();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnHelp(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { roomId, roomType, panel } = openData;
        panel.setAndReviseSelectedRoomId(roomId, false);

        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(settingsForMcw.getNormalMapId());
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getLanguageText({ textArray : mapRawData?.getMapExtraText()?.getMapDescription() }) ?? Lang_Constants.UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(settingsForCcw.getNormalMapId());
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getLanguageText({ textArray : mapRawData?.getMapExtraText()?.getMapDescription() }) ?? Lang_Constants.UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            // nothing to do
        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabels();
    }

    private async _updateLabels(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { roomId, roomType }  = openData;
        const labelName             = this._labelName;
        const layoutName            = this._layoutName;
        this._labelId.setText(`#${roomId}`);
        this._labelMode.setText(Lang_Utils.getRoomTypeName(roomType) ?? Lang_Constants.UndefinedError);
        layoutName.arrangeItems();

        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId());
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? Lang_Constants.UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForCcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId());
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? Lang_Constants.UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMfw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);
                labelName.setText(settingsForMfw.getWarName()?.trim() || `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`);
            }

        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }

        layoutName.arrangeItems();
    }
    private async _updateBtnHelp(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { roomId, roomType }  = openData;
        this._btnHelp.setIsVisible(false);

        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await NormalMap_Model_NormalMapModel.getBriefData(settingsForMcw.getNormalMapId()))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await NormalMap_Model_NormalMapModel.getBriefData(settingsForCcw.getNormalMapId()))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(false);
            }
        } else {
            throw Helpers_Misc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedGroupName(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const data = this.getOpenData();
        data?.panel.setAndReviseSelectedRoomId(data.roomId, false);
    }
}
