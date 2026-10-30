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
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";

export class ChoosingUnitAttackTarget implements IState {
    private static readonly _instance = new ChoosingUnitAttackTarget();

    public static getInstance(): ChoosingUnitAttackTarget {
        return ChoosingUnitAttackTarget._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitAttackTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if (war instanceof getHrwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return StateId.ChoosingUnitAction;
            } else {
                return StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return StateId.ChoosingUnitAction;
            } else {
                if (getExisted(war.getCursor().getPreviousGridIndex()).checkIsEqual(gridIndex)) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return StateId.RequestingUnitAttackUnit;
                    } else {
                        return StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return StateId.ChoosingUnitAttackTarget;
                }
            }

        } else if (war instanceof getRwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return StateId.ChoosingUnitAction;
            } else {
                return StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof getSpwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = war.getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (previousGridIndex.checkIsEqual(gridIndex))) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return StateId.RequestingUnitAttackUnit;
                    } else {
                        return StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return StateId.ChoosingUnitAttackTarget;
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
        const war = actionPlanner.getWar();
        war.getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitAttackTarget) {
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitAttackTarget) {
            // Nothing to do.
        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingUnitAttackTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setAttackableGridsForUnitWeapon(actionPlanner.createAttackableGridsForUnitWeapon());
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }
}
