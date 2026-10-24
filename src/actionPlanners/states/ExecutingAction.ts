import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";

export class ExecutingAction implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ExecutingAction();

    public static getInstance(): ExecutingAction {
        return ExecutingAction._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ExecutingAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDrag(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(): void {
        throw HelpersMisc.newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ExecutingActionState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        actionPlanner.clearAllDataForStates();

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ExecutingAction);
        actionPlanner.updateView();
    }
}
