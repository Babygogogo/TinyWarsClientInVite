import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare.WoUnitLaunchFlare, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_02);
    }

    const rawDestination    = rawPathNodes[rawPathNodes.length - 1];
    const unitMap           = war.getUnitMap();
    const focusUnit         = HelpersMisc.getExisted(unitMap.getUnit(rawPathNodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_03);
    const mapSize           = unitMap.getMapSize();
    const flareMaxRange     = HelpersMisc.getExisted(focusUnit.getFlareMaxRange(rawDestination), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_04);
    const targetGridIndex   = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_05);
    if ((rawPathNodes.length !== 1)                                     ||
        (!focusUnit.getFlareCurrentAmmo())                              ||
        (!war.getFogMap().checkHasFogCurrently())                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))                    ||
        (targetGridIndex.getDistance(rawDestination) > flareMaxRange)
    ) {
        throw HelpersMisc.newError(`Can not launch.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_06);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitLaunchFlare: {
            path            : WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }).toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
