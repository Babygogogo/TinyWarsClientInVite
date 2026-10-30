import {
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddDesigner!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listDesigner!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgCmUpdateCampaignDesigners,    callback : this._onNotifyMsgCmUpdateCampaignDesigners },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnAddDesigner,     callback : this._onTouchedBtnAddDesigner },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listDesigner.setItemRendererClass(CampaignRenderer);

        this._updateView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listDesigner.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnAddDesigner(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchMultiUserPanel, {
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B1138),
            minChooseCount    : 1,
            maxChooseCount    : 5,
            callbackOnConfirm : userIdArray => {
                const userIdSet = new Set(userIdArray);
                for (const userId of campaignInfo.getDesignerUserIdArray()) {
                    userIdSet.delete(userId);
                }
                if (userIdSet.size) {
                    Campaigns_Managements_Gateway.reqCmUpdateCampaignDesigners(campaignId, [...userIdSet], []);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmUpdateCampaignDesigners(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateComponentsForListDesigner();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateTopButtons();
        this._updateComponentsForListDesigner();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1136);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private _updateTopButtons(): void {
        this._btnAddDesigner.setIsVisible(Users_Model.getIsSelfCampaignManager());
    }

    private async _updateComponentsForListDesigner(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listDesigner;
        const designerUserIdArray   = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getDesignerUserIdArray();
        if (!designerUserIdArray?.length) {
            label.setIsVisible(true);
            await list.removeAllItems();
        } else {
            label.setIsVisible(false);

            const dataArray: DataForCampaignRenderer[] = designerUserIdArray
                .sort((v1, v2) => v1 - v2)
                .map(v => ({
                    index          : 0,
                    designerUserId : v,
                    campaignId     : campaignId,
                }));
            for (let i = 0; i < dataArray.length; ++i) {
                dataArray[i].index = i;
            }
            await list.bindData(dataArray);
        }
    }
}

interface DataForCampaignRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    campaignId      : number;
    designerUserId  : number;
}
class CampaignRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDelete!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnDelete,                      callback : this._onTouchedBtnDelete },
        ]);
    }

    protected override _doApplyOpenData(): void {
        // this._imgBg.alpha       = this._getData().index % 2 < 1 ? 0.2 : 0.5;
        this._btnDelete.setIsVisible(Users_Model.getIsSelfCampaignManager());

        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => Campaigns_Managements_Gateway.reqCmUpdateCampaignDesigners(openData.campaignId, [], [openData.designerUserId]),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const userId = this.getOpenData()?.designerUserId;
        if (userId == null) {
            return;
        }

        const userNickname = await Users_Model.getUserNickname(userId);
        if (userId === this.getOpenData()?.designerUserId) {
            label.setText(`#${userId} ${userNickname ?? Lang_Utils.getText(Lang_Constants.TextType.B0277)}`);
        }
    }
}
