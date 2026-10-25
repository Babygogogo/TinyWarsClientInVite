import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(war: IBwWar, rawAction: WoPlayerDeleteUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_00);
    }

    const gridIndex         = getExisted(GridIndex.convertGridIndex(rawAction.getGridIndex()), ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_01);
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const playerInTurn      = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = unitMap.getUnitOnMap(gridIndex);
    if ((!focusUnit)                                                ||
        (focusUnit.getActionState() !== ActionStateId.Idle)     ||
        (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
        (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
    ) {
        throw newError(`Invalid focusUnit.`, ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_03);
    }

    return WoContainer.fromJson({
        WoPlayerDeleteUnit   : {
            gridIndex   : gridIndex.toProto().toJson(),
        },
    });
}
