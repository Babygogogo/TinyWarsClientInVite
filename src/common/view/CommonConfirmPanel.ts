import {
    type EventData,
    KeyCode,
} from "../../keyboard/KbTypes.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    getTitle?           : () => string;
    getContent          : () => string;
    callback            : () => any;
    callbackOnCancel?   : () => any;
    getTextForConfirm?  : () => string;
    getTextForCancel?   : () => string;
    showButtonClose?    : boolean;
    showRedConfirm?     : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;

    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _scrContent!   : IUiScroller<IUiContainer>;
    private readonly _labelContent! : IUiLabel;
    private readonly _btnClose!     : IUiButton;
    private readonly _btnCancel!    : IUiButton;
    private readonly _btnConfirm1!  : IUiButton;
    private readonly _btnConfirm2!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
            { ui: this._btnConfirm1,    callback: this._onTouchedBtnConfirm, },
            { ui: this._btnConfirm2,    callback: this._onTouchedBtnConfirm, },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
        });
        this._setIsTouchMaskEnabled();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnClose.setIsVisible(!!openData.showButtonClose);
        this._btnConfirm1.setIsVisible(!openData.showRedConfirm);
        this._btnConfirm1.setText(openData.getTextForConfirm?.() || getText(TextType.B0026));
        this._btnConfirm2.setText(openData.getTextForConfirm?.() || getText(TextType.B0026));
        this._btnCancel.setText(openData.getTextForCancel?.() || getText(TextType.B0154));
        this._labelTitle.setText(openData.getTitle?.() || getText(TextType.B0088));
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(openData.getContent());

        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 130,
            minValue    : 190,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }

    private _onTouchedBtnCancel(): void {
        const callback = this.getOpenData()?.callbackOnCancel;
        this.closePanel();
        (callback) && (callback());
    }

    private _onTouchedBtnConfirm(): void {
        const callback = this.getOpenData()?.callback;
        this.closePanel();
        (callback) && (callback());
    }

    private _onKeyboard(data: EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        if (newKeys.has(KeyCode.J)) {
            playShortSfx(ShortSfxCode.ButtonConfirm01);
            this._onTouchedBtnConfirm();

        } else if (newKeys.has(KeyCode.K)) {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();

        } else if (newKeys.has(KeyCode.Escape)) {
            const openData = this.getOpenData();
            if ((openData?.showButtonClose) || (openData?.callbackOnCancel == null)) {
                playShortSfx(ShortSfxCode.ButtonCancel01);
                this.closePanel();
            } else {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            }
        }
    }
}
