import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type Units_Unit,
    type Units_UnitMap,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSupplyUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitSupplyUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId, 
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = Helpers_Misc.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId),Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_03);
    if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
        throw Helpers_Misc.newError(`Can not supply.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_04);
    }

    return WoContainer.fromJson({
        WoUnitSupplyUnit : {
            path         : revisedPath.toProto().toJson(),
            launchUnitId : launchUnitId,
        },
    });
}

function checkCanDoSupply(unitMap: Units_UnitMap.UnitMap, focusUnit: Units_Unit.Unit, destination: AuxiliaryTypes_GridIndex.GridIndex): boolean {
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
