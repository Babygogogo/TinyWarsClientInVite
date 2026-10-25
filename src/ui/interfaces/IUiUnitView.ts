import type { IUiContainerBase } from "./IUiContainerBase.ts";
import type { UiUnitViewData } from "../types/UiUnitViewData.ts";

export interface IUiUnitView extends IUiContainerBase {
    update(viewData: UiUnitViewData, tickCount?: number): void;

    getViewData(): UiUnitViewData | null;

    updateOnAnimationTick(tickCount: number): void;

    updateOnStateIndicatorTick(): void;
}
