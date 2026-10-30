import {
    getEnabledCampaignIdArray,
    getCampaignInfo,
} from "../mains/Provider.ts";
import {
    type OpenData as CampaignInfoPageOpenData,
    Page as CampaignInfoPage,
} from "./CampaignInfoPage.ts";
import {
    type OpenData as CampaignRankPageOpenData,
    Page as CampaignRankPage,
} from "./CampaignRankPage.ts";
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
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfCawHighScoreInfo } from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CampaignInfoPageOpenData | CampaignRankPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelSinglePlayer!    : IUiLabel;
    private readonly _labelCampaign!        : IUiLabel;
    private readonly _labelChooseCampaign!  : IUiLabel;

    private readonly _groupHelp!            : IUiContainer;
    private readonly _btnHelp!              : IUiButton;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupCampaignList!    : IUiContainer;
    private readonly _listCampaign!         : IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoCampaign!      : IUiLabel;

    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0711),
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        if (campaignId != null) {
            this.closePanel();
            openPanel(getDict().CampaignCreateMapsPanel, {
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
        this._labelSinglePlayer.setLangText(TextType.B0138);
        this._labelCampaign.setLangText(TextType.B1135);
        this._labelChooseCampaign.setLangText(TextType.B0085);
        this._labelNoCampaign.setLangText(TextType.B0278);
        this._btnHelp.setLangText(TextType.B0143);
        this._btnBack.setLangText(TextType.B0146);
        this._btnNextStep.setLangText(TextType.B0566);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: getText(TextType.B0423) },
                pageClass   : CampaignInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0436) },
                pageClass   : CampaignRankPage,
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
        for (const campaignId of await getEnabledCampaignIdArray() ?? []) {
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

    private async _createDataForCampaignInfoPage(): Promise<CampaignInfoPageOpenData> {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
            };
    }

    private _createDataForCampaignRankPage(): CampaignRankPageOpenData {
        const campaignId = this._listCampaign.getFirstSelectedData()?.campaignId;
        return campaignId == null
            ? null
            : {
                campaignId  : campaignId,
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
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
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
            obj         : this._groupHelp,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
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

interface DataForCampaignRenderer extends UiListItemData {
    campaignId  : number;
    panel       : Panel;
}
class CampaignRenderer
    extends     UiListItemRenderer<DataForCampaignRenderer>
    implements  IUiListItemRenderer<DataForCampaignRenderer>
{
    private readonly _imgComplete!  : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelName!    : IUiLabel;
    private readonly _labelId!      : IUiLabel;

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

        const campaignInfo = await getCampaignInfo(campaignId);
        if ((campaignId !== this.getOpenData()?.campaignId) || (campaignInfo == null)) {
            return;
        }

        for (const mapId of new Set(campaignInfo.getEnabledCampaignMapIdArray())) {
            if (getSelfCawHighScoreInfo(campaignId, mapId)?.getHighScore() == null) {
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
        const nameArray = (await getCampaignInfo(campaignId))?.getNameArray();
        if (campaignId === this.getOpenData()?.campaignId) {
            labelName.setText(getLanguageText({ textArray: nameArray }) ?? UndefinedError);
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
