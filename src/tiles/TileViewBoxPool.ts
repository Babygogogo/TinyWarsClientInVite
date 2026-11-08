import {
    Helpers_Misc,
    Logger,
    Tiles_TileViewBox,
} from "../internal.ts";

export class TileViewBoxPool {
    private static _instance : TileViewBoxPool | undefined;

    private readonly _availableViews        = new Array<Tiles_TileViewBox.TileViewBox>();
    private readonly _acquiredViews         = new Set<Tiles_TileViewBox.TileViewBox>();

    public static getInstance(): TileViewBoxPool {
        return TileViewBoxPool._instance ??= new TileViewBoxPool();
    }

    private constructor() {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public acquire(): Tiles_TileViewBox.TileViewBox {
        const view = this._availableViews.pop() ?? new Tiles_TileViewBox.TileViewBox();
        this._acquiredViews.add(view);

        Logger.log(`Acquired TileViewBox. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);

        return view;
    }

    public release(view: Tiles_TileViewBox.TileViewBox): void {
        if (!this._acquiredViews.has(view)) {
            throw Helpers_Misc.newError(`TileViewBox was not acquired from this pool or has already been released.`);
        }

        view.setIsVisible(true);

        this._acquiredViews.delete(view);
        this._availableViews.push(view);

        Logger.log(`Released TileViewBox. Available views: ${this._availableViews.length}, Acquired views: ${this._acquiredViews.size}`);
    }

    public getSize(): number {
        return this._availableViews.length;
    }

    public clear(): void {
        this._availableViews.length = 0;
    }
}
