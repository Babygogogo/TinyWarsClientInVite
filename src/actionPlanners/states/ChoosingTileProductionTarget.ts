import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import * as ActionPlannersStatesIdle from "./Idle.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UnitsConstants from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingTileProductionTarget implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingTileProductionTarget();

    public static getInstance(): ChoosingTileProductionTarget {
        return ChoosingTileProductionTarget._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof GameHelpersGhFactory.getMeWarClass()) ||
            (war instanceof GameHelpersGhFactory.getTwWarClass())
        ) {
            return ActionPlannersConstants.StateId.Idle;
        }

        const selfPlayerIndexSet    = actionPlanner.getSelfPlayerIndexSet();
        const turnManager           = war.getTurnManager();
        const isSelfInTurn          = (selfPlayerIndexSet.has(turnManager.getPlayerIndexInTurn())) && (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main);
        const tile                  = war.getTileMap().getTile(gridIndex);
        const unit                  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);

        if (war.getCursor().getPreviousGridIndex()?.checkIsEqual(gridIndex)) {
            return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
        } else {
            if (!unit) {
                if ((isSelfInTurn)                                                              &&
                    ([...selfPlayerIndexSet].some(v => tile.checkIsUnitProducerForPlayer(v)))
                ) {
                    return ActionPlannersConstants.StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return ActionPlannersConstants.StateId.PreviewingTileAttackableArea;
                    } else {
                        return ActionPlannersConstants.StateId.Idle;
                    }
                }

            } else {
                if ((isSelfInTurn)                                      &&
                    (unit.getActionState() === UnitsConstants.ActionStateId.Idle)  &&
                    (selfPlayerIndexSet.has(unit.getPlayerIndex()))
                ) {
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
    }

    public getNextStateIdOnDrag(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.Idle;
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
        actionPlanner.clearAllDataForStates();
        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingTileProductionTarget);
        actionPlanner.updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwProduceUnitPanel, {
            gridIndex   : gridIndex,
            war         : actionPlanner.getWar(),
        });
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingTileProductionTargetState: Not expected to apply on drag ended!`);
    }
}
