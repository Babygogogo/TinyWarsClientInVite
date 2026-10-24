import * as BroadcastsGateway from "../Gateway.ts";
import * as BroadcastsProvider from "../Provider.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddMessage!    : UiInterfacesIUiButton.IUiButton;

    private readonly _listMessage!      : UiInterfacesIUiScrollList.IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoMessage!   : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgBroadcastGetAllMessageIdArray,    callback: this._onNotifyMsgBroadcastGetAllMessageIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnAddMessage,                              callback: this._onTouchedBtnAddMessage },
            { ui: this._btnClose,                                   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMessage.setItemRendererClass(MessageRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        BroadcastsGateway.reqBroadcastGetAllMessageIdArray();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMessage.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgBroadcastGetAllMessageIdArray(): void {
        this._updateListMessageAndLabelNoMessage();
    }

    private _onTouchedBtnAddMessage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BroadcastAddMessagePanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0881));
        this._labelNoMessage.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = [];
        for (const messageId of BroadcastsProvider.getAllMessageIdArray()) {
            dataArray.push({
                messageId,
            });
        }

        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private _updateBtnAddMessage(): void {
        const btn = this._btnAddMessage;
        btn.setIsVisible(UsersModel.getIsSelfAdmin());
    }
}

interface DataForMessageRenderer extends UiTypesUiListItemData.UiListItemData {
    messageId: number;
}
class MessageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const messageId     = openData.messageId;
        const messageData   = await BroadcastsProvider.getMessageData(messageId);
        if (messageData == null) {
            return;
        }

        this._labelIndex.setText(`#${messageId}    ${LangUtils.getTimestampShortText(HelpersMisc.getExisted(messageData.getStartTime()))} ~ ${LangUtils.getTimestampShortText(HelpersMisc.getExisted(messageData.getEndTime()))}`);

        const textArray     = messageData.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText([
            `${LangUtils.getText(LangConstants.TextType.B0455)}: ${LangUtils.getLanguageText({ textArray, languageType: LangConstants.LanguageType.Chinese, useAlternate: false }) ?? `----`}`,
            `${LangUtils.getText(LangConstants.TextType.B0456)}: ${LangUtils.getLanguageText({ textArray, languageType: LangConstants.LanguageType.English, useAlternate: false }) ?? `----`}`,
        ].join(`\n\n`));

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 28);
    }

    private _onTouchedBtnDelete(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0220),
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                BroadcastsGateway.reqBroadcastDeleteMessage(messageId);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setText(LangUtils.getText(LangConstants.TextType.B0220));
    }
}
