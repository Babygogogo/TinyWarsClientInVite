import { getAllMessageList } from "../model/ChangeLogModel.ts";
import { reqChangeLogGetMessageList, reqChangeLogAddMessage, reqChangeLogModifyMessage } from "../model/ChangeLogProxy.ts";
import { show } from "../../FloatText.ts";
import { ChangeLogConstants } from "../../gameConfig/GcMisc.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNumText } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTimestampShortText, getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { ChangeLogMessage } from "../../proto/schema/CommonProto/ChangeLog/ChangeLogMessage.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { checkCanSelfEditChangeLog } from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _btnClose!         : IUiButton;

    private readonly _listMessage!      : IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelNoMessage!   : IUiLabel;
    private readonly _btnAddMessage!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgChangeLogGetMessageList, callback: this._onMsgChangeLogGetMessageList },
            { type: TypeId.MsgChangeLogAddMessage,     callback: this._onMsgChangeLogAddMessage },
            { type: TypeId.MsgChangeLogModifyMessage,  callback: this._onMsgChangeLogModifyMessage },
        ]);
        this._setUiListenerArray([
            { ui: this._btnAddMessage,  callback: this._onTouchedBtnAddMessage },
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMessage.setItemRendererClass(MessageRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        if (!getAllMessageList()) {
            reqChangeLogGetMessageList();
        }
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMessage.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgChangeLogGetMessageList(): void {
        this._updateListMessageAndLabelNoMessage();
    }
    private _onMsgChangeLogAddMessage(): void {
        show(getText(TextType.A0154));
        reqChangeLogGetMessageList();
    }
    private _onMsgChangeLogModifyMessage(): void {
        show(getText(TextType.A0154));
        reqChangeLogGetMessageList();
    }

    private _onTouchedBtnAddMessage(): void {
        openPanel(getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => getText(TextType.B0457),
            currentTextArray    : null,
            isMultiline         : true,
            maxLength           : ChangeLogConstants.TextMaxLength,
            callback            : textArray => {
                reqChangeLogAddMessage(textArray);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setText(getText(TextType.B0457));
        this._labelNoMessage.setText(getText(TextType.B0278));
        this._btnAddMessage.setText(getText(TextType.B0454));
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = getAllMessageList()?.map(v => ({ data: v })) ?? [];
        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private async _updateBtnAddMessage(): Promise<void> {
        const btn   = this._btnAddMessage;
        btn.setIsVisible(false);
        btn.setIsVisible(checkCanSelfEditChangeLog());
    }
}

interface DataForMessageRenderer extends UiListItemData{
    data: ChangeLogMessage;
}
class MessageRenderer extends UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : IUiLabel;
    private readonly _labelContent! : IUiLabel;
    private readonly _btnModify!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify,  callback: this._onTouchedBtnModify },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const data = this.getOpenData()?.data;
        if (data == null) {
            return;
        }

        const messageId         = data.getMessageId();
        const createTimestamp   = data.getCreateTimestamp();
        this._labelIndex.setText(`#${messageId == null ? UndefinedError : getNumText(messageId, 3)} (${createTimestamp == null ? UndefinedError : getTimestampShortText(createTimestamp)})`);

        const textArray     = data.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText(textArray == null
            ? UndefinedError
            : (getLanguageText({ textArray }) || UndefinedError)
        );

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 38);

        const btnModify = this._btnModify;
        btnModify.setText(getText(TextType.B0317));
        btnModify.setIsVisible(false);
        btnModify.setIsVisible(checkCanSelfEditChangeLog());
    }

    private _onTouchedBtnModify(): void {
        const data      = this.getOpenData()?.data;
        const messageId = data?.getMessageId();
        if (messageId != null) {
            openPanel(getDict().CommonInputLanguageTextPanel, {
                getTitle            : () => `${getText(TextType.B0317)} #${messageId}`,
                currentTextArray    : data?.getTextList() ?? null,
                maxLength           : ChangeLogConstants.TextMaxLength,
                isMultiline         : true,
                callback            : textArray => {
                    reqChangeLogModifyMessage(messageId, textArray);
                },
            });
        }
    }
}
