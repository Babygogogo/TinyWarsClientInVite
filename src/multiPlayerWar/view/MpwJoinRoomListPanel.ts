import type { RoomFilter } from "../../auxiliaryTypes/RoomFilter.ts";
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
    getRoomStaticInfo,
    getRoomPlayerInfo,
    createDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage,
    getJoinableRoomIdSetWithFilter,
} from "../../coopCustomRoom/model/CcrModel.ts";
import { reqCcrGetJoinableRoomIdArray, reqCcrJoinRoom } from "../../coopCustomRoom/model/CcrProxy.ts";
import { show, showLang } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getLanguageText, getRoomTypeName } from "../../lang/Utils.ts";
import {
    getRoomStaticInfo as MultiCustomRoomModelMcrModelGetRoomStaticInfo,
    getRoomPlayerInfo as MultiCustomRoomModelMcrModelGetRoomPlayerInfo,
    createDataForCommonWarPlayerInfoPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiCustomRoomModelMcrModelCreateDataForCommonWarAdvancedSettingsPage,
    getJoinableRoomIdSetWithFilter as MultiCustomRoomModelMcrModelGetJoinableRoomIdSetWithFilter,
} from "../../multiCustomRoom/model/McrModel.ts";
import { reqMcrGetJoinableRoomIdArray, reqMcrJoinRoom } from "../../multiCustomRoom/model/McrProxy.ts";
import {
    getRoomStaticInfo as MultiFreeRoomModelMfrModelGetRoomStaticInfo,
    getRoomPlayerInfo as MultiFreeRoomModelMfrModelGetRoomPlayerInfo,
    createDataForCommonWarPlayerInfoPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage as MultiFreeRoomModelMfrModelCreateDataForCommonWarAdvancedSettingsPage,
    getJoinableRoomIdSetWithFilter as MultiFreeRoomModelMfrModelGetJoinableRoomIdSetWithFilter,
} from "../../multiFreeRoom/model/MfrModel.ts";
import { reqMfrGetJoinableRoomIdArray, reqMfrJoinRoom } from "../../multiFreeRoom/model/MfrProxy.ts";
import { MultiPlayerRoomType } from "../../multiPlayerRooms/Constants.ts";
import { getRawData, getMapNameInCurrentLanguage, getBriefData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
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
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import {Misc} from "../../wars/Constants.ts";

export interface OpenData {
    preferredRoomType   : MultiPlayerRoomType;
    filter              : RoomFilter | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPageOpenData | CommonViewCommonWarPlayerInfoPageOpenData | CommonViewCommonWarAdvancedSettingsPageOpenData | CommonViewCommonWarBasicSettingsPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelMultiPlayer!     : IUiLabel;
    private readonly _labelChooseRoom!      : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupSearch!          : IUiContainer;
    private readonly _btnSearch!            : IUiButton;

    private readonly _groupRoomList!        : IUiContainer;
    private readonly _listRoom!             : IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _isTabInitialized   = false;
    private _hasReceivedMcrData = false;
    private _hasReceivedCcrData = false;
    private _hasReceivedMfrData = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },

            { type: TypeId.MsgMcrJoinRoom,                  callback: this._onNotifyMsgMcrJoinRoom },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,         callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMcrGetRoomStaticInfo,         callback: this._onNotifyMsgMcrGetRoomStaticInfo },
            { type: TypeId.MsgMcrGetJoinableRoomIdArray,    callback: this._onNotifyMsgMcrGetJoinableRoomIdArray },

            { type: TypeId.MsgCcrJoinRoom,                  callback: this._onNotifyMsgCcrJoinRoom },
            { type: TypeId.MsgCcrGetRoomStaticInfo,         callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,         callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetJoinableRoomIdArray,    callback: this._onNotifyMsgCcrGetJoinableRoomIdArray },

            { type: TypeId.MsgMfrJoinRoom,                  callback: this._onNotifyMsgMfrJoinRoom },
            { type: TypeId.MsgMfrGetRoomStaticInfo,         callback: this._onNotifyMsgMfrGetRoomStaticInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,         callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetJoinableRoomIdArray,    callback: this._onNotifyMsgMfrGetJoinableRoomIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
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

        this._hasReceivedMcrData = false;
        this._hasReceivedCcrData = false;
        this._hasReceivedMfrData = false;
        reqMcrGetJoinableRoomIdArray();
        reqCcrGetJoinableRoomIdArray();
        reqMfrGetJoinableRoomIdArray();
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

    private _onNotifyMsgMcrJoinRoom(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS;
        const roomId    = getExisted(data.getRoomId());
        this.closePanel();
        openPanel(getDict().McrRoomInfoPanel, { roomId });
        show(getFormattedText(TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrGetRoomStaticInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Mcr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Mcr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetJoinableRoomIdArray(): void {
        this._hasReceivedMcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrJoinRoom(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS;
        const roomId    = getExisted(data.getRoomId());
        this.closePanel();
        openPanel(getDict().CcrRoomInfoPanel, { roomId });
        show(getFormattedText(TextType.F0069, roomId));
    }
    private _onNotifyMsgCcrGetRoomStaticInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Ccr, (e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Ccr, (e.data as S).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetJoinableRoomIdArray(): void {
        this._hasReceivedCcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMfrJoinRoom(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS;
        const roomId    = getExisted(data.getRoomId());
        this.closePanel();
        openPanel(getDict().MfrRoomInfoPanel, { roomId });
        show(getFormattedText(TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrGetRoomStaticInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Mfr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomType.Mfr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetJoinableRoomIdArray(): void {
        this._hasReceivedMfrData = true;
        this._updateGroupRoomList();
    }

    private _onTouchedBtnBack(): void {
        const roomType = this.getOpenData()?.preferredRoomType;
        this.closePanel();
        if (roomType === MultiPlayerRoomType.Ccr) {
            openPanel(getDict().CcrMainMenuPanel, void 0);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            openPanel(getDict().MfrMainMenuPanel, void 0);
        } else {
            openPanel(getDict().McrMainMenuPanel, void 0);
        }

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
        if (roomType === MultiPlayerRoomType.Mcr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId),
                MultiCustomRoomModelMcrModelGetRoomPlayerInfo(roomId),
            ]);
            const settingsForMcw = roomStaticInfo?.getSettingsForMcw();
            if ((settingsForMcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMcw.getWarPassword();
                if (!password) {
                    reqMcrJoinRoom(roomId);
                } else {
                    openPanel(getDict().CommonInputPanel, {
                        title           : getText(TextType.B0449),
                        currentValue    : ``,
                        tips            : getFormattedText(TextType.F0068, Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                showLang(TextType.A0017);
                            } else {
                                reqMcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                getRoomStaticInfo(roomId),
                getRoomPlayerInfo(roomId),
            ]);
            const settingsForCcw = roomStaticInfo?.getSettingsForCcw();
            if ((settingsForCcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForCcw.getWarPassword();
                if (!password) {
                    reqCcrJoinRoom(roomId);
                } else {
                    openPanel(getDict().CommonInputPanel, {
                        title           : getText(TextType.B0449),
                        currentValue    : ``,
                        tips            : getFormattedText(TextType.F0068, Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                showLang(TextType.A0017);
                            } else {
                                reqCcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId),
                MultiFreeRoomModelMfrModelGetRoomPlayerInfo(roomId),
            ]);
            const settingsForMfw = getExisted(roomStaticInfo?.getSettingsForMfw());
            if ((settingsForMfw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMfw.getWarPassword();
                if (!password) {
                    reqMfrJoinRoom(roomId);
                } else {
                    openPanel(getDict().CommonInputPanel, {
                        title           : getText(TextType.B0449),
                        currentValue    : ``,
                        tips            : getFormattedText(TextType.F0068, Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                showLang(TextType.A0017);
                            } else {
                                reqMfrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedBtnSearch(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonRoomFilterPanel, {
            roomFilter          : openData.filter,
            isMapNameEnabled    : true,
            callbackOnConfirm   : roomFilter => {
                openPanel(getDict().MpwJoinRoomListPanel, {
                    preferredRoomType   : openData.preferredRoomType,
                    filter              : roomFilter,
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
        this._labelLoading.setLangText(TextType.A0040);
        this._labelMultiPlayer.setLangText(TextType.B0137);
        this._labelChooseRoom.setLangText(TextType.B0580);
        this._btnBack.setLangText(TextType.B0146);
        this._labelNoRoom.setLangText(TextType.B0582);
        this._btnNextStep.setLangText(TextType.B0583);
        this._btnSearch.setLangText(TextType.B0228);

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

    private _checkAndUpdateComponentsForTargetRoomInfo(roomType: MultiPlayerRoomType, roomId: number): void {
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

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomType.Mcr) {
            const roomStaticInfo = await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(roomStaticInfo.getSettingsForMcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers   : null,
                    },
                };
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const roomStaticInfo = await getRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await getGameConfig(getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : getExisted(await getRawData(roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers   : null,
                    },
                };
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const warData = (await MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();
            return warData == null
                ? null
                : {
                    warInfo     : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };

        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType == MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarPlayerInfoPage(roomId);
        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return createDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarBasicSettingsPage(roomId, false);
        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPageOpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            return createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModelCreateDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForListRoom(): Promise<DataForRoomRenderer[]> {
        const filter = this.getOpenData()?.filter;
        const [mcrRoomIdSet, ccrRoomIdSet, mfrRoomIdSet] = await Promise.all([
            MultiCustomRoomModelMcrModelGetJoinableRoomIdSetWithFilter(filter),
            getJoinableRoomIdSetWithFilter(filter),
            MultiFreeRoomModelMfrModelGetJoinableRoomIdSetWithFilter(filter),
        ]);
        const dataArray : DataForRoomRenderer[] = [];
        for (const roomId of [...mcrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomType.Mcr,
                roomId      : roomId,
                panel       : this,
            });
        }
        for (const roomId of [...ccrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomType.Ccr,
                roomId      : roomId,
                panel       : this,
            });
        }
        for (const roomId of [...mfrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomType.Mfr,
                roomId      : roomId,
                panel       : this,
            });
        }

        return dataArray;
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
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
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
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
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
    name    : string;
}
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }
}

interface DataForRoomRenderer extends UiListItemData {
    roomType    : MultiPlayerRoomType;
    roomId      : number;
    panel       : Panel;
}
class RoomRenderer extends UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnHelp!      : IUiButton;

    private readonly _groupName!    : IUiContainer;
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;
    private readonly _labelMode!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            { ui: this._groupName,  callback: this._onTouchedGroupName },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateBtnHelp();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnHelp(e: Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { roomId, roomType, panel } = openData;
        panel.setAndReviseSelectedRoomId(roomId, false);

        if (roomType === MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await getRawData(settingsForMcw.getNormalMapId());
                openPanel(getDict().CommonHelpPanel, {
                    getContent : () => getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await getRawData(settingsForCcw.getNormalMapId());
                openPanel(getDict().CommonHelpPanel, {
                    getContent : () => getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            // nothing to do
        } else {
            throw newError(`Unknown roomType: ${roomType}`);
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
        this._labelMode.setText(getRoomTypeName(roomType) ?? UndefinedError);
        layoutName.arrangeItems();

        if (roomType === MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId());
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForCcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId());
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMfw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);
                labelName.setText(settingsForMfw.getWarName()?.trim() || `(${getText(TextType.B0277)})`);
            }

        } else {
            throw newError(`Unknown roomType: ${roomType}`);
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

        if (roomType === MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModelGetRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await getBriefData(settingsForMcw.getNormalMapId()))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await getBriefData(settingsForCcw.getNormalMapId()))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoomModelMfrModelGetRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(false);
            }
        } else {
            throw newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedGroupName(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const data = this.getOpenData();
        data?.panel.setAndReviseSelectedRoomId(data.roomId, false);
    }
}
