import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWars_War,
    ActionPlanners_Constants,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWars_LocalGateway,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingPlayerSurrender implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingPlayerSurrender();

    public static getInstance(): RequestingPlayerSurrender {
        return RequestingPlayerSurrender._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingPlayerSurrender;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): ActionPlanners_Constants.StateId {
        return this.getStateId();
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
    public doApplyOnTap(): void {
        throw Helpers_Misc.newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`RequestingPlayerSurrenderState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, playerIndex: number): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerSurrender : {
                    playerIndex : playerIndex,
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerSurrender);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWars_War.War) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerSurrender);

            actionPlanner.updateView();
            SinglePlayerWars_LocalGateway.reqPlayerSurrender(war, playerIndex);
        }
    }
}
