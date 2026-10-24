
import { type Stage, __reflect, Event } from "./EgretCore";

export function addLifecycleListener(plugin: (context: LifecycleContext) => void): void {
    const context: LifecycleContext = new LifecycleContext();
    LifecycleHelper.contexts.push(context);
    plugin(context);
}

export class LifecycleHelper {
    public static readonly contexts: LifecycleContext[] = [];
    public static stage: Stage | undefined;
    public static onPause: (() => void) | undefined;
    public static onResume: (() => void) | undefined;
}

export class LifecycleContext {
    private static isActivate: boolean = true;

    public declare onUpdate: (() => void) | undefined;

    public pause(): void {
        if (LifecycleContext.isActivate) {
            LifecycleContext.isActivate = false;
            LifecycleHelper.stage!.dispatchEvent(new Event(Event.DEACTIVATE));
            LifecycleHelper.onPause?.();
        }
    }
    public resume(): void {
        if (!LifecycleContext.isActivate) {
            LifecycleContext.isActivate = true;
            LifecycleHelper.stage!.dispatchEvent(new Event(Event.ACTIVATE));
            LifecycleHelper.onResume?.();
        }
    }
}
__reflect(LifecycleContext.prototype, "egret.lifecycle.LifecycleContext");
