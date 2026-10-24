import * as CampaignsManagementsProvider from "../../campaigns/managements/Provider.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GmModelGmProxy from "../../gm/model/GmProxy.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UsersModel from "../Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _scroller!                 : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;

    private readonly _groupButtons!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnDeleteAllSpmRank!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetPrivilege!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapManagement!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnManageBroadcast!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAutoTourneyManagement! : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCampaignManagement!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnDeleteAllSpmRank,        callback: this._onTouchedBtnDeleteAllSpmRank },
            { ui: this._btnSetPrivilege,            callback: this._onTouchedBtnSetPrivilege },
            { ui: this._btnMapManagement,           callback: this._onTouchedBtnMapManagement },
            { ui: this._btnManageBroadcast,         callback: this._onTouchedBtnManageBroadcast },
            { ui: this._btnAutoTourneyManagement,   callback: this._onTouchedBtnAutoTourneyManagement },
            { ui: this._btnCampaignManagement,      callback: this._onTouchedBtnCampaignManagement },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B0879),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => GmModelGmProxy.reqGmDeleteSpmAllScoreAndReplay(),
        });
    }
    private _onTouchedBtnSetPrivilege(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().GmSetUserFullPrivilegePanel, { userId: HelpersMisc.getExisted(UsersModel.getSelfUserId()) });
    }
    private _onTouchedBtnMapManagement(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmMainMenuPanel, void 0);
    }
    private _onTouchedBtnManageBroadcast(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastMessageListPanel, void 0);
    }
    private _onTouchedBtnAutoTourneyManagement(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().AtGlobalSettingsPanel, void 0);
    }
    private _onTouchedBtnCampaignManagement(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CmCampaignListPanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMapManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0878);
        this._btnDeleteAllSpmRank.setLangText(LangConstants.TextType.B0879);
        this._btnSetPrivilege.setLangText(LangConstants.TextType.B0460);
        this._btnMapManagement.setLangText(LangConstants.TextType.B0192);
        this._btnManageBroadcast.setLangText(LangConstants.TextType.B0880);
        this._btnAutoTourneyManagement.setLangText(LangConstants.TextType.B1036);
        this._btnCampaignManagement.setLangText(LangConstants.TextType.B1133);
    }

    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeAllItems(false);

        if (UsersModel.getIsSelfAdmin()) {
            group.addItem(this._btnSetPrivilege, false);
            group.addItem(this._btnDeleteAllSpmRank, false);
            group.addItem(this._btnManageBroadcast, false);
        }
        if (UsersModel.getIsSelfMapCommittee()) {
            group.addItem(this._btnMapManagement, false);
        }
        if (UsersModel.getIsSelfAutoTourneyCommittee()) {
            group.addItem(this._btnAutoTourneyManagement, false);
        }
        if ((UsersModel.getIsSelfCampaignManager())                                 ||
            ((await CampaignsManagementsProvider.getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnCampaignManagement, false);
        }

        group.arrangeItems();
    }
    private async _updateRedForBtnMapManagement(): Promise<void> {
        this._btnMapManagement.setRedVisible(await NormalMapModelNormalMapModel.checkIsRedForMapManagement());
    }
}
