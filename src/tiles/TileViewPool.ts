import {
    Egret_Egret,
    Helpers_Misc,
    Logger,
    Notifications_Dispatcher,
    Notifications_Mapping,
    Notifications_Types,
    Tiles_TileView,
} from "../internal.ts";

export class TileViewPool {
    private static _instance : TileViewPool | undefined;

    private readonly _availableViews        = new Array<Tiles_TileView.TileView>();
    private readonly _acquiredViews         = new Set<Tiles_TileView.TileView>();
    private readonly _notificationListeners : Notifications_Types.Listener[] = [
        { type : "TileAnimationTick",            callback : this._onNotifyTileAnimationTick },
        { type : "StateIndicatorTick",           callback : this._onNotifyStateIndicatorTick },
        { type : "BwOverridingSkinIdChanged",    callback : this._onNotifyBwOverridingSkinIdChanged },
    ];

    public static getInstance(): TileViewPool {
        return TileViewPool._instance ??= new TileViewPool();
    }

    private constructor() {
        Notifications_Dispatcher.addEventListeners(this._notificationListeners, this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyTileAnimationTick(): void {
        for (const view of this._acquiredViews) {
            view.updateOnNotifyTileAnimationTick();
        }
    }
    private _onNotifyStateIndicatorTick(): void {
        for (const view of this._acquiredViews) {
            view.updateOnNotifyStateIndicatorTick();
        }
    }
    private _onNotifyBwOverridingSkinIdChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwOverridingSkinIdChanged"]>): void {
        const war = e.data!.war;
        for (const view of this._acquiredViews) {
            view.updateOnNotifyBwOverridingSkinIdChanged(war);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public acquire(): Tiles_TileView.TileView {
        const view = this._availableViews.pop() ?? new Tiles_TileView.TileView();
        this._acquiredViews.add(view);

        Logger.log(`Acquired TileView. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);

        return view;
    }

    public release(view: Tiles_TileView.TileView): void {
        if (!this._acquiredViews.has(view)) {
            throw Helpers_Misc.newError(`TileView was not acquired from this pool or has already been released.`);
        }

        view.getImgBase().setIsVisible(true);
        view.getImgObject().setIsVisible(true);
        view.getImgDecoration().setIsVisible(true);
        view.getImgBuff().setIsVisible(true);
        view.getImgHighlight().setIsVisible(true);

        this._acquiredViews.delete(view);
        this._availableViews.push(view);

        Logger.log(`Released TileView. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);
    }

    public getSize(): number {
        return this._availableViews.length;
    }

    public clear(): void {
        this._availableViews.length = 0;
    }
}
