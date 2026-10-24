import type * as UiInterfacesIUiContainerBase from "./IUiContainerBase.ts";
import type * as UiTypesUiUnitViewData from "../types/UiUnitViewData.ts";

export interface IUiUnitView extends UiInterfacesIUiContainerBase.IUiContainerBase {
    update(viewData: UiTypesUiUnitViewData.UiUnitViewData, tickCount?: number): void;

    getViewData(): UiTypesUiUnitViewData.UiUnitViewData | null;

    updateOnAnimationTick(tickCount: number): void;

    updateOnStateIndicatorTick(): void;
}
