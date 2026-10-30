import {
    Helpers_Misc,
    Tween_Executor,
    Helpers_ImageSource,
    Graphics_Utils,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwGridVisualEffectView,
    type Ui_Interfaces_IUiComponent,
    type Egret_Egret,
} from "../../internal.ts";

const getGridWidth                      = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                     = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);
const getBlockOffsetX                   = Helpers_Misc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getBlockOffsetY                   = Helpers_Misc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getDiveOffsetX                    = Helpers_Misc.createLazyFunc(() => -getGridWidth());
const getDiveOffsetY                    = Helpers_Misc.createLazyFunc(() => -getGridHeight());
const getExplosionOffsetX               = Helpers_Misc.createLazyFunc(() => -getGridWidth());
const getExplosionOffsetY               = Helpers_Misc.createLazyFunc(() => -getGridHeight() * 2);
const getDamageOffsetX                  = Helpers_Misc.createLazyFunc(() => -getGridWidth());
const getDamageOffsetY                  = Helpers_Misc.createLazyFunc(() => -getGridHeight());
const getSupplyOffsetX                  = Helpers_Misc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getSupplyOffsetY                  = Helpers_Misc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getRepairOffsetX                  = Helpers_Misc.createLazyFunc(() => Math.floor(getGridWidth() * 0.3));
const getRepairOffsetY                  = Helpers_Misc.createLazyFunc(() => Math.floor(getGridHeight() * 0.3));
const getCoPowerActivationOffsetX       = Helpers_Misc.createLazyFunc(() => - getGridWidth() / 6 * 5);
const getCoPowerActivationOffsetY       = Helpers_Misc.createLazyFunc(() => - getGridHeight() / 6 * 5);
const getCoSuperPowerActivationOffsetX  = Helpers_Misc.createLazyFunc(() => - getGridWidth() / 6 * 11);
const getCoSuperPowerActivationOffsetY  = Helpers_Misc.createLazyFunc(() => - getGridHeight() / 6 * 11);
const getAimingFrameDuration            = Helpers_Misc.createLazyFunc(() => 100);

export class BwGridVisualEffectView extends Ui_Components_UiContainer.UiContainer implements BaseWar_Interface_IBwGridVisualEffectView.IBwGridVisualEffectView {
    private _gridVisualEffect!          : BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect;

    private _layerForBlock              = new Ui_Components_UiContainer.UiContainer();
    private _layerForDive               = new Ui_Components_UiContainer.UiContainer();
    private _layerForSurface            = new Ui_Components_UiContainer.UiContainer();
    private _layerForExplosion          = new Ui_Components_UiContainer.UiContainer();
    private _layerForDamage             = new Ui_Components_UiContainer.UiContainer();
    private _layerForFlare              = new Ui_Components_UiContainer.UiContainer();
    private _layerForSupply             = new Ui_Components_UiContainer.UiContainer();
    private _layerForRepair             = new Ui_Components_UiContainer.UiContainer();
    private _layerForSkillActivation    = new Ui_Components_UiContainer.UiContainer();
    private _layerForCharge             = new Ui_Components_UiContainer.UiContainer();
    private _layerForAiming             = new Ui_Components_UiContainer.UiContainer();

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

    public init(gridVisualEffect: BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }
    public fastInit(gridVisualEffect: BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect): void {
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
    public showEffectBlock(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForBlock.addUiChild(createEffectBlock(gridIndex));
    }

    public showEffectDive(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForDive.addUiChild(createEffectDive(gridIndex));
    }

    public showEffectExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectExplosion(gridIndex));
    }

    public showEffectFlare(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForFlare.addUiChild(createEffectFlare(gridIndex));
    }

    public showEffectDamage(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForDamage.addUiChild(createEffectDamage(gridIndex));
    }

    public showEffectSupply(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForSupply.addUiChild(createEffectSupply(gridIndex));
    }

    public showEffectRepair(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForRepair.addUiChild(createEffectRepair(gridIndex));
    }

    public showEffectSiloExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForExplosion.addUiChild(createEffectSiloExplosion(gridIndex));
    }

    public showEffectCoPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoPowerActivation(gridIndex));
    }

    public showEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForSkillActivation.addUiChild(createEffectCoSuperPowerActivation(gridIndex));
    }

    public showEffectCharge(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForCharge.addUiChild(createEffectCharge(gridIndex));
    }

    public showEffectSurface(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._layerForSurface.addUiChild(createEffectSurface(gridIndex));
    }

    public showEffectAiming(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, timeMs: number): void {
        this._layerForAiming.addUiChild(createEffectAiming(gridIndex, timeMs));
    }
}

function createEffectBlock(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : Helpers_ImageSource.getUnitBlock() });
    img.setAnchorOffsetX(58);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos = gridIndex.createPointByGridIndex();
    img.setX(getBlockOffsetX() + pos.x);
    img.setY(getBlockOffsetY() + pos.y);

    Tween_Executor.Executor.get(img)
        .to({ customScaleX : 1, customScaleY : 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectDive(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitDive();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDiveOffsetX() + pos.x);
    img.setY(getDiveOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitExplosion();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getExplosionOffsetX() + pos.x);
    img.setY(getExplosionOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectFlare(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    return createEffectDamage(gridIndex);
}

function createEffectDamage(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitDamage();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectSupply(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : Helpers_ImageSource.getUnitSupply() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getSupplyOffsetX() + pos.x);
    img.setY(getSupplyOffsetY() + pos.y);

    Tween_Executor.Executor.get(img)
        .to({ customScaleX : 1, customScaleY : 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectRepair(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : Helpers_ImageSource.getUnitRepair() });
    img.setAnchorOffsetX(60);
    img.setAnchorOffsetY(18);
    img.setScaleX(2);
    img.setScaleY(2);

    const pos   = gridIndex.createPointByGridIndex();
    img.setX(getRepairOffsetX() + pos.x);
    img.setY(getRepairOffsetY() + pos.y);

    Tween_Executor.Executor.get(img)
        .to({ customScaleX : 1, customScaleY : 1 }, 100)
        .wait(600)
        .call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectSiloExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arrForDamage  = Helpers_ImageSource.getArrayUnitDamage();
    const img           = new Ui_Components_UiImage.UiImage({ textureSourceName : arrForDamage[0] });
    const pos           = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arrForDamage.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForDamage[i]));
    }

    tween.set({
        customX : getExplosionOffsetX() + pos.x,
        customY : getExplosionOffsetY() + pos.y,
    });

    const arrForExplosion = Helpers_ImageSource.getArrayUnitExplosion();
    tween.call(() => img.loadSource(arrForExplosion[0]));
    for (let i = 1; i < arrForExplosion.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arrForExplosion[i]));
    }

    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitScop();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectCoPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitCop();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoPowerActivationOffsetX() + pos.x);
    img.setY(getCoPowerActivationOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectCharge(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayTileCharge();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getCoSuperPowerActivationOffsetX() + pos.x);
    img.setY(getCoSuperPowerActivationOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(34).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectSurface(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayUnitSurface();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    const pos = gridIndex.createPointByGridIndex();
    img.setIsSmoothing(false);
    img.setX(getDamageOffsetX() + pos.x);
    img.setY(getDamageOffsetY() + pos.y);

    const tween = Tween_Executor.Executor.get(img);
    for (let i = 1; i < arr.length; ++i) {
        tween.wait(50).call(() => img.loadSource(arr[i]));
    }
    tween.call(() => img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject));

    return img;
}

function createEffectAiming(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, timeMs: number): Ui_Interfaces_IUiComponent.IUiComponent {
    const arr = Helpers_ImageSource.getArrayCursorAiming();
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : arr[0] });
    img.setIsSmoothing(false);
    img.setX(getGridWidth() * (gridIndex.getX() - 1));
    img.setY(getGridHeight() * (gridIndex.getY() - 1));

    const totalFramesCount  = arr.length;
    let frameIndex          = 0;
    Tween_Executor.Executor.get(img, { loop : true })
        .wait(getAimingFrameDuration())
        .call(() => {
            frameIndex = (frameIndex + 1) % totalFramesCount;
            img.loadSource(arr[frameIndex]);
        });

    Tween_Executor.Executor.get(img)
        .wait(timeMs)
        .call(() => {
            img.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
            Tween_Executor.Executor.removeTweens(img);
        });

    return img;
}
