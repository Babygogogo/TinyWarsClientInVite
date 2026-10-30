import {
    HalfwayReplayWar_Model_HrwWar,
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
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
} from "../../internal.ts";

export class PreviewingUnitMovableArea implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new PreviewingUnitMovableArea();

    public static getInstance(): PreviewingUnitMovableArea {
        return PreviewingUnitMovableArea._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
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
                if ((isSelfInTurn) && ((unit.getActionState() === Units_Constants.ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return ActionPlanners_Constants.StateId.Idle;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = actionPlanner.getPlayerIndexLoggedIn();
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
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
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
                if ((isSelfInTurn) && ((unit.getActionState() === Units_Constants.ActionStateId.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return ActionPlanners_Constants.StateId.ChoosingUnitMovePath;
                } else {
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
                    }
                }
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const turnManager       = war.getTurnManager();
            const unit              = war.getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = war.getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main);
            if (!unit) {
                const tile = war.getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
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
                    if (actionPlanner.getUnitForPreviewingMovableArea() !== unit) {
                        return ActionPlanners_Constants.StateId.PreviewingUnitMovableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
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
    public cancel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner, Sounds_Constants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        actionPlanner.clearFocusUnitOnMap();
        actionPlanner.clearFocusUnitLoaded();
        actionPlanner.clearChoosingUnitForDrop();
        actionPlanner.clearChosenUnitsForDrop();
        actionPlanner.clearAvailableDropDestinations();
        actionPlanner.clearCoActiveSkillSkillType();
        actionPlanner.clearCoActiveSkillTargetGridIndexArray();
        actionPlanner.clearDataForPreviewingAttackableArea();
        actionPlanner.clearDataForPreviewingVisibleArea();

        actionPlanner.setUnitForPreviewingMovableArea(Helpers_Misc.getExisted(actionPlanner.getWar().getUnitMap().getUnitOnMap(gridIndex)));
        actionPlanner.resetAreaForPreviewingMovableArea();

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.PreviewingUnitMovableArea);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
    }

    public doApplyOnDrag(): void {
        // Nothing to do.
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`PreviewingUnitMovableAreaState: Not expected to apply on drag ended!`);
    }
}
