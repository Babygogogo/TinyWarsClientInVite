import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { ActionStateId } from "../../units/Constants.ts";
import { getSelfSettingsIsSetPathMode } from "../../users/Model.ts";

export class ChoosingUnitAction implements IState {
    private static readonly _instance = new ChoosingUnitAction();

    public static getInstance(): ChoosingUnitAction {
        return ChoosingUnitAction._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return StateId.ChoosingUnitDropDestination;
        } else {
            // return State.MakingMovePath;
            const war               = actionPlanner.getWar();
            const existingUnit      = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            if (getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                if (!existingUnit) {
                    if (!getSelfSettingsIsSetPathMode()) {
                        return StateId.ChoosingUnitAction;
                    } else {
                        const previousGridIndex = war.getCursor().getPreviousGridIndex();
                        if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                            return StateId.ChoosingUnitAction;
                        } else {
                            return StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (existingUnit.getPlayerIndex() !== selfPlayerIndex) {
                        if (existingUnit.checkHasWeapon()) {
                            return StateId.PreviewingUnitAttackableArea;
                        } else {
                            return StateId.PreviewingUnitMovableArea;
                        }
                    } else {
                        const focusUnit = getExisted(actionPlanner.getFocusUnit());
                        if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                            return StateId.ChoosingUnitMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return StateId.ChoosingUnitAction;
                            } else {
                                if (existingUnit.getActionState() === ActionStateId.Idle) {
                                    return StateId.ChoosingUnitMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return StateId.PreviewingUnitAttackableArea;
                                    } else {
                                        return StateId.PreviewingUnitMovableArea;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (actionPlanner.checkCanFocusUnitOnMapAttackTarget(gridIndex)) {
                    const previousGridIndex = war.getCursor().getPreviousGridIndex();
                    if ((previousGridIndex == null) || (!gridIndex.checkIsEqual(previousGridIndex))) {
                        return StateId.ChoosingUnitMovePath;
                    } else {
                        if (getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                            if (existingUnit) {
                                return StateId.RequestingUnitAttackUnit;
                            } else {
                                return StateId.RequestingUnitAttackTile;
                            }
                        } else {
                            return StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        return StateId.ChoosingUnitAction;
                    } else {
                        if (!existingUnit) {
                            if (war.getTileMap().getTile(gridIndex).checkIsMapWeapon()) {
                                return StateId.PreviewingTileAttackableArea;
                            } else {
                                return StateId.Idle;
                            }
                        } else {
                            if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getActionState() === ActionStateId.Idle)) {
                                return StateId.ChoosingUnitMovePath;
                            } else {
                                if (existingUnit.checkHasWeapon()) {
                                    return StateId.PreviewingUnitAttackableArea;
                                } else {
                                    return StateId.PreviewingUnitMovableArea;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public getNextStateIdOnDrag(actionPlanner: IActionPlanner): StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return StateId.ChoosingUnitAction;
        } else {
            return StateId.ChoosingUnitMovePath;
        }
    }

    public getNextStateIdOnDragEnded(): StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: IActionPlanner): void {
        closePanel(getDict().BwUnitActionsPanel);

        if (actionPlanner.getChosenUnitsForDrop().length) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            actionPlanner.setStateId(StateId.ChoosingUnitDropDestination);
        } else {
            actionPlanner.setStateId(StateId.ChoosingUnitMovePath);
        }
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitMovePath) {
            if (getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                playShortSfx(ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearFocusUnitLoaded();
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                playShortSfx(ShortSfxCode.ButtonCancel01);
            }

        } else if (currState === StateId.ChoosingUnitAction) {
            if (getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                playShortSfx(ShortSfxCode.CursorConfirm01);
            } else {
                if (getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                    playShortSfx(ShortSfxCode.CursorConfirm01);
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        actionPlanner.clearFocusUnitLoaded();
                        actionPlanner.resetMovableArea();
                        actionPlanner.resetAttackableArea();
                        actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                        playShortSfx(ShortSfxCode.ButtonCancel01);
                    } else {
                        playShortSfx(ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else if (currState === StateId.ChoosingUnitAttackTarget) {
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else if (currState === StateId.ChoosingUnitCrushTarget) {
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else if (currState === StateId.ChoosingCoActiveSkillTarget) {
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else if (currState === StateId.ChoosingUnitDropDestination) {
            const shouldAddDrop = actionPlanner.getAvailableDropDestinations()?.some(g => g.checkIsEqual(gridIndex));
            if (shouldAddDrop) {
                actionPlanner.pushBackChosenUnitForDrop({
                    unit        : getExisted(actionPlanner.getChoosingUnitForDrop()),
                    destination : gridIndex,
                });
            }
            actionPlanner.clearChoosingUnitForDrop();
            actionPlanner.clearAvailableDropDestinations();
            playShortSfx(shouldAddDrop ? ShortSfxCode.CursorConfirm01 : ShortSfxCode.ButtonCancel01);

        } else if (currState === StateId.ChoosingUnitFlareDestination) {
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else if (currState === StateId.ChoosingUnitRepairTarget) {
            playShortSfx(ShortSfxCode.ButtonCancel01);

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitAction) {
            // Nothing to do.
        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === StateId.ChoosingUnitMovePath) {
            if (getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
            } else {
                throw newError(`currStateId: ${currStateId}`);
            }

        } else {
            throw newError(`currStateId: ${currStateId}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.CursorConfirm01);
    }
}
