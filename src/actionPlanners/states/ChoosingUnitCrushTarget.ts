import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    getHrwWarClass,
    getRwWarClass,
    getMeWarClass,
    getTwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";

export class ChoosingUnitCrushTarget implements IState {
    private static readonly _instance = new ChoosingUnitCrushTarget();

    public static getInstance(): ChoosingUnitCrushTarget {
        return ChoosingUnitCrushTarget._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitCrushTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof getHrwWarClass()) ||
            (war instanceof getRwWarClass())
        ) {
            return StateId.ChoosingUnitCrushTarget;
        }

        if ((war instanceof getMeWarClass()) ||
            (war instanceof getTwWarClass())
        ) {
            return StateId.Idle;
        }

        const targetGridIndex = actionPlanner.getUnitCrushTargetGridIndex();
        if (targetGridIndex == null) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                return StateId.ChoosingUnitCrushTarget;
            } else {
                return StateId.ChoosingUnitAction;
            }
        } else {
            if (targetGridIndex.checkIsEqual(gridIndex)) {
                return StateId.RequestingUnitCrushUnit;
            } else {
                return StateId.ChoosingUnitCrushTarget;
            }
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
        actionPlanner.clearUnitCrushTargetGridIndex();

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === StateId.ChoosingUnitCrushTarget) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                actionPlanner.setUnitCrushTargetGridIndex(gridIndex);
                playShortSfx(ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearUnitCrushTargetGridIndex();
                playShortSfx(ShortSfxCode.CursorMove01);
            }

        } else {
            throw newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitCrushTarget) {
            // Nothing to do.

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner): void {
        actionPlanner.setStateId(StateId.ChoosingUnitCrushTarget);

        actionPlanner.updateView();
    }
}
