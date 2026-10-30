import {
    Campaigns_Views_CampaignInfoPage,
    Campaigns_Views_CampaignRankPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    Tween_Executor,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Campaigns_Views_CampaignInfoPage.OpenData | Campaigns_Views_CampaignRankPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCampaign!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseCampaign!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelp!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCampaignList!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCampaign!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoCampaign!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listCampaign.setItemRendererClass(CampaignRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listCampaign.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public setAndReviseSelectedCampaignId(newCampaignId: number | null): void {
        const listCampaign  = this._listCampaign;
        const newIndex      = listCampaign.getRevisedFirstIndex(v => v?.campaignId === newCampaignId);
        listCampaign.setSelectedItemIndex(newIndex);
        this._updateComponentsForPreviewingCampaignInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0711),
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        if (campaignId != null) {
            this.closePanel();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateMapsPanel, {
                campaignId  : campaignId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray         = await this._createDataArrayForListCampaign();
        const listCampaign      = this._listCampaign;
        const labelNoCampaign   = this._labelNoCampaign;
        const btnNextStep       = this._btnNextStep;
        if (dataArray.length <= 0) {
            btnNextStep.setIsVisible(false);
            labelNoCampaign.setIsVisible(true);
            listCampaign.setIsVisible(false);
            await listCampaign.removeAllItems();
        } else {
            btnNextStep.setIsVisible(true);
            labelNoCampaign.setIsVisible(false);
            listCampaign.setIsVisible(true);
            await listCampaign.bindData(dataArray);

            this.setAndReviseSelectedCampaignId(null);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelSinglePlayer.setLangText(Lang_Constants.TextType.B0138);
        this._labelCampaign.setLangText(Lang_Constants.TextType.B1135);
        this._labelChooseCampaign.setLangText(Lang_Constants.TextType.B0085);
        this._labelNoCampaign.setLangText(Lang_Constants.TextType.B0278);
        this._btnHelp.setLangText(Lang_Constants.TextType.B0143);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0566);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0423) },
                pageClass   : Campaigns_Views_CampaignInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0436) },
                pageClass   : Campaigns_Views_CampaignRankPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCampaignInfoPage(),
            this._updateCampaignRankPage(),
        ]);
    }

    private async _createDataArrayForListCampaign(): Promise<DataForCampaignRenderer[]> {
        const dataArray: DataForCampaignRenderer[] = [];
        for (const campaignId of await Campaigns_Mains_Provider.getEnabledCampaignIdArray() ?? []) {
            dataArray.push({
                campaignId  : campaignId,
                panel       : this,
            });
        }

        return dataArray.sort((v1, v2) => v1.campaignId - v2.campaignId);
    }

    private async _updateComponentsForPreviewingCampaignInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        if (this._listCampaign.getFirstSelectedData()?.campaignId == null) {
            groupTab.setIsVisible(false);
            btnNextStep.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);
            btnNextStep.setIsVisible(true);

            this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCampaignInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCampaignInfoPage());
        }
    }

    private _updateCampaignRankPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCampaignRankPage());
        }
    }

    private async _createDataForCampaignInfoPage(): Promise<Campaigns_Views_CampaignInfoPage.OpenData> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
            };
    }

    private _createDataForCampaignRankPage(): Campaigns_Views_CampaignRankPage.OpenData {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
            };
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForCampaignRenderer extends Ui_Types_UiListItemData.UiListItemData {
    campaignId  : number;
    panel       : Panel;
}
class CampaignRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForCampaignRenderer>
{
    private readonly _imgComplete!  : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        this._updateImgComplete();
        this._updateLabelName();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedCampaignId(openData.campaignId);
    }

    private async _updateImgComplete(): Promise<void> {
        const img = this._imgComplete;
        img.setIsVisible(false);

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if ((campaignId !== this.getOpenData()?.campaignId) || (campaignInfo == null)) {
            return;
        }

        for (const mapId of new Set(campaignInfo.getEnabledCampaignMapIdArray())) {
            if (Users_Model.getSelfCawHighScoreInfo(campaignId, mapId)?.getHighScore() == null) {
                return;
            }
        }

        img.setIsVisible(true);
    }

    private async _updateLabelName(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }
        this._labelId.setText(`#${campaignId}`);

        const labelName = this._labelName;
        labelName.setText(``);
        const nameArray = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getNameArray();
        if (campaignId === this.getOpenData()?.campaignId) {
            labelName.setText(Lang_Utils.getLanguageText({ textArray: nameArray }) ?? Lang_Constants.UndefinedError);
        }

        this._layoutName.arrangeItems();
    }
}

interface DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}
