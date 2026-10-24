import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;

export class ChoosingUnitSiloDestination implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new ChoosingUnitSiloDestination();

    public static getInstance(): ChoosingUnitSiloDestination {
        return ChoosingUnitSiloDestination._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.ChoosingUnitSiloDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): ActionPlannersConstants.StateId {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            return ActionPlannersConstants.StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return ActionPlannersConstants.StateId.Idle;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return ActionPlannersConstants.StateId.RequestingUnitLaunchSilo;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitSiloDestination;
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            return ActionPlannersConstants.StateId.ChoosingUnitSiloDestination;

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const previousGridIndex = war.getCursor().getPreviousGridIndex();
            if ((previousGridIndex != null) && (gridIndex.checkIsEqual(previousGridIndex))) {
                return ActionPlannersConstants.StateId.RequestingUnitLaunchSilo;
            } else {
                return ActionPlannersConstants.StateId.ChoosingUnitSiloDestination;
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
        const currStateId = actionPlanner.getStateId();
        if (currStateId === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currStateId}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDrag(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const currState = actionPlanner.getStateId();
        if (currState === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            // Nothing to do.

        } else {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        }

        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`ChoosingUnitSiloDestinationState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, siloRadius: number): void {
        const currState = actionPlanner.getStateId();
        if (currState !== ActionPlannersConstants.StateId.ChoosingUnitAction) {
            throw HelpersMisc.newError(`Invalid currState: ${currState}`);
        } else {
            // Nothing to do.
        }

        actionPlanner.getWar().getCursor().getView().setTargetAreaRadius(siloRadius);
        actionPlanner.setStateId(ActionPlannersConstants.StateId.ChoosingUnitSiloDestination);
        actionPlanner.updateView();
    }
}
