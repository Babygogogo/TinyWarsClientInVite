import {
    Notifications_Dispatcher,
    Tween_Executor,
    Helpers_Misc,
    LocalData_Storage,
    Tween_Ease,
    Ui_Components_UiContainer,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiImage,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiImage,
    type Notifications_Types,
    Weathers_Constants,
    Utils_ClientErrorCode,
    type Egret_Egret,
    type Weathers_IManager,
    type Weathers_IView,
} from "../internal.ts";

const RAIN_DENSITY      = 0.15;
const RAIN_ANGLE        = 20;
const RAIN_ALPHA        = 0.5;
const SNOW_DENSITY      = 0.15;
const SNOW_ANGLE        = 10;
const SNOW_ALPHA        = 0.6;
const SANDSTORM_DENSITY = 0.15;
const SANDSTORM_ANGLE   = 70;
const SANDSTORM_ALPHA   = 0.9;

export class View extends Ui_Components_UiContainer.UiContainer implements Weathers_IView.IView {
    private readonly _notifyListeners   : Notifications_Types.Listener[] = [
        { type : "UserSettingsIsShowWeatherAnimationChanged",    callback : this._onNotifyUserSettingsIsShowWeatherAnimationChanged },
    ];

    private _weatherManager?                : Weathers_IManager.IManager;
    private readonly _containerForRain      = new Ui_Components_UiContainer.UiContainer();
    private readonly _imgArrayForRain                : Ui_Interfaces_IUiImage.IUiImage[] = [];
    private readonly _containerForSnow      = new Ui_Components_UiContainer.UiContainer();
    private readonly _imgArrayForSnow                : Ui_Interfaces_IUiImage.IUiImage[] = [];
    private readonly _containerForSandstorm = new Ui_Components_UiContainer.UiContainer();
    private readonly _imgArrayForSandstorm           : Ui_Interfaces_IUiImage.IUiImage[] = [];
    private _showingWeatherType             : number | null = null;

    public constructor() {
        super();

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });
        this.setIsTouchChildrenEnabled(false);

        {
            const containerForRain = this._containerForRain;
            containerForRain.setRotationInDegree(RAIN_ANGLE);
            containerForRain.setAlpha(RAIN_ALPHA);
            containerForRain.setIsTouchChildrenEnabled(false);
            containerForRain.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForRain);
        }

        {
            const containerForSnow = this._containerForSnow;
            containerForSnow.setRotationInDegree(SNOW_ANGLE);
            containerForSnow.setAlpha(SNOW_ALPHA);
            containerForSnow.setIsTouchChildrenEnabled(false);
            containerForSnow.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForSnow);
        }

        {
            const containerForSandstorm = this._containerForSandstorm;
            containerForSandstorm.setRotationInDegree(SANDSTORM_ANGLE);
            containerForSandstorm.setAlpha(SANDSTORM_ALPHA);
            containerForSandstorm.setIsTouchChildrenEnabled(false);
            containerForSandstorm.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
                verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
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

    public init(manager: Weathers_IManager.IManager): void {
        this._setWeatherManager(manager);
    }

    public startRunningView(): void {
        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
        this.resetView(true);
    }
    public stopRunningView(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
        this._stopView();
    }

    private _getWeatherManager(): Weathers_IManager.IManager {
        return Helpers_Misc.getExisted(this._weatherManager, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManagerView_GetWeatherManager_00);
    }
    private _setWeatherManager(manager: Weathers_IManager.IManager): void {
        this._weatherManager = manager;
    }

    private _onNotifyUserSettingsIsShowWeatherAnimationChanged(): void {
        this.resetView(false);
    }

    public resetView(isForce: boolean): void {
        if (!LocalData_Storage.getShowWeatherAnimation()) {
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
            case Weathers_Constants.AnimationType.Rainy      : this._showRain();         break;
            case Weathers_Constants.AnimationType.Sandstorm  : this._showSandstorm();    break;
            case Weathers_Constants.AnimationType.Snowy      : this._showSnow();         break;
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
                const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorWhite0000` });
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
            Tween_Executor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
        }
    }
    private _resetTweenForImgRain(img: Ui_Interfaces_IUiImage.IUiImage): void {
        const container         = this._containerForRain;
        const containerHeight   = container.getUnscaledHeight();
        const imgHeight         = Math.floor(Math.random() * 20 + 10);
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setUnscaledManualHeight(imgHeight);

        Tween_Executor.Executor.removeTweens(img);
        Tween_Executor.Executor.get(img)
            .set({
                customX : Math.random() * container.getUnscaledWidth(),
                customY : startingY,
            })
            .to(
                { customY : endingY },
                (endingY - startingY) * 1.2 * (Math.random() * 0.2 + 0.9),
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
                const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorYellow0001` });
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
            Tween_Executor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
        }
    }
    private _resetTweenForImgSandstorm(img: Ui_Interfaces_IUiImage.IUiImage): void {
        const container         = this._containerForSandstorm;
        const containerHeight   = container.getUnscaledHeight();
        const scale             = 1.2;
        const imgHeight         = 1;
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setScaleX(scale);
        img.setScaleY(scale);

        Tween_Executor.Executor.removeTweens(img);
        Tween_Executor.Executor.get(img)
            .set({
                customX : Math.random() * container.getUnscaledWidth(),
                customY : startingY,
            })
            .to(
                { customY : endingY },
                (endingY - startingY) * 0.6 * (Math.random() * 0.2 + 0.9),
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
                const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `commonIcon0022` });
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
            Tween_Executor.Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
        }
    }
    private _resetTweenForImgSnow(img: Ui_Interfaces_IUiImage.IUiImage): void {
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

        Tween_Executor.Executor.removeTweens(img);
        Tween_Executor.Executor.get(img)
            .set({ customY : startingY })
            .to(
                { customY : endingY },
                (endingY - startingY) * 8 * (Math.random() * 0.2 + 0.9),
            )
            .call(() => this._resetTweenForImgSnow(img));
        Tween_Executor.Executor.get(img, { loop : true })
            .set({ customX : startingX - 20 })
            .to({ customX : startingX + 20 }, 2000, Tween_Ease.sineInOut)
            .to({ customX : startingX - 20 }, 2000, Tween_Ease.sineInOut);
    }

    private _resetContainerSize(container: Ui_Interfaces_IUiComponent.IUiComponent): void {
        const width             = this.getUnscaledWidth();
        const height            = this.getUnscaledHeight();
        const containerWidth    = Math.sqrt(width * width + height * height);
        const containerHeight   = containerWidth;
        container.setUnscaledManualWidth(containerWidth);
        container.setUnscaledManualHeight(containerHeight);
    }
}
