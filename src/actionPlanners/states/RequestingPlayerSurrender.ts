import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqPlayerSurrender } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingPlayerSurrender implements IState {
    private static readonly _instance = new RequestingPlayerSurrender();

    public static getInstance(): RequestingPlayerSurrender {
        return RequestingPlayerSurrender._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingPlayerSurrender;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDrag(): StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(): void {
        throw newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`RequestingPlayerSurrenderState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, playerIndex: number): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerSurrender   : {
                    playerIndex : playerIndex,
                },
            }));

            actionPlanner.setStateId(StateId.RequestingPlayerSurrender);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingPlayerSurrender);

            actionPlanner.updateView();
            reqPlayerSurrender(war, playerIndex);
        }
    }
}
