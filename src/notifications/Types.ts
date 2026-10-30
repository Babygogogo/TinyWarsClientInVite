import {
    type Egret_Egret,
    type Notifications_TypeId,
} from "../internal.ts";

export interface Listener {
    type        : Notifications_TypeId.TypeId,
    callback    : (e: Egret_Egret.Event) => void,
    thisObject? : any,
    useCapture? : boolean,
    priority?   : number;
}
