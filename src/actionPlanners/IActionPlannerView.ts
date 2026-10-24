import type * as ActionPlannersIActionPlanner from "./IActionPlanner.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";

export interface IActionPlannerView {
    init(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void;
    fastInit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void;

    startRunningView(): void;
    stopRunningView(): void;

    getContainerForGrids(): UiInterfacesIUiContainer.IUiContainer;
    getContainerForUnits(): UiInterfacesIUiContainer.IUiContainer;

    updateView(): void;
}
