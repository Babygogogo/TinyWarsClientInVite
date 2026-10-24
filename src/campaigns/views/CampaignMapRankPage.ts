import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _listRule! : UiInterfacesIUiScrollList.IUiScrollList<DataForRuleRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignMapRankPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
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

interface DataForRuleRenderer extends UiTypesUiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
}
class RuleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
    private readonly _layoutMyScore!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMyScoreTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyScore!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelStdNoData!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdNickname!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdScore!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listStd!              : UiInterfacesIUiScrollList.IUiScrollList<DataForUserRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        this._labelMyScoreTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0822)}:`);
        this._labelStdNoData.setLangText(LangConstants.TextType.B0278);
        this._labelStdNickname.setLangText(LangConstants.TextType.B0175);
        this._labelStdScore.setLangText(LangConstants.TextType.B0579);

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
        for (const rankData of await CampaignsMainsProvider.getCampaignMapLeaderboard(campaignId, campaignMapId) ?? []) {
            const score = rankData.getScore() ?? 0;
            for (const userId of rankData.getUserIdArray() ?? []) {
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

        const myScore       = UsersModel.getSelfCawHighScoreInfo(campaignId, campaignMapId)?.getHighScore();
        const labelMyScore  = this._labelMyScore;
        if (myScore == null) {
            labelMyScore.setText(`--`);
        } else {
            const rank          = dataArray.find(v => v.score === myScore)?.rank;
            labelMyScore.setText(rank == null ? `${myScore} (--)` : `${myScore} (${rank}${HelpersText.getSuffixForRankIndex(rank)})`);
        }
        this._layoutMyScore.arrangeItems();
    }
}

interface DataForUserRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class UserRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottomLine!    : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIndex!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public override onItemTapEvent(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: this.getOpenData()?.userId });
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
        labelNickname.setLangText(LangConstants.TextType.B0029);
        this._labelIndex.setText(`${rank}${HelpersText.getSuffixForRankIndex(rank)}`);
        this._labelScore.setText(`${openData.score}`);
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottomLine.setIsVisible(openData.isLast);

        const userInfo = HelpersMisc.getExisted(await UsersModel.getUserPublicInfo(openData.userId));
        labelNickname.setText(userInfo.getNickname() || LangConstants.UndefinedError);
    }
}
