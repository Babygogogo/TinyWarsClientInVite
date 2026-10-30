import {
    GamePanels_Manager,
    Cos_Constants,
    Mail_Model_MailModel,
    Campaigns_Mains_Provider,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    ReplayWar_Model_RwModel,
    Users_Model,
    WatchWar_Model_WwModel,
    Helpers_GameFlow,
    Sounds_SoundPlayer,
    CoopCustomRoom_Model_CcrProxy,
    Mail_Model_MailProxy,
    MultiCustomRoom_Model_McrProxy,
    MultiFreeRoom_Model_MfrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScroller,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiZoomableMap,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { PlayerInfo } from "../../proto/schema/CommonProto/Mail/MailEndWarNotification/PlayerInfo.ts";
import type { S as CcrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type { S as MailSetIsNewResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";
import type { S as McrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type { S as MfrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _listMail!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMailRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDetail!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _scrContent!       : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _layoutContent!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelContent!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupMapView!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!          : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    private readonly _layoutButtons!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnReplay!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnJoinRoom!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSpectate!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInviter!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlayers!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnReplay,      callback : this._onTouchedBtnReplay },
            { ui : this._btnJoinRoom,    callback : this._onTouchedBtnJoinRoom },
            { ui : this._btnSpectate,    callback : this._onTouchedBtnSpectate },
            { ui : this._btnDelete,      callback : this._onTouchedBtnDelete },
            { ui : this._btnInviter,     callback : this._onTouchedBtnInviter },
            { ui : this._btnPlayers,     callback : this._onTouchedBtnPlayers },
            { ui : this._groupMapView,   callback : this._onTouchedGroupMapView },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMailGetAllMailArray,  callback : this._onNotifyMsgMailGetAllMailArray },
            { type : Notifications_TypeId.TypeId.MsgMailGetMail,          callback : this._onNotifyMsgMailGetMail },
            { type : Notifications_TypeId.TypeId.MsgMailDeleteMail,       callback : this._onNotifyMsgMailDeleteMail },
            { type : Notifications_TypeId.TypeId.MsgCcrJoinRoom,          callback : this._onNotifyMsgCcrJoinRoom },
            { type : Notifications_TypeId.TypeId.MsgMcrJoinRoom,          callback : this._onNotifyMsgMcrJoinRoom },
            { type : Notifications_TypeId.TypeId.MsgMfrJoinRoom,          callback : this._onNotifyMsgMfrJoinRoom },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const zoomMap = this._zoomMap;
        zoomMap.setMouseWheelListenerEnabled(false);
        zoomMap.setTouchListenerEnabled(false);

        this._listMail.setItemRendererClass(MailRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMail.removeAllItems();

        await super._onClosed();
    }

    public async setAndReviseSelectedMailId(newMailId: number, needScroll: boolean): Promise<void> {
        const listMail  = this._listMail;
        const newIndex  = listMail.getRevisedFirstIndex(v => v?.mailId === newMailId);
        listMail.setSelectedItemIndex(newIndex);
        this._updateComponentsForMailMainData();

        if (needScroll) {
            listMail.scrollToItem(newIndex);
        }

        {
            const mailId    = this._getSelectedMailId();
            const mailData  = mailId == null ? null : Mail_Model_MailModel.getMail(mailId);
            if (mailData?.getIsNew()) {
                Mail_Model_MailProxy.reqMailSetIsNew(mailData.getMailId(), false);
            }
        }
    }
    private _getSelectedMailId(): number | null {
        return this._listMail.getFirstSelectedData()?.mailId ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnReplay(): Promise<void> {
        const mailId    = this._listMail.getFirstSelectedData()?.mailId;
        const replayId  = (mailId == null ? null : Mail_Model_MailModel.getMail(mailId))?.getMailContainer().getMailEndWarNotification()?.getReplayId();
        if (replayId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const data = await ReplayWar_Model_RwModel.getReplayData(replayId);
            if (data) {
                Helpers_GameFlow.gotoReplayWar(data, replayId);
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            }
        }
    }

    private _onTouchedBtnJoinRoom(): void {
        const mailId        = this._listMail.getFirstSelectedData()?.mailId;
        const mailContainer = (mailId == null ? null : Mail_Model_MailModel.getMail(mailId))?.getMailContainer();
        if (mailContainer?.getMailMcrInvite()) {
            MultiCustomRoom_Model_McrProxy.reqMcrJoinRoom(mailContainer.getMailMcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailCcrInvite()) {
            CoopCustomRoom_Model_CcrProxy.reqCcrJoinRoom(mailContainer.getMailCcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailMfrInvite()) {
            MultiFreeRoom_Model_MfrProxy.reqMfrJoinRoom(mailContainer.getMailMfrInvite()?.getRoomId() ?? 0);
        }
    }

    private async _onTouchedBtnSpectate(): Promise<void> {
        const mailId    = this._listMail.getFirstSelectedData()?.mailId;
        const warId     = (mailId == null ? null : Mail_Model_MailModel.getMail(mailId))?.getMailContainer().getMailAcceptSpectate()?.getWarId();
        if (warId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const warData = await WatchWar_Model_WwModel.getWatchWarData(warId);
            if (warData) {
                Helpers_GameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
        }
    }

    private _onTouchedBtnDelete(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => Mail_Model_MailProxy.reqMailDeleteMail(mailId),
            });
        }
    }

    private _onTouchedBtnInviter(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailContainer = Mail_Model_MailModel.getMail(mailId)?.getMailContainer();
        if (mailContainer == null) {
            return;
        }

        const userId = (mailContainer.getMailCcrInvite() ?? mailContainer.getMailMcrInvite() ?? mailContainer.getMailMfrInvite())?.getInviterUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
        }
    }

    private async _onTouchedBtnPlayers(): Promise<void> {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData = Mail_Model_MailModel.getMail(mailId)?.getMailContainer().getMailEndWarNotification();
        if (mailData == null) {
            return;
        }

        const rawPlayerInfoArray = mailData.getPlayerInfoArray();
        if (rawPlayerInfoArray == null) {
            return;
        }

        const configVersion = mailData.getConfigVersion();
        const gameConfig    = configVersion == null ? null : await GameConfigs_Provider.getGameConfig(configVersion);
        if (gameConfig == null) {
            return;
        }

        const playerInfoArray: AuxiliaryTypes_AuxiliaryTypes.PlayerInfo2[] = [];
        for (let i = 0; i < rawPlayerInfoArray.length; ++i) {
            const playerIndex   = i + 1;
            const rawPlayerInfo = rawPlayerInfoArray[i];
            playerInfoArray.push({
                userId      : rawPlayerInfo.getUserId(),
                isAlive     : !!rawPlayerInfo.getIsAlive(),
                playerIndex : playerIndex,
                skinId      : rawPlayerInfo.getSkinId() ?? ForceSkins_Utils.getDefaultSkinId(playerIndex),
                coId        : rawPlayerInfo.getCoId() ?? Cos_Constants.CoId.Empty,
                teamIndex   : rawPlayerInfo.getTeamIndex(),
            });
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowPlayerListPanel, {
            gameConfig      : gameConfig,
            warId           : null,
            playerInfoArray : playerInfoArray,
        });
    }

    private async _onTouchedGroupMapView(): Promise<void> {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const normalMapId = Mail_Model_MailModel.getMail(mailId)?.getMailContainer().getMailEndWarNotification()?.getNormalMapId();
        if (normalMapId != null) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    overridingPlayers : null,
                },
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMailGetAllMailArray(): void {
        this._updateView();
    }

    private _onNotifyMsgMailGetMail(): void {
        this._updateView();
    }

    private _onNotifyMsgMailDeleteMail(): void {
        this._updateView();
    }

    private _onNotifyMsgCcrJoinRoom(e: Egret_Egret.Event): void {
        const data      = e.data as CcrJoinRoomResponse;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        Helpers_GameFlow.gotoCcrRoomInfoPanel(roomId);
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrJoinRoom(e: Egret_Egret.Event): void {
        const data      = e.data as McrJoinRoomResponse;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        Helpers_GameFlow.gotoMcrRoomInfoPanel(roomId);
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrJoinRoom(e: Egret_Egret.Event): void {
        const data      = e.data as MfrJoinRoomResponse;
        const roomId    = Helpers_Misc.getExisted(data.getRoomId());
        Helpers_GameFlow.gotoMfrRoomInfoPanel(roomId);
        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0069, roomId));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    public async _updateView(): Promise<void> {
        const oldSelectedNormalMapId    = this._getSelectedMailId();
        const dataArray                 = this._createDataForListMail();
        await this._listMail.bindData(dataArray);
        this.setAndReviseSelectedMailId(oldSelectedNormalMapId ?? -1, true);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1276);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
        this._btnReplay.setLangText(Lang_Constants.TextType.B0710);
        this._btnJoinRoom.setLangText(Lang_Constants.TextType.B0583);
        this._btnSpectate.setLangText(Lang_Constants.TextType.B0872);
        this._btnInviter.setLangText(Lang_Constants.TextType.B1398);
        this._btnPlayers.setLangText(Lang_Constants.TextType.Players);

        this._updateComponentsForMailMainData();
    }

    private _createDataForListMail(): DataForMailRenderer[] {
        const dataArray: DataForMailRenderer[] = [];
        for (const mailData of Mail_Model_MailModel.getAllMailDataArray()) {
            dataArray.push({
                mailId : mailData.getMailId(),
                panel  : this,
            });
        }

        return dataArray;
    }

    private async _updateComponentsForMailMainData(): Promise<void> {
        const mailId        = this._listMail.getFirstSelectedData()?.mailId;
        const groupDetail   = this._groupDetail;
        const labelNoData   = this._labelNoData;
        if (mailId == null) {
            groupDetail.setIsVisible(false);
            labelNoData.setIsVisible(true);
            return;
        }

        const mailData = Mail_Model_MailModel.getMail(mailId);
        if (mailData == null) {
            groupDetail.setIsVisible(false);
            labelNoData.setIsVisible(true);
            return;
        }

        const layoutContent = this._layoutContent;
        const labelContent  = this._labelContent;
        const btnDelete     = this._btnDelete;
        const layoutButtons = this._layoutButtons;
        const btnReplay     = this._btnReplay;
        const btnJoinRoom   = this._btnJoinRoom;
        const btnSpectate   = this._btnSpectate;
        const btnInviter    = this._btnInviter;
        const btnPlayers    = this._btnPlayers;
        groupDetail.setIsVisible(true);
        labelNoData.setIsVisible(false);
        btnDelete.setIsVisible(true);
        layoutButtons.removeAllItems(false);
        layoutContent.removeAllItems(false);
        layoutContent.addItem(labelContent, false);

        // TODO
        const mailContainer = mailData.getMailContainer();
        {
            const data = mailContainer.getMailEndWarNotification();
            if (data) {
                const normalMapId   = data.getNormalMapId();
                const replayId      = data.getReplayId();
                if (replayId != null) {
                    layoutButtons.addItem(btnReplay, false);
                }
                layoutButtons.addItem(btnPlayers, false);
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0151,
                    Lang_Utils.getWarTypeName(data.getWarType() ?? 0),
                    (normalMapId != null) ? (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError) : `----`,
                    (replayId != null) ? replayId : `----`,
                    await generatePlayerInfoText(data.getPlayerInfoArray(), !!data.getIsDraw(), Helpers_Misc.getExisted(data.getConfigVersion())),
                ));

                if (normalMapId != null) {
                    layoutContent.addItem(this._groupMapView, false);

                    this._zoomMap.showMapByMapData({
                        mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                        gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                        overridingPlayers : null,
                    });
                }
            }
        }

        {
            const data = mailContainer.getMailMcrInvite();
            if (data) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0152,
                    data.getRoomId() ?? 0,
                    await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? Lang_Constants.UndefinedError,
                    Lang_Utils.getText(data.getHasFog() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No),
                    await Users_Model.getUserNickname(data.getInviterUserId() ?? 0) ?? Lang_Constants.UndefinedError,
                ));
            }
        }

        {
            const data = mailContainer.getMailCcrInvite();
            if (data) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0153,
                    data.getRoomId() ?? 0,
                    await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? Lang_Constants.UndefinedError,
                    Lang_Utils.getText(data.getHasFog() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No),
                    await Users_Model.getUserNickname(data.getInviterUserId() ?? 0) ?? Lang_Constants.UndefinedError,
                ));
            }
        }

        {
            const data = mailContainer.getMailMfrInvite();
            if (mailContainer.getMailMfrInvite()) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0154,
                    data?.getRoomId() ?? 0,
                    Lang_Utils.getText(data?.getHasFog() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No),
                    await Users_Model.getUserNickname(data?.getInviterUserId() ?? 0) ?? Lang_Constants.UndefinedError,
                ));
            }
        }

        {
            const data = mailContainer.getMailAcceptMap();
            if (data) {
                const normalMapId = data.getNormalMapId() ?? 0;
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0156,
                    normalMapId,
                    (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? Lang_Constants.UndefinedError,
                    (await Users_Model.getUserNickname(data.getReviewerUserId() ?? 0)) ?? Lang_Constants.UndefinedError,
                ));
            }
        }

        {
            const data = mailContainer.getMailAutoTourneyWinners();
            if (data) {
                const tourneyId = data.getTourneyId() ?? 0;
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0163,
                    tourneyId,
                ));
            }
        }

        {
            const data = mailContainer.getMailSrwValidationResult();
            if (data) {
                const normalMapId       = data.getNormalMapId() ?? 0;
                const templateWarRuleId = data.getTemplateWarRuleId();
                const mapRawData        = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
                const mapNameArray      = mapRawData?.getMapNameArray();
                const ruleNameArray     = mapRawData?.getTemplateWarRuleArray().find(v => (v.getRuleId()) == templateWarRuleId)?.getRuleNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0194,
                        `#${normalMapId} ${Lang_Utils.getLanguageText({ textArray : mapNameArray })}`,
                        `#${templateWarRuleId} ${Lang_Utils.getLanguageText({ textArray : ruleNameArray })}`,
                        `${data.getScore() ?? 0}`,
                    ));
                } else {
                    labelContent.setText(Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0195,
                        `#${normalMapId} ${Lang_Utils.getLanguageText({ textArray : mapNameArray })}`,
                        `#${templateWarRuleId} ${Lang_Utils.getLanguageText({ textArray : ruleNameArray })}`,
                        `${data.getErrorCode() ?? 0}`,
                    ));
                }
            }
        }

        {
            const data = mailContainer.getMailCawValidationResult();
            if (data) {
                const campaignId        = data.getCampaignId() ?? 0;
                const campaignMapId     = data.getCampaignMapId() ?? 0;
                const campaignNameArray = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getNameArray();
                const mapNameArray      = (await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0196,
                        `#${campaignId} ${Lang_Utils.getLanguageText({ textArray : campaignNameArray })}`,
                        `#${campaignMapId} ${Lang_Utils.getLanguageText({ textArray : mapNameArray })}`,
                        `${data.getScore() ?? 0}`,
                    ));
                } else {
                    labelContent.setText(Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0197,
                        `#${campaignId} ${Lang_Utils.getLanguageText({ textArray : campaignNameArray })}`,
                        `#${campaignMapId} ${Lang_Utils.getLanguageText({ textArray : mapNameArray })}`,
                        `${data.getErrorCode() ?? 0}`,
                    ));
                }
            }
        }

        {
            const data = mailContainer.getMailAcceptSpectate();
            if (data) {
                const warId         = data.getWarId() ?? 0;
                const targetUserId  = data.getSpectateTargetUserId() ?? 0;
                const warData       = await WatchWar_Model_WwModel.getWatchWarData(warId);
                const mapId         = warData == null ? null : Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
                if (warData != null) {
                    layoutButtons.addItem(btnSpectate, false);
                }
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0210,
                    warId,
                    warData == null ? `----` : (Lang_Utils.getWarTypeName(Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(warData)) ?? Lang_Constants.UndefinedError),
                    mapId ?? `----`,
                    mapId == null ? `----` : ((await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(mapId)) ?? Lang_Constants.UndefinedError),
                    targetUserId,
                    (await Users_Model.getUserNickname(targetUserId)) ?? Lang_Constants.UndefinedError,
                ));
            }
        }

        {
            const data = mailContainer.getMailMrwBoot();
            if (data) {
                labelContent.setText(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0214,
                    data.getWarId() ?? 0,
                ));
            }
        }

        layoutButtons.arrangeItems();
        layoutContent.arrangeItems();

        const scrContent = this._scrContent;
        scrContent.updateOnItemsChanged();
        scrContent.scrollTop();
    }
}

interface DataForMailRenderer extends Ui_Types_UiListItemData.UiListItemData {
    mailId  : number;
    panel   : Panel;
}
class MailRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMailRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMailRenderer> {
    private readonly _layoutContent!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgRed!           : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.MsgMailSetIsNew,     callback : this._onNotifyMsgMailSetIsNew },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateImgRed();

        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData          = Mail_Model_MailModel.getMail(mailId);
        const labelName         = this._labelName;
        const labelTimestamp    = this._labelTimestamp;
        if (mailData == null) {
            labelTimestamp.setText(`????`);
            labelName.setText(Lang_Constants.UndefinedError);
            return;
        }

        const timestamp = mailData.getCreateTimestamp();
        labelTimestamp.setText(`${Lang_Utils.getTimestampShortText(timestamp, { hour : false, minute : false, second : false })} ${Lang_Utils.getTimestampShortText(timestamp, { year : false, month : false, date : false })}`);

        const mailContainer = mailData.getMailContainer();
        if (mailContainer == null) {
            labelName.setText(Lang_Constants.UndefinedError);
        } else if (mailContainer.getMailEndWarNotification()) {
            labelName.setLangText(Lang_Constants.TextType.B0087);
        } else if (mailContainer.getMailCcrInvite()) {
            labelName.setLangText(Lang_Constants.TextType.B1003);
        } else if (mailContainer.getMailMcrInvite()) {
            labelName.setLangText(Lang_Constants.TextType.B1003);
        } else if (mailContainer.getMailMfrInvite()) {
            labelName.setLangText(Lang_Constants.TextType.B1003);
        } else if (mailContainer.getMailAcceptMap()) {
            labelName.setLangText(Lang_Constants.TextType.B1004);
        } else if (mailContainer.getMailAutoTourneyWinners()) {
            labelName.setLangText(Lang_Constants.TextType.B1022);
        } else if (mailContainer.getMailSrwValidationResult()) {
            labelName.setLangText(Lang_Constants.TextType.B1141);
        } else if (mailContainer.getMailCawValidationResult()) {
            labelName.setLangText(Lang_Constants.TextType.B0119);
        } else if (mailContainer.getMailAcceptSpectate()) {
            labelName.setLangText(Lang_Constants.TextType.B1354);
        } else if (mailContainer.getMailMrwBoot()) {
            labelName.setLangText(Lang_Constants.TextType.B1364);
        } else {
            labelName.setText(Lang_Constants.UndefinedError);
        }

        this._layoutContent.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.setAndReviseSelectedMailId(openData.mailId, false);
    }

    private _onNotifyMsgMailSetIsNew(e: Egret_Egret.Event): void {
        const data = e.data as MailSetIsNewResponse;
        if (data.getMailId() === this.getOpenData()?.mailId) {
            this._updateImgRed();
        }
    }

    private _updateImgRed(): void {
        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData  = Mail_Model_MailModel.getMail(mailId);
        const imgRed    = this._imgRed;
        if (mailData == null) {
            imgRed.setIsVisible(false);
        } else {
            imgRed.setIsVisible(mailData.getIsNew());
        }

    }
}

async function generatePlayerInfoText(playerInfoArray: PlayerInfo[], isDraw: boolean, configVersion: string): Promise<string> {
    if (playerInfoArray.length <= 0) {
        return `----`;
    }

    const textArray     : string[] = [];
    const gameConfig    = await GameConfigs_Provider.getGameConfig(configVersion);
    let playerIndex     = 1;
    for (const playerInfo of playerInfoArray) {
        const userId            = playerInfo.getUserId();
        const nickname          = (userId == null ? Lang_Utils.getText(Lang_Constants.TextType.B0607) : await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError;
        const coName            = gameConfig.getCoBasicCfg(playerInfo.getCoId() ?? 0)?.getName() ?? Lang_Constants.UndefinedError;
        const textForAliveState = playerInfo.getIsAlive()
            ? Lang_Utils.getText(isDraw ? Lang_Constants.TextType.B0552 : Lang_Constants.TextType.B0550)
            : Lang_Utils.getText(Lang_Constants.TextType.B0551);
        textArray.push(`P${playerIndex++}. ${nickname} (${coName}, ${textForAliveState})`);
    }
    return textArray.join(`\n`);
}
