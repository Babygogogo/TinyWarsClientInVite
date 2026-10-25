import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwGridVisualEffect } from "../interface/IBwGridVisualEffect.ts";
import type { IBwGridVisualEffectView } from "../interface/IBwGridVisualEffectView.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getBwGridVisualEffectViewClass } from "../../gameHelpers/GhFactory.ts";
import { addEventListeners, removeEventListeners } from "../../notifications/Dispatcher.ts";
import type { Listener } from "../../notifications/Types.ts";

type GridIndex = AuxiliaryTypesGridIndex;

export class BwGridVisualEffect implements IBwGridVisualEffect {
    private readonly _view = new (getBwGridVisualEffectViewClass())();

    private _notifyListeners: Listener[] = [
        // { type: NotifyType.BwUnitBeAttacked,   callback: this._onNotifyBwUnitBeAttacked },
        // { type: NotifyType.BwUnitBeDestroyed,  callback: this._onNotifyBwUnitBeDestroyed },
        // { type: NotifyType.BwUnitBeRepaired,   callback: this._onNotifyBwUnitBeRepaired },
        // { type: NotifyType.BwUnitBeSupplied,   callback: this._onNotifyBwUnitBeSupplied },
        // { type: NotifyType.BwTileBeDestroyed,  callback: this._onNotifyBwTileBeDestroyed },
        // { type: NotifyType.BwTileBeAttacked,   callback: this._onNotifyBwTileBeAttacked },
        // { type: NotifyType.BwSiloExploded,     callback: this._onNotifyBwSiloExploded },
    ];

    public init(): void {
        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public startRunning(war: IBwWar): void {
        addEventListeners(this._notifyListeners, this, false, 1);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    public getView(): IBwGridVisualEffectView {
        return this._view;
    }

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
    // The public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public showEffectBlock(gridIndex: GridIndex): void {
        this.getView().showEffectBlock(gridIndex);
    }

    public showEffectDive(gridIndex: GridIndex): void {
        this.getView().showEffectDive(gridIndex);
    }

    public showEffectExplosion(gridIndex: GridIndex): void {
        this.getView().showEffectExplosion(gridIndex);
    }

    public showEffectFlare(gridIndex: GridIndex): void {
        this.getView().showEffectFlare(gridIndex);
    }

    public showEffectDamage(gridIndex: GridIndex): void {
        this.getView().showEffectDamage(gridIndex);
    }

    public showEffectSupply(gridIndex: GridIndex): void {
        this.getView().showEffectSupply(gridIndex);
    }

    public showEffectRepair(gridIndex: GridIndex): void {
        this.getView().showEffectRepair(gridIndex);
    }

    public showEffectSiloExplosion(gridIndex: GridIndex): void {
        this.getView().showEffectSiloExplosion(gridIndex);
    }

    public showEffectCoPowerActivation(gridIndex: GridIndex): void {
        this.getView().showEffectCoPowerActivation(gridIndex);
    }
    public showEffectCoSuperPowerActivation(gridIndex: GridIndex): void {
        this.getView().showEffectCoSuperPowerActivation(gridIndex);
    }

    public showEffectCharge(gridIndex: GridIndex): void {
        this.getView().showEffectCharge(gridIndex);
    }

    public showEffectSurface(gridIndex: GridIndex): void {
        this.getView().showEffectSurface(gridIndex);
    }

    public showEffectAiming(gridIndex: GridIndex, timeMs: number): void {
        this.getView().showEffectAiming(gridIndex, timeMs);
    }
}
