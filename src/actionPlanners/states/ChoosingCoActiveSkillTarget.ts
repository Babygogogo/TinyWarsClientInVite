import {
    HalfwayReplayWar_Model_HrwWar,
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    CoSkills_Constants,
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

export class ChoosingCoActiveSkillTarget implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingCoActiveSkillTarget();

    public static getInstance(): ChoosingCoActiveSkillTarget {
        return ChoosingCoActiveSkillTarget._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) ||
            (war instanceof ReplayWar_Model_RwWar.RwWar)
        ) {
            return ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget;

        } else if (
            (war instanceof MapEditor_Model_MeWar.MeWar)  ||
            (war instanceof TestWar_Model_TwWar.TwWar)
        ) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (
            (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) ||
            (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar)
        ) {
            if (actionPlanner.getCoActiveSkillTypeId() == null) {
                return ActionPlanners_Constants.StateId.Idle;
            } else {
                const targetGridIndexArray      = actionPlanner.getCoActiveSkillTargetGridIndexArray() ?? [];
                const selectableTargetsCount    = actionPlanner.getMaxCoActiveSkillTargetsCount() ?? 0;
                if (targetGridIndexArray.length < selectableTargetsCount) {
                    return ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget;
                } else {
                    const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                    if ((previousGridIndex != null)                                         &&
                        (previousGridIndex.checkIsEqual(gridIndex))                         &&
                        (targetGridIndexArray.some(v => v.checkIsEqual(previousGridIndex)))
                    ) {
                        return actionPlanner.getFocusUnitOnMap() ? ActionPlanners_Constants.StateId.RequestingUnitUseCoActiveSkill : ActionPlanners_Constants.StateId.RequestingPlayerUseCoActiveSkill;
                    } else {
                        return ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget;
                    }
                }
            }

        } else {
            throw Helpers_Misc.newError(`Invalid actionPlanner: ${actionPlanner}`);
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
        const arr = actionPlanner.getCoActiveSkillTargetGridIndexArray();
        if (arr?.length) {
            actionPlanner.deleteCoActiveSkillTargetGridIndex(arr[arr.length - 1]);
            actionPlanner.updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
        } else {
            if (actionPlanner.getFocusUnitOnMap()) {
                actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getFocusUnitDestination());
                actionPlanner.clearCoActiveSkillSkillType();
                actionPlanner.clearCoActiveSkillTargetGridIndexArray();

                actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
                actionPlanner.updateView();
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            } else {
                ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner, Sounds_Constants.ShortSfxCode.ButtonCancel01);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            if (actionPlanner.checkHasCoActiveSkillTargetGridIndex(gridIndex)) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
            } else {
                const maxTargetsCount = Helpers_Misc.getExisted(actionPlanner.getMaxCoActiveSkillTargetsCount());
                if ((actionPlanner.getCoActiveSkillTargetGridIndexArray()?.length ?? 0) < maxTargetsCount) {
                    actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                } else {
                    if (maxTargetsCount !== 1) {
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
                    } else {
                        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
                        actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray();
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === CoSkills_Constants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            // nothing to do

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray();
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === CoSkills_Constants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingCoActiveSkillTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, coSkillTypeId: CoSkills_Constants.SkillTypeId): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        } else {
            actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray();
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === CoSkills_Constants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnTouchButton(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, coSkillTypeId: CoSkills_Constants.SkillTypeId): void {
        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray();
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === CoSkills_Constants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget);

        actionPlanner.updateView();
    }
}
