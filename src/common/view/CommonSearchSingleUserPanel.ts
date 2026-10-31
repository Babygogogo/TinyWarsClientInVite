import {
    type Notifications_Mapping,
    type Helpers_PointerInput,
    Tween_Executor,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Users_Proxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Types_UiInputEventType,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { S as UserGetUsersByNicknameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";

export interface OpenData {
    getTitleText        : (() => string) | null;
    callbackOnConfirm   : (userId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _inputNickname!            : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearNickname!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelSearchRange!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSearchFollowing!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearchNotFollowing!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearchAll!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listUser!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelTips!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedUserId                     : number | null = null;
    private _candidateUserIdArray               : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgUserGetUsersByNickname",   callback : this._onNotifyMsgUserGetUsersByNickname },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },

            { ui : this._btnClearNickname,       callback : this._onTouchedBtnClearNickname },

            { ui : this._btnSearchFollowing,     callback : this._onTouchedBtnSearchFollowed },
            { ui : this._btnSearchNotFollowing,  callback : this._onTouchedBtnSearchNotFollowing },
            { ui : this._btnSearchAll,           callback : this._onTouchedBtnSearchAll },
        ]);
        this._setInputListenerArray([
            { ui : this._inputNickname,          callback : this._onFocusOutInputNickname,    eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUser.setItemRendererClass(UnitTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._candidateUserIdArray = Users_Model.getFollowingUserIdArray()?.concat() ?? [];
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
            this._candidateUserIdArray  = Users_Model.getFollowingUserIdArray()?.concat() ?? [];
            this._selectedUserId        = null;
            this._updateListNickname();
        } else {
            Users_Proxy.reqUserGetUsersByNickname(nickname, true);
        }
    }
    private _onTouchedBtnSearchNotFollowing(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0146, Lang_Utils.getText(Lang_Constants.TextType.B0175)));
        } else {
            Users_Proxy.reqUserGetUsersByNickname(nickname, false);
        }
    }
    private _onTouchedBtnSearchAll(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0146, Lang_Utils.getText(Lang_Constants.TextType.B0175)));
        } else {
            Users_Proxy.reqUserGetUsersByNickname(nickname, null);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserGetUsersByNickname(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserGetUsersByNickname"]>): void {
        const data                  = (e.data as { msg: UserGetUsersByNicknameResponse }).msg;
        this._candidateUserIdArray  = data.getUserIdArray();
        this._selectedUserId        = null;
        this._updateListNickname();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSearchRange.setLangText(Lang_Constants.TextType.A0834);
        this._btnSearchFollowing.setLangText(Lang_Constants.TextType.B0997);
        this._btnSearchNotFollowing.setLangText(Lang_Constants.TextType.B0998);
        this._btnSearchAll.setLangText(Lang_Constants.TextType.B0776);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
        this._inputNickname.setPromptText(Lang_Utils.getText(Lang_Constants.TextType.B0175));

        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const func = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(func ? func() : Lang_Utils.getText(Lang_Constants.TextType.B0031));
    }

    private async _updateListNickname(): Promise<void> {
        const dataArray: DataForUnitTypeRenderer[] = [];
        for (const userId of this._candidateUserIdArray) {
            dataArray.push({
                userId,
                panel : this,
            });
        }

        await this._listUser.bindData(dataArray);
    }
}

interface DataForUnitTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    userId  : number;
    panel   : Panel;
}
class UnitTypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
    private readonly _groupHelp!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupSelect!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelUserId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupHelp,        callback : this._onTouchedGroupHelp },
            { ui : this._groupSelect,      callback : this._onTouchedGroupSelect },
        ]);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelName();
        this._updateGroupSelect();
    }

    private _onTouchedGroupHelp(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : this.getOpenData()?.userId });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupSelect(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        openData.panel.updateOnSelectUser(openData.userId);
    }

    private async _updateLabelName(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelUserId.setText(`#${userId}`);

        const nickname = await Users_Model.getUserNickname(userId) ?? Lang_Constants.UndefinedError;
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
