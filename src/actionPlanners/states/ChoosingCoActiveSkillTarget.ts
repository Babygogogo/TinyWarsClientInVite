import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import { Idle } from "./Idle.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import {
    getHrwWarClass,
    getRwWarClass,
    getMeWarClass,
    getTwWarClass,
    getMpwWarClass,
    getSpwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";

export class ChoosingCoActiveSkillTarget implements IState {
    private static readonly _instance = new ChoosingCoActiveSkillTarget();

    public static getInstance(): ChoosingCoActiveSkillTarget {
        return ChoosingCoActiveSkillTarget._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingCoActiveSkillTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof getHrwWarClass()) ||
            (war instanceof getRwWarClass())
        ) {
            return StateId.ChoosingCoActiveSkillTarget;

        } else if (
            (war instanceof getMeWarClass())  ||
            (war instanceof getTwWarClass())
        ) {
            return StateId.Idle;

        } else if (
            (war instanceof getMpwWarClass()) ||
            (war instanceof getSpwWarClass())
        ) {
            if (actionPlanner.getCoActiveSkillTypeId() == null) {
                return StateId.Idle;
            } else {
                const targetGridIndexArray      = actionPlanner.getCoActiveSkillTargetGridIndexArray() ?? [];
                const selectableTargetsCount    = actionPlanner.getMaxCoActiveSkillTargetsCount() ?? 0;
                if (targetGridIndexArray.length < selectableTargetsCount) {
                    return StateId.ChoosingCoActiveSkillTarget;
                } else {
                    const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                    if ((previousGridIndex != null)                                         &&
                        (previousGridIndex.checkIsEqual(gridIndex))                         &&
                        (targetGridIndexArray.some(v => v.checkIsEqual(previousGridIndex)))
                    ) {
                        return actionPlanner.getFocusUnitOnMap() ? StateId.RequestingUnitUseCoActiveSkill : StateId.RequestingPlayerUseCoActiveSkill;
                    } else {
                        return StateId.ChoosingCoActiveSkillTarget;
                    }
                }
            }

        } else {
            throw newError(`Invalid actionPlanner: ${actionPlanner}`);
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
        const arr = actionPlanner.getCoActiveSkillTargetGridIndexArray();
        if (arr?.length) {
            actionPlanner.deleteCoActiveSkillTargetGridIndex(arr[arr.length - 1]);
            actionPlanner.updateView();
            playShortSfx(ShortSfxCode.ButtonCancel01);
        } else {
            if (actionPlanner.getFocusUnitOnMap()) {
                actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getFocusUnitDestination());
                actionPlanner.clearCoActiveSkillSkillType();
                actionPlanner.clearCoActiveSkillTargetGridIndexArray();

                actionPlanner.setStateId(StateId.ChoosingUnitAction);
                actionPlanner.updateView();
                playShortSfx(ShortSfxCode.ButtonCancel01);
            } else {
                Idle.getInstance().apply(actionPlanner, ShortSfxCode.ButtonCancel01);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingCoActiveSkillTarget) {
            if (actionPlanner.checkHasCoActiveSkillTargetGridIndex(gridIndex)) {
                playShortSfx(ShortSfxCode.CursorMove01);
            } else {
                const maxTargetsCount = getExisted(actionPlanner.getMaxCoActiveSkillTargetsCount());
                if ((actionPlanner.getCoActiveSkillTargetGridIndexArray()?.length ?? 0) < maxTargetsCount) {
                    actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                    playShortSfx(ShortSfxCode.CursorConfirm01);
                } else {
                    if (maxTargetsCount !== 1) {
                        playShortSfx(ShortSfxCode.CursorMove01);
                    } else {
                        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
                        actionPlanner.addCoActiveSkillTargetGridIndex(gridIndex);
                        playShortSfx(ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingCoActiveSkillTarget) {
            // nothing to do

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[actionPlanner.getCoActiveSkillTypeId() === SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingCoActiveSkillTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, coSkillTypeId: SkillTypeId): void {
        const currState = actionPlanner.getStateId();
        if (currState !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currState}`);
        } else {
            actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        }

        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setStateId(StateId.ChoosingCoActiveSkillTarget);
        actionPlanner.updateView();
    }

    public doApplyOnTouchButton(actionPlanner: IActionPlanner, coSkillTypeId: SkillTypeId): void {
        const war = actionPlanner.getWar();
        const arr = war.getPlayerInTurn().getCoBasicCfg().getPowerSkillTargetsRadiusArray() ?? [];
        war.getCursor().getView().setTargetAreaRadius(arr[coSkillTypeId === SkillTypeId.Power ? 0 : 1] ?? 0);

        actionPlanner.setCoActiveSkillSkillType(coSkillTypeId);
        actionPlanner.setStateId(StateId.ChoosingCoActiveSkillTarget);

        actionPlanner.updateView();
    }
}
