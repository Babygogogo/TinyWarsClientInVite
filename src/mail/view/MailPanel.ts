import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import * as CoopCustomRoomModelCcrProxy from "../../coopCustomRoom/model/CcrProxy.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MailModelMailModel from "../model/MailModel.ts";
import * as MailModelMailProxy from "../model/MailProxy.ts";
import * as MultiCustomRoomModelMcrProxy from "../../multiCustomRoom/model/McrProxy.ts";
import * as MultiFreeRoomModelMfrProxy from "../../multiFreeRoom/model/MfrProxy.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMailMailEndWarNotificationPlayerInfo from "../../proto/schema/CommonProto/Mail/MailEndWarNotification/PlayerInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
import * as ReplayWarModelRwModel from "../../replayWar/model/RwModel.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiZoomableMap from "../../ui/interfaces/IUiZoomableMap.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;

    private readonly _listMail!         : UiInterfacesIUiScrollList.IUiScrollList<DataForMailRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDetail!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _scrContent!       : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _layoutContent!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelContent!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupMapView!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!          : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    private readonly _layoutButtons!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnReplay!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnJoinRoom!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSpectate!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInviter!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlayers!       : UiInterfacesIUiButton.IUiButton;

    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnReplay,      callback: this._onTouchedBtnReplay },
            { ui: this._btnJoinRoom,    callback: this._onTouchedBtnJoinRoom },
            { ui: this._btnSpectate,    callback: this._onTouchedBtnSpectate },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnInviter,     callback: this._onTouchedBtnInviter },
            { ui: this._btnPlayers,     callback: this._onTouchedBtnPlayers },
            { ui: this._groupMapView,   callback: this._onTouchedGroupMapView },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMailGetAllMailArray,  callback: this._onNotifyMsgMailGetAllMailArray },
            { type: NotificationsTypeId.TypeId.MsgMailGetMail,          callback: this._onNotifyMsgMailGetMail },
            { type: NotificationsTypeId.TypeId.MsgMailDeleteMail,       callback: this._onNotifyMsgMailDeleteMail },
            { type: NotificationsTypeId.TypeId.MsgCcrJoinRoom,          callback: this._onNotifyMsgCcrJoinRoom },
            { type: NotificationsTypeId.TypeId.MsgMcrJoinRoom,          callback: this._onNotifyMsgMcrJoinRoom },
            { type: NotificationsTypeId.TypeId.MsgMfrJoinRoom,          callback: this._onNotifyMsgMfrJoinRoom },
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
        const newIndex  = HelpersMisc.getExisted(listMail.getRevisedFirstIndex(v => v?.mailId === newMailId));
        listMail.setSelectedItemIndex(newIndex);
        this._updateComponentsForMailMainData();

        if (needScroll) {
            listMail.scrollToItem(newIndex);
        }

        {
            const mailId    = this._getSelectedMailId();
            const mailData  = mailId == null ? null : MailModelMailModel.getMail(mailId);
            if (mailData?.getIsNew()) {
                MailModelMailProxy.reqMailSetIsNew(mailData.getMailId(), false);
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
        const replayId  = (mailId == null ? null : MailModelMailModel.getMail(mailId))?.getMailContainer().getMailEndWarNotification()?.getReplayId();
        if (replayId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });

            const data = await ReplayWarModelRwModel.getReplayData(replayId);
            if (data) {
                HelpersGameFlow.gotoReplayWar(data, replayId);
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            }
        }
    }

    private _onTouchedBtnJoinRoom(): void {
        const mailId        = this._listMail.getFirstSelectedData()?.mailId;
        const mailContainer = (mailId == null ? null : MailModelMailModel.getMail(mailId))?.getMailContainer();
        if (mailContainer?.getMailMcrInvite()) {
            MultiCustomRoomModelMcrProxy.reqMcrJoinRoom(mailContainer.getMailMcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailCcrInvite()) {
            CoopCustomRoomModelCcrProxy.reqCcrJoinRoom(mailContainer.getMailCcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailMfrInvite()) {
            MultiFreeRoomModelMfrProxy.reqMfrJoinRoom(mailContainer.getMailMfrInvite()?.getRoomId() ?? 0);
        }
    }

    private async _onTouchedBtnSpectate(): Promise<void> {
        const mailId    = this._listMail.getFirstSelectedData()?.mailId;
        const warId     = (mailId == null ? null : MailModelMailModel.getMail(mailId))?.getMailContainer().getMailAcceptSpectate()?.getWarId();
        if (warId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });

            const warData = await WatchWarModelWwModel.getWatchWarData(warId);
            if (warData) {
                HelpersGameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
        }
    }

    private _onTouchedBtnDelete(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback    : () => MailModelMailProxy.reqMailDeleteMail(mailId),
            });
        }
    }

    private _onTouchedBtnInviter(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailContainer = MailModelMailModel.getMail(mailId)?.getMailContainer();
        if (mailContainer == null) {
            return;
        }

        const userId = (mailContainer.getMailCcrInvite() ?? mailContainer.getMailMcrInvite() ?? mailContainer.getMailMfrInvite())?.getInviterUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
        }
    }

    private async _onTouchedBtnPlayers(): Promise<void> {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData = MailModelMailModel.getMail(mailId)?.getMailContainer().getMailEndWarNotification();
        if (mailData == null) {
            return;
        }

        const rawPlayerInfoArray = mailData.getPlayerInfoArray();
        if (rawPlayerInfoArray == null) {
            return;
        }

        const configVersion = mailData.getConfigVersion();
        const gameConfig    = configVersion == null ? null : await GameConfigGcModel.getGameConfig(configVersion);
        if (gameConfig == null) {
            return;
        }

        const playerInfoArray: AuxiliaryTypesAuxiliaryTypes.PlayerInfo2[] = [];
        for (let i = 0; i < rawPlayerInfoArray.length; ++i) {
            const playerIndex   = i + 1;
            const rawPlayerInfo = rawPlayerInfoArray[i];
            playerInfoArray.push({
                userId      : rawPlayerInfo.getUserId(),
                isAlive     : !!rawPlayerInfo.getIsAlive(),
                playerIndex : playerIndex,
                skinId      : rawPlayerInfo.getSkinId() ?? ForceSkinsUtils.getDefaultSkinId(playerIndex),
                coId        : rawPlayerInfo.getCoId() ?? CosConstants.CoId.Empty,
                teamIndex   : rawPlayerInfo.getTeamIndex(),
            });
        }
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowPlayerListPanel, {
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

        const normalMapId = MailModelMailModel.getMail(mailId)?.getMailContainer().getMailEndWarNotification()?.getNormalMapId();
        if (normalMapId != null) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
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

    private _onNotifyMsgCcrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        HelpersGameFlow.gotoCcrRoomInfoPanel(roomId);
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        HelpersGameFlow.gotoMcrRoomInfoPanel(roomId);
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrJoinRoom(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS.S;
        const roomId    = HelpersMisc.getExisted(data.getRoomId());
        HelpersGameFlow.gotoMfrRoomInfoPanel(roomId);
        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0069, roomId));
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
        this._labelTitle.setLangText(LangConstants.TextType.B1276);
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._btnDelete.setLangText(LangConstants.TextType.B0220);
        this._btnReplay.setLangText(LangConstants.TextType.B0710);
        this._btnJoinRoom.setLangText(LangConstants.TextType.B0583);
        this._btnSpectate.setLangText(LangConstants.TextType.B0872);
        this._btnInviter.setLangText(LangConstants.TextType.B1398);
        this._btnPlayers.setLangText(LangConstants.TextType.Players);

        this._updateComponentsForMailMainData();
    }

    private _createDataForListMail(): DataForMailRenderer[] {
        const dataArray: DataForMailRenderer[] = [];
        for (const mailData of MailModelMailModel.getAllMailDataArray()) {
            dataArray.push({
                mailId  : mailData.getMailId(),
                panel   : this,
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

        const mailData = MailModelMailModel.getMail(mailId);
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
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0151,
                    LangUtils.getWarTypeName(data.getWarType() ?? 0),
                    (normalMapId != null) ? (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError) : `----`,
                    (replayId != null) ? replayId : `----`,
                    await generatePlayerInfoText(data.getPlayerInfoArray(), !!data.getIsDraw(), HelpersMisc.getExisted(data.getConfigVersion()))
                ));

                if (normalMapId != null) {
                    layoutContent.addItem(this._groupMapView, false);

                    this._zoomMap.showMapByMapData({
                        mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                        gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                        overridingPlayers   : null,
                    });
                }
            }
        }

        {
            const data = mailContainer.getMailMcrInvite();
            if (data) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0152,
                    data.getRoomId() ?? 0,
                    await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError,
                    LangUtils.getText(data.getHasFog() ? LangConstants.TextType.Yes : LangConstants.TextType.No),
                    await UsersModel.getUserNickname(data.getInviterUserId() ?? 0) ?? LangConstants.UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailCcrInvite();
            if (data) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0153,
                    data.getRoomId() ?? 0,
                    await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError,
                    LangUtils.getText(data.getHasFog() ? LangConstants.TextType.Yes : LangConstants.TextType.No),
                    await UsersModel.getUserNickname(data.getInviterUserId() ?? 0) ?? LangConstants.UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailMfrInvite();
            if (mailContainer.getMailMfrInvite()) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0154,
                    data?.getRoomId() ?? 0,
                    LangUtils.getText(data?.getHasFog() ? LangConstants.TextType.Yes : LangConstants.TextType.No),
                    await UsersModel.getUserNickname(data?.getInviterUserId() ?? 0) ?? LangConstants.UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailAcceptMap();
            if (data) {
                const normalMapId = data.getNormalMapId() ?? 0;
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0156,
                    normalMapId,
                    (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? LangConstants.UndefinedError,
                    (await UsersModel.getUserNickname(data.getReviewerUserId() ?? 0)) ?? LangConstants.UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailAutoTourneyWinners();
            if (data) {
                const tourneyId = data.getTourneyId() ?? 0;
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0163,
                    tourneyId,
                ));
            }
        }

        {
            const data = mailContainer.getMailSrwValidationResult();
            if (data) {
                const normalMapId       = data.getNormalMapId() ?? 0;
                const templateWarRuleId = data.getTemplateWarRuleId();
                const mapRawData        = await NormalMapModelNormalMapModel.getRawData(normalMapId);
                const mapNameArray      = mapRawData?.getMapNameArray();
                const ruleNameArray     = mapRawData?.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) == templateWarRuleId)?.getRuleNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(LangUtils.getFormattedText(
                        LangConstants.TextType.F0194,
                        `#${normalMapId} ${LangUtils.getLanguageText({ textArray: mapNameArray })}`,
                        `#${templateWarRuleId} ${LangUtils.getLanguageText({ textArray: ruleNameArray })}`,
                        `${data.getScore() ?? 0}`
                    ));
                } else {
                    labelContent.setText(LangUtils.getFormattedText(
                        LangConstants.TextType.F0195,
                        `#${normalMapId} ${LangUtils.getLanguageText({ textArray: mapNameArray })}`,
                        `#${templateWarRuleId} ${LangUtils.getLanguageText({ textArray: ruleNameArray })}`,
                        `${data.getErrorCode() ?? 0}`
                    ));
                }
            }
        }

        {
            const data = mailContainer.getMailCawValidationResult();
            if (data) {
                const campaignId        = data.getCampaignId() ?? 0;
                const campaignMapId     = data.getCampaignMapId() ?? 0;
                const campaignNameArray = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getNameArray();
                const mapNameArray      = (await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(LangUtils.getFormattedText(
                        LangConstants.TextType.F0196,
                        `#${campaignId} ${LangUtils.getLanguageText({ textArray: campaignNameArray })}`,
                        `#${campaignMapId} ${LangUtils.getLanguageText({ textArray: mapNameArray })}`,
                        `${data.getScore() ?? 0}`
                    ));
                } else {
                    labelContent.setText(LangUtils.getFormattedText(
                        LangConstants.TextType.F0197,
                        `#${campaignId} ${LangUtils.getLanguageText({ textArray: campaignNameArray })}`,
                        `#${campaignMapId} ${LangUtils.getLanguageText({ textArray: mapNameArray })}`,
                        `${data.getErrorCode() ?? 0}`
                    ));
                }
            }
        }

        {
            const data = mailContainer.getMailAcceptSpectate();
            if (data) {
                const warId         = data.getWarId() ?? 0;
                const targetUserId  = data.getSpectateTargetUserId() ?? 0;
                const warData       = await WatchWarModelWwModel.getWatchWarData(warId);
                const mapId         = warData == null ? null : HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
                if (warData != null) {
                    layoutButtons.addItem(btnSpectate, false);
                }
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0210,
                    warId,
                    warData == null ? `----` : (LangUtils.getWarTypeName(HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(warData)) ?? LangConstants.UndefinedError),
                    mapId ?? `----`,
                    mapId == null ? `----` : ((await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(mapId)) ?? LangConstants.UndefinedError),
                    targetUserId,
                    (await UsersModel.getUserNickname(targetUserId)) ?? LangConstants.UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailMrwBoot();
            if (data) {
                labelContent.setText(LangUtils.getFormattedText(
                    LangConstants.TextType.F0214,
                    data.getWarId() ?? 0
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

interface DataForMailRenderer extends UiTypesUiListItemData.UiListItemData {
    mailId  : number;
    panel   : Panel;
}
class MailRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMailRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMailRenderer>
{
    private readonly _layoutContent!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgRed!           : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.MsgMailSetIsNew,     callback: this._onNotifyMsgMailSetIsNew },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateImgRed();

        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData          = MailModelMailModel.getMail(mailId);
        const labelName         = this._labelName;
        const labelTimestamp    = this._labelTimestamp;
        if (mailData == null) {
            labelTimestamp.setText(`????`);
            labelName.setText(LangConstants.UndefinedError);
            return;
        }

        const timestamp = mailData.getCreateTimestamp();
        labelTimestamp.setText(`${LangUtils.getTimestampShortText(timestamp, { hour: false, minute: false, second: false })} ${LangUtils.getTimestampShortText(timestamp, { year: false, month: false, date: false })}`);

        const mailContainer = mailData.getMailContainer();
        if (mailContainer == null) {
            labelName.setText(LangConstants.UndefinedError);
        } else if (mailContainer.getMailEndWarNotification()) {
            labelName.setLangText(LangConstants.TextType.B0087);
        } else if (mailContainer.getMailCcrInvite()) {
            labelName.setLangText(LangConstants.TextType.B1003);
        } else if (mailContainer.getMailMcrInvite()) {
            labelName.setLangText(LangConstants.TextType.B1003);
        } else if (mailContainer.getMailMfrInvite()) {
            labelName.setLangText(LangConstants.TextType.B1003);
        } else if (mailContainer.getMailAcceptMap()) {
            labelName.setLangText(LangConstants.TextType.B1004);
        } else if (mailContainer.getMailAutoTourneyWinners()) {
            labelName.setLangText(LangConstants.TextType.B1022);
        } else if (mailContainer.getMailSrwValidationResult()) {
            labelName.setLangText(LangConstants.TextType.B1141);
        } else if (mailContainer.getMailCawValidationResult()) {
            labelName.setLangText(LangConstants.TextType.B0119);
        } else if (mailContainer.getMailAcceptSpectate()) {
            labelName.setLangText(LangConstants.TextType.B1354);
        } else if (mailContainer.getMailMrwBoot()) {
            labelName.setLangText(LangConstants.TextType.B1364);
        } else {
            labelName.setText(LangConstants.UndefinedError);
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

    private _onNotifyMsgMailSetIsNew(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS.S;
        if (data.getMailId() === this.getOpenData()?.mailId) {
            this._updateImgRed();
        }
    }

    private _updateImgRed(): void {
        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData  = MailModelMailModel.getMail(mailId);
        const imgRed    = this._imgRed;
        if (mailData == null) {
            imgRed.setIsVisible(false);
        } else {
            imgRed.setIsVisible(mailData.getIsNew());
        }

    }
}

async function generatePlayerInfoText(playerInfoArray: ProtoSchemaCommonProtoMailMailEndWarNotificationPlayerInfo.PlayerInfo[], isDraw: boolean, configVersion: string): Promise<string> {
    if (playerInfoArray.length <= 0) {
        return `----`;
    }

    const textArray     : string[] = [];
    const gameConfig    = await GameConfigGcModel.getGameConfig(configVersion);
    let playerIndex     = 1;
    for (const playerInfo of playerInfoArray) {
        const userId            = playerInfo.getUserId();
        const nickname          = (userId == null ? LangUtils.getText(LangConstants.TextType.B0607) : await UsersModel.getUserNickname(userId)) ?? LangConstants.UndefinedError;
        const coName            = gameConfig.getCoBasicCfg(playerInfo.getCoId() ?? 0)?.getName() ?? LangConstants.UndefinedError;
        const textForAliveState = playerInfo.getIsAlive()
            ? LangUtils.getText(isDraw ? LangConstants.TextType.B0552 : LangConstants.TextType.B0550)
            : LangUtils.getText(LangConstants.TextType.B0551);
        textArray.push(`P${playerIndex++}. ${nickname} (${coName}, ${textForAliveState})`);
    }
    return textArray.join(`\n`);
}
