import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import {
    type OpenData as CommonWarAdvancedSettingsPageOpenData,
    Page as CommonWarAdvancedSettingsPage,
} from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonWarBasicSettingsPageOpenData,
    Page as CommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonWarMapInfoPageOpenData,
    Page as CommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import {
    type OpenData as CommonWarPlayerInfoPageOpenData,
    Page as CommonWarPlayerInfoPage,
} from "../../common/view/CommonWarPlayerInfoPage.ts";
import { pickRandomCo } from "../../cos/Utils.ts";
import { show } from "../../FloatText.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    createRange,
    getNonNullElements,
} from "../../helpers/Collection.ts";
import {
    getCoEye,
    getSkinCircle,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getPlayerTeamName,
    getText,
} from "../../lang/Utils.ts";
import { Common } from "../../multiCustomWars/Constants.ts";
import { ExitRoomType } from "../../multiPlayerRooms/Constants.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalMcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { S as McrExitRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrExitRoom/S.ts";
import type { S as McrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type { S as McrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import { C as McrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/C.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import {
    getPlayerRule,
    getPlayersCountUnneutral,
} from "../../warRules/utils/CommonData.ts";
import {
    checkCanStartGame,
    createDataForCommonWarAdvancedSettingsPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarPlayerInfoPage,
    getRoomPlayerInfo,
    getRoomStaticInfo,
} from "../model/McrModel.ts";
import {
    reqMcrDeleteRoom,
    reqMcrInvite,
    reqMcrSetReady,
    reqMcrSetSelfSettings,
    reqMcrStartWar,
} from "../model/McrProxy.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!                 : IUiContainer;
    private readonly _tabSettings!              : IUiTab<DataForTabItemRenderer, CommonWarMapInfoPageOpenData | CommonWarPlayerInfoPageOpenData | CommonWarBasicSettingsPageOpenData | CommonWarAdvancedSettingsPageOpenData>;

    private readonly _groupNavigator!           : IUiLayout;
    private readonly _labelMultiPlayer!         : IUiLabel;
    private readonly _labelMyRoom!              : IUiLabel;
    private readonly _labelRoomInfo!            : IUiLabel;

    private readonly _groupSettings!            : IUiContainer;
    private readonly _groupChooseCo!            : IUiContainer;
    private readonly _btnChooseCo!              : IUiButton;
    private readonly _imgCo!                    : IUiImage;

    private readonly _groupChoosePlayerIndex!   : IUiContainer;
    private readonly _btnChoosePlayerIndex!     : IUiButton;
    private readonly _labelPlayerIndex!         : IUiLabel;

    private readonly _groupChooseSkinId!        : IUiContainer;
    private readonly _btnChooseSkinId!          : IUiButton;
    private readonly _imgSkinId!                : IUiImage;

    private readonly _groupChooseReady!         : IUiContainer;
    private readonly _btnChooseReady!           : IUiButton;
    private readonly _imgReady!                 : IUiImage;

    private readonly _groupTopRightButtons!     : IUiContainer;
    private readonly _btnInvite!                : IUiButton;
    private readonly _btnChat!                  : IUiButton;

    private readonly _groupButton!              : IUiLayout;
    private readonly _btnStartGame!             : IUiButton;
    private readonly _btnDeleteRoom!            : IUiButton;

    private readonly _btnBack!                  : IUiButton;

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
            { type : TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgMcrGetRoomPlayerInfo,     callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : TypeId.MsgMcrGetRoomStaticInfo,     callback : this._onNotifyMsgMcrGetRoomStaticInfo },
            { type : TypeId.MsgMcrExitRoom,              callback : this._onNotifyMsgMcrExitRoom },
            { type : TypeId.MsgMcrInvite,                callback : this._onNotifyMsgMcrInvite },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        openPanel(getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnChooseCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomStaticInfo = await getRoomStaticInfo(roomId);
        if (roomStaticInfo == null) {
            return;
        }

        const roomPlayerInfo = await getRoomPlayerInfo(roomId);
        if (roomPlayerInfo == null) {
            return;
        }

        const selfUserId        = getSelfUserId();
        const selfPlayerData    = roomPlayerInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData != null) {
            if (selfPlayerData.getIsReady()) {
                show(getText(TextType.A0128));
            } else {
                const settingsForCommon = getExisted(roomStaticInfo.getSettingsForCommon());
                const playerIndex       = selfPlayerData.getPlayerIndex();
                const gameConfig        = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
                const warRuleCommonData = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
                openPanel(getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig         : gameConfig,
                    currentCoId        : selfPlayerData.getCoId(),
                    availableCoIdArray : [...getFinalMcwHumanCoIdSet({
                        playerRule        : getPlayerRule(warRuleCommonData, playerIndex),
                        gameConfiguration : gameConfig,
                        hasFogByDefault   : warRuleCommonData.getHasFogByDefault(),
                        includeRandom     : true,
                    })],
                    isBan             : false,
                    callbackOnConfirm : newCoId => {
                        if (newCoId !== (selfPlayerData.getCoId())) {
                            reqMcrSetSelfSettings(McrSetSelfSettingsRequest.fromJson({
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
    }

    private async _onTouchedBtnChoosePlayerIndex(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return;
        }

        const settingsForCommon = roomStaticInfo.getSettingsForCommon();
        const instanceWarRule   = settingsForCommon?.getInstanceWarRule();
        if (instanceWarRule == null) {
            return;
        }

        const gameConfig = await getGameConfig(getExisted(settingsForCommon?.getConfigVersion()));
        if (gameConfig == null) {
            return;
        }

        const selfUserId        = getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }

        if (selfPlayerData.getIsReady()) {
            show(getText(TextType.A0128));
            return;
        }

        const selfPlayerIndex   = selfPlayerData.getPlayerIndex();
        const warRuleCommonData = getExisted(instanceWarRule.getWarRuleCommonData());
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : selfPlayerIndex,
            availableNumberArray : createRange(PlayerIndex.First, getPlayersCountUnneutral(warRuleCommonData) + 1, 1)
                .filter(playerIndex => (playerIndex === selfPlayerIndex) || (!playerDataList.some(v => v.getPlayerIndex() === playerIndex))),
            getTitleText      : () => getText(TextType.B0168),
            getNumberMainText : playerIndex => `P${playerIndex}, ${getPlayerTeamName(getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? UndefinedError}`,
            callbackOnConfirm : newPlayerIndex => {
                if (newPlayerIndex !== selfPlayerIndex) {
                    const currCoId              = selfPlayerData.getCoId();
                    const availableCoIdArray    = [...getFinalMcwHumanCoIdSet({
                        playerRule        : getPlayerRule(warRuleCommonData, newPlayerIndex),
                        gameConfiguration : gameConfig,
                        hasFogByDefault   : warRuleCommonData.getHasFogByDefault(),
                        includeRandom     : true,
                    })];
                    reqMcrSetSelfSettings(McrSetSelfSettingsRequest.fromJson({
                        roomId            : roomId,
                        playerIndex       : newPlayerIndex,
                        unitAndTileSkinId : selfPlayerData.getUnitAndTileSkinId(),
                        coId              : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : pickRandomCo(availableCoIdArray),
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

        const roomPlayerInfo = await getRoomPlayerInfo(roomId);
        if (roomPlayerInfo == null) {
            return;
        }

        const selfUserId        = getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            show(getText(TextType.A0128));
            return;
        }

        const usedSkinIdArray       = getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()));
        const availableSkinIdArray  = getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId        : selfSkinId,
            availableSkinIdArray : availableSkinIdArray,
            callback             : newSkinId => {
                if (newSkinId !== selfSkinId) {
                    reqMcrSetSelfSettings(McrSetSelfSettingsRequest.fromJson({
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

        const selfUserId        = getSelfUserId();
        const selfPlayerData    = (await getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData) {
            reqMcrSetReady(roomId, !selfPlayerData.getIsReady());
        }
    }

    private _onTouchedBtnStartGame(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            reqMcrStartWar(roomId);
        }
    }

    private _onTouchedBtnDeleteRoom(): void {
        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0149),
                callback   : () => {
                    reqMcrDeleteRoom(roomId);
                },
            });
        }
    }

    private _onTouchedBtnChat(): void {
        openPanel(getDict().ChatPanel, {
            toTarget : new ChatToTarget({
                toMcrRoomId : this.getOpenData()?.roomId,
            })
        });
    }

    private async _onTouchedBtnInvite(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const playersCountUnneutral = (await getRoomStaticInfo(roomId))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getPlayerRuleList().length;
        if (playersCountUnneutral == null) {
            return;
        }

        const joinedPlayersCount = (await getRoomPlayerInfo(roomId))?.getPlayerDataList().length;
        if (joinedPlayersCount == null) {
            return;
        }

        if (joinedPlayersCount >= playersCountUnneutral) {
            show(getText(TextType.A0145));
            return;
        }

        openPanel(getDict().CommonSearchMultiUserPanel, {
            maxChooseCount    : Common.MaxInviteCount,
            minChooseCount    : 1,
            getTitleText      : () => getText(TextType.B1003),
            callbackOnConfirm : userIdArray => {
                reqMcrInvite(roomId, userIdArray);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMcrGetRoomPlayerInfo(e: Event): void {
        const data = e.data as McrGetRoomPlayerInfoResponse;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        const selfUserId = getExisted(getSelfUserId());
        if (!data.getRoomPlayerInfo()?.getPlayerDataList()?.some(v => v.getUserId() === selfUserId)) {
            this.closePanel();
            openPanel(getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateGroupButton();
            this._updateImgCo();
            this._updateLabelPlayerIndex();
            this._updateImgSkinId();
            this._updateGroupChooseReady();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMcrGetRoomStaticInfo(e: Event): void {
        const data = e.data as McrGetRoomStaticInfoResponse;
        if (data.getRoomId() !== this.getOpenData()?.roomId) {
            return;
        }

        if (data.getRoomStaticInfo() == null) {
            show(getText(TextType.A0019));
            this.closePanel();
            openPanel(getDict().MpwMyRoomListPanel, void 0);
        } else {
            this._updateCommonWarMapInfoPage();
            this._updateCommonWarBasicSettingsPage();
            this._updateCommonWarAdvancedSettingsPage();
        }
    }

    private async _onNotifyMsgMcrExitRoom(e: Event): Promise<void> {
        const data      = e.data as McrExitRoomResponse;
        const roomId    = data.getRoomId();
        if (roomId === this.getOpenData()?.roomId) {
            const exitRoomType = data.getExitType();
            if (exitRoomType === ExitRoomType.DeletedByRoomOwner) {
                show(getText(TextType.A0127));
            } else if (exitRoomType === ExitRoomType.SelfExit) {
                show(getText(TextType.A0016));
            }

            this.closePanel();
            openPanel(getDict().MpwMyRoomListPanel, void 0);
        }
    }

    private _onNotifyMsgMcrInvite(): void {
        show(getText(TextType.A0378));
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
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        const selfUserId        = getSelfUserId();
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

        const playerIndex   = selfPlayerData.getPlayerIndex();
        const teamIndex     = getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        label.setText(`P${playerIndex}${`\n`}${getPlayerTeamName(teamIndex) ?? UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = getSelfUserId();
        const skinId        = (await getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = getSelfUserId();
        const isReady       = (await getRoomPlayerInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelMultiPlayer.setLangText(TextType.B1011);
        this._labelMyRoom.setLangText(TextType.B0410);
        this._labelRoomInfo.setLangText(TextType.B0398);
        this._btnBack.setLangText(TextType.B0146);
        this._btnChooseCo.setLangText(TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(TextType.B0168);
        this._btnChooseSkinId.setLangText(TextType.B0397);
        this._btnChooseReady.setLangText(TextType.B0402);
        this._btnStartGame.setLangText(TextType.B0401);
        this._btnDeleteRoom.setLangText(TextType.B0400);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : getText(TextType.B0298) },
                pageClass   : CommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0224) },
                pageClass   : CommonWarPlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0002) },
                pageClass   : CommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0003) },
                pageClass   : CommonWarAdvancedSettingsPage,
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
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);

        const configVersion     = roomStaticInfo?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig        = configVersion ? await getGameConfig(configVersion) : null;
        const selfUserId        = getSelfUserId();
        const selfPlayerData    = roomPlayerInfo?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        this._imgCo.loadSource(((gameConfig == null) || (selfPlayerData == null))
            ? ``
            : getCoEye(gameConfig, selfPlayerData.getCoId(), true) ?? ``
        );
    }

    private async _updateGroupButton(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomPlayerInfo = await getRoomPlayerInfo(roomId);
        if (roomPlayerInfo == null) {
            return;
        }

        const ownerInfo         = roomPlayerInfo.getPlayerDataList().find(v => v.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex());
        const isSelfOwner       = (!!ownerInfo) && (ownerInfo.getUserId() === getSelfUserId());
        const btnStartGame      = this._btnStartGame;
        btnStartGame.setRedVisible(await checkCanStartGame(roomId));

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
            this._tabSettings.updatePageData(0, await this._createDataForWarCommonMapInfoPage());
        }
    }

    private async _updateCommonWarPlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForWarCommonPlayerInfoPage());
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 0, customY : 16 - 40 },
            endProps   : { customAlpha : 1, customY : 16 },
        });
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupButton,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0, },
            endProps   : { customAlpha : 1, },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 1, customY : 16 },
            endProps   : { customAlpha : 0, customY : 16 - 40 },
        });
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupButton,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1, },
            endProps   : { customAlpha : 0, },
        });

        await wait();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _createDataForWarCommonMapInfoPage(): Promise<CommonWarMapInfoPageOpenData> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomInfo      = await getRoomStaticInfo(roomId);
        const normalMapId   = roomInfo ? (roomInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    hasFog            : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig        : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    mapRawData        : getExisted(await getRawData(normalMapId)),
                    overridingPlayers : null,
                },
            };
    }

    private async _createDataForWarCommonPlayerInfoPage(): Promise<CommonWarPlayerInfoPageOpenData> {
        return await createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonWarBasicSettingsPageOpenData> {
        return await createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId, true);
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonWarAdvancedSettingsPageOpenData> {
        return await createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
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
