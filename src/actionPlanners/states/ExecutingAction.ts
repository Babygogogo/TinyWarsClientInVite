import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import { newError } from "../../helpers/Misc.ts";

export class ExecutingAction implements IState {
    private static readonly _instance = new ExecutingAction();

    public static getInstance(): ExecutingAction {
        return ExecutingAction._instance;
    }

    public getStateId(): StateId {
        return StateId.ExecutingAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDrag(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(): void {
        throw newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ExecutingActionState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: IActionPlanner): void {
        actionPlanner.clearAllDataForStates();

        actionPlanner.setStateId(StateId.ExecutingAction);
        actionPlanner.updateView();
    }
}
