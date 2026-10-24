import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "./IBwGridVisualEffect.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";

export interface IBwGridVisualEffectView extends UiInterfacesIUiContainer.IUiContainer {
    init(gridVisualEffect: BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect): void;
    fastInit(gridVisualEffect: BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    showEffectBlock(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectDive(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectFlare(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectDamage(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectSupply(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectRepair(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectSiloExplosion(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectCoPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectCharge(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectSurface(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showEffectAiming(gridIndex: AuxiliaryTypesGridIndex.GridIndex, timeMs: number): void;
}
