import {
    type Ui_Interfaces_IUiContainer,
    type Units_IUnitMap,
    type Units_IUnitView,
} from "../internal.ts";

export interface IUnitMapView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(unitMap: Units_IUnitMap.IUnitMap): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    addUnit(view: Units_IUnitView.IUnitView, needResetZOrder: boolean): void;

    removeUnit(view: Units_IUnitView.IUnitView): void;

    resetZOrder(unitType: number): void;
}
