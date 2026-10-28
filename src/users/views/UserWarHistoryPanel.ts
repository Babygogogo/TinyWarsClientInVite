import { UserWarHistoryType } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { gotoReplayWar } from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getWarTypeName, getTimestampShortText } from "../../lang/Utils.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getReplayData } from "../../replayWar/model/RwModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUserPublicInfo } from "../Model.ts";
import type { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = {
    userId      : number;
    historyType : UserWarHistoryType;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _btnRankStd!       : IUiButton;
    private readonly _imgRankStd!       : IUiImage;
    private readonly _btnRankFow!       : IUiButton;
    private readonly _imgRankFow!       : IUiImage;
    private readonly _btnUnranked!      : IUiButton;
    private readonly _imgUnranked!      : IUiImage;

    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelRankScore!   : IUiLabel;
    private readonly _labelWarType!     : IUiLabel;
    private readonly _labelNoData!      : IUiLabel;

    private readonly _listRanked!       : IUiScrollList<DataForRankedRenderer>;
    private readonly _listUnranked!     : IUiScrollList<DataForUnrankedRenderer>;

    private _historyType = UserWarHistoryType.RankStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetPublicInfo,    callback: this._onNotifyMsgUserGetPublicInfo },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnRankFow,     callback: this._onTouchedBtnRankFow },
            { ui: this._btnRankStd,     callback: this._onTouchedBtnRankStd },
            { ui: this._btnUnranked,    callback: this._onTouchedBtnUnranked },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listRanked.setItemRendererClass(RankedRenderer);
        this._listUnranked.setItemRendererClass(UnrankedRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const historyType = this.getOpenData()?.historyType;
        if (historyType == null) {
            return;
        }

        this._historyType = historyType;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listRanked.removeAllItems(),
            this._listUnranked.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgUserGetPublicInfo(): void {
        this._updateView();
    }

    private _onTouchedBtnRankFow(): void {
        this._historyType = UserWarHistoryType.RankFow;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnRankStd(): void {
        this._historyType = UserWarHistoryType.RankStd;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnUnranked(): void {
        this._historyType = UserWarHistoryType.Unranked;
        this._updateComponentsForHistory();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForHistory();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0201);
        this._labelMapName.setLangText(TextType.B0225);
        this._labelTimestamp.setLangText(TextType.EndTime);
        this._labelRankScore.setLangText(TextType.B0060);
        this._labelWarType.setLangText(TextType.B0599);
        this._labelNoData.setLangText(TextType.B0278);
        this._btnRankFow.setLangText(TextType.B0416);
        this._btnRankStd.setLangText(TextType.B0415);
        this._btnUnranked.setLangText(TextType.B0912);
    }

    private async _updateComponentsForHistory(): Promise<void> {
        const historyType       = this._historyType;
        const listRanked        = this._listRanked;
        const listUnranked      = this._listUnranked;
        const labelNoData       = this._labelNoData;
        const labelWarType      = this._labelWarType;
        const labelRankScore    = this._labelRankScore;
        const imgRankStd        = this._imgRankStd;
        const imgRankFow        = this._imgRankFow;
        const imgUnranked       = this._imgUnranked;
        listRanked.setIsVisible(false);
        listUnranked.setIsVisible(false);
        imgRankStd.setIsVisible(false);
        imgRankFow.setIsVisible(false);
        imgUnranked.setIsVisible(false);
        labelWarType.setIsVisible(false);
        labelRankScore.setIsVisible(false);

        if (historyType === UserWarHistoryType.RankFow) {
            listRanked.setIsVisible(true);
            labelRankScore.setIsVisible(true);
            imgRankFow.setIsVisible(true);
            listUnranked.removeAllItems();

            const dataArray     = await this._createDataForHistoryRankedFow();
            labelNoData.setIsVisible(!dataArray.length);
            await listRanked.bindData(dataArray);

        } else if (historyType === UserWarHistoryType.RankStd) {
            listRanked.setIsVisible(true);
            labelRankScore.setIsVisible(true);
            imgRankStd.setIsVisible(true);
            listUnranked.removeAllItems();

            const dataArray     = await this._createDataForHistoryRankedStd();
            labelNoData.setIsVisible(!dataArray.length);
            await listRanked.bindData(dataArray);

        } else {
            listUnranked.setIsVisible(true);
            labelWarType.setIsVisible(true);
            imgUnranked.setIsVisible(true);
            listRanked.removeAllItems();

            const dataArray     = await this._createDataForHistoryUnranked();
            labelNoData.setIsVisible(!dataArray.length);
            await listUnranked.bindData(dataArray);
        }
    }

    private async _createDataForHistoryRankedStd(): Promise<DataForRankedRenderer[]> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return [];
        }

        const dataArray: DataForRankedRenderer[] = [];
        for (const data of ((await getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedStdHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : getExisted(data.getEndTimestamp()),
                newScore    : getExisted(data.getNewScore()),
                deltaScore  : getExisted(data.getDeltaScore()),
                replayId    : data.getReplayId() ?? null,
            });
        }
        const length = dataArray.length;
        if (length) {
            dataArray[length - 1].isLast = true;
        }

        return dataArray;
    }
    private async _createDataForHistoryRankedFow(): Promise<DataForRankedRenderer[]> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return [];
        }

        const dataArray: DataForRankedRenderer[] = [];
        for (const data of ((await getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedFowHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : getExisted(data.getEndTimestamp()),
                newScore    : getExisted(data.getNewScore()),
                deltaScore  : getExisted(data.getDeltaScore()),
                replayId    : data.getReplayId() ?? null,
            });
        }
        const length = dataArray.length;
        if (length) {
            dataArray[length - 1].isLast = true;
        }

        return dataArray;
    }
    private async _createDataForHistoryUnranked(): Promise<DataForUnrankedRenderer[]> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return [];
        }

        const dataArray: DataForUnrankedRenderer[] = [];
        for (const data of ((await getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwUnrankedHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : getExisted(data.getEndTimestamp()),
                warType     : getExisted(data.getWarType()),
                replayId    : data.getReplayId() ?? null,
            });
        }
        const length = dataArray.length;
        if (length) {
            dataArray[length - 1].isLast = true;
        }

        return dataArray;
    }
}

interface DataForUnrankedRenderer extends UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    warType     : WarTypeId;
    replayId    : number | null;
}
class UnrankedRenderer extends UiListItemRenderer<DataForUnrankedRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgBottom!        : IUiImage;
    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelWarType!     : IUiLabel;
    private readonly _btnReplay!        : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnReplay,  callback: this._onTouchedBtnReplay },
        ]);
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedBtnReplay(): Promise<void> {
        const replayId = this.getOpenData()?.replayId;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = openData.normalMapId;
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(openData.isLast);
        this._labelWarType.setText(getWarTypeName(openData.warType) ?? UndefinedError);
        this._labelTimestamp.setText(getTextForTimestamp(openData.timestamp));
        this._labelMapName.setText(normalMapId == null ? `--` : (await getMapNameInCurrentLanguage(normalMapId) ?? UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

interface DataForRankedRenderer extends UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    newScore    : number;
    deltaScore  : number;
    replayId    : number | null;
}
class RankedRenderer extends UiListItemRenderer<DataForRankedRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgBottom!        : IUiImage;
    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelScore!       : IUiLabel;
    private readonly _btnReplay!        : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnReplay,  callback: this._onTouchedBtnReplay },
        ]);
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedBtnReplay(): Promise<void> {
        const replayId = this.getOpenData()?.replayId;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId           = openData.normalMapId;
        const deltaScore            = openData.deltaScore;
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(openData.isLast);
        this._labelScore.setText(`${openData.newScore}(${deltaScore >= 0 ? `+` : ``}${deltaScore})`);
        this._labelTimestamp.setText(getTextForTimestamp(openData.timestamp));
        this._labelMapName.setText(normalMapId == null ? `--` : (await getMapNameInCurrentLanguage(normalMapId) ?? UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
    const text2 = getTimestampShortText(timestamp, { year: false, month: false, date: false });
    return `${text1} ${text2}`;
}
