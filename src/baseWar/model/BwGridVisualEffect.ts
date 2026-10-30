import {
    BaseWar_View_BwGridVisualEffectView,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwGridVisualEffectView,
    type BaseWar_Interface_IBwWar,
    Notifications_Dispatcher,
    type Notifications_Types,
} from "../../internal.ts";

export class BwGridVisualEffect implements BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect {
    private readonly _view = new BaseWar_View_BwGridVisualEffectView.BwGridVisualEffectView();

    private _notifyListeners: Notifications_Types.Listener[] = [
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
    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this, false, 1);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    public getView(): BaseWar_Interface_IBwGridVisualEffectView.IBwGridVisualEffectView {
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
    public showEffectBlock(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectBlock(gridIndex);
    }

    public showEffectDive(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectDive(gridIndex);
    }

    public showEffectExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectExplosion(gridIndex);
    }

    public showEffectFlare(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectFlare(gridIndex);
    }

    public showEffectDamage(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectDamage(gridIndex);
    }

    public showEffectSupply(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectSupply(gridIndex);
    }

    public showEffectRepair(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectRepair(gridIndex);
    }

    public showEffectSiloExplosion(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectSiloExplosion(gridIndex);
    }

    public showEffectCoPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectCoPowerActivation(gridIndex);
    }
    public showEffectCoSuperPowerActivation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectCoSuperPowerActivation(gridIndex);
    }

    public showEffectCharge(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectCharge(gridIndex);
    }

    public showEffectSurface(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.getView().showEffectSurface(gridIndex);
    }

    public showEffectAiming(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, timeMs: number): void {
        this.getView().showEffectAiming(gridIndex, timeMs);
    }
}
