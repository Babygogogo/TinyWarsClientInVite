import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwGridVisualEffect } from "../interface/IBwGridVisualEffect.ts";
import type { IBwGridVisualEffectView } from "../interface/IBwGridVisualEffectView.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import {
    getUnitBlock,
    getArrayUnitDive,
    getArrayUnitExplosion,
    getArrayUnitDamage,
    getUnitSupply,
    getUnitRepair,
    getArrayUnitScop,
    getArrayUnitCop,
    getArrayTileCharge,
    getArrayUnitSurface,
    getArrayCursorAiming,
} from "../../helpers/ImageSource.ts";
import { createLazyFunc } from "../../helpers/Misc.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import type { IUiComponent } from "../../ui/interfaces/IUiComponent.ts";
import { getUiContainerClass, getUiImageClass } from "../../ui/utils/UiFactory.ts";
import type { DisplayObject } from "../../vendor/egret/Egret.ts";

const getGridWidth                      = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                     = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);
const getBlockOffsetX                   = createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getBlockOffsetY                   = createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getDiveOffsetX                    = createLazyFunc(() => -getGridWidth());
const getDiveOffsetY                    = createLazyFunc(() => -getGridHeight());
const getExplosionOffsetX               = createLazyFunc(() => -getGridWidth());
const getExplosionOffsetY               = createLazyFunc(() => -getGridHeight() * 2);
const getDamageOffsetX                  = createLazyFunc(() => -getGridWidth());
const getDamageOffsetY                  = createLazyFunc(() => -getGridHeight());
const getSupplyOffsetX                  = createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getSupplyOffsetY                  = createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getRepairOffsetX                  = createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getRepairOffsetY                  = createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getCoPowerActivationOffsetX       = createLazyFunc(() => - getGridWidth() / 6 * 5);
const getCoPowerActivationOffsetY       = createLazyFunc(() => - getGridHeight() / 6 * 5);
const getCoSuperPowerActivationOffsetX  = createLazyFunc(() => - getGridWidth() / 6 * 11);
const getCoSuperPowerActivationOffsetY  = createLazyFunc(() => - getGridHeight() / 6 * 11);
const getAimingFrameDuration            = createLazyFunc(() => 100);

export class BwGridVisualEffectView extends UiContainer implements IBwGridVisualEffectView {
    private _gridVisualEffect!          : IBwGridVisualEffect;

    private _layerForBlock              = new (getUiContainerClass())();
    private _layerForDive               = new (getUiContainerClass())();
    private _layerForSurface            = new (getUiContainerClass())();
    private _layerForExplosion          = new (getUiContainerClass())();
    private _layerForDamage             = new (getUiContainerClass())();
    private _layerForFlare              = new (getUiContainerClass())();
    private _layerForSupply             = new (getUiContainerClass())();
    private _layerForRepair             = new (getUiContainerClass())();
    private _layerForSkillActivation    = new (getUiContainerClass())();
    private _layerForCharge             = new (getUiContainerClass())();
    private _layerForAiming             = new (getUiContainerClass())();

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

    public init(gridVisualEffect: IBwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }
    public fastInit(gridVisualEffect: IBwGridVisualEffect): void {
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
    public showEffectBlock(gridIndex: GridIndex): void {
        this._layerForBlock.addUiChild(createEffectBlock(gridIndex));
    }

    public showEffectDive(gridIndex: GridIndex): void {
        this._layerForDive.addUiChild(createEffectDive(gridIndex));
    }

    public showEffectExplosion(gridIndex: GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectExplosion(gridIndex));
    }

    public showEffectFlare(gridIndex: GridIndex): void {
        this._layerForFlare.addUiChild(createEffectFlare(gridIndex));
    }

    public showEffectDamage(gridIndex: GridIndex): void {
        this._layerForDamage.addUiChild(createEffectDamage(gridIndex));
    }

    public showEffectSupply(gridIndex: GridIndex): void {
        this._layerForSupply.addUiChild(createEffectSupply(gridIndex));
    }

    public showEffectRepair(gridIndex: GridIndex): void {
        this._layerForRepair.addUiChild(createEffectRepair(gridIndex));
    }

    public showEffectSiloExplosion(gridIndex: GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectSiloExplosion(gridIndex));
    }

    public showEffectCoPowerActivation(gridIndex: GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoPowerActivation(gridIndex));
    }

    public showEffectCoSuperPowerActivation(gridIndex: GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoSuperPowerActivation(gridIndex));
    }

    public showEffectCharge(gridIndex: GridIndex): void {
        this._layerForCharge.addUiChild(createEffectCharge(gridIndex));
    }

    public showEffectSurface(gridIndex: GridIndex): void {
        this._layerForSurface.addUiChild(createEffectSurface(gridIndex));
    }

    public showEffectAiming(gridIndex: GridIndex, timeMs: number): void {
        this._layerForAiming.addUiChild(createEffectAiming(gridIndex, timeMs));
    }
}

function createEffectBlock(gridIndex: GridIndex): IUiComponent {
    const img = new (getUiImageClass())({ textureSourceName: getUnitBlock() });
    img.setAnchorOffsetX(58);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos = gridIndex.createPointByGridIndex();
    img.setX(getBlockOffsetX() + pos.x);
    img.setY(getBlockOffsetY() + pos.y);

    Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectDive(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitDive();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDiveOffsetX() + pos.x);
    img.setY(getDiveOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectExplosion(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitExplosion();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getExplosionOffsetX() + pos.x);
    img.setY(getExplosionOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectFlare(gridIndex: GridIndex): IUiComponent {
    return createEffectDamage(gridIndex);
}

function createEffectDamage(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitDamage();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectSupply(gridIndex: GridIndex): IUiComponent {
    const img = new (getUiImageClass())({ textureSourceName: getUnitSupply() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getSupplyOffsetX() + pos.x);
    img.setY(getSupplyOffsetY() + pos.y);

    Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectRepair(gridIndex: GridIndex): IUiComponent {
    const img = new (getUiImageClass())({ textureSourceName: getUnitRepair() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getRepairOffsetX() + pos.x);
    img.setY(getRepairOffsetY() + pos.y);

    Executor.get(img)
        .to({ customScaleX: 1, customScaleY: 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectSiloExplosion(gridIndex: GridIndex): IUiComponent {
    const arrForDamage  = getArrayUnitDamage();
    const img           = new (getUiImageClass())({ textureSourceName: arrForDamage[0] });
    const pos           = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arrForDamage.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForDamage[i]));
    }

    tween.set({
        customX: getExplosionOffsetX() + pos.x,
        customY: getExplosionOffsetY() + pos.y
    });

    const arrForExplosion = getArrayUnitExplosion();
    tween.call(() => img.loadSource(arrForExplosion[0]));
    for (let i = 1; i < arrForExplosion.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForExplosion[i]));
    }

    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectCoSuperPowerActivation(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitScop();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectCoPowerActivation(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitCop();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoPowerActivationOffsetX() + pos.x);
    img.setY(getCoPowerActivationOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectCharge(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayTileCharge();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectSurface(gridIndex: GridIndex): IUiComponent {
    const arr = getArrayUnitSurface();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as DisplayObject));

    return img;
}

function createEffectAiming(gridIndex: GridIndex, timeMs: number): IUiComponent {
    const arr = getArrayCursorAiming();
    const img = new (getUiImageClass())({ textureSourceName: arr[0] });
    img.setIsSmoothing(false);
    img.setX(getGridWidth() * (gridIndex.getX() - 1));
    img.setY(getGridHeight() * (gridIndex.getY() - 1));

    const totalFramesCount  = arr.length;
    let frameIndex          = 0;
    Executor.get(img, { loop: true })
        .wait(getAimingFrameDuration())
        .call(() => {
            frameIndex = (frameIndex + 1) % totalFramesCount;
            img.loadSource(arr[frameIndex]);
        });

    Executor.get(img)
        .wait(timeMs)
        .call(() => {
            img.getParent()?.removeChild(img as unknown as DisplayObject);
            Executor.removeTweens(img);
        });

    return img;
}
