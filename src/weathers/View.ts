import * as HelpersMisc from "../helpers/Misc.ts";
import * as LocalDataStorage from "../localData/Storage.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";
import * as TweenEase from "../tween/Ease.ts";
import * as TweenExecutor from "../tween/Executor.ts";
import * as UiComponentsUiContainer from "../ui/components/UiContainer.ts";
import type * as UiInterfacesIUiComponent from "../ui/interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiImage from "../ui/interfaces/IUiImage.ts";
import * as UiTypesUiHorizontalAlign from "../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as WeathersConstants from "./Constants.ts";
import type * as WeathersIManager from "./IManager.ts";
import type * as WeathersIView from "./IView.ts";

const RAIN_DENSITY      = 0.15;
const RAIN_ANGLE        = 20;
const RAIN_ALPHA        = 0.5;
const SNOW_DENSITY      = 0.15;
const SNOW_ANGLE        = 10;
const SNOW_ALPHA        = 0.6;
const SANDSTORM_DENSITY = 0.15;
const SANDSTORM_ANGLE   = 70;
const SANDSTORM_ALPHA   = 0.9;

export class View extends UiComponentsUiContainer.UiContainer implements WeathersIView.IView {
    private readonly _notifyListeners   : NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.UserSettingsIsShowWeatherAnimationChanged,    callback: this._onNotifyUserSettingsIsShowWeatherAnimationChanged },
    ];

    private _weatherManager?                : WeathersIManager.IManager;
    private readonly _containerForRain      = new (UiUtilsUiFactory.getUiContainerClass())();
    private _imgArrayForRain                : UiInterfacesIUiImage.IUiImage[] = [];
    private readonly _containerForSnow      = new (UiUtilsUiFactory.getUiContainerClass())();
    private _imgArrayForSnow                : UiInterfacesIUiImage.IUiImage[] = [];
    private readonly _containerForSandstorm = new (UiUtilsUiFactory.getUiContainerClass())();
    private _imgArrayForSandstorm           : UiInterfacesIUiImage.IUiImage[] = [];
    private _showingWeatherType             : number | null = null;

    public constructor() {
        super();

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });
        this.setIsTouchChildrenEnabled(false);

        {
            const containerForRain = this._containerForRain;
            containerForRain.setRotationInDegree(RAIN_ANGLE);
            containerForRain.setAlpha(RAIN_ALPHA);
            containerForRain.setIsTouchChildrenEnabled(false);
            containerForRain.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align   : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForRain);
        }

        {
            const containerForSnow = this._containerForSnow;
            containerForSnow.setRotationInDegree(SNOW_ANGLE);
            containerForSnow.setAlpha(SNOW_ALPHA);
            containerForSnow.setIsTouchChildrenEnabled(false);
            containerForSnow.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align   : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForSnow);
        }

        {
            const containerForSandstorm = this._containerForSandstorm;
            containerForSandstorm.setRotationInDegree(SANDSTORM_ANGLE);
            containerForSandstorm.setAlpha(SANDSTORM_ALPHA);
            containerForSandstorm.setIsTouchChildrenEnabled(false);
            containerForSandstorm.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align   : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForSandstorm);
        }
    }

    public applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        if (!super.applySizeFromSizerInfo(width, height)) {
            return false;
        }

        this.resetView(true);

        return true;
    }

    public init(manager: WeathersIManager.IManager): void {
        this._setWeatherManager(manager);
    }

    public startRunningView(): void {
        NotificationsDispatcher.addEventListeners(this._notifyListeners, this);
        this.resetView(true);
    }
    public stopRunningView(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);
        this._stopView();
    }

    private _getWeatherManager(): WeathersIManager.IManager {
        return HelpersMisc.getExisted(this._weatherManager, UtilsClientErrorCode.ClientErrorCode.BwWeatherManagerView_GetWeatherManager_00);
    }
    private _setWeatherManager(manager: WeathersIManager.IManager): void {
        this._weatherManager = manager;
    }

    private _onNotifyUserSettingsIsShowWeatherAnimationChanged(): void {
        this.resetView(false);
    }

    public resetView(isForce: boolean): void {
        if (!LocalDataStorage.getShowWeatherAnimation()) {
            this._showingWeatherType = null;
            this._stopView();
            return;
        }

        const weatherManager    = this._getWeatherManager();
        const weatherType       = weatherManager.getCurrentWeatherType();
        if ((!isForce) && (weatherType === this._showingWeatherType)) {
            return;
        }

        this._showingWeatherType = weatherType;

        this._stopView();
        switch (weatherManager.getWar().getGcData().getWeatherCfg(weatherType)?.getAnim()) {
            case WeathersConstants.AnimationType.Rainy      : this._showRain();         break;
            case WeathersConstants.AnimationType.Sandstorm  : this._showSandstorm();    break;
            case WeathersConstants.AnimationType.Snowy      : this._showSnow();         break;
            default                                 :                           break;
        }
    }
    private _stopView(): void {
        this._stopRain();
        this._stopSandstorm();
        this._stopSnow();
    }

    private _showRain(): void {
        this._stopRain();

        const imagesCount   = Math.max(1, Math.floor(this.getUnscaledWidth() * RAIN_DENSITY));
        const imgArray      = this._imgArrayForRain;
        if (imgArray.length > imagesCount) {
            imgArray.length = imagesCount;
        } else {
            for (let i = imgArray.length; i < imagesCount; ++i) {
                const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
                img.setUnscaledManualWidth(1);
                imgArray.push(img);
            }
        }

        const container = this._containerForRain;
        this._resetContainerSize(container);

        for (const img of imgArray) {
            this._resetTweenForImgRain(img);
            container.addUiChild(img);
        }
    }
    private _stopRain(): void {
        for (const img of this._imgArrayForRain) {
            TweenExecutor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
        }
    }
    private _resetTweenForImgRain(img: UiInterfacesIUiImage.IUiImage): void {
        const container         = this._containerForRain;
        const containerHeight   = container.getUnscaledHeight();
        const imgHeight         = Math.floor(Math.random() * 20 + 10);
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setUnscaledManualHeight(imgHeight);

        TweenExecutor.Executor.removeTweens(img);
        TweenExecutor.Executor.get(img)
            .set({
                customX : Math.random() * container.getUnscaledWidth(),
                customY : startingY
            })
            .to(
                { customY: endingY },
                (endingY - startingY) * 1.2 * (Math.random() * 0.2 + 0.9)
            )
            .call(() => this._resetTweenForImgRain(img));
    }

    private _showSandstorm(): void {
        this._stopSandstorm();

        const imagesCount   = Math.max(1, Math.floor(this.getUnscaledWidth() * SANDSTORM_DENSITY));
        const imgArray      = this._imgArrayForSandstorm;
        if (imgArray.length > imagesCount) {
            imgArray.length = imagesCount;
        } else {
            for (let i = imgArray.length; i < imagesCount; ++i) {
                const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorYellow0001` });
                imgArray.push(img);
            }
        }

        const container = this._containerForSandstorm;
        this._resetContainerSize(container);

        for (const img of imgArray) {
            this._resetTweenForImgSandstorm(img);
            container.addUiChild(img);
        }
    }
    private _stopSandstorm(): void {
        for (const img of this._imgArrayForSandstorm) {
            TweenExecutor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
        }
    }
    private _resetTweenForImgSandstorm(img: UiInterfacesIUiImage.IUiImage): void {
        const container         = this._containerForSandstorm;
        const containerHeight   = container.getUnscaledHeight();
        const scale             = 1.2;
        const imgHeight         = 1;
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setScaleX(scale);
        img.setScaleY(scale);

        TweenExecutor.Executor.removeTweens(img);
        TweenExecutor.Executor.get(img)
            .set({
                customX : Math.random() * container.getUnscaledWidth(),
                customY : startingY
            })
            .to(
                { customY: endingY },
                (endingY - startingY) * 0.6 * (Math.random() * 0.2 + 0.9)
            )
            .call(() => this._resetTweenForImgSandstorm(img));
    }

    private _showSnow(): void {
        this._stopSnow();

        const imagesCount   = Math.max(1, Math.floor(this.getUnscaledWidth() * SNOW_DENSITY));
        const imgArray      = this._imgArrayForSnow;
        if (imgArray.length > imagesCount) {
            imgArray.length = imagesCount;
        } else {
            for (let i = imgArray.length; i < imagesCount; ++i) {
                const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `commonIcon0022` });
                imgArray.push(img);
            }
        }

        const container = this._containerForSnow;
        this._resetContainerSize(container);

        for (const img of imgArray) {
            this._resetTweenForImgSnow(img);
            container.addUiChild(img);
        }
    }
    private _stopSnow(): void {
        for (const img of this._imgArrayForSnow) {
            TweenExecutor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
        }
    }
    private _resetTweenForImgSnow(img: UiInterfacesIUiImage.IUiImage): void {
        const container         = this._containerForSnow;
        const containerHeight   = container.getUnscaledHeight();
        const scale             = Math.random() * 0.3 + 0.2;
        const imgWidth          = 20;
        const startingX         = (Math.random() * container.getUnscaledWidth() + imgWidth * 2) - imgWidth;
        const startingY         = -Math.random() * containerHeight - imgWidth;
        const endingY           = containerHeight;
        img.setScaleX(scale);
        img.setScaleY(scale);
        img.setRotationInDegree(Math.random() * 360);

        TweenExecutor.Executor.removeTweens(img);
        TweenExecutor.Executor.get(img)
            .set({ customY: startingY })
            .to(
                { customY: endingY },
                (endingY - startingY) * 8 * (Math.random() * 0.2 + 0.9)
            )
            .call(() => this._resetTweenForImgSnow(img));
        TweenExecutor.Executor.get(img, { loop: true })
            .set({ customX: startingX - 20})
            .to({ customX: startingX + 20 }, 2000, TweenEase.sineInOut)
            .to({ customX: startingX - 20 }, 2000, TweenEase.sineInOut);
    }

    private _resetContainerSize(container: UiInterfacesIUiComponent.IUiComponent): void {
        const width             = this.getUnscaledWidth();
        const height            = this.getUnscaledHeight();
        const containerWidth    = Math.sqrt(width * width + height * height);
        const containerHeight   = containerWidth;
        container.setUnscaledManualWidth(containerWidth);
        container.setUnscaledManualHeight(containerHeight);
    }
}
