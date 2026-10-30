import {
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Helpers_Text,
    Lang_Utils,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _listRule! : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRuleRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignMapRankPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });

        this._listRule.setItemRendererClass(RuleRenderer);
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listRule.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateListRule();
    }

    private async _updateListRule(): Promise<void> {
        const openData  = this.getOpenData();
        const listRule  = this._listRule;
        if (openData == null) {
            await listRule.removeAllItems();
            return;
        }

        const campaignId    = openData.campaignId;
        const campaignMapId = openData.campaignMapId;
        const dataArray: DataForRuleRenderer[] = [];
        dataArray.push({
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
        });
        await listRule.bindData(dataArray);
    }
}

interface DataForRuleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
}
class RuleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
    private readonly _layoutMyScore!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMyScoreTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyScore!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelStdNoData!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdNickname!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdScore!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listStd!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUserRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);

        this._listStd.setItemRendererClass(UserRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listStd.removeAllItems();

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
        this._updateComponentsForStd();
    }

    private _updateComponentsForLanguage(): void {
        this._labelMyScoreTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0822)}:`);
        this._labelStdNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelStdNickname.setLangText(Lang_Constants.TextType.B0175);
        this._labelStdScore.setLangText(Lang_Constants.TextType.B0579);

        this._layoutMyScore.arrangeItems();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const campaignId    = openData.campaignId;
        const campaignMapId = openData.campaignMapId;
        const dataArray     : DataForUserRenderer[] = [];
        for (const rankData of await Campaigns_Mains_Provider.getCampaignMapLeaderboard(campaignId, campaignMapId) ?? []) {
            const score = rankData.getScore() ?? 0;
            for (const userId of rankData.getUserIdArray()) {
                dataArray.push({
                    index       : 0,
                    rank        : 0,
                    userId      : userId,
                    score       : score,
                    isLast      : false,
                });
            }
        }

        const length = dataArray.length;
        if (length) {
            dataArray.sort((v1, v2) => v2.score - v1.score);

            dataArray[0].rank   = 1;
            dataArray[0].index  = 1;
            for (let i = 1; i < length; ++i) {
                const currentData   = dataArray[i];
                const previousData  = dataArray[i - 1];
                currentData.rank    = currentData.score === previousData.score ? previousData.rank : i + 1;
                currentData.index   = i + 1;
            }

            dataArray[length - 1].isLast = true;
        }

        this._labelStdNoData.setIsVisible(!length);
        await this._listStd.bindData(dataArray);

        const myScore       = Users_Model.getSelfCawHighScoreInfo(campaignId, campaignMapId)?.getHighScore();
        const labelMyScore  = this._labelMyScore;
        if (myScore == null) {
            labelMyScore.setText(`--`);
        } else {
            const rank          = dataArray.find(v => v.score === myScore)?.rank;
            labelMyScore.setText(rank == null ? `${myScore} (--)` : `${myScore} (${rank}${Helpers_Text.getSuffixForRankIndex(rank)})`);
        }
        this._layoutMyScore.arrangeItems();
    }
}

interface DataForUserRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class UserRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottomLine!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public override onItemTapEvent(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId: this.getOpenData()?.userId });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const rank          = openData.rank;
        const labelNickname = this._labelNickname;
        labelNickname.setLangText(Lang_Constants.TextType.B0029);
        this._labelIndex.setText(`${rank}${Helpers_Text.getSuffixForRankIndex(rank)}`);
        this._labelScore.setText(`${openData.score}`);
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottomLine.setIsVisible(openData.isLast);

        const userInfo = Helpers_Misc.getExisted(await Users_Model.getUserPublicInfo(openData.userId));
        labelNickname.setText(userInfo.getNickname() || Lang_Constants.UndefinedError);
    }
}
