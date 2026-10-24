import * as CampaignsMainsProvider from "../../mains/Provider.ts";
import * as CampaignsManagementsGateway from "../Gateway.ts";
import * as CampaignsManagementsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS from "../../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../../users/Model.ts";
import type * as VendorEgretEgret from "../../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCreateCampaign!    : UiInterfacesIUiButton.IUiButton;

    private readonly _listCampaign!         : UiInterfacesIUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCmCreateCampaign,         callback: this._onNotifyMsgCmCreateCampaign },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1134),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => CampaignsManagementsGateway.reqCmCreateCampaign(),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaign(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1133));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private _updateTopButtons(): void {
        this._btnCreateCampaign.setIsVisible(UsersModel.getIsSelfCampaignManager());
    }

    private async _updateComponentsForListCampaign(): Promise<void> {
        const label = this._labelNoData;
        const list  = this._listCampaign;
        const campaignIdArray = UsersModel.getIsSelfCampaignManager()
            ? await CampaignsManagementsProvider.getAllCampaignIdArray()
            : await CampaignsManagementsProvider.getDesigningCampaignIdArray();
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

interface DataForCampaignRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    campaignId  : number;
}
class CampaignRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModify!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignName,    callback: this._onNotifyMsgCmSetCampaignName },
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
    private _onNotifyMsgCmSetCampaignName(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS.S;
        if ((data.getCampaignId() ?? 0) === this.getOpenData()?.campaignId) {
            this._updateLabelName();
        }
    }

    private _onTouchedBtnModify(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CmCampaignCommandsPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setText(LangUtils.getText(LangConstants.TextType.B0317));
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if (campaignId === this.getOpenData()?.campaignId) {
            label.setText(`#${campaignId} ${LangUtils.getLanguageText({ textArray: campaignInfo?.getNameArray() }) ?? LangUtils.getText(LangConstants.TextType.B0277)}`);
        }
    }
}
