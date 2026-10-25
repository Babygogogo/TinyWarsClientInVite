import { reqAtrGetJoinedRoomIdArray } from "../../autoTourneys/rooms/Gateway.ts";
import {
    getRoomInfo,
    getSelfSettings,
    getJoinedRoomIdArray,
    createDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom,
} from "../../autoTourneys/rooms/Provider.ts";
import { type OpenData as CommonViewCommonWarAdvancedSettingsPageOpenData, Page } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarBasicSettingsPageOpenData,
    Page as CommonViewCommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarMapInfoPageOpenData,
    Page as CommonViewCommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import {
    type OpenData as CommonViewCommonWarPlayerInfoPageOpenData,
    Page as CommonViewCommonWarPlayerInfoPage,
} from "../../common/view/CommonWarPlayerInfoPage.ts";
import {
    getJoinedRoomIdSetWithFilter,
    getRoomStaticInfo,
    createDataForCommonWarPlayerInfoPage as CoopCustomRoomModelCcrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as CoopCustomRoomModelCcrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as CoopCustomRoomModelCcrModelCreateDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom as CoopCustomRoomModelCcrModelCheckIsRedForRoom,
} from "../../coopCustomRoom/model/CcrModel.ts";
import { reqCcrGetJoinedRoomIdArray } from "../../coopCustomRoom/model/CcrProxy.ts";
import { showLang } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getWarTypeName } from "../../lang/Utils.ts";
import {
    getJoinedRoomIdSetWithFilter as MultiCustomRoomModelMcrModelGetJoinedRoomIdSetWithFilter,
    getRoomStaticInfo as MultiCustomRoomModelMcrModelGetRoomStaticInfo,
    createDataForCommonWarPlayerInfoPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom as MultiCustomRoomModelMcrModelCheckIsRedForRoom,
} from "../../multiCustomRoom/model/McrModel.ts";
import { reqMcrGetJoinedRoomIdArray } from "../../multiCustomRoom/model/McrProxy.ts";
import {
    getJoinedRoomIdSetWithFilter as MultiFreeRoomModelMfrModelGetJoinedRoomIdSetWithFilter,
    getRoomStaticInfo as MultiFreeRoomModelMfrModelGetRoomStaticInfo,
    createDataForCommonWarPlayerInfoPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom as MultiFreeRoomModelMfrModelCheckIsRedForRoom,
} from "../../multiFreeRoom/model/MfrModel.ts";
import { reqMfrGetJoinedRoomIdArray } from "../../multiFreeRoom/model/MfrProxy.ts";
import {
    getRoomInfo as MultiMatchRoomModelMmrModelGetRoomInfo,
    getSelfSettings as MultiMatchRoomModelMmrModelGetSelfSettings,
    getJoinedRoomIdArray as MultiMatchRoomModelMmrModelGetJoinedRoomIdArray,
    createDataForCommonWarPlayerInfoPage as MultiMatchRoomModelMmrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiMatchRoomModelMmrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiMatchRoomModelMmrModelCreateDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom as MultiMatchRoomModelMmrModelCheckIsRedForRoom,
} from "../../multiMatchRoom/model/MmrModel.ts";
import { reqMmrGetJoinedRoomIdArray } from "../../multiMatchRoom/model/MmrProxy.ts";
import { MultiPlayerRoomType } from "../../multiPlayerRooms/Constants.ts";
import {
    getRoomInfo as MultiRankRoomModelMrrModelGetRoomInfo,
    getSelfSettings as MultiRankRoomModelMrrModelGetSelfSettings,
    getJoinedRoomIdArray as MultiRankRoomModelMrrModelGetJoinedRoomIdArray,
    createDataForCommonWarPlayerInfoPage as MultiRankRoomModelMrrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiRankRoomModelMrrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiRankRoomModelMrrModelCreateDataForCommonWarAdvancedSettingsPage,
    checkIsRedForRoom as MultiRankRoomModelMrrModelCheckIsRedForRoom,
} from "../../multiRankRoom/model/MrrModel.ts";
import { reqMrrGetJoinedRoomIdArray } from "../../multiRankRoom/model/MrrProxy.ts";
import { getRawData, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiItemTapEventData } from "../../ui/types/UiItemTapEventData.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPageOpenData | CommonViewCommonWarPlayerInfoPageOpenData | CommonViewCommonWarAdvancedSettingsPageOpenData | CommonViewCommonWarBasicSettingsPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelMultiPlayer!     : IUiLabel;
    private readonly _labelMyRoom!          : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupRoomList!        : IUiContainer;
    private readonly _listRoom!             : IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _isTabInitialized       = false;
    private _hasReceivedAtrData     = false;
    private _hasReceivedCcrData     = false;
    private _hasReceivedMcrData     = false;
    private _hasReceivedMfrData     = false;
    private _hasReceivedMmrData     = false;
    private _hasReceivedMrrData     = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },

            { type: TypeId.MsgAtrGetJoinedRoomIdArray,          callback: this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type: TypeId.MsgAtrDeleteRoomByServer,            callback: this._onNotifyMsgAtrDeleteRoomByServer },
            { type: TypeId.MsgAtrGetRoomPublicInfo,             callback: this._onNotifyMsgAtrGetRoomPublicInfo },
            { type: TypeId.MsgAtrSetSelfSettings,               callback: this._onNotifyMsgAtrSetSelfSettings },
            { type: TypeId.MsgAtrSetBannedCoIdArray,            callback: this._onNotifyMsgAtrSetBannedCoIdArray },

            { type: TypeId.MsgCcrGetRoomStaticInfo,             callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgCcrGetJoinedRoomIdArray },

            { type: TypeId.MsgMcrGetRoomStaticInfo,             callback: this._onNotifyMsgMcrGetRoomStaticInfo },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMcrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMcrGetJoinedRoomIdArray },

            { type: TypeId.MsgMfrGetRoomStaticInfo,             callback: this._onNotifyMsgMfrGetRoomStaticInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMfrGetJoinedRoomIdArray },

            { type: TypeId.MsgMmrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMmrGetJoinedRoomIdArray },
            { type: TypeId.MsgMmrDeleteRoomByServer,            callback: this._onNotifyMsgMmrDeleteRoomByServer },
            { type: TypeId.MsgMmrGetRoomPublicInfo,             callback: this._onNotifyMsgMmrGetRoomPublicInfo },
            { type: TypeId.MsgMmrSetSelfSettings,               callback: this._onNotifyMsgMmrSetSelfSettings },
            { type: TypeId.MsgMmrSetBannedCoIdArray,            callback: this._onNotifyMsgMmrSetBannedCoIdArray },

            { type: TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onNotifyMsgMrrGetJoinedRoomIdArray },
            { type: TypeId.MsgMrrDeleteRoomByServer,            callback: this._onNotifyMsgMrrDeleteRoomByServer },
            { type: TypeId.MsgMrrGetRoomPublicInfo,             callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: TypeId.MsgMrrSetSelfSettings,               callback: this._onNotifyMsgMrrSetSelfSettings },
            { type: TypeId.MsgMrrSetBannedCoIdArray,            callback: this._onNotifyMsgMrrSetBannedCoIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        reqAtrGetJoinedRoomIdArray();
        reqCcrGetJoinedRoomIdArray();
        reqMcrGetJoinedRoomIdArray();
        reqMfrGetJoinedRoomIdArray();
        reqMmrGetJoinedRoomIdArray();
        reqMrrGetJoinedRoomIdArray();
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
    private _onNotifyMsgAtrGetRoomPublicInfo(e: Event): void {
        const data          = e.data as S;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Atr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgAtrSetSelfSettings(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgAtrSetBannedCoIdArray(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Atr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgCcrGetRoomStaticInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Ccr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Ccr)
        ) {
            const selfUserId = getSelfUserId();
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

    private _onNotifyMsgMcrGetRoomStaticInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mcr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mcr)
        ) {
            const selfUserId = getSelfUserId();
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

    private _onNotifyMsgMfrGetRoomStaticInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mfr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mfr)
        ) {
            const selfUserId = getSelfUserId();
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
    private _onNotifyMsgMmrGetRoomPublicInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mmr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMmrSetSelfSettings(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mmr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMmrSetBannedCoIdArray(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mmr)
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
    private _onNotifyMsgMrrGetRoomPublicInfo(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mrr)
        ) {
            this._updateComponentsForPreviewingRoomInfo();
        }
    }
    private _onNotifyMsgMrrSetSelfSettings(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }
    private _onNotifyMsgMrrSetBannedCoIdArray(e: Event): void {
        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS;
        const selectedData  = this._listRoom.getFirstSelectedData();
        if ((selectedData != null)                      &&
            (data.getRoomId() === selectedData.roomId)  &&
            (selectedData.roomType === MultiPlayerRoomType.Mrr)
        ) {
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().McrMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        this.closePanel();

        if (roomType === MultiPlayerRoomType.Atr) {
            const roomInfo = await getRoomInfo(roomId);
            if (roomInfo == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                (await getSelfSettings(roomId))?.resetData(roomInfo);
                openPanel(getDict().AtrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRoomType.Ccr) {
            openPanel(getDict().CcrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomType.Mcr) {
            openPanel(getDict().McrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomType.Mfr) {
            openPanel(getDict().MfrRoomInfoPanel, {
                roomId  : roomId,
            });

        } else if (roomType === MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoomModelMmrModelGetRoomInfo(roomId);
            if (roomInfo == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiMatchRoomModelMmrModelGetSelfSettings(roomId))?.resetData(roomInfo);
                openPanel(getDict().MmrRoomInfoPanel, {
                    roomId  : roomId,
                });
            }

        } else if (roomType === MultiPlayerRoomType.Mrr) {
            const roomInfo = await MultiRankRoomModelMrrModelGetRoomInfo(roomId);
            if (roomInfo == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                (await MultiRankRoomModelMrrModelGetSelfSettings(roomId))?.resetData(roomInfo);
                openPanel(getDict().MrrRoomInfoPanel, {
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
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0003) },
                pageClass   : Page,
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
        this._labelLoading.setText(getText(TextType.A0040));
        this._labelMultiPlayer.setText(getText(TextType.B0137));
        this._labelMyRoom.setText(getText(TextType.B0410));
        this._btnBack.setText(getText(TextType.B0146));
        this._labelNoRoom.setText(getText(TextType.B0582));
        this._btnNextStep.setText(getText(TextType.B1383));

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
        dataArray.push(...((await getJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Atr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiRankRoomModelMrrModelGetJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Mrr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...((await MultiMatchRoomModelMmrModelGetJoinedRoomIdArray())?.map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Mmr,
        }) as DataForRoomRenderer)?.sort((v1, v2) => v1.roomId - v2.roomId) ?? []));
        dataArray.push(...[...await MultiCustomRoomModelMcrModelGetJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Mcr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await getJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Ccr,
        }) as DataForRoomRenderer).sort((v1, v2) => v1.roomId - v2.roomId));
        dataArray.push(...[...await MultiFreeRoomModelMfrModelGetJoinedRoomIdSetWithFilter(null)].map(roomId => ({
            roomId      : roomId,
            panel       : this,
            roomType    : MultiPlayerRoomType.Mfr,
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

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomType.Atr) {
            const roomInfo      = await getRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await getRoomStaticInfo(roomId);
            const normalMapId       = roomStaticInfo ? (roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomStaticInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomType.Mcr) {
            const roomInfo      = await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const warData   = roomId == null
                ? null
                : (await MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();

            return warData == null
                ? null
                : {
                    warInfo : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomType.Mmr) {
            const roomInfo      = await MultiMatchRoomModelMmrModelGetRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else if (roomType === MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoomModelMrrModelGetRoomInfo(roomId);
            const normalMapId   = roomInfo ? (roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) : null;
            return normalMapId == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        overridingPlayers   : null,
                    },
                };

        } else {
            return null;
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomType.Atr) {
            return createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomType.Atr) {
            return createDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModelCreateDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarBasicSettingsPage(roomId, true);
        } else if (roomType === MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModelCreateDataForCommonWarBasicSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModelCreateDataForCommonWarBasicSettingsPage(roomId);
        } else {
            return null;
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomType.Atr) {
            return createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mmr) {
            return MultiMatchRoomModelMmrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mrr) {
            return MultiRankRoomModelMrrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            return null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupRoomList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
        });

        await wait();
    }
}

interface DataForTabItemRenderer extends UiListItemData {
    name: string;
}
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }
}

interface DataForRoomRenderer extends UiListItemData {
    roomId      : number;
    roomType    : number;
    panel       : Panel;
}
class RoomRenderer
    extends     UiListItemRenderer<DataForRoomRenderer>
    implements  IUiListItemRenderer<DataForRoomRenderer>
{
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelRoomId!  : IUiLabel;
    private readonly _labelWarType! : IUiLabel;
    private readonly _labelName!    : IUiLabel;
    private readonly _imgRed!       : IUiLabel;

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
        if (roomType === MultiPlayerRoomType.Atr) {
            const roomInfo      = await getRoomInfo(roomId);
            imgRed.setIsVisible(await checkIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.AtwFog : WarTypeId.AtwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await getMapNameInCurrentLanguage(roomInfo.getSettingsForAtw()?.getNormalMapId() ?? 0) ?? UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const roomStaticInfo    = await getRoomStaticInfo(roomId);
            const settingsForCcw    = roomStaticInfo?.getSettingsForCcw();
            imgRed.setIsVisible(await CoopCustomRoomModelCcrModelCheckIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.CcwFog : WarTypeId.CcwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(settingsForCcw
                ? settingsForCcw.getWarName() || (await getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId() ?? 0) ?? UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomType.Mcr) {
            const roomStaticInfo    = await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId);
            const settingsForMcw    = roomStaticInfo?.getSettingsForMcw();
            imgRed.setIsVisible(await MultiCustomRoomModelMcrModelCheckIsRedForRoom(roomId));
            labelWarType.setText(roomStaticInfo
                ? getWarTypeName(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.McwFog : WarTypeId.McwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(settingsForMcw
                ? settingsForMcw.getWarName() || (await getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId() ?? 0) ?? UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const roomInfo = await MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId);
            imgRed.setIsVisible(await MultiFreeRoomModelMfrModelCheckIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? getWarTypeName(roomInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.MfwFog : WarTypeId.MfwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? roomInfo.getSettingsForMfw()?.getWarName() || `(${getText(TextType.B0557)})`
                : ``
            );

        } else if (roomType === MultiPlayerRoomType.Mmr) {
            const roomInfo = await MultiMatchRoomModelMmrModelGetRoomInfo(roomId);
            imgRed.setIsVisible(await MultiMatchRoomModelMmrModelCheckIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.MmwFog : WarTypeId.MmwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await getMapNameInCurrentLanguage(roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) ?? UndefinedError)
                : ``
            );

        } else if (roomType === MultiPlayerRoomType.Mrr) {
            const roomInfo      = await MultiRankRoomModelMrrModelGetRoomInfo(roomId);
            imgRed.setIsVisible(await MultiRankRoomModelMrrModelCheckIsRedForRoom(roomId));
            labelWarType.setText(roomInfo
                ? getWarTypeName(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.MrwFog : WarTypeId.MrwStd) ?? UndefinedError
                : ``
            );
            labelName.setText(roomInfo
                ? (await getMapNameInCurrentLanguage(roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) ?? UndefinedError)
                : ``
            );
        }

        layoutName.arrangeItems();
    }

    public onItemTapEvent(e: UiItemTapEventData): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedRoomId(e.itemIndex, false);
    }
}
