import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Utils_Common,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
    type Units_Unit,
    type Units_UnitMap,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSupplyUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitSupplyUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = Helpers_Misc.getExisted(unitMap.getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId),Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_03);
    if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
        throw Helpers_Misc.newError(`Can not supply.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_04);
    }

    return WoContainer.fromJson({
        WoUnitSupplyUnit : {
            path         : revisedPath.toProtoMovePath().toJson(),
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
