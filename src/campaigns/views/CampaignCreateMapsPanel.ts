import {
    getCampaignInfo,
    getCampaignMapRawData,
} from "../mains/Provider.ts";
import {
    type OpenData as CampaignMapInfoPageOpenData,
    Page as CampaignMapInfoPage,
} from "./CampaignMapInfoPage.ts";
import {
    type OpenData as CampaignMapRankPageOpenData,
    Page as CampaignMapRankPage,
} from "./CampaignMapRankPage.ts";
import { getLatestConfigVersion } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    getSelfUserId,
    getSelfCawHighScoreInfo,
} from "../../users/Model.ts";

export interface OpenData {
    campaignId      : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CampaignMapInfoPageOpenData | CampaignMapRankPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelSinglePlayer!    : IUiLabel;
    private readonly _labelCampaign!        : IUiLabel;
    private readonly _labelChooseCampaign!  : IUiLabel;
    private readonly _labelChooseMap!       : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupCampaignList!    : IUiContainer;
    private readonly _listCampaign!         : IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoCampaign!      : IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCampaignValidateWar,  callback: this._onNotifyMsgCampaignValidateWar },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        openPanel(getDict().CampaignCreateCampaignsPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        if (campaignMapId != null) {
            openPanel(getDict().CampaignCreateQuickSettingsPanel, {
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
        this._labelSinglePlayer.setLangText(TextType.B0138);
        this._labelCampaign.setLangText(TextType.B1135);
        this._labelChooseCampaign.setLangText(TextType.B0085);
        this._labelChooseMap.setLangText(TextType.B1082);
        this._labelNoCampaign.setLangText(TextType.B0278);
        this._btnBack.setLangText(TextType.B0146);
        this._btnNextStep.setLangText(TextType.B0566);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: getText(TextType.B0423) },
                pageClass   : CampaignMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0436) },
                pageClass   : CampaignMapRankPage,
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

        const campaignInfo              = await getCampaignInfo(campaignId);
        const enabledCampaignMapIdArray = campaignInfo?.getEnabledCampaignMapIdArray() ?? [];
        const selfUserId                = getSelfUserId();
        const isDesigner                = (selfUserId != null) && ((campaignInfo?.getDesignerUserIdArray().indexOf(selfUserId) ?? -1) >= 0);
        const dataArray                 : DataForCampaignMapRenderer[] = [];
        for (const campaignMapId of campaignInfo?.getAllCampaignMapIdArray() ?? []) {
            if (enabledCampaignMapIdArray.indexOf(campaignMapId) < 0) {
                continue;
            }

            if ((!dataArray.length)                                                                                         ||
                (isDesigner)                                                                                                ||
                (getSelfCawHighScoreInfo(campaignId, dataArray[dataArray.length - 1].campaignMapId) != null)
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

    private async _createDataForCampaignMapInfoPage(): Promise<CampaignMapInfoPageOpenData> {
        const campaignMapId = this._listCampaign.getFirstSelectedData()?.campaignMapId;
        const campaignId    = this.getOpenData()?.campaignId;
        return ((campaignMapId == null) || (campaignId == null))
            ? null
            : {
                campaignId      : campaignId,
                campaignMapId   : campaignMapId,
            };
    }

    private _createDataForCampaignMapRankPage(): CampaignMapRankPageOpenData {
        const selectedData = this._listCampaign.getFirstSelectedData();
        return selectedData == null
            ? null
            : {
                campaignId      : selectedData.campaignId,
                campaignMapId   : selectedData.campaignMapId,
            };
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._groupCampaignList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });

        await wait();
    }
}

interface DataForCampaignMapRenderer extends UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    panel           : Panel;
}
class CampaignMapRenderer extends UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelName!    : IUiLabel;
    private readonly _labelId!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            getCampaignMapRawData(campaignId, campaignMapId),
            getLatestConfigVersion()
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        labelName.setText(getLanguageText({ textArray: mapRawData?.getMapNameArray() }) ?? UndefinedError);

        const cawHighScoreInfo = getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            labelId.setText(`#${campaignId}-${campaignMapId}`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                labelId.setText(`#${campaignId}-${campaignMapId} ${getText(TextType.B0121)}`);
            } else {
                labelId.setText(`#${campaignId}-${campaignMapId} ${getText(TextType.B0907)}: ${highScore}`);
            }
        }
        this._layoutName.arrangeItems();
    }
}

interface DataForTabItemRenderer extends UiListItemData {
    name: string;
}
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }
}
