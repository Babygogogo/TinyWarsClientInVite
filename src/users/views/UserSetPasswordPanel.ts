import { show } from "../../FloatText.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { setPassword } from "../../localData/Storage.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import { setSelfPassword } from "../Model.ts";
import { reqUserSetPassword } from "../Proxy.ts";
import { checkIsPasswordValid } from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _labelOldPasswordTitle!    : IUiLabel;
    private readonly _inputOldPassword!         : IUiPromptedInput;
    private readonly _labelNewPasswordTitle0!   : IUiLabel;
    private readonly _inputNewPassword0!        : IUiPromptedInput;
    private readonly _labelNewPasswordTitle1!   : IUiLabel;
    private readonly _inputNewPassword1!        : IUiPromptedInput;
    private readonly _btnConfirm!               : IUiButton;
    private readonly _btnClose!                 : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateOnLanguageChanged();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        // nothing to do
    }

    private _onMsgUserSetPassword(): void {
        show(getText(TextType.A0148));

        const password = this._inputNewPassword0.trimInputText() ?? ``;
        setPassword(password);
        setSelfPassword(password);
        this.closePanel();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateOnLanguageChanged();
    }

    private _onTouchedBtnConfirm(): void {
        const newPassword = this._inputNewPassword0.trimInputText() ?? ``;
        if (!checkIsPasswordValid(newPassword)) {
            show(getText(TextType.A0003));
        } else if (newPassword !== this._inputNewPassword1.trimInputText()) {
            show(getText(TextType.A0147));
        } else {
            reqUserSetPassword(this._inputOldPassword.trimInputText() ?? ``, newPassword);
        }
    }

    private _updateOnLanguageChanged(): void {
        this._labelTitle.setText(getText(TextType.B0426));
        this._labelOldPasswordTitle.setText(getText(TextType.B0427));
        this._labelNewPasswordTitle0.setText(getText(TextType.B0428));
        this._labelNewPasswordTitle1.setText(getText(TextType.B0429));
        this._btnConfirm.setText(getText(TextType.B0026));
        this._btnClose.setText(getText(TextType.B0154));
    }
}
