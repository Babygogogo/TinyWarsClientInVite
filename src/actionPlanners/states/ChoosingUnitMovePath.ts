import {
    Units_Constants,
    Helpers_Misc,
    Users_Model,
    ActionPlanners_States_Idle,
    Sounds_SoundPlayer,
    Sounds_Constants,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    type Units_Unit,
} from "../../internal.ts";

export class ChoosingUnitMovePath implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingUnitMovePath();

    public static getInstance(): ChoosingUnitMovePath {
        return ChoosingUnitMovePath._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war           = actionPlanner.getWar();
        const existingUnit  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
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
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
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
                        if ((actionPlanner.checkCanControlUnit(existingUnit)) && (existingUnit.getActionState() === Units_Constants.ActionStateId.Idle)) {
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

    public getNextStateIdOnDrag(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        if (Helpers_Misc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
            const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(gridIndex);
            if (!existingUnit) {
                if (!Users_Model.getSelfSettingsIsSetPathMode()) {
                    return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                } else {
                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                }
            } else {
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                } else {
                    const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
                    if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                    } else {
                        if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                            return ActionPlanners_Constants.StateId.ChoosingUnitAction;
                        } else {
                            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                        }
                    }
                }
            }
        } else {
            return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const gridIndex = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex();
        actionPlanner.getWar().getCursor().setGridIndex(gridIndex);

        if (!actionPlanner.getFocusUnitLoaded()) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner, Sounds_Constants.ShortSfxCode.ButtonCancel01);

        } else {
            actionPlanner.clearFocusUnitLoaded();
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitAction);
            actionPlanner.updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currState = actionPlanner.getStateId();
        const war       = actionPlanner.getWar();
        const unitMap   = war.getUnitMap();

        if (currState === ActionPlanners_Constants.StateId.Idle) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            if (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            } else {
                const existingUnit = unitMap.getVisibleUnitOnMap(gridIndex);
                if ((existingUnit === actionPlanner.getFocusUnitOnMap()) && (actionPlanner.getFocusUnitLoaded())) {
                    // Nothing to do.
                } else {
                    // if ((!existingUnit) || (existingUnit.getPlayerIndex() !== this._getPlayerIndexLoggedIn())) {
                    //     this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                    // } else {
                    //     this._setFocusUnitOnMap(existingUnit);
                    //     this._clearFocusUnitLoaded();
                    //     this._resetMovableArea();
                    //     this._resetAttackableArea();
                    //     this._resetMovePathAsShortest(gridIndex);
                    // }
                    if (existingUnit) {
                        if (actionPlanner.checkCanControlUnit(existingUnit)) {
                            actionPlanner.setFocusUnitOnMap(existingUnit);
                            actionPlanner.clearFocusUnitLoaded();
                            actionPlanner.resetMovableArea();
                            actionPlanner.resetAttackableArea();
                            actionPlanner.resetMovePathAsShortest(gridIndex);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            if (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
            } else {
                const existingUnit = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
                if ((existingUnit === actionPlanner.getFocusUnitOnMap()) && (actionPlanner.getFocusUnitLoaded())) {
                    // Nothing to do.
                } else {
                    if (existingUnit) {
                        if (actionPlanner.checkCanControlUnit(existingUnit)) {
                            actionPlanner.setFocusUnitOnMap(existingUnit);
                            actionPlanner.clearFocusUnitLoaded();
                            actionPlanner.resetMovableArea();
                            actionPlanner.resetAttackableArea();
                            actionPlanner.resetMovePathAsShortest(gridIndex);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(Helpers_Misc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
            actionPlanner.setFocusUnitOnMap(Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else {
            throw Helpers_Misc.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = Helpers_Misc.getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(Helpers_Misc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = Helpers_Misc.getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(Helpers_Misc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else {
            throw Helpers_Misc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingUnitMovePathState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, unitForLaunch: Units_Unit.Unit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
        } else {
            if (actionPlanner.getFocusUnitLoaded()) {
                throw Helpers_Misc.newError(`Invalid currState: ${currStateId}`);
            } else {
                actionPlanner.setFocusUnitLoaded(unitForLaunch);
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(unitForLaunch.getGridIndex());
            }
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }
}
