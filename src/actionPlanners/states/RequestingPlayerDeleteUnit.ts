import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as SinglePlayerWarModelSpwLocalProxy from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingPlayerDeleteUnit implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new RequestingPlayerDeleteUnit();

    public static getInstance(): RequestingPlayerDeleteUnit {
        return RequestingPlayerDeleteUnit._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.RequestingPlayerDeleteUnit;
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
    public doApplyOnTap(): void {
        throw HelpersMisc.newError(`Not expected to apply on tap!`);
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`RequestingPlayerDeleteUnitState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            MultiPlayerWarModelMpwProxy.reqMpwExecuteWarOperation(war, ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerDeleteUnit  : {
                    gridIndex   : war.getCursor().getGridIndex().toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingPlayerDeleteUnit);
            actionPlanner.updateView();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingPlayerDeleteUnit);

            actionPlanner.updateView();
            SinglePlayerWarModelSpwLocalProxy.reqPlayerDeleteUnit(war, war.getCursor().getGridIndex());
        }
    }
}
