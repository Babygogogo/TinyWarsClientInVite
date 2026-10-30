import { format } from "../../helpers/Text.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    getUserNickname,
    getUserMpwStatisticsData,
} from "../Model.ts";
import { reqUserGetPublicInfo } from "../Proxy.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _labelHistoryStd!              : IUiLabel;
    private readonly _labelHistoryStdWin!           : IUiLabel;
    private readonly _labelHistoryStdLose!          : IUiLabel;
    private readonly _labelHistoryStdDraw!          : IUiLabel;
    private readonly _labelHistoryStdRatio!         : IUiLabel;
    private readonly _sclHistoryStd!                : IUiScrollList<DataForHistoryRenderer>;

    private readonly _labelHistoryFog!              : IUiLabel;
    private readonly _labelHistoryFogWin!           : IUiLabel;
    private readonly _labelHistoryFogLose!          : IUiLabel;
    private readonly _labelHistoryFogDraw!          : IUiLabel;
    private readonly _labelHistoryFogRatio!         : IUiLabel;
    private readonly _sclHistoryFog!                : IUiScrollList<DataForHistoryRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetPublicInfo,        callback: this._onNotifyMsgUserGetPublicInfo },
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

        reqUserGetPublicInfo(userId);
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
        this._labelHistoryStd.setLangText(TextType.B0548);
        this._labelHistoryStdWin.setLangText(TextType.B0550);
        this._labelHistoryStdLose.setLangText(TextType.B0551);
        this._labelHistoryStdDraw.setLangText(TextType.B0552);
        this._labelHistoryStdRatio.setLangText(TextType.B0553);
        this._labelHistoryFog.setLangText(TextType.B0549);
        this._labelHistoryFogWin.setLangText(TextType.B0550);
        this._labelHistoryFogLose.setLangText(TextType.B0551);
        this._labelHistoryFogDraw.setLangText(TextType.B0552);
        this._labelHistoryFogRatio.setLangText(TextType.B0553);

        this._updateLabelTitle();
        this._updateSclHistoryStd();
        this._updateSclHistoryFog();
    }

    private async _updateLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelTitle.setText(getFormattedText(TextType.F0009, await getUserNickname(userId)));
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
            warType     : WarTypeId.MrwStd,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypeId.McwStd,
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
            warType     : WarTypeId.MrwFog,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= PlayerIndex.Max; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarTypeId.McwFog,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        await this._sclHistoryFog.bindData(dataList);
    }
}

interface DataForHistoryRenderer extends UiListItemData {
    index       : number;
    userId      : number;
    warType     : WarTypeId;
    playersCount: number;
    showBottom? : boolean;
}
class HistoryRenderer extends UiListItemRenderer<DataForHistoryRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelType!    : IUiLabel;
    private readonly _labelWin!     : IUiLabel;
    private readonly _labelLose!    : IUiLabel;
    private readonly _labelDraw!    : IUiLabel;
    private readonly _labelRatio!   : IUiLabel;
    private readonly _imgBottom!    : IUiImage;

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
        if ((warType === WarTypeId.MrwFog) || (warType === WarTypeId.MrwStd)) {
            labelType.setLangText(TextType.B1075);
        } else {
            labelType.setText(`${playersCount}P`);
        }

        const info      = await getUserMpwStatisticsData(openData.userId, warType, playersCount);
        let winCount    = info?.getWins() ?? 0;
        let loseCount   = info?.getLoses() ?? 0;
        let drawCount   = info?.getDraws() ?? 0;
        if (warType === WarTypeId.McwStd) {
            const info2 = await getUserMpwStatisticsData(openData.userId, WarTypeId.MmwStd, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await getUserMpwStatisticsData(openData.userId, WarTypeId.AtwStd, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;

        } else if (warType === WarTypeId.McwFog) {
            const info2 = await getUserMpwStatisticsData(openData.userId, WarTypeId.MmwFog, playersCount);
            winCount    += info2?.getWins() ?? 0;
            loseCount   += info2?.getLoses() ?? 0;
            drawCount   += info2?.getDraws() ?? 0;

            const info3 = await getUserMpwStatisticsData(openData.userId, WarTypeId.AtwFog, playersCount);
            winCount    += info3?.getWins() ?? 0;
            loseCount   += info3?.getLoses() ?? 0;
            drawCount   += info3?.getDraws() ?? 0;
        }

        const totalCount = winCount + loseCount + drawCount;
        this._labelWin.setText(`${winCount}`);
        this._labelLose.setText(`${loseCount}`);
        this._labelDraw.setText(`${drawCount}`);
        this._labelRatio.setText(totalCount ? format(`%.2f`, winCount / totalCount * 100) : `--`);
    }
}
