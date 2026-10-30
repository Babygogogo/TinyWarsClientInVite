import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import { Constants } from "../../urls/Constants.ts";
import { getSelfDiscordInfo } from "../Model.ts";
import { reqSetDiscordInfo } from "../Proxy.ts";
import { checkIsDiscordIdValid } from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnHelp!          : IUiButton;

    private readonly _labelDiscordId!   : IUiLabel;
    private readonly _inputDiscordId!   : IUiPromptedInput;

    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnDiscord!       : IUiButton;

    private readonly _groupTurn!        : IUiContainer;
    private readonly _imgTurn!          : IUiImage;
    private readonly _labelTurn!        : IUiLabel;

    private readonly _groupRankPhase!   : IUiContainer;
    private readonly _imgRankPhase!     : IUiImage;
    private readonly _labelRankPhase!   : IUiLabel;

    private readonly _groupRoom!        : IUiContainer;
    private readonly _imgRoom!          : IUiImage;
    private readonly _labelRoom!        : IUiLabel;

    private _isRequesting   = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
            { type: TypeId.MsgUserSetDiscordInfoFailed,     callback: this._onMsgUserSetDiscordIdFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },

            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnDiscord,         callback: this._onTouchedBtnDiscord },

            { ui: this._groupTurn,          callback: this._onTouchedGroupTurn },
            { ui: this._groupRankPhase,     callback: this._onTouchedGroupRankPhase },
            { ui: this._groupRoom,          callback: this._onTouchedGroupRoom },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._isRequesting = false;

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const discordInfo = getSelfDiscordInfo();
        this._inputDiscordId.setInputText(discordInfo?.getDiscordId() ?? ``);
        this._imgRankPhase.setIsVisible(!discordInfo?.getIgnoreRankPhaseNotification());
        this._imgRoom.setIsVisible(!discordInfo?.getIgnoreRoomNotification());
        this._imgTurn.setIsVisible(!discordInfo?.getIgnoreTurnNotification());
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0067),
        });
    }
    private _onTouchedBtnConfirm(): void {
        if (this._isRequesting) {
            show(getText(TextType.A0046));
        } else {
            const discordId = this._inputDiscordId.getInputText() ?? ``;
            if (!checkIsDiscordIdValid(discordId)) {
                show(getText(TextType.A0048));
            } else {
                this._isRequesting = true;
                reqSetDiscordInfo({
                    discordId,
                    ignoreRankPhaseNotification : this._imgRankPhase.getIsVisible() ? null : true,
                    ignoreRoomNotification      : this._imgRoom.getIsVisible() ? null : true,
                    ignoreTurnNotification      : this._imgTurn.getIsVisible() ? null : true,
                });
            }
        }
    }

    private _onTouchedBtnDiscord(): void {
        if ((window) && (window.open)) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getFormattedText(TextType.F0065, `Discord`),
                callback: () => {
                    window.open(Constants.DiscordUrl);
                },
            });
        }
    }

    private _onTouchedGroupTurn(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const img   = this._imgTurn;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRankPhase(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRankPhase;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRoom(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRoom;
        img.setIsVisible(!img.getIsVisible());
    }

    private _onMsgUserSetDiscordId(): void {
        show(getText(TextType.A0049));
        this.closePanel();
    }
    private _onMsgUserSetDiscordIdFailed(): void {
        this._isRequesting = false;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0150);
        this._labelDiscordId.setLangText(TextType.B0243);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnDiscord.setLangText(TextType.B1330);
        this._labelTurn.setLangText(TextType.B0918);
        this._labelRankPhase.setLangText(TextType.B0919);
        this._labelRoom.setLangText(TextType.B0920);
    }
}
