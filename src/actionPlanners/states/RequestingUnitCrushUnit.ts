import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWar_Model_SpwLocalProxy,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingUnitCrushUnit implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingUnitCrushUnit();

    public static getInstance(): RequestingUnitCrushUnit {
        return RequestingUnitCrushUnit._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingUnitCrushUnit;
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
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitCrushUnit     : {
                    path            : {
                        nodes       : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : Helpers_Misc.getExisted(actionPlanner.getUnitCrushTargetGridIndex()).toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitCrushUnit);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitCrushUnit);
            actionPlanner.updateView();

            SinglePlayerWar_Model_SpwLocalProxy.reqUnitCrushUnit(
                war,
                actionPlanner.generateProtoMovePath(),
                actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                Helpers_Misc.getExisted(actionPlanner.getUnitCrushTargetGridIndex()),
            );
        }
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag ended!`);
    }
}
