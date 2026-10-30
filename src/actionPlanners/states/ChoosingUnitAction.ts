import {
    Units_Constants,
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Sounds_SoundPlayer,
    Sounds_Constants,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
} from "../../internal.ts";

export class ChoosingUnitAction implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitAction();

    public static getInstance(): ChoosingUnitAction {
        return ChoosingUnitAction._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return ActionPlanners_Constants.StateId.ChoosingUnitDropDestination;
        } else {
            // return State.MakingMovePath;
            const war               = actionPlanner.getWar();
            const existingUnit      = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            if (Helpers_Misc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                if (!existingUnit) {
                    if (!Users_Model.getSelfSettingsIsSetPathMode()) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    } else {
                        const previousGridIndex = war.getCursor().getPreviousGridIndex();
                        if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                            return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                        } else {
                            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (existingUnit.getPlayerIndex() !== selfPlayerIndex) {
                        if (existingUnit.checkHasWeapon()) {
                            return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                        } else {
                            return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                        }
                    } else {
                        const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
                        if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                            } else {
                                if (existingUnit.getActionState() === Units_Constants.ActionStateId.Idle) {
                                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                                    } else {
                                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
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
                        return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                    } else {
                        if (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                            if (existingUnit) {
                                return ActionPlanners_Constants.StateId.RequestingUnitAttackUnit;
                            } else {
                                return ActionPlanners_Constants.StateId.RequestingUnitAttackTile;
                            }
                        } else {
                            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                        }
                    }
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                    } else {
                        if (!existingUnit) {
                            if (war.getTileMap().getTile(gridIndex).checkIsMapWeapon()) {
                                return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                            } else {
                                return ActionPlanners_Constants.StateId.Idle;
                            }
                        } else {
                            if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getActionState() === Units_Constants.ActionStateId.Idle)) {
                                return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                            } else {
                                if (existingUnit.checkHasWeapon()) {
                                    return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                                } else {
                                    return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public getNextStateIdOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): ActionPlanners_Constants.StateId {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            return ActionPlanners_Constants.StateId.ChoosingUnitAction;
        } else {
            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
        }
    }

    public getNextStateIdOnDragEnded(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitActionsPanel);

        if (actionPlanner.getChosenUnitsForDrop().length) {
            const data = actionPlanner.popBackChosenUnitForDrop();
            actionPlanner.setChoosingUnitForDrop(data.unit);
            actionPlanner.setAvailableDropDestinations(actionPlanner.calculateAvailableDropDestination(data.unit, actionPlanner.getChosenDropDestinations()));
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitDropDestination);
        } else {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitMovePath);
        }
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            if (Helpers_Misc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            } else {
                actionPlanner.clearFocusUnitLoaded();
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            }

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            if (Helpers_Misc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            } else {
                if (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                } else {
                    if (actionPlanner.getFocusUnitLoaded()) {
                        actionPlanner.clearFocusUnitLoaded();
                        actionPlanner.resetMovableArea();
                        actionPlanner.resetAttackableArea();
                        actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex());
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
                    } else {
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                    }
                }
            }

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            const shouldAddDrop = actionPlanner.getAvailableDropDestinations()?.some(g => g.checkIsEqual(gridIndex));
            if (shouldAddDrop) {
                actionPlanner.pushBackChosenUnitForDrop({
                    unit        : Helpers_Misc.getExisted(actionPlanner.getChoosingUnitForDrop()),
                    destination : gridIndex,
                });
            }
            actionPlanner.clearChoosingUnitForDrop();
            actionPlanner.clearAvailableDropDestinations();
            Sounds_SoundPlayer.playShortSfx(shouldAddDrop ? Sounds_Constants.ShortSfxCode.CursorConfirm01 : Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            // Nothing to do.
        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            if (Helpers_Misc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
                actionPlanner.updateMovePathByDestination(gridIndex);
            } else {
                throw Helpers_Misc.newError(`currStateId: ${currStateId}`);
            }

        } else {
            throw Helpers_Misc.newError(`currStateId: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
    }
}
