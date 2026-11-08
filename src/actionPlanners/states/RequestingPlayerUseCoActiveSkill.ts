import {
    MultiPlayerWar_Model_MpwWar,
    SinglePlayerWars_War,
    ActionPlanners_Constants,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_States_IState,
    type CoSkills_Constants,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwProxy,
    SinglePlayerWars_LocalGateway,
} from "../../internal.ts";

import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class RequestingPlayerUseCoActiveSkill implements ActionPlanners_States_IState.IState {
    private static readonly _instance = new RequestingPlayerUseCoActiveSkill();

    public static getInstance(): RequestingPlayerUseCoActiveSkill {
        return RequestingPlayerUseCoActiveSkill._instance;
    }

    public getStateId(): ActionPlanners_Constants.StateId {
        return ActionPlanners_Constants.StateId.RequestingPlayerUseCoActiveSkill;
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
            actionPlanner.getCoActiveSkillTargetGridIndexArray(),
        );
    }

    public doApplyOnDrag(): void {
        throw Helpers_Misc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw Helpers_Misc.newError(`RequestingPlayerUseCoActiveSkillState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, coSkillTypeId: CoSkills_Constants.SkillTypeId, targetGridIndexArray: AuxiliaryTypes_GridIndex.GridIndex[] | null): void {
        const war = actionPlanner.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwExecuteWarOperation(war, WoContainer.fromJson({
                operationId        : war.getExecutedOperationManager().getExecutedOperationsCount(),
                WoPlayerUseCoSkill : {
                    skillType            : coSkillTypeId,
                    targetGridIndexArray : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
                },
            }));

            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerUseCoActiveSkill);
            actionPlanner.updateView();

        } else if (war instanceof SinglePlayerWars_War.War) {
            actionPlanner.setStateId(ActionPlanners_Constants.StateId.RequestingPlayerUseCoActiveSkill);
            actionPlanner.updateView();

            SinglePlayerWars_LocalGateway.reqPlayerUseCoActiveSkill({
                war                  : war,
                skillType            : coSkillTypeId,
                targetGridIndexArray : targetGridIndexArray,
            });
        }
    }
}
