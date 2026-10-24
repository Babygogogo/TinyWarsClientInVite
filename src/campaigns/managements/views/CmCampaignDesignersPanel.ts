import * as CampaignsMainsProvider from "../../mains/Provider.ts";
import * as CampaignsManagementsGateway from "../Gateway.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../../users/Model.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddDesigner!       : UiInterfacesIUiButton.IUiButton;

    private readonly _listDesigner!         : UiInterfacesIUiScrollList.IUiScrollList<DataForCampaignRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCmUpdateCampaignDesigners,    callback: this._onNotifyMsgCmUpdateCampaignDesigners },
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

        const campaignInfo = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchMultiUserPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B1138),
            minChooseCount      : 1,
            maxChooseCount      : 5,
            callbackOnConfirm   : userIdArray => {
                const userIdSet = new Set(userIdArray);
                for (const userId of campaignInfo.getDesignerUserIdArray()) {
                    userIdSet.delete(userId);
                }
                if (userIdSet.size) {
                    CampaignsManagementsGateway.reqCmUpdateCampaignDesigners(campaignId, [...userIdSet], []);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmUpdateCampaignDesigners(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1136));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private _updateTopButtons(): void {
        this._btnAddDesigner.setIsVisible(UsersModel.getIsSelfCampaignManager());
    }

    private async _updateComponentsForListDesigner(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listDesigner;
        const designerUserIdArray   = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getDesignerUserIdArray();
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

interface DataForCampaignRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    campaignId      : number;
    designerUserId  : number;
}
class CampaignRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCampaignRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDelete,                      callback: this._onTouchedBtnDelete },
        ]);
    }

    protected override _doApplyOpenData(): void {
        // this._imgBg.alpha       = this._getData().index % 2 < 1 ? 0.2 : 0.5;
        this._btnDelete.setIsVisible(UsersModel.getIsSelfCampaignManager());

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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => CampaignsManagementsGateway.reqCmUpdateCampaignDesigners(openData.campaignId, [], [openData.designerUserId]),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setText(LangUtils.getText(LangConstants.TextType.B0220));
        this._updateLabelName();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const userId = this.getOpenData()?.designerUserId;
        if (userId == null) {
            return;
        }

        const userNickname = await UsersModel.getUserNickname(userId);
        if (userId === this.getOpenData()?.designerUserId) {
            label.setText(`#${userId} ${userNickname ?? LangUtils.getText(LangConstants.TextType.B0277)}`);
        }
    }
}
