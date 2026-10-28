import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { BootTimer } from "../../multiRankedWars/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getBootTimerDaysRange } from "../model/MmrModel.ts";
import { reqMmrSetBootTimerDaysRange } from "../model/MmrProxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnConfirm!       : IUiButton;

    private readonly _layoutStd!        : IUiLayout;
    private readonly _btnStd!           : IUiButton;
    private readonly _labelStd!         : IUiLabel;

    private readonly _layoutFog!        : IUiLayout;
    private readonly _btnFog!           : IUiButton;
    private readonly _labelFog!         : IUiLabel;

    private _selectedDaysForStdLower    = BootTimer.DefaultDays;
    private _selectedDaysForStdUpper    = BootTimer.DefaultDays;
    private _selectedDaysForFogLower    = BootTimer.DefaultDays;
    private _selectedDaysForFogUpper    = BootTimer.DefaultDays;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgMmrGetBootTimerDaysRange,     callback : this._onMsgMmrGetBootTimerDaysRange },
            { type : TypeId.MsgMmrSetBootTimerDaysRange,     callback : this._onMsgMmrSetBootTimerDaysRange },
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
    private _onMsgMmrGetBootTimerDaysRange(): void {
        this._loadMaxCountAndUpdateView();
    }
    private _onMsgMmrSetBootTimerDaysRange(): void {
        this._loadMaxCountAndUpdateView();
    }

    private _onTouchedBtnStd(): void {
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => getText(TextType.B0548),
            getHelpText        : () => getText(TextType.A0443),
            minNumber          : BootTimer.MinDays,
            maxNumber          : BootTimer.MaxDays,
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
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => getText(TextType.B0549),
            getHelpText        : () => getText(TextType.A0443),
            minNumber          : BootTimer.MinDays,
            maxNumber          : BootTimer.MaxDays,
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
        const rangeForStd   = getBootTimerDaysRange(false);
        const rangeForFog   = getBootTimerDaysRange(true);
        const stdLowerDays  = this._selectedDaysForStdLower;
        const stdUpperDays  = this._selectedDaysForStdUpper;
        const fogLowerDays  = this._selectedDaysForFogLower;
        const fogUpperDays  = this._selectedDaysForFogUpper;
        if ((stdLowerDays === rangeForStd[0])   &&
            (stdUpperDays === rangeForStd[1])   &&
            (fogLowerDays === rangeForFog[0])   &&
            (fogUpperDays === rangeForFog[1])
        ) {
            showLang(TextType.OperationSucceeded);
        } else {
            reqMmrSetBootTimerDaysRange(
                [stdLowerDays, stdUpperDays],
                [fogLowerDays, fogUpperDays]
            );
        }
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0443),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        [this._selectedDaysForStdLower, this._selectedDaysForStdUpper]  = getBootTimerDaysRange(false);
        [this._selectedDaysForFogLower, this._selectedDaysForFogUpper]  = getBootTimerDaysRange(true);
        this._updateLabelStd();
        this._updateLabelFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(TextType.B0026);
        this._labelTitle.setLangText(TextType.B0124);

        this._btnStd.setLangText(TextType.B0548);
        this._btnFog.setLangText(TextType.B0549);
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
