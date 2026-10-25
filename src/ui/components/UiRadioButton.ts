import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiOpenableComponent } from "./UiOpenableComponent.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiRadioButton } from "../interfaces/IUiRadioButton.ts";
import type { UiRadioButtonData } from "../types/UiRadioButtonData.ts";

export class UiRadioButton extends UiOpenableComponent<UiRadioButtonData> implements IUiRadioButton {
    private readonly _groupLeft!        : IUiContainer;
    private readonly _imgLeftOn?        : IUiImage;
    private readonly _imgLeftOff?       : IUiImage;
    private readonly _labelLeft?        : IUiLabel;

    private readonly _groupRight!       : IUiContainer;
    private readonly _imgRightOn?       : IUiImage;
    private readonly _imgRightOff?      : IUiImage;
    private readonly _labelRight?       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupLeft,      callback: this._onTouchedGroupLeft },
            { ui: this._groupRight,     callback: this._onTouchedGroupRight },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this.setMouseStyle(MouseStyleType.Pointer);

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
                labelLeft.setText(getText(openData.leftTextType, openData.leftLangType));
                labelLeft.setTextColor(getTextColor(isLeftOn));
            }
        }
        {
            const labelRight = this._labelRight;
            if (labelRight) {
                labelRight.setText(getText(openData.rightTextType, openData.rightLangType));
                labelRight.setTextColor(getTextColor(!isLeftOn));
            }
        }
    }

    private _onTouchedGroupLeft(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgLeftOn?.getIsVisible())) {
            data.callbackOnLeft();
            this._updateView();
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupRight(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgRightOn?.getIsVisible())) {
            data.callbackOnRight();
            this._updateView();
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabels();
    }
}

function getTextColor(isOn: boolean): number {
    return isOn ? 0xFFFFFF : 0x889988;
}
