import {
    Ui_Utils_UiHelpers,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiAabbParams,
} from "../../internal.ts";

export class UiAabbCache {
    private _params?    : Ui_Types_UiAabbParams.UiAabbParams;
    private _result     : AuxiliaryTypes_AuxiliaryTypes.Rectangle = {
        x : 0, y : 0, width : 0, height : 0, 
    };

    public getAabb(params: Ui_Types_UiAabbParams.UiAabbParams): AuxiliaryTypes_AuxiliaryTypes.Rectangle {
        if (!checkIsSameParam(this._params, params)) {
            this._params = params;
            this._result = Ui_Utils_UiHelpers.getAabbToParent(params);
        }
        return this._result;
    }
}

function checkIsSameParam(p1: Ui_Types_UiAabbParams.UiAabbParams | undefined, p2: Ui_Types_UiAabbParams.UiAabbParams): boolean {
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
