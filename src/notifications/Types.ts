import {
    type Egret_Egret,
    type Notifications_Mapping,
} from "../internal.ts";

export type Listener<T extends keyof Notifications_Mapping.Mapping = keyof Notifications_Mapping.Mapping> = {
    [K in T]: {
        type        : K,
        callback    : (e: Egret_Egret.Event<Notifications_Mapping.Mapping[K]>) => void,
        thisObject? : unknown,
        useCapture? : boolean,
        priority?   : number;
    };
}[T];
