import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit.WoPlayerDeleteUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_00);
    }

    const gridIndex         = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_01);
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const playerInTurn      = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = unitMap.getUnitOnMap(gridIndex);
    if ((!focusUnit)                                                ||
        (focusUnit.getActionState() !== UnitsConstants.ActionStateId.Idle)     ||
        (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
        (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
    ) {
        throw HelpersMisc.newError(`Invalid focusUnit.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerDeleteUnit_03);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerDeleteUnit   : {
            gridIndex   : gridIndex.toProto().toJson(),
        },
    });
}
