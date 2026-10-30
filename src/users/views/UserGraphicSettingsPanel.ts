import {
    Notifications_Dispatcher,
    GameVersions_Utils,
    GamePanels_Dict,
    Users_Model,
    LocalData_Storage,
    Lang_Utils,
    Helpers_Compatibility,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    Common_Model_CommonModel,
    Lang_Constants,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiSwitch,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _labelNewTexture!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchNewTexture!       : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelShowGridBorder!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchShowGridBorder!   : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelUnitFlickering!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchUnitFlickering!   : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelUnitMoveFaster!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchUnitMoveFaster!   : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelUnitAnimation!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchUnitAnimation!    : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelTileAnimation!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchTileAnimation!    : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelWeatherAnimation!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchWeatherAnimation! : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _labelScreenVibration!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchScreenVibration!  : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _groupButtons!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSetOpacity!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetOrientation!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetStageScaler!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.UnitAndTileTextureVersionChanged,                    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: Notifications_TypeId.TypeId.UserSettingsIsShowGridBorderChanged,                 callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
            { type: Notifications_TypeId.TypeId.UserSettingsIsUnitFlickeringOnFullEnergyChanged,     callback: this._onNotifyUserSettingsIsUnitFlickeringOnFullEnergyChanged },
            { type: Notifications_TypeId.TypeId.UserSettingsUnitMoveAniSpeedMultiplierPctChanged,    callback: this._onNotifyUserSettingsUnitMoveAniSpeedMultiplierPctChanged },
            { type: Notifications_TypeId.TypeId.UserSettingsIsScreenVibrationEnabledChanged,         callback: this._onNotifyUserSettingIsScreenVibrationEnabled },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnSetOpacity,          callback: this._onTouchedBtnSetOpacity },
            { ui: this._btnSetOrientation,      callback: this._onTouchedBtnSetOrientation },
            { ui: this._btnSetStageScaler,      callback: this._onTouchedBtnSetStageScaler },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._uiSwitchNewTexture.setCallbackOnTouch(() => {
            if (GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId === Graphics_Constants.TextureResolutionId.Trilogy) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                Users_Proxy.reqUserSetSettings({
                    unitAndTileTextureVersion   : Users_Model.getSelfSettingsTextureVersion() === Graphics_Constants.TextureVersionId.V1 ? Graphics_Constants.TextureVersionId.V0 : Graphics_Constants.TextureVersionId.V1,
                    coBgmSettings               : [],
                });
            }
        });
        this._uiSwitchUnitAnimation.setCallbackOnTouch(() => {
            if (LocalData_Storage.getShowUnitAnimation()) {
                LocalData_Storage.setShowUnitAnimation(false);
                Common_Model_CommonModel.stopUnitAnimationTick();
            } else {
                LocalData_Storage.setShowUnitAnimation(true);
                Common_Model_CommonModel.startUnitAnimationTick();
            }
            this._updateUiSwitchUnitAnimation(true);
        });
        this._uiSwitchTileAnimation.setCallbackOnTouch(() => {
            if (LocalData_Storage.getShowTileAnimation()) {
                LocalData_Storage.setShowTileAnimation(false);
                Common_Model_CommonModel.stopTileAnimationTick();
            } else {
                LocalData_Storage.setShowTileAnimation(true);
                Common_Model_CommonModel.startTileAnimationTick();
            }
            this._updateUiSwitchTileAnimation(true);
        });
        this._uiSwitchWeatherAnimation.setCallbackOnTouch(() => {
            LocalData_Storage.setShowWeatherAnimation(!LocalData_Storage.getShowWeatherAnimation());
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.UserSettingsIsShowWeatherAnimationChanged);
            this._updateUiSwitchWeatherAnimation(true);
        });
        this._uiSwitchShowGridBorder.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isShowGridBorder: !Users_Model.getSelfSettingsIsShowGridBorder(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchUnitFlickering.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isUnitFlickeringOnFullEnergy: !Users_Model.getSelfSettingsIsUnitFlickeringOnFullEnergy(),
                coBgmSettings               : [],
            });
        });
        this._uiSwitchUnitMoveFaster.setCallbackOnTouch(() => {
            const pct = Users_Model.getSelfSettingsUnitMoveAniSpeedMultiplierPct();
            Users_Proxy.reqUserSetSettings({
                unitMoveAniSpeedMultiplierPct   : pct === 100 ? 300 : 100,
                coBgmSettings                   : [],
            });
        });
        this._uiSwitchScreenVibration.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isScreenVibrationEnabled: !Users_Model.getSelfSettingsIsScreenVibrationEnabled(),
                coBgmSettings           : [],
            });
        });

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateUiSwitchNewTexture(true);
    }
    private _onNotifyUserSettingsIsShowGridBorderChanged(): void {
        this._updateUiSwitchShowGridBorder(true);
    }
    private _onNotifyUserSettingsIsUnitFlickeringOnFullEnergyChanged(): void {
        this._updateUiSwitchUnitFlickering(true);
    }
    private _onNotifyUserSettingsUnitMoveAniSpeedMultiplierPctChanged(): void {
        this._updateUiSwitchUnitMoveFaster(true);
    }
    private _onNotifyUserSettingIsScreenVibrationEnabled(): void {
        this._updateUiSwitchScreenVibration(true);
    }
    private _onTouchedBtnSetOpacity(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetOpacityPanel, void 0);
    }
    private _onTouchedBtnSetOrientation(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Helpers_Compatibility.isPc ? Lang_Constants.TextType.A0416 : Lang_Constants.TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0840);
                return;
            }

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0159),
                currentNumber           : currentRotation,
                availableNumberArray    : [0, 1, 2, 3],
                getNumberMainText       : num => {
                    switch (num) {
                        case 0  : return Lang_Utils.getText(Lang_Constants.TextType.B0377);
                        case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0419);
                        case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B0591);
                        case 3  : return Lang_Utils.getText(Lang_Constants.TextType.B0597);
                        default : return Lang_Constants.UndefinedError;
                    }
                },
                callbackOnConfirm       : num => {
                    try {
                        LocalData_Storage.setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        FloatText.showLang(Lang_Constants.TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnSetStageScaler(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetStageScalePanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateUiSwitchNewTexture(false);
        this._updateUiSwitchShowGridBorder(false);
        this._updateUiSwitchUnitFlickering(false);
        this._updateUiSwitchUnitMoveFaster(false);
        this._updateUiSwitchUnitAnimation(false);
        this._updateUiSwitchTileAnimation(false);
        this._updateUiSwitchWeatherAnimation(false);
        this._updateUiSwitchScreenVibration(false);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0984);
        this._labelNewTexture.setLangText(Lang_Constants.TextType.B1280);
        this._labelShowGridBorder.setLangText(Lang_Constants.TextType.B0584);
        this._labelUnitFlickering.setLangText(Lang_Constants.TextType.B1165);
        this._labelUnitMoveFaster.setLangText(Lang_Constants.TextType.B1368);
        this._labelUnitAnimation.setLangText(Lang_Constants.TextType.B0629);
        this._labelTileAnimation.setLangText(Lang_Constants.TextType.B0630);
        this._labelWeatherAnimation.setLangText(Lang_Constants.TextType.B0985);
        this._labelScreenVibration.setLangText(Lang_Constants.TextType.B1397);
        this._btnSetOpacity.setLangText(Lang_Constants.TextType.B0827);
        this._btnSetOrientation.setLangText(Lang_Constants.TextType.B0159);
        this._btnSetStageScaler.setLangText(Lang_Constants.TextType.B0558);
    }
    private _updateUiSwitchNewTexture(isTween: boolean): void {
        this._uiSwitchNewTexture.setIsSwitchOn(Users_Model.getSelfSettingsTextureVersion() === Graphics_Constants.TextureVersionId.V1, isTween);
    }
    private _updateUiSwitchShowGridBorder(isTween: boolean): void {
        this._uiSwitchShowGridBorder.setIsSwitchOn(Users_Model.getSelfSettingsIsShowGridBorder(), isTween);
    }
    private _updateUiSwitchUnitFlickering(isTween: boolean): void {
        this._uiSwitchUnitFlickering.setIsSwitchOn(Users_Model.getSelfSettingsIsUnitFlickeringOnFullEnergy(), isTween);
    }
    private _updateUiSwitchUnitMoveFaster(isTween: boolean): void {
        this._uiSwitchUnitMoveFaster.setIsSwitchOn(Users_Model.getSelfSettingsUnitMoveAniSpeedMultiplierPct() !== 100, isTween);
    }
    private _updateUiSwitchUnitAnimation(isTween: boolean): void {
        this._uiSwitchUnitAnimation.setIsSwitchOn(LocalData_Storage.getShowUnitAnimation(), isTween);
    }
    private _updateUiSwitchTileAnimation(isTween: boolean): void {
        this._uiSwitchTileAnimation.setIsSwitchOn(LocalData_Storage.getShowTileAnimation(), isTween);
    }
    private _updateUiSwitchWeatherAnimation(isTween: boolean): void {
        this._uiSwitchWeatherAnimation.setIsSwitchOn(LocalData_Storage.getShowWeatherAnimation(), isTween);
    }
    private _updateUiSwitchScreenVibration(isTween: boolean): void {
        this._uiSwitchScreenVibration.setIsSwitchOn(Users_Model.getSelfSettingsIsScreenVibrationEnabled(), isTween);
    }
}
