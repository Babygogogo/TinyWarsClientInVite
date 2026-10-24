import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../../../coSkills/Constants.ts";
import * as CoSkillsUtilsCommon from "../../../coSkills/utils/Common.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill.WoUnitUseCoSkill, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_02);
    }

    const focusUnit = HelpersMisc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_03);
    const skillType = rawAction.getSkillType() as CoSkillsConstants.SkillTypeId;
    if ((skillType !== CoSkillsConstants.SkillTypeId.Power)     &&
        (skillType !== CoSkillsConstants.SkillTypeId.SuperPower)
    ) {
        throw HelpersMisc.newError(`Invalid skillType: ${skillType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_04);
    }

    if (!focusUnit.checkCanUseCoSkill(skillType)) {
        throw HelpersMisc.newError(`Can not use skill.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_05);
    }

    const count                 = CoSkillsUtilsCommon.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
    const targetGridIndexArray  = rawAction.getTargetGridIndexArray();
    if (count != targetGridIndexArray.length) {
        throw HelpersMisc.newError(`Invalid targets count.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_06);
    }

    const mapSize     = war.getTileMap().getMapSize();
    const gridIdSet   = new Set<number>();
    for (const protoGridIndex of targetGridIndexArray) {
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(protoGridIndex);
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw HelpersMisc.newError(`Invalid target grid index.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_07);
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            throw HelpersMisc.newError(`Duplicated target grid index.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitUseCoSkill_08);
        }

        gridIdSet.add(gridId);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitUseCoSkill : {
            path                    : revisedPath.toProto().toJson(),
            launchUnitId            : launchUnitId,
            skillType               : skillType,
            targetGridIndexArray    : targetGridIndexArray.map(v => v.toJson()),
        },
    });
}
