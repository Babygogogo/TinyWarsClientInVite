import { PhaseId } from "../../Constants.ts";
import {
    getLastTourneyId,
    getAllTourneyIdArray,
    getAtFullBracketInfo,
    getAtTourneyInfo,
    getTourneyInfoPhase,
    getAtFullMapInfo,
} from "../Provider.ts";
import { showLang } from "../../../FloatText.ts";
import { getLatestGameConfig } from "../../../gameConfigs/Provider.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../../gamePanels/Manager.ts";
import { gotoReplayWar, gotoMultiPlayerWar } from "../../../helpers/GameFlow.ts";
import { getMedal } from "../../../helpers/ImageSource.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getLanguageText, getAutoTourneyPhaseName, getTimeDurationText2, getText } from "../../../lang/Utils.ts";
import { getRawData, getMapNameInCurrentLanguage } from "../../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import type { SingleBracketInfo } from "../../../proto/schema/CommonProto/AutoTourney/SingleBracketInfo.ts";
import { getReplayData } from "../../../replayWar/model/RwModel.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import { getServerTimestamp } from "../../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import { getIsSelfAutoTourneyCommittee, getUserNickname } from "../../../users/Model.ts";
import { getWatchOutgoingInfo, getWatchWarData } from "../../../watchWar/model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnSettings!              : IUiButton;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelInfoTitle!           : IUiLabel;
    private readonly _labelTourneyIdTitle!      : IUiLabel;
    private readonly _labelTourneyId!           : IUiLabel;
    private readonly _btnPreviousTourney!       : IUiButton;
    private readonly _btnNextTourney!           : IUiButton;

    private readonly _labelPhaseTitle!          : IUiLabel;
    private readonly _layoutPhase!              : IUiLayout;
    private readonly _labelPhase!               : IUiLabel;
    private readonly _labelPhaseCountdown!      : IUiLabel;

    private readonly _labeBracketRoundTitle!    : IUiLabel;
    private readonly _labelBracketRound!        : IUiLabel;
    private readonly _btnPreviousBracket!       : IUiButton;
    private readonly _btnNextBracket!           : IUiButton;

    private readonly _groupMapName!             : IUiContainer;
    private readonly _labelMapNameTitle!        : IUiLabel;
    private readonly _labelMapName!             : IUiLabel;

    private readonly _labelBracketTitle!        : IUiLabel;
    private readonly _listBracket!              : IUiScrollList<DataForBracketRenderer>;
    private readonly _labelNoData!              : IUiLabel;

    private _tourneyId      = 1;
    private _bracketRoundId = 1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TimeTick,                callback: this._onNotifyTimeTick },
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgAtSetName,            callback: this._onNotifyMsgAtSetName },
            { type: TypeId.MsgMpwWatchMakeRequest,  callback: this._onNotifyMsgMpwWatchMakeRequest },
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
        this._tourneyId         = getExisted(await getLastTourneyId());
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
        const tourneyIdArray    = await getAllTourneyIdArray();
        const tourneyId         = this._tourneyId - 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            showLang(TextType.B0278);
        }
    }
    private _onTouchedBtnSettings(): void {
        openPanel(getDict().AtTourneySettingsPanel, { tourneyId: this._tourneyId });
    }
    private async _onTouchedBtnNextTourney(): Promise<void> {
        const tourneyIdArray    = await getAllTourneyIdArray();
        const tourneyId         = this._tourneyId + 1;
        if (tourneyIdArray.indexOf(tourneyId) >= 0) {
            this._tourneyId         = tourneyId;
            this._bracketRoundId    = 1;
            this._updateView();
        } else {
            showLang(TextType.B0278);
        }
    }
    private async _onTouchedBtnPreviousBracket(): Promise<void> {
        const bracketInfoArray  = (await getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId - 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId()) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            showLang(TextType.B0278);
        }
    }
    private async _onTouchedGroupMapName(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }
        if (getTourneyInfoPhase(tourneyInfo) === PhaseId.Registration) {
            return;
        }

        const mapInfoArray  = (await getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        const mapRawData    = await getRawData(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId());
        if (mapRawData != null) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            openPanel(getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
        }
    }
    private async _onTouchedBtnNextBracket(): Promise<void> {
        const bracketInfoArray  = (await getAtFullBracketInfo(this._tourneyId))?.getSingleBracketInfoArray() ?? [];
        const bracketRoundId    = this._bracketRoundId + 1;
        if (bracketInfoArray.some(v => (v.getBracketRoundId()) == bracketRoundId)) {
            this._bracketRoundId = bracketRoundId;
            this._updateView();
        } else {
            showLang(TextType.B0278);
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
        showLang(TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        this._btnSettings.setIsVisible(getIsSelfAutoTourneyCommittee());
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

        const bracketInfoArray = (await getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        this._btnNextBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId()) === bracketRoundId + 1));
        this._btnPreviousBracket.setIsVisible(bracketInfoArray.some(v => (v.getBracketRoundId()) === bracketRoundId - 1));

        const allTourneyIdArray = await getAllTourneyIdArray();
        this._btnPreviousTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId - 1) >= 0);
        this._btnNextTourney.setIsVisible(allTourneyIdArray.indexOf(tourneyId + 1) >= 0);
    }

    private async _createDataForListBracket(): Promise<DataForBracketRenderer[]> {
        const dataArray                 : DataForBracketRenderer[] = [];
        const tourneyId                 = this._tourneyId;
        const bracketRoundId            = this._bracketRoundId;
        const bracketInfoArray          = (await getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
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
        this._labelTitle.setLangText(TextType.B1022);
        this._labelNoData.setLangText(TextType.B1042);
        this._labelTourneyIdTitle.setLangText(TextType.B1026);
        this._labelPhaseTitle.setLangText(TextType.B0367);
        this._labeBracketRoundTitle.setLangText(TextType.B1033);
        this._labelMapNameTitle.setLangText(TextType.B0225);
        this._labelInfoTitle.setLangText(TextType.B0423);
        this._labelBracketTitle.setLangText(TextType.B1293);

        this._updateLabelTourneyId();
        this._updateLabelMapName();
        this._updateLabelPhase();
    }

    private async _updateLabelBracketRound(): Promise<void> {
        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await getAtTourneyInfo(tourneyId);
        const label         = this._labelBracketRound;
        if (tourneyInfo == null) {
            label.setText(UndefinedError);
            return;
        }
        if (getTourneyInfoPhase(tourneyInfo) === PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        label.setText(`${this._bracketRoundId}`);
    }
    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId             = this._tourneyId;
        const tourneyName           = getLanguageText({ textArray: (await getAtTourneyInfo(tourneyId))?.getNameArray() });
        this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
    }
    private async _updateLabelMapName(): Promise<void> {
        const label = this._labelMapName;
        label.setText(``);

        const tourneyId     = this._tourneyId;
        const tourneyInfo   = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            label.setText(UndefinedError);
            return;
        }
        if (getTourneyInfoPhase(tourneyInfo) === PhaseId.Registration) {
            label.setText(`----`);
            return;
        }

        const mapInfoArray  = (await getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? [];
        label.setText(await getMapNameInCurrentLanguage(mapInfoArray[(this._bracketRoundId - 1) % mapInfoArray.length].getNormalMapId()) ?? UndefinedError);
    }
    private async _updateLabelPhase(): Promise<void> {
        const info  = (await getAtTourneyInfo(this._tourneyId));
        const label = this._labelPhase;
        if (info == null) {
            label.setText(UndefinedError);
        } else {
            label.setText(getAutoTourneyPhaseName(getTourneyInfoPhase(info)) ?? UndefinedError);
        }
        this._layoutPhase.arrangeItems();
    }
    private async _updateLabelPhaseCountdown(): Promise<void> {
        const info      = await getAtTourneyInfo(this._tourneyId);
        const label     = this._labelPhaseCountdown;
        const layout    = this._layoutPhase;
        if (info == null) {
            label.setText(``);
            layout.arrangeItems();
            return;
        }

        const phase = getTourneyInfoPhase(info);
        if (phase === PhaseId.Registration) {
            label.setText(`  (${getTimeDurationText2((info.getRegistrationDuration()) + (info.getRegistrationTimestamp()) - getServerTimestamp())})`);

        } else if (phase === PhaseId.Adjustment) {
            label.setText(`  (${getTimeDurationText2((info.getAdjustmentDuration()) + (info.getAdjustmentTimestamp() ?? 0) - getServerTimestamp())})`);

        } else {
            label.setText(``);
        }

        layout.arrangeItems();
    }
}

interface DataForBracketRenderer extends UiListItemData {
    index           : number;
    bracketInfo     : SingleBracketInfo;
    maxBracketRound : number;
    tourneyId       : number;
}
class BracketRenderer extends UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!                : IUiImage;
    private readonly _labelGameId!          : IUiLabel;

    private readonly _groupName1!           : IUiLayout;
    private readonly _labelName1!           : IUiLabel;
    private readonly _imgMedal1!            : IUiImage;

    private readonly _groupName2!           : IUiLayout;
    private readonly _labelName2!           : IUiLabel;
    private readonly _imgMedal2!            : IUiImage;

    private readonly _btnReplay!            : IUiButton;
    private readonly _btnSpectateRequest!   : IUiButton;
    private readonly _btnSpectateContinue!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
            openPanel(getDict().UserPanel, { userId: userId });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupName2(): void {
        const userId = (this.getOpenData()?.bracketInfo.getUserIdArray() ?? [])[1];
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedBtnReplay(): void {
        const replayId = this.getOpenData()?.bracketInfo.getReplayId();
        if (replayId != null) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0406),
                callback: async () => {
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
                },
            });
        }
    }
    private async _onTouchedBtnSpectate(): Promise<void> {
        const warId = this.getOpenData()?.bracketInfo.getWarId();
        if (warId == null) {
            showLang(TextType.A0297);
            return;
        }

        const watchOutgoingInfo = await getWatchOutgoingInfo(warId);
        if (watchOutgoingInfo == null) {
            showLang(TextType.A0297);
            return;
        }

        if (watchOutgoingInfo.getOngoingDstUserIdArray()?.length) {
            const warData = await getWatchWarData(warId);
            if (warData) {
                gotoMultiPlayerWar(warData);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }
        } else {
            openPanel(getDict().WwMakeRequestDetailPanel, {
                warId   : warId,
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnReplay.setLangText(TextType.B0710);
        this._btnSpectateRequest.setLangText(TextType.B0872);
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
            const watchOutgoingInfo = await getWatchOutgoingInfo(warId);
            if ((watchOutgoingInfo != null) && (warId === this.getOpenData()?.bracketInfo.getWarId())) {
                const canContinue   = !!watchOutgoingInfo.getOngoingDstUserIdArray().length;
                btnRequest.setIsVisible(!canContinue);
                btnContinue.setIsVisible(canContinue);
            }
        }
    }

    private async _updateLabelName(label: IUiLabel, userId: number | null, winnerUserId: number | null): Promise<void> {
        if (userId != null) {
            label.setText((await getUserNickname(userId)) || UndefinedError);
            label.setTextColor(userId === winnerUserId ? 0x44FF44 : 0xFFFFFF);
        } else {
            label.setText(winnerUserId == null ? `????` : `----`);
            label.setTextColor(0xFFFFFF);
        }
    }

    private async _updateImgMedal(img: IUiImage, userId: number | null): Promise<void> {
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
                img.loadSource(getMedal(tourneyId * 3 + 1));
            } else {
                img.loadSource(getMedal(tourneyId * 3 + 2));
            }
        } else {
            if (userId === winnerUserId) {
                img.setIsVisible(true);
                img.loadSource(getMedal(tourneyId * 3 + 3));
            } else {
                img.setIsVisible(false);
            }
        }
    }
}
