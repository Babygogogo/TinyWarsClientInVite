import {
    Users_Constants,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export type OpenData = {
    campaignId  : number;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _scroller!     : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _group!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDesigner!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLink!      : Ui_Interfaces_IUiButton.IUiButton;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnDesigner,    callback : this._onTouchedBtnDesigner },
            { ui : this._btnLink,        callback : this._onTouchedBtnLink },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });
        this._scroller.setCallbackOnAppliedSizeFromSizerInfo(() => this._updateView());
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnDesigner(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const rawDesignerIdArray    = campaignInfo.getDesignerUserIdArray();
        const designerIdArray       = rawDesignerIdArray.length <= 1
            ? rawDesignerIdArray
            : rawDesignerIdArray.filter(v => v !== Users_Constants.Common.AdminUserId);
        if (designerIdArray.length <= 0) {
            return;
        }

        if (designerIdArray.length === 1) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : designerIdArray[0] });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0163),
                availableNumberArray : designerIdArray,
                currentNumber        : null,
                columnsCount         : 2,
                showNumber           : true,
                getNumberMainText    : async num => await Users_Model.getUserNickname(num) ?? Lang_Constants.UndefinedError,
                callbackOnConfirm    : num => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : num }),
            });
        }
    }

    private async _onTouchedBtnLink(): Promise<void> {
        if ((!window) || (!window.open)) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const extraLink = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getExtraLink() ?? ``;
        if (extraLink.length) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0269, extraLink),
                callback   : () => window.open(extraLink),
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnLink();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDesigner.setLangText(Lang_Constants.TextType.B0163);
        this._btnLink.setLangText(Lang_Constants.TextType.B1481);
        this._updateLabelDesc();
    }

    private async _updateLabelDesc(): Promise<void> {
        const campaignId    = this.getOpenData()?.campaignId;
        const labelDesc     = this._labelDesc;
        labelDesc.setUnscaledManualWidth(this._scroller.getUnscaledWidth());
        labelDesc.setText(``);

        if (campaignId != null) {
            const descArray = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getDescArray();
            if (campaignId === this.getOpenData()?.campaignId) {
                labelDesc.setText(Lang_Utils.getLanguageText({ textArray : descArray }) ?? Lang_Constants.UndefinedError);
            }
        }

        this._group.arrangeItems();
    }

    private async _updateBtnLink(): Promise<void> {
        const btnLink = this._btnLink;
        btnLink.setIsVisible(false);

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        btnLink.setIsVisible(!!(await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getExtraLink()?.length);
    }
}
