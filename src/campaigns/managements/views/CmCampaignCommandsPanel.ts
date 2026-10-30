import {
    CampaignWar,
    MaxExtraLinkLength,
} from "../../Constants.ts";
import { getCampaignInfo } from "../../mains/Provider.ts";
import {
    reqCmSetCampaignName,
    reqCmSetCampaignDesc,
    reqCmSetExtraLink,
    reqCmSetCampaignEnabled,
} from "../Gateway.ts";
import { checkIsValidExtraLink } from "../../Utils.ts";
import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getTextForYesOrNo,
} from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../../ui/interfaces/IUiScroller.ts";
import {
    getSelfUserId,
    getIsSelfCampaignManager,
} from "../../../users/Model.ts";

export type OpenData = {
    campaignId  : number;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _scroller!                 : IUiScroller<IUiContainer>;
    private readonly _groupButtons!             : IUiContainer;
    private readonly _btnSetDesigner!           : IUiButton;
    private readonly _btnSetName!               : IUiButton;
    private readonly _btnSetDesc!               : IUiButton;
    private readonly _btnSetExtraLink!          : IUiButton;
    private readonly _btnSetEnabled!            : IUiButton;
    private readonly _btnModifyMap!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCmSetCampaignName,    callback: this._onNotifyMsgCmSetCampaignName },
            { type: TypeId.MsgCmSetCampaignDesc,    callback: this._onNotifyMsgCmSetCampaignDesc },
            { type: TypeId.MsgCmSetCampaignEnabled, callback: this._onNotifyMsgCmSetCampaignEnabled },
            { type: TypeId.MsgCmSetExtraLink,       callback: this._onNotifyMsgCmSetExtraLink },
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
        showLang(TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignDesc(): void {
        showLang(TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignEnabled(): void {
        showLang(TextType.OperationSucceeded);
        this._updateBtnSetEnabled();
    }
    private _onNotifyMsgCmSetExtraLink(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onTouchedBtnSetDesigner(): void {
        openPanel(getDict().CmCampaignDesignersPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }
    private async _onTouchedBtnSetName(): Promise<void> {
        const selfUserId = getSelfUserId();
        if (selfUserId == null) {
            showLang(TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            showLang(TextType.A0102);
            return;
        }

        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : campaignInfo.getNameArray(),
            maxTextLength       : CampaignWar.MaxNameLength,
            callback            : nameArray => reqCmSetCampaignName(campaignId, nameArray),
        });
    }
    private async _onTouchedBtnSetDesc(): Promise<void> {
        const selfUserId = getSelfUserId();
        if (selfUserId == null) {
            showLang(TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (campaignInfo.getDesignerUserIdArray().indexOf(selfUserId) < 0)) {
            showLang(TextType.A0102);
            return;
        }

        openPanel(getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => getText(TextType.B1137),
            currentTextArray    : campaignInfo.getDescArray(),
            maxLength           : CampaignWar.MaxDescLength,
            callback            : descArray => reqCmSetCampaignDesc(campaignId, descArray),
        });
    }
    private async _onTouchedBtnSetExtraLink(): Promise<void> {
        const selfUserId = getSelfUserId();
        if (selfUserId == null) {
            showLang(TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const campaignInfo = await getCampaignInfo(campaignId);
        if ((campaignInfo == null) || (!campaignInfo.getDesignerUserIdArray().includes(selfUserId))) {
            showLang(TextType.A0102);
            return;
        }

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B1481),
            currentValue    : campaignInfo.getExtraLink() ?? ``,
            minLength       : 0,
            maxChars        : MaxExtraLinkLength,
            tips            : getText(TextType.A0999),
            charRestrict    : null,
            isMultiLine     : false,
            canBeEmpty      : true,
            isAutoClose     : false,
            callback        : panel => {
                const link = panel.getInputText();
                if ((link == "") || (checkIsValidExtraLink(link))) {
                    reqCmSetExtraLink(campaignId, link);
                    panel.closePanel();
                } else {
                    showLang(TextType.A0098);
                }
            },
        });
    }
    private async _onTouchedBtnSetEnabled(): Promise<void> {
        if (!getIsSelfCampaignManager()) {
            showLang(TextType.A0102);
            return;
        }

        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const campaignInfo = await getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            showLang(TextType.A0102);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqCmSetCampaignEnabled(campaignId, !campaignInfo.getIsEnabled()),
        });
    }
    private _onTouchedBtnModifyMap(): void {
        openPanel(getDict().CmCampaignMapsPanel, {
            campaignId  : this.getOpenData()?.campaignId,
        });
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B1135)} #${this.getOpenData()?.campaignId}`);
        this._btnSetDesigner.setLangText(TextType.B1136);
        this._btnSetName.setLangText(TextType.B0708);
        this._btnSetDesc.setLangText(TextType.B1137);
        this._btnSetExtraLink.setLangText(TextType.B1481);
        this._btnModifyMap.setLangText(TextType.B1045);

        this._updateBtnSetEnabled();
    }
    private async _updateBtnSetEnabled(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const info = await getCampaignInfo(campaignId);
        this._btnSetEnabled.setText(`${getText(TextType.B1140)}: ${getTextForYesOrNo(info?.getIsEnabled())}`);
    }
}
