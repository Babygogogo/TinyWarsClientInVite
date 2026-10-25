import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBuildTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getRevisedPath, checkIsPathDestinationOccupiedByOtherVisibleUnit } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitBuildTile, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_02);
    }

    const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
    const focusUnit = war.getUnitMap().getUnit(rawPathNodes[0], launchUnitId);
    if ((focusUnit == null) || (!focusUnit.checkCanBuildOnTile(tile))) {
        throw newError(`Invalid focusUnit.`, ClientErrorCode.WarOperationReviser_ReviseUnitBuildTile_03);
    }

    return WoContainer.fromJson({
        WoUnitBuildTile  : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
