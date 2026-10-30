import {
    Units_Constants,
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerDeleteUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_00);
    }

    const gridIndex         = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_01);
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const playerInTurn      = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = unitMap.getUnitOnMap(gridIndex);
    if ((!focusUnit)                                                ||
        (focusUnit.getActionState() !== Units_Constants.ActionStateId.Idle)     ||
        (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
        (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
    ) {
        throw Helpers_Misc.newError(`Invalid focusUnit.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_03);
    }

    return WoContainer.fromJson({
        WoPlayerDeleteUnit   : {
            gridIndex   : gridIndex.toProto().toJson(),
        },
    });
}
