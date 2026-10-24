import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SinglePlayerModeModelSpmModel from "../model/SpmModel.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiOpenableComponent from "../../ui/interfaces/IUiOpenableComponent.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = {
    normalMapId   : number | null;
} | null;
export class Page
    extends     UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData>
    implements  UiInterfacesIUiOpenableComponent.IUiOpenableComponent<OpenData>
{
    private readonly _listRule! : UiInterfacesIUiScrollList.IUiScrollList<DataForRuleRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "singlePlayerMode/SpmRankPage.exml");
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
    protected _doApplyOpenData(): void | Promise<void> {
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
        const normalMapId   = this.getOpenData()?.normalMapId;
        const listRule      = this._listRule;
        if (normalMapId == null) {
            await listRule.removeAllItems();
            return;
        }

        const mapRawData    = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        const dataArray     : DataForRuleRenderer[] = [];
        for (const templateWarRule of mapRawData?.getTemplateWarRuleArray().filter(v => v.getRuleAvailability()?.getCanSrw()) ?? []) {
            dataArray.push({
                normalMapId : normalMapId,
                ruleId      : HelpersMisc.getExisted(templateWarRule.getRuleId()),
            });
        }
        await listRule.bindData(dataArray.sort((v1, v2) => v1.ruleId - v2.ruleId));
    }
}

interface DataForRuleRenderer extends UiTypesUiListItemData.UiListItemData {
    normalMapId : number;
    ruleId      : number;
}
class RuleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
    private readonly _layoutMyScore!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMyScoreTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyScore!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelStdTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdNoData!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdNickname!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdScore!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : UiInterfacesIUiLabel.IUiLabel;
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
        this._labelStdNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelStdNickname.setText(LangUtils.getText(LangConstants.TextType.B0175));
        this._labelStdScore.setText(LangUtils.getText(LangConstants.TextType.B0579));
        this._labelTurnIndex.setText(LangUtils.getText(LangConstants.TextType.Turns));

        this._layoutMyScore.arrangeItems();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const ruleId        = openData.ruleId;
        const normalMapId   = openData.normalMapId;
        const configVersion = await GameConfigGcModel.getLatestConfigVersion();
        const selfInfo      = UsersModel.getSelfInfo()?.getUserComplexInfo();
        const selfPrivilege = selfInfo?.getUserPrivilege();
        const hasPrivilege  = (selfPrivilege?.getIsAdmin() || selfPrivilege?.getIsMapCommittee()) ?? false;
        const selfScore     = selfInfo?.getUserWarStatistics()?.getSrwArray()
            .find(v => (v.getNormalMapId() === normalMapId) && (v.getConfigVersion() === configVersion) && (v.getRuleId() === ruleId))?.getHighScore() ?? Number.MIN_SAFE_INTEGER;
        const dataArray     : DataForUserRenderer[] = [];

        for (const rankData of (await SinglePlayerModeModelSpmModel.getRankData(normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray() ?? []) {
            const score = HelpersMisc.getExisted(rankData.getScore());
            dataArray.push({
                index       : 0,
                rankId      : HelpersMisc.getExisted(rankData.getRankId()),
                rank        : 0,
                userId      : HelpersMisc.getExisted(rankData.getUserId()),
                score,
                turnIndex   : HelpersMisc.getExisted(rankData.getTurnIndex()),
                canReplay   : (hasPrivilege) || (selfScore >= score),
                isLast      : false,
            });
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

        this._labelStdTitle.setText(`R${ruleId}`);
        this._labelStdNoData.setIsVisible(!length);
        await this._listStd.bindData(dataArray);

        const myScore = UsersModel.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray()
            .find(v => (v.getNormalMapId() === normalMapId) && (v.getConfigVersion() === configVersion) && (v.getRuleId() === ruleId))
            ?.getHighScore();
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
    rankId      : number;
    rank        : number;
    userId      : number;
    score       : number;
    turnIndex   : number;
    canReplay   : boolean;
    isLast      : boolean;
}
class UserRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottomLine!    : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIndex!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTurnIndex!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTurnIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgReplay!        : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgBg,              callback: this._onTouchedImgBg },
            { ui: this._groupTurnIndex,     callback: this._onTouchedGroupTurnIndex },
        ]);
        this._imgBg.setIsTouchEnabled(true);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgBg(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: openData.userId });
    }
    private async _onTouchedGroupTurnIndex(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (!openData.canReplay) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: openData.userId });
        } else {
            const replayData = await SinglePlayerModeModelSpmModel.getReplayData(openData.rankId);
            (replayData) && (HelpersGameFlow.gotoReplayWar(replayData, -1));
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

        const rank                  = openData.rank;
        const labelNickname         = this._labelNickname;
        labelNickname.setText(LangUtils.getText(LangConstants.TextType.B0029));
        this._labelIndex.setText(`${rank}${HelpersText.getSuffixForRankIndex(rank)}`);
        this._labelScore.setText(`${openData.score}`);
        this._labelTurnIndex.setText(`${openData.turnIndex}`);
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottomLine.setIsVisible(openData.isLast);
        this._imgReplay.setIsVisible(openData.canReplay);

        const userInfo = HelpersMisc.getExisted(await UsersModel.getUserPublicInfo(openData.userId));
        labelNickname.setText(userInfo.getNickname() || LangConstants.UndefinedError);
    }
}
