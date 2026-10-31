import {
    type Notifications_Mapping,
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    AuxiliaryTypes_ChatToTarget,
    MultiFreeRoom_Model_MfrModel,
    MultiFreeWars_Constants,
    Helpers_Collection,
    Tween_Executor,
    MultiPlayerRooms_Constants,
    ForceSkins_Utils,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    WarRules_Utils_CommonData,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    Cos_Utils,
    Players_Constants,
    Sounds_SoundPlayer,
    MultiFreeRoom_Model_MfrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";
import type { S as MfrExitRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrExitRoom/S.ts";
import type { S as MfrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type { S as MfrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import { C as MfrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/C.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!              : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData>;

    private readonly _groupNavigator!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRoom!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRoomInfo!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSettings!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupChooseCo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseCo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgCo!                    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupChoosePlayerIndex!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChoosePlayerIndex!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupChooseSkinId!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseSkinId!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgSkinId!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupChooseReady!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseReady!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgReady!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupTopRightButtons!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnInvite!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChat!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupButton!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnStartGame!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRoom!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnBack!                  : Ui_Interfaces_IUiButton.IUiButton;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnBack,                callback : this._onTouchedBtnBack },
            { ui : this._btnChooseCo,            callback : this._onTouchedBtnChooseCo },
            { ui : this._btnChoosePlayerIndex,   callback : this._onTouchedBtnChoosePlayerIndex },
            { ui : this._btnChooseSkinId,        callback : this._onTouchedBtnChooseSkinId },
            { ui : this._btnChooseReady,         callback : this._onTouchedBtnChooseReady },
            { ui : this._btnStartGame,           callback : this._onTouchedBtnStartGame },
            { ui : this._btnDeleteRoom,          callback : this._onTouchedBtnDeleteRoom },
            { ui : this._btnChat,                callback : this._onTouchedBtnChat },
            { ui : this._btnInvite,              callback : this._onTouchedBtnInvite },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgMfrGetRoomPlayerInfo",     callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : "MsgMfrGetRoomStaticInfo",     callback : this._onNotifyMsgMfrGetRoomStaticInfo },
            { type : "MsgMfrExitRoom",              callback : this._onNotifyMsgMfrExitRoom },
            { type : "MsgMfrInvite",                callback : this._onNotifyMsgMfrInvite },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnChooseCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId),
            MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return;
        }

        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }

        if (selfPlayerData.getIsReady()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0128));
        } else {
            const settingsForCommon = Helpers_Misc.getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon());
            const playerIndex       = selfPlayerData.getPlayerIndex();
            const gameConfig        = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));
            const warRuleCommonData = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                gameConfig         : gameConfig,
                currentCoId        : selfPlayerData.getCoId(),
                availableCoIdArray : [...PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                    playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfig      : gameConfig,
                    hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                    includeRandom   : true,
                })],
                isBan             : false,
                callbackOnConfirm : newCoId => {
                    if (newCoId !== (selfPlayerData.getCoId())) {
                        MultiFreeRoom_Model_MfrProxy.reqMfrSetSelfSettings(MfrSetSelfSettingsRequest.fromJson({
                            roomId            : roomId,
                            playerIndex       : playerIndex,
                            coId              : newCoId,
                            unitAndTileSkinId : selfPlayerData.getUnitAndTileSkinId(),
                        }));
                    }
                },
            });
        }
    }

    private async _onTouchedBtnChoosePlayerIndex(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId),
            MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return;
        }

        const settingsForCommon = roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon();
        const warRule           = settingsForCommon?.getInstanceWarRule();
        if (warRule == null) {
            return;
        }

        const gameConfig = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon?.getConfigVersion()));
        if (gameConfig == null) {
            return;
        }

        const selfUserId        = Users_Model.getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }

        if (selfPlayerData.getIsReady()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0128));
            return;
        }

        const selfPlayerIndex       = selfPlayerData.getPlayerIndex();
        const warRuleCommonData     = Helpers_Misc.getExisted(warRule.getWarRuleCommonData());
        const playersCountUnneutral = WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : selfPlayerIndex,
            availableNumberArray : Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playersCountUnneutral + 1, 1)
                .filter(playerIndex => (playerIndex === selfPlayerIndex) || (!playerDataList.some(v => v.getPlayerIndex() === playerIndex))),
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B0168),
            getNumberMainText : playerIndex => `P${playerIndex}, ${Lang_Utils.getPlayerTeamName(WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? Lang_Constants.UndefinedError}`,
            callbackOnConfirm : newPlayerIndex => {
                if (newPlayerIndex !== selfPlayerIndex) {
                    const currCoId          = selfPlayerData.getCoId();
                    const availableCoIdSet  = PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                        playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, newPlayerIndex),
                        gameConfig      : gameConfig,
                        hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                        includeRandom   : true,
                    });
                    MultiFreeRoom_Model_MfrProxy.reqMfrSetSelfSettings(MfrSetSelfSettingsRequest.fromJson({
                        roomId            : roomId,
                        playerIndex       : newPlayerIndex,
                        unitAndTileSkinId : selfPlayerData.getUnitAndTileSkinId(),
                        coId              : availableCoIdSet.has(currCoId) ? currCoId : Cos_Utils.pickRandomCo([...availableCoIdSet]),
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

        const roomPlayerInfo = await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId);
        if (roomPlayerInfo == null) {
            return;
        }

        const selfUserId        = Users_Model.getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0128));
            return;
        }

        const usedSkinIdArray       = Helpers_Collection.getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()));
        const availableSkinIdArray  = ForceSkins_Utils.getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId        : selfSkinId,
            availableSkinIdArray : availableSkinIdArray,
            callback             : newSkinId => {
                if (newSkinId !== selfSkinId) {
                    MultiFreeRoom_Model_MfrProxy.reqMfrSetSelfSettings(MfrSetSelfSettingsRequest.fromJson({
                        roomId            : roomId,
                        playerIndex       : selfPlayerData.getPlayerIndex(),
                        unitAndTileSkinId : newSkinId,
                        coId              : selfPlayerData.getCoId(),
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

        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = (await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData) {
            MultiFreeRoom_Model_MfrProxy.reqMfrSetReady(roomId, !selfPlayerData.getIsReady());
        }
    }

    private _onTouchedBtnStartGame(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            MultiFreeRoom_Model_MfrProxy.reqMfrStartWar(roomId);
        }
    }

    private _onTouchedBtnDeleteRoom(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0149),
                callback   : () => {
                    MultiFreeRoom_Model_MfrProxy.reqMfrDeleteRoom(roomId);
                },
            });
        }
    }

    private _onTouchedBtnChat(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
            toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                toMfrRoomId : this.getOpenData()?.roomId,
            }),
        });
    }

    private async _onTouchedBtnInvite(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const playersCountUnneutral = (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId))?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getPlayerRuleList()?.length;
        if (playersCountUnneutral == null) {
            return;
        }

        const joinedPlayersCount = (await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().length;
        if (joinedPlayersCount == null) {
            return;
        }

        if (joinedPlayersCount >= playersCountUnneutral) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0145));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchMultiUserPanel, {
            maxChooseCount    : MultiFreeWars_Constants.Common.MaxInviteCount,
            minChooseCount    : 1,
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B1003),
            callbackOnConfirm : userIdArray => {
                MultiFreeRoom_Model_MfrProxy.reqMfrInvite(roomId, userIdArray);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMfrGetRoomPlayerInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrGetRoomPlayerInfo"]>): void {
        const data = (e.data as { msg: MfrGetRoomPlayerInfoResponse }).msg;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        if (!data.getRoomPlayerInfo()?.getPlayerDataList()?.some(v => v.getUserId() === selfUserId)) {
            this.closePanel();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateGroupButton();
            this._updateImgCo();
            this._updateLabelPlayerIndex();
            this._updateImgSkinId();
            this._updateGroupChooseReady();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMfrGetRoomStaticInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrGetRoomStaticInfo"]>): void {
        const data = (e.data as { msg: MfrGetRoomStaticInfoResponse }).msg;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        if (data.getRoomStaticInfo() == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0019));
            this.closePanel();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateCommonWarMapInfoPage();
            this._updateCommonWarBasicSettingsPage();
            this._updateCommonWarAdvancedSettingsPage();
        }
    }

    private async _onNotifyMsgMfrExitRoom(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMfrExitRoom"]>): Promise<void> {
        const data      = (e.data as { msg: MfrExitRoomResponse }).msg;
        const roomId    = data.getRoomId();
        if (roomId === this.getOpenData()?.roomId) {
            const exitRoomType = data.getExitType();
            if (exitRoomType === MultiPlayerRooms_Constants.ExitRoomType.DeletedByRoomOwner) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0127));
            } else if (exitRoomType === MultiPlayerRooms_Constants.ExitRoomType.SelfExit) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0016));
            }

            this.closePanel();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
        }
    }

    private _onNotifyMsgMfrInvite(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0378));
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
            MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId),
            MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId),
        ]);
        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        const label             = this._labelPlayerIndex;
        if (selfPlayerData == null) {
            label.setText(``);
            return;
        }

        const warRuleCommonData = roomStaticInfo?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData();
        if (warRuleCommonData == null) {
            label.setText(``);
            return;
        }

        const playerIndex   = selfPlayerData.getPlayerIndex();
        const teamIndex     = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        label.setText(`P${playerIndex}${`\n`}${Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = Users_Model.getSelfUserId();
        const skinId        = (await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : Helpers_ImageSource.getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = Users_Model.getSelfUserId();
        const isReady       = (await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelMultiPlayer.setLangText(Lang_Constants.TextType.B0557);
        this._labelMyRoom.setLangText(Lang_Constants.TextType.B0410);
        this._labelRoomInfo.setLangText(Lang_Constants.TextType.B0398);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnChooseCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(Lang_Constants.TextType.B0168);
        this._btnChooseSkinId.setLangText(Lang_Constants.TextType.B0397);
        this._btnChooseReady.setLangText(Lang_Constants.TextType.B0402);
        this._btnStartGame.setLangText(Lang_Constants.TextType.B0401);
        this._btnDeleteRoom.setLangText(Lang_Constants.TextType.B0400);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
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

    private async _updateImgCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId),
            MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId),
        ]);

        const configVersion     = roomStaticInfo?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig        = configVersion ? await GameConfigs_Provider.getGameConfig(configVersion) : null;
        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = roomPlayerInfo?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        this._imgCo.loadSource(((gameConfig == null) || (selfPlayerData == null))
            ? ``
            : Helpers_ImageSource.getCoEye(gameConfig, selfPlayerData.getCoId(), true) ?? ``,
        );
    }

    private async _updateGroupButton(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo          = Helpers_Misc.getExisted(await MultiFreeRoom_Model_MfrModel.getRoomPlayerInfo(roomId));
        const ownerInfo         = roomInfo.getPlayerDataList().find(v => v.getPlayerIndex() === roomInfo.getOwnerPlayerIndex());
        const isSelfOwner       = (!!ownerInfo) && (ownerInfo.getUserId() === Users_Model.getSelfUserId());
        const btnStartGame      = this._btnStartGame;
        btnStartGame.setRedVisible(await MultiFreeRoom_Model_MfrModel.checkCanStartGame(roomId));

        {
            const groupButton = this._groupButton;
            groupButton.removeAllItems(false);
            if (isSelfOwner) {
                groupButton.addItem(this._btnDeleteRoom, false);
                groupButton.addItem(btnStartGame, false);
            }

            groupButton.arrangeItems();
        }
    }

    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
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

    private async _createDataForCommonMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomStaticInfo    = await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(roomId);
        const warData           = roomStaticInfo?.getSettingsForMfw()?.getInitialWarData();
        return warData == null
            ? null
            : {
                warInfo : {
                    warData            : warData,
                    showInitialWarData : false,
                    overridingPlayers  : null,
                },
            };
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        return MultiFreeRoom_Model_MfrModel.createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        return MultiFreeRoom_Model_MfrModel.createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId, true);
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        return MultiFreeRoom_Model_MfrModel.createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 0, customY : 16 - 40 },
            endProps   : { customAlpha : 1, customY : 16 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupButton,
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
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 1, customY : 16 },
            endProps   : { customAlpha : 0, customY : 16 - 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupButton,
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
    name: string;
}
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}
