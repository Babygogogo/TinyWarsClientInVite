import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import * as ActionPlannersStatesIdle from "./Idle.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingCoActiveSkillTarget implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingCoActiveSkillTarget();

    public static getInstance(): ChoosingCoActiveSkillTarget {
        return ChoosingCoActiveSkillTarget._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof GameHelpersGhFactory.getHrwWarClass()) ||
            (war instanceof GameHelpersGhFactory.getRwWarClass())
        ) {
            return ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget;

        } else if (
            (war instanceof GameHelpersGhFactory.getMeWarClass())  ||
            (war instanceof GameHelpersGhFactory.getTwWarClass())
        ) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (
            (war instanceof GameHelpersGhFactory.getMpwWarClass()) ||
            (war instanceof GameHelpersGhFactory.getSpwWarClass())
        ) {
            if (actionPlanner.getCoActiveSkillTypeId() == null) {
                return ActionPlannersConstants.StateId.Idle;
            } else {
                const targetGridIndexArray      = actionPlanner.getCoActiveSkillTargetGridIndexArray() ?? [];
                const selectableTargetsCount    = actionPlanner.getMaxCoActiveSkillTargetsCount() ?? 0;
                if (targetGridIndexArray.length < selectableTargetsCount) {
                    return ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget;
                } else {
                    const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                    if ((previousGridIndex != null)                                         &&
                        (previousGridIndex.checkIsEqual(gridIndex))                         &&
                        (targetGridIndexArray.some(v => v.checkIsEqual(previousGridIndex)))
                    ) {
                        return actionPlanner.getFocusUnitOnMap() ? ActionPlannersConstants.StateId.RequestingUnitUseCoActiveSkill : ActionPlannersConstants.StateId.RequestingPlayerUseCoActiveSkill;
                    } else {
                        return ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget;
                    }
                }
            }

        } else {
            throw HelpersMisc.newError(`Invalid actionPlanner: ${actionPlanner}`);
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
        const arr = actionPlanner.getCoActiveSkillTargetGridIndexArray();
        if (arr?.length) {
            actionPlanner.deleteCoActiveSkillTargetGridIndex(arr[arr.length - 1]);
            actionPlanner.updateView();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
        } else {
            if (actionPlanner.getFocusUnitOnMap()) {
                actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getFocusUnitDestination());
                actionPlanner.clearCoActiveSkillSkillType();
                actionPlanner.clearCoActiveSkillTargetGridIndexArray();

                actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
                actionPlanner.updateView();
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            } else {
                ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner, SoundsConstants.ShortSfxCode.ButtonCancel01);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            if (actionPlanner.checkHasCoActiveSkillTargetGridIndex(gridIndex)) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
            } else {
                const maxTargetsCount = HelpersMisc.getExisted(actionPlanner.getMaxCoActiveSkillTargetsCount());
                if ((actionPlanner.getCoActiveSkillTargetGridIndexArray()?.length ?? 0) < maxTargetsCount) {
                    actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                } else {
                    if (maxTargetsCount !== 1) {
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
                    } else {
                        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
                        actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === CoSkillsConstants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            // nothing to do

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === CoSkillsConstants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingCoActiveSkillTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, coSkillTypeId: CoSkillsConstants.SkillTypeId): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        } else {
            actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === CoSkillsConstants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnTouchButton(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, coSkillTypeId: CoSkillsConstants.SkillTypeId): void {
        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === CoSkillsConstants.SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget);

        actionPlanner.updateView();
    }
}
