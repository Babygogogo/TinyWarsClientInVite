import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import type { MovePath as ProtoMovePath } from "../../../proto/schema/CommonProto/Structure/MovePath.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsUnitOnMapVisibleToTeam } from "../../../visibilities/Utils.ts";

export function getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }: {
    war             : IBwWar;
    rawPath         : Undefinable<ProtoMovePath>;
    launchUnitId    : Undefinable<number>;
    requesterUserId : Undefinable<number>;
}): MovePath {
    if (rawPath == null) {
        throw newError(`Empty rawPath.`, ClientErrorCode.BwHelpers_GetRevisedPath_00);
    }

    const rawPathNodes = rawPath.getNodes();
    if ((rawPathNodes == null) || (!rawPathNodes.length)) {
        throw newError(`Empty rawPathNodes.`, ClientErrorCode.BwHelpers_GetRevisedPath_01);
    }

    const beginningGridIndex    = getExisted(GridIndex.convertGridIndex(rawPathNodes[0]), ClientErrorCode.BwHelpers_GetRevisedPath_02);
    const playerInTurn          = war.getPlayerInTurn();
    const unitMap               = war.getUnitMap();
    const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
    if ((!focusUnit)                                                    ||
        (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
        (focusUnit.getActionState() !== ActionStateId.Idle)         ||
        (war.getTurnPhaseCode() !== PhaseCode.Main)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid focusUnit.`, ClientErrorCode.BwHelpers_GetRevisedPath_03);
    }

    if (launchUnitId != null) {
        if (!focusUnit.getGridIndex().checkIsEqual(beginningGridIndex)) {
            throw newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_04);
        }
    }

    const tileMap                   = war.getTileMap();
    const mapSize                   = tileMap.getMapSize();
    const teamIndexInTurn           = playerInTurn.getTeamIndex();
    const maxFuelConsumption        = focusUnit.getFinalMoveRange();
    const revisedNodes              = [beginningGridIndex.clone()];
    let revisedTotalFuelConsumption = 0;
    let rawTotalFuelConsumption     = 0;
    let isBlocked                   = false;
    for (let i = 1; i < rawPathNodes.length; ++i) {
        const gridIndex = GridIndex.convertGridIndex(rawPathNodes[i]);
        if ((!gridIndex)                                                                                            ||
            (!gridIndex.checkIsAdjacent(getExisted(GridIndex.convertGridIndex(rawPathNodes[i - 1]))))  ||
            (!gridIndex.checkIsInsideMap(mapSize))                                                                  ||
            (revisedNodes.some(g => g.checkIsEqual(gridIndex)))
        ) {
            throw newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_05);
        }

        const tile              = tileMap.getTile(gridIndex);
        const fuelConsumption   = getExisted(tile.getMoveCostByUnit(focusUnit), ClientErrorCode.BwHelpers_GetRevisedPath_06);
        rawTotalFuelConsumption += fuelConsumption;
        if (rawTotalFuelConsumption > maxFuelConsumption) {
            throw newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, ClientErrorCode.BwHelpers_GetRevisedPath_07);
        }

        const existingUnit = unitMap.getUnitOnMap(gridIndex);
        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
            if (checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                gridIndex           : gridIndex,
                unitType            : existingUnit.getUnitType(),
                isDiving            : existingUnit.getIsDiving(),
                isInvisible         : existingUnit.checkIsInvisible(gridIndex),
                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                observerTeamIndex   : teamIndexInTurn,
            })) {
                throw newError(`There is a blocking visible unit.`, ClientErrorCode.BwHelpers_GetRevisedPath_08);
            } else {
                isBlocked = true;
            }
        }

        if (!isBlocked) {
            revisedTotalFuelConsumption = rawTotalFuelConsumption;
            revisedNodes.push(gridIndex.clone());
        }
    }

    return new MovePath(revisedNodes, revisedTotalFuelConsumption, isBlocked);
}

export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: IBwWar, rawPath: GridIndex[]): boolean {
    if (rawPath.length == 1) {
        return false;
    } else {
        const unitMap       = war.getUnitMap();
        const destination   = rawPath[rawPath.length - 1];
        const unit          = unitMap.getUnitOnMap(destination);
        if (unit == null) {
            return false;
        } else {
            return checkIsUnitOnMapVisibleToTeam({
                war,
                gridIndex           : destination,
                unitType            : unit.getUnitType(),
                isDiving            : unit.getIsDiving(),
                isInvisible         : unit.checkIsInvisible(destination),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerTeamIndex   : getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
            });
        }
    }
}
