import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqPlayerDeleteUnit } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingPlayerDeleteUnit implements IState {
    private static readonly _instance = new RequestingPlayerDeleteUnit();

    public static getInstance(): RequestingPlayerDeleteUnit {
        return RequestingPlayerDeleteUnit._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingPlayerDeleteUnit;
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
        throw newError(`RequestingPlayerDeleteUnitState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerDeleteUnit  : {
                    gridIndex   : war.getCursor().getGridIndex().toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingPlayerDeleteUnit);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingPlayerDeleteUnit);

            actionPlanner.updateView();
            reqPlayerDeleteUnit(war, war.getCursor().getGridIndex());
        }
    }
}
