import * as ChangeLogModelChangeLogModel from "../model/ChangeLogModel.ts";
import * as ChangeLogModelChangeLogProxy from "../model/ChangeLogProxy.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMisc from "../../gameConfig/GcMisc.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoChangeLogChangeLogMessage from "../../proto/schema/CommonProto/ChangeLog/ChangeLogMessage.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listMessage!      : UiInterfacesIUiScrollList.IUiScrollList<DataForMessageRenderer>;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoMessage!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnAddMessage!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgChangeLogGetMessageList, callback: this._onMsgChangeLogGetMessageList },
            { type: NotificationsTypeId.TypeId.MsgChangeLogAddMessage,     callback: this._onMsgChangeLogAddMessage },
            { type: NotificationsTypeId.TypeId.MsgChangeLogModifyMessage,  callback: this._onMsgChangeLogModifyMessage },
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

        if (!ChangeLogModelChangeLogModel.getAllMessageList()) {
            ChangeLogModelChangeLogProxy.reqChangeLogGetMessageList();
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0154));
        ChangeLogModelChangeLogProxy.reqChangeLogGetMessageList();
    }
    private _onMsgChangeLogModifyMessage(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0154));
        ChangeLogModelChangeLogProxy.reqChangeLogGetMessageList();
    }

    private _onTouchedBtnAddMessage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => LangUtils.getText(LangConstants.TextType.B0457),
            currentTextArray    : null,
            isMultiline         : true,
            maxLength           : GameConfigGcMisc.ChangeLogConstants.TextMaxLength,
            callback            : textArray => {
                ChangeLogModelChangeLogProxy.reqChangeLogAddMessage(textArray);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateListMessageAndLabelNoMessage();
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0457));
        this._labelNoMessage.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnAddMessage.setText(LangUtils.getText(LangConstants.TextType.B0454));
    }
    private async _updateListMessageAndLabelNoMessage(): Promise<void> {
        const dataArray: DataForMessageRenderer[] = ChangeLogModelChangeLogModel.getAllMessageList()?.map(v => ({ data: v })) ?? [];
        this._labelNoMessage.setIsVisible(!dataArray.length);
        await this._listMessage.bindData(dataArray);
    }
    private async _updateBtnAddMessage(): Promise<void> {
        const btn   = this._btnAddMessage;
        btn.setIsVisible(false);
        btn.setIsVisible(UsersModel.checkCanSelfEditChangeLog());
    }
}

interface DataForMessageRenderer extends UiTypesUiListItemData.UiListItemData{
    data: ProtoSchemaCommonProtoChangeLogChangeLogMessage.ChangeLogMessage;
}
class MessageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
    private readonly _labelIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModify!    : UiInterfacesIUiButton.IUiButton;

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
        this._labelIndex.setText(`#${messageId == null ? LangConstants.UndefinedError : HelpersText.getNumText(messageId, 3)} (${createTimestamp == null ? LangConstants.UndefinedError : LangUtils.getTimestampShortText(createTimestamp)})`);

        const textArray     = data.getTextList();
        const labelContent  = this._labelContent;
        labelContent.setText(textArray == null
            ? LangConstants.UndefinedError
            : (LangUtils.getLanguageText({ textArray }) || LangConstants.UndefinedError)
        );

        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 38);

        const btnModify = this._btnModify;
        btnModify.setText(LangUtils.getText(LangConstants.TextType.B0317));
        btnModify.setIsVisible(false);
        btnModify.setIsVisible(UsersModel.checkCanSelfEditChangeLog());
    }

    private _onTouchedBtnModify(): void {
        const data      = this.getOpenData()?.data;
        const messageId = data?.getMessageId();
        if (messageId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
                getTitle            : () => `${LangUtils.getText(LangConstants.TextType.B0317)} #${messageId}`,
                currentTextArray    : data?.getTextList() ?? null,
                maxLength           : GameConfigGcMisc.ChangeLogConstants.TextMaxLength,
                isMultiline         : true,
                callback            : textArray => {
                    ChangeLogModelChangeLogProxy.reqChangeLogModifyMessage(messageId, textArray);
                },
            });
        }
    }
}
