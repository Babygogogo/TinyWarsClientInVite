import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesDropDestination from "../../../auxiliaryTypes/DropDestination.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitDropUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_02);
    }

    const dropDestinations  = rawAction.getDropDestinations();
    if ((!dropDestinations) || (!checkIsDropDestinationsValid(war, rawAction))) {
        throw HelpersMisc.newError(`Invalid dropDestinations.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitDropUnit_03);
    }

    const revisedDropDestinations   = getRevisedDropDestinations(war, rawAction, revisedPath);
    const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < dropDestinations.length);
    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitDropUnit   : {
            path                : revisedPath.toProto().toJson(),
            launchUnitId        : launchUnitId,
            dropDestinations    : revisedDropDestinations.map(v => v.toProto().toJson()),
            isDropBlocked       : isDropBlocked,
        },
    });
}

function checkIsDropDestinationsValid(war: IBwWar, action: ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit): boolean {
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
    const pathNodes     = path.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
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
        const droppingGridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex());
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
            if (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
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
            const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(nextData.getGridIndex());
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

function getRevisedDropDestinations(war: IBwWar, action: ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit, revisedPath: AuxiliaryTypesMovePath.MovePath): AuxiliaryTypesDropDestination.DropDestination[] {
    const destinations: AuxiliaryTypesDropDestination.DropDestination[] = [];
    if (!revisedPath.isBlocked) {
        const unitMap       = war.getUnitMap();
        const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.getLaunchUnitId());
        for (const raw of action.getDropDestinations()) {
            const gridIndex     = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(raw.getGridIndex()));
            const existingUnit  = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit !== loaderUnit)) {
                break;
            } else {
                destinations.push(new AuxiliaryTypesDropDestination.DropDestination(gridIndex, raw.getUnitId() ?? 0));
            }
        }
    }
    return destinations;
}
