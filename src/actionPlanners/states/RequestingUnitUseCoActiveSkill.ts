import { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { IState } from "./IState.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { SkillTypeId } from "../../coSkills/Constants.ts";
import { getMpwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { reqMpwExecuteWarOperation } from "../../multiPlayerWar/model/MpwProxy.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { reqUnitUseCoActiveSkill } from "../../singlePlayerWar/model/SpwLocalProxy.ts";

type GridIndex          = AuxiliaryTypesGridIndex;

export class RequestingUnitUseCoActiveSkill implements IState {
    private static readonly _instance = new RequestingUnitUseCoActiveSkill();

    public static getInstance(): RequestingUnitUseCoActiveSkill {
        return RequestingUnitUseCoActiveSkill._instance;
    }

    public getStateId(): StateId {
        return StateId.RequestingUnitUseCoActiveSkill;
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
        this.doApplyOnChooseAction(
            actionPlanner,
            getExisted(actionPlanner.getCoActiveSkillTypeId()),
            actionPlanner.getCoActiveSkillTargetGridIndexArray()
        );
    }

    public doApplyOnDrag(): void {
        throw newError(`Not expected to apply on drag!`);
    }

    public doApplyOnDragEnded(): void {
        throw newError(`RequestingUnitUseCoActiveSkillState: Not expected to apply on drag ended!`);
    }

    public doApplyOnChooseAction(actionPlanner: IActionPlanner, coSkillTypeId: SkillTypeId, targetGridIndexArray: GridIndex[] | null): void {
        const war = actionPlanner.getWar();
        if (war instanceof getMpwWarClass()) {
            reqMpwExecuteWarOperation(war, WoContainer.fromJson({
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

            actionPlanner.setStateId(StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

        } else if (war instanceof getSpwWarClass()) {
            actionPlanner.setStateId(StateId.RequestingUnitUseCoActiveSkill);
            actionPlanner.updateView();

            reqUnitUseCoActiveSkill({
                war                     : war,
                skillType               : coSkillTypeId,
                path                    : actionPlanner.generateProtoMovePath(),
                launchUnitId            : actionPlanner.getFocusUnitLoaded()?.getUnitId() ?? null,
                targetGridIndexArray    : targetGridIndexArray,
            });
        }
    }
}
