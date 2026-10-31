import {
    type Notifications_Mapping,
    Campaigns_Managements_Provider,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";
import type { S as CmSetCampaignNameResponse } from "../../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCreateCampaign!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listCampaign!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgCmCreateCampaign",         callback : this._onNotifyMsgCmCreateCampaign },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnCreateCampaign,  callback : this._onTouchedBtnCreateCampaign },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1134),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => Campaigns_Managements_Gateway.reqCmCreateCampaign(),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaign(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1133);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private _updateTopButtons(): void {
        this._btnCreateCampaign.setIsVisible(Users_Model.getIsSelfCampaignManager());
    }

    private async _updateComponentsForListCampaign(): Promise<void> {
        const label = this._labelNoData;
        const list  = this._listCampaign;
        const campaignIdArray = Users_Model.getIsSelfCampaignManager()
            ? await Campaigns_Managements_Provider.getAllCampaignIdArray()
            : await Campaigns_Managements_Provider.getDesigningCampaignIdArray();
        if (!campaignIdArray?.length) {
            label.setIsVisible(true);
            await list.removeAllItems();
        } else {
            label.setIsVisible(false);

            const dataArray: DataForCampaignRenderer[] = campaignIdArray.sort((v1, v2) => v1 - v2).map(v => ({ index : 0, campaignId : v }));
            for (let i = 0; i < dataArray.length; ++i) {
                dataArray[i].index = i;
            }
            await list.bindData(dataArray);
        }
    }
}

interface DataForCampaignRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    campaignId  : number;
}
class CampaignRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModify!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "MsgCmSetCampaignName",    callback : this._onNotifyMsgCmSetCampaignName },
        ]);
        this._setUiListenerArray([
            { ui : this._btnModify,                      callback : this._onTouchedBtnModify },
        ]);
    }

    protected override _doApplyOpenData(): void {
        // this._imgBg.alpha = this._getData().index % 2 < 1 ? 0.2 : 0.5;

        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCmSetCampaignName(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgCmSetCampaignName"]>): void {
        const data = (e.data as { msg: CmSetCampaignNameResponse }).msg;
        if ((data.getCampaignId() ?? 0) === this.getOpenData()?.campaignId) {
            this._updateLabelName();
        }
    }

    private _onTouchedBtnModify(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CmCampaignCommandsPanel, {
            campaignId : this.getOpenData()?.campaignId,
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setLangText(Lang_Constants.TextType.B0317);
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if (campaignId === this.getOpenData()?.campaignId) {
            label.setText(`#${campaignId} ${Lang_Utils.getLanguageText({ textArray : campaignInfo?.getNameArray() }) ?? Lang_Utils.getText(Lang_Constants.TextType.B0277)}`);
        }
    }
}
