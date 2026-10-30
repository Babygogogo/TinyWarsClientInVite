import {
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_Constants,
} from "../../internal.ts";

export interface IState {
    getStateId(): ActionPlanners_Constants.StateId;

    getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId;
    getNextStateIdOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): ActionPlanners_Constants.StateId;
    getNextStateIdOnDragEnded(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId;

    cancel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void;

    doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    doApplyOnDragEnded(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
}
