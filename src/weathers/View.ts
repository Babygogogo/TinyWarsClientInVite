import { getExisted } from "../helpers/Misc.ts";
import { getShowWeatherAnimation } from "../localData/Storage.ts";
import {
    addEventListeners,
    removeEventListeners,
} from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener } from "../notifications/Types.ts";
import { sineInOut } from "../tween/Ease.ts";
import { Executor } from "../tween/Executor.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import type { IUiComponent } from "../ui/interfaces/IUiComponent.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";
import { UiHorizontalAlign } from "../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../ui/types/UiVerticalAlign.ts";
import {
    getUiContainerClass,
    getUiImageClass,
} from "../ui/utils/UiFactory.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { DisplayObject } from "../vendor/egret/Egret.ts";
import { AnimationType } from "./Constants.ts";
import type { IManager } from "./IManager.ts";
import type { IView } from "./IView.ts";

const RAIN_DENSITY      = 0.15;
const RAIN_ANGLE        = 20;
const RAIN_ALPHA        = 0.5;
const SNOW_DENSITY      = 0.15;
const SNOW_ANGLE        = 10;
const SNOW_ALPHA        = 0.6;
const SANDSTORM_DENSITY = 0.15;
const SANDSTORM_ANGLE   = 70;
const SANDSTORM_ALPHA   = 0.9;

export class View extends UiContainer implements IView {
    private readonly _notifyListeners   : Listener[] = [
        { type: TypeId.UserSettingsIsShowWeatherAnimationChanged,    callback: this._onNotifyUserSettingsIsShowWeatherAnimationChanged },
    ];

    private _weatherManager?                : IManager;
    private readonly _containerForRain      = new (getUiContainerClass())();
    private _imgArrayForRain                : IUiImage[] = [];
    private readonly _containerForSnow      = new (getUiContainerClass())();
    private _imgArrayForSnow                : IUiImage[] = [];
    private readonly _containerForSandstorm = new (getUiContainerClass())();
    private _imgArrayForSandstorm           : IUiImage[] = [];
    private _showingWeatherType             : number | null = null;

    public constructor() {
        super();

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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
                horizontalAlign : { align   : UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForRain);
        }

        {
            const containerForSnow = this._containerForSnow;
            containerForSnow.setRotationInDegree(SNOW_ANGLE);
            containerForSnow.setAlpha(SNOW_ALPHA);
            containerForSnow.setIsTouchChildrenEnabled(false);
            containerForSnow.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align   : UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiVerticalAlign.Middle },
            });
            this.addUiChild(containerForSnow);
        }

        {
            const containerForSandstorm = this._containerForSandstorm;
            containerForSandstorm.setRotationInDegree(SANDSTORM_ANGLE);
            containerForSandstorm.setAlpha(SANDSTORM_ALPHA);
            containerForSandstorm.setIsTouchChildrenEnabled(false);
            containerForSandstorm.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align   : UiHorizontalAlign.Center },
                verticalAlign   : { align   : UiVerticalAlign.Middle },
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

    public init(manager: IManager): void {
        this._setWeatherManager(manager);
    }

    public startRunningView(): void {
        addEventListeners(this._notifyListeners, this);
        this.resetView(true);
    }
    public stopRunningView(): void {
        removeEventListeners(this._notifyListeners, this);
        this._stopView();
    }

    private _getWeatherManager(): IManager {
        return getExisted(this._weatherManager, ClientErrorCode.BwWeatherManagerView_GetWeatherManager_00);
    }
    private _setWeatherManager(manager: IManager): void {
        this._weatherManager = manager;
    }

    private _onNotifyUserSettingsIsShowWeatherAnimationChanged(): void {
        this.resetView(false);
    }

    public resetView(isForce: boolean): void {
        if (!getShowWeatherAnimation()) {
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
            case AnimationType.Rainy      : this._showRain();         break;
            case AnimationType.Sandstorm  : this._showSandstorm();    break;
            case AnimationType.Snowy      : this._showSnow();         break;
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
                const img = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
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
            Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as DisplayObject);
        }
    }
    private _resetTweenForImgRain(img: IUiImage): void {
        const container         = this._containerForRain;
        const containerHeight   = container.getUnscaledHeight();
        const imgHeight         = Math.floor(Math.random() * 20 + 10);
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setUnscaledManualHeight(imgHeight);

        Executor.removeTweens(img);
        Executor.get(img)
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
                const img = new (getUiImageClass())({ textureSourceName: `uncompressedColorYellow0001` });
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
            Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as DisplayObject);
        }
    }
    private _resetTweenForImgSandstorm(img: IUiImage): void {
        const container         = this._containerForSandstorm;
        const containerHeight   = container.getUnscaledHeight();
        const scale             = 1.2;
        const imgHeight         = 1;
        const startingY         = -Math.random() * containerHeight - imgHeight;
        const endingY           = containerHeight;
        img.setScaleX(scale);
        img.setScaleY(scale);

        Executor.removeTweens(img);
        Executor.get(img)
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
                const img = new (getUiImageClass())({ textureSourceName: `commonIcon0022` });
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
            Executor.removeTweens(img);
            img.getParent()?.removeChild(img as unknown as DisplayObject);
        }
    }
    private _resetTweenForImgSnow(img: IUiImage): void {
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

        Executor.removeTweens(img);
        Executor.get(img)
            .set({ customY: startingY })
            .to(
                { customY: endingY },
                (endingY - startingY) * 8 * (Math.random() * 0.2 + 0.9)
            )
            .call(() => this._resetTweenForImgSnow(img));
        Executor.get(img, { loop: true })
            .set({ customX: startingX - 20})
            .to({ customX: startingX + 20 }, 2000, sineInOut)
            .to({ customX: startingX - 20 }, 2000, sineInOut);
    }

    private _resetContainerSize(container: IUiComponent): void {
        const width             = this.getUnscaledWidth();
        const height            = this.getUnscaledHeight();
        const containerWidth    = Math.sqrt(width * width + height * height);
        const containerHeight   = containerWidth;
        container.setUnscaledManualWidth(containerWidth);
        container.setUnscaledManualHeight(containerHeight);
    }
}
