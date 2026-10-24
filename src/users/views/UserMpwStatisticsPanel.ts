import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelHistoryStd!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryStdWin!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryStdLose!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryStdDraw!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryStdRatio!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _sclHistoryStd!                : UiInterfacesIUiScrollList.IUiScrollList<DataForHistoryRenderer>;

    private readonly _labelHistoryFog!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryFogWin!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryFogLose!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryFogDraw!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHistoryFogRatio!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _sclHistoryFog!                : UiInterfacesIUiScrollList.IUiScrollList<DataForHistoryRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetPublicInfo,        callback: this._onNotifyMsgUserGetPublicInfo },
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

        UsersProxy.reqUserGetPublicInfo(userId);
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
        this._labelHistoryStd.setText(LangUtils.getText(LangConstants.TextType.B0548));
        this._labelHistoryStdWin.setText(LangUtils.getText(LangConstants.TextType.B0550));
        this._labelHistoryStdLose.setText(LangUtils.getText(LangConstants.TextType.B0551));
        this._labelHistoryStdDraw.setText(LangUtils.getText(LangConstants.TextType.B0552));
        this._labelHistoryStdRatio.setText(LangUtils.getText(LangConstants.TextType.B0553));
        this._labelHistoryFog.setText(LangUtils.getText(LangConstants.TextType.B0549));
        this._labelHistoryFogWin.setText(LangUtils.getText(LangConstants.TextType.B0550));
        this._labelHistoryFogLose.setText(LangUtils.getText(LangConstants.TextType.B0551));
        this._labelHistoryFogDraw.setText(LangUtils.getText(LangConstants.TextType.B0552));
        this._labelHistoryFogRatio.setText(LangUtils.getText(LangConstants.TextType.B0553));

        this._updateLabelTitle();
        this._updateSclHistoryStd();
        this._updateSclHistoryFog();
    }

    private async _updateLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelTitle.setText(LangUtils.getFormattedText(LangConstants.TextType.F0009, await UsersModel.getUserNickname(userId)));
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
            warType     : WarTypesConstants.WarTypeId.MrwStd,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= PlayersConstants.PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypesConstants.WarTypeId.McwStd,
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
            warType     : WarTypesConstants.WarTypeId.MrwFog,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= PlayersConstants.PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypesConstants.WarTypeId.McwFog,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        await this._sclHistoryFog.bindData(dataList);
    }
}

interface DataForHistoryRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    userId      : number;
    warType     : WarTypesConstants.WarTypeId;
    playersCount: number;
    showBottom? : boolean;
}
class HistoryRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForHistoryRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWin!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRatio!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBottom!    : UiInterfacesIUiImage.IUiImage;

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
        if ((warType === WarTypesConstants.WarTypeId.MrwFog) || (warType === WarTypesConstants.WarTypeId.MrwStd)) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B1075));
        } else {
            labelType.setText(`${playersCount}P`);
        }

        const info      = await UsersModel.getUserMpwStatisticsData(openData.userId, warType, playersCount);
        let winCount    = info?.getWins() ?? 0;
        let loseCount   = info?.getLoses() ?? 0;
        let drawCount   = info?.getDraws() ?? 0;
        if (warType === WarTypesConstants.WarTypeId.McwStd) {
            const info2 = await UsersModel.getUserMpwStatisticsData(openData.userId, WarTypesConstants.WarTypeId.MmwStd, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await UsersModel.getUserMpwStatisticsData(openData.userId, WarTypesConstants.WarTypeId.AtwStd, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;

        } else if (warType === WarTypesConstants.WarTypeId.McwFog) {
            const info2 = await UsersModel.getUserMpwStatisticsData(openData.userId, WarTypesConstants.WarTypeId.MmwFog, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await UsersModel.getUserMpwStatisticsData(openData.userId, WarTypesConstants.WarTypeId.AtwFog, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;
        }

        const totalCount = winCount + loseCount + drawCount;
        this._labelWin.setText(`${winCount}`);
        this._labelLose.setText(`${loseCount}`);
        this._labelDraw.setText(`${drawCount}`);
        this._labelRatio.setText(totalCount ? HelpersText.format(`%.2f`, winCount / totalCount * 100) : `--`);
    }
}
