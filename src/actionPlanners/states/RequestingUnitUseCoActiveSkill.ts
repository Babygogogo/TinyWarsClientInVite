import * as ActionPlannersConstants from "../Constants.ts";
import type * as ActionPlannersIActionPlanner from "../IActionPlanner.ts";
import type * as ActionPlannersStatesIState from "./IState.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as SinglePlayerWarModelSpwLocalProxy from "../../singlePlayerWar/model/SpwLocalProxy.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;

export class RequestingUnitUseCoActiveSkill implements ActionPlannersStatesIState.IState {
    private static readonly _instance = new RequestingUnitUseCoActiveSkill();

    public static getInstance(): RequestingUnitUseCoActiveSkill {
        return RequestingUnitUseCoActiveSkill._instance;
    }

    public getStateId(): ActionPlannersConstants.StateId {
        return ActionPlannersConstants.StateId.RequestingUnitUseCoActiveSkill;
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
    public doApplyOnTap(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        this.doApplyOnChooseAction(
            actionPlanner,
            HelpersMisc.getExisted(actionPlanner.getCoActiveSkillTypeId()),
            actionPlanner.getCoActiveSkillTargetGridIndexArray()
        );
    }

    public doApplyOnDrag(): void {
        throw HelpersMisc.newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw HelpersMisc.newError(`RequestingUnitUseCoActiveSkillState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, coSkillTypeId: CoSkillsConstants.SkillTypeId, targetGridIndexArray: GridIndex[] | null): void {
        const war = actionPlanner.getWar();
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            MultiPlayerWarModelMpwProxy.reqMpwExecuteWarOperation(war, ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
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

            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            actionPlanner.setStateId(ActionPlannersConstants.StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

            SinglePlayerWarModelSpwLocalProxy.reqUnitUseCoActiveSkill({
                war                     : war,
                skillType               : coSkillTypeId,
                path                    : actionPlanner.generateProtoMovePath(),
                launchUnitId            : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndexArray    : targetGridIndexArray,
            });
        }
    }
}
