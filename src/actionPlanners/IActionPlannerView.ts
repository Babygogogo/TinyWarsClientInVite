import {
    type ActionPlanners_IActionPlanner,
    type Ui_Interfaces_IUiContainer,
} from "../internal.ts";

export interface IActionPlannerView {
    init(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void;
    fastInit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void;

    startRunningView(): void;
    stopRunningView(): void;

    getContainerForGrids(): Ui_Interfaces_IUiContainer.IUiContainer;
    getContainerForUnits(): Ui_Interfaces_IUiContainer.IUiContainer;

    updateView(): void;
}
