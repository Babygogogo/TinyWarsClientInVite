import * as AutoTourneysRoomsGateway from "../../autoTourneys/rooms/Gateway.ts";
import * as AutoTourneysRoomsProvider from "../../autoTourneys/rooms/Provider.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as CoopCustomRoomModelCcrProxy from "../../coopCustomRoom/model/CcrProxy.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiCustomRoomModelMcrModel from "../../multiCustomRoom/model/McrModel.ts";
import * as MultiCustomRoomModelMcrProxy from "../../multiCustomRoom/model/McrProxy.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiFreeRoomModelMfrProxy from "../../multiFreeRoom/model/MfrProxy.ts";
import * as MultiMatchRoomModelMmrModel from "../../multiMatchRoom/model/MmrModel.ts";
import * as MultiMatchRoomModelMmrProxy from "../../multiMatchRoom/model/MmrProxy.ts";
import * as MultiPlayerRoomsConstants from "../../multiPlayerRooms/Constants.ts";
import * as MultiRankRoomModelMrrModel from "../../multiRankRoom/model/MrrModel.ts";
import * as MultiRankRoomModelMrrProxy from "../../multiRankRoom/model/MrrProxy.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiItemTapEventData from "../../ui/types/UiItemTapEventData.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRoom!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRoomList!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listRoom!             : UiInterfacesIUiScrollList.IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized       = false;
    private _hasReceivedAtrData     = false;
    private _hasReceivedCcrData     = false;
    private _hasReceivedMcrData     = false;
    private _hasReceivedMfrData     = false;
    private _hasReceivedMmrData     = false;
    private _hasReceivedMrrData     = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },

            { type: NotificationsTypeId.TypeId.MsgAtrGetJoinedRoomIdArray,          callback: this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgAtrDeleteRoomByServer,            callback: this._onNotifyMsgAtrDeleteRoomByServer },
            { type: NotificationsTypeId.TypeId.MsgAtrGetRoomPublicInfo,             callback: this._onNotifyMsgAtrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgAtrSetSelfSettings,               callback: this._onNotifyMsgAtrSetSelfSettings },
            { type: NotificationsTypeId.TypeId.MsgAtrSetBannedCoIdArray,            callback: this._onNotifyMsgAtrSetBannedCoIdArray },

            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomStaticInfo,             callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgCcrGetJoinedRoomIdArray },

            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomStaticInfo,             callback: this._onNotifyMsgMcrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMcrGetJoinedRoomIdArray },

            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomStaticInfo,             callback: this._onNotifyMsgMfrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMfrGetJoinedRoomIdArray },

            { type: NotificationsTypeId.TypeId.MsgMmrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMmrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMmrDeleteRoomByServer,            callback: this._onNotifyMsgMmrDeleteRoomByServer },
            { type: NotificationsTypeId.TypeId.MsgMmrGetRoomPublicInfo,             callback: this._onNotifyMsgMmrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgMmrSetSelfSettings,               callback: this._onNotifyMsgMmrSetSelfSettings },
            { type: NotificationsTypeId.TypeId.MsgMmrSetBannedCoIdArray,            callback: this._onNotifyMsgMmrSetBannedCoIdArray },

            { type: NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMrrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMrrDeleteRoomByServer,            callback: this._onNotifyMsgMrrDeleteRoomByServer },
            { type: NotificationsTypeId.TypeId.MsgMrrGetRoomPublicInfo,             callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgMrrSetSelfSettings,               callback: this._onNotifyMsgMrrSetSelfSettings },
            { type: NotificationsTypeId.TypeId.MsgMrrSetBannedCoIdArray,            callback: this._onNotifyMsgMrrSetBannedCoIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        AutoTourneysRoomsGateway.reqAtrGetJoinedRoomIdArray();
        CoopCustomRoomModelCcrProxy.reqCcrGetJoinedRoomIdArray();
        MultiCustomRoomModelMcrProxy.reqMcrGetJoinedRoomIdArray();
        MultiFreeRoomModelMfrProxy.reqMfrGetJoinedRoomIdArray();
        MultiMatchRoomModelMmrProxy.reqMmrGetJoinedRoomIdArray();
        MultiRankRoomModelMrrProxy.reqMrrGetJoinedRoomIdArray();
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
    private _onNotifyMsgAtrGetRoomPublicInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgAtrSetSelfSettings(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgAtrSetBannedCoIdArray(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgCcrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr)
        ) {
            const selfUserId = UsersModel.getSelfUserId();
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

    private _onNotifyMsgMcrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr)
        ) {
            const selfUserId = UsersModel.getSelfUserId();
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

    private _onNotifyMsgMfrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr)
        ) {
            const selfUserId = UsersModel.getSelfUserId();
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
    private _onNotifyMsgMmrGetRoomPublicInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMmrSetSelfSettings(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMmrSetBannedCoIdArray(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr)
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
    private _onNotifyMsgMrrGetRoomPublicInfo(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMrrSetSelfSettings(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMrrSetBannedCoIdArray(e: VendorEgretEgret.Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS.S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        this.closePanel();

        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            const roomInfo = await AutoTourneysRoomsProvider.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await AutoTourneysRoomsProvider.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().AtrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().McrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiMatchRoomModelMmrModel.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            const roomInfo = await MultiRankRoomModelMrrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiRankRoomModelMrrModel.getSelfSettings(roomId))?.resetData(roomInfo);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrRoomInfoPanel, {
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
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0003) },
                pageClass   : CommonViewCommonWarAdvancedSettingsPage.Page,
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
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0040));
        this._labelMultiPlayer.setText(LangUtils.getText(LangConstants.TextType.B0137));
        this._labelMyRoom.setText(LangUtils.getText(LangConstants.TextType.B0410));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._labelNoRoom.setText(LangUtils.getText(LangConstants.TextType.B0582));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B1383));

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
        dataArray.push(...((await AutoTourneysRoomsProvider.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiRankRoomModelMrrModel.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiMatchRoomModelMmrModel.getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...[...await MultiCustomRoomModelMcrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await CoopCustomRoomModelCcrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await MultiFreeRoomModelMfrModel.getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr,
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

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            const roomInfo      = await AutoTourneysRoomsProvider.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId);
            const normalMapId       = roomStaticInfo ? (roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomStaticInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const roomInfo      = await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const warData   = roomId == null
                ? null
                : (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();

            return warData == null
                ? null
                : {
                    warInfo : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            const roomInfo      = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoomModelMrrModel.getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else {
            return null;
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            return AutoTourneysRoomsProvider.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            return AutoTourneysRoomsProvider.createDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModel.createDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModel.createDataForCommonWarBasicSettingsPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            return AutoTourneysRoomsProvider.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            return null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
        });

        await TimerTimerModel.wait();
    }
}

interface DataForTabItemRenderer extends UiTypesUiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends UiComponentsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }
}

interface DataForRoomRenderer extends UiTypesUiListItemData.UiListItemData {
    roomId      : number;
    roomType    : number;
    panel       : Panel;
}
class RoomRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRoomRenderer>
{
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRoomId!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarType! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgRed!       : UiInterfacesIUiLabel.IUiLabel;

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
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr) {
            const roomInfo      = await AutoTourneysRoomsProvider.getRoomInfo(roomId);
            imgRed.setIsVisible(await AutoTourneysRoomsProvider.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? LangUtils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.AtwFog : WarTypesConstants.WarTypeId.AtwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId);
            const settingsForCcw    = roomStaticInfo?.getSettingsForCcw();
            imgRed.setIsVisible(await CoopCustomRoomModelCcrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? LangUtils.getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.CcwFog : WarTypesConstants.WarTypeId.CcwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(settingsForCcw
                ? settingsForCcw.getWarName() || (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const roomStaticInfo    = await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId);
            const settingsForMcw    = roomStaticInfo?.getSettingsForMcw();
            imgRed.setIsVisible(await MultiCustomRoomModelMcrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? LangUtils.getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.McwFog : WarTypesConstants.WarTypeId.McwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(settingsForMcw
                ? settingsForMcw.getWarName() || (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const roomInfo = await MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId);
            imgRed.setIsVisible(await MultiFreeRoomModelMfrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? LangUtils.getWarTypeName(roomInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.MfwFog : WarTypesConstants.WarTypeId.MfwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? roomInfo.getSettingsForMfw()?.getWarName() || `(${LangUtils.getText(LangConstants.TextType.B0557)})`
                : ``
            );

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
            imgRed.setIsVisible(await MultiMatchRoomModelMmrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? LangUtils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.MmwFog : WarTypesConstants.WarTypeId.MmwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoomModelMrrModel.getRoomInfo(roomId);
            imgRed.setIsVisible(await MultiRankRoomModelMrrModel.checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? LangUtils.getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.MrwFog : WarTypesConstants.WarTypeId.MrwStd) ?? LangConstants.UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError)
                : ``
            );
        }

        layoutName.arrangeItems();
    }

    public onItemTapEvent(e: UiTypesUiItemTapEventData.UiItemTapEventData): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedRoomId(e.itemIndex, false);
    }
}
