import type { PlayerInfo2 } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getCampaignInfo, getCampaignMapRawData } from "../../campaigns/mains/Provider.ts";
import { reqCcrJoinRoom } from "../../coopCustomRoom/model/CcrProxy.ts";
import { CoId } from "../../cos/Constants.ts";
import { showLang, show } from "../../FloatText.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import { getGameConfig, getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import {
    gotoReplayWar,
    gotoMultiPlayerWar,
    gotoCcrRoomInfoPanel,
    gotoMcrRoomInfoPanel,
    gotoMfrRoomInfoPanel,
} from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getNormalMapId, getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getWarTypeName, getLanguageText, getTimestampShortText } from "../../lang/Utils.ts";
import { getMail, getAllMailDataArray } from "../model/MailModel.ts";
import { reqMailSetIsNew, reqMailDeleteMail } from "../model/MailProxy.ts";
import { reqMcrJoinRoom } from "../../multiCustomRoom/model/McrProxy.ts";
import { reqMfrJoinRoom } from "../../multiFreeRoom/model/MfrProxy.ts";
import { getRawData, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { PlayerInfo } from "../../proto/schema/CommonProto/Mail/MailEndWarNotification/PlayerInfo.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS } from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
import { getReplayData } from "../../replayWar/model/RwModel.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiZoomableMap } from "../../ui/interfaces/IUiZoomableMap.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUserNickname } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { getWatchWarData } from "../../watchWar/model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _group!            : IUiContainer;

    private readonly _listMail!         : IUiScrollList<DataForMailRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    private readonly _groupDetail!      : IUiContainer;
    private readonly _scrContent!       : IUiScroller<IUiContainer>;
    private readonly _layoutContent!    : IUiLayout;
    private readonly _labelContent!     : IUiLabel;
    private readonly _groupMapView!     : IUiContainer;
    private readonly _zoomMap!          : IUiZoomableMap;

    private readonly _layoutButtons!    : IUiLayout;
    private readonly _btnReplay!        : IUiButton;
    private readonly _btnJoinRoom!      : IUiButton;
    private readonly _btnSpectate!      : IUiButton;
    private readonly _btnInviter!       : IUiButton;
    private readonly _btnPlayers!       : IUiButton;

    private readonly _btnDelete!        : IUiButton;

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
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMailGetAllMailArray,  callback: this._onNotifyMsgMailGetAllMailArray },
            { type: TypeId.MsgMailGetMail,          callback: this._onNotifyMsgMailGetMail },
            { type: TypeId.MsgMailDeleteMail,       callback: this._onNotifyMsgMailDeleteMail },
            { type: TypeId.MsgCcrJoinRoom,          callback: this._onNotifyMsgCcrJoinRoom },
            { type: TypeId.MsgMcrJoinRoom,          callback: this._onNotifyMsgMcrJoinRoom },
            { type: TypeId.MsgMfrJoinRoom,          callback: this._onNotifyMsgMfrJoinRoom },
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
        const newIndex  = getExisted(listMail.getRevisedFirstIndex(v => v?.mailId === newMailId));
        listMail.setSelectedItemIndex(newIndex);
        this._updateComponentsForMailMainData();

        if (needScroll) {
            listMail.scrollToItem(newIndex);
        }

        {
            const mailId    = this._getSelectedMailId();
            const mailData  = mailId == null ? null : getMail(mailId);
            if (mailData?.getIsNew()) {
                reqMailSetIsNew(mailData.getMailId(), false);
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
        const replayId  = (mailId == null ? null : getMail(mailId))?.getMailContainer().getMailEndWarNotification()?.getReplayId();
        if (replayId != null) {
            openPanel(getDict().CommonBlockPanel, {
                title   : getText(TextType.B0088),
                content : getText(TextType.A0040),
            });

            const data = await getReplayData(replayId);
            if (data) {
                gotoReplayWar(data, replayId);
            } else {
                closePanel(getDict().CommonBlockPanel);
            }
        }
    }

    private _onTouchedBtnJoinRoom(): void {
        const mailId        = this._listMail.getFirstSelectedData()?.mailId;
        const mailContainer = (mailId == null ? null : getMail(mailId))?.getMailContainer();
        if (mailContainer?.getMailMcrInvite()) {
            reqMcrJoinRoom(mailContainer.getMailMcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailCcrInvite()) {
            reqCcrJoinRoom(mailContainer.getMailCcrInvite()?.getRoomId() ?? 0);
        } else if (mailContainer?.getMailMfrInvite()) {
            reqMfrJoinRoom(mailContainer.getMailMfrInvite()?.getRoomId() ?? 0);
        }
    }

    private async _onTouchedBtnSpectate(): Promise<void> {
        const mailId    = this._listMail.getFirstSelectedData()?.mailId;
        const warId     = (mailId == null ? null : getMail(mailId))?.getMailContainer().getMailAcceptSpectate()?.getWarId();
        if (warId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonBlockPanel, {
                title   : getText(TextType.B0088),
                content : getText(TextType.A0040),
            });

            const warData = await getWatchWarData(warId);
            if (warData) {
                gotoMultiPlayerWar(warData);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

            closePanel(getDict().CommonBlockPanel);
        }
    }

    private _onTouchedBtnDelete(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId != null) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
                callback    : () => reqMailDeleteMail(mailId),
            });
        }
    }

    private _onTouchedBtnInviter(): void {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailContainer = getMail(mailId)?.getMailContainer();
        if (mailContainer == null) {
            return;
        }

        const userId = (mailContainer.getMailCcrInvite() ?? mailContainer.getMailMcrInvite() ?? mailContainer.getMailMfrInvite())?.getInviterUserId();
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
        }
    }

    private async _onTouchedBtnPlayers(): Promise<void> {
        const mailId = this._listMail.getFirstSelectedData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData = getMail(mailId)?.getMailContainer().getMailEndWarNotification();
        if (mailData == null) {
            return;
        }

        const rawPlayerInfoArray = mailData.getPlayerInfoArray();
        if (rawPlayerInfoArray == null) {
            return;
        }

        const configVersion = mailData.getConfigVersion();
        const gameConfig    = configVersion == null ? null : await getGameConfig(configVersion);
        if (gameConfig == null) {
            return;
        }

        const playerInfoArray: PlayerInfo2[] = [];
        for (let i = 0; i < rawPlayerInfoArray.length; ++i) {
            const playerIndex   = i + 1;
            const rawPlayerInfo = rawPlayerInfoArray[i];
            playerInfoArray.push({
                userId      : rawPlayerInfo.getUserId(),
                isAlive     : !!rawPlayerInfo.getIsAlive(),
                playerIndex : playerIndex,
                skinId      : rawPlayerInfo.getSkinId() ?? getDefaultSkinId(playerIndex),
                coId        : rawPlayerInfo.getCoId() ?? CoId.Empty,
                teamIndex   : rawPlayerInfo.getTeamIndex(),
            });
        }
        openPanel(getDict().CommonShowPlayerListPanel, {
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

        const normalMapId = getMail(mailId)?.getMailContainer().getMailEndWarNotification()?.getNormalMapId();
        if (normalMapId != null) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            openPanel(getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig          : await getLatestGameConfig(),
                    mapRawData          : getExisted(await getRawData(normalMapId)),
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

    private _onNotifyMsgCcrJoinRoom(e: Event): void {
        const data      = e.data as S;
        const roomId    = getExisted(data.getRoomId());
        gotoCcrRoomInfoPanel(roomId);
        show(getFormattedText(TextType.F0069, roomId));
    }
    private _onNotifyMsgMcrJoinRoom(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS;
        const roomId    = getExisted(data.getRoomId());
        gotoMcrRoomInfoPanel(roomId);
        show(getFormattedText(TextType.F0069, roomId));
    }
    private _onNotifyMsgMfrJoinRoom(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS;
        const roomId    = getExisted(data.getRoomId());
        gotoMfrRoomInfoPanel(roomId);
        show(getFormattedText(TextType.F0069, roomId));
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
        this._labelTitle.setLangText(TextType.B1276);
        this._labelNoData.setLangText(TextType.B0278);
        this._btnDelete.setLangText(TextType.B0220);
        this._btnReplay.setLangText(TextType.B0710);
        this._btnJoinRoom.setLangText(TextType.B0583);
        this._btnSpectate.setLangText(TextType.B0872);
        this._btnInviter.setLangText(TextType.B1398);
        this._btnPlayers.setLangText(TextType.Players);

        this._updateComponentsForMailMainData();
    }

    private _createDataForListMail(): DataForMailRenderer[] {
        const dataArray: DataForMailRenderer[] = [];
        for (const mailData of getAllMailDataArray()) {
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

        const mailData = getMail(mailId);
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
                labelContent.setText(getFormattedText(
                    TextType.F0151,
                    getWarTypeName(data.getWarType() ?? 0),
                    (normalMapId != null) ? (await getMapNameInCurrentLanguage(normalMapId) ?? UndefinedError) : `----`,
                    (replayId != null) ? replayId : `----`,
                    await generatePlayerInfoText(data.getPlayerInfoArray(), !!data.getIsDraw(), getExisted(data.getConfigVersion()))
                ));

                if (normalMapId != null) {
                    layoutContent.addItem(this._groupMapView, false);

                    this._zoomMap.showMapByMapData({
                        mapRawData          : getExisted(await getRawData(normalMapId)),
                        gameConfig          : await getLatestGameConfig(),
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
                labelContent.setText(getFormattedText(
                    TextType.F0152,
                    data.getRoomId() ?? 0,
                    await getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? UndefinedError,
                    getText(data.getHasFog() ? TextType.Yes : TextType.No),
                    await getUserNickname(data.getInviterUserId() ?? 0) ?? UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailCcrInvite();
            if (data) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(getFormattedText(
                    TextType.F0153,
                    data.getRoomId() ?? 0,
                    await getMapNameInCurrentLanguage(data.getNormalMapId() ?? 0) ?? UndefinedError,
                    getText(data.getHasFog() ? TextType.Yes : TextType.No),
                    await getUserNickname(data.getInviterUserId() ?? 0) ?? UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailMfrInvite();
            if (mailContainer.getMailMfrInvite()) {
                layoutButtons.addItem(btnJoinRoom, false);
                layoutButtons.addItem(btnInviter, false);
                labelContent.setText(getFormattedText(
                    TextType.F0154,
                    data?.getRoomId() ?? 0,
                    getText(data?.getHasFog() ? TextType.Yes : TextType.No),
                    await getUserNickname(data?.getInviterUserId() ?? 0) ?? UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailAcceptMap();
            if (data) {
                const normalMapId = data.getNormalMapId() ?? 0;
                labelContent.setText(getFormattedText(
                    TextType.F0156,
                    normalMapId,
                    (await getMapNameInCurrentLanguage(normalMapId)) ?? UndefinedError,
                    (await getUserNickname(data.getReviewerUserId() ?? 0)) ?? UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailAutoTourneyWinners();
            if (data) {
                const tourneyId = data.getTourneyId() ?? 0;
                labelContent.setText(getFormattedText(
                    TextType.F0163,
                    tourneyId,
                ));
            }
        }

        {
            const data = mailContainer.getMailSrwValidationResult();
            if (data) {
                const normalMapId       = data.getNormalMapId() ?? 0;
                const templateWarRuleId = data.getTemplateWarRuleId();
                const mapRawData        = await getRawData(normalMapId);
                const mapNameArray      = mapRawData?.getMapNameArray();
                const ruleNameArray     = mapRawData?.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) == templateWarRuleId)?.getRuleNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(getFormattedText(
                        TextType.F0194,
                        `#${normalMapId} ${getLanguageText({ textArray: mapNameArray })}`,
                        `#${templateWarRuleId} ${getLanguageText({ textArray: ruleNameArray })}`,
                        `${data.getScore() ?? 0}`
                    ));
                } else {
                    labelContent.setText(getFormattedText(
                        TextType.F0195,
                        `#${normalMapId} ${getLanguageText({ textArray: mapNameArray })}`,
                        `#${templateWarRuleId} ${getLanguageText({ textArray: ruleNameArray })}`,
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
                const campaignNameArray = (await getCampaignInfo(campaignId))?.getNameArray();
                const mapNameArray      = (await getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
                if (data.getIsValid()) {
                    labelContent.setText(getFormattedText(
                        TextType.F0196,
                        `#${campaignId} ${getLanguageText({ textArray: campaignNameArray })}`,
                        `#${campaignMapId} ${getLanguageText({ textArray: mapNameArray })}`,
                        `${data.getScore() ?? 0}`
                    ));
                } else {
                    labelContent.setText(getFormattedText(
                        TextType.F0197,
                        `#${campaignId} ${getLanguageText({ textArray: campaignNameArray })}`,
                        `#${campaignMapId} ${getLanguageText({ textArray: mapNameArray })}`,
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
                const warData       = await getWatchWarData(warId);
                const mapId         = warData == null ? null : getNormalMapId(warData);
                if (warData != null) {
                    layoutButtons.addItem(btnSpectate, false);
                }
                labelContent.setText(getFormattedText(
                    TextType.F0210,
                    warId,
                    warData == null ? `----` : (getWarTypeName(getWarTypeId(warData)) ?? UndefinedError),
                    mapId ?? `----`,
                    mapId == null ? `----` : ((await getMapNameInCurrentLanguage(mapId)) ?? UndefinedError),
                    targetUserId,
                    (await getUserNickname(targetUserId)) ?? UndefinedError
                ));
            }
        }

        {
            const data = mailContainer.getMailMrwBoot();
            if (data) {
                labelContent.setText(getFormattedText(
                    TextType.F0214,
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

interface DataForMailRenderer extends UiListItemData {
    mailId  : number;
    panel   : Panel;
}
class MailRenderer
    extends     UiListItemRenderer<DataForMailRenderer>
    implements  IUiListItemRenderer<DataForMailRenderer>
{
    private readonly _layoutContent!    : IUiLayout;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelName!        : IUiLabel;
    private readonly _imgRed!           : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.MsgMailSetIsNew,     callback: this._onNotifyMsgMailSetIsNew },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateImgRed();

        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData          = getMail(mailId);
        const labelName         = this._labelName;
        const labelTimestamp    = this._labelTimestamp;
        if (mailData == null) {
            labelTimestamp.setText(`????`);
            labelName.setText(UndefinedError);
            return;
        }

        const timestamp = mailData.getCreateTimestamp();
        labelTimestamp.setText(`${getTimestampShortText(timestamp, { hour: false, minute: false, second: false })} ${getTimestampShortText(timestamp, { year: false, month: false, date: false })}`);

        const mailContainer = mailData.getMailContainer();
        if (mailContainer == null) {
            labelName.setText(UndefinedError);
        } else if (mailContainer.getMailEndWarNotification()) {
            labelName.setLangText(TextType.B0087);
        } else if (mailContainer.getMailCcrInvite()) {
            labelName.setLangText(TextType.B1003);
        } else if (mailContainer.getMailMcrInvite()) {
            labelName.setLangText(TextType.B1003);
        } else if (mailContainer.getMailMfrInvite()) {
            labelName.setLangText(TextType.B1003);
        } else if (mailContainer.getMailAcceptMap()) {
            labelName.setLangText(TextType.B1004);
        } else if (mailContainer.getMailAutoTourneyWinners()) {
            labelName.setLangText(TextType.B1022);
        } else if (mailContainer.getMailSrwValidationResult()) {
            labelName.setLangText(TextType.B1141);
        } else if (mailContainer.getMailCawValidationResult()) {
            labelName.setLangText(TextType.B0119);
        } else if (mailContainer.getMailAcceptSpectate()) {
            labelName.setLangText(TextType.B1354);
        } else if (mailContainer.getMailMrwBoot()) {
            labelName.setLangText(TextType.B1364);
        } else {
            labelName.setText(UndefinedError);
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

    private _onNotifyMsgMailSetIsNew(e: Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS;
        if (data.getMailId() === this.getOpenData()?.mailId) {
            this._updateImgRed();
        }
    }

    private _updateImgRed(): void {
        const mailId = this.getOpenData()?.mailId;
        if (mailId == null) {
            return;
        }

        const mailData  = getMail(mailId);
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
    const gameConfig    = await getGameConfig(configVersion);
    let playerIndex     = 1;
    for (const playerInfo of playerInfoArray) {
        const userId            = playerInfo.getUserId();
        const nickname          = (userId == null ? getText(TextType.B0607) : await getUserNickname(userId)) ?? UndefinedError;
        const coName            = gameConfig.getCoBasicCfg(playerInfo.getCoId() ?? 0)?.getName() ?? UndefinedError;
        const textForAliveState = playerInfo.getIsAlive()
            ? getText(isDraw ? TextType.B0552 : TextType.B0550)
            : getText(TextType.B0551);
        textArray.push(`P${playerIndex++}. ${nickname} (${coName}, ${textForAliveState})`);
    }
    return textArray.join(`\n`);
}
