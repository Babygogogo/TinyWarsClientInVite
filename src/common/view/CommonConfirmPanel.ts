import {
    Stages_Constants,
    Keyboard_KbTypes,
    Lang_Utils,
    Numbers_Utils,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
} from "../../internal.ts";

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
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrContent!   : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm1!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm2!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnCancel,      callback : this._onTouchedBtnCancel },
            { ui : this._btnConfirm1,    callback : this._onTouchedBtnConfirm },
            { ui : this._btnConfirm2,    callback : this._onTouchedBtnConfirm },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
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
        this._btnConfirm1.setText(openData.getTextForConfirm?.() || Lang_Utils.getText(Lang_Constants.TextType.B0026));
        this._btnConfirm2.setText(openData.getTextForConfirm?.() || Lang_Utils.getText(Lang_Constants.TextType.B0026));
        this._btnCancel.setText(openData.getTextForCancel?.() || Lang_Utils.getText(Lang_Constants.TextType.B0154));
        this._labelTitle.setText(openData.getTitle?.() || Lang_Utils.getText(Lang_Constants.TextType.B0088));
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(openData.getContent());

        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            rawValue : labelContent.getScaledHeight() + 130,
            minValue : 190,
            maxValue : Stages_Constants.Dimension.DesignMinHeight,
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

    private _onKeyboard(data: Keyboard_KbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        if (newKeys.has(Keyboard_KbTypes.KeyCode.J)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
            this._onTouchedBtnConfirm();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.K)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Escape)) {
            const openData = this.getOpenData();
            if ((openData?.showButtonClose) || (openData?.callbackOnCancel == null)) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
                this.closePanel();
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            }
        }
    }
}
