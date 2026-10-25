import { getDesigningCampaignIdArray } from "../../campaigns/managements/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { reqGmDeleteSpmAllScoreAndReplay } from "../../gm/model/GmProxy.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { checkIsRedForMapManagement } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { getSelfUserId, getIsSelfAdmin, getIsSelfMapCommittee, getIsSelfAutoTourneyCommittee, getIsSelfCampaignManager } from "../Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _group!                    : IUiContainer;
    private readonly _scroller!                 : IUiScroller<IUiContainer>;

    private readonly _groupButtons!             : IUiLayout;
    private readonly _btnDeleteAllSpmRank!      : IUiButton;
    private readonly _btnSetPrivilege!          : IUiButton;
    private readonly _btnMapManagement!         : IUiButton;
    private readonly _btnManageBroadcast!       : IUiButton;
    private readonly _btnAutoTourneyManagement! : IUiButton;
    private readonly _btnCampaignManagement!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
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
        openPanel(getDict().CommonConfirmPanel, {
            getTitle       : () => getText(TextType.B0879),
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqGmDeleteSpmAllScoreAndReplay(),
        });
    }
    private _onTouchedBtnSetPrivilege(): void {
        openPanel(getDict().GmSetUserFullPrivilegePanel, { userId: getExisted(getSelfUserId()) });
    }
    private _onTouchedBtnMapManagement(): void {
        openPanel(getDict().MmMainMenuPanel, void 0);
    }
    private _onTouchedBtnManageBroadcast(): void {
        openPanel(getDict().BroadcastMessageListPanel, void 0);
    }
    private _onTouchedBtnAutoTourneyManagement(): void {
        openPanel(getDict().AtGlobalSettingsPanel, void 0);
    }
    private _onTouchedBtnCampaignManagement(): void {
        openPanel(getDict().CmCampaignListPanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMapManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0878);
        this._btnDeleteAllSpmRank.setLangText(TextType.B0879);
        this._btnSetPrivilege.setLangText(TextType.B0460);
        this._btnMapManagement.setLangText(TextType.B0192);
        this._btnManageBroadcast.setLangText(TextType.B0880);
        this._btnAutoTourneyManagement.setLangText(TextType.B1036);
        this._btnCampaignManagement.setLangText(TextType.B1133);
    }

    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeAllItems(false);

        if (getIsSelfAdmin()) {
            group.addItem(this._btnSetPrivilege, false);
            group.addItem(this._btnDeleteAllSpmRank, false);
            group.addItem(this._btnManageBroadcast, false);
        }
        if (getIsSelfMapCommittee()) {
            group.addItem(this._btnMapManagement, false);
        }
        if (getIsSelfAutoTourneyCommittee()) {
            group.addItem(this._btnAutoTourneyManagement, false);
        }
        if ((getIsSelfCampaignManager())                                 ||
            ((await getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnCampaignManagement, false);
        }

        group.arrangeItems();
    }
    private async _updateRedForBtnMapManagement(): Promise<void> {
        this._btnMapManagement.setRedVisible(await checkIsRedForMapManagement());
    }
}
