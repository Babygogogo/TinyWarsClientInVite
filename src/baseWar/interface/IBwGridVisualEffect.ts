import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwGridVisualEffectView } from "./IBwGridVisualEffectView.ts";
import type { IBwWar } from "./IBwWar.ts";

export interface IBwGridVisualEffect {
    init(): void;
    fastInit(): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getView(): IBwGridVisualEffectView;

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
