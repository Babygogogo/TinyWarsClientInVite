import {
    Units_Constants,
    Players_Constants,
    Utils_ClientErrorCode,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoPlayerDeleteUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_00);
    }

    const gridIndex         = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex());
    if (gridIndex == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_01);
    }

    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const playerInTurn      = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = unitMap.getUnitOnMap(gridIndex);
    if ((!focusUnit)                                                ||
        (focusUnit.getActionState() !== Units_Constants.ActionStateId.Idle)     ||
        (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
        (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_03);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoPlayerDeleteUnit : {
            gridIndex : gridIndex.toProto().toJson(),
        },
    }));
}
