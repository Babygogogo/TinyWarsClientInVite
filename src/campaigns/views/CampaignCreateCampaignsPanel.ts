import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as CampaignsViewsCampaignInfoPage from "./CampaignInfoPage.ts";
import * as CampaignsViewsCampaignRankPage from "./CampaignRankPage.ts";
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
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CampaignsViewsCampaignInfoPage.OpenData | CampaignsViewsCampaignRankPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCampaign!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseCampaign!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelp!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCampaignList!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCampaign!         : UiInterfacesIUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoCampaign!      : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        const newIndex      = HelpersMisc.getExisted(listCampaign.getRevisedFirstIndex(v => v?.campaignId === newCampaignId));
        listCampaign.setSelectedItemIndex(newIndex);
        this._updateComponentsForPreviewingCampaignInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0711),
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        if (campaignId != null) {
            this.closePanel();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateMapsPanel, {
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
        this._labelSinglePlayer.setText(LangUtils.getText(LangConstants.TextType.B0138));
        this._labelCampaign.setText(LangUtils.getText(LangConstants.TextType.B1135));
        this._labelChooseCampaign.setText(LangUtils.getText(LangConstants.TextType.B0085));
        this._labelNoCampaign.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnHelp.setText(LangUtils.getText(LangConstants.TextType.B0143));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B0566));

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0423) },
                pageClass   : CampaignsViewsCampaignInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0436) },
                pageClass   : CampaignsViewsCampaignRankPage.Page,
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
        for (const campaignId of await CampaignsMainsProvider.getEnabledCampaignIdArray() ?? []) {
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

    private async _createDataForCampaignInfoPage(): Promise<CampaignsViewsCampaignInfoPage.OpenData> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
            };
    }

    private _createDataForCampaignRankPage(): CampaignsViewsCampaignRankPage.OpenData {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
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
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
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
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
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

interface DataForCampaignRenderer extends UiTypesUiListItemData.UiListItemData {
    campaignId  : number;
    panel       : Panel;
}
class CampaignRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForCampaignRenderer>
{
    private readonly _imgComplete!  : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;

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

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if ((campaignId !== this.getOpenData()?.campaignId) || (campaignInfo == null)) {
            return;
        }

        for (const mapId of new Set(campaignInfo.getEnabledCampaignMapIdArray())) {
            if (UsersModel.getSelfCawHighScoreInfo(campaignId, mapId)?.getHighScore() == null) {
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
        const nameArray = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getNameArray();
        if (campaignId === this.getOpenData()?.campaignId) {
            labelName.setText(LangUtils.getLanguageText({ textArray: nameArray }) ?? LangConstants.UndefinedError);
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
