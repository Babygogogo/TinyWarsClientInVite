import type { IActionPlanner } from "./IActionPlanner.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";

export interface IActionPlannerView {
    init(actionPlanner: IActionPlanner): void;
    fastInit(actionPlanner: IActionPlanner): void;

    startRunningView(): void;
    stopRunningView(): void;

    getContainerForGrids(): IUiContainer;
    getContainerForUnits(): IUiContainer;

    updateView(): void;
}
