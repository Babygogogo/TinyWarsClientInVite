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

export class ChoosingUnitFlareDestination implements IState {
    private static readonly _instance = new ChoosingUnitFlareDestination();

    public static getInstance(): ChoosingUnitFlareDestination {
        return ChoosingUnitFlareDestination._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitFlareDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if (war instanceof getHrwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > getExisted(getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return StateId.ChoosingUnitAction;
            } else {
                return StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination))) {
                return StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return StateId.RequestingUnitLaunchFlare;
                } else {
                    return StateId.ChoosingUnitFlareDestination;
                }
            }

        } else if (war instanceof getRwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > getExisted(getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return StateId.ChoosingUnitAction;
            } else {
                return StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof getSpwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > getExisted(getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return StateId.RequestingUnitLaunchFlare;
                } else {
                    return StateId.ChoosingUnitFlareDestination;
                }
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
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingUnitFlareDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, flareRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(flareRadius);
        actionPlanner.setStateId(StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }
}
