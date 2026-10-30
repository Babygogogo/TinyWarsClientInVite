import { getCampaignInfo } from "../../mains/Provider.ts";
import { reqCmCreateCampaign } from "../Gateway.ts";
import {
    getAllCampaignIdArray,
    getDesigningCampaignIdArray,
} from "../Provider.ts";
import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
} from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import type { S as CmSetCampaignNameResponse } from "../../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import { getIsSelfCampaignManager } from "../../../users/Model.ts";
import type { Event } from "../../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnCreateCampaign!    : IUiButton;

    private readonly _listCampaign!         : IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCmCreateCampaign,         callback: this._onNotifyMsgCmCreateCampaign },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnCreateCampaign,  callback: this._onTouchedBtnCreateCampaign },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCampaign.setItemRendererClass(CampaignRenderer);

        this._updateView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listCampaign.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnCreateCampaign(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getTitle       : () => getText(TextType.B1134),
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqCmCreateCampaign(),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaign(): void {
        showLang(TextType.OperationSucceeded);
        this._updateComponentsForListCampaign();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateTopButtons();
        this._updateComponentsForListCampaign();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1133);
        this._labelNoData.setLangText(TextType.B0278);
    }

    private _updateTopButtons(): void {
        this._btnCreateCampaign.setIsVisible(getIsSelfCampaignManager());
    }

    private async _updateComponentsForListCampaign(): Promise<void> {
        const label = this._labelNoData;
        const list  = this._listCampaign;
        const campaignIdArray = getIsSelfCampaignManager()
            ? await getAllCampaignIdArray()
            : await getDesigningCampaignIdArray();
        if (!campaignIdArray?.length) {
            label.setIsVisible(true);
            await list.removeAllItems();
        } else {
            label.setIsVisible(false);

            const dataArray: DataForCampaignRenderer[] = campaignIdArray.sort((v1, v2) => v1 - v2).map(v => ({ index: 0, campaignId: v }));
            for (let i = 0; i < dataArray.length; ++i) {
                dataArray[i].index = i;
            }
            await list.bindData(dataArray);
        }
    }
}

interface DataForCampaignRenderer extends UiListItemData {
    index       : number;
    campaignId  : number;
}
class CampaignRenderer extends UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;
    private readonly _btnModify!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCmSetCampaignName,    callback: this._onNotifyMsgCmSetCampaignName },
        ]);
        this._setUiListenerArray([
            { ui: this._btnModify,                      callback: this._onTouchedBtnModify },
        ]);
    }

    protected override _doApplyOpenData(): void {
        // this._imgBg.alpha = this._getData().index % 2 < 1 ? 0.2 : 0.5;

        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCmSetCampaignName(e: Event): void {
        const data = e.data as CmSetCampaignNameResponse;
        if ((data.getCampaignId() ?? 0) === this.getOpenData()?.campaignId) {
            this._updateLabelName();
        }
    }

    private _onTouchedBtnModify(): void {
        openPanel(getDict().CmCampaignCommandsPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setLangText(TextType.B0317);
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await getCampaignInfo(campaignId);
        if (campaignId === this.getOpenData()?.campaignId) {
            label.setText(`#${campaignId} ${getLanguageText({ textArray: campaignInfo?.getNameArray() }) ?? getText(TextType.B0277)}`);
        }
    }
}
