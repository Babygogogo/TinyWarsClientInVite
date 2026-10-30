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

export class ChoosingUnitFlareDestination implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitFlareDestination();

    public static getInstance(): ChoosingUnitFlareDestination {
        return ChoosingUnitFlareDestination._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > Helpers_Misc.getExisted(Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > Helpers_Misc.getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return ActionPlanners_Constants.StateId.RequestingUnitLaunchFlare;
                } else {
                    return ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination;
                }
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > Helpers_Misc.getExisted(Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > Helpers_Misc.getExisted(Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return ActionPlanners_Constants.StateId.RequestingUnitLaunchFlare;
                } else {
                    return ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination;
                }
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
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingUnitFlareDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, flareRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(flareRadius);
        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }
}
