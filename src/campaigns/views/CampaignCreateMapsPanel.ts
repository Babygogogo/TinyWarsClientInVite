import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as CampaignsViewsCampaignMapInfoPage from "./CampaignMapInfoPage.ts";
import * as CampaignsViewsCampaignMapRankPage from "./CampaignMapRankPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

export interface OpenData {
    campaignId      : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CampaignsViewsCampaignMapInfoPage.OpenData | CampaignsViewsCampaignMapRankPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCampaign!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseCampaign!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseMap!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCampaignList!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCampaign!         : UiInterfacesIUiScrollList.IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoCampaign!      : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCampaignValidateWar,  callback: this._onNotifyMsgCampaignValidateWar },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        const newIndex      = HelpersMisc.getExisted(listCampaign.getRevisedFirstIndex(v => v?.campaignMapId === newCampaignMapId));
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateCampaignsPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        if (campaignMapId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateQuickSettingsPanel, {
                campaignId      : this.getOpenData()?.campaignId,
                campaignMapId   : campaignMapId,
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
        this._labelSinglePlayer.setText(LangUtils.getText(LangConstants.TextType.B0138));
        this._labelCampaign.setText(LangUtils.getText(LangConstants.TextType.B1135));
        this._labelChooseCampaign.setText(LangUtils.getText(LangConstants.TextType.B0085));
        this._labelChooseMap.setText(LangUtils.getText(LangConstants.TextType.B1082));
        this._labelNoCampaign.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B0566));

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0423) },
                pageClass   : CampaignsViewsCampaignMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0436) },
                pageClass   : CampaignsViewsCampaignMapRankPage.Page,
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

        const campaignInfo              = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        const enabledCampaignMapIdArray = campaignInfo?.getEnabledCampaignMapIdArray() ?? [];
        const selfUserId                = UsersModel.getSelfUserId();
        const isDesigner                = (selfUserId != null) && ((campaignInfo?.getDesignerUserIdArray().indexOf(selfUserId) ?? -1) >= 0);
        const dataArray                 : DataForCampaignMapRenderer[] = [];
        for (const campaignMapId of campaignInfo?.getAllCampaignMapIdArray() ?? []) {
            if (enabledCampaignMapIdArray.indexOf(campaignMapId) < 0) {
                continue;
            }

            if ((!dataArray.length)                                                                                         ||
                (isDesigner)                                                                                                ||
                (UsersModel.getSelfCawHighScoreInfo(campaignId, dataArray[dataArray.length - 1].campaignMapId) != null)
            ) {
                dataArray.push({
                    campaignId      : campaignId,
                    campaignMapId   : campaignMapId,
                    panel           : this,
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

    private async _createDataForCampaignMapInfoPage(): Promise<CampaignsViewsCampaignMapInfoPage.OpenData> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        const campaignId    = this.getOpenData()?.campaignId;
        return ((campaignMapId == null) || (campaignId == null))
            ? null
            : {
                campaignId      : campaignId,
                campaignMapId   : campaignMapId,
            };
    }

    private _createDataForCampaignMapRankPage(): CampaignsViewsCampaignMapRankPage.OpenData {
        const selectedData = this._listCampaign.getFirstSelectedData();
        return selectedData == null
            ? null
            : {
                campaignId      : selectedData.campaignId,
                campaignMapId   : selectedData.campaignMapId,
            };
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });

        await TimerTimerModel.wait();
    }
}

interface DataForCampaignMapRenderer extends UiTypesUiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    panel           : Panel;
}
class CampaignMapRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId),
            GameConfigGcModel.getLatestConfigVersion()
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        labelName.setText(LangUtils.getLanguageText({ textArray: mapRawData?.getMapNameArray() }) ?? LangConstants.UndefinedError);

        const cawHighScoreInfo = UsersModel.getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            labelId.setText(`#${campaignId}-${campaignMapId}`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                labelId.setText(`#${campaignId}-${campaignMapId} ${LangUtils.getText(LangConstants.TextType.B0121)}`);
            } else {
                labelId.setText(`#${campaignId}-${campaignMapId} ${LangUtils.getText(LangConstants.TextType.B0907)}: ${highScore}`);
            }
        }
        this._layoutName.arrangeItems();
    }
}

interface DataForTabItemRenderer extends UiTypesUiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends UiComponentsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }
}
