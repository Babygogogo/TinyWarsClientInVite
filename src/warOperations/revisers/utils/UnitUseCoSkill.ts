import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { SkillTypeId } from "../../../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../../../coSkills/utils/Common.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getRevisedPath, checkIsPathDestinationOccupiedByOtherVisibleUnit } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitUseCoSkill, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_02);
    }

    const focusUnit = getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_03);
    const skillType = rawAction.getSkillType() as SkillTypeId;
    if ((skillType !== SkillTypeId.Power)     &&
        (skillType !== SkillTypeId.SuperPower)
    ) {
        throw newError(`Invalid skillType: ${skillType}`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_04);
    }

    if (!focusUnit.checkCanUseCoSkill(skillType)) {
        throw newError(`Can not use skill.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_05);
    }

    const count                 = getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw newError(`Invalid targets count.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_06);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw newError(`Invalid target grid index.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_07);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw newError(`Duplicated target grid index.`, ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_08);
        }

        gridIdSet.add(gridId);
    }

    return WoContainer.fromJson({
        WoUnitUseCoSkill : {
            path                    : revisedPath.toProto().toJson(),
            launchUnitId            : launchUnitId,
            skillType               : skillType,
            targetGridIndexArray    : targetGridIndexArray.map(v => v.toJson()),
        },
    });
}
