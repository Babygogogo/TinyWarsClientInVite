import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwGridVisualEffectView from "./IBwGridVisualEffectView.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";

export interface IBwGridVisualEffect {
    init(): void;
    fastInit(): void;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getView(): BaseWarInterfaceIBwGridVisualEffectView.IBwGridVisualEffectView;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // private _onNotifyBwUnitBeAttacked(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwUnitBeDestroyed(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwUnitBeRepaired(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwUnitBeSupplied(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwTileBeAttacked(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwTileBeDestroyed(e: egret.Event): void {
    //     // nothing to do
    // }

    // private _onNotifyBwSiloExploded(e: egret.Event): void {
    //     // nothing to do
    // }

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
