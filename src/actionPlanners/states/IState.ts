import type * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";

type ApStateId  = ActionPlannersConstants.StateId;
type GridIndex  = AuxiliaryTypesGridIndex.GridIndex;

export interface IState {
    getStateId(): ApStateId;

    getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ApStateId;
    getNextStateIdOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): ApStateId;
    getNextStateIdOnDragEnded(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ApStateId;

    cancel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void;

    doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDragEnded(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void;
}
