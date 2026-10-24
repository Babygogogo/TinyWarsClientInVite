import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SinglePlayerModeModelSpmModel from "../model/SpmModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRuleName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyScore!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyTurnIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRank!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listHighScore!    : UiInterfacesIUiScrollList.IUiScrollList<DataForHighScoreRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(LangConstants.TextType.B0906);
        this._labelMapName.setLangText(LangConstants.TextType.B0225);
        this._labelRuleName.setLangText(LangConstants.TextType.B0318);
        this._labelMyScore.setLangText(LangConstants.TextType.B0579);
        this._labelMyTurnIndex.setLangText(LangConstants.TextType.Turns);
        this._labelMyRank.setLangText(LangConstants.TextType.B0904);
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
    }

    private async _updateComponentsForHighScore(): Promise<void> {
        const configVersion     = await GameConfigGcModel.getLatestConfigVersion();
        const spwArray          = UsersModel.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray() ?? [];
        const mapRawDataArray   = await Promise.all(spwArray.map(v => NormalMapModelNormalMapModel.getRawData(HelpersMisc.getExisted(v.getNormalMapId()))));
        const dataArray         : DataForHighScoreRenderer[] = [];
        for (const info of spwArray) {
            if (info.getConfigVersion() !== configVersion) {
                continue;
            }

            const normalMapId   = HelpersMisc.getExisted(info.getNormalMapId());
            const ruleId        = HelpersMisc.getExisted(info.getRuleId());
            if (!mapRawDataArray.find(v => v?.getNormalMapId() === normalMapId)?.getTemplateWarRuleArray().find(v => v.getRuleId() === ruleId)?.getRuleAvailability()?.getCanSrw()) {
                continue;
            }

            dataArray.push({
                index       : 0,
                isLast      : false,
                normalMapId : normalMapId,
                ruleId      : ruleId,
                score       : HelpersMisc.getExisted(info.getHighScore()),
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

interface DataForHighScoreRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number;
    ruleId      : number;
    score       : number;
}
class HighScoreRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForHighScoreRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRuleName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyScore!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyTurnIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRank!      : UiInterfacesIUiLabel.IUiLabel;

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
        const mapRawData    = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData?.getNormalMapId() === normalMapId) {  // 由于异步逻辑，所以需要再次比较
            labelMapName.setText(LangUtils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? LangConstants.UndefinedError);

            const ruleId = openData.ruleId;
            labelRuleName.setText(`#${ruleId}(${LangUtils.getLanguageText({ textArray: mapRawData.getTemplateWarRuleArray()?.find(v => v.getRuleId() === ruleId)?.getRuleNameArray() }) ?? LangConstants.UndefinedError})`);
        }
    }

    private async _updateLabelMyTurnIndex(): Promise<void> {
        const label = this._labelMyTurnIndex;
        label.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        const ruleId    = openData.ruleId;
        const rankData  = (await SinglePlayerModeModelSpmModel.getRankData(openData.normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().find(v => v.getUserId() === userId);
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

        const index = await SinglePlayerModeModelSpmModel.getRankIndex(openData.normalMapId, openData.ruleId, openData.score);
        if (openData === this.getOpenData()) { // 由于异步逻辑，所以需要再次比较
            labelMyRank.setText((index == null) || (index <= 0)
                ? `--`
                : `${index}${HelpersText.getSuffixForRankIndex(index)}`
            );
        }
    }
}
