import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiItemTapEventData,
    type Ui_Types_UiListItemData,
    AutoTourneys_Rooms_Provider,
    CoopCustomRoom_Model_CcrModel,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    MultiMatchRoom_Model_MmrModel,
    MultiRankRoom_Model_MrrModel,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    Lang_Utils,
    MultiPlayerRooms_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    AutoTourneys_Rooms_Gateway,
    CoopCustomRoom_Model_CcrProxy,
    MultiCustomRoom_Model_McrProxy,
    MultiFreeRoom_Model_MfrProxy,
    MultiMatchRoom_Model_MmrProxy,
    MultiRankRoom_Model_MrrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
    WarTypes_Constants,
} from "../../internal.ts";
import type { S as AtrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type { S as AtrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type { S as AtrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import type { S as CcrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type { S as CcrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type { S as McrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type { S as McrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type { S as MfrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type { S as MfrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type { S as MmrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type { S as MmrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type { S as MmrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import type { S as MrrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type { S as MrrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type { S as MrrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRoom!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRoomList!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listRoom!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized       = false;
    private _hasReceivedAtrData     = false;
    private _hasReceivedCcrData     = false;
    private _hasReceivedMcrData     = false;
    private _hasReceivedMfrData     = false;
    private _hasReceivedMmrData     = false;
    private _hasReceivedMrrData     = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },

            { type: Notifications_TypeId.TypeId.MsgAtrGetJoinedRoomIdArray,          callback: this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type: Notifications_TypeId.TypeId.MsgAtrDeleteRoomByServer,            callback: this._onNotifyMsgAtrDeleteRoomByServer },
            { type: Notifications_TypeId.TypeId.MsgAtrGetRoomPublicInfo,             callback: this._onNotifyMsgAtrGetRoomPublicInfo },
            { type: Notifications_TypeId.TypeId.MsgAtrSetSelfSettings,               callback: this._onNotifyMsgAtrSetSelfSettings },
            { type: Notifications_TypeId.TypeId.MsgAtrSetBannedCoIdArray,            callback: this._onNotifyMsgAtrSetBannedCoIdArray },

            { type: Notifications_TypeId.TypeId.MsgCcrGetRoomStaticInfo,             callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: Notifications_TypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: Notifications_TypeId.TypeId.MsgCcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgCcrGetJoinedRoomIdArray },

            { type: Notifications_TypeId.TypeId.MsgMcrGetRoomStaticInfo,             callback: this._onNotifyMsgMcrGetRoomStaticInfo },
            { type: Notifications_TypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: Notifications_TypeId.TypeId.MsgMcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMcrGetJoinedRoomIdArray },

            { type: Notifications_TypeId.TypeId.MsgMfrGetRoomStaticInfo,             callback: this._onNotifyMsgMfrGetRoomStaticInfo },
            { type: Notifications_TypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: Notifications_TypeId.TypeId.MsgMfrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMfrGetJoinedRoomIdArray },

            { type: Notifications_TypeId.TypeId.MsgMmrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMmrGetJoinedRoomIdArray },
            { type: Notifications_TypeId.TypeId.MsgMmrDeleteRoomByServer,            callback: this._onNotifyMsgMmrDeleteRoomByServer },
            { type: Notifications_TypeId.TypeId.MsgMmrGetRoomPublicInfo,             callback: this._onNotifyMsgMmrGetRoomPublicInfo },
            { type: Notifications_TypeId.TypeId.MsgMmrSetSelfSettings,               callback: this._onNotifyMsgMmrSetSelfSettings },
            { type: Notifications_TypeId.TypeId.MsgMmrSetBannedCoIdArray,            callback: this._onNotifyMsgMmrSetBannedCoIdArray },

            { type: Notifications_TypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMrrGetJoinedRoomIdArray },
            { type: Notifications_TypeId.TypeId.MsgMrrDeleteRoomByServer,            callback: this._onNotifyMsgMrrDeleteRoomByServer },
            { type: Notifications_TypeId.TypeId.MsgMrrGetRoomPublicInfo,             callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: Notifications_TypeId.TypeId.MsgMrrSetSelfSettings,               callback: this._onNotifyMsgMrrSetSelfSettings },
            { type: Notifications_TypeId.TypeId.MsgMrrSetBannedCoIdArray,            callback: this._onNotifyMsgMrrSetBannedCoIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
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

        this._hasReceivedAtrData    = false;
        this._hasReceivedCcrData    = false;
        this._hasReceivedMcrData    = false;
        this._hasReceivedMfrData    = false;
        this._hasReceivedMmrData    = false;
        this._hasReceivedMrrData    = false;
        AutoTourneys_Rooms_Gateway.reqAtrGetJoinedRoomIdArray();
        CoopCustomRoom_Model_CcrProxy.reqCcrGetJoinedRoomIdArray();
        MultiCustomRoom_Model_McrProxy.reqMcrGetJoinedRoomIdArray();
        MultiFreeRoom_Model_MfrProxy.reqMfrGetJoinedRoomIdArray();
        MultiMatchRoom_Model_MmrProxy.reqMmrGetJoinedRoomIdArray();
        MultiRankRoom_Model_MrrProxy.reqMrrGetJoinedRoomIdArray();
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

    public async setAndReviseSelectedRoomId(newIndex: number, needScroll: boolean): Promise<void> {
        const listRoom = this._listRoom;
        listRoom.setSelectedItemIndex(newIndex);
        this._updateComponentsForPreviewingRoomInfo();

        if (needScroll) {
            listRoom.scrollToItem(newIndex);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtrGetJoinedRoomIdArray(): void {
        this._hasReceivedAtrData = true;
        this._updateGroupRoomList();
    }
    private _onNotifyMsgAtrDeleteRoomByServer(): void {
        this._updateGroupRoomList();
    }
    private _onNotifyMsgAtrGetRoomPublicInfo(e: Egret_Egret.Event): void {
        const data          = e.data as AtrGetRoomPublicInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgAtrSetSelfSettings(e: Egret_Egret.Event): void {
        const data          = e.data as AtrSetSelfSettingsResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgAtrSetBannedCoIdArray(e: Egret_Egret.Event): void {
        const data          = e.data as AtrSetBannedCoIdArrayResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgCcrGetRoomStaticInfo(e: Egret_Egret.Event): void {
        const data          = e.data as CcrGetRoomStaticInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
        const data          = e.data as CcrGetRoomPlayerInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr)
        ) {
            const selfUserId = Users_Model.getSelfUserId();
            if (data.getRoomPlayerInfo()?.getPlayerDataList()?.some(v => v.getUserId() === selfUserId)) {
                this._updateComponentsForPreviewingRoomInfo();
            } else {
                this._updateGroupRoomList();
            }
        }
    }
    private _onNotifyMsgCcrGetJoinedRoomIdArray(): void {
        this._hasReceivedCcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMcrGetRoomStaticInfo(e: Egret_Egret.Event): void {
        const data          = e.data as McrGetRoomStaticInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
        const data          = e.data as McrGetRoomPlayerInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr)
        ) {
            const selfUserId = Users_Model.getSelfUserId();
            if (data.getRoomPlayerInfo()?.getPlayerDataList()?.some(v => v.getUserId() === selfUserId)) {
                this._updateComponentsForPreviewingRoomInfo();
            } else {
                this._updateGroupRoomList();
            }
        }
    }
    private _onNotifyMsgMcrGetJoinedRoomIdArray(): void {
        this._hasReceivedMcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMfrGetRoomStaticInfo(e: Egret_Egret.Event): void {
        const data          = e.data as MfrGetRoomStaticInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
        const data          = e.data as MfrGetRoomPlayerInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr)
        ) {
            const selfUserId = Users_Model.getSelfUserId();
            if (data.getRoomPlayerInfo()?.getPlayerDataList().some(v => v.getUserId() === selfUserId)) {
                this._updateComponentsForPreviewingRoomInfo();
            } else {
                this._updateGroupRoomList();
            }
        }
    }
    private _onNotifyMsgMfrGetJoinedRoomIdArray(): void {
        this._hasReceivedMfrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMmrGetJoinedRoomIdArray(): void {
        this._hasReceivedMmrData = true;
        this._updateGroupRoomList();
    }
    private _onNotifyMsgMmrDeleteRoomByServer(): void {
        this._updateGroupRoomList();
    }
    private _onNotifyMsgMmrGetRoomPublicInfo(e: Egret_Egret.Event): void {
        const data          = e.data as MmrGetRoomPublicInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMmrSetSelfSettings(e: Egret_Egret.Event): void {
        const data          = e.data as MmrSetSelfSettingsResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMmrSetBannedCoIdArray(e: Egret_Egret.Event): void {
        const data          = e.data as MmrSetBannedCoIdArrayResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMrrGetJoinedRoomIdArray(): void {
        this._hasReceivedMrrData = true;
        this._updateGroupRoomList();
    }
    private _onNotifyMsgMrrDeleteRoomByServer(): void {
        this._updateGroupRoomList();
    }
    private _onNotifyMsgMrrGetRoomPublicInfo(e: Egret_Egret.Event): void {
        const data          = e.data as MrrGetRoomPublicInfoResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMrrSetSelfSettings(e: Egret_Egret.Event): void {
        const data          = e.data as MrrSetSelfSettingsResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMrrSetBannedCoIdArray(e: Egret_Egret.Event): void {
        const data          = e.data as MrrSetBannedCoIdArrayResponse;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
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
        this.closePanel();

        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            const roomInfo = await AutoTourneys_Rooms_Provider.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await AutoTourneys_Rooms_Provider.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoom_Model_MmrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiMatchRoom_Model_MmrModel.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            const roomInfo = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : Common_View_CommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0002) },
                pageClass   : Common_View_CommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0003) },
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
        this._labelMyRoom.setLangText(Lang_Constants.TextType.B0410);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoRoom.setLangText(Lang_Constants.TextType.B0582);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B1383);

        this._groupNavigator.arrangeItems();
    }

    private async _updateGroupRoomList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoRoom   = this._labelNoRoom;
        const listRoom      = this._listRoom;
        if ((!this._hasReceivedAtrData) ||
            (!this._hasReceivedCcrData) ||
            (!this._hasReceivedMcrData) ||
            (!this._hasReceivedMfrData) ||
            (!this._hasReceivedMmrData) ||
            (!this._hasReceivedMrrData)
        ) {
            labelLoading.setIsVisible(true);
            labelNoRoom.setIsVisible(false);
            listRoom.setIsVisible(false);
            await listRoom.removeAllItems();
            this.setAndReviseSelectedRoomId(-1, true);

        } else {
            const dataArray = await this._createDataForListRoom();
            labelLoading.setIsVisible(false);
            labelNoRoom.setIsVisible(!dataArray.length);
            listRoom.setIsVisible(true);
            await listRoom.bindData(dataArray);
            this.setAndReviseSelectedRoomId(dataArray.length ? 0 : -1, true);
        }
    }

    private async _updateComponentsForPreviewingRoomInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        if ((!this._hasReceivedAtrData)                 ||
            (!this._hasReceivedCcrData)                 ||
            (!this._hasReceivedMcrData)                 ||
            (!this._hasReceivedMfrData)                 ||
            (!this._hasReceivedMmrData)                 ||
            (!this._hasReceivedMrrData)                 ||
            (this._listRoom.getFirstSelectedData() == null)
        ) {
            groupTab.setIsVisible(false);
            btnNextStep.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);
            btnNextStep.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _createDataForListRoom(): Promise<DataForRoomRenderer[]> {
        const dataArray: DataForRoomRenderer[] = [];
        dataArray.push(...((await AutoTourneys_Rooms_Provider.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiRankRoom_Model_MrrModel.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiMatchRoom_Model_MmrModel.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...[...await MultiCustomRoom_Model_McrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await CoopCustomRoom_Model_CcrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await MultiFreeRoom_Model_MfrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));

        return dataArray;
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
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            const roomInfo      = await AutoTourneys_Rooms_Provider.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId);
            const normalMapId       = roomStaticInfo ? (roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomStaticInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const roomInfo      = await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const warData   = roomId == null
                ? null
                : (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();

            return warData == null
                ? null
                : {
                    warInfo : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            const roomInfo      = await MultiMatchRoom_Model_MmrModel.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else {
            return null;
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            return AutoTourneys_Rooms_Provider.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoom_Model_MmrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoom_Model_MrrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            return AutoTourneys_Rooms_Provider.createDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoom_Model_MmrModel.createDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoom_Model_MrrModel.createDataForCommonWarBasicSettingsPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            return AutoTourneys_Rooms_Provider.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoom_Model_CcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoom_Model_McrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoom_Model_MfrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoom_Model_MmrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoom_Model_MrrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            return null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}

interface DataForRoomRenderer extends Ui_Types_UiListItemData.UiListItemData {
    roomId      : number;
    roomType    : number;
    panel       : Panel;
}
class RoomRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRoomRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRoomRenderer>
{
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRoomId!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarType! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgRed!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomId        = openData.roomId;
        const roomType      = openData.roomType;
        const layoutName    = this._layoutName;
        this._labelRoomId.setText(`#${roomId}`);
        layoutName.arrangeItems();

        const imgRed        = this._imgRed;
        const labelName     = this._labelName;
        const labelWarType  = this._labelWarType;
        if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr) {
            const roomInfo      = await AutoTourneys_Rooms_Provider.getRoomInfo(roomId);
            imgRed.setIsVisible(await AutoTourneys_Rooms_Provider.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? Lang_Utils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.AtwFog : WarTypes_Constants.WarTypeId.AtwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) ?? Lang_Constants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(roomId);
            const settingsForCcw    = roomStaticInfo?.getSettingsForCcw();
            imgRed.setIsVisible(await CoopCustomRoom_Model_CcrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? Lang_Utils.getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(settingsForCcw
                ? settingsForCcw.getWarName() || (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId()) ?? Lang_Constants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr) {
            const roomStaticInfo    = await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(roomId);
            const settingsForMcw    = roomStaticInfo?.getSettingsForMcw();
            imgRed.setIsVisible(await MultiCustomRoom_Model_McrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? Lang_Utils.getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.McwFog : WarTypes_Constants.WarTypeId.McwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(settingsForMcw
                ? settingsForMcw.getWarName() || (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId()) ?? Lang_Constants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr) {
            const roomInfo = await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId);
            imgRed.setIsVisible(await MultiFreeRoom_Model_MfrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? Lang_Utils.getWarTypeName(roomInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? roomInfo.getSettingsForMfw()?.getWarName() || `(${Lang_Utils.getText(Lang_Constants.TextType.B0557)})`
                : ``
            );

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoom_Model_MmrModel.getRoomInfo(roomId);
            imgRed.setIsVisible(await MultiMatchRoom_Model_MmrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? Lang_Utils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.MmwFog : WarTypes_Constants.WarTypeId.MmwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) ?? Lang_Constants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
            imgRed.setIsVisible(await MultiRankRoom_Model_MrrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? Lang_Utils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd) ?? Lang_Constants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) ?? Lang_Constants.UndefinedError)
                : ``
            );
        }

        layoutName.arrangeItems();
    }

    public onItemTapEvent(e: Ui_Types_UiItemTapEventData.UiItemTapEventData): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedRoomId(e.itemIndex, false);
    }
}
