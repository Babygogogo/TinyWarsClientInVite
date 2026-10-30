import {
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    SinglePlayerMode_Model_SpmModel,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    Helpers_Text,
    Lang_Utils,
    Helpers_GameFlow,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
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
    type Ui_Interfaces_IUiOpenableComponent,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    normalMapId   : number | null;
} | null;
export class Page
    extends     Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData>
    implements  Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData> {
    private readonly _listRule! : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRuleRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "singlePlayerMode/SpmRankPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
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

        const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        const dataArray     : DataForRuleRenderer[] = [];
        for (const templateWarRule of mapRawData?.getTemplateWarRuleArray().filter(v => v.getRuleAvailability()?.getCanSrw()) ?? []) {
            dataArray.push({
                normalMapId : normalMapId,
                ruleId      : templateWarRule.getRuleId(),
            });
        }
        await listRule.bindData(dataArray.sort((v1, v2) => v1.ruleId - v2.ruleId));
    }
}

interface DataForRuleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    normalMapId : number;
    ruleId      : number;
}
class RuleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
    private readonly _layoutMyScore!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMyScoreTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyScore!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelStdTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdNoData!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdNickname!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdScore!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listStd!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUserRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,        callback : this._onNotifyLanguageChanged },
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
        this._labelTurnIndex.setLangText(Lang_Constants.TextType.Turns);

        this._layoutMyScore.arrangeItems();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const ruleId        = openData.ruleId;
        const normalMapId   = openData.normalMapId;
        const configVersion = await GameConfigs_Provider.getLatestConfigVersion();
        const selfInfo      = Users_Model.getSelfInfo()?.getUserComplexInfo();
        const selfPrivilege = selfInfo?.getUserPrivilege();
        const hasPrivilege  = (selfPrivilege?.getIsAdmin() || selfPrivilege?.getIsMapCommittee()) ?? false;
        const selfScore     = selfInfo?.getUserWarStatistics()?.getSrwArray()
            .find(v => (v.getNormalMapId() === normalMapId) && (v.getConfigVersion() === configVersion) && (v.getRuleId() === ruleId))?.getHighScore() ?? Number.MIN_SAFE_INTEGER;
        const dataArray     : DataForUserRenderer[] = [];

        for (const rankData of (await SinglePlayerMode_Model_SpmModel.getRankData(normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray() ?? []) {
            const score = Helpers_Misc.getExisted(rankData.getScore());
            dataArray.push({
                index     : 0,
                rankId    : Helpers_Misc.getExisted(rankData.getRankId()),
                rank      : 0,
                userId    : Helpers_Misc.getExisted(rankData.getUserId()),
                score,
                turnIndex : Helpers_Misc.getExisted(rankData.getTurnIndex()),
                canReplay : (hasPrivilege) || (selfScore >= score),
                isLast    : false,
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

        const myScore = Users_Model.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray()
            .find(v => (v.getNormalMapId() === normalMapId) && (v.getConfigVersion() === configVersion) && (v.getRuleId() === ruleId))
            ?.getHighScore();
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
    rankId      : number;
    rank        : number;
    userId      : number;
    score       : number;
    turnIndex   : number;
    canReplay   : boolean;
    isLast      : boolean;
}
class UserRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottomLine!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTurnIndex!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTurnIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgReplay!        : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._imgBg,              callback : this._onTouchedImgBg },
            { ui : this._groupTurnIndex,     callback : this._onTouchedGroupTurnIndex },
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : openData.userId });
    }
    private async _onTouchedGroupTurnIndex(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (!openData.canReplay) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : openData.userId });
        } else {
            const replayData = await SinglePlayerMode_Model_SpmModel.getReplayData(openData.rankId);
            (replayData) && (Helpers_GameFlow.gotoReplayWar(replayData, -1));
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
        labelNickname.setLangText(Lang_Constants.TextType.B0029);
        this._labelIndex.setText(`${rank}${Helpers_Text.getSuffixForRankIndex(rank)}`);
        this._labelScore.setText(`${openData.score}`);
        this._labelTurnIndex.setText(`${openData.turnIndex}`);
        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottomLine.setIsVisible(openData.isLast);
        this._imgReplay.setIsVisible(openData.canReplay);

        const userInfo = Helpers_Misc.getExisted(await Users_Model.getUserPublicInfo(openData.userId));
        labelNickname.setText(userInfo.getNickname() || Lang_Constants.UndefinedError);
    }
}
