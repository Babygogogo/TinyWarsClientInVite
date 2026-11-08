import {
    MultiRankedWars_Constants,
    MultiRankRoom_Model_MrrModel,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    MultiRankRoom_Model_MrrProxy,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutStd!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnStd!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelStd!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutFog!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnFog!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelFog!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedDaysForStdLower    = MultiRankedWars_Constants.BootTimer.DefaultDays;
    private _selectedDaysForStdUpper    = MultiRankedWars_Constants.BootTimer.DefaultDays;
    private _selectedDaysForFogLower    = MultiRankedWars_Constants.BootTimer.DefaultDays;
    private _selectedDaysForFogUpper    = MultiRankedWars_Constants.BootTimer.DefaultDays;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "MsgMrrGetBootTimerDaysRange",     callback : this._onMsgMrrGetBootTimerDaysRange },
            { type : "MsgMrrSetBootTimerDaysRange",     callback : this._onMsgMrrSetBootTimerDaysRange },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },

            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
            { ui : this._btnStd,         callback : this._onTouchedBtnStd },
            { ui : this._btnFog,         callback : this._onTouchedBtnFog },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._loadMaxCountAndUpdateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMrrGetBootTimerDaysRange(): void {
        this._loadMaxCountAndUpdateView();
    }
    private _onMsgMrrSetBootTimerDaysRange(): void {
        this._loadMaxCountAndUpdateView();
    }

    private _onTouchedBtnStd(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0548),
            getHelpText        : () => Lang_Utils.getText(Lang_Constants.TextType.A0443),
            minNumber          : MultiRankedWars_Constants.BootTimer.MinDays,
            maxNumber          : MultiRankedWars_Constants.BootTimer.MaxDays,
            currentLowerNumber : this._selectedDaysForStdLower,
            currentUpperNumber : this._selectedDaysForStdUpper,
            callback           : (minNumber, maxNumber) => {
                this._selectedDaysForStdLower   = minNumber;
                this._selectedDaysForStdUpper   = maxNumber;
                this._updateLabelStd();
            },
        });
    }

    private _onTouchedBtnFog(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0549),
            getHelpText        : () => Lang_Utils.getText(Lang_Constants.TextType.A0443),
            minNumber          : MultiRankedWars_Constants.BootTimer.MinDays,
            maxNumber          : MultiRankedWars_Constants.BootTimer.MaxDays,
            currentLowerNumber : this._selectedDaysForFogLower,
            currentUpperNumber : this._selectedDaysForFogUpper,
            callback           : (minNumber, maxNumber) => {
                this._selectedDaysForFogLower   = minNumber;
                this._selectedDaysForFogUpper   = maxNumber;
                this._updateLabelFog();
            },
        });
    }

    private _onTouchedBtnConfirm(): void {
        const rangeForStd   = MultiRankRoom_Model_MrrModel.getBootTimerDaysRange(false);
        const rangeForFog   = MultiRankRoom_Model_MrrModel.getBootTimerDaysRange(true);
        const stdLowerDays  = this._selectedDaysForStdLower;
        const stdUpperDays  = this._selectedDaysForStdUpper;
        const fogLowerDays  = this._selectedDaysForFogLower;
        const fogUpperDays  = this._selectedDaysForFogUpper;
        if ((stdLowerDays === rangeForStd[0])   &&
            (stdUpperDays === rangeForStd[1])   &&
            (fogLowerDays === rangeForFog[0])   &&
            (fogUpperDays === rangeForFog[1])
        ) {
            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        } else {
            MultiRankRoom_Model_MrrProxy.reqMrrSetBootTimerDaysRange(
                [stdLowerDays, stdUpperDays],
                [fogLowerDays, fogUpperDays],
            );
        }
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0443),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        [this._selectedDaysForStdLower, this._selectedDaysForStdUpper]  = MultiRankRoom_Model_MrrModel.getBootTimerDaysRange(false);
        [this._selectedDaysForFogLower, this._selectedDaysForFogUpper]  = MultiRankRoom_Model_MrrModel.getBootTimerDaysRange(true);
        this._updateLabelStd();
        this._updateLabelFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0124);

        this._btnStd.setLangText(Lang_Constants.TextType.B0548);
        this._btnFog.setLangText(Lang_Constants.TextType.B0549);
    }

    private _updateLabelStd(): void {
        this._labelStd.setText(`${this._selectedDaysForStdLower} ~ ${this._selectedDaysForStdUpper}`);
        this._layoutStd.arrangeItems();
    }

    private _updateLabelFog(): void {
        this._labelFog.setText(`${this._selectedDaysForFogLower} ~ ${this._selectedDaysForFogUpper}`);
        this._layoutFog.arrangeItems();
    }
}
