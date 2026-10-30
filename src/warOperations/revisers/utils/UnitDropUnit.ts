import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Visibilities_Utils,
    Utils_ClientErrorCode,
    AuxiliaryTypes_DropDestination,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MovePath,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitDropUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitDropUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId, 
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_02);
    }

    const dropDestinations  = rawAction.getDropDestinations();
    if ((!dropDestinations) || (!checkIsDropDestinationsValid(war, rawAction))) {
        throw Helpers_Misc.newError(`Invalid dropDestinations.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_03);
    }

    const revisedDropDestinations   = getRevisedDropDestinations(war, rawAction, revisedPath);
    const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < dropDestinations.length);
    return WoContainer.fromJson({
        WoUnitDropUnit : {
            path             : revisedPath.toProto().toJson(),
            launchUnitId     : launchUnitId,
            dropDestinations : revisedDropDestinations.map(v => v.toProto().toJson()),
            isDropBlocked    : isDropBlocked,
        },
    });
}

function checkIsDropDestinationsValid(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit): boolean {
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
    const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v)));
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
        const droppingGridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex());
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
            if (Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
                war               : war,
                gridIndex         : droppingGridIndex,
                unitType          : existingUnit.getUnitType(),
                isDiving          : existingUnit.getIsDiving(),
                isInvisible       : existingUnit.checkIsInvisible(droppingGridIndex),
                unitPlayerIndex   : existingUnit.getPlayerIndex(),
                observerTeamIndex : teamIndex,
            })) {
                return false;
            }
        }

        for (let j = i + 1; j < destinationsCount; ++j) {
            const nextData  = destinations[j];
            const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(nextData.getGridIndex());
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

function getRevisedDropDestinations(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit, revisedPath: AuxiliaryTypes_MovePath.MovePath): AuxiliaryTypes_DropDestination.DropDestination[] {
    const destinations: AuxiliaryTypes_DropDestination.DropDestination[] = [];
    if (!revisedPath.isBlocked) {
        const unitMap       = war.getUnitMap();
        const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.getLaunchUnitId());
        for (const raw of action.getDropDestinations()) {
            const gridIndex     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(raw.getGridIndex()));
            const existingUnit  = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit !== loaderUnit)) {
                break;
            } else {
                destinations.push(new AuxiliaryTypes_DropDestination.DropDestination(gridIndex, raw.getUnitId() ?? 0));
            }
        }
    }
    return destinations;
}
