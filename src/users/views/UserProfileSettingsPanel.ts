import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { Common } from "../Constants.ts";
import { getSelfUserId, getSelfNickname } from "../Model.ts";
import { reqUserGetPublicInfo, reqSetNickname } from "../Proxy.ts";
import { checkIsNicknameValid } from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _group!                    : IUiContainer;
    private readonly _scroller!                 : IUiScroller<IUiContainer>;

    private readonly _groupButtons!             : IUiContainer;
    private readonly _btnChangeAvatar!          : IUiButton;
    private readonly _btnChangeNickname!        : IUiButton;
    private readonly _btnChangePassword!        : IUiButton;
    private readonly _btnChangeDiscordId!       : IUiButton;
    private readonly _btnChangeMedal!           : IUiButton;
    private readonly _btnChangeEmail!           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetPublicInfo,            callback: this._onMsgUserGetPublicInfo },
            { type: TypeId.MsgUserSetNickname,              callback: this._onMsgUserSetNickname },
            { type: TypeId.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
            { type: TypeId.MsgUserSetShowMedalIdArray,      callback: this._onMsgUserSetShowMedalIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnChangeAvatar,        callback: this._onTouchedBtnChangeAvatar },
            { ui: this._btnChangeNickname,      callback: this._onTouchedBtnChangeNickname },
            { ui: this._btnChangePassword,      callback: this._onTouchedBtnChangePassword },
            { ui: this._btnChangeDiscordId,     callback: this._onTouchedBtnChangeDiscordId },
            { ui: this._btnChangeMedal,         callback: this._onTouchedBtnChangeMedal },
            { ui: this._btnChangeEmail,         callback: this._onTouchedBtnChangeEmail },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._scroller.scrollTop();
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        showLang(TextType.OperationSucceeded);

        const selfUserId = getExisted(getSelfUserId());
        reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = getExisted(getSelfUserId());
        reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetShowMedalIdArray(): void {
        show(getText(TextType.OperationSucceeded));
    }

    private _onTouchedBtnChangeAvatar(): void {
        openPanel(getDict().UserSetAvatarPanel, void 0);
    }
    private _onTouchedBtnChangeNickname(): void {
        const currentNickname = getSelfNickname() ?? ``;
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0149),
            tips            : getText(TextType.A0066),
            minLength       : Common.NicknameMinLength,
            maxChars        : Common.NicknameMaxLength,
            charRestrict    : null,
            currentValue    : currentNickname,
            callback        : panel => {
                const nickname = panel.getInputText();
                if (nickname === currentNickname) {
                    return;
                }

                if (!checkIsNicknameValid(nickname)) {
                    showLang(TextType.A0002);
                } else {
                    reqSetNickname(nickname);
                }
            },
        });
    }
    private _onTouchedBtnChangePassword(): void {
        openPanel(getDict().UserSetPasswordPanel, void 0);
    }
    private _onTouchedBtnChangeDiscordId(): void {
        openPanel(getDict().UserSetDiscordInfoPanel, void 0);
    }
    private _onTouchedBtnChangeMedal(): void {
        openPanel(getDict().UserMedalPanel, void 0);
    }
    private _onTouchedBtnChangeEmail(): void {
        openPanel(getDict().UserSetEmailPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
    }

    private _updateGroupButtons(): void {
        // nothing to do
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0560);
        this._btnChangeAvatar.setLangText(TextType.B0707);
        this._btnChangeNickname.setLangText(TextType.B0175);
        this._btnChangePassword.setLangText(TextType.B0171);
        this._btnChangeDiscordId.setLangText(TextType.B0150);
        this._btnChangeMedal.setLangText(TextType.B1018);
        this._btnChangeEmail.setLangText(TextType.B1332);
    }
}
