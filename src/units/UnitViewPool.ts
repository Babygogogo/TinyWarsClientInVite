import {
    Egret_Egret,
    Helpers_Misc,
    Logger,
    Notifications_Dispatcher,
    Notifications_Mapping,
    Notifications_Types,
    Units_UnitView,
} from "../internal.ts";

export class UnitViewPool {
    private static _instance : UnitViewPool | undefined;

    private readonly _availableViews        = new Array<Units_UnitView.UnitView>();
    private readonly _acquiredViews         = new Set<Units_UnitView.UnitView>();
    private readonly _notificationListeners : Notifications_Types.Listener[] = [
        { type : "UnitAnimationTick",            callback : this._onNotifyUnitAnimationTick },
        { type : "StateIndicatorTick",           callback : this._onNotifyUnitStateIndicatorTick },
        { type : "UnitFlashTick",                callback : this._onNotifyUnitFlashTick },
        { type : "BwOverridingSkinIdChanged",    callback : this._onNotifyBwOverridingSkinIdChanged },
    ];

    public static getInstance(): UnitViewPool {
        return UnitViewPool._instance ??= new UnitViewPool();
    }

    private constructor() {
        Notifications_Dispatcher.addEventListeners(this._notificationListeners, this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyUnitAnimationTick(): void {
        for (const view of this._acquiredViews) {
            view.updateOnNotifyUnitAnimationTick();
        }
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        for (const view of this._acquiredViews) {
            view.updateOnNotifyUnitStateIndicatorTick();
        }
    }
    private _onNotifyUnitFlashTick(): void {
        for (const view of this._acquiredViews) {
            view.updateOnNotifyUnitFlashTick();
        }
    }
    private _onNotifyBwOverridingSkinIdChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwOverridingSkinIdChanged"]>): void {
        const war = e.data!.war;
        for (const view of this._acquiredViews) {
            view.updateOnNotifyBwOverridingSkinIdChanged(war);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public acquire(): Units_UnitView.UnitView {
        const view = this._availableViews.pop() ?? new Units_UnitView.UnitView();
        this._acquiredViews.add(view);

        Logger.log(`Acquired UnitView. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);

        return view;
    }

    public release(view: Units_UnitView.UnitView): void {
        if (!this._acquiredViews.has(view)) {
            throw Helpers_Misc.newError(`UnitView was not acquired from this pool or has already been released.`);
        }

        view.setIsVisible(true);

        this._acquiredViews.delete(view);
        this._availableViews.push(view);

        Logger.log(`Released UnitView. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);
    }

    public getSize(): number {
        return this._availableViews.length;
    }

    public clear(): void {
        this._availableViews.length = 0;
    }
}
