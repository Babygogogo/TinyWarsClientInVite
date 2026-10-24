import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as SinglePlayerWarModelSpwLocalProxy from "../../singlePlayerWar/model/SpwLocalProxy.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;

export class RequestingUnitLaunchFlare implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new RequestingUnitLaunchFlare();

    public static getInstance(): RequestingUnitLaunchFlare {
        return RequestingUnitLaunchFlare._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.RequestingUnitLaunchFlare;
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
            MultiPlayerWarModelMpwProxy.reqMpwExecuteWarOperation(war, ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitLaunchFlare   : {
                    path            : {
                        nodes       : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex.toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitLaunchFlare);
            actionPlanner.updateView();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitLaunchFlare);
            actionPlanner.updateView();

            SinglePlayerWarModelSpwLocalProxy.reqUnitLaunchFlare({
                war             : war,
                path            : actionPlanner.generateProtoMovePath(),
                launchUnitId    : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndex : gridIndex
            });
        }
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`RequestingUnitLaunchFlareState: Not expected to apply on drag ended!`);
    }
}
