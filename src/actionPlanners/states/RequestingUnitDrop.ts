import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import * as AuxiliaryTypesDropDestination from "../../auxiliaryTypes/DropDestination.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as SinglePlayerWarModelSpwLocalProxy from "../../singlePlayerWar/model/SpwLocalProxy.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;

export class RequestingUnitDrop implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new RequestingUnitDrop();

    public static getInstance(): RequestingUnitDrop {
        return RequestingUnitDrop._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.RequestingUnitDrop;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNextStateIdOnTap(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDrag(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    public getNextStateIdOnDragEnded(): ActionPlannersConstants.StateId {
        return this.getStateId();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public cancel(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, gridIndex: GridIndex): void {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const unit = HelpersMisc.getExisted(actionPlanner.getChoosingUnitForDrop());
            actionPlanner.pushBackChosenUnitForDrop({
                unit        : unit,
                destination : gridIndex,
            });

            const destinations: AuxiliaryTypesDropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypesDropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            MultiPlayerWarModelMpwProxy.reqMpwExecuteWarOperation(war, ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                operationId             : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit          : {
                    path                : {
                        nodes           : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId        : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations    : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            actionPlanner.pushBackChosenUnitForDrop({
                unit        : HelpersMisc.getExisted(actionPlanner.getChoosingUnitForDrop()),
                destination : gridIndex,
            });

            const destinations: AuxiliaryTypesDropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypesDropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            SinglePlayerWarModelSpwLocalProxy.reqUnitDrop({
                war                 : war,
                path                : actionPlanner.generateProtoMovePath(),
                launchUnitId        : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                dropDestinations    : destinations,
            });
        }
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`RequestingUnitDropState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const destinations: AuxiliaryTypesDropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypesDropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            MultiPlayerWarModelMpwProxy.reqMpwExecuteWarOperation(war, ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                operationId             : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit          : {
                    path: {
                        nodes           : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId        : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations    : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            const destinations: AuxiliaryTypesDropDestination.DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new AuxiliaryTypesDropDestination.DropDestination(data.destination, data.unit.getUnitId()));
            }

            const unit = actionPlanner.getFocusUnitLoaded();
            SinglePlayerWarModelSpwLocalProxy.reqUnitDrop({
                war                 : war,
                path                : actionPlanner.generateProtoMovePath(),
                launchUnitId        : unit?.getUnitId() ?? null,
                dropDestinations    : destinations
            });
        }
    }
}
