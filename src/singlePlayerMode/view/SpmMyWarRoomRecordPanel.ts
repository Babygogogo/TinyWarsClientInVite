import { getLatestConfigVersion } from "../../gameConfig/GcModel.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getSuffixForRankIndex } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getRankData, getRankIndex } from "../model/SpmModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfInfo, getSelfUserId } from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelRuleName!    : IUiLabel;
    private readonly _labelMyScore!     : IUiLabel;
    private readonly _labelMyTurnIndex! : IUiLabel;
    private readonly _labelMyRank!      : IUiLabel;
    private readonly _listHighScore!    : IUiScrollList<DataForHighScoreRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listHighScore.setItemRendererClass(HighScoreRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listHighScore.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForHighScore();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0906);
        this._labelMapName.setLangText(TextType.B0225);
        this._labelRuleName.setLangText(TextType.B0318);
        this._labelMyScore.setLangText(TextType.B0579);
        this._labelMyTurnIndex.setLangText(TextType.Turns);
        this._labelMyRank.setLangText(TextType.B0904);
        this._labelNoData.setLangText(TextType.B0278);
    }

    private async _updateComponentsForHighScore(): Promise<void> {
        const configVersion     = await getLatestConfigVersion();
        const spwArray          = getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray() ?? [];
        const mapRawDataArray   = await Promise.all(spwArray.map(v => getRawData(getExisted(v.getNormalMapId()))));
        const dataArray         : DataForHighScoreRenderer[] = [];
        for (const info of spwArray) {
            if (info.getConfigVersion() !== configVersion) {
                continue;
            }

            const normalMapId   = getExisted(info.getNormalMapId());
            const ruleId        = getExisted(info.getRuleId());
            if (!mapRawDataArray.find(v => v?.getNormalMapId() === normalMapId)?.getTemplateWarRuleArray().find(v => v.getRuleId() === ruleId)?.getRuleAvailability()?.getCanSrw()) {
                continue;
            }

            dataArray.push({
                index       : 0,
                isLast      : false,
                normalMapId : normalMapId,
                ruleId      : ruleId,
                score       : getExisted(info.getHighScore()),
            });
        }
        dataArray.sort((v1, v2) => {
            const normalMapId1 = v1.normalMapId;
            const normalMapId2 = v2.normalMapId;
            if (normalMapId1 !== normalMapId2) {
                return normalMapId1 - normalMapId2;
            } else {
                return v1.ruleId - v2.ruleId;
            }
        });
        const length = dataArray.length;
        for (let i = 0; i < length; ++i) {
            const data  = dataArray[i];
            data.index  = i + 1;
            data.isLast = i === length - 1;
        }

        this._labelNoData.setIsVisible(!length);
        await this._listHighScore.bindData(dataArray);
    }
}

interface DataForHighScoreRenderer extends UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number;
    ruleId      : number;
    score       : number;
}
class HighScoreRenderer extends UiListItemRenderer<DataForHighScoreRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBottom!        : IUiImage;
    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelRuleName!    : IUiLabel;
    private readonly _labelMyScore!     : IUiLabel;
    private readonly _labelMyTurnIndex! : IUiLabel;
    private readonly _labelMyRank!      : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateLabelMapNameAndRuleName();
        this._updateLabelMyRank();
        this._updateLabelMyTurnIndex();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        this._labelMyScore.setText(`${openData.score}`);
        this._imgBottom.setIsVisible(!openData.isLast);
    }

    private async _updateLabelMapNameAndRuleName(): Promise<void> {
        const labelMapName  = this._labelMapName;
        const labelRuleName = this._labelRuleName;
        labelMapName.setText(``);
        labelRuleName.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId   = openData.normalMapId;
        const mapRawData    = await getRawData(normalMapId);
        if (mapRawData?.getNormalMapId() === normalMapId) {  // 由于异步逻辑，所以需要再次比较
            labelMapName.setText(getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? UndefinedError);

            const ruleId = openData.ruleId;
            labelRuleName.setText(`#${ruleId}(${getLanguageText({ textArray: mapRawData.getTemplateWarRuleArray()?.find(v => v.getRuleId() === ruleId)?.getRuleNameArray() }) ?? UndefinedError})`);
        }
    }

    private async _updateLabelMyTurnIndex(): Promise<void> {
        const label = this._labelMyTurnIndex;
        label.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = getExisted(getSelfUserId());
        const ruleId    = openData.ruleId;
        const rankData  = (await getRankData(openData.normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().find(v => v.getUserId() === userId);
        if (openData === this.getOpenData()) {
            label.setText((rankData?.getScore() !== openData.score)
                ? `--`
                : `${rankData.getTurnIndex() ?? `--`}`
            );
        }
    }

    private async _updateLabelMyRank(): Promise<void> {
        const labelMyRank = this._labelMyRank;
        labelMyRank.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const index = await getRankIndex(openData.normalMapId, openData.ruleId, openData.score);
        if (openData === this.getOpenData()) { // 由于异步逻辑，所以需要再次比较
            labelMyRank.setText((index == null) || (index <= 0)
                ? `--`
                : `${index}${getSuffixForRankIndex(index)}`
            );
        }
    }
}
