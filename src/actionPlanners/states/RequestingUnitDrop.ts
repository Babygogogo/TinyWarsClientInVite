import {
    AuxiliaryTypes_DropDestination,
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

export class RequestingUnitDrop implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingUnitDrop();

    public static getInstance(): RequestingUnitDrop {
        return RequestingUnitDrop._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingUnitDrop;
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
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const unit = Helpers_Misc.getExisted(actionPlanner.getChoosingUnitForDrop());
            actionPlanner.pushBackChosenUnitForDrop({
                unit        : unit,
                destination : gridIndex,
            });

            const destinations: AuxiliaryTypes_DropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypes_DropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId    : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit : {
                    path : {
                        nodes : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId     : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            actionPlanner.pushBackChosenUnitForDrop({
                unit        : Helpers_Misc.getExisted(actionPlanner.getChoosingUnitForDrop()),
                destination : gridIndex,
            });

            const destinations: AuxiliaryTypes_DropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypes_DropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            SinglePlayerWar_Model_SpwLocalProxy.reqUnitDrop({
                war              : war,
                path             : actionPlanner.generateProtoMovePath(),
                launchUnitId     : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                dropDestinations : destinations,
            });
        }
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`RequestingUnitDropState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const destinations: AuxiliaryTypes_DropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypes_DropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId    : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit : {
                    path : {
                        nodes : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId     : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            const destinations: AuxiliaryTypes_DropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypes_DropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            const unit = actionPlanner.getFocusUnitLoaded();
            SinglePlayerWar_Model_SpwLocalProxy.reqUnitDrop({
                war              : war,
                path             : actionPlanner.generateProtoMovePath(),
                launchUnitId     : unit?.getUnitId() ?? null,
                dropDestinations : destinations,
            });
        }
    }
}
