import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqUnitCrushUnit } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingUnitCrushUnit implements IState {
    private static readonly _instance = new RequestingUnitCrushUnit();

    public static getInstance(): RequestingUnitCrushUnit {
        return RequestingUnitCrushUnit._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingUnitCrushUnit;
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
    public doApplyOnTap(actionPlanner: IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitCrushUnit     : {
                    path            : {
                        nodes       : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : getExisted(actionPlanner.getUnitCrushTargetGridIndex()).toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingUnitCrushUnit);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitCrushUnit);
            actionPlanner.updateView();

            reqUnitCrushUnit(
                war,
                actionPlanner.generateProtoMovePath(),
                actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                getExisted(actionPlanner.getUnitCrushTargetGridIndex()),
            );
        }
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`Not expected to apply on drag ended!`);
    }
}
