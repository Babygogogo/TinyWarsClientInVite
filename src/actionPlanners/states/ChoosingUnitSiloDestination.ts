import {
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    Sounds_SoundPlayer,
    Sounds_Constants,
} from "../../internal.ts";

export class ChoosingUnitSiloDestination implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitSiloDestination();

    public static getInstance(): ChoosingUnitSiloDestination {
        return ChoosingUnitSiloDestination._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            return ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return ActionPlanners_Constants.StateId.RequestingUnitLaunchSilo;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination;
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            return ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return ActionPlanners_Constants.StateId.RequestingUnitLaunchSilo;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination;
            }

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else {
            throw Helpers_Misc.newError(`Unknown actionPlanner.`);
        }
    }

    public getNextStateIdOnDrag(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingUnitSiloDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, siloRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(siloRadius);
        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }
}
