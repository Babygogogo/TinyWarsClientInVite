import {
    GamePanels_Manager,
    AutoTourneys_Mains_Provider,
    Lang_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    Helpers_ImageSource,
    ReplayWar_Model_RwModel,
    Timer_TimerModel,
    WatchWar_Model_WwModel,
    Helpers_GameFlow,
    AutoTourneys_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";
import type { SingleBracketInfo } from "../../../proto/schema/CommonProto/AutoTourney/SingleBracketInfo.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSettings!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelInfoTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTourneyIdTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTourneyId!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPreviousTourney!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextTourney!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPhaseTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutPhase!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPhase!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPhaseCountdown!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labeBracketRoundTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelBracketRound!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPreviousBracket!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextBracket!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupMapName!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapNameTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelBracketTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listBracket!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForBracketRenderer>;
    private readonly _labelNoData!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private _tourneyId      = 1;
    private _bracketRoundId = 1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.TimeTick,                callback: this._onNotifyTimeTick },
            { type: Notifications_TypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgAtSetName,            callback: this._onNotifyMsgAtSetName },
            { type: Notifications_TypeId.TypeId.MsgMpwWatchMakeRequest,  callback: this._onNotifyMsgMpwWatchMakeRequest },
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
        this._tourneyId         = Helpers_Misc.getExisted(await AutoTourneys_Mains_Provider.getLastTourneyId());
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
        const tourneyIdArray    = await AutoTourneys_Mains_Provider.getAllTourneyIdArray();
        const tourneyId         = this._tourneyId - 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        }
    }
    private _onTouchedBtnSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtTourneySettingsPanel, { tourneyId: this._tourneyId });
    }
    private async _onTouchedBtnNextTourney(): Promise<void> {
        const tourneyIdArray    = await AutoTourneys_Mains_Provider.getAllTourneyIdArray();
        const tourneyId         = this._tourneyId + 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        }
    }
    private async _onTouchedBtnPreviousBracket(): Promise<void> {
        const bracketInfoArray  = (await AutoTourneys_Mains_Provider.getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId - 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId()) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        }
    }
    private async _onTouchedGroupMapName(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }
        if (AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) === AutoTourneys_Constants.PhaseId.Registration) {
            return;
        }

        const mapInfoArray  = (await AutoTourneys_Mains_Provider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId());
        if (mapRawData != null) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await GameConfigs_Provider.getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
        }
    }
    private async _onTouchedBtnNextBracket(): Promise<void> {
        const bracketInfoArray  = (await AutoTourneys_Mains_Provider.getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId + 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId()) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            FloatText.showLang(Lang_Constants.TextType.B0278);
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
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        this._btnSettings.setIsVisible(Users_Model.getIsSelfAutoTourneyCommittee());
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

        const bracketInfoArray = (await AutoTourneys_Mains_Provider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        this._btnNextBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId()) === bracketRoundId + 1));
        this._btnPreviousBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId()) === bracketRoundId - 1));

        const allTourneyIdArray = await AutoTourneys_Mains_Provider.getAllTourneyIdArray();
        this._btnPreviousTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId - 1) >= 0);
        this._btnNextTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId + 1) >= 0);
    }

    private async _createDataForListBracket(): Promise<DataForBracketRenderer[]> {
        const dataArray                 : DataForBracketRenderer[] = [];
        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        const bracketInfoArray          = (await AutoTourneys_Mains_Provider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        const firstRoundBracketsCount   = bracketInfoArray.filter(v => v.getBracketRoundId() == 1).length;
        const maxBracketRound           = firstRoundBracketsCount > 0 ? Math.log2(firstRoundBracketsCount) + 1 : -1;
        let index                       = 0;
        for (const bracketInfo of bracketInfoArray.filter(v => v.getBracketRoundId() === bracketRoundId).sort((v1, v2) => (v1.getBracketGameId()) - (v2.getBracketGameId()))) {
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1022);
        this._labelNoData.setLangText(Lang_Constants.TextType.B1042);
        this._labelTourneyIdTitle.setLangText(Lang_Constants.TextType.B1026);
        this._labelPhaseTitle.setLangText(Lang_Constants.TextType.B0367);
        this._labeBracketRoundTitle.setLangText(Lang_Constants.TextType.B1033);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelInfoTitle.setLangText(Lang_Constants.TextType.B0423);
        this._labelBracketTitle.setLangText(Lang_Constants.TextType.B1293);

        this._updateLabelTourneyId();
        this._updateLabelMapName();
        this._updateLabelPhase();
    }

    private async _updateLabelBracketRound(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        const label         = this._labelBracketRound;
        if (tourneyInfo == null) {
            label.setText(Lang_Constants.UndefinedError);
            return;
        }
        if (AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) === AutoTourneys_Constants.PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        label.setText(`${this._bracketRoundId}`);
    }
    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId             = this._tourneyId;
        const tourneyName           = Lang_Utils.getLanguageText({ textArray: (await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId))?.getNameArray() });
        this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
    }
    private async _updateLabelMapName(): Promise<void> {
        const label = this._labelMapName;
        label.setText(``);

        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            label.setText(Lang_Constants.UndefinedError);
            return;
        }
        if (AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) === AutoTourneys_Constants.PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        const mapInfoArray  = (await AutoTourneys_Mains_Provider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        label.setText(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId()) ?? Lang_Constants.UndefinedError);
    }
    private async _updateLabelPhase(): Promise<void> {
        const info  = (await AutoTourneys_Mains_Provider.getAtTourneyInfo(this._tourneyId));
        const label = this._labelPhase;
        if (info == null) {
            label.setText(Lang_Constants.UndefinedError);
        } else {
            label.setText(Lang_Utils.getAutoTourneyPhaseName(AutoTourneys_Mains_Provider.getTourneyInfoPhase(info)) ?? Lang_Constants.UndefinedError);
        }
        this._layoutPhase.arrangeItems();
    }
    private async _updateLabelPhaseCountdown(): Promise<void> {
        const info      = await AutoTourneys_Mains_Provider.getAtTourneyInfo(this._tourneyId);
        const label     = this._labelPhaseCountdown;
        const layout    = this._layoutPhase;
        if (info == null) {
            label.setText(``);
            layout.arrangeItems();
            return;
        }

        const phase = AutoTourneys_Mains_Provider.getTourneyInfoPhase(info);
        if (phase === AutoTourneys_Constants.PhaseId.Registration) {
            label.setText(`  (${Lang_Utils.getTimeDurationText2((info.getRegistrationDuration()) + (info.getRegistrationTimestamp()) - Timer_TimerModel.getServerTimestamp())})`);

        } else if (phase === AutoTourneys_Constants.PhaseId.Adjustment) {
            label.setText(`  (${Lang_Utils.getTimeDurationText2((info.getAdjustmentDuration()) + (info.getAdjustmentTimestamp() ?? 0) - Timer_TimerModel.getServerTimestamp())})`);

        } else {
            label.setText(``);
        }

        layout.arrangeItems();
    }
}

interface DataForBracketRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    bracketInfo     : SingleBracketInfo;
    maxBracketRound : number;
    tourneyId       : number;
}
class BracketRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelGameId!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupName1!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal1!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupName2!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal2!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnReplay!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSpectateRequest!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSpectateContinue!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        const userIdArray   = bracketInfo.getUserIdArray();
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId: userId });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupName2(): void {
        const userId = (this.getOpenData()?.bracketInfo.getUserIdArray() ?? [])[1];
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId: userId });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedBtnReplay(): void {
        const replayId = this.getOpenData()?.bracketInfo.getReplayId();
        if (replayId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0406),
                callback: async () => {
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
                },
            });
        }
    }
    private async _onTouchedBtnSpectate(): Promise<void> {
        const warId = this.getOpenData()?.bracketInfo.getWarId();
        if (warId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0297);
            return;
        }

        const watchOutgoingInfo = await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId);
        if (watchOutgoingInfo == null) {
            FloatText.showLang(Lang_Constants.TextType.A0297);
            return;
        }

        if (watchOutgoingInfo.getOngoingDstUserIdArray()?.length) {
            const warData = await WatchWar_Model_WwModel.getWatchWarData(warId);
            if (warData) {
                Helpers_GameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestDetailPanel, {
                warId   : warId,
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnReplay.setLangText(Lang_Constants.TextType.B0710);
        this._btnSpectateRequest.setLangText(Lang_Constants.TextType.B0872);
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
            const watchOutgoingInfo = await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId);
            if ((watchOutgoingInfo != null) && (warId === this.getOpenData()?.bracketInfo.getWarId())) {
                const canContinue   = !!watchOutgoingInfo.getOngoingDstUserIdArray().length;
                btnRequest.setIsVisible(!canContinue);
                btnContinue.setIsVisible(canContinue);
            }
        }
    }

    private async _updateLabelName(label: Ui_Interfaces_IUiLabel.IUiLabel, userId: number | null, winnerUserId: number | null): Promise<void> {
        if (userId != null) {
            label.setText((await Users_Model.getUserNickname(userId)) || Lang_Constants.UndefinedError);
            label.setTextColor(userId === winnerUserId ? 0x44FF44 : 0xFFFFFF);
        } else {
            label.setText(winnerUserId == null ? `????` : `----`);
            label.setTextColor(0xFFFFFF);
        }
    }

    private async _updateImgMedal(img: Ui_Interfaces_IUiImage.IUiImage, userId: number | null): Promise<void> {
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
                img.loadSource(Helpers_ImageSource.getMedal(tourneyId * 3 + 1));
            } else {
                img.loadSource(Helpers_ImageSource.getMedal(tourneyId * 3 + 2));
            }
        } else {
            if (userId === winnerUserId) {
                img.setIsVisible(true);
                img.loadSource(Helpers_ImageSource.getMedal(tourneyId * 3 + 3));
            } else {
                img.setIsVisible(false);
            }
        }
    }
}
