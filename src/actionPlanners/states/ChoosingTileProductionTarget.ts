import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import { Idle } from "./Idle.ts";
import type { IState } from "./IState.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getMeWarClass, getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { ActionStateId } from "../../units/Constants.ts";

type GridIndex              = AuxiliaryTypesGridIndex;

export class ChoosingTileProductionTarget implements IState {
    private static readonly _instance = new ChoosingTileProductionTarget();

    public static getInstance(): ChoosingTileProductionTarget {
        return ChoosingTileProductionTarget._instance;
    }

    public getStateId(): StateId {
        return StateId.ChoosingTileProductionTarget;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId {
        const war = actionPlanner.getWar();
        if ((war instanceof getMeWarClass()) ||
            (war instanceof getTwWarClass())
        ) {
            return StateId.Idle;
        }

        const selfPlayerIndexSet    = actionPlanner.getSelfPlayerIndexSet();
        const turnManager           = war.getTurnManager();
        const isSelfInTurn          = (selfPlayerIndexSet.has(turnManager.getPlayerIndexInTurn())) && (turnManager.getPhaseCode() === PhaseCode.Main);
        const tile                  = war.getTileMap().getTile(gridIndex);
        const unit                  = war.getUnitMap().getVisibleUnitOnMap(gridIndex);

        if (war.getCursor().getPreviousGridIndex()?.checkIsEqual(gridIndex)) {
            return StateId.ChoosingTileProductionTarget;
        } else {
            if (!unit) {
                if ((isSelfInTurn)                                                              &&
                    ([...selfPlayerIndexSet].some(v => tile.checkIsUnitProducerForPlayer(v)))
                ) {
                    return StateId.ChoosingTileProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return StateId.PreviewingTileAttackableArea;
                    } else {
                        return StateId.Idle;
                    }
                }

            } else {
                if ((isSelfInTurn)                                      &&
                    (unit.getActionState() === ActionStateId.Idle)  &&
                    (selfPlayerIndexSet.has(unit.getPlayerIndex()))
                ) {
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
    }

    public getNextStateIdOnDrag(): StateId {
        return StateId.Idle;
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
        actionPlanner.clearAllDataForStates();
        actionPlanner.setStateId(StateId.ChoosingTileProductionTarget);
        actionPlanner.updateView();

        playShortSfx(ShortSfxCode.CursorConfirm01);
        openPanel(getDict().BwProduceUnitPanel, {
            gridIndex   : gridIndex,
            war         : actionPlanner.getWar(),
        });
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`ChoosingTileProductionTargetState: Not expected to apply on drag ended!`);
    }
}
