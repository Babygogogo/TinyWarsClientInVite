import {
    type Helpers_PointerInput,
    Broadcasts_Provider,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    Lang_Constants,
    GamePanels_Manager,
    Broadcasts_Gateway,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddMessage!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMessage!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoMessage!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgBroadcastGetAllMessageIdArray",    callback : this._onNotifyMsgBroadcastGetAllMessageIdArray },
        ]);
        this._setUiListenerArray([
            { ui : this._btnAddMessage,                              callback : this._onTouchedBtnAddMessage },
            { ui : this._btnClose,                                   callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMessage.setItemRendererClass(MessageRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        Broadcasts_Gateway.reqBroadcastGetAllMessageIdArray();
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BroadcastAddMessagePanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0881);
        this._labelNoMessage.setLangText(Lang_Constants.TextType.B0278);
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = [];
        for (const messageId of Broadcasts_Provider.getAllMessageIdArray()) {
            dataArray.push({
                messageId,
            });
        }

        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private _updateBtnAddMessage(): void {
        const btn = this._btnAddMessage;
        btn.setIsVisible(Users_Model.getIsSelfAdmin());
    }
}

interface DataForMessageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    messageId: number;
}
class MessageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDelete!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnDelete,              callback : this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const messageId     = openData.messageId;
        const messageData   = await Broadcasts_Provider.getMessageData(messageId);
        if (messageData == null) {
            return;
        }

        this._labelIndex.setText(`#${messageId}    ${Lang_Utils.getTimestampShortText(messageData.getStartTime())} ~ ${Lang_Utils.getTimestampShortText(messageData.getEndTime())}`);

        const textArray     = messageData.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText([
            `${Lang_Utils.getText(Lang_Constants.TextType.B0455)}: ${Lang_Utils.getLanguageText({ textArray, languageType : Lang_Constants.LanguageType.Chinese, useAlternate : false }) ?? `----`}`,
            `${Lang_Utils.getText(Lang_Constants.TextType.B0456)}: ${Lang_Utils.getLanguageText({ textArray, languageType : Lang_Constants.LanguageType.English, useAlternate : false }) ?? `----`}`,
        ].join(`\n\n`));

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 28);
    }

    private _onTouchedBtnDelete(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0220),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                Broadcasts_Gateway.reqBroadcastDeleteMessage(messageId);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
    }
}
