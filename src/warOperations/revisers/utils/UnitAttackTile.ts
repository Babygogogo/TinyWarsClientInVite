import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitAttackTile from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitAttackTile.WoUnitAttackTile, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_01);
    }

    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if ((targetGridIndex == null) || (!targetGridIndex.checkIsInsideMap(mapSize))) {
        throw HelpersMisc.newError(`Invalid targetGridIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_02);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_04);
    }

    const attackerUnit = HelpersMisc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_05);
    if (!attackerUnit.checkCanAttackTileAfterMovePath(rawPathNodes, targetGridIndex)) {
        throw HelpersMisc.newError(`Can not attack.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackTile_06);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitAttackTile : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
