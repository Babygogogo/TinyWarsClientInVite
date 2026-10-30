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
import { reqPlayerProduceUnit } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

export class RequestingPlayerProduceUnit implements IState {
    private static readonly _instance = new RequestingPlayerProduceUnit();

    public static getInstance(): RequestingPlayerProduceUnit {
        return RequestingPlayerProduceUnit._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingPlayerProduceUnit;
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
        throw newError(`RequestingPlayerProduceUnitState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, gridIndex: GridIndex, unitType: number, unitHp: number): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerProduceUnit : {
                    gridIndex   : gridIndex.toProto().toJson(),
                    unitType    : unitType,
                    unitHp      : unitHp,
                },
            }));

            actionPlanner.setStateId(StateId.RequestingPlayerProduceUnit);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingPlayerProduceUnit);
            actionPlanner.updateView();

            reqPlayerProduceUnit({
                war         : war,
                gridIndex   : gridIndex,
                unitType    : unitType,
                unitHp      : unitHp,
             });
        }
    }
}
