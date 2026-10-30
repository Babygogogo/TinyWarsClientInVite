import {
    stopUnitAnimationTick,
    startUnitAnimationTick,
    stopTileAnimationTick,
    startTileAnimationTick,
} from "../../common/model/CommonModel.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCurrentGameEssentialConfig } from "../../gameVersions/Utils.ts";
import {
    TextureResolutionId,
    TextureVersionId,
} from "../../graphics/Constants.ts";
import { isPc } from "../../helpers/Compatibility.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    getShowUnitAnimation,
    setShowUnitAnimation,
    getShowTileAnimation,
    setShowTileAnimation,
    setShowWeatherAnimation,
    getShowWeatherAnimation,
    setScreenRotation,
} from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiSwitch } from "../../ui/interfaces/IUiSwitch.ts";
import {
    getSelfSettingsTextureVersion,
    getSelfSettingsIsShowGridBorder,
    getSelfSettingsIsUnitFlickeringOnFullEnergy,
    getSelfSettingsUnitMoveAniSpeedMultiplierPct,
    getSelfSettingsIsScreenVibrationEnabled,
} from "../Model.ts";
import { reqUserSetSettings } from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _group!                    : IUiContainer;

    private readonly _labelNewTexture!          : IUiLabel;
    private readonly _uiSwitchNewTexture!       : IUiSwitch;

    private readonly _labelShowGridBorder!      : IUiLabel;
    private readonly _uiSwitchShowGridBorder!   : IUiSwitch;

    private readonly _labelUnitFlickering!      : IUiLabel;
    private readonly _uiSwitchUnitFlickering!   : IUiSwitch;

    private readonly _labelUnitMoveFaster!      : IUiLabel;
    private readonly _uiSwitchUnitMoveFaster!   : IUiSwitch;

    private readonly _labelUnitAnimation!       : IUiLabel;
    private readonly _uiSwitchUnitAnimation!    : IUiSwitch;

    private readonly _labelTileAnimation!       : IUiLabel;
    private readonly _uiSwitchTileAnimation!    : IUiSwitch;

    private readonly _labelWeatherAnimation!    : IUiLabel;
    private readonly _uiSwitchWeatherAnimation! : IUiSwitch;

    private readonly _labelScreenVibration!     : IUiLabel;
    private readonly _uiSwitchScreenVibration!  : IUiSwitch;

    private readonly _groupButtons!             : IUiContainer;
    private readonly _btnSetOpacity!            : IUiButton;
    private readonly _btnSetOrientation!        : IUiButton;
    private readonly _btnSetStageScaler!        : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAndTileTextureVersionChanged,                    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: TypeId.UserSettingsIsShowGridBorderChanged,                 callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
            { type: TypeId.UserSettingsIsUnitFlickeringOnFullEnergyChanged,     callback: this._onNotifyUserSettingsIsUnitFlickeringOnFullEnergyChanged },
            { type: TypeId.UserSettingsUnitMoveAniSpeedMultiplierPctChanged,    callback: this._onNotifyUserSettingsUnitMoveAniSpeedMultiplierPctChanged },
            { type: TypeId.UserSettingsIsScreenVibrationEnabledChanged,         callback: this._onNotifyUserSettingIsScreenVibrationEnabled },
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
            if (getCurrentGameEssentialConfig().textureResolutionTypeId === TextureResolutionId.Trilogy) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                reqUserSetSettings({
                    unitAndTileTextureVersion   : getSelfSettingsTextureVersion() === TextureVersionId.V1 ? TextureVersionId.V0 : TextureVersionId.V1,
                    coBgmSettings               : [],
                });
            }
        });
        this._uiSwitchUnitAnimation.setCallbackOnTouch(() => {
            if (getShowUnitAnimation()) {
                setShowUnitAnimation(false);
                stopUnitAnimationTick();
            } else {
                setShowUnitAnimation(true);
                startUnitAnimationTick();
            }
            this._updateUiSwitchUnitAnimation(true);
        });
        this._uiSwitchTileAnimation.setCallbackOnTouch(() => {
            if (getShowTileAnimation()) {
                setShowTileAnimation(false);
                stopTileAnimationTick();
            } else {
                setShowTileAnimation(true);
                startTileAnimationTick();
            }
            this._updateUiSwitchTileAnimation(true);
        });
        this._uiSwitchWeatherAnimation.setCallbackOnTouch(() => {
            setShowWeatherAnimation(!getShowWeatherAnimation());
            dispatch(TypeId.UserSettingsIsShowWeatherAnimationChanged);
            this._updateUiSwitchWeatherAnimation(true);
        });
        this._uiSwitchShowGridBorder.setCallbackOnTouch(() => {
            reqUserSetSettings({
                isShowGridBorder: !getSelfSettingsIsShowGridBorder(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchUnitFlickering.setCallbackOnTouch(() => {
            reqUserSetSettings({
                isUnitFlickeringOnFullEnergy: !getSelfSettingsIsUnitFlickeringOnFullEnergy(),
                coBgmSettings               : [],
            });
        });
        this._uiSwitchUnitMoveFaster.setCallbackOnTouch(() => {
            const pct = getSelfSettingsUnitMoveAniSpeedMultiplierPct();
            reqUserSetSettings({
                unitMoveAniSpeedMultiplierPct   : pct === 100 ? 300 : 100,
                coBgmSettings                   : [],
            });
        });
        this._uiSwitchScreenVibration.setCallbackOnTouch(() => {
            reqUserSetSettings({
                isScreenVibrationEnabled: !getSelfSettingsIsScreenVibrationEnabled(),
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
        openPanel(getDict().UserSetOpacityPanel, void 0);
    }
    private _onTouchedBtnSetOrientation(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getText(isPc ? TextType.A0416 : TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                showLang(TextType.A0840);
                return;
            }

            openPanel(getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => getText(TextType.B0159),
                currentNumber           : currentRotation,
                availableNumberArray    : [0, 1, 2, 3],
                getNumberMainText       : num => {
                    switch (num) {
                        case 0  : return getText(TextType.B0377);
                        case 1  : return getText(TextType.B0419);
                        case 2  : return getText(TextType.B0591);
                        case 3  : return getText(TextType.B0597);
                        default : return UndefinedError;
                    }
                },
                callbackOnConfirm       : num => {
                    try {
                        setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        showLang(TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnSetStageScaler(): void {
        openPanel(getDict().UserSetStageScalePanel, void 0);
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
        this._labelTitle.setLangText(TextType.B0984);
        this._labelNewTexture.setLangText(TextType.B1280);
        this._labelShowGridBorder.setLangText(TextType.B0584);
        this._labelUnitFlickering.setLangText(TextType.B1165);
        this._labelUnitMoveFaster.setLangText(TextType.B1368);
        this._labelUnitAnimation.setLangText(TextType.B0629);
        this._labelTileAnimation.setLangText(TextType.B0630);
        this._labelWeatherAnimation.setLangText(TextType.B0985);
        this._labelScreenVibration.setLangText(TextType.B1397);
        this._btnSetOpacity.setLangText(TextType.B0827);
        this._btnSetOrientation.setLangText(TextType.B0159);
        this._btnSetStageScaler.setLangText(TextType.B0558);
    }
    private _updateUiSwitchNewTexture(isTween: boolean): void {
        this._uiSwitchNewTexture.setIsSwitchOn(getSelfSettingsTextureVersion() === TextureVersionId.V1, isTween);
    }
    private _updateUiSwitchShowGridBorder(isTween: boolean): void {
        this._uiSwitchShowGridBorder.setIsSwitchOn(getSelfSettingsIsShowGridBorder(), isTween);
    }
    private _updateUiSwitchUnitFlickering(isTween: boolean): void {
        this._uiSwitchUnitFlickering.setIsSwitchOn(getSelfSettingsIsUnitFlickeringOnFullEnergy(), isTween);
    }
    private _updateUiSwitchUnitMoveFaster(isTween: boolean): void {
        this._uiSwitchUnitMoveFaster.setIsSwitchOn(getSelfSettingsUnitMoveAniSpeedMultiplierPct() !== 100, isTween);
    }
    private _updateUiSwitchUnitAnimation(isTween: boolean): void {
        this._uiSwitchUnitAnimation.setIsSwitchOn(getShowUnitAnimation(), isTween);
    }
    private _updateUiSwitchTileAnimation(isTween: boolean): void {
        this._uiSwitchTileAnimation.setIsSwitchOn(getShowTileAnimation(), isTween);
    }
    private _updateUiSwitchWeatherAnimation(isTween: boolean): void {
        this._uiSwitchWeatherAnimation.setIsSwitchOn(getShowWeatherAnimation(), isTween);
    }
    private _updateUiSwitchScreenVibration(isTween: boolean): void {
        this._uiSwitchScreenVibration.setIsSwitchOn(getSelfSettingsIsScreenVibrationEnabled(), isTween);
    }
}
