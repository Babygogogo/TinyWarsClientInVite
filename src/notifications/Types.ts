import type * as NotificationsTypeId from "./TypeId.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export interface Listener {
    type        : NotificationsTypeId.TypeId,
    callback    : (e: VendorEgretEgret.Event) => void,
    thisObject? : any,
    useCapture? : boolean,
    priority?   : number;
}
