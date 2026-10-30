import {
    Campaigns_Views_CampaignMapInfoPage,
    Campaigns_Views_CampaignMapRankPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    Tween_Executor,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Lang_Utils,
    GameConfigs_Provider,
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

export interface OpenData {
    campaignId      : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Campaigns_Views_CampaignMapInfoPage.OpenData | Campaigns_Views_CampaignMapRankPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCampaign!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseCampaign!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseMap!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCampaignList!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCampaign!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoCampaign!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgCampaignValidateWar,  callback : this._onNotifyMsgCampaignValidateWar },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listCampaign.setItemRendererClass(CampaignMapRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateGroupTab();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupMapList();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listCampaign.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedCampaignMapId(newCampaignMapId: number | null): Promise<void> {
        const listCampaign  = this._listCampaign;
        const newIndex      = listCampaign.getRevisedFirstIndex(v => v?.campaignMapId === newCampaignMapId);
        listCampaign.setSelectedItemIndex(newIndex);

        this._updateBtnNextStep();
        await this._updateGroupTab();
    }
    private _getSelectedCampaignMapId(): number | undefined {
        return this._listCampaign.getFirstSelectedData()?.campaignMapId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateCampaignsPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        if (campaignMapId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateQuickSettingsPanel, {
                campaignId    : this.getOpenData()?.campaignId,
                campaignMapId : campaignMapId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCampaignValidateWar(): void {
        this._updateGroupMapList();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateGroupMapList(): Promise<void> {
        const labelNoCampaign   = this._labelNoCampaign;
        labelNoCampaign.setIsVisible(false);

        const listCampaign  = this._listCampaign;
        const dataArray     = await this._createDataArrayForListCampaign();
        labelNoCampaign.setIsVisible(!dataArray.length);
        await listCampaign.bindData(dataArray);
        await this.setAndReviseSelectedCampaignMapId(null);
    }

    private async _updateGroupTab(): Promise<void> {
        const groupTab = this._groupTab;
        if (this._getSelectedCampaignMapId() == null) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            await Promise.all([
                this._updateCampaignMapInfoPage(),
                this._updateCampaignRankPage(),
            ]);
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible(this._getSelectedCampaignMapId() != null);
    }

    private _updateComponentsForLanguage(): void {
        this._labelSinglePlayer.setLangText(Lang_Constants.TextType.B0138);
        this._labelCampaign.setLangText(Lang_Constants.TextType.B1135);
        this._labelChooseCampaign.setLangText(Lang_Constants.TextType.B0085);
        this._labelChooseMap.setLangText(Lang_Constants.TextType.B1082);
        this._labelNoCampaign.setLangText(Lang_Constants.TextType.B0278);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0566);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0423) },
                pageClass   : Campaigns_Views_CampaignMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0436) },
                pageClass   : Campaigns_Views_CampaignMapRankPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }

    private async _createDataArrayForListCampaign(): Promise<DataForCampaignMapRenderer[]> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return [];
        }

        const campaignInfo              = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        const enabledCampaignMapIdArray = campaignInfo?.getEnabledCampaignMapIdArray() ?? [];
        const selfUserId                = Users_Model.getSelfUserId();
        const isDesigner                = (selfUserId != null) && ((campaignInfo?.getDesignerUserIdArray().indexOf(selfUserId) ?? -1) >= 0);
        const dataArray                 : DataForCampaignMapRenderer[] = [];
        for (const campaignMapId of campaignInfo?.getAllCampaignMapIdArray() ?? []) {
            if (enabledCampaignMapIdArray.indexOf(campaignMapId) < 0) {
                continue;
            }

            if ((!dataArray.length)                                                                                         ||
                (isDesigner)                                                                                                ||
                (Users_Model.getSelfCawHighScoreInfo(campaignId, dataArray[dataArray.length - 1].campaignMapId) != null)
            ) {
                dataArray.push({
                    campaignId    : campaignId,
                    campaignMapId : campaignMapId,
                    panel         : this,
                });
            }
        }

        return dataArray.sort((v1, v2) => v1.campaignMapId - v2.campaignMapId);
    }

    private async _updateCampaignMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCampaignMapInfoPage());
        }
    }

    private _updateCampaignRankPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCampaignMapRankPage());
        }
    }

    private async _createDataForCampaignMapInfoPage(): Promise<Campaigns_Views_CampaignMapInfoPage.OpenData> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        const campaignId    = this.getOpenData()?.campaignId;
        return ((campaignMapId == null) || (campaignId == null))
            ? null
            : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
            };
    }

    private _createDataForCampaignMapRankPage(): Campaigns_Views_CampaignMapRankPage.OpenData {
        const selectedData = this._listCampaign.getFirstSelectedData();
        return selectedData == null
            ? null
            : {
                campaignId    : selectedData.campaignId,
                campaignMapId : selectedData.campaignMapId,
            };
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCampaignList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCampaignList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForCampaignMapRenderer extends Ui_Types_UiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    panel           : Panel;
}
class CampaignMapRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedCampaignMapId(openData.campaignMapId);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabels();
    }

    private async _updateLabels(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { campaignId, campaignMapId } = openData;
        const labelId                       = this._labelId;
        const labelName                     = this._labelName;
        labelId.setText(``);
        labelName.setText(``);

        const [mapRawData, configVersion] = await Promise.all([
            Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId),
            GameConfigs_Provider.getLatestConfigVersion(),
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        labelName.setText(Lang_Utils.getLanguageText({ textArray : mapRawData?.getMapNameArray() }) ?? Lang_Constants.UndefinedError);

        const cawHighScoreInfo = Users_Model.getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            labelId.setText(`#${campaignId}-${campaignMapId}`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                labelId.setText(`#${campaignId}-${campaignMapId} ${Lang_Utils.getText(Lang_Constants.TextType.B0121)}`);
            } else {
                labelId.setText(`#${campaignId}-${campaignMapId} ${Lang_Utils.getText(Lang_Constants.TextType.B0907)}: ${highScore}`);
            }
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
