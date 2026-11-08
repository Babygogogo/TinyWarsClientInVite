import {
    AuxiliaryTypes_ChatToTarget,
    GamePanels_Dict,
    Users_Model,
    Chat_Model,
    Lang_Utils,
    GamePanels_Manager,
    Chat_Proxy,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export interface OpenData {
    userId      : number | null;
    messageId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupButtons!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnUserInfo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPrivateChat!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMessage!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCopyMessage!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnUserInfo,            callback : this._onTouchedBtnUserInfo },
            { ui : this._btnPrivateChat,         callback : this._onTouchedBtnPrivateChat },
            { ui : this._btnDeleteMessage,       callback : this._onTouchedBtnDeleteMessage },
            { ui : this._btnCopyMessage,         callback : this._onTouchedBtnCopyMessage },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnUserInfo(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, {
            userId : userId,
        });
        this.closePanel();
    }
    private _onTouchedBtnPrivateChat(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
            toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                toUserId : userId,
            }), 
        });
        this.closePanel();
    }
    private _onTouchedBtnDeleteMessage(): void {
        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0286),
            callback   : () => {
                Chat_Proxy.reqChatDeleteMessage(messageId);
                this.closePanel();
            },
        });
    }
    private async _onTouchedBtnCopyMessage(): Promise<void> {
        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        if (navigator?.clipboard?.writeText == null) {
            FloatText.showLang(Lang_Constants.TextType.A0275);
            return;
        }

        try {
            const text = Chat_Model.getMessage(messageId)?.getContent();
            await navigator.clipboard.writeText(text ?? ``);

            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        } catch {
            FloatText.showLang(Lang_Constants.TextType.A0275);
        }
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
    }

    private _updateGroupButtons(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group = this._groupButtons;
        group.removeAllItems(false);
        group.addItem(this._btnCopyMessage, false);

        const userId        = openData.userId;
        const selfUserId    = Users_Model.getSelfUserId();
        if ((userId != null) && (userId > 1000000)) {
            group.addItem(this._btnUserInfo, false);

            if (userId !== selfUserId) {
                group.addItem(this._btnPrivateChat, false);
            }
        }
        if ((Users_Model.getIsSelfAdmin())                                               ||
            (Users_Model.getIsSelfChatManager())                                         ||
            ((Chat_Model.getMessage(openData.messageId)?.getFromUserId() ?? 0) === selfUserId)
        ) {
            group.addItem(this._btnDeleteMessage, false);
        }

        group.arrangeItems();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnUserInfo.setLangText(Lang_Constants.TextType.B0224);
        this._btnPrivateChat.setLangText(Lang_Constants.TextType.B0383);
        this._btnDeleteMessage.setLangText(Lang_Constants.TextType.B0838);
        this._btnCopyMessage.setLangText(Lang_Constants.TextType.B1147);
    }
}
