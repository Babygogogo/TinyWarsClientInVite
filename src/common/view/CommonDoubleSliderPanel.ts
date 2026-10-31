import {
    GamePanels_Dict,
    GamePanels_Manager,
    Helpers_PointerInput,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

 
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
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupBar!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBar!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgLowerPoint!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgUpperPoint!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutCount!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelLowerCount!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUpperCount!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedLowerNum                   = 0;
    private _selectedUpperNum                   = 0;
    private _touchingType                       = TouchingType.None;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._groupBar,       callback : this._onTouchedGroupBar },
            { ui : this._groupBar,       callback : this._onTouchBeginGroupBar,           eventType : Helpers_PointerInput.PointerEventType.Press },
            { ui : this._groupBar,       callback : this._onTouchMoveGroupBar,            eventType : Helpers_PointerInput.PointerEventType.PressMove },
            { ui : this._groupBar,       callback : this._onTouchEndGroupBar,             eventType : Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui : this._groupBar,       callback : this._onTouchReleaseOutsideGroupBar,  eventType : Helpers_PointerInput.PointerEventType.ReleaseOut },

            { ui : this._btnCancel,      callback : this._onTouchedBtnCancel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
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

    private _onTouchedGroupBar(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const groupBar  = this._groupBar;
        const minNumber = openData.minNumber;
        const barWidth  = groupBar.getScaledWidth();
        const data      = e.data as Helpers_PointerInput.PointerUnifiedEventData;
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
    private _onTouchBeginGroupBar(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const data          = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const touchX        = this._groupBar.globalToLocal(data.stageX, data.stageY).x;
        this._touchingType  = Math.abs(touchX - this._imgLowerPoint.getX()) <= Math.abs(touchX - this._imgUpperPoint.getX())
            ? TouchingType.Lower
            : TouchingType.Upper;
    }
    private _onTouchMoveGroupBar(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
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
        const data      = e.data as Helpers_PointerInput.PointerUnifiedEventData;
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
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
