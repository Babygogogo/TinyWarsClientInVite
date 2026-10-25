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
import { newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";

export class ChoosingUnitSiloDestination implements IState {
    private static readonly _instance = new ChoosingUnitSiloDestination();

    public static getInstance(): ChoosingUnitSiloDestination {
        return ChoosingUnitSiloDestination._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitSiloDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if (war instanceof getHrwWarClass()) {
            return StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return StateId.RequestingUnitLaunchSilo;
            } else {
                return StateId.ChoosingUnitSiloDestination;
            }

        } else if (war instanceof getRwWarClass()) {
            return StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof getSpwWarClass()) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return StateId.RequestingUnitLaunchSilo;
            } else {
                return StateId.ChoosingUnitSiloDestination;
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

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingUnitSiloDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, siloRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(siloRadius);
        actionPlanner.setStateId(StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }
}
