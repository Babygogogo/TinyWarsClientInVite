import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "../interface/IBwGridVisualEffect.ts";
import type * as BaseWarInterfaceIBwGridVisualEffectView from "../interface/IBwGridVisualEffectView.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import type * as UiInterfacesIUiComponent from "../../ui/interfaces/IUiComponent.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const getGridWidth                      = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                     = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);
const getBlockOffsetX                   = HelpersMisc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getBlockOffsetY                   = HelpersMisc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getDiveOffsetX                    = HelpersMisc.createLazyFunc(() => -getGridWidth());
const getDiveOffsetY                    = HelpersMisc.createLazyFunc(() => -getGridHeight());
const getExplosionOffsetX               = HelpersMisc.createLazyFunc(() => -getGridWidth());
const getExplosionOffsetY               = HelpersMisc.createLazyFunc(() => -getGridHeight() * 2);
const getDamageOffsetX                  = HelpersMisc.createLazyFunc(() => -getGridWidth());
const getDamageOffsetY                  = HelpersMisc.createLazyFunc(() => -getGridHeight());
const getSupplyOffsetX                  = HelpersMisc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getSupplyOffsetY                  = HelpersMisc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getRepairOffsetX                  = HelpersMisc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getRepairOffsetY                  = HelpersMisc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getCoPowerActivationOffsetX       = HelpersMisc.createLazyFunc(() => - getGridWidth() / 6 * 5);
const getCoPowerActivationOffsetY       = HelpersMisc.createLazyFunc(() => - getGridHeight() / 6 * 5);
const getCoSuperPowerActivationOffsetX  = HelpersMisc.createLazyFunc(() => - getGridWidth() / 6 * 11);
const getCoSuperPowerActivationOffsetY  = HelpersMisc.createLazyFunc(() => - getGridHeight() / 6 * 11);
const getAimingFrameDuration            = HelpersMisc.createLazyFunc(() => 100);

export class BwGridVisualEffectView extends UiComponentsUiContainer.UiContainer implements BaseWarInterfaceIBwGridVisualEffectView.IBwGridVisualEffectView {
    private _gridVisualEffect!          : BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect;

    private _layerForBlock              = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForDive               = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForSurface            = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForExplosion          = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForDamage             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForFlare              = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForSupply             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForRepair             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForSkillActivation    = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForCharge             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _layerForAiming             = new (UiUtilsUiFactory.getUiContainerClass())();

    public constructor() {
        super();

        this.addUiChild(this._layerForSupply);
        this.addUiChild(this._layerForRepair);
        this.addUiChild(this._layerForBlock);
        this.addUiChild(this._layerForSurface);
        this.addUiChild(this._layerForDive);
        this.addUiChild(this._layerForExplosion);
        this.addUiChild(this._layerForDamage);
        this.addUiChild(this._layerForFlare);
        this.addUiChild(this._layerForSkillActivation);
        this.addUiChild(this._layerForCharge);
        this.addUiChild(this._layerForAiming);

        this.setIsTouchChildrenEnabled(false);
    }

    public init(gridVisualEffect: BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }
    public fastInit(gridVisualEffect: BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }

    public startRunningView(): void {
        // nothing to do
    }
    public stopRunningView(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public showEffectBlock(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForBlock.addUiChild(createEffectBlock(gridIndex));
    }

    public showEffectDive(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForDive.addUiChild(createEffectDive(gridIndex));
    }

    public showEffectExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectExplosion(gridIndex));
    }

    public showEffectFlare(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForFlare.addUiChild(createEffectFlare(gridIndex));
    }

    public showEffectDamage(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForDamage.addUiChild(createEffectDamage(gridIndex));
    }

    public showEffectSupply(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForSupply.addUiChild(createEffectSupply(gridIndex));
    }

    public showEffectRepair(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForRepair.addUiChild(createEffectRepair(gridIndex));
    }

    public showEffectSiloExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectSiloExplosion(gridIndex));
    }

    public showEffectCoPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoPowerActivation(gridIndex));
    }

    public showEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoSuperPowerActivation(gridIndex));
    }

    public showEffectCharge(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForCharge.addUiChild(createEffectCharge(gridIndex));
    }

    public showEffectSurface(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._layerForSurface.addUiChild(createEffectSurface(gridIndex));
    }

    public showEffectAiming(gridIndex: AuxiliaryTypesGridIndex.GridIndex, timeMs: number): void {
        this._layerForAiming.addUiChild(createEffectAiming(gridIndex, timeMs));
    }
}

function createEffectBlock(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: HelpersImageSource.getUnitBlock() });
    img.setAnchorOffsetX(58);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos = gridIndex.createPointByGridIndex();
    img.setX(getBlockOffsetX() + pos.x);
    img.setY(getBlockOffsetY() + pos.y);

    TweenExecutor.Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectDive(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitDive();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDiveOffsetX() + pos.x);
    img.setY(getDiveOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitExplosion();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getExplosionOffsetX() + pos.x);
    img.setY(getExplosionOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectFlare(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    return createEffectDamage(gridIndex);
}

function createEffectDamage(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitDamage();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectSupply(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: HelpersImageSource.getUnitSupply() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getSupplyOffsetX() + pos.x);
    img.setY(getSupplyOffsetY() + pos.y);

    TweenExecutor.Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectRepair(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: HelpersImageSource.getUnitRepair() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getRepairOffsetX() + pos.x);
    img.setY(getRepairOffsetY() + pos.y);

    TweenExecutor.Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectSiloExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arrForDamage  = HelpersImageSource.getArrayUnitDamage();
    const img           = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arrForDamage[0] });
    const pos           = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arrForDamage.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForDamage[i]));
    }

    tween.set({
        customX: getExplosionOffsetX() + pos.x,
        customY: getExplosionOffsetY() + pos.y
    });

    const arrForExplosion = HelpersImageSource.getArrayUnitExplosion();
    tween.call(() => img.loadSource(arrForExplosion[0]));
    for (let i = 1; i < arrForExplosion.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForExplosion[i]));
    }

    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitScop();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectCoPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitCop();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoPowerActivationOffsetX() + pos.x);
    img.setY(getCoPowerActivationOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectCharge(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayTileCharge();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectSurface(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayUnitSurface();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = TweenExecutor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject));

    return img;
}

function createEffectAiming(gridIndex: AuxiliaryTypesGridIndex.GridIndex, timeMs: number): UiInterfacesIUiComponent.IUiComponent {
    const arr = HelpersImageSource.getArrayCursorAiming();
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: arr[0] });
    img.setIsSmoothing(false);
    img.setX(getGridWidth() * (gridIndex.getX() - 1));
    img.setY(getGridHeight() * (gridIndex.getY() - 1));

    const totalFramesCount  = arr.length;
    let frameIndex          = 0;
    TweenExecutor.Executor.get(img, { loop: true })
        .wait(getAimingFrameDuration())
        .call(() => {
            frameIndex = (frameIndex + 1) % totalFramesCount;
            img.loadSource(arr[frameIndex]);
        });

    TweenExecutor.Executor.get(img)
        .wait(timeMs)
        .call(() => {
            img.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
            TweenExecutor.Executor.removeTweens(img);
        });

    return img;
}
