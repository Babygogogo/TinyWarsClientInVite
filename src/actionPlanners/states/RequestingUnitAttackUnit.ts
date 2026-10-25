import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqUnitAttackUnit } from "../../singlePlayerWar/model/SpwLocalProxy.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";

type GridIndex      = AuxiliaryTypesGridIndex;

export class RequestingUnitAttackUnit implements IState {
    private static readonly _instance = new RequestingUnitAttackUnit();

    public static getInstance(): RequestingUnitAttackUnit {
        return RequestingUnitAttackUnit._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingUnitAttackUnit;
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
                WoUnitAttackUnit    : {
                    path            : {
                        nodes       : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex.toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(StateId.RequestingUnitAttackUnit);
            actionPlanner.updateView();
            playShortSfx(ShortSfxCode.CursorConfirm01);

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitAttackUnit);
            actionPlanner.updateView();
            playShortSfx(ShortSfxCode.CursorConfirm01);

            reqUnitAttackUnit({
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
        throw newError(`RequestingUnitAttackUnitState: Not expected to apply on drag ended!`);
    }
}
