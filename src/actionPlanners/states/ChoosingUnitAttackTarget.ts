import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitAttackTarget implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitAttackTarget();

    public static getInstance(): ChoosingUnitAttackTarget {
        return ChoosingUnitAttackTarget._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitAttackTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                if (HelpersMisc.getExisted(war.getCursor().getPreviousGridIndex()).checkIsEqual(gridIndex)) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return ActionPlannersConstants.StateId.RequestingUnitAttackUnit;
                    } else {
                        return ActionPlannersConstants.StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return ActionPlannersConstants.StateId.ChoosingUnitAttackTarget;
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitAttackTarget;
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            if (!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex)) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = war.getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (previousGridIndex.checkIsEqual(gridIndex))) {
                    if (war.getUnitMap().getUnitOnMap(gridIndex)) {
                        return ActionPlannersConstants.StateId.RequestingUnitAttackUnit;
                    } else {
                        return ActionPlannersConstants.StateId.RequestingUnitAttackTile;
                    }
                } else {
                    return ActionPlannersConstants.StateId.ChoosingUnitAttackTarget;
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else {
            throw HelpersMisc.newError(`Unknown actionPlanner.`);
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
        const war = actionPlanner.getWar();
        war.getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            // Nothing to do.
        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingUnitAttackTargetState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
        } else {
            actionPlanner.setAttackableGridsForUnitWeapon(actionPlanner.createAttackableGridsForUnitWeapon());
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAttackTarget);
        actionPlanner.updateView();
    }
}
