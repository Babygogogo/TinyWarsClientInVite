import {
    reqBroadcastGetAllMessageIdArray,
    reqBroadcastDeleteMessage,
} from "../Gateway.ts";
import {
    getAllMessageIdArray,
    getMessageData,
} from "../Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    LanguageType,
} from "../../lang/Constants.ts";
import {
    getText,
    getTimestampShortText,
    getLanguageText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getIsSelfAdmin } from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnAddMessage!    : IUiButton;

    private readonly _listMessage!      : IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelNoMessage!   : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgBroadcastGetAllMessageIdArray,    callback: this._onNotifyMsgBroadcastGetAllMessageIdArray },
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

        reqBroadcastGetAllMessageIdArray();
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
        openPanel(getDict().BroadcastAddMessagePanel, void 0);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setLangText(TextType.B0881);
        this._labelNoMessage.setLangText(TextType.B0278);
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = [];
        for (const messageId of getAllMessageIdArray()) {
            dataArray.push({
                messageId,
            });
        }

        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private _updateBtnAddMessage(): void {
        const btn = this._btnAddMessage;
        btn.setIsVisible(getIsSelfAdmin());
    }
}

interface DataForMessageRenderer extends UiListItemData {
    messageId: number;
}
class MessageRenderer extends UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : IUiLabel;
    private readonly _labelContent! : IUiLabel;
    private readonly _btnDelete!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const messageId     = openData.messageId;
        const messageData   = await getMessageData(messageId);
        if (messageData == null) {
            return;
        }

        this._labelIndex.setText(`#${messageId}    ${getTimestampShortText(messageData.getStartTime())} ~ ${getTimestampShortText(messageData.getEndTime())}`);

        const textArray     = messageData.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText([
            `${getText(TextType.B0455)}: ${getLanguageText({ textArray, languageType: LanguageType.Chinese, useAlternate: false }) ?? `----`}`,
            `${getText(TextType.B0456)}: ${getLanguageText({ textArray, languageType: LanguageType.English, useAlternate: false }) ?? `----`}`,
        ].join(`\n\n`));

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 28);
    }

    private _onTouchedBtnDelete(e: Event): void {
        e.stopPropagation();

        const messageId = this.getOpenData()?.messageId;
        if (messageId == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0220),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                reqBroadcastDeleteMessage(messageId);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(TextType.B0220);
    }
}
