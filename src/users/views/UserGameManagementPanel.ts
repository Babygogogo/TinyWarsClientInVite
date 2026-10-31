import {
    NormalMap_Model_NormalMapModel,
    Campaigns_Managements_Provider,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Gm_Model_GmProxy,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _scroller!                 : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;

    private readonly _groupButtons!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnDeleteAllSpmRank!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetPrivilege!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapManagement!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnManageBroadcast!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAutoTourneyManagement! : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCampaignManagement!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "MsgMmGetReviewingMaps",   callback : this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnDeleteAllSpmRank,        callback : this._onTouchedBtnDeleteAllSpmRank },
            { ui : this._btnSetPrivilege,            callback : this._onTouchedBtnSetPrivilege },
            { ui : this._btnMapManagement,           callback : this._onTouchedBtnMapManagement },
            { ui : this._btnManageBroadcast,         callback : this._onTouchedBtnManageBroadcast },
            { ui : this._btnAutoTourneyManagement,   callback : this._onTouchedBtnAutoTourneyManagement },
            { ui : this._btnCampaignManagement,      callback : this._onTouchedBtnCampaignManagement },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._scroller.scrollTop();
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMmGetReviewingMaps(): void {
        this._updateRedForBtnMapManagement();
    }

    private _onTouchedBtnDeleteAllSpmRank(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0879),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => Gm_Model_GmProxy.reqGmDeleteSpmAllScoreAndReplay(),
        });
    }
    private _onTouchedBtnSetPrivilege(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().GmSetUserFullPrivilegePanel, { userId : Helpers_Misc.getExisted(Users_Model.getSelfUserId()) });
    }
    private _onTouchedBtnMapManagement(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmMainMenuPanel, void 0);
    }
    private _onTouchedBtnManageBroadcast(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastMessageListPanel, void 0);
    }
    private _onTouchedBtnAutoTourneyManagement(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtGlobalSettingsPanel, void 0);
    }
    private _onTouchedBtnCampaignManagement(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CmCampaignListPanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMapManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0878);
        this._btnDeleteAllSpmRank.setLangText(Lang_Constants.TextType.B0879);
        this._btnSetPrivilege.setLangText(Lang_Constants.TextType.B0460);
        this._btnMapManagement.setLangText(Lang_Constants.TextType.B0192);
        this._btnManageBroadcast.setLangText(Lang_Constants.TextType.B0880);
        this._btnAutoTourneyManagement.setLangText(Lang_Constants.TextType.B1036);
        this._btnCampaignManagement.setLangText(Lang_Constants.TextType.B1133);
    }

    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeAllItems(false);

        if (Users_Model.getIsSelfAdmin()) {
            group.addItem(this._btnSetPrivilege, false);
            group.addItem(this._btnDeleteAllSpmRank, false);
            group.addItem(this._btnManageBroadcast, false);
        }
        if (Users_Model.getIsSelfMapCommittee()) {
            group.addItem(this._btnMapManagement, false);
        }
        if (Users_Model.getIsSelfAutoTourneyCommittee()) {
            group.addItem(this._btnAutoTourneyManagement, false);
        }
        if ((Users_Model.getIsSelfCampaignManager())                                 ||
            ((await Campaigns_Managements_Provider.getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnCampaignManagement, false);
        }

        group.arrangeItems();
    }
    private async _updateRedForBtnMapManagement(): Promise<void> {
        this._btnMapManagement.setRedVisible(await NormalMap_Model_NormalMapModel.checkIsRedForMapManagement());
    }
}
