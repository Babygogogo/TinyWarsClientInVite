import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import { DropDestination } from "../../auxiliaryTypes/DropDestination.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqUnitDrop } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingUnitDrop implements IState {
    private static readonly _instance = new RequestingUnitDrop();

    public static getInstance(): RequestingUnitDrop {
        return RequestingUnitDrop._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingUnitDrop;
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
    public doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            const unit = getExisted(actionPlanner.getChoosingUnitForDrop());
            actionPlanner.pushBackChosenUnitForDrop({
                unit        : unit,
                destination : gridIndex,
            });

            const destinations: DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new DropDestination(data.destination, data.unit.getUnitId()));
            }

            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId             : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit          : {
                    path                : {
                        nodes           : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId        : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations    : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            actionPlanner.pushBackChosenUnitForDrop({
                unit        : getExisted(actionPlanner.getChoosingUnitForDrop()),
                destination : gridIndex,
            });

            const destinations: DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new DropDestination(data.destination, data.unit.getUnitId()));
            }

            reqUnitDrop({
                war                 : war,
                path                : actionPlanner.generateProtoMovePath(),
                launchUnitId        : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                dropDestinations    : destinations,
            });
        }
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`RequestingUnitDropState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            const destinations: DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new DropDestination(data.destination, data.unit.getUnitId()));
            }

            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId             : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitDropUnit          : {
                    path: {
                        nodes           : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId        : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    dropDestinations    : destinations.map(v => v.toProto().toJson()),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingUnitDrop);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitDrop);
            actionPlanner.updateView();

            const destinations: DropDestination[] = [];
            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                destinations.push(new DropDestination(data.destination, data.unit.getUnitId()));
            }

            const unit = actionPlanner.getFocusUnitLoaded();
            reqUnitDrop({
                war                 : war,
                path                : actionPlanner.generateProtoMovePath(),
                launchUnitId        : unit?.getUnitId() ?? null,
                dropDestinations    : destinations
            });
        }
    }
}
