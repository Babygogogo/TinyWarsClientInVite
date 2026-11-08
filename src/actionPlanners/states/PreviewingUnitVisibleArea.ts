import {
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
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

export class PreviewingUnitVisibleArea implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new PreviewingUnitVisibleArea();

    public static getInstance(): PreviewingUnitVisibleArea {
        return PreviewingUnitVisibleArea._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
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
                if (actionPlanner.getUnitForPreviewingVisibleArea() !== unit) {
                    return ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea;
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
        actionPlanner.clearDataForPreviewingMovableArea();

        actionPlanner.setUnitForPreviewingVisibleArea(Helpers_Misc.getExisted(actionPlanner.getWar().getUnitMap().getUnitOnMap(gridIndex)));

        actionPlanner.setStateId(ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea);
        actionPlanner.updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
    }

    public doApplyOnDrag(): void {
        // Nothing to do.
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`PreviewingUnitVisibleAreaState: Not expected to apply on drag ended!`);
    }
}
