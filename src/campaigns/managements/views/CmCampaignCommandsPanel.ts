import {
    Campaigns_Constants,
    Campaigns_Utils,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
} from "../../../internal.ts";

export type OpenData = {
    campaignId  : number;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _scroller!                 : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _groupButtons!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSetDesigner!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetName!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetDesc!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetExtraLink!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetEnabled!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMap!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgCmSetCampaignName,    callback : this._onNotifyMsgCmSetCampaignName },
            { type : Notifications_TypeId.TypeId.MsgCmSetCampaignDesc,    callback : this._onNotifyMsgCmSetCampaignDesc },
            { type : Notifications_TypeId.TypeId.MsgCmSetCampaignEnabled, callback : this._onNotifyMsgCmSetCampaignEnabled },
            { type : Notifications_TypeId.TypeId.MsgCmSetExtraLink,       callback : this._onNotifyMsgCmSetExtraLink },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnSetDesigner,                 callback : this._onTouchedBtnSetDesigner },
            { ui : this._btnSetName,                     callback : this._onTouchedBtnSetName },
            { ui : this._btnSetDesc,                     callback : this._onTouchedBtnSetDesc },
            { ui : this._btnSetExtraLink,                callback : this._onTouchedBtnSetExtraLink },
            { ui : this._btnSetEnabled,                  callback : this._onTouchedBtnSetEnabled },
            { ui : this._btnModifyMap,                   callback : this._onTouchedBtnModifyMap },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._scroller.scrollTop();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCmSetCampaignName(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignDesc(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignEnabled(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateBtnSetEnabled();
    }
    private _onNotifyMsgCmSetExtraLink(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnSetDesigner(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CmCampaignDesignersPanel, {
            campaignId : this.getOpenData()?.campaignId,
        });
    }
    private async _onTouchedBtnSetName(): Promise<void> {
        const selfUserId = Users_Model.getSelfUserId();
        if (selfUserId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : campaignInfo.getNameArray(),
            maxTextLength    : Campaigns_Constants.CampaignWar.MaxNameLength,
            callback         : nameArray => Campaigns_Managements_Gateway.reqCmSetCampaignName(campaignId, nameArray),
        });
    }
    private async _onTouchedBtnSetDesc(): Promise<void> {
        const selfUserId = Users_Model.getSelfUserId();
        if (selfUserId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
            getTitle         : () => Lang_Utils.getText(Lang_Constants.TextType.B1137),
            currentTextArray : campaignInfo.getDescArray(),
            maxLength        : Campaigns_Constants.CampaignWar.MaxDescLength,
            callback         : descArray => Campaigns_Managements_Gateway.reqCmSetCampaignDesc(campaignId, descArray),
        });
    }
    private async _onTouchedBtnSetExtraLink(): Promise<void> {
        const selfUserId = Users_Model.getSelfUserId();
        if (selfUserId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (!campaignInfo.getDesignerUserIdArray().includes(selfUserId))) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B1481),
            currentValue : campaignInfo.getExtraLink() ?? ``,
            minLength    : 0,
            maxChars     : Campaigns_Constants.MaxExtraLinkLength,
            tips         : Lang_Utils.getText(Lang_Constants.TextType.A0999),
            charRestrict : null,
            isMultiLine  : false,
            canBeEmpty   : true,
            isAutoClose  : false,
            callback     : panel => {
                const link = panel.getInputText();
                if ((link == "") || (Campaigns_Utils.checkIsValidExtraLink(link))) {
                    Campaigns_Managements_Gateway.reqCmSetExtraLink(campaignId, link);
                    panel.closePanel();
                } else {
                    FloatText.showLang(Lang_Constants.TextType.A0098);
                }
            },
        });
    }
    private async _onTouchedBtnSetEnabled(): Promise<void> {
        if (!Users_Model.getIsSelfCampaignManager()) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            FloatText.showLang(Lang_Constants.TextType.A0102);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => Campaigns_Managements_Gateway.reqCmSetCampaignEnabled(campaignId, !campaignInfo.getIsEnabled()),
        });
    }
    private _onTouchedBtnModifyMap(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CmCampaignMapsPanel, {
            campaignId : this.getOpenData()?.campaignId,
        });
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1135)} #${this.getOpenData()?.campaignId}`);
        this._btnSetDesigner.setLangText(Lang_Constants.TextType.B1136);
        this._btnSetName.setLangText(Lang_Constants.TextType.B0708);
        this._btnSetDesc.setLangText(Lang_Constants.TextType.B1137);
        this._btnSetExtraLink.setLangText(Lang_Constants.TextType.B1481);
        this._btnModifyMap.setLangText(Lang_Constants.TextType.B1045);

        this._updateBtnSetEnabled();
    }
    private async _updateBtnSetEnabled(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const info = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        this._btnSetEnabled.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1140)}: ${Lang_Utils.getTextForYesOrNo(info?.getIsEnabled())}`);
    }
}
