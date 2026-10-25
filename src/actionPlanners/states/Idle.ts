import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
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
import { newError } from "../../helpers/Misc.ts";
import type { SpwWar } from "../../singlePlayerWar/model/SpwWar.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { ActionStateId } from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex;

export class Idle implements IState {
    private static readonly _instance = new Idle();

    public static getInstance(): Idle {
        return Idle._instance;
    }

    public getStateId(): StateId {
        return StateId.Idle;
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
                if (unit.checkHasWeapon()) {
                    return StateId.PreviewingUnitAttackableArea;
                } else {
                    return StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof getMeWarClass()) {
            return StateId.Idle;

        } else if (war instanceof getMpwWarClass()) {
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
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
                    if (unit.checkHasWeapon()) {
                        return StateId.PreviewingUnitAttackableArea;
                    } else {
                        return StateId.PreviewingUnitMovableArea;
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
                if (unit.checkHasWeapon()) {
                    return StateId.PreviewingUnitAttackableArea;
                } else {
                    return StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof getSpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const playerIndexInTurn = turnManager.getPlayerIndexInTurn();

            if (((war as SpwWar).getHumanPlayerIndexes().indexOf(playerIndexInTurn) < 0) ||
                (turnManager.getPhaseCode() !== PhaseCode.Main)
            ) {
                return StateId.Idle;
            } else {
                const unit = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!unit) {
                    const tile = war.getTileMap().getTile(gridIndex);
                    if (tile.checkIsUnitProducerForPlayer(playerIndexInTurn)) {
                        return StateId.ChoosingTileProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return StateId.PreviewingTileAttackableArea;
                        } else {
                            return StateId.Idle;
                        }
                    }
                } else {
                    if ((unit.getActionState() === ActionStateId.Idle) && (playerIndexInTurn === unit.getPlayerIndex())) {
                        return StateId.ChoosingUnitMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return StateId.PreviewingUnitAttackableArea;
                        } else {
                            return StateId.PreviewingUnitMovableArea;
                        }
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
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: IActionPlanner): void {
        this.apply(
            actionPlanner,
            actionPlanner.getStateId() === StateId.Idle ? ShortSfxCode.CursorMove01 : void 0
        );
    }

    public doApplyOnDrag(actionPlanner: IActionPlanner): void {
        this.apply(actionPlanner);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`IdleState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: IActionPlanner, shortSfxCode?: ShortSfxCode): void {
        actionPlanner.clearAllDataForStates();

        if (shortSfxCode != null) {
            playShortSfx(shortSfxCode);

        } else {
            const stateId = actionPlanner.getStateId();
            if ((!actionPlanner.checkIsStateRequesting())   &&
                (stateId !== StateId.Idle)                  &&
                (stateId !== StateId.ExecutingAction)
            ) {
                playShortSfx(ShortSfxCode.ButtonCancel01);
            }
        }

        actionPlanner.setStateId(StateId.Idle);
        actionPlanner.updateView();
    }
}
