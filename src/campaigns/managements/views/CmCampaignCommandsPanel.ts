import * as CampaignsConstants from "../../Constants.ts";
import * as CampaignsMainsProvider from "../../mains/Provider.ts";
import * as CampaignsManagementsGateway from "../Gateway.ts";
import * as CampaignsUtils from "../../Utils.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameConfigGcWar from "../../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../../ui/interfaces/IUiScroller.ts";
import * as UsersModel from "../../../users/Model.ts";

export type OpenData = {
    campaignId  : number;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _scroller!                 : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _groupButtons!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSetDesigner!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetName!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetDesc!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetExtraLink!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetEnabled!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMap!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignName,    callback: this._onNotifyMsgCmSetCampaignName },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignDesc,    callback: this._onNotifyMsgCmSetCampaignDesc },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignEnabled, callback: this._onNotifyMsgCmSetCampaignEnabled },
            { type: NotificationsTypeId.TypeId.MsgCmSetExtraLink,       callback: this._onNotifyMsgCmSetExtraLink },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnSetDesigner,                 callback: this._onTouchedBtnSetDesigner },
            { ui: this._btnSetName,                     callback: this._onTouchedBtnSetName },
            { ui: this._btnSetDesc,                     callback: this._onTouchedBtnSetDesc },
            { ui: this._btnSetExtraLink,                callback: this._onTouchedBtnSetExtraLink },
            { ui: this._btnSetEnabled,                  callback: this._onTouchedBtnSetEnabled },
            { ui: this._btnModifyMap,                   callback: this._onTouchedBtnModifyMap },
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
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignDesc(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignEnabled(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateBtnSetEnabled();
    }
    private _onNotifyMsgCmSetExtraLink(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnSetDesigner(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CmCampaignDesignersPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }
    private async _onTouchedBtnSetName(): Promise<void> {
        const selfUserId = UsersModel.getSelfUserId();
        if (selfUserId == null) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : campaignInfo.getNameArray(),
            maxTextLength       : GameConfigGcWar.CampaignWar.MaxNameLength,
            callback            : nameArray => CampaignsManagementsGateway.reqCmSetCampaignName(campaignId, nameArray),
        });
    }
    private async _onTouchedBtnSetDesc(): Promise<void> {
        const selfUserId = UsersModel.getSelfUserId();
        if (selfUserId == null) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => LangUtils.getText(LangConstants.TextType.B1137),
            currentTextArray    : campaignInfo.getDescArray(),
            maxLength           : GameConfigGcWar.CampaignWar.MaxDescLength,
            callback            : descArray => CampaignsManagementsGateway.reqCmSetCampaignDesc(campaignId, descArray),
        });
    }
    private async _onTouchedBtnSetExtraLink(): Promise<void> {
        const selfUserId = UsersModel.getSelfUserId();
        if (selfUserId == null) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (!campaignInfo.getDesignerUserIdArray().includes(selfUserId))) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B1481),
            currentValue    : campaignInfo.getExtraLink() ?? ``,
            minLength       : 0,
            maxChars        : CampaignsConstants.MaxExtraLinkLength,
            tips            : LangUtils.getText(LangConstants.TextType.A0999),
            charRestrict    : null,
            isMultiLine     : false,
            canBeEmpty      : true,
            isAutoClose     : false,
            callback        : panel => {
                const link = panel.getInputText();
                if ((link == "") || (CampaignsUtils.checkIsValidExtraLink(link))) {
                    CampaignsManagementsGateway.reqCmSetExtraLink(campaignId, link);
                    panel.closePanel();
                } else {
                    FloatText2.showLang(LangConstants.TextType.A0098);
                }
            },
        });
    }
    private async _onTouchedBtnSetEnabled(): Promise<void> {
        if (!UsersModel.getIsSelfCampaignManager()) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            FloatText2.showLang(LangConstants.TextType.A0102);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => CampaignsManagementsGateway.reqCmSetCampaignEnabled(campaignId, !campaignInfo.getIsEnabled()),
        });
    }
    private _onTouchedBtnModifyMap(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CmCampaignMapsPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1135)} #${this.getOpenData()?.campaignId}`);
        this._btnSetDesigner.setLangText(LangConstants.TextType.B1136);
        this._btnSetName.setLangText(LangConstants.TextType.B0708);
        this._btnSetDesc.setLangText(LangConstants.TextType.B1137);
        this._btnSetExtraLink.setLangText(LangConstants.TextType.B1481);
        this._btnModifyMap.setLangText(LangConstants.TextType.B1045);

        this._updateBtnSetEnabled();
    }
    private async _updateBtnSetEnabled(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const info = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        this._btnSetEnabled.setText(`${LangUtils.getText(LangConstants.TextType.B1140)}: ${LangUtils.getTextForYesOrNo(info?.getIsEnabled())}`);
    }
}
