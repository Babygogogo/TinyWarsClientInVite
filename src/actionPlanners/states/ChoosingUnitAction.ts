import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitAction implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitAction();

    public static getInstance(): ChoosingUnitAction {
        return ChoosingUnitAction._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return ActionPlannersConstants.StateId.ChoosingUnitDropDestination;
        } else {
            // return State.MakingMovePath;
            const war               = actionPlanner.getWar();
            const existingUnit      = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            if (HelpersMisc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                if (!existingUnit) {
                    if (!UsersModel.getSelfSettingsIsSetPathMode()) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    } else {
                        const previousGridIndex = war.getCursor().getPreviousGridIndex();
                        if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                            return ActionPlannersConstants.StateId.ChoosingUnitAction;
                        } else {
                            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (existingUnit.getPlayerIndex() !== selfPlayerIndex) {
                        if (existingUnit.checkHasWeapon()) {
                            return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                        } else {
                            return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                        }
                    } else {
                        const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
                        if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return ActionPlannersConstants.StateId.ChoosingUnitAction;
                            } else {
                                if (existingUnit.getActionState() === UnitsConstants.ActionStateId.Idle) {
                                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                                    } else {
                                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
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
                        return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                    } else {
                        if (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                            if (existingUnit) {
                                return ActionPlannersConstants.StateId.RequestingUnitAttackUnit;
                            } else {
                                return ActionPlannersConstants.StateId.RequestingUnitAttackTile;
                            }
                        } else {
                            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        return ActionPlannersConstants.StateId.ChoosingUnitAction;
                    } else {
                        if (!existingUnit) {
                            if (war.getTileMap().getTile(gridIndex).checkIsMapWeapon()) {
                                return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                            } else {
                                return ActionPlannersConstants.StateId.Idle;
                            }
                        } else {
                            if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getActionState() === UnitsConstants.ActionStateId.Idle)) {
                                return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                            } else {
                                if (existingUnit.checkHasWeapon()) {
                                    return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                                } else {
                                    return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public getNextStateIdOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): ActionPlannersConstants.StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return ActionPlannersConstants.StateId.ChoosingUnitAction;
        } else {
            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
        }
    }

    public getNextStateIdOnDragEnded(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitActionsPanel);

        if (actionPlanner.getChosenUnitsForDrop().length) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitDropDestination);
        } else {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitMovePath);
        }
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            if (HelpersMisc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearFocusUnitLoaded();
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            }

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            if (HelpersMisc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
            } else {
                if (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        actionPlanner.clearFocusUnitLoaded();
                        actionPlanner.resetMovableArea();
                        actionPlanner.resetAttackableArea();
                        actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
                    } else {
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            const shouldAddDrop = actionPlanner.getAvailableDropDestinations()?.some(g => g.checkIsEqual(gridIndex));
            if (shouldAddDrop) {
                actionPlanner.pushBackChosenUnitForDrop({
                    unit        : HelpersMisc.getExisted(actionPlanner.getChoosingUnitForDrop()),
                    destination : gridIndex,
                });
            }
            actionPlanner.clearChoosingUnitForDrop();
            actionPlanner.clearAvailableDropDestinations();
            SoundsSoundPlayer.playShortSfx(shouldAddDrop ? SoundsConstants.ShortSfxCode.CursorConfirm01 : SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            // Nothing to do.
        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            if (HelpersMisc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
            } else {
                throw HelpersMisc.newError(`currStateId: ${currStateId}`);
            }

        } else {
            throw HelpersMisc.newError(`currStateId: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
    }
}
