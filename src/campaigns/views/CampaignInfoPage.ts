import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersConstants from "../../users/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = {
    campaignId  : number;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _scroller!     : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _group!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDesigner!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLink!      : UiInterfacesIUiButton.IUiButton;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDesigner,    callback: this._onTouchedBtnDesigner },
            { ui: this._btnLink,        callback: this._onTouchedBtnLink },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const rawDesignerIdArray    = campaignInfo.getDesignerUserIdArray();
        const designerIdArray       = rawDesignerIdArray.length <= 1
            ? rawDesignerIdArray
            : rawDesignerIdArray.filter(v => v !== UsersConstants.Common.AdminUserId);
        if (designerIdArray.length <= 0) {
            return;
        }

        if (designerIdArray.length === 1) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: designerIdArray[0]});
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0163),
                availableNumberArray    : designerIdArray,
                currentNumber           : null,
                columnsCount            : 2,
                showNumber              : true,
                getNumberMainText       : async num => await UsersModel.getUserNickname(num) ?? LangConstants.UndefinedError,
                callbackOnConfirm       : num => GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: num}),
            });
        }
    }

    private async _onTouchedBtnLink(): Promise<void> {
        if ((!window) || (!window.open)) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const extraLink = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getExtraLink() ?? ``;
        if (extraLink.length) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0269, extraLink),
                callback    : () => window.open(extraLink),
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnLink();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDesigner.setLangText(LangConstants.TextType.B0163);
        this._btnLink.setLangText(LangConstants.TextType.B1481);
        this._updateLabelDesc();
    }

    private async _updateLabelDesc(): Promise<void> {
        const campaignId    = this.getOpenData()?.campaignId;
        const labelDesc     = this._labelDesc;
        labelDesc.setUnscaledManualWidth(this._scroller.getUnscaledWidth());
        labelDesc.setText(``);

        if (campaignId != null) {
            const descArray = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getDescArray();
            if (campaignId === this.getOpenData()?.campaignId) {
                labelDesc.setText(LangUtils.getLanguageText({ textArray: descArray }) ?? LangConstants.UndefinedError);
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

        btnLink.setIsVisible(!!(await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getExtraLink()?.length);
    }
}
