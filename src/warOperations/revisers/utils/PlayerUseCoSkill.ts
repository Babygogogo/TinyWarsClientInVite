import {
    Players_Constants,
    Utils_ClientErrorCode,
    CoSkills_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoPlayerUseCoSkill, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getPlayerIndex() === Players_Constants.PlayerIndex.Neutral)     ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_01);
    }

    const skillType = rawAction.getSkillType();
    if ((skillType == null) || (!playerInTurn.checkCanUseCoSkill(skillType))) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_02);
    }

    const count                 = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_03);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        gridIdSet.add(gridId);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoPlayerUseCoSkill : {
            skillType            : skillType,
            targetGridIndexArray : targetGridIndexArray.map(v => v.toJson()),
        },
    }));
}
