import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiRankRoomModelMrrModel from "../model/MrrModel.ts";
import * as MultiRankRoomModelMrrProxy from "../model/MrrProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutStd!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnStd!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelStd!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutFog!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnFog!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelFog!         : UiInterfacesIUiLabel.IUiLabel;

    private _selectedDaysForStdLower    = GameConfigGcWar.MultiRankedWar.BootTimer.DefaultDays;
    private _selectedDaysForStdUpper    = GameConfigGcWar.MultiRankedWar.BootTimer.DefaultDays;
    private _selectedDaysForFogLower    = GameConfigGcWar.MultiRankedWar.BootTimer.DefaultDays;
    private _selectedDaysForFogUpper    = GameConfigGcWar.MultiRankedWar.BootTimer.DefaultDays;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMrrGetBootTimerDaysRange,     callback: this._onMsgMrrGetBootTimerDaysRange },
            { type: NotificationsTypeId.TypeId.MsgMrrSetBootTimerDaysRange,     callback: this._onMsgMrrSetBootTimerDaysRange },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },

            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnStd,         callback: this._onTouchedBtnStd },
            { ui: this._btnFog,         callback: this._onTouchedBtnFog },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0548),
            getHelpText         : () => LangUtils.getText(LangConstants.TextType.A0443),
            minNumber           : GameConfigGcWar.MultiRankedWar.BootTimer.MinDays,
            maxNumber           : GameConfigGcWar.MultiRankedWar.BootTimer.MaxDays,
            currentLowerNumber  : this._selectedDaysForStdLower,
            currentUpperNumber  : this._selectedDaysForStdUpper,
            callback            : (minNumber, maxNumber) => {
                this._selectedDaysForStdLower   = minNumber;
                this._selectedDaysForStdUpper   = maxNumber;
                this._updateLabelStd();
            },
        });
    }

    private _onTouchedBtnFog(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0549),
            getHelpText         : () => LangUtils.getText(LangConstants.TextType.A0443),
            minNumber           : GameConfigGcWar.MultiRankedWar.BootTimer.MinDays,
            maxNumber           : GameConfigGcWar.MultiRankedWar.BootTimer.MaxDays,
            currentLowerNumber  : this._selectedDaysForFogLower,
            currentUpperNumber  : this._selectedDaysForFogUpper,
            callback            : (minNumber, maxNumber) => {
                this._selectedDaysForFogLower   = minNumber;
                this._selectedDaysForFogUpper   = maxNumber;
                this._updateLabelFog();
            },
        });
    }

    private _onTouchedBtnConfirm(): void {
        const rangeForStd   = MultiRankRoomModelMrrModel.getBootTimerDaysRange(false);
        const rangeForFog   = MultiRankRoomModelMrrModel.getBootTimerDaysRange(true);
        const stdLowerDays  = this._selectedDaysForStdLower;
        const stdUpperDays  = this._selectedDaysForStdUpper;
        const fogLowerDays  = this._selectedDaysForFogLower;
        const fogUpperDays  = this._selectedDaysForFogUpper;
        if ((stdLowerDays === rangeForStd[0])   &&
            (stdUpperDays === rangeForStd[1])   &&
            (fogLowerDays === rangeForFog[0])   &&
            (fogUpperDays === rangeForFog[1])
        ) {
            FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        } else {
            MultiRankRoomModelMrrProxy.reqMrrSetBootTimerDaysRange(
                [stdLowerDays, stdUpperDays],
                [fogLowerDays, fogUpperDays]
            );
        }
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0443),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        [this._selectedDaysForStdLower, this._selectedDaysForStdUpper]  = MultiRankRoomModelMrrModel.getBootTimerDaysRange(false);
        [this._selectedDaysForFogLower, this._selectedDaysForFogUpper]  = MultiRankRoomModelMrrModel.getBootTimerDaysRange(true);
        this._updateLabelStd();
        this._updateLabelFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0124));

        this._btnStd.setText(LangUtils.getText(LangConstants.TextType.B0548));
        this._btnFog.setText(LangUtils.getText(LangConstants.TextType.B0549));
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
