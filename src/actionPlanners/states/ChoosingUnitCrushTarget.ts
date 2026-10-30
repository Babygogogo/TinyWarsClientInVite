import {
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    ReplayWar_Model_RwWar,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    Sounds_SoundPlayer,
    Sounds_Constants,
} from "../../internal.ts";

export class ChoosingUnitCrushTarget implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitCrushTarget();

    public static getInstance(): ChoosingUnitCrushTarget {
        return ChoosingUnitCrushTarget._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) ||
            (war instanceof ReplayWar_Model_RwWar.RwWar)
        ) {
            return ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget;
        }

        if ((war instanceof MapEditor_Model_MeWar.MeWar) ||
            (war instanceof TestWar_Model_TwWar.TwWar)
        ) {
            return ActionPlanners_Constants.StateId.Idle;
        }

        const targetGridIndex = actionPlanner.getUnitCrushTargetGridIndex();
        if (targetGridIndex == null) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                return ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            }
        } else {
            if (targetGridIndex.checkIsEqual(gridIndex)) {
                return ActionPlanners_Constants.StateId.RequestingUnitCrushUnit;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget;
            }
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
        actionPlanner.clearUnitCrushTargetGridIndex();

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            if (actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex))) {
                actionPlanner.setUnitCrushTargetGridIndex(gridIndex);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearUnitCrushTargetGridIndex();
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
            }

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            // Nothing to do.

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget);

        actionPlanner.updateView();
    }
}
