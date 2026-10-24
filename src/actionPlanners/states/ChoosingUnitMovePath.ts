import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import * as ActionPlannersStatesIdle from "./Idle.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UsersModel from "../../users/Model.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitMovePath implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitMovePath();

    public static getInstance(): ChoosingUnitMovePath {
        return ChoosingUnitMovePath._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war           = actionPlanner.getWar();
        const existingUnit  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
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
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
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
                        if ((actionPlanner.checkCanControlUnit(existingUnit)) && (existingUnit.getActionState() === UnitsConstants.ActionStateId.Idle)) {
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

    public getNextStateIdOnDrag(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        if (HelpersMisc.getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
            const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(gridIndex);
            if (!existingUnit) {
                if (!UsersModel.getSelfSettingsIsSetPathMode()) {
                    return ActionPlannersConstants.StateId.ChoosingUnitAction;
                } else {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                }
            } else {
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                } else {
                    const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
                    if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                        return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                    } else {
                        if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                            return ActionPlannersConstants.StateId.ChoosingUnitAction;
                        } else {
                            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                        }
                    }
                }
            }
        } else {
            return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const gridIndex = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex();
        actionPlanner.getWar().getCursor().setGridIndex(gridIndex);

        if (!actionPlanner.getFocusUnitLoaded()) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner, SoundsConstants.ShortSfxCode.ButtonCancel01);

        } else {
            actionPlanner.clearFocusUnitLoaded();
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);

            actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
            actionPlanner.updateView();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        const war       = actionPlanner.getWar();
        const unitMap   = war.getUnitMap();

        if (currState === ActionPlannersConstants.StateId.Idle) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(unitMap.getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            if (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
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
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            if (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
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
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(HelpersMisc.getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else if (currState === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            actionPlanner.setFocusUnitOnMap(HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);

        } else {
            throw HelpersMisc.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = HelpersMisc.getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = HelpersMisc.getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(HelpersMisc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = HelpersMisc.getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = HelpersMisc.getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(HelpersMisc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingUnitMovePathState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, unitForLaunch: UnitsIUnit.IUnit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
        } else {
            if (actionPlanner.getFocusUnitLoaded()) {
                throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
            } else {
                actionPlanner.setFocusUnitLoaded(unitForLaunch);
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(unitForLaunch.getGridIndex());
            }
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }
}
