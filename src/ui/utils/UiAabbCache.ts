import type { Rectangle } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { UiAabbParams } from "../types/UiAabbParams.ts";
import { getAabbToParent } from "./UiHelpers.ts";

export class UiAabbCache {
    private _params?    : UiAabbParams;
    private _result     : Rectangle = { x: 0, y: 0, width: 0, height: 0 };

    public getAabb(params: UiAabbParams): Rectangle {
        if (!checkIsSameParam(this._params, params)) {
            this._params = params;
            this._result = getAabbToParent(params);
        }
        return this._result;
    }
}

function checkIsSameParam(p1: UiAabbParams | undefined, p2: UiAabbParams): boolean {
    if (p1 == null) {
        return false;
    }
    return (p1.anchorOffsetX    === p2.anchorOffsetX)
        && (p1.anchorOffsetY    === p2.anchorOffsetY)
        && (p1.rotationInDegree === p2.rotationInDegree)
        && (p1.scaleX           === p2.scaleX)
        && (p1.scaleY           === p2.scaleY)
        && (p1.unscaledHeight   === p2.unscaledHeight)
        && (p1.unscaledWidth    === p2.unscaledWidth);
}
