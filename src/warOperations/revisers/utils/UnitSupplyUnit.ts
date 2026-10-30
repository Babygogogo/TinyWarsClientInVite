import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSupplyUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import type { IUnitMap } from "../../../units/IUnitMap.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import {
    getRevisedPath,
    checkIsPathDestinationOccupiedByOtherVisibleUnit,
} from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitSupplyUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId),ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_03);
    if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
        throw newError(`Can not supply.`, ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_04);
    }

    return WoContainer.fromJson({
        WoUnitSupplyUnit : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}

function checkCanDoSupply(unitMap: IUnitMap, focusUnit: IUnit, destination: GridIndex): boolean {
    if (focusUnit.checkIsAdjacentUnitSupplier()) {
        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            return false;
        }

        const playerIndex = focusUnit.getPlayerIndex();
        for (const gridIndex of destination.getAdjacentGrids(mapSize)) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                return true;
            }
        }
    }

    return false;
}
