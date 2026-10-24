import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import type * as UnitsIUnitMap from "./IUnitMap.ts";
import type * as UnitsIUnitView from "./IUnitView.ts";

export interface IUnitMapView extends UiInterfacesIUiContainer.IUiContainer {
    init(unitMap: UnitsIUnitMap.IUnitMap): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    addUnit(view: UnitsIUnitView.IUnitView, needResetZOrder: boolean): void;

    removeUnit(view: UnitsIUnitView.IUnitView): void;

    resetZOrder(unitType: number): void;
}
