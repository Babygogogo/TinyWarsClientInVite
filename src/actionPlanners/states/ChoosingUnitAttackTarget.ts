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

export class ChoosingUnitAttackTarget implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitAttackTarget();

    public static getInstance(): ChoosingUnitAttackTarget {
        return ChoosingUnitAttackTarget._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                if (Helpers_Misc.getExisted(war.getCursor().getPreviousGridIndex()).checkIsEqual(gridIndex)) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return ActionPlanners_Constants.StateId.RequestingUnitAttackUnit;
                    } else {
                        return ActionPlanners_Constants.StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget;
                }
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = war.getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (previousGridIndex.checkIsEqual(gridIndex))) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return ActionPlanners_Constants.StateId.RequestingUnitAttackUnit;
                    } else {
                        return ActionPlanners_Constants.StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget;
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
        const war = actionPlanner.getWar();
        war.getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            // Nothing to do.
        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingUnitAttackTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setAttackableGridsForUnitWeapon(actionPlanner.createAttackableGridsForUnitWeapon());
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }
}
