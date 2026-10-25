import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { getMessage } from "../Model.ts";
import { reqChatDeleteMessage } from "../Proxy.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfUserId, getIsSelfAdmin, getIsSelfChatManager } from "../../users/Model.ts";

export interface OpenData {
    userId      : number | null;
    messageId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _group!                    : IUiContainer;

    private readonly _groupButtons!             : IUiLayout;
    private readonly _btnUserInfo!              : IUiButton;
    private readonly _btnPrivateChat!           : IUiButton;
    private readonly _btnDeleteMessage!         : IUiButton;
    private readonly _btnCopyMessage!           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnUserInfo,            callback: this._onTouchedBtnUserInfo },
            { ui: this._btnPrivateChat,         callback: this._onTouchedBtnPrivateChat },
            { ui: this._btnDeleteMessage,       callback: this._onTouchedBtnDeleteMessage },
            { ui: this._btnCopyMessage,         callback: this._onTouchedBtnCopyMessage },
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

        openPanel(getDict().UserPanel, {
            userId  : userId,
        });
        this.closePanel();
    }
    private _onTouchedBtnPrivateChat(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({
            toUserId    : userId,
        }) });
        this.closePanel();
    }
    private _onTouchedBtnDeleteMessage(): void {
        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0286),
            callback: () => {
                reqChatDeleteMessage(messageId);
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
            showLang(TextType.A0275);
            return;
        }

        try {
            const text = getMessage(messageId)?.getContent();
            await navigator.clipboard.writeText(text ?? ``);

            showLang(TextType.OperationSucceeded);
        } catch {
            showLang(TextType.A0275);
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
        const selfUserId    = getSelfUserId();
        if ((userId != null) && (userId > 1000000)) {
            group.addItem(this._btnUserInfo, false);

            if (userId !== selfUserId) {
                group.addItem(this._btnPrivateChat, false);
            }
        }
        if ((getIsSelfAdmin())                                               ||
            (getIsSelfChatManager())                                         ||
            ((getMessage(openData.messageId)?.getFromUserId() ?? 0) === selfUserId)
        ) {
            group.addItem(this._btnDeleteMessage, false);
        }

        group.arrangeItems();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0155);
        this._btnUserInfo.setLangText(TextType.B0224);
        this._btnPrivateChat.setLangText(TextType.B0383);
        this._btnDeleteMessage.setLangText(TextType.B0838);
        this._btnCopyMessage.setLangText(TextType.B1147);
    }
}
