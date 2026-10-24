import * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ReplayWarModelRwModel from "../../replayWar/model/RwModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../Model.ts";
import type * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = {
    userId      : number;
    historyType : AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRankStd!       : UiInterfacesIUiButton.IUiButton;
    private readonly _imgRankStd!       : UiInterfacesIUiImage.IUiImage;
    private readonly _btnRankFow!       : UiInterfacesIUiButton.IUiButton;
    private readonly _imgRankFow!       : UiInterfacesIUiImage.IUiImage;
    private readonly _btnUnranked!      : UiInterfacesIUiButton.IUiButton;
    private readonly _imgUnranked!      : UiInterfacesIUiImage.IUiImage;

    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRankScore!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarType!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listRanked!       : UiInterfacesIUiScrollList.IUiScrollList<DataForRankedRenderer>;
    private readonly _listUnranked!     : UiInterfacesIUiScrollList.IUiScrollList<DataForUnrankedRenderer>;

    private _historyType = AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetPublicInfo,    callback: this._onNotifyMsgUserGetPublicInfo },
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
        this._historyType = AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankFow;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnRankStd(): void {
        this._historyType = AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankStd;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnUnranked(): void {
        this._historyType = AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.Unranked;
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0201));
        this._labelMapName.setText(LangUtils.getText(LangConstants.TextType.B0225));
        this._labelTimestamp.setText(LangUtils.getText(LangConstants.TextType.EndTime));
        this._labelRankScore.setText(LangUtils.getText(LangConstants.TextType.B0060));
        this._labelWarType.setText(LangUtils.getText(LangConstants.TextType.B0599));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnRankFow.setText(LangUtils.getText(LangConstants.TextType.B0416));
        this._btnRankStd.setText(LangUtils.getText(LangConstants.TextType.B0415));
        this._btnUnranked.setText(LangUtils.getText(LangConstants.TextType.B0912));
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

        if (historyType === AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankFow) {
            listRanked.setIsVisible(true);
            labelRankScore.setIsVisible(true);
            imgRankFow.setIsVisible(true);
            listUnranked.removeAllItems();

            const dataArray     = await this._createDataForHistoryRankedFow();
            labelNoData.setIsVisible(!dataArray.length);
            await listRanked.bindData(dataArray);

        } else if (historyType === AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankStd) {
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
        for (const data of ((await UsersModel.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedStdHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : HelpersMisc.getExisted(data.getEndTimestamp()),
                newScore    : HelpersMisc.getExisted(data.getNewScore()),
                deltaScore  : HelpersMisc.getExisted(data.getDeltaScore()),
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
        for (const data of ((await UsersModel.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedFowHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : HelpersMisc.getExisted(data.getEndTimestamp()),
                newScore    : HelpersMisc.getExisted(data.getNewScore()),
                deltaScore  : HelpersMisc.getExisted(data.getDeltaScore()),
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
        for (const data of ((await UsersModel.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwUnrankedHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : HelpersMisc.getExisted(data.getEndTimestamp()),
                warType     : HelpersMisc.getExisted(data.getWarType()),
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

interface DataForUnrankedRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    warType     : WarTypesConstants.WarTypeId;
    replayId    : number | null;
}
class UnrankedRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnrankedRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarType!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnReplay!        : UiInterfacesIUiButton.IUiButton;

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
        this._labelWarType.setText(LangUtils.getWarTypeName(openData.warType) ?? LangConstants.UndefinedError);
        this._labelTimestamp.setText(getTextForTimestamp(openData.timestamp));
        this._labelMapName.setText(normalMapId == null ? `--` : (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

interface DataForRankedRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    newScore    : number;
    deltaScore  : number;
    replayId    : number | null;
}
class RankedRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRankedRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnReplay!        : UiInterfacesIUiButton.IUiButton;

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
        this._labelMapName.setText(normalMapId == null ? `--` : (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = LangUtils.getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
    const text2 = LangUtils.getTimestampShortText(timestamp, { year: false, month: false, date: false });
    return `${text1} ${text2}`;
}
