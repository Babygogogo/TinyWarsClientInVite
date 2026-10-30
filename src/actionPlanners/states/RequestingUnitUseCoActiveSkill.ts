import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    type CoSkills_Constants,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWar_Model_SpwLocalProxy,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingUnitUseCoActiveSkill implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingUnitUseCoActiveSkill();

    public static getInstance(): RequestingUnitUseCoActiveSkill {
        return RequestingUnitUseCoActiveSkill._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingUnitUseCoActiveSkill;
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
    public doApplyOnTap(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        this.doApplyOnChooseAction(
            actionPlanner,
            Helpers_Misc.getExisted(actionPlanner.getCoActiveSkillTypeId()),
            actionPlanner.getCoActiveSkillTargetGridIndexArray()
        );
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`RequestingUnitUseCoActiveSkillState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, coSkillTypeId: CoSkills_Constants.SkillTypeId, targetGridIndexArray: AuxiliaryTypes_GridIndex.GridIndex[] | null): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId                 : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoUnitUseCoSkill            : {
                    path                    : {
                        nodes               : actionPlanner.getMovePath().map(v => v.getGridIndex().toProto().toJson()),
                    },
                    launchUnitId            : actionPlanner.getUnitIdForFocusUnitLoaded(),
                    skillType               : coSkillTypeId,
                    targetGridIndexArray    : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

            SinglePlayerWar_Model_SpwLocalProxy.reqUnitUseCoActiveSkill({
                war                     : war,
                skillType               : coSkillTypeId,
                path                    : actionPlanner.generateProtoMovePath(),
                launchUnitId            : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndexArray    : targetGridIndexArray,
            });
        }
    }
}
