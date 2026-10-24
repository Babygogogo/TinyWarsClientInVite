import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

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
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;

    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrContent!   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm1!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm2!  : UiInterfacesIUiButton.IUiButton;

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
        this._btnConfirm1.setText(openData.getTextForConfirm?.() || LangUtils.getText(LangConstants.TextType.B0026));
        this._btnConfirm2.setText(openData.getTextForConfirm?.() || LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(openData.getTextForCancel?.() || LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(openData.getTitle?.() || LangUtils.getText(LangConstants.TextType.B0088));
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(openData.getContent());

        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 130,
            minValue    : 190,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
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

    private _onKeyboard(data: KeyboardKbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        if (newKeys.has(KeyboardKbTypes.KeyCode.J)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
            this._onTouchedBtnConfirm();

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.K)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Escape)) {
            const openData = this.getOpenData();
            if ((openData?.showButtonClose) || (openData?.callbackOnCancel == null)) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
                this.closePanel();
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            }
        }
    }
}
