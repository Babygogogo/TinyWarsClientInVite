import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import type { IUnitMap } from "./IUnitMap.ts";
import type { IUnitView } from "./IUnitView.ts";

export interface IUnitMapView extends IUiContainer {
    init(unitMap: IUnitMap): void;

    startRunningView(): void;
    stopRunningView(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    addUnit(view: IUnitView, needResetZOrder: boolean): void;

    removeUnit(view: IUnitView): void;

    resetZOrder(unitType: number): void;
}
