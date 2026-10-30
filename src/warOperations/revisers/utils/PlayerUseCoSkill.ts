import {
    Players_Constants,
    Utils_ClientErrorCode,
    CoSkills_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Helpers_Misc,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerUseCoSkill, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getPlayerIndex() === Players_Constants.PlayerIndex.Neutral)     ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid playerIndex or aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_01);
    }

    const skillType = rawAction.getSkillType();
    if ((skillType == null) || (!playerInTurn.checkCanUseCoSkill(skillType))) {
        throw Helpers_Misc.newError(`Invalid skillType: ${skillType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_02);
    }

    const count                 = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw Helpers_Misc.newError(`Invalid targets count.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_03);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw Helpers_Misc.newError(`Invalid target grid index.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw Helpers_Misc.newError(`Duplicated target grid index.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        gridIdSet.add(gridId);
    }

    return WoContainer.fromJson({
        WoPlayerUseCoSkill : {
            skillType            : skillType,
            targetGridIndexArray : targetGridIndexArray.map(v => v.toJson()),
        },
    });
}
