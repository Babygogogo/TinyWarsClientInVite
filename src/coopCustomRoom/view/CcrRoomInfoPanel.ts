import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as CoopCustomRoomModelCcrModel from "../model/CcrModel.ts";
import * as CoopCustomRoomModelCcrProxy from "../model/CcrProxy.ts";
import * as CosUtils from "../../cos/Utils.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerRoomsConstants from "../../multiPlayerRooms/Constants.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrExitRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/C.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!              : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData>;

    private readonly _groupNavigator!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRoom!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRoomInfo!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSettings!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupChooseCo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseCo!              : UiInterfacesIUiButton.IUiButton;
    private readonly _imgCo!                    : UiInterfacesIUiImage.IUiImage;

    private readonly _groupChoosePlayerIndex!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChoosePlayerIndex!     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupChooseSkinId!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseSkinId!          : UiInterfacesIUiButton.IUiButton;
    private readonly _imgSkinId!                : UiInterfacesIUiImage.IUiImage;

    private readonly _groupChooseReady!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseReady!           : UiInterfacesIUiButton.IUiButton;
    private readonly _imgReady!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupTopRightButtons!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnInvite!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChat!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupButton!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnStartGame!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteRoom!            : UiInterfacesIUiButton.IUiButton;

    private readonly _btnBack!                  : UiInterfacesIUiButton.IUiButton;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
            { ui: this._btnChooseReady,         callback: this._onTouchedBtnChooseReady },
            { ui: this._btnStartGame,           callback: this._onTouchedBtnStartGame },
            { ui: this._btnDeleteRoom,          callback: this._onTouchedBtnDeleteRoom },
            { ui: this._btnChat,                callback: this._onTouchedBtnChat },
            { ui: this._btnInvite,              callback: this._onTouchedBtnInvite },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomStaticInfo,     callback: this._onNotifyMsgCcrGetRoomStaticInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,     callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrExitRoom,              callback: this._onNotifyMsgCcrExitRoom },
            { type: NotificationsTypeId.TypeId.MsgCcrInvite,                callback: this._onNotifyMsgCcrInvite },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateImgCo();
        this._updateLabelPlayerIndex();
        this._updateImgSkinId();
        this._updateGroupChooseReady();
        this._updateGroupButton();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.clear();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnChooseCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId),
            CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData != null) {
            if (selfPlayerData.getIsReady()) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0128));
            } else {
                const playerIndex       = HelpersMisc.getExisted(selfPlayerData.getPlayerIndex());
                const currentCoId       = selfPlayerData.getCoId() ?? 0;
                const settingsForCommon = HelpersMisc.getExisted(roomStaticInfo.getSettingsForCommon());
                const gameConfig        = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));
                const warRuleCommonData = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig          : gameConfig,
                    currentCoId         : currentCoId,
                    availableCoIdArray  : [...PlayerRulesUtils.getFinalCcwHumanCoIdSet({
                        playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                        gameConfig      : gameConfig,
                        hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                        includeRandom   : true,
                    })],
                    isBan               : false,
                    callbackOnConfirm   : newCoId => {
                        if (newCoId !== currentCoId) {
                            CoopCustomRoomModelCcrProxy.reqCcrSetSelfSettings(ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC.C.fromJson({
                                roomId              : roomId,
                                playerIndex         : playerIndex,
                                coId                : newCoId,
                                unitAndTileSkinId   : selfPlayerData.getUnitAndTileSkinId(),
                            }));
                        }
                    },
                });
            }
        }
    }

    private async _onTouchedBtnChoosePlayerIndex(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId),
            CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return;
        }

        const settingsForCommon = roomStaticInfo.getSettingsForCommon();
        const warRule           = settingsForCommon?.getInstanceWarRule();
        if (warRule == null) {
            return;
        }

        const gameConfig = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon?.getConfigVersion()));
        if (gameConfig == null) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }

        if (selfPlayerData.getIsReady()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0128));
            return;
        }

        const selfPlayerIndex   = selfPlayerData.getPlayerIndex() ?? 0;
        const warRuleCommonData = HelpersMisc.getExisted(warRule.getWarRuleCommonData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : selfPlayerIndex,
            availableNumberArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData) + 1, 1)
                .filter(playerIndex => (playerIndex === selfPlayerIndex) || (!playerDataList.some(v => v.getPlayerIndex() === playerIndex))),
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${LangUtils.getPlayerTeamName(WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? LangConstants.UndefinedError}`,
            callbackOnConfirm       : newPlayerIndex => {
                if (newPlayerIndex !== selfPlayerIndex) {
                    const currCoId              = selfPlayerData.getCoId() ?? 0;
                    const availableCoIdArray    = [...PlayerRulesUtils.getFinalCcwHumanCoIdSet({
                        playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, newPlayerIndex),
                        gameConfig      : gameConfig,
                        hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                        includeRandom   : true,
                    })];
                    CoopCustomRoomModelCcrProxy.reqCcrSetSelfSettings(ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC.C.fromJson({
                        roomId              : roomId,
                        playerIndex         : newPlayerIndex,
                        unitAndTileSkinId   : selfPlayerData.getUnitAndTileSkinId(),
                        coId                : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : CosUtils.pickRandomCo(availableCoIdArray),
                    }));
                }
            },
        });
    }

    private async _onTouchedBtnChooseSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomPlayerInfo = await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId);
        if (roomPlayerInfo == null) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0128));
            return;
        }

        const usedSkinIdArray       = HelpersCollection.getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()) ?? []);
        const availableSkinIdArray  = ForceSkinsUtils.getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : selfSkinId ?? availableSkinIdArray[0],
            availableSkinIdArray    : availableSkinIdArray,
            callback                : newSkinId => {
                if (newSkinId !== selfSkinId) {
                    CoopCustomRoomModelCcrProxy.reqCcrSetSelfSettings(ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC.C.fromJson({
                        roomId              : roomId,
                        playerIndex         : selfPlayerData.getPlayerIndex(),
                        unitAndTileSkinId   : newSkinId,
                        coId                : selfPlayerData.getCoId() ?? 0,
                    }));
                }
            },
        });
    }

    private async _onTouchedBtnChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = (await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList()?.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData) {
            CoopCustomRoomModelCcrProxy.reqCcrSetReady(roomId, !selfPlayerData.getIsReady());
        }
    }

    private _onTouchedBtnStartGame(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            CoopCustomRoomModelCcrProxy.reqCcrStartWar(roomId);
        }
    }

    private _onTouchedBtnDeleteRoom(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0149),
                callback: () => {
                    CoopCustomRoomModelCcrProxy.reqCcrDeleteRoom(roomId);
                },
            });
        }
    }

    private _onTouchedBtnChat(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({
            toCcrRoomId: this.getOpenData()?.roomId,
        }) });
    }

    private async _onTouchedBtnInvite(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const playersCountUnneutral = (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getPlayerRuleList().length;
        if (playersCountUnneutral == null) {
            return;
        }

        const joinedPlayersCount = (await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().length;
        if (joinedPlayersCount == null) {
            return;
        }

        if (joinedPlayersCount >= playersCountUnneutral) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0145));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchMultiUserPanel, {
            maxChooseCount      : GameConfigGcWar.CoopCustomWar.MaxInviteCount,
            minChooseCount      : 1,
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B1003),
            callbackOnConfirm   : userIdArray => {
                CoopCustomRoomModelCcrProxy.reqCcrInvite(roomId, userIdArray);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS.S;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        if (!data.getRoomPlayerInfo()?.getPlayerDataList()?.some(v => v.getUserId() === selfUserId)) {
            this.closePanel();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateGroupButton();
            this._updateImgCo();
            this._updateLabelPlayerIndex();
            this._updateImgSkinId();
            this._updateGroupChooseReady();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgCcrGetRoomStaticInfo(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS.S;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        if (data.getRoomStaticInfo() == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0019));
            this.closePanel();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateCommonWarMapInfoPage();
            this._updateCommonWarBasicSettingsPage();
            this._updateCommonWarAdvancedSettingsPage();
        }
    }

    private async _onNotifyMsgCcrExitRoom(e: VendorEgretEgret.Event): Promise<void> {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS.S;
        const roomId    = data.getRoomId();
        if (roomId === this.getOpenData()?.roomId) {
            const exitRoomType = data.getExitType();
            if (exitRoomType === MultiPlayerRoomsConstants.ExitRoomType.DeletedByRoomOwner) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0127));
            } else if (exitRoomType === MultiPlayerRoomsConstants.ExitRoomType.SelfExit) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0016));
            }

            this.closePanel();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
        }
    }

    private _onNotifyMsgCcrInvite(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0378));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateLabelPlayerIndex(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId),
            CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId),
        ]);
        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        const label             = this._labelPlayerIndex;
        if (selfPlayerData == null) {
            label.setText(``);
            return;
        }

        const warRuleCommonData = roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData();
        if (warRuleCommonData == null) {
            label.setText(``);
            return;
        }

        const playerIndex   = selfPlayerData.getPlayerIndex() ?? 0;
        const teamIndex     = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        label.setText(`P${playerIndex}${`\n`}${LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = UsersModel.getSelfUserId();
        const skinId        = (await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : HelpersImageSource.getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = UsersModel.getSelfUserId();
        const isReady       = (await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelMultiPlayer.setLangText(LangConstants.TextType.B0646);
        this._labelMyRoom.setLangText(LangConstants.TextType.B0410);
        this._labelRoomInfo.setLangText(LangConstants.TextType.B0398);
        this._btnBack.setLangText(LangConstants.TextType.B0146);
        this._btnChooseCo.setLangText(LangConstants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(LangConstants.TextType.B0168);
        this._btnChooseSkinId.setLangText(LangConstants.TextType.B0397);
        this._btnChooseReady.setLangText(LangConstants.TextType.B0402);
        this._btnStartGame.setLangText(LangConstants.TextType.B0401);
        this._btnDeleteRoom.setLangText(LangConstants.TextType.B0400);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

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

    private async _updateImgCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId),
            CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId),
        ]);

        const configVersion     = roomStaticInfo?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig        = configVersion ? await GameConfigGcModel.getGameConfig(configVersion) : null;
        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        this._imgCo.loadSource(((gameConfig == null) || (selfPlayerData == null))
            ? ``
            : HelpersImageSource.getCoEye(gameConfig, selfPlayerData.getCoId() ?? 0, true) ?? ``
        );
    }

    private async _updateGroupButton(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomPlayerInfo    = HelpersMisc.getExisted(await CoopCustomRoomModelCcrModel.getRoomPlayerInfo(roomId));
        const ownerInfo         = roomPlayerInfo.getPlayerDataList().find(v => v.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex());
        const isSelfOwner       = (!!ownerInfo) && (ownerInfo.getUserId() === UsersModel.getSelfUserId());
        const btnStartGame      = this._btnStartGame;
        btnStartGame.setRedVisible(await CoopCustomRoomModelCcrModel.checkCanStartGame(roomId));

        {
            const groupButton = this._groupButton;
            groupButton.removeAllItems(false);
            (isSelfOwner) && (groupButton.addItem(this._btnDeleteRoom, false));
            (isSelfOwner) && (groupButton.addItem(btnStartGame, false));
            groupButton.arrangeItems();
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
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomInfo      = await CoopCustomRoomModelCcrModel.getRoomStaticInfo(roomId);
        const normalMapId   = roomInfo ? (roomInfo.getSettingsForCcw()?.getNormalMapId() ?? 0) : null;
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            };
    }

    private _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        return CoopCustomRoomModelCcrModel.createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        return CoopCustomRoomModelCcrModel.createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId, true);
    }

    private _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        return CoopCustomRoomModelCcrModel.createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 0, customY: 16 - 40 },
            endProps    : { customAlpha: 1, customY: 16 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupButton,
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
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 1, customY: 16 },
            endProps    : { customAlpha: 0, customY: 16 - 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupButton,
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
