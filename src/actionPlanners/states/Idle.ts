import {
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Units_Constants,
    Helpers_Misc,
    Turns_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    SinglePlayerWar_Model_SpwWar,
} from "../../internal.ts";

export class Idle implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new Idle();

    public static getInstance(): Idle {
        return Idle._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.Idle;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.Idle;
                    }
                }
            } else {
                if (unit.checkHasWeapon()) {
                    return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                } else {
                    return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === Units_Constants.ActionStateId.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                } else {
                    if (unit.checkHasWeapon()) {
                        return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                    }
                }
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.Idle;
                    }
                }
            } else {
                if (unit.checkHasWeapon()) {
                    return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                } else {
                    return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                }
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const turnManager       = war.getTurnManager();
            const playerIndexInTurn = turnManager.getPlayerIndexInTurn();

            if (((war as SinglePlayerWar_Model_SpwWar.SpwWar).getHumanPlayerIndexes().indexOf(playerIndexInTurn) < 0) ||
                (turnManager.getPhaseCode() !== Turns_Constants.PhaseCode.Main)
            ) {
                return ActionPlanners_Constants.StateId.Idle;
            } else {
                const unit = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!unit) {
                    const tile = war.getTileMap().getTile(gridIndex);
                    if (tile.checkIsUnitProducerForPlayer(playerIndexInTurn)) {
                        return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                        } else {
                            return ActionPlanners_Constants.StateId.Idle;
                        }
                    }
                } else {
                    if ((unit.getActionState() === Units_Constants.ActionStateId.Idle) && (playerIndexInTurn === unit.getPlayerIndex())) {
                        return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea;
                        } else {
                            return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                        }
                    }
                }
            }

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else {
            throw Helpers_Misc.newError(`Unknown actionPlanner.`);
        }
    }

    public getNextStateIdOnDrag(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlanners_Constants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        this.apply(
            actionPlanner,
            actionPlanner.getStateId() === ActionPlanners_Constants.StateId.Idle ? Sounds_Constants.ShortSfxCode.CursorMove01 : void 0,
        );
    }

    public doApplyOnDrag(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        this.apply(actionPlanner);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`IdleState: Not expected to apply on drag ended!`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public apply(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, shortSfxCode?: Sounds_Constants.ShortSfxCode): void {
        actionPlanner.clearAllDataForStates();

        if (shortSfxCode != null) {
            Sounds_SoundPlayer.playShortSfx(shortSfxCode);

        } else {
            const stateId = actionPlanner.getStateId();
            if ((!actionPlanner.checkIsStateRequesting())   &&
                (stateId !== ActionPlanners_Constants.StateId.Idle)                  &&
                (stateId !== ActionPlanners_Constants.StateId.ExecutingAction)
            ) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            }
        }

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.Idle);
        actionPlanner.updateView();
    }
}
