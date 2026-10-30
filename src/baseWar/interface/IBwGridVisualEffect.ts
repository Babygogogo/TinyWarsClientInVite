import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwGridVisualEffectView,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export interface IBwGridVisualEffect {
    init(): void;
    fastInit(): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getView(): BaseWar_Interface_IBwGridVisualEffectView.IBwGridVisualEffectView;

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
