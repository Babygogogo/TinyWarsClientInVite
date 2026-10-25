import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import { Idle } from "./Idle.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getMeWarClass, getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { ActionStateId } from "../../units/Constants.ts";

export class PreviewingUnitVisibleArea implements IState {
    private static readonly _instance = new PreviewingUnitVisibleArea();

    public static getInstance(): PreviewingUnitVisibleArea {
        return PreviewingUnitVisibleArea._instance;
    }

    public getStateId(): StateId {
        return StateId.PreviewingUnitVisibleArea;
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
                if (actionPlanner.getUnitForPreviewingVisibleArea() !== unit) {
                    return StateId.PreviewingUnitVisibleArea;
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
        actionPlanner.clearDataForPreviewingMovableArea();

        actionPlanner.setUnitForPreviewingVisibleArea(getExisted(actionPlanner.getWar().getUnitMap().getUnitOnMap(gridIndex)));

        actionPlanner.setStateId(StateId.PreviewingUnitVisibleArea);
        actionPlanner.updateView();
        playShortSfx(ShortSfxCode.CursorConfirm01);
    }

    public doApplyOnDrag(): void {
        // Nothing to do.
    }

    public doApplyOnDragEnded(): void {
        throw newError(`PreviewingUnitVisibleAreaState: Not expected to apply on drag ended!`);
    }
}
