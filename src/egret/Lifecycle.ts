import { Egret_Egret } from "../internal.ts";

export function addLifecycleListener(plugin: (context: LifecycleContext) => void): void {
    const context: LifecycleContext = new LifecycleContext();
    LifecycleHelper.contexts.push(context);
    plugin(context);
}

export class LifecycleHelper {
    public static readonly contexts: LifecycleContext[] = [];
    public static stage: Egret_Egret.Stage | undefined;
    public static onPause: (() => void) | undefined;
    public static onResume: (() => void) | undefined;
}

export class LifecycleContext {
    private static isActivate: boolean = true;

    public declare onUpdate: (() => void) | undefined;

    public pause(): void {
        if (LifecycleContext.isActivate) {
            LifecycleContext.isActivate = false;
            LifecycleHelper.stage!.dispatchEvent(new Egret_Egret.Event(Egret_Egret.Event.DEACTIVATE));
            LifecycleHelper.onPause?.();
        }
    }
    public resume(): void {
        if (!LifecycleContext.isActivate) {
            LifecycleContext.isActivate = true;
            LifecycleHelper.stage!.dispatchEvent(new Egret_Egret.Event(Egret_Egret.Event.ACTIVATE));
            LifecycleHelper.onResume?.();
        }
    }
}
Egret_Egret.__reflect(LifecycleContext.prototype, "egret.lifecycle.LifecycleContext");
