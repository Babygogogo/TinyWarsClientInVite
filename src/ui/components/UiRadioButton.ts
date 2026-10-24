import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiOpenableComponent from "./UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiRadioButton from "../interfaces/IUiRadioButton.ts";
import type * as UiTypesUiRadioButtonData from "../types/UiRadioButtonData.ts";

export class UiRadioButton extends UiComponentsUiOpenableComponent.UiOpenableComponent<UiTypesUiRadioButtonData.UiRadioButtonData> implements UiInterfacesIUiRadioButton.IUiRadioButton {
    private readonly _groupLeft!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgLeftOn?        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgLeftOff?       : UiInterfacesIUiImage.IUiImage;
    private readonly _labelLeft?        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRight!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgRightOn?       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgRightOff?      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRight?       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupLeft,      callback: this._onTouchedGroupLeft },
            { ui: this._groupRight,     callback: this._onTouchedGroupRight },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);

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
                labelLeft.setText(LangUtils.getText(openData.leftTextType, openData.leftLangType));
                labelLeft.setTextColor(getTextColor(isLeftOn));
            }
        }
        {
            const labelRight = this._labelRight;
            if (labelRight) {
                labelRight.setText(LangUtils.getText(openData.rightTextType, openData.rightLangType));
                labelRight.setTextColor(getTextColor(!isLeftOn));
            }
        }
    }

    private _onTouchedGroupLeft(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgLeftOn?.getIsVisible())) {
            data.callbackOnLeft();
            this._updateView();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupRight(): void {
        const data = this.getOpenData();
        if ((data) && (!this._imgRightOn?.getIsVisible())) {
            data.callbackOnRight();
            this._updateView();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabels();
    }
}

function getTextColor(isOn: boolean): number {
    return isOn ? 0xFFFFFF : 0x889988;
}
