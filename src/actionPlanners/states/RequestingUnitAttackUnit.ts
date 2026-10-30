import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    Helpers_Misc,
    Sounds_SoundPlayer,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWar_Model_SpwLocalProxy,
    Sounds_Constants,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingUnitAttackUnit implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingUnitAttackUnit();

    public static getInstance(): RequestingUnitAttackUnit {
        return RequestingUnitAttackUnit._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingUnitAttackUnit;
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
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitAttackUnit    : {
                    path            : {
                        nodes       : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId    : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex.toProto().toJson(),
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitAttackUnit);
            actionPlanner.updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitAttackUnit);
            actionPlanner.updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);

            SinglePlayerWar_Model_SpwLocalProxy.reqUnitAttackUnit({
                war             : war,
                path            : actionPlanner.generateProtoMovePath(),
                launchUnitId    : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndex : gridIndex,
            });
        }
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`RequestingUnitAttackUnitState: Not expected to apply on drag ended!`);
    }
}
