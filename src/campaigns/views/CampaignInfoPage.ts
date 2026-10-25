import { getCampaignInfo } from "../mains/Provider.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { Common } from "../../users/Constants.ts";
import { getUserNickname } from "../../users/Model.ts";

export type OpenData = {
    campaignId  : number;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _scroller!     : IUiScroller<IUiLayout>;
    private readonly _group!        : IUiLayout;
    private readonly _labelDesc!    : IUiLabel;
    private readonly _btnDesigner!  : IUiButton;
    private readonly _btnLink!      : IUiButton;

    public constructor() {
        super();

        loadSkinByPath(this, "campaigns/views/CampaignInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDesigner,    callback: this._onTouchedBtnDesigner },
            { ui: this._btnLink,        callback: this._onTouchedBtnLink },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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

        const campaignInfo = await getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const rawDesignerIdArray    = campaignInfo.getDesignerUserIdArray();
        const designerIdArray       = rawDesignerIdArray.length <= 1
            ? rawDesignerIdArray
            : rawDesignerIdArray.filter(v => v !== Common.AdminUserId);
        if (designerIdArray.length <= 0) {
            return;
        }

        if (designerIdArray.length === 1) {
            openPanel(getDict().UserPanel, { userId: designerIdArray[0]});
        } else {
            openPanel(getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => getText(TextType.B0163),
                availableNumberArray    : designerIdArray,
                currentNumber           : null,
                columnsCount            : 2,
                showNumber              : true,
                getNumberMainText       : async num => await getUserNickname(num) ?? UndefinedError,
                callbackOnConfirm       : num => openPanel(getDict().UserPanel, { userId: num}),
            });
        }
    }

    private async _onTouchedBtnLink(): Promise<void> {
        if ((!window) || (!window.open)) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const extraLink = (await getCampaignInfo(campaignId))?.getExtraLink() ?? ``;
        if (extraLink.length) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent  : () => getFormattedText(TextType.F0269, extraLink),
                callback    : () => window.open(extraLink),
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnLink();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDesigner.setLangText(TextType.B0163);
        this._btnLink.setLangText(TextType.B1481);
        this._updateLabelDesc();
    }

    private async _updateLabelDesc(): Promise<void> {
        const campaignId    = this.getOpenData()?.campaignId;
        const labelDesc     = this._labelDesc;
        labelDesc.setUnscaledManualWidth(this._scroller.getUnscaledWidth());
        labelDesc.setText(``);

        if (campaignId != null) {
            const descArray = (await getCampaignInfo(campaignId))?.getDescArray();
            if (campaignId === this.getOpenData()?.campaignId) {
                labelDesc.setText(getLanguageText({ textArray: descArray }) ?? UndefinedError);
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

        btnLink.setIsVisible(!!(await getCampaignInfo(campaignId))?.getExtraLink()?.length);
    }
}
