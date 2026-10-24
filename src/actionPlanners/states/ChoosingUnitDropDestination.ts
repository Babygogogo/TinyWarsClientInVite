import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitDropDestination implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitDropDestination();

    public static getInstance(): ChoosingUnitDropDestination {
        return ChoosingUnitDropDestination._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitDropDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            if (HelpersMisc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            if ((actionPlanner.getAvailableDropDestinations() || []).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const focusUnit         = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
                const restLoadedUnits   = focusUnit.getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlannersConstants.StateId.RequestingUnitDrop;
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            if (HelpersMisc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            if (HelpersMisc.getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    }
                }

                return ActionPlannersConstants.StateId.RequestingUnitDrop;
            }

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else {
            throw HelpersMisc.newError(`Unknown actionPlanner.`);
        }
    }

    public getNextStateIdOnDrag(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearAvailableDropDestinations();

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingUnitDropDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, unitForDrop: UnitsIUnit.IUnit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setChoosingUnitForDrop(unitForDrop);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(unitForDrop, actionPlanner.getChosenDropDestinations()));
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }
}
