import { type EaseFunction, Ease, EventDispatcher, __reflect, type TweenProperties, type TweenOptions, Tween, Event } from "./Egret";

interface PropertyMetadata {
    __meta__?: Record<string, string>;
    __defaultProperty__?: string;
}

function registerProperty(classDefinition: { prototype: object }, property: string, type: string, asDefault: boolean): void {
    const prototype: PropertyMetadata = classDefinition.prototype as PropertyMetadata;
    prototype.__meta__ = prototype.__meta__ || {};
    prototype.__meta__[property] = type;
    if (asDefault) { prototype.__defaultProperty__ = property; }
}

function convertEase(ease: EaseFunction | string | undefined): EaseFunction | null {
    if (typeof ease === "function") { return ease; }
    if (ease !== undefined) {
        const func: unknown = (Ease as unknown as Record<string, unknown>)[ease];
        if (typeof func === "function") { return func as EaseFunction; }
    }
    return null;
}

export class BasePath extends EventDispatcher {
    public name: string = "";
}
__reflect(BasePath.prototype, "egret.tween.BasePath");

export class To extends BasePath {
    public props: TweenProperties | undefined = undefined;
    public duration: number = 500;
    public ease: EaseFunction | string | undefined = undefined;
}
__reflect(To.prototype, "egret.tween.To");

export class Wait extends BasePath {
    public duration: number = 500;
    public passive: boolean | undefined = undefined;
}
__reflect(Wait.prototype, "egret.tween.Wait");

export class Set extends BasePath {
    public props: TweenProperties | undefined = undefined;
}
__reflect(Set.prototype, "egret.tween.Set");

export class Tick extends BasePath {
    public delta: number = 0;
}
__reflect(Tick.prototype, "egret.tween.Tick");

export class TweenItem extends EventDispatcher {
    private isStop: boolean = false;
    private _props: TweenOptions | undefined;
    private _target: object | undefined;
    private _paths: BasePath[] | undefined;
    private tween: Tween | undefined;

    public get props(): TweenOptions | undefined { return this._props; }
    public set props(value: TweenOptions | undefined) { this._props = value; }
    public get target(): object | undefined { return this._target; }
    public set target(value: object | undefined) { this._target = value; }
    public get paths(): BasePath[] | undefined { return this._paths; }
    public set paths(value: BasePath[] | null | undefined) { this._paths = value || []; }
    public play(position?: number | null): void {
        if (!this.tween) { this.createTween(position); }
        else {
            this.tween.setPaused(false);
            if (this.isStop && position == undefined) { position = 0; this.isStop = false; }
            if (position !== undefined && position !== null) { this.tween.setPosition(position); }
        }
    }
    public pause(): void { if (this.tween) { this.tween.setPaused(true); } }
    public stop(): void { this.pause(); this.isStop = true; }
    private createTween(position: number | null | undefined): void {
        this.tween = Tween.get(this._target!, this._props);
        if (this._paths) { this.applyPaths(); }
        if (position !== undefined && position !== null) { this.tween.setPosition(position); }
    }
    private applyPaths(): void {
        for (let i: number = 0; i < this._paths!.length; i++) {
            const path: BasePath = this._paths![i]!;
            this.applyPath(path);
        }
    }
    private applyPath(path: BasePath): void {
        if (path instanceof To) { this.tween!.to(path.props, path.duration, convertEase(path.ease)); }
        else if (path instanceof Wait) { this.tween!.wait(path.duration, path.passive); }
        else if (path instanceof Set) { this.tween!.set(path.props); }
        else if (path instanceof Tick) { this.tween!.$tick(path.delta); }
        this.tween!.call((): void => { this.pathComplete(path); });
    }
    private pathComplete(path: BasePath): void {
        path.dispatchEventWith("complete");
        this.dispatchEventWith("pathComplete", false, path);
        const index: number = this._paths!.indexOf(path);
        if (index >= 0 && index === this._paths!.length - 1) { this.dispatchEventWith("complete"); }
    }
}
__reflect(TweenItem.prototype, "egret.tween.TweenItem");
registerProperty(TweenItem, "paths", "Array", true);

export class TweenGroup extends EventDispatcher {
    private completeCount: number = 0;
    private _items: TweenItem[] | undefined;

    public get items(): TweenItem[] | undefined { return this._items; }
    public set items(value: TweenItem[] | undefined) {
        this.completeCount = 0;
        this.registerEvent(false);
        this._items = value;
        this.registerEvent(true);
    }
    private registerEvent(add: boolean): void {
        if (this._items) {
            this._items.forEach((item: TweenItem): void => {
                if (add) { item.addEventListener("complete", this.itemComplete, this); }
                else { item.removeEventListener("complete", this.itemComplete, this); }
            });
        }
    }
    public play(time?: number | null): void {
        if (!this._items) { return; }
        for (let i: number = 0; i < this._items.length; i++) {
            const item: TweenItem = this._items[i]!;
            item.play(time);
        }
    }
    public pause(): void {
        if (!this._items) { return; }
        for (let i: number = 0; i < this._items.length; i++) {
            const item: TweenItem = this._items[i]!;
            item.pause();
        }
    }
    public stop(): void {
        if (!this._items) { return; }
        for (let i: number = 0; i < this._items.length; i++) {
            const item: TweenItem = this._items[i]!;
            item.stop();
        }
    }
    private itemComplete(e: Event): void {
        const item: TweenItem = e.currentTarget as TweenItem;
        this.completeCount++;
        this.dispatchEventWith("itemComplete", false, item);
        if (this.completeCount === this.items!.length) {
            this.dispatchEventWith("complete");
            this.completeCount = 0;
        }
    }
}
__reflect(TweenGroup.prototype, "egret.tween.TweenGroup");
registerProperty(TweenGroup, "items", "Array", true);
