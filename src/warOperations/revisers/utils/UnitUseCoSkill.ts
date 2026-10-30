import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    CoSkills_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    CoSkills_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitUseCoSkill, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_02);
    }

    const focusUnit = Helpers_Misc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_03);
    const skillType = rawAction.getSkillType() as CoSkills_Constants.SkillTypeId;
    if ((skillType !== CoSkills_Constants.SkillTypeId.Power)     &&
        (skillType !== CoSkills_Constants.SkillTypeId.SuperPower)
    ) {
        throw Helpers_Misc.newError(`Invalid skillType: ${skillType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_04);
    }

    if (!focusUnit.checkCanUseCoSkill(skillType)) {
        throw Helpers_Misc.newError(`Can not use skill.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_05);
    }

    const count                 = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw Helpers_Misc.newError(`Invalid targets count.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_06);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw Helpers_Misc.newError(`Invalid target grid index.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_07);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw Helpers_Misc.newError(`Duplicated target grid index.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_08);
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
