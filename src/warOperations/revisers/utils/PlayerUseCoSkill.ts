import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CoSkillsUtilsCommon from "../../../coSkills/utils/Common.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill.WoPlayerUseCoSkill, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getPlayerIndex() === PlayersConstants.PlayerIndex.Neutral)     ||
        (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid playerIndex or aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_01);
    }

    const skillType = rawAction.getSkillType();
    if ((skillType == null) || (!playerInTurn.checkCanUseCoSkill(skillType))) {
        throw HelpersMisc.newError(`Invalid skillType: ${skillType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_02);
    }

    const count                 = CoSkillsUtilsCommon.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw HelpersMisc.newError(`Invalid targets count.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_03);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw HelpersMisc.newError(`Invalid target grid index.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw HelpersMisc.newError(`Duplicated target grid index.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerUseCoSkill_04);
        }

        gridIdSet.add(gridId);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerUseCoSkill: {
            skillType               : skillType,
            targetGridIndexArray    : targetGridIndexArray.map(v => v.toJson()),
        },
    });
}
