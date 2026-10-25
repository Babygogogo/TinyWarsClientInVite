import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import { Idle } from "./Idle.ts";
import type { IState } from "./IState.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { ActionStateId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { getSelfSettingsIsSetPathMode } from "../../users/Model.ts";

type GridIndex              = AuxiliaryTypesGridIndex;

export class ChoosingUnitMovePath implements IState {
    private static readonly _instance = new ChoosingUnitMovePath();

    public static getInstance(): ChoosingUnitMovePath {
        return ChoosingUnitMovePath._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingUnitMovePath;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war           = actionPlanner.getWar();
        const existingUnit  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
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
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
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
                        if ((actionPlanner.checkCanControlUnit(existingUnit)) && (existingUnit.getActionState() === ActionStateId.Idle)) {
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

    public getNextStateIdOnDrag(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        if (getExisted(actionPlanner.getMovableArea()).checkHasGridByGridIndex(gridIndex)) {
            const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(gridIndex);
            if (!existingUnit) {
                if (!getSelfSettingsIsSetPathMode()) {
                    return StateId.ChoosingUnitAction;
                } else {
                    return StateId.ChoosingUnitMovePath;
                }
            } else {
                if (!actionPlanner.checkCanControlUnit(existingUnit)) {
                    return StateId.ChoosingUnitMovePath;
                } else {
                    const focusUnit = getExisted(actionPlanner.getFocusUnit());
                    if ((focusUnit === actionPlanner.getFocusUnitLoaded()) && (gridIndex.checkIsEqual(focusUnit.getGridIndex()))) {
                        return StateId.ChoosingUnitMovePath;
                    } else {
                        if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                            return StateId.ChoosingUnitAction;
                        } else {
                            return StateId.ChoosingUnitMovePath;
                        }
                    }
                }
            }
        } else {
            return StateId.ChoosingUnitMovePath;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(actionPlanner: IActionPlanner): void {
        const gridIndex = getExisted(actionPlanner.getFocusUnitOnMap()).getGridIndex();
        actionPlanner.getWar().getCursor().setGridIndex(gridIndex);

        if (!actionPlanner.getFocusUnitLoaded()) {
            Idle.getInstance().apply(actionPlanner, ShortSfxCode.ButtonCancel01);

        } else {
            actionPlanner.clearFocusUnitLoaded();
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);

            actionPlanner.setStateId(StateId.ChoosingUnitAction);
            actionPlanner.updateView();
            playShortSfx(ShortSfxCode.ButtonCancel01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        const war       = actionPlanner.getWar();
        const unitMap   = war.getUnitMap();

        if (currState === StateId.Idle) {
            actionPlanner.setFocusUnitOnMap(getExisted(unitMap.getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (currState === StateId.ChoosingUnitMovePath) {
            if (getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                playShortSfx(ShortSfxCode.CursorConfirm01);
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
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === StateId.ChoosingUnitAction) {
            if (getExisted(actionPlanner.getFocusUnit()).checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                playShortSfx(ShortSfxCode.CursorConfirm01);
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
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        }
                    } else {
                        if (war.getTileMap().getTile(gridIndex).getMaxHp() != null) {
                            actionPlanner.resetMovePathAsShortest(getExisted(actionPlanner.getAttackableArea()?.getDataByGridIndex(gridIndex)).movePathDestination);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        } else {
                            actionPlanner.updateMovePathByDestination(gridIndex);
                            playShortSfx(ShortSfxCode.CursorConfirm01);
                        }
                    }
                }
            }

        } else if (currState === StateId.ChoosingTileProductionTarget) {
            actionPlanner.setFocusUnitOnMap(getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (currState === StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setFocusUnitOnMap(getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (currState === StateId.PreviewingUnitMovableArea) {
            actionPlanner.setFocusUnitOnMap(getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (currState === StateId.PreviewingUnitVisibleArea) {
            actionPlanner.setFocusUnitOnMap(getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingMovableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (currState === StateId.PreviewingTileAttackableArea) {
            actionPlanner.setFocusUnitOnMap(getExisted(war.getUnitMap().getUnitOnMap(gridIndex)));
            actionPlanner.resetMovableArea();
            actionPlanner.resetAttackableArea();
            actionPlanner.resetMovePathAsShortest(gridIndex);
            actionPlanner.clearDataForPreviewingAttackableArea();
            actionPlanner.clearDataForPreviewingVisibleArea();
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else {
            throw newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const currState = actionPlanner.getStateId();
        if (currState === StateId.ChoosingUnitMovePath) {
            const focusUnit = getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else if (currState === StateId.ChoosingUnitAction) {
            const focusUnit = getExisted(actionPlanner.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                // Do nothing.
            } else {
                const movableArea = getExisted(actionPlanner.getMovableArea());
                if (movableArea.checkHasGridByGridIndex(gridIndex)) {
                    actionPlanner.updateMovePathByDestination(gridIndex);
                } else {
                    const attackableArea = getExisted(actionPlanner.getAttackableArea());
                    if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
                        // Do nothing.
                    } else {
                        const newPath = movableArea.createShortestMovePath(getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination));
                        if (focusUnit.checkCanAttackTargetAfterMovePath(newPath.map(v => v.getGridIndex()), gridIndex)) {
                            actionPlanner.setMovePath(newPath);
                        } else {
                            // Do nothing.
                        }
                    }
                }
            }

        } else {
            throw newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingUnitMovePathState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, unitForLaunch: IUnit): void {
        const currStateId = actionPlanner.getStateId();
        if (currStateId !== StateId.ChoosingUnitAction) {
            throw newError(`Invalid currState: ${currStateId}`);
        } else {
            if (actionPlanner.getFocusUnitLoaded()) {
                throw newError(`Invalid currState: ${currStateId}`);
            } else {
                actionPlanner.setFocusUnitLoaded(unitForLaunch);
                actionPlanner.resetMovableArea();
                actionPlanner.resetAttackableArea();
                actionPlanner.resetMovePathAsShortest(unitForLaunch.getGridIndex());
            }
        }

        actionPlanner.setStateId(StateId.ChoosingUnitMovePath);
        actionPlanner.updateView();
    }
}
