import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwGridVisualEffect,
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export interface IBwGridVisualEffectView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(gridVisualEffect: BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect): void;
    fastInit(gridVisualEffect: BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    showEffectBlock(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectDive(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectFlare(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectDamage(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectSupply(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectRepair(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectSiloExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectCoPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectCharge(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectSurface(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showEffectAiming(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, timeMs: number): void;
}
