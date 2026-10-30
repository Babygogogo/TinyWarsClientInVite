import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { DropDestination } from "../../../auxiliaryTypes/DropDestination.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitDropUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsUnitOnMapVisibleToTeam } from "../../../visibilities/Utils.ts";
import {
    getRevisedPath,
    checkIsPathDestinationOccupiedByOtherVisibleUnit,
} from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitDropUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_02);
    }

    const dropDestinations  = rawAction.getDropDestinations();
    if ((!dropDestinations) || (!checkIsDropDestinationsValid(war, rawAction))) {
        throw newError(`Invalid dropDestinations.`, ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_03);
    }

    const revisedDropDestinations   = getRevisedDropDestinations(war, rawAction, revisedPath);
    const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < dropDestinations.length);
    return WoContainer.fromJson({
        WoUnitDropUnit   : {
            path                : revisedPath.toProto().toJson(),
            launchUnitId        : launchUnitId,
            dropDestinations    : revisedDropDestinations.map(v => v.toProto().toJson()),
            isDropBlocked       : isDropBlocked,
        },
    });
}

function checkIsDropDestinationsValid(war: IBwWar, action: WoUnitDropUnit): boolean {
    const destinations = action.getDropDestinations();
    if (destinations == null) {
        return false;
    }

    const destinationsCount = destinations.length;
    if (destinationsCount <= 0) {
        return false;
    }

    const path = action.getPath();
    if (path == null) {
        return false;
    }

    const unitMap       = war.getUnitMap();
    const pathNodes     = path.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v)));
    const loaderUnit    = unitMap.getUnit(pathNodes[0], action.getLaunchUnitId());
    if (loaderUnit == null) {
        return false;
    }

    const tileMap                   = war.getTileMap();
    const loaderEndingGridIndex     = pathNodes[pathNodes.length - 1];
    const loaderEndingTile          = tileMap.getTile(loaderEndingGridIndex);
    if (loaderEndingTile == null) {
        return false;
    }

    const loaderEndingTileType = loaderEndingTile.getTileTypeId();
    if (loaderEndingTileType == null) {
        return false;
    }
    if (!loaderUnit.checkCanDropLoadedUnit(loaderEndingTileType)) {
        return false;
    }

    const mapSize = tileMap.getMapSize();
    if (mapSize == null) {
        return false;
    }

    const loaderUnitId  = loaderUnit.getUnitId();
    const teamIndex     = loaderUnit.getTeamIndex();
    if (teamIndex == null) {
        return false;
    }

    for (let i = 0; i < destinationsCount; ++i) {
        const data              = destinations[i];
        const droppingGridIndex = GridIndex.convertGridIndex(data.getGridIndex());
        if ((!droppingGridIndex)                                        ||
            (!droppingGridIndex.checkIsInsideMap(mapSize))              ||
            (!droppingGridIndex.checkIsAdjacent(loaderEndingGridIndex))
        ) {
            return false;
        }

        const droppingUnitId = data.getUnitId();
        if (droppingUnitId == null) {
            return false;
        }

        const dropTargetTile = tileMap.getTile(droppingGridIndex);
        if (dropTargetTile == null) {
            return false;
        }

        const droppingUnit = unitMap.getUnitLoadedById(droppingUnitId);
        if ((droppingUnit == null)                                      ||
            (droppingUnit.getLoaderUnitId() !== loaderUnitId)           ||
            (loaderEndingTile.getMoveCostByUnit(droppingUnit) == null)  ||
            (dropTargetTile.getMoveCostByUnit(droppingUnit) == null)
        ) {
            return false;
        }

        const existingUnit = unitMap.getUnitOnMap(droppingGridIndex);
        if ((existingUnit) && (existingUnit !== loaderUnit)) {
            if (checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                gridIndex           : droppingGridIndex,
                unitType            : existingUnit.getUnitType(),
                isDiving            : existingUnit.getIsDiving(),
                isInvisible         : existingUnit.checkIsInvisible(droppingGridIndex),
                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                observerTeamIndex   : teamIndex,
            })) {
                return false;
            }
        }

        for (let j = i + 1; j < destinationsCount; ++j) {
            const nextData  = destinations[j];
            const gridIndex = GridIndex.convertGridIndex(nextData.getGridIndex());
            if ((!gridIndex)                                ||
                (droppingUnitId === nextData.getUnitId())   ||
                (droppingGridIndex.checkIsEqual(gridIndex))
            ) {
                return false;
            }
        }
    }

    return true;
}

function getRevisedDropDestinations(war: IBwWar, action: WoUnitDropUnit, revisedPath: MovePath): DropDestination[] {
    const destinations: DropDestination[] = [];
    if (!revisedPath.isBlocked) {
        const unitMap       = war.getUnitMap();
        const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.getLaunchUnitId());
        for (const raw of action.getDropDestinations()) {
            const gridIndex     = getExisted(GridIndex.convertGridIndex(raw.getGridIndex()));
            const existingUnit  = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit !== loaderUnit)) {
                break;
            } else {
                destinations.push(new DropDestination(gridIndex, raw.getUnitId() ?? 0));
            }
        }
    }
    return destinations;
}
