import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getPowerSkillTargetsCount } from "../../../coSkills/utils/Common.ts";
import { newError } from "../../../helpers/Misc.ts";
import { PlayerIndex, AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function revise(war: IBwWar, rawAction: WoPlayerUseCoSkill, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getPlayerIndex() === PlayerIndex.Neutral)     ||
        (playerInTurn.getAliveState() !== AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_01);
    }

    const skillType = rawAction.getSkillType();
    if ((skillType == null) || (!playerInTurn.checkCanUseCoSkill(skillType))) {
        throw newError(`Invalid skillType: ${skillType}`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_02);
    }

    const count                 = getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw newError(`Invalid targets count.`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_03);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw newError(`Invalid target grid index.`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw newError(`Duplicated target grid index.`, ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        gridIdSet.add(gridId);
    }

    return WoContainer.fromJson({
        WoPlayerUseCoSkill: {
            skillType               : skillType,
            targetGridIndexArray    : targetGridIndexArray.map(v => v.toJson()),
        },
    });
}
