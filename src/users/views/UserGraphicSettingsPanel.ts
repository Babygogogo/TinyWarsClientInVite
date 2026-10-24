import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GameVersionsUtils from "../../gameVersions/Utils.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCompatibility from "../../helpers/Compatibility.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiSwitch from "../../ui/interfaces/IUiSwitch.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;

    private readonly _labelNewTexture!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchNewTexture!       : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelShowGridBorder!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchShowGridBorder!   : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelUnitFlickering!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchUnitFlickering!   : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelUnitMoveFaster!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchUnitMoveFaster!   : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelUnitAnimation!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchUnitAnimation!    : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelTileAnimation!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchTileAnimation!    : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelWeatherAnimation!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchWeatherAnimation! : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _labelScreenVibration!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchScreenVibration!  : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _groupButtons!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSetOpacity!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetOrientation!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetStageScaler!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAndTileTextureVersionChanged,                    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsShowGridBorderChanged,                 callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsUnitFlickeringOnFullEnergyChanged,     callback: this._onNotifyUserSettingsIsUnitFlickeringOnFullEnergyChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsUnitMoveAniSpeedMultiplierPctChanged,    callback: this._onNotifyUserSettingsUnitMoveAniSpeedMultiplierPctChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsScreenVibrationEnabledChanged,         callback: this._onNotifyUserSettingIsScreenVibrationEnabled },
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
            if (GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId === GraphicsConstants.TextureResolutionId.Trilogy) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                UsersProxy.reqUserSetSettings({
                    unitAndTileTextureVersion   : UsersModel.getSelfSettingsTextureVersion() === GraphicsConstants.TextureVersionId.V1 ? GraphicsConstants.TextureVersionId.V0 : GraphicsConstants.TextureVersionId.V1,
                    coBgmSettings               : [],
                });
            }
        });
        this._uiSwitchUnitAnimation.setCallbackOnTouch(() => {
            if (LocalDataStorage2.getShowUnitAnimation()) {
                LocalDataStorage2.setShowUnitAnimation(false);
                CommonModelCommonModel.stopUnitAnimationTick();
            } else {
                LocalDataStorage2.setShowUnitAnimation(true);
                CommonModelCommonModel.startUnitAnimationTick();
            }
            this._updateUiSwitchUnitAnimation(true);
        });
        this._uiSwitchTileAnimation.setCallbackOnTouch(() => {
            if (LocalDataStorage2.getShowTileAnimation()) {
                LocalDataStorage2.setShowTileAnimation(false);
                CommonModelCommonModel.stopTileAnimationTick();
            } else {
                LocalDataStorage2.setShowTileAnimation(true);
                CommonModelCommonModel.startTileAnimationTick();
            }
            this._updateUiSwitchTileAnimation(true);
        });
        this._uiSwitchWeatherAnimation.setCallbackOnTouch(() => {
            LocalDataStorage2.setShowWeatherAnimation(!LocalDataStorage2.getShowWeatherAnimation());
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsShowWeatherAnimationChanged);
            this._updateUiSwitchWeatherAnimation(true);
        });
        this._uiSwitchShowGridBorder.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isShowGridBorder: !UsersModel.getSelfSettingsIsShowGridBorder(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchUnitFlickering.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isUnitFlickeringOnFullEnergy: !UsersModel.getSelfSettingsIsUnitFlickeringOnFullEnergy(),
                coBgmSettings               : [],
            });
        });
        this._uiSwitchUnitMoveFaster.setCallbackOnTouch(() => {
            const pct = UsersModel.getSelfSettingsUnitMoveAniSpeedMultiplierPct();
            UsersProxy.reqUserSetSettings({
                unitMoveAniSpeedMultiplierPct   : pct === 100 ? 300 : 100,
                coBgmSettings                   : [],
            });
        });
        this._uiSwitchScreenVibration.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isScreenVibrationEnabled: !UsersModel.getSelfSettingsIsScreenVibrationEnabled(),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetOpacityPanel, void 0);
    }
    private _onTouchedBtnSetOrientation(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getText(HelpersCompatibility.isPc ? LangConstants.TextType.A0416 : LangConstants.TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0840);
                return;
            }

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0159),
                currentNumber           : currentRotation,
                availableNumberArray    : [0, 1, 2, 3],
                getNumberMainText       : num => {
                    switch (num) {
                        case 0  : return LangUtils.getText(LangConstants.TextType.B0377);
                        case 1  : return LangUtils.getText(LangConstants.TextType.B0419);
                        case 2  : return LangUtils.getText(LangConstants.TextType.B0591);
                        case 3  : return LangUtils.getText(LangConstants.TextType.B0597);
                        default : return LangConstants.UndefinedError;
                    }
                },
                callbackOnConfirm       : num => {
                    try {
                        LocalDataStorage2.setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        FloatText2.showLang(LangConstants.TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnSetStageScaler(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetStageScalePanel, void 0);
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
        this._labelTitle.setLangText(LangConstants.TextType.B0984);
        this._labelNewTexture.setLangText(LangConstants.TextType.B1280);
        this._labelShowGridBorder.setLangText(LangConstants.TextType.B0584);
        this._labelUnitFlickering.setLangText(LangConstants.TextType.B1165);
        this._labelUnitMoveFaster.setLangText(LangConstants.TextType.B1368);
        this._labelUnitAnimation.setLangText(LangConstants.TextType.B0629);
        this._labelTileAnimation.setLangText(LangConstants.TextType.B0630);
        this._labelWeatherAnimation.setLangText(LangConstants.TextType.B0985);
        this._labelScreenVibration.setLangText(LangConstants.TextType.B1397);
        this._btnSetOpacity.setLangText(LangConstants.TextType.B0827);
        this._btnSetOrientation.setLangText(LangConstants.TextType.B0159);
        this._btnSetStageScaler.setLangText(LangConstants.TextType.B0558);
    }
    private _updateUiSwitchNewTexture(isTween: boolean): void {
        this._uiSwitchNewTexture.setIsSwitchOn(UsersModel.getSelfSettingsTextureVersion() === GraphicsConstants.TextureVersionId.V1, isTween);
    }
    private _updateUiSwitchShowGridBorder(isTween: boolean): void {
        this._uiSwitchShowGridBorder.setIsSwitchOn(UsersModel.getSelfSettingsIsShowGridBorder(), isTween);
    }
    private _updateUiSwitchUnitFlickering(isTween: boolean): void {
        this._uiSwitchUnitFlickering.setIsSwitchOn(UsersModel.getSelfSettingsIsUnitFlickeringOnFullEnergy(), isTween);
    }
    private _updateUiSwitchUnitMoveFaster(isTween: boolean): void {
        this._uiSwitchUnitMoveFaster.setIsSwitchOn(UsersModel.getSelfSettingsUnitMoveAniSpeedMultiplierPct() !== 100, isTween);
    }
    private _updateUiSwitchUnitAnimation(isTween: boolean): void {
        this._uiSwitchUnitAnimation.setIsSwitchOn(LocalDataStorage2.getShowUnitAnimation(), isTween);
    }
    private _updateUiSwitchTileAnimation(isTween: boolean): void {
        this._uiSwitchTileAnimation.setIsSwitchOn(LocalDataStorage2.getShowTileAnimation(), isTween);
    }
    private _updateUiSwitchWeatherAnimation(isTween: boolean): void {
        this._uiSwitchWeatherAnimation.setIsSwitchOn(LocalDataStorage2.getShowWeatherAnimation(), isTween);
    }
    private _updateUiSwitchScreenVibration(isTween: boolean): void {
        this._uiSwitchScreenVibration.setIsSwitchOn(UsersModel.getSelfSettingsIsScreenVibrationEnabled(), isTween);
    }
}
