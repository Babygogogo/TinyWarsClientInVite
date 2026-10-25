import { getCampaignMapLeaderboard } from "../mains/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getSuffixForRankIndex } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { getSelfCawHighScoreInfo, getUserPublicInfo } from "../../users/Model.ts";

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _listRule! : IUiScrollList<DataForRuleRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "campaigns/views/CampaignMapRankPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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

interface DataForRuleRenderer extends UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
}
class RuleRenderer extends UiListItemRenderer<DataForRuleRenderer> {
    private readonly _layoutMyScore!        : IUiLayout;
    private readonly _labelMyScoreTitle!    : IUiLabel;
    private readonly _labelMyScore!         : IUiLabel;

    private readonly _labelStdNoData!       : IUiLabel;
    private readonly _labelStdNickname!     : IUiLabel;
    private readonly _labelStdScore!        : IUiLabel;
    private readonly _listStd!              : IUiScrollList<DataForUserRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        this._labelMyScoreTitle.setText(`${getText(TextType.B0822)}:`);
        this._labelStdNoData.setLangText(TextType.B0278);
        this._labelStdNickname.setLangText(TextType.B0175);
        this._labelStdScore.setLangText(TextType.B0579);

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
        for (const rankData of await getCampaignMapLeaderboard(campaignId, campaignMapId) ?? []) {
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

        const myScore       = getSelfCawHighScoreInfo(campaignId, campaignMapId)?.getHighScore();
        const labelMyScore  = this._labelMyScore;
        if (myScore == null) {
            labelMyScore.setText(`--`);
        } else {
            const rank          = dataArray.find(v => v.score === myScore)?.rank;
            labelMyScore.setText(rank == null ? `${myScore} (--)` : `${myScore} (${rank}${getSuffixForRankIndex(rank)})`);
        }
        this._layoutMyScore.arrangeItems();
    }
}

interface DataForUserRenderer extends UiListItemData {
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class UserRenderer extends UiListItemRenderer<DataForUserRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgBottomLine!    : IUiImage;
    private readonly _labelIndex!       : IUiLabel;
    private readonly _labelNickname!    : IUiLabel;
    private readonly _labelScore!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public override onItemTapEvent(): void {
        openPanel(getDict().UserPanel, { userId: this.getOpenData()?.userId });
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
        labelNickname.setLangText(TextType.B0029);
        this._labelIndex.setText(`${rank}${getSuffixForRankIndex(rank)}`);
        this._labelScore.setText(`${openData.score}`);
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottomLine.setIsVisible(openData.isLast);

        const userInfo = getExisted(await getUserPublicInfo(openData.userId));
        labelNickname.setText(userInfo.getNickname() || UndefinedError);
    }
}
