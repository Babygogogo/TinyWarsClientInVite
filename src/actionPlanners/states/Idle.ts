import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as SinglePlayerWarModelSpwWar from "../../singlePlayerWar/model/SpwWar.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UnitsConstants from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;

export class Idle implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new Idle();

    public static getInstance(): Idle {
        return Idle._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.Idle;
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
                if (unit.checkHasWeapon()) {
                    return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                } else {
                    return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
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
                    if (unit.checkHasWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
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
                if (unit.checkHasWeapon()) {
                    return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                } else {
                    return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const turnManager       = war.getTurnManager();
            const playerIndexInTurn = turnManager.getPlayerIndexInTurn();

            if (((war as SinglePlayerWarModelSpwWar.SpwWar).getHumanPlayerIndexes().indexOf(playerIndexInTurn) < 0) ||
                (turnManager.getPhaseCode() !== TurnsConstants.PhaseCode.Main)
            ) {
                return ActionPlannersConstants.StateId.Idle;
            } else {
                const unit = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!unit) {
                    const tile = war.getTileMap().getTile(gridIndex);
                    if (tile.checkIsUnitProducerForPlayer(playerIndexInTurn)) {
                        return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                        } else {
                            return ActionPlannersConstants.StateId.Idle;
                        }
                    }
                } else {
                    if ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (playerIndexInTurn === unit.getPlayerIndex())) {
                        return ActionPlannersConstants.StateId.ChoosingUnitMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return ActionPlannersConstants.StateId.PreviewingUnitAttackableArea;
                        } else {
                            return ActionPlannersConstants.StateId.PreviewingUnitMovableArea;
                        }
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
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        this.apply(
            actionPlanner,
            actionPlanner.getStateId() === ActionPlannersConstants.StateId.Idle ? SoundsConstants.ShortSfxCode.CursorMove01 : void 0
        );
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        this.apply(actionPlanner);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`IdleState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, shortSfxCode?: SoundsConstants.ShortSfxCode): void {
        actionPlanner.clearAllDataForStates();

        if (shortSfxCode != null) {
            SoundsSoundPlayer.playShortSfx(shortSfxCode);

        } else {
            const stateId = actionPlanner.getStateId();
            if ((!actionPlanner.checkIsStateRequesting())   &&
                (stateId !== ActionPlannersConstants.StateId.Idle)                  &&
                (stateId !== ActionPlannersConstants.StateId.ExecutingAction)
            ) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            }
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.Idle);
        actionPlanner.updateView();
    }
}
