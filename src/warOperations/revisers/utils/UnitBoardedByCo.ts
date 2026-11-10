import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Utils_Common,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBoardedByCo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitBoardedByCo, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_02);
    }

    const focusUnit = war.getUnitMap().getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if ((focusUnit == null) || (!focusUnit.checkCanCoBoardAfterMovePath(rawPathNodes))) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_03);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitBoardedByCo : {
            path         : revisedPath.toProtoMovePath().toJson(),
            launchUnitId : launchUnitId,
        },
    }), revisedPath);
}
