import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitCrushTarget implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitCrushTarget();

    public static getInstance(): ChoosingUnitCrushTarget {
        return ChoosingUnitCrushTarget._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitCrushTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof GameHelpersGhFactory.getHrwWarClass()) ||
            (war instanceof GameHelpersGhFactory.getRwWarClass())
        ) {
            return ActionPlannersConstants.StateId.ChoosingUnitCrushTarget;
        }

        if ((war instanceof GameHelpersGhFactory.getMeWarClass()) ||
            (war instanceof GameHelpersGhFactory.getTwWarClass())
        ) {
            return ActionPlannersConstants.StateId.Idle;
        }

        const targetGridIndex = actionPlanner.getUnitCrushTargetGridIndex();
        if (targetGridIndex == null) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                return ActionPlannersConstants.StateId.ChoosingUnitCrushTarget;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            }
        } else {
            if (targetGridIndex.checkIsEqual(gridIndex)) {
                return ActionPlannersConstants.StateId.RequestingUnitCrushUnit;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitCrushTarget;
            }
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
        actionPlanner.clearUnitCrushTargetGridIndex();

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                actionPlanner.setUnitCrushTargetGridIndex(gridIndex);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearUnitCrushTargetGridIndex();
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
            }

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitCrushTarget);

        actionPlanner.updateView();
    }
}
