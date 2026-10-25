import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsPathDestinationOccupiedByOtherVisibleUnit, getRevisedPath } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitLaunchFlare, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_02);
    }

    const rawDestination    = rawPathNodes[rawPathNodes.length - 1];
    const unitMap           = war.getUnitMap();
    const focusUnit         = getExisted(unitMap.getUnit(rawPathNodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_03);
    const mapSize           = unitMap.getMapSize();
    const flareMaxRange     = getExisted(focusUnit.getFlareMaxRange(rawDestination), ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_04);
    const targetGridIndex   = getExisted(GridIndex.convertGridIndex(rawAction.getTargetGridIndex()), ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_05);
    if ((rawPathNodes.length !== 1)                                     ||
        (!focusUnit.getFlareCurrentAmmo())                              ||
        (!war.getFogMap().checkHasFogCurrently())                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))                    ||
        (targetGridIndex.getDistance(rawDestination) > flareMaxRange)
    ) {
        throw newError(`Can not launch.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_06);
    }

    return WoContainer.fromJson({
        WoUnitLaunchFlare: {
            path            : getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }).toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
