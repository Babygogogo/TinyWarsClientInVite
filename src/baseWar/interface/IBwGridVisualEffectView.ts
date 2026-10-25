import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwGridVisualEffect } from "./IBwGridVisualEffect.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";

export interface IBwGridVisualEffectView extends IUiContainer {
    init(gridVisualEffect: IBwGridVisualEffect): void;
    fastInit(gridVisualEffect: IBwGridVisualEffect): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    showEffectBlock(gridIndex: GridIndex): void;

    showEffectDive(gridIndex: GridIndex): void;

    showEffectExplosion(gridIndex: GridIndex): void;

    showEffectFlare(gridIndex: GridIndex): void;

    showEffectDamage(gridIndex: GridIndex): void;

    showEffectSupply(gridIndex: GridIndex): void;

    showEffectRepair(gridIndex: GridIndex): void;

    showEffectSiloExplosion(gridIndex: GridIndex): void;

    showEffectCoPowerActivation(gridIndex: GridIndex): void;

    showEffectCoSuperPowerActivation(gridIndex: GridIndex): void;

    showEffectCharge(gridIndex: GridIndex): void;

    showEffectSurface(gridIndex: GridIndex): void;

    showEffectAiming(gridIndex: GridIndex, timeMs: number): void;
}
