import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSelfDetonate } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitSelfDetonate, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = Helpers_Misc.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId));
    if (!focusUnit.getTemplateCfg().getSelfDetonateCfg()) {
        throw Helpers_Misc.newError(`Can not self detonate.`);
    }

    return WoContainer.fromJson({
        WoUnitSelfDetonate : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
