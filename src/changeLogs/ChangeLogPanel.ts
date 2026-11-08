import {
    Users_Model,
    ChangeLogs_Constants,
    ChangeLogs_Provider,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Text,
    GamePanels_Manager,
    ChangeLogs_Gateway,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../internal.ts";
import type { ChangeLogMessage } from "../proto/schema/CommonProto/ChangeLog/ChangeLogMessage.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMessage!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoMessage!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnAddMessage!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",            callback : this._onNotifyLanguageChanged },
            { type : "MsgChangeLogGetMessageList", callback : this._onMsgChangeLogGetMessageList },
            { type : "MsgChangeLogAddMessage",     callback : this._onMsgChangeLogAddMessage },
            { type : "MsgChangeLogModifyMessage",  callback : this._onMsgChangeLogModifyMessage },
        ]);
        this._setUiListenerArray([
            { ui : this._btnAddMessage,  callback : this._onTouchedBtnAddMessage },
            { ui : this._btnClose,       callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMessage.setItemRendererClass(MessageRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        if (!ChangeLogs_Provider.getAllMessageList()) {
            ChangeLogs_Gateway.reqChangeLogGetMessageList();
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
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0154));
        ChangeLogs_Gateway.reqChangeLogGetMessageList();
    }
    private _onMsgChangeLogModifyMessage(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0154));
        ChangeLogs_Gateway.reqChangeLogGetMessageList();
    }

    private _onTouchedBtnAddMessage(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
            getTitle         : () => Lang_Utils.getText(Lang_Constants.TextType.B0457),
            currentTextArray : null,
            isMultiline      : true,
            maxLength        : ChangeLogs_Constants.Constants.TextMaxLength,
            callback         : textArray => {
                ChangeLogs_Gateway.reqChangeLogAddMessage(textArray);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0457);
        this._labelNoMessage.setLangText(Lang_Constants.TextType.B0278);
        this._btnAddMessage.setLangText(Lang_Constants.TextType.B0454);
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = ChangeLogs_Provider.getAllMessageList()?.map(v => ({ data : v })) ?? [];
        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private async _updateBtnAddMessage(): Promise<void> {
        const btn   = this._btnAddMessage;
        btn.setIsVisible(false);
        btn.setIsVisible(Users_Model.checkCanSelfEditChangeLog());
    }
}

interface DataForMessageRenderer extends Ui_Types_UiListItemData.UiListItemData{
    data: ChangeLogMessage;
}
class MessageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModify!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnModify,  callback : this._onTouchedBtnModify },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const data = this.getOpenData()?.data;
        if (data == null) {
            return;
        }

        const messageId         = data.getMessageId();
        const createTimestamp   = data.getCreateTimestamp();
        this._labelIndex.setText(`#${messageId == null ? Lang_Constants.UndefinedError : Helpers_Text.getNumText(messageId, 3)} (${createTimestamp == null ? Lang_Constants.UndefinedError : Lang_Utils.getTimestampShortText(createTimestamp)})`);

        const textArray     = data.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText(textArray == null
            ? Lang_Constants.UndefinedError
            : (Lang_Utils.getLanguageText({ textArray }) || Lang_Constants.UndefinedError),
        );

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 38);

        const btnModify = this._btnModify;
        btnModify.setLangText(Lang_Constants.TextType.B0317);
        btnModify.setIsVisible(false);
        btnModify.setIsVisible(Users_Model.checkCanSelfEditChangeLog());
    }

    private _onTouchedBtnModify(): void {
        const data      = this.getOpenData()?.data;
        const messageId = data?.getMessageId();
        if (messageId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
                getTitle         : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0317)} #${messageId}`,
                currentTextArray : data?.getTextList() ?? null,
                maxLength        : ChangeLogs_Constants.Constants.TextMaxLength,
                isMultiline      : true,
                callback         : textArray => {
                    ChangeLogs_Gateway.reqChangeLogModifyMessage(messageId, textArray);
                },
            });
        }
    }
}
