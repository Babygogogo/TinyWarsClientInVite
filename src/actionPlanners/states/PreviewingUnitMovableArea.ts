import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import { Idle } from "./Idle.ts";
import type { IState } from "./IState.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    getHrwWarClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { ActionStateId } from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex;

export class PreviewingUnitMovableArea implements IState {
    private static readonly _instance = new PreviewingUnitMovableArea();

    public static getInstance(): PreviewingUnitMovableArea {
        return PreviewingUnitMovableArea._instance;
    }

    public getStateId(): StateId {
        return StateId.PreviewingUnitMovableArea;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if (war instanceof getHrwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return StateId.PreviewingTileAttackableArea;
                    } else {
                        return StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return StateId.PreviewingUnitMovableArea;
                    } else {
                        return StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return StateId.PreviewingTileAttackableArea;
                    } else {
                        return StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === ActionStateId.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return StateId.PreviewingUnitMovableArea;
                    } else {
                        return StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof getRwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return StateId.PreviewingTileAttackableArea;
                    } else {
                        return StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return StateId.PreviewingUnitMovableArea;
                    } else {
                        return StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof getSpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return StateId.PreviewingTileAttackableArea;
                    } else {
                        return StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === ActionStateId.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return StateId.PreviewingUnitMovableArea;
                    } else {
                        return StateId.PreviewingUnitVisibleArea;
                    }
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
        Idle.getInstance().apply(actionPlanner, ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        actionPlanner.clearFocusUnitOnMap();
        actionPlanner.clearFocusUnitLoaded();
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearChosenUnitsForDrop();
        actionPlanner.clearAvailableDropDestinations();
        actionPlanner.clearCoActiveSkillSkillType();
        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
        actionPlanner.clearDataForPreviewingAttackableArea();
        actionPlanner.clearDataForPreviewingVisibleArea();

        actionPlanner.setUnitForPreviewingMovableArea(getExisted(actionPlanner.getWar().getUnitMap().getUnitOnMap(gridIndex)));
        actionPlanner.resetAreaForPreviewingMovableArea();

        actionPlanner.setStateId(StateId.PreviewingUnitMovableArea);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.CursorConfirm01);
    }

    public doApplyOnDrag(): void {
        // Nothing to do.
    }

    public doApplyOnDragEnded(): void {
        throw newError(`PreviewingUnitMovableAreaState: Not expected to apply on drag ended!`);
    }
}
