import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitDive } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDive.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getRevisedPath, checkIsPathDestinationOccupiedByOtherVisibleUnit } from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function revise(war: IBwWar, rawAction: WoUnitDive, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitDive_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitDive_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitDive_02);
    }

    const focusUnit = getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitDive_03);
    if (!focusUnit.checkCanDive()) {
        throw newError(`Can not dive.`, ClientErrorCode.WarOperationReviser_ReviseUnitDive_04);
    }

    return WoContainer.fromJson({
        WoUnitDive   : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
