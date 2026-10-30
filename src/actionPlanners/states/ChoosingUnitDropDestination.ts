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
    type Units_IUnit,
} from "../../internal.ts";

export class ChoosingUnitDropDestination implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitDropDestination();

    public static getInstance(): ChoosingUnitDropDestination {
        return ChoosingUnitDropDestination._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitDropDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            if (Helpers_Misc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            if ((actionPlanner.getAvailableDropDestinations() || []).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const focusUnit         = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
                const restLoadedUnits   = focusUnit.getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlanners_Constants.StateId.RequestingUnitDrop;
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            if (Helpers_Misc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            if (Helpers_Misc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlanners_Constants.StateId.RequestingUnitDrop;
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
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearAvailableDropDestinations();

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingUnitDropDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, unitForDrop: Units_IUnit.IUnit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setChoosingUnitForDrop(unitForDrop);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(unitForDrop, actionPlanner.getChosenDropDestinations()));
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }
}
