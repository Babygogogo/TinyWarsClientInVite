import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    getMpwWarClass,
    getSpwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqUnitLaunchSilo } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingUnitLaunchSilo implements IState {
    private static readonly _instance = new RequestingUnitLaunchSilo();

    public static getInstance(): RequestingUnitLaunchSilo {
        return RequestingUnitLaunchSilo._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingUnitLaunchSilo;
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
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitLaunchSilo    : {
                    path            : {
                        nodes   : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex.toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingUnitLaunchSilo);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitLaunchSilo);
            actionPlanner.updateView();

            reqUnitLaunchSilo({
                war             : war,
                path            : actionPlanner.generateProtoMovePath(),
                launchUnitId    : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndex : gridIndex,
            });
        }
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`RequestingUnitLaunchSiloState: Not expected to apply on drag ended!`);
    }
}
