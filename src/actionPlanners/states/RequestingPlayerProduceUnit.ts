import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWar_Model_SpwLocalProxy,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingPlayerProduceUnit implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingPlayerProduceUnit();

    public static getInstance(): RequestingPlayerProduceUnit {
        return RequestingPlayerProduceUnit._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingPlayerProduceUnit;
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
        throw Helpers_Misc.newError(`RequestingPlayerProduceUnitState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitType: number, unitHp: number): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerProduceUnit : {
                    gridIndex   : gridIndex.toProto().toJson(),
                    unitType    : unitType,
                    unitHp      : unitHp,
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerProduceUnit);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerProduceUnit);
            actionPlanner.updateView();

            SinglePlayerWar_Model_SpwLocalProxy.reqPlayerProduceUnit({
                war         : war,
                gridIndex   : gridIndex,
                unitType    : unitType,
                unitHp      : unitHp,
             });
        }
    }
}
