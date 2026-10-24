import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitBuildTile from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitBuildTile.WoUnitBuildTile, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_02);
    }

    const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
    const focusUnit = war.getUnitMap().getUnit(rawPathNodes[0], launchUnitId);
    if ((focusUnit == null) || (!focusUnit.checkCanBuildOnTile(tile))) {
        throw HelpersMisc.newError(`Invalid focusUnit.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_03);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitBuildTile  : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
