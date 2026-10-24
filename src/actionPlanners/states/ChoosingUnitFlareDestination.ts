import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitFlareDestination implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitFlareDestination();

    public static getInstance(): ChoosingUnitFlareDestination {
        return ChoosingUnitFlareDestination._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitFlareDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > HelpersMisc.getExisted(HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > HelpersMisc.getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return ActionPlannersConstants.StateId.RequestingUnitLaunchFlare;
                } else {
                    return ActionPlannersConstants.StateId.ChoosingUnitFlareDestination;
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > HelpersMisc.getExisted(HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitFlareDestination;
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const destination = actionPlanner.getMovePathDestination().getGridIndex();
            if (destination.getDistance(gridIndex) > HelpersMisc.getExisted(HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getFlareMaxRange(destination))) {
                return ActionPlannersConstants.StateId.ChoosingUnitAction;
            } else {
                const previousGridIndex = actionPlanner.getWar().getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                    return ActionPlannersConstants.StateId.RequestingUnitLaunchFlare;
                } else {
                    return ActionPlannersConstants.StateId.ChoosingUnitFlareDestination;
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
    public cancel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        actionPlanner.getWar().getCursor().setGridIndex(actionPlanner.getMovePathDestination().getGridIndex());

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitAction);
        actionPlanner.updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingUnitFlareDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, flareRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(flareRadius);
        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitFlareDestination);
        actionPlanner.updateView();
    }
}
