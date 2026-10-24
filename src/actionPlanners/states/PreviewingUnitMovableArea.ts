import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import * as ActionPlannersStatesIdle from "./Idle.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UnitsConstants from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;

export class PreviewingUnitMovableArea implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new PreviewingUnitMovableArea();

    public static getInstance(): PreviewingUnitMovableArea {
        return PreviewingUnitMovableArea._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlannersConstants.StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlannersConstants.StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlannersConstants.StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlannersConstants.StateId.PreviewingUnitVisibleArea;
                    }
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
        ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner, SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        actionPlanner.clearFocusUnitOnMap();
        actionPlanner.clearFocusUnitLoaded();
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearChosenUnitsForDrop();
        actionPlanner.clearAvailableDropDestinations();
        actionPlanner.clearCoActiveSkillSkillType();
        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
        actionPlanner.clearDataForPreviewingAttackableArea();
        actionPlanner.clearDataForPreviewingVisibleArea();

        actionPlanner.setUnitForPreviewingMovableArea(HelpersMisc.getExisted(actionPlanner.getWar().getUnitMap().getUnitOnMap(gridIndex)));
        actionPlanner.resetAreaForPreviewingMovableArea();

        actionPlanner.setStateId(ActionPlannersConstants.StateId.PreviewingUnitMovableArea);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
    }

    public doApplyOnDrag(): void {
        // Nothing to do.
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`PreviewingUnitMovableAreaState: Not expected to apply on drag ended!`);
    }
}
