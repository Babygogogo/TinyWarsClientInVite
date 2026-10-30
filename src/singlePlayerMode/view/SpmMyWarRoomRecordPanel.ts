import {
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    SinglePlayerMode_Model_SpmModel,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    Helpers_Text,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRuleName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyScore!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyTurnIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRank!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listHighScore!    : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForHighScoreRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,        callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,   callback : this.closePanel },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0906);
        this._labelMapName.setLangText(Lang_Constants.TextType.B0225);
        this._labelRuleName.setLangText(Lang_Constants.TextType.B0318);
        this._labelMyScore.setLangText(Lang_Constants.TextType.B0579);
        this._labelMyTurnIndex.setLangText(Lang_Constants.TextType.Turns);
        this._labelMyRank.setLangText(Lang_Constants.TextType.B0904);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private async _updateComponentsForHighScore(): Promise<void> {
        const configVersion     = await GameConfigs_Provider.getLatestConfigVersion();
        const spwArray          = Users_Model.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray() ?? [];
        const mapRawDataArray   = await Promise.all(spwArray.map(v => NormalMap_Model_NormalMapModel.getRawData(Helpers_Misc.getExisted(v.getNormalMapId()))));
        const dataArray         : DataForHighScoreRenderer[] = [];
        for (const info of spwArray) {
            if (info.getConfigVersion() !== configVersion) {
                continue;
            }

            const normalMapId   = Helpers_Misc.getExisted(info.getNormalMapId());
            const ruleId        = Helpers_Misc.getExisted(info.getRuleId());
            if (!mapRawDataArray.find(v => v?.getNormalMapId() === normalMapId)?.getTemplateWarRuleArray().find(v => v.getRuleId() === ruleId)?.getRuleAvailability()?.getCanSrw()) {
                continue;
            }

            dataArray.push({
                index       : 0,
                isLast      : false,
                normalMapId : normalMapId,
                ruleId      : ruleId,
                score       : Helpers_Misc.getExisted(info.getHighScore()),
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

interface DataForHighScoreRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    isLast      : boolean;
    normalMapId : number;
    ruleId      : number;
    score       : number;
}
class HighScoreRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForHighScoreRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRuleName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyScore!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyTurnIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRank!      : Ui_Interfaces_IUiLabel.IUiLabel;

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
        const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData?.getNormalMapId() === normalMapId) {  // 由于异步逻辑，所以需要再次比较
            labelMapName.setText(Lang_Utils.getLanguageText({ textArray : mapRawData.getMapNameArray() }) ?? Lang_Constants.UndefinedError);

            const ruleId = openData.ruleId;
            labelRuleName.setText(`#${ruleId}(${Lang_Utils.getLanguageText({ textArray : mapRawData.getTemplateWarRuleArray()?.find(v => v.getRuleId() === ruleId)?.getRuleNameArray() }) ?? Lang_Constants.UndefinedError})`);
        }
    }

    private async _updateLabelMyTurnIndex(): Promise<void> {
        const label = this._labelMyTurnIndex;
        label.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        const ruleId    = openData.ruleId;
        const rankData  = (await SinglePlayerMode_Model_SpmModel.getRankData(openData.normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().find(v => v.getUserId() === userId);
        if (openData === this.getOpenData()) {
            label.setText((rankData?.getScore() !== openData.score)
                ? `--`
                : `${rankData.getTurnIndex() ?? `--`}`,
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

        const index = await SinglePlayerMode_Model_SpmModel.getRankIndex(openData.normalMapId, openData.ruleId, openData.score);
        if (openData === this.getOpenData()) { // 由于异步逻辑，所以需要再次比较
            labelMyRank.setText((index == null) || (index <= 0)
                ? `--`
                : `${index}${Helpers_Text.getSuffixForRankIndex(index)}`,
            );
        }
    }
}
