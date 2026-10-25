import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    getHrwWarClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import type { IUnit } from "../../units/IUnit.ts";

export class ChoosingUnitDropDestination implements IState {
    private static readonly _instance = new ChoosingUnitDropDestination();

    public static getInstance(): ChoosingUnitDropDestination {
        return ChoosingUnitDropDestination._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitDropDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if (war instanceof getHrwWarClass()) {
            if (getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return StateId.ChoosingUnitAction;
                    }
                }

                return StateId.ChoosingUnitAction;
            }

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            if ((actionPlanner.getAvailableDropDestinations() || []).every(g => !g.checkIsEqual(gridIndex))) {
                return StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const focusUnit         = getExisted(actionPlanner.getFocusUnit());
                const restLoadedUnits   = focusUnit.getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return StateId.ChoosingUnitAction;
                    }
                }

                return StateId.RequestingUnitDrop;
            }

        } else if (war instanceof getRwWarClass()) {
            if (getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return StateId.ChoosingUnitAction;
                    }
                }

                return StateId.ChoosingUnitAction;
            }

        } else if (war instanceof getSpwWarClass()) {
            if (getExisted(actionPlanner.getAvailableDropDestinations()).every(g => !g.checkIsEqual(gridIndex))) {
                return StateId.ChoosingUnitAction;
            } else {
                const chosenUnits               = [actionPlanner.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = getExisted(actionPlanner.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return StateId.ChoosingUnitAction;
                    }
                }

                return StateId.RequestingUnitDrop;
            }

        } else if (war instanceof getTwWarClass()) {
            return StateId.Idle;

        } else {
            throw newError(`Unknown actionPlanner.`);
        }
    }

    public getNextStateIdOnDrag(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: IActionPlanner): void {
        actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearAvailableDropDestinations();

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitAction) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitDropDestination) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingUnitDropDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, unitForDrop: IUnit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setChoosingUnitForDrop(unitForDrop);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(unitForDrop, actionPlanner.getChosenDropDestinations()));
        }

        actionPlanner.setStateId(StateId.ChoosingUnitDropDestination);
        actionPlanner.updateView();
    }
}
