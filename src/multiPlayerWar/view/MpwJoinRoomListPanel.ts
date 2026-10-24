import type * as AuxiliaryTypesRoomFilter from "../../auxiliaryTypes/RoomFilter.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as CoopCustomRoomModelCcrProxy from "../../coopCustomRoom/model/CcrProxy.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiCustomRoomModelMcrModel from "../../multiCustomRoom/model/McrModel.ts";
import * as MultiCustomRoomModelMcrProxy from "../../multiCustomRoom/model/McrProxy.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiFreeRoomModelMfrProxy from "../../multiFreeRoom/model/MfrProxy.ts";
import * as MultiPlayerRoomsConstants from "../../multiPlayerRooms/Constants.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
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
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    preferredRoomType   : MultiPlayerRoomsConstants.MultiPlayerRoomType;
    filter              : AuxiliaryTypesRoomFilter.RoomFilter | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseRoom!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSearch!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSearch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRoomList!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listRoom!             : UiInterfacesIUiScrollList.IUiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized   = false;
    private _hasReceivedMcrData = false;
    private _hasReceivedCcrData = false;
    private _hasReceivedMfrData = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },

            { type: NotificationsTypeId.TypeId.MsgMcrJoinRoom,                  callback: this._onNotifyMsgMcrJoinRoom },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,         callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomStaticInfo,         callback: this._onNotifyMsgMcrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgMcrGetJoinableRoomIdArray,    callback: this._onNotifyMsgMcrGetJoinableRoomIdArray },

            { type: NotificationsTypeId.TypeId.MsgCcrJoinRoom,                  callback: this._onNotifyMsgCcrJoinRoom },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomStaticInfo,         callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,         callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetJoinableRoomIdArray,    callback: this._onNotifyMsgCcrGetJoinableRoomIdArray },

            { type: NotificationsTypeId.TypeId.MsgMfrJoinRoom,                  callback: this._onNotifyMsgMfrJoinRoom },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomStaticInfo,         callback: this._onNotifyMsgMfrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,         callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetJoinableRoomIdArray,    callback: this._onNotifyMsgMfrGetJoinableRoomIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
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

        this._hasReceivedMcrData = false;
        this._hasReceivedCcrData = false;
        this._hasReceivedMfrData = false;
        MultiCustomRoomModelMcrProxy.reqMcrGetJoinableRoomIdArray();
        CoopCustomRoomModelCcrProxy.reqCcrGetJoinableRoomIdArray();
        MultiFreeRoomModelMfrProxy.reqMfrGetJoinableRoomIdArray();
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
        const index     = HelpersMisc.getExisted(listRoom.getRevisedFirstIndex(v => v?.roomId == newRoomId));
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

    private _onNotifyMsgMcrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrRoomInfoPanel, { roomId });
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgMcrGetJoinableRoomIdArray(): void {
        this._hasReceivedMcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrRoomInfoPanel, { roomId });
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
    }
    private _onNotifyMsgCcrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr, (e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr, (e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgCcrGetJoinableRoomIdArray(): void {
        this._hasReceivedCcrData = true;
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMfrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrRoomInfoPanel, { roomId });
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        this._checkAndUpdateComponentsForTargetRoomInfo(MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr, (e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS.S).getRoomId() ?? 0);
    }
    private _onNotifyMsgMfrGetJoinableRoomIdArray(): void {
        this._hasReceivedMfrData = true;
        this._updateGroupRoomList();
    }

    private _onTouchedBtnBack(): void {
        const roomType = this.getOpenData()?.preferredRoomType;
        this.closePanel();
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrMainMenuPanel, void 0);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MfrMainMenuPanel, void 0);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
        }

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
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId),
                MultiCustomRoomModelMcrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForMcw = roomStaticInfo?.getSettingsForMcw();
            if ((settingsForMcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMcw.getWarPassword();
                if (!password) {
                    MultiCustomRoomModelMcrProxy.reqMcrJoinRoom(roomId);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                        title           : LangUtils.getText(LangConstants.TextType.B0449),
                        currentValue    : ``,
                        tips            : LangUtils.getFormattedText(LangConstants.TextType.F0068, GameConfigGcWar.Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : GameConfigGcWar.Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText2.showLang(LangConstants.TextType.A0017);
                            } else {
                                MultiCustomRoomModelMcrProxy.reqMcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId),
                CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForCcw = roomStaticInfo?.getSettingsForCcw();
            if ((settingsForCcw != null) && (roomPlayerInfo != null)) {
                const password = settingsForCcw.getWarPassword();
                if (!password) {
                    CoopCustomRoomModelCcrProxy.reqCcrJoinRoom(roomId);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                        title           : LangUtils.getText(LangConstants.TextType.B0449),
                        currentValue    : ``,
                        tips            : LangUtils.getFormattedText(LangConstants.TextType.F0068, GameConfigGcWar.Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : GameConfigGcWar.Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText2.showLang(LangConstants.TextType.A0017);
                            } else {
                                CoopCustomRoomModelCcrProxy.reqCcrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId),
                MultiFreeRoomModelMfrModel.getRoomPlayerInfo(roomId),
            ]);
            const settingsForMfw = HelpersMisc.getExisted(roomStaticInfo?.getSettingsForMfw());
            if ((settingsForMfw != null) && (roomPlayerInfo != null)) {
                const password = settingsForMfw.getWarPassword();
                if (!password) {
                    MultiFreeRoomModelMfrProxy.reqMfrJoinRoom(roomId);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                        title           : LangUtils.getText(LangConstants.TextType.B0449),
                        currentValue    : ``,
                        tips            : LangUtils.getFormattedText(LangConstants.TextType.F0068, GameConfigGcWar.Misc.MaxPasswordLength),
                        charRestrict    : `0-9`,
                        maxChars        : GameConfigGcWar.Misc.MaxPasswordLength,
                        isAutoClose     : false,
                        callback        : panel => {
                            if (panel.getInputText() !== password) {
                                FloatText2.showLang(LangConstants.TextType.A0017);
                            } else {
                                MultiFreeRoomModelMfrProxy.reqMfrJoinRoom(roomId);
                                panel.closePanel();
                            }
                        },
                    });
                }
            }

        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedBtnSearch(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonRoomFilterPanel, {
            roomFilter          : openData.filter,
            isMapNameEnabled    : true,
            callbackOnConfirm   : roomFilter => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwJoinRoomListPanel, {
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
        this._labelChooseRoom.setText(LangUtils.getText(LangConstants.TextType.B0580));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._labelNoRoom.setText(LangUtils.getText(LangConstants.TextType.B0582));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B0583));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));

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

    private _checkAndUpdateComponentsForTargetRoomInfo(roomType: MultiPlayerRoomsConstants.MultiPlayerRoomType, roomId: number): void {
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

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomId    = selectedData.roomId;
        const roomType  = selectedData.roomType;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const roomStaticInfo = await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(roomStaticInfo.getSettingsForMcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers   : null,
                    },
                };
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const roomStaticInfo = await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId);
            return roomStaticInfo == null
                ? null
                : {
                    mapInfo : {
                        hasFog              : !!roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                        gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomStaticInfo.getSettingsForCommon()?.getConfigVersion())),
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0)),
                        overridingPlayers   : null,
                    },
                };
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const warData = (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData();
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
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType == MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarPlayerInfoPage(roomId);
        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        const selectedData = this._listRoom.getFirstSelectedData();
        if (selectedData == null) {
            return null;
        }

        const roomType  = selectedData.roomType;
        const roomId    = selectedData.roomId;
        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            return MultiCustomRoomModelMcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            return CoopCustomRoomModelCcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            return MultiFreeRoomModelMfrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private async _createDataForListRoom(): Promise<DataForRoomRenderer[]> {
        const filter = this.getOpenData()?.filter;
        const [mcrRoomIdSet, ccrRoomIdSet, mfrRoomIdSet] = await Promise.all([
            MultiCustomRoomModelMcrModel.getJoinableRoomIdSetWithFilter(filter),
            CoopCustomRoomModelCcrModel.getJoinableRoomIdSetWithFilter(filter),
            MultiFreeRoomModelMfrModel.getJoinableRoomIdSetWithFilter(filter),
        ]);
        const dataArray : DataForRoomRenderer[] = [];
        for (const roomId of [...mcrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr,
                roomId      : roomId,
                panel       : this,
            });
        }
        for (const roomId of [...ccrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr,
                roomId      : roomId,
                panel       : this,
            });
        }
        for (const roomId of [...mfrRoomIdSet].sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr,
                roomId      : roomId,
                panel       : this,
            });
        }

        return dataArray;
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
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
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
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
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
    name    : string;
}
class TabItemRenderer extends UiComponentsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }
}

interface DataForRoomRenderer extends UiTypesUiListItemData.UiListItemData {
    roomType    : MultiPlayerRoomsConstants.MultiPlayerRoomType;
    roomId      : number;
    panel       : Panel;
}
class RoomRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupName!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMode!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            { ui: this._groupName,  callback: this._onTouchedGroupName },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateBtnHelp();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnHelp(e: VendorEgretEgret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { roomId, roomType, panel } = openData;
        panel.setAndReviseSelectedRoomId(roomId, false);

        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await NormalMapModelNormalMapModel.getRawData(settingsForMcw.getNormalMapId() ?? 0);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent : () => LangUtils.getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? LangConstants.UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                const mapRawData = await NormalMapModelNormalMapModel.getRawData(settingsForCcw.getNormalMapId() ?? 0);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent : () => LangUtils.getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? LangConstants.UndefinedError,
                });
            }
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            // nothing to do
        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
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
        this._labelMode.setText(LangUtils.getRoomTypeName(roomType) ?? LangConstants.UndefinedError);
        layoutName.arrangeItems();

        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId() ?? 0);
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? LangConstants.UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForCcw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);

                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const mapName = await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId() ?? 0);
                    if ((roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                        labelName.setText(mapName ?? LangConstants.UndefinedError);
                    }
                }
            }

        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                labelName.setTextColor(settingsForMfw.getWarPassword() ? 0xFFFF00 : 0xFFFFFF);
                labelName.setText(settingsForMfw.getWarName()?.trim() || `(${LangUtils.getText(LangConstants.TextType.B0277)})`);
            }

        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
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

        if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr) {
            const settingsForMcw = (await MultiCustomRoomModelMcrModel.getRoomStaticInfo(roomId))?.getSettingsForMcw();
            if ((settingsForMcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await NormalMapModelNormalMapModel.getBriefData(settingsForMcw.getNormalMapId() ?? 0))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr) {
            const settingsForCcw = (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId))?.getSettingsForCcw();
            if ((settingsForCcw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(!!(await NormalMapModelNormalMapModel.getBriefData(settingsForCcw.getNormalMapId() ?? 0))?.getHasDescription());
            }
        } else if (roomType === MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr) {
            const settingsForMfw = (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw();
            if ((settingsForMfw) && (roomId === this.getOpenData()?.roomId) && (roomType === this.getOpenData()?.roomType)) {
                this._btnHelp.setIsVisible(false);
            }
        } else {
            throw HelpersMisc.newError(`Unknown roomType: ${roomType}`);
        }
    }

    private _onTouchedGroupName(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const data = this.getOpenData();
        data?.panel.setAndReviseSelectedRoomId(data.roomId, false);
    }
}
