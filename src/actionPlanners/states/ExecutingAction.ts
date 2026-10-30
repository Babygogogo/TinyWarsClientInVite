import {
    Helpers_Misc,
    ActionPlanners_Constants,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
} from "../../internal.ts";

export class ExecutingAction implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ExecutingAction();

    public static getInstance(): ExecutingAction {
        return ExecutingAction._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ExecutingAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDrag(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(): void {
        throw Helpers_Misc.newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ExecutingActionState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        actionPlanner.clearAllDataForStates();

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ExecutingAction);
        actionPlanner.updateView();
    }
}
