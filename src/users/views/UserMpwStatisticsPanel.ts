import {
    Helpers_Text,
    Lang_Utils,
    Users_Model,
    Players_Constants,
    Users_Proxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    WarTypes_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelHistoryStd!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryStdWin!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryStdLose!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryStdDraw!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryStdRatio!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _sclHistoryStd!                : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForHistoryRenderer>;

    private readonly _labelHistoryFog!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryFogWin!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryFogLose!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryFogDraw!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHistoryFogRatio!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _sclHistoryFog!                : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForHistoryRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserGetPublicInfo,        callback: this._onNotifyMsgUserGetPublicInfo },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._sclHistoryStd.setItemRendererClass(HistoryRenderer);
        this._sclHistoryFog.setItemRendererClass(HistoryRenderer);

        this._updateView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        Users_Proxy.reqUserGetPublicInfo(userId);
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._sclHistoryFog.removeAllItems(),
            this._sclHistoryStd.removeAllItems(),
        ]);

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserGetPublicInfo(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelHistoryStd.setLangText(Lang_Constants.TextType.B0548);
        this._labelHistoryStdWin.setLangText(Lang_Constants.TextType.B0550);
        this._labelHistoryStdLose.setLangText(Lang_Constants.TextType.B0551);
        this._labelHistoryStdDraw.setLangText(Lang_Constants.TextType.B0552);
        this._labelHistoryStdRatio.setLangText(Lang_Constants.TextType.B0553);
        this._labelHistoryFog.setLangText(Lang_Constants.TextType.B0549);
        this._labelHistoryFogWin.setLangText(Lang_Constants.TextType.B0550);
        this._labelHistoryFogLose.setLangText(Lang_Constants.TextType.B0551);
        this._labelHistoryFogDraw.setLangText(Lang_Constants.TextType.B0552);
        this._labelHistoryFogRatio.setLangText(Lang_Constants.TextType.B0553);

        this._updateLabelTitle();
        this._updateSclHistoryStd();
        this._updateSclHistoryFog();
    }

    private async _updateLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelTitle.setText(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0009, await Users_Model.getUserNickname(userId)));
    }
    private async _updateSclHistoryStd(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        let index       = 0;
        const dataList  : DataForHistoryRenderer[] = [{
            index       : index++,
            userId,
            warType     : WarTypes_Constants.WarTypeId.MrwStd,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= Players_Constants.PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypes_Constants.WarTypeId.McwStd,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        await this._sclHistoryStd.bindData(dataList);
    }
    private async _updateSclHistoryFog(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        let index       = 0;
        const dataList  : DataForHistoryRenderer[] = [{
            index       : index++,
            userId,
            warType     : WarTypes_Constants.WarTypeId.MrwFog,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= Players_Constants.PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypes_Constants.WarTypeId.McwFog,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        await this._sclHistoryFog.bindData(dataList);
    }
}

interface DataForHistoryRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    userId      : number;
    warType     : WarTypes_Constants.WarTypeId;
    playersCount: number;
    showBottom? : boolean;
}
class HistoryRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForHistoryRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWin!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRatio!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBottom!    : Ui_Interfaces_IUiImage.IUiImage;

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setAlpha(openData.index % 2 === 0 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(!!openData.showBottom);

        const warType       = openData.warType;
        const playersCount  = openData.playersCount;
        const labelType     = this._labelType;
        if ((warType === WarTypes_Constants.WarTypeId.MrwFog) || (warType === WarTypes_Constants.WarTypeId.MrwStd)) {
            labelType.setLangText(Lang_Constants.TextType.B1075);
        } else {
            labelType.setText(`${playersCount}P`);
        }

        const info      = await Users_Model.getUserMpwStatisticsData(openData.userId, warType, playersCount);
        let winCount    = info?.getWins() ?? 0;
        let loseCount   = info?.getLoses() ?? 0;
        let drawCount   = info?.getDraws() ?? 0;
        if (warType === WarTypes_Constants.WarTypeId.McwStd) {
            const info2 = await Users_Model.getUserMpwStatisticsData(openData.userId, WarTypes_Constants.WarTypeId.MmwStd, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await Users_Model.getUserMpwStatisticsData(openData.userId, WarTypes_Constants.WarTypeId.AtwStd, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;

        } else if (warType === WarTypes_Constants.WarTypeId.McwFog) {
            const info2 = await Users_Model.getUserMpwStatisticsData(openData.userId, WarTypes_Constants.WarTypeId.MmwFog, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await Users_Model.getUserMpwStatisticsData(openData.userId, WarTypes_Constants.WarTypeId.AtwFog, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;
        }

        const totalCount = winCount + loseCount + drawCount;
        this._labelWin.setText(`${winCount}`);
        this._labelLose.setText(`${loseCount}`);
        this._labelDraw.setText(`${drawCount}`);
        this._labelRatio.setText(totalCount ? Helpers_Text.format(`%.2f`, winCount / totalCount * 100) : `--`);
    }
}
