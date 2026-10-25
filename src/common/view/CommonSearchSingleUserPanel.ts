import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getFollowingUserIdArray, getUserNickname } from "../../users/Model.ts";
import { reqUserGetUsersByNickname } from "../../users/Proxy.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface OpenData {
    getTitleText        : (() => string) | null;
    callbackOnConfirm   : (userId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _inputNickname!            : IUiPromptedInput;
    private readonly _btnClearNickname!         : IUiButton;

    private readonly _labelSearchRange!         : IUiLabel;
    private readonly _btnSearchFollowing!       : IUiButton;
    private readonly _btnSearchNotFollowing!    : IUiButton;
    private readonly _btnSearchAll!             : IUiButton;

    private readonly _listUser!                 : IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelTips!                : IUiLabel;

    private _selectedUserId                     : number | null = null;
    private _candidateUserIdArray               : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetUsersByNickname,   callback: this._onNotifyMsgUserGetUsersByNickname },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },

            { ui: this._btnClearNickname,       callback: this._onTouchedBtnClearNickname },

            { ui: this._btnSearchFollowing,     callback: this._onTouchedBtnSearchFollowed },
            { ui: this._btnSearchNotFollowing,  callback: this._onTouchedBtnSearchNotFollowing },
            { ui: this._btnSearchAll,           callback: this._onTouchedBtnSearchAll },
        ]);
        this._setInputListenerArray([
            { ui: this._inputNickname,          callback: this._onFocusOutInputNickname,    eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUser.setItemRendererClass(UnitTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._candidateUserIdArray = getFollowingUserIdArray()?.concat() ?? [];
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
            this._candidateUserIdArray  = getFollowingUserIdArray()?.concat() ?? [];
            this._selectedUserId        = null;
            this._updateListNickname();
        } else {
            reqUserGetUsersByNickname(nickname, true);
        }
    }
    private _onTouchedBtnSearchNotFollowing(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            show(getFormattedText(TextType.F0146, getText(TextType.B0175)));
        } else {
            reqUserGetUsersByNickname(nickname, false);
        }
    }
    private _onTouchedBtnSearchAll(): void {
        const nickname = this._inputNickname.getInputText()?.trim() ?? ``;
        if (nickname.length <= 0) {
            show(getFormattedText(TextType.F0146, getText(TextType.B0175)));
        } else {
            reqUserGetUsersByNickname(nickname, null);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserGetUsersByNickname(e: Event): void {
        const data                  = e.data as S;
        this._candidateUserIdArray  = data.getUserIdArray();
        this._selectedUserId        = null;
        this._updateListNickname();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSearchRange.setLangText(TextType.A0834);
        this._btnSearchFollowing.setLangText(TextType.B0997);
        this._btnSearchNotFollowing.setLangText(TextType.B0998);
        this._btnSearchAll.setLangText(TextType.B0776);
        this._labelTips.setLangText(TextType.B1249);
        this._inputNickname.setPromptText(getText(TextType.B0175));

        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const func = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(func ? func() : getText(TextType.B0031));
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

interface DataForUnitTypeRenderer extends UiListItemData {
    userId  : number;
    panel   : Panel;
}
class UnitTypeRenderer extends UiListItemRenderer<DataForUnitTypeRenderer> {
    private readonly _groupHelp!        : IUiContainer;
    private readonly _groupSelect!      : IUiContainer;
    private readonly _imgSelected!      : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelUserId!      : IUiLabel;
    private readonly _labelName!        : IUiLabel;

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
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelName();
        this._updateGroupSelect();
    }

    private _onTouchedGroupHelp(e: Event): void {
        e.stopPropagation();

        openPanel(getDict().UserPanel, { userId: this.getOpenData()?.userId });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupSelect(e: Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);
        openData.panel.updateOnSelectUser(openData.userId);
    }

    private async _updateLabelName(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._labelUserId.setText(`#${userId}`);

        const nickname = await getUserNickname(userId) ?? UndefinedError;
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
