import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    CoSkills_Constants,
    CoSkills_Utils_Common,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Utils_Common,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitUseCoSkill, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_02);
    }

    const focusUnit = war.getUnitMap().getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if (focusUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_03);
    }

    const skillType = rawAction.getSkillType() as CoSkills_Constants.SkillTypeId;
    if ((skillType !== CoSkills_Constants.SkillTypeId.Power)     &&
        (skillType !== CoSkills_Constants.SkillTypeId.SuperPower)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_04);
    }

    if (!focusUnit.checkCanUseCoSkill(skillType)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_05);
    }

    const count                 = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_06);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_07);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_08);
        }

        gridIdSet.add(gridId);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitUseCoSkill : {
            path                 : revisedPath.toProtoMovePath().toJson(),
            launchUnitId         : launchUnitId,
            skillType            : skillType,
            targetGridIndexArray : targetGridIndexArray.map(v => v.toJson()),
        },
    }), revisedPath);
}
