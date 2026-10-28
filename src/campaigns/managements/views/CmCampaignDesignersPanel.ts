import { getCampaignInfo } from "../../mains/Provider.ts";
import { reqCmUpdateCampaignDesigners } from "../Gateway.ts";
import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import { getIsSelfCampaignManager, getUserNickname } from "../../../users/Model.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAddDesigner!       : IUiButton;

    private readonly _listDesigner!         : IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCmUpdateCampaignDesigners,    callback: this._onNotifyMsgCmUpdateCampaignDesigners },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnAddDesigner,     callback: this._onTouchedBtnAddDesigner },
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

        const campaignInfo = await getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        openPanel(getDict().CommonSearchMultiUserPanel, {
            getTitleText        : () => getText(TextType.B1138),
            minChooseCount      : 1,
            maxChooseCount      : 5,
            callbackOnConfirm   : userIdArray => {
                const userIdSet = new Set(userIdArray);
                for (const userId of campaignInfo.getDesignerUserIdArray()) {
                    userIdSet.delete(userId);
                }
                if (userIdSet.size) {
                    reqCmUpdateCampaignDesigners(campaignId, [...userIdSet], []);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmUpdateCampaignDesigners(): void {
        showLang(TextType.OperationSucceeded);
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
        this._labelTitle.setLangText(TextType.B1136);
        this._labelNoData.setLangText(TextType.B0278);
    }

    private _updateTopButtons(): void {
        this._btnAddDesigner.setIsVisible(getIsSelfCampaignManager());
    }

    private async _updateComponentsForListDesigner(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listDesigner;
        const designerUserIdArray   = (await getCampaignInfo(campaignId))?.getDesignerUserIdArray();
        if (!designerUserIdArray?.length) {
            label.setIsVisible(true);
            await list.removeAllItems();
        } else {
            label.setIsVisible(false);

            const dataArray: DataForCampaignRenderer[] = designerUserIdArray
                .sort((v1, v2) => v1 - v2)
                .map(v => ({
                    index           : 0,
                    designerUserId  : v,
                    campaignId      : campaignId,
                }));
            for (let i = 0; i < dataArray.length; ++i) {
                dataArray[i].index = i;
            }
            await list.bindData(dataArray);
        }
    }
}

interface DataForCampaignRenderer extends UiListItemData {
    index           : number;
    campaignId      : number;
    designerUserId  : number;
}
class CampaignRenderer extends UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;
    private readonly _btnDelete!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDelete,                      callback: this._onTouchedBtnDelete },
        ]);
    }

    protected override _doApplyOpenData(): void {
        // this._imgBg.alpha       = this._getData().index % 2 < 1 ? 0.2 : 0.5;
        this._btnDelete.setIsVisible(getIsSelfCampaignManager());

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

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqCmUpdateCampaignDesigners(openData.campaignId, [], [openData.designerUserId]),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(TextType.B0220);
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const userId = this.getOpenData()?.designerUserId;
        if (userId == null) {
            return;
        }

        const userNickname = await getUserNickname(userId);
        if (userId === this.getOpenData()?.designerUserId) {
            label.setText(`#${userId} ${userNickname ?? getText(TextType.B0277)}`);
        }
    }
}
