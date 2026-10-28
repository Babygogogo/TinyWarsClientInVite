import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { PointerEventType, type PointerUnifiedEventData } from "../../helpers/PointerInput.ts";
import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

// eslint-disable-next-line no-shadow
const enum TouchingType {
    None,
    Lower,
    Upper,
}

export type OpenData = {
    minNumber           : number;
    maxNumber           : number;
    currentLowerNumber  : number;
    currentUpperNumber  : number;
    getHelpText?        : () => string;
    getTitleText        : () => string;
    callback            : (newMinNumber: number, newMaxNumber: number) => void;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnHelp!                  : IUiButton;
    private readonly _btnCancel!                : IUiButton;
    private readonly _btnConfirm!               : IUiButton;

    private readonly _groupBar!                 : IUiContainer;
    private readonly _imgBar!                   : IUiImage;
    private readonly _imgLowerPoint!            : IUiImage;
    private readonly _imgUpperPoint!            : IUiImage;

    private readonly _layoutCount!              : IUiLayout;
    private readonly _labelLowerCount!          : IUiLabel;
    private readonly _labelUpperCount!          : IUiLabel;

    private _selectedLowerNum                   = 0;
    private _selectedUpperNum                   = 0;
    private _touchingType                       = TouchingType.None;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupBar,       callback: this._onTouchedGroupBar },
            { ui: this._groupBar,       callback: this._onTouchBeginGroupBar,           eventType: PointerEventType.Press },
            { ui: this._groupBar,       callback: this._onTouchMoveGroupBar,            eventType: PointerEventType.PressMove },
            { ui: this._groupBar,       callback: this._onTouchEndGroupBar,             eventType: PointerEventType.ReleaseIn },
            { ui: this._groupBar,       callback: this._onTouchReleaseOutsideGroupBar,  eventType: PointerEventType.ReleaseOut },

            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._touchingType      = TouchingType.None;
        this._selectedLowerNum  = openData.currentLowerNumber;
        this._selectedUpperNum  = openData.currentUpperNumber;
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupBar(e: Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const groupBar  = this._groupBar;
        const minNumber = openData.minNumber;
        const barWidth  = groupBar.getScaledWidth();
        const data      = e.data as PointerUnifiedEventData;
        const touchX    = groupBar.globalToLocal(data.stageX, data.stageY).x;
        const num       = Math.round(Math.max(0, Math.min(touchX, barWidth)) / barWidth * (openData.maxNumber - minNumber)) + minNumber;
        if (Math.abs(touchX - this._imgLowerPoint.getX()) <= Math.abs(touchX - this._imgUpperPoint.getX()) ) {
            this._selectedLowerNum  = num;
            this._selectedUpperNum  = Math.max(this._selectedUpperNum, num);
        } else {
            this._selectedUpperNum  = num;
            this._selectedLowerNum  = Math.min(this._selectedLowerNum, num);
        }

        this._touchingType = TouchingType.None;
        this._updateGroupBar();
    }
    private _onTouchBeginGroupBar(e: Event): void {
        const data          = e.data as PointerUnifiedEventData;
        const touchX        = this._groupBar.globalToLocal(data.stageX, data.stageY).x;
        this._touchingType  = Math.abs(touchX - this._imgLowerPoint.getX()) <= Math.abs(touchX - this._imgUpperPoint.getX())
            ? TouchingType.Lower
            : TouchingType.Upper;
    }
    private _onTouchMoveGroupBar(e: Event): void {
        const touchingType = this._touchingType;
        if (touchingType === TouchingType.None) {
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const groupBar  = this._groupBar;
        const minNumber = openData.minNumber;
        const barWidth  = groupBar.getScaledWidth();
        const data      = e.data as PointerUnifiedEventData;
        const touchX    = groupBar.globalToLocal(data.stageX, data.stageY).x;
        const num       = Math.round(Math.max(0, Math.min(touchX, barWidth)) / barWidth * (openData.maxNumber - minNumber)) + minNumber;
        if (touchingType === TouchingType.Lower) {
            this._selectedLowerNum  = num;
            this._selectedUpperNum  = Math.max(this._selectedUpperNum, num);
        } else {
            this._selectedUpperNum  = num;
            this._selectedLowerNum  = Math.min(this._selectedLowerNum, num);
        }

        this._updateGroupBar();
    }
    private _onTouchEndGroupBar(): void {
        this._touchingType = TouchingType.None;
        this._updateGroupBar();
    }
    private _onTouchReleaseOutsideGroupBar(): void {
        this._touchingType = TouchingType.None;
        this._updateGroupBar();
    }

    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(this._selectedLowerNum, this._selectedUpperNum);
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        if (func) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => func(),
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._btnHelp.setIsVisible(!!this.getOpenData()?.getHelpText);
        this._updateComponentsForLanguage();
        this._updateGroupBar();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? UndefinedError);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
    }

    private _updateGroupBar(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const minNumber     = openData.minNumber;
        const maxNumber     = openData.maxNumber;
        const barWidth      = this._groupBar.getScaledWidth();
        const lowerCount    = this._selectedLowerNum;
        const lowerPos      = barWidth * (lowerCount - minNumber) / (maxNumber - minNumber);
        const upperCount    = this._selectedUpperNum;
        const upperPos      = barWidth * (upperCount - minNumber) / (maxNumber - minNumber);
        const imgBar        = this._imgBar;
        imgBar.setX(lowerPos);
        imgBar.setUnscaledManualWidth(upperPos - lowerPos);
        this._imgLowerPoint.setX(lowerPos);
        this._imgUpperPoint.setX(upperPos);
        this._labelLowerCount.setText(`${lowerCount}`);
        this._labelUpperCount.setText(`${upperCount}`);
        this._layoutCount.arrangeItems();
    }
}
