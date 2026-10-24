import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameConfigGcModel from "../../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoAutoTourneySingleBracketInfo from "../../../proto/schema/CommonProto/AutoTourney/SingleBracketInfo.ts";
import * as ReplayWarModelRwModel from "../../../replayWar/model/RwModel.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../../users/Model.ts";
import * as WatchWarModelWwModel from "../../../watchWar/model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSettings!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelInfoTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTourneyIdTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTourneyId!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPreviousTourney!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextTourney!           : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPhaseTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutPhase!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPhase!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPhaseCountdown!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labeBracketRoundTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelBracketRound!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPreviousBracket!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextBracket!           : UiInterfacesIUiButton.IUiButton;

    private readonly _groupMapName!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapNameTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelBracketTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listBracket!              : UiInterfacesIUiScrollList.IUiScrollList<DataForBracketRenderer>;
    private readonly _labelNoData!              : UiInterfacesIUiLabel.IUiLabel;

    private _tourneyId      = 1;
    private _bracketRoundId = 1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TimeTick,                callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtSetName,            callback: this._onNotifyMsgAtSetName },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchMakeRequest,  callback: this._onNotifyMsgMpwWatchMakeRequest },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnSettings,            callback: this._onTouchedBtnSettings },
            { ui: this._btnNextTourney,         callback: this._onTouchedBtnNextTourney },
            { ui: this._btnPreviousTourney,     callback: this._onTouchedBtnPreviousTourney },
            { ui: this._btnNextBracket,         callback: this._onTouchedBtnNextBracket },
            { ui: this._btnPreviousBracket,     callback: this._onTouchedBtnPreviousBracket },
            { ui: this._groupMapName,           callback: this._onTouchedGroupMapName },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBracket.setItemRendererClass(BracketRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._tourneyId         = HelpersMisc.getExisted(await AutoTourneysMainsProvider.getLastTourneyId());
        this._bracketRoundId    = 1;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listBracket.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnPreviousTourney(): Promise<void> {
        const tourneyIdArray    = await AutoTourneysMainsProvider.getAllTourneyIdArray();
        const tourneyId         = this._tourneyId - 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            FloatText2.showLang(LangConstants.TextType.B0278);
        }
    }
    private _onTouchedBtnSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().AtTourneySettingsPanel, { tourneyId: this._tourneyId });
    }
    private async _onTouchedBtnNextTourney(): Promise<void> {
        const tourneyIdArray    = await AutoTourneysMainsProvider.getAllTourneyIdArray();
        const tourneyId         = this._tourneyId + 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            FloatText2.showLang(LangConstants.TextType.B0278);
        }
    }
    private async _onTouchedBtnPreviousBracket(): Promise<void> {
        const bracketInfoArray  = (await AutoTourneysMainsProvider.getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId - 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId() ?? 0) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            FloatText2.showLang(LangConstants.TextType.B0278);
        }
    }
    private async _onTouchedGroupMapName(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }
        if (AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) === AutoTourneysConstants.PhaseId.Registration) {
            return;
        }

        const mapInfoArray  = (await AutoTourneysMainsProvider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        const mapRawData    = await NormalMapModelNormalMapModel.getRawData(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId() ?? 0);
        if (mapRawData != null) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
        }
    }
    private async _onTouchedBtnNextBracket(): Promise<void> {
        const bracketInfoArray  = (await AutoTourneysMainsProvider.getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId + 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId() ?? 0) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            FloatText2.showLang(LangConstants.TextType.B0278);
        }
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelPhaseCountdown();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetName(): void {
        this._updateLabelTourneyId();
    }

    private _onNotifyMsgMpwWatchMakeRequest(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        this._btnSettings.setIsVisible(UsersModel.getIsSelfAutoTourneyCommittee());
        this._updateLabelTourneyId();
        this._updateLabelBracketRound();
        this._updateLabelPhase();
        this._updateLabelPhaseCountdown();
        this._updateLabelMapName();

        const dataArray     = await this._createDataForListBracket();
        const listBracket   = this._listBracket;
        const labelNoData   = this._labelNoData;
        if (dataArray.length <= 0) {
            await listBracket.removeAllItems();
            labelNoData.setIsVisible(true);
        } else {
            await listBracket.bindData(dataArray, true);
            labelNoData.setIsVisible(false);
        }

        const bracketInfoArray = (await AutoTourneysMainsProvider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        this._btnNextBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId() ?? 0) === bracketRoundId + 1));
        this._btnPreviousBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId() ?? 0) === bracketRoundId - 1));

        const allTourneyIdArray = await AutoTourneysMainsProvider.getAllTourneyIdArray();
        this._btnPreviousTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId - 1) >= 0);
        this._btnNextTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId + 1) >= 0);
    }

    private async _createDataForListBracket(): Promise<DataForBracketRenderer[]> {
        const dataArray                 : DataForBracketRenderer[] = [];
        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        const bracketInfoArray          = (await AutoTourneysMainsProvider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        const firstRoundBracketsCount   = bracketInfoArray.filter(v => v.getBracketRoundId() == 1).length;
        const maxBracketRound           = firstRoundBracketsCount > 0 ? Math.log2(firstRoundBracketsCount) + 1 : -1;
        let index                       = 0;
        for (const bracketInfo of bracketInfoArray.filter(v => v.getBracketRoundId() === bracketRoundId).sort((v1, v2) => (v1.getBracketGameId() ?? 0) - (v2.getBracketGameId() ?? 0))) {
            dataArray.push({
                index           : index++,
                bracketInfo     : bracketInfo,
                maxBracketRound : maxBracketRound,
                tourneyId       : tourneyId,
            });
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1022);
        this._labelNoData.setLangText(LangConstants.TextType.B1042);
        this._labelTourneyIdTitle.setLangText(LangConstants.TextType.B1026);
        this._labelPhaseTitle.setLangText(LangConstants.TextType.B0367);
        this._labeBracketRoundTitle.setLangText(LangConstants.TextType.B1033);
        this._labelMapNameTitle.setLangText(LangConstants.TextType.B0225);
        this._labelInfoTitle.setLangText(LangConstants.TextType.B0423);
        this._labelBracketTitle.setLangText(LangConstants.TextType.B1293);

        this._updateLabelTourneyId();
        this._updateLabelMapName();
        this._updateLabelPhase();
    }

    private async _updateLabelBracketRound(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        const label         = this._labelBracketRound;
        if (tourneyInfo == null) {
            label.setText(LangConstants.UndefinedError);
            return;
        }
        if (AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) === AutoTourneysConstants.PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        label.setText(`${this._bracketRoundId}`);
    }
    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId             = this._tourneyId;
        const tourneyName           = LangUtils.getLanguageText({ textArray: (await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId))?.getNameArray() });
        this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
    }
    private async _updateLabelMapName(): Promise<void> {
        const label = this._labelMapName;
        label.setText(``);

        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            label.setText(LangConstants.UndefinedError);
            return;
        }
        if (AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) === AutoTourneysConstants.PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        const mapInfoArray  = (await AutoTourneysMainsProvider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        label.setText(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId() ?? 0) ?? LangConstants.UndefinedError);
    }
    private async _updateLabelPhase(): Promise<void> {
        const info  = (await AutoTourneysMainsProvider.getAtTourneyInfo(this._tourneyId));
        const label = this._labelPhase;
        if (info == null) {
            label.setText(LangConstants.UndefinedError);
        } else {
            label.setText(LangUtils.getAutoTourneyPhaseName(AutoTourneysMainsProvider.getTourneyInfoPhase(info)) ?? LangConstants.UndefinedError);
        }
        this._layoutPhase.arrangeItems();
    }
    private async _updateLabelPhaseCountdown(): Promise<void> {
        const info      = await AutoTourneysMainsProvider.getAtTourneyInfo(this._tourneyId);
        const label     = this._labelPhaseCountdown;
        const layout    = this._layoutPhase;
        if (info == null) {
            label.setText(``);
            layout.arrangeItems();
            return;
        }

        const phase = AutoTourneysMainsProvider.getTourneyInfoPhase(info);
        if (phase === AutoTourneysConstants.PhaseId.Registration) {
            label.setText(`  (${LangUtils.getTimeDurationText2((info.getRegistrationDuration() ?? 0) + (info.getRegistrationTimestamp() ?? 0) - TimerTimerModel.getServerTimestamp())})`);

        } else if (phase === AutoTourneysConstants.PhaseId.Adjustment) {
            label.setText(`  (${LangUtils.getTimeDurationText2((info.getAdjustmentDuration() ?? 0) + (info.getAdjustmentTimestamp() ?? 0) - TimerTimerModel.getServerTimestamp())})`);

        } else {
            label.setText(``);
        }

        layout.arrangeItems();
    }
}

interface DataForBracketRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    bracketInfo     : ProtoSchemaCommonProtoAutoTourneySingleBracketInfo.SingleBracketInfo;
    maxBracketRound : number;
    tourneyId       : number;
}
class BracketRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!                : UiInterfacesIUiImage.IUiImage;
    private readonly _labelGameId!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupName1!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal1!            : UiInterfacesIUiImage.IUiImage;

    private readonly _groupName2!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal2!            : UiInterfacesIUiImage.IUiImage;

    private readonly _btnReplay!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSpectateRequest!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSpectateContinue!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupName1,                 callback: this._onTouchedGroupName1 },
            { ui: this._groupName2,                 callback: this._onTouchedGroupName2 },
            { ui: this._btnReplay,                  callback: this._onTouchedBtnReplay },
            { ui: this._btnSpectateRequest,         callback: this._onTouchedBtnSpectate },
            { ui: this._btnSpectateContinue,        callback: this._onTouchedBtnSpectate },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateOnOpenDataChanged();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const bracketInfo = openData.bracketInfo;
        this._imgBg.setIsVisible(openData.index % 2 === 0);
        this._labelGameId.setText(`#${bracketInfo.getBracketGameId()}`);
        this._btnReplay.setIsVisible(bracketInfo.getReplayId() != null);
        this._updateBtnSpectate();

        const userIdArray   = bracketInfo.getUserIdArray() ?? [];
        const userId1       = userIdArray[0];
        const userId2       = userIdArray[1];
        const winnerUserId  = bracketInfo.getWinnerUserId() ?? null;
        await Promise.all([
            this._updateLabelName(this._labelName1, userId1, winnerUserId),
            this._updateLabelName(this._labelName2, userId2, winnerUserId),
            this._updateImgMedal(this._imgMedal1, userId1),
            this._updateImgMedal(this._imgMedal2, userId2),
        ]);
        this._groupName1.arrangeItems();
        this._groupName2.arrangeItems();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedGroupName1(): void {
        const userId = (this.getOpenData()?.bracketInfo.getUserIdArray() ?? [])[0];
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupName2(): void {
        const userId = (this.getOpenData()?.bracketInfo.getUserIdArray() ?? [])[1];
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedBtnReplay(): void {
        const replayId = this.getOpenData()?.bracketInfo.getReplayId();
        if (replayId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0406),
                callback: async () => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                        title   : LangUtils.getText(LangConstants.TextType.B0088),
                        content : LangUtils.getText(LangConstants.TextType.A0040),
                    });

                    const data = await ReplayWarModelRwModel.getReplayData(replayId);
                    if (data) {
                        HelpersGameFlow.gotoReplayWar(data, HelpersMisc.getExisted(replayId));
                    } else {
                        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
                    }
                },
            });
        }
    }
    private async _onTouchedBtnSpectate(): Promise<void> {
        const warId = this.getOpenData()?.bracketInfo.getWarId();
        if (warId == null) {
            FloatText2.showLang(LangConstants.TextType.A0297);
            return;
        }

        const watchOutgoingInfo = await WatchWarModelWwModel.getWatchOutgoingInfo(warId);
        if (watchOutgoingInfo == null) {
            FloatText2.showLang(LangConstants.TextType.A0297);
            return;
        }

        if (watchOutgoingInfo.getOngoingDstUserIdArray()?.length) {
            const warData = await WatchWarModelWwModel.getWatchWarData(warId);
            if (warData) {
                HelpersGameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestDetailPanel, {
                warId   : warId,
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnReplay.setText(LangUtils.getText(LangConstants.TextType.B0710));
        this._btnSpectateRequest.setText(LangUtils.getText(LangConstants.TextType.B0872));
    }

    private async _updateBtnSpectate(): Promise<void> {
        const btnRequest    = this._btnSpectateRequest;
        const btnContinue   = this._btnSpectateContinue;
        btnRequest.setIsVisible(false);
        btnContinue.setIsVisible(false);

        const bracketInfo = this.getOpenData()?.bracketInfo;
        if (bracketInfo == null) {
            return;
        }

        const warId = bracketInfo.getWarId();
        if ((warId != null) && (bracketInfo.getReplayId() == null)) {
            const watchOutgoingInfo = await WatchWarModelWwModel.getWatchOutgoingInfo(warId);
            if ((watchOutgoingInfo != null) && (warId === this.getOpenData()?.bracketInfo.getWarId())) {
                const canContinue   = !!watchOutgoingInfo.getOngoingDstUserIdArray().length;
                btnRequest.setIsVisible(!canContinue);
                btnContinue.setIsVisible(canContinue);
            }
        }
    }

    private async _updateLabelName(label: UiInterfacesIUiLabel.IUiLabel, userId: number | null, winnerUserId: number | null): Promise<void> {
        if (userId != null) {
            label.setText((await UsersModel.getUserNickname(userId)) || LangConstants.UndefinedError);
            label.setTextColor(userId === winnerUserId ? 0x44FF44 : 0xFFFFFF);
        } else {
            label.setText(winnerUserId == null ? `????` : `----`);
            label.setTextColor(0xFFFFFF);
        }
    }

    private async _updateImgMedal(img: UiInterfacesIUiImage.IUiImage, userId: number | null): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const bracketInfo = openData.bracketInfo;
        if (bracketInfo.getBracketRoundId() !== openData.maxBracketRound) {
            img.setIsVisible(false);
            return;
        }

        const winnerUserId = bracketInfo.getWinnerUserId();
        if (winnerUserId == null) {
            img.setIsVisible(false);
            return;
        }

        const tourneyId = openData.tourneyId;
        if (bracketInfo.getBracketGameId() == 1) {
            img.setIsVisible(true);
            if (userId === winnerUserId) {
                img.loadSource(HelpersImageSource.getMedal(tourneyId * 3 + 1));
            } else {
                img.loadSource(HelpersImageSource.getMedal(tourneyId * 3 + 2));
            }
        } else {
            if (userId === winnerUserId) {
                img.setIsVisible(true);
                img.loadSource(HelpersImageSource.getMedal(tourneyId * 3 + 3));
            } else {
                img.setIsVisible(false);
            }
        }
    }
}
