import {
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    ReplayWar_Model_RwModel,
    Lang_Utils,
    Users_Model,
    Helpers_GameFlow,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type WarTypes_Constants,
} from "../../internal.ts";

export type OpenData = {
    userId      : number;
    historyType : AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRankStd!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgRankStd!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnRankFow!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgRankFow!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnUnranked!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgUnranked!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRankScore!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarType!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listRanked!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRankedRenderer>;
    private readonly _listUnranked!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnrankedRenderer>;

    private _historyType = AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserGetPublicInfo,    callback : this._onNotifyMsgUserGetPublicInfo },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnRankFow,     callback : this._onTouchedBtnRankFow },
            { ui : this._btnRankStd,     callback : this._onTouchedBtnRankStd },
            { ui : this._btnUnranked,    callback : this._onTouchedBtnUnranked },
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
        this._historyType = AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankFow;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnRankStd(): void {
        this._historyType = AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankStd;
        this._updateComponentsForHistory();
    }

    private _onTouchedBtnUnranked(): void {
        this._historyType = AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.Unranked;
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0201);
        this._labelMapName.setLangText(Lang_Constants.TextType.B0225);
        this._labelTimestamp.setLangText(Lang_Constants.TextType.EndTime);
        this._labelRankScore.setLangText(Lang_Constants.TextType.B0060);
        this._labelWarType.setLangText(Lang_Constants.TextType.B0599);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._btnRankFow.setLangText(Lang_Constants.TextType.B0416);
        this._btnRankStd.setLangText(Lang_Constants.TextType.B0415);
        this._btnUnranked.setLangText(Lang_Constants.TextType.B0912);
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

        if (historyType === AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankFow) {
            listRanked.setIsVisible(true);
            labelRankScore.setIsVisible(true);
            imgRankFow.setIsVisible(true);
            listUnranked.removeAllItems();

            const dataArray     = await this._createDataForHistoryRankedFow();
            labelNoData.setIsVisible(!dataArray.length);
            await listRanked.bindData(dataArray);

        } else if (historyType === AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankStd) {
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
        for (const data of ((await Users_Model.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedStdHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : Helpers_Misc.getExisted(data.getEndTimestamp()),
                newScore    : Helpers_Misc.getExisted(data.getNewScore()),
                deltaScore  : Helpers_Misc.getExisted(data.getDeltaScore()),
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
        for (const data of ((await Users_Model.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwRankedFowHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : Helpers_Misc.getExisted(data.getEndTimestamp()),
                newScore    : Helpers_Misc.getExisted(data.getNewScore()),
                deltaScore  : Helpers_Misc.getExisted(data.getDeltaScore()),
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
        for (const data of ((await Users_Model.getUserPublicInfo(userId))?.getUserWarHistory()?.getMpwUnrankedHistoryArray() ?? []).concat().reverse()) {
            dataArray.push({
                index       : dataArray.length + 1,
                isLast      : false,
                normalMapId : data.getNormalMapId() ?? null,
                timestamp   : Helpers_Misc.getExisted(data.getEndTimestamp()),
                warType     : Helpers_Misc.getExisted(data.getWarType()),
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

interface DataForUnrankedRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    warType     : WarTypes_Constants.WarTypeId;
    replayId    : number | null;
}
class UnrankedRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnrankedRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarType!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnReplay!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnReplay,  callback : this._onTouchedBtnReplay },
        ]);
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedBtnReplay(): Promise<void> {
        const replayId = this.getOpenData()?.replayId;
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
        this._labelWarType.setText(Lang_Utils.getWarTypeName(openData.warType) ?? Lang_Constants.UndefinedError);
        this._labelTimestamp.setText(getTextForTimestamp(openData.timestamp));
        this._labelMapName.setText(normalMapId == null ? `--` : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

interface DataForRankedRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number | null;
    timestamp   : number;
    newScore    : number;
    deltaScore  : number;
    replayId    : number | null;
}
class RankedRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRankedRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnReplay!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnReplay,  callback : this._onTouchedBtnReplay },
        ]);
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedBtnReplay(): Promise<void> {
        const replayId = this.getOpenData()?.replayId;
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
        this._labelMapName.setText(normalMapId == null ? `--` : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError));
        this._btnReplay.setIsVisible(openData.replayId != null);
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = Lang_Utils.getTimestampShortText(timestamp, { hour : false, minute : false, second : false });
    const text2 = Lang_Utils.getTimestampShortText(timestamp, { year : false, month : false, date : false });
    return `${text1} ${text2}`;
}
