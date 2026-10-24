import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS from "../../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    getTitleText        : (() => string) | null;
    callbackOnConfirm   : (userId: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _inputNickname!            : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearNickname!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelSearchRange!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSearchFollowing!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearchNotFollowing!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearchAll!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listUser!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelTips!                : UiInterfacesIUiLabel.IUiLabel;

    private _selectedUserId                     : number | null = null;
    private _candidateUserIdArray               : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetUsersByNickname,   callback: this._onNotifyMsgUserGetUsersByNickname },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },

            { ui: this._btnClearNickname,       callback: this._onTouchedBtnClearNickname },

            { ui: this._btnSearchFollowing,     callback: this._onTouchedBtnSearchFollowed },
            { ui: this._btnSearchNotFollowing,  callback: this._onTouchedBtnSearchNotFollowing },
            { ui: this._btnSearchAll,           callback: this._onTouchedBtnSearchAll },
        ]);
        this._setInputListenerArray([
            { ui: this._inputNickname,          callback: this._onFocusOutInputNickname,    eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUser.setItemRendererClass(UnitTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._candidateUserIdArray = UsersModel.getFollowingUserIdArray()?.concat() ?? [];
        this._updateListNickname();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUser.removeAllItems();

        await super._onClosed();
    }

    public getSelectedUserId(): number | null {
        return this._selectedUserId;
    }

    public updateOnSelectUser(userId: number): void {
        const oldSelectedUserId = this._selectedUserId;
        if (oldSelectedUserId === userId) {
            this.getOpenData()?.callbackOnConfirm(userId);
            this.closePanel();

        } else {
            this._selectedUserId = userId;

            const list      = this._listUser;
            const dataArray = list.getBoundDataArray() ?? [];
            const oldIndex  = dataArray.findIndex(v => v?.userId === oldSelectedUserId);
            const newIndex  = dataArray.findIndex(v => v?.userId === userId);
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
        }
    }

    private _onFocusOutInputNickname(): void {
        this._inputNickname.trimInputText();
    }
    private _onTouchedBtnClearNickname(): void {
        this._inputNickname.setInputText(``);
    }

    private _onTouchedBtnSearchFollowed(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            this._candidateUserIdArray  = UsersModel.getFollowingUserIdArray()?.concat() ?? [];
            this._selectedUserId        = null;
            this._updateListNickname();
        } else {
            UsersProxy.reqUserGetUsersByNickname(nickname, true);
        }
    }
    private _onTouchedBtnSearchNotFollowing(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0146, LangUtils.getText(LangConstants.TextType.B0175)));
        } else {
            UsersProxy.reqUserGetUsersByNickname(nickname, false);
        }
    }
    private _onTouchedBtnSearchAll(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0146, LangUtils.getText(LangConstants.TextType.B0175)));
        } else {
            UsersProxy.reqUserGetUsersByNickname(nickname, null);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserGetUsersByNickname(e: VendorEgretEgret.Event): void {
        const data                  = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS.S;
        this._candidateUserIdArray  = data.getUserIdArray();
        this._selectedUserId        = null;
        this._updateListNickname();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSearchRange.setLangText(LangConstants.TextType.A0834);
        this._btnSearchFollowing.setLangText(LangConstants.TextType.B0997);
        this._btnSearchNotFollowing.setLangText(LangConstants.TextType.B0998);
        this._btnSearchAll.setLangText(LangConstants.TextType.B0776);
        this._labelTips.setLangText(LangConstants.TextType.B1249);
        this._inputNickname.setPromptText(LangUtils.getText(LangConstants.TextType.B0175));

        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const func = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(func ? func() : LangUtils.getText(LangConstants.TextType.B0031));
    }

    private async _updateListNickname(): Promise<void> {
        const dataArray: DataForUnitTypeRenderer[] = [];
        for (const userId of this._candidateUserIdArray) {
            dataArray.push({
                userId,
                panel   : this,
            });
        }

        await this._listUser.bindData(dataArray);
    }
}

interface DataForUnitTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    userId  : number;
    panel   : Panel;
}
class UnitTypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
    private readonly _groupHelp!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupSelect!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelUserId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupHelp,        callback: this._onTouchedGroupHelp },
            { ui: this._groupSelect,      callback: this._onTouchedGroupSelect },
        ]);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelName();
        this._updateGroupSelect();
    }

    private _onTouchedGroupHelp(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: this.getOpenData()?.userId });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupSelect(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        openData.panel.updateOnSelectUser(openData.userId);
    }

    private async _updateLabelName(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelUserId.setText(`#${userId}`);

        const nickname = await UsersModel.getUserNickname(userId) ?? LangConstants.UndefinedError;
        if (userId === this.getOpenData()?.userId) {
            this._labelName.setText(nickname);
        }

        this._layoutName.arrangeItems();
    }
    private _updateGroupSelect(): void {
        const openData = this.getOpenData();
        this._imgSelected.setIsVisible((openData != null) && (openData.panel.getSelectedUserId() === openData.userId));
    }
}
