import {
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Units_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    GamePanels_Manager,
    Turns_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
} from "../../internal.ts";

export class ChoosingTileProductionTarget implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new ChoosingTileProductionTarget();

    public static getInstance(): ChoosingTileProductionTarget {
        return ChoosingTileProductionTarget._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): ActionPlanners_Constants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof MapEditor_Model_MeWar.MeWar) ||
            (war instanceof TestWar_Model_TwWar.TwWar)
        ) {
            return ActionPlanners_Constants.StateId.Idle;
        }

        const selfPlayerIndexSet    = actionPlanner.getSelfPlayerIndexSet();
        const turnManager           = war.getTurnManager();
        const isSelfInTurn          = (selfPlayerIndexSet.has(turnManager.getPlayerIndexInTurn())) && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main);
        const tile                  = war.getTileMap().getTile(gridIndex);
        const unit                  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);

        if (war.getCursor().getPreviousGridIndex()?.checkIsEqual(gridIndex)) {
            return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
        } else {
            if (!unit) {
                if ((isSelfInTurn)                                                              &&
                    ([...selfPlayerIndexSet].some(v => tile.checkIsUnitProducerForPlayer(v)))
                ) {
                    return ActionPlanners_Constants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlanners_Constants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlanners_Constants.StateId.Idle;
                    }
                }

            } else {
                if ((isSelfInTurn)                                      &&
                    (unit.getActionState() === Units_Constants.ActionStateId.Idle)  &&
                    (selfPlayerIndexSet.has(unit.getPlayerIndex()))
                ) {
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
    }

    public getNextStateIdOnDrag(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.Idle;
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
        actionPlanner.clearAllDataForStates();
        actionPlanner.setStateId(ActionPlanners_Constants.StateId.ChoosingTileProductionTarget);
        actionPlanner.updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwProduceUnitPanel, {
            gridIndex   : gridIndex,
            war         : actionPlanner.getWar(),
        });
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`ChoosingTileProductionTargetState: Not expected to apply on drag ended!`);
    }
}
