import {
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Ui_Components_UiOpenableComponent,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiRadioButton,
    type Ui_Types_UiRadioButtonData,
} from "../../internal.ts";

export class UiRadioButton extends Ui_Components_UiOpenableComponent.UiOpenableComponent<Ui_Types_UiRadioButtonData.UiRadioButtonData> implements Ui_Interfaces_IUiRadioButton.IUiRadioButton {
    private readonly _groupLeft!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgLeftOn?        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgLeftOff?       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelLeft?        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRight!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgRightOn?       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgRightOff?      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRight?       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupLeft,      callback : this._onTouchedGroupLeft },
            { ui : this._groupRight,     callback : this._onTouchedGroupRight },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);

        {
            const groupLeft = this._groupLeft;
            groupLeft.setIsTouchEnabled(true);
            groupLeft.setIsTouchChildrenEnabled(false);
        }
        {
            const groupRight = this._groupRight;
            groupRight.setIsTouchEnabled(true);
            groupRight.setIsTouchChildrenEnabled(false);
        }
    }

    protected override _doApplyOpenData(): Promise<void> | void {
        this._updateView();
    }

    // public setData(data: DataForUiRadioButton): void {
    //     this._clearData();
    //     this._data = data;

    //     this.updateView();
    // }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (!openData) {
            return;
        }

        this._updateLabels();

        const isLeftOn = openData.checkerForLeftOn();
        this._imgLeftOn?.setIsVisible(isLeftOn);
        this._imgLeftOff?.setIsVisible(!isLeftOn);
        this._imgRightOn?.setIsVisible(!isLeftOn);
        this._imgRightOff?.setIsVisible(isLeftOn);
    }
    private _updateLabels(): void {
        const openData = this.getOpenData();
        if (!openData) {
            return;
        }

        const isLeftOn = openData.checkerForLeftOn();
        {
            const labelLeft = this._labelLeft;
            if (labelLeft) {
                labelLeft.setLangText(openData.leftTextType, openData.leftLangType);
                labelLeft.setTextColor(getTextColor(isLeftOn));
            }
        }
        {
            const labelRight = this._labelRight;
            if (labelRight) {
                labelRight.setLangText(openData.rightTextType, openData.rightLangType);
                labelRight.setTextColor(getTextColor(!isLeftOn));
            }
        }
    }

    private _onTouchedGroupLeft(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgLeftOn?.getIsVisible())) {
            data.callbackOnLeft();
            this._updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupRight(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgRightOn?.getIsVisible())) {
            data.callbackOnRight();
            this._updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabels();
    }
}

function getTextColor(isOn: boolean): number {
    return isOn ? 0xFFFFFF : 0x889988;
}
