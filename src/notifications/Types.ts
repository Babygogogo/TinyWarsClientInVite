import type { TypeId } from "./TypeId.ts";
import type { Event } from "../vendor/egret/Egret.ts";

export interface Listener {
    type        : TypeId,
    callback    : (e: Event) => void,
    thisObject? : any,
    useCapture? : boolean,
    priority?   : number;
}
