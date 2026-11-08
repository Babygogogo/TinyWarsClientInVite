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

export class RequestingUnitSupply implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingUnitSupply();

    public static getInstance(): RequestingUnitSupply {
        return RequestingUnitSupply._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingUnitSupply;
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
        throw Helpers_Misc.newError(`RequestingUnitSupplyState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitSupplyUnit : {
                    path : {
                        nodes : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId : actionPlanner.getUnitIdForFocusUnitLoaded(),
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitSupply);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWars_War.War) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitSupply);
            actionPlanner.updateView();

            SinglePlayerWars_LocalGateway.reqUnitSupply(
                war,
                actionPlanner.generateProtoMovePath(),
                actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
            );
        }
    }
}
