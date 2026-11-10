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
import type { WoUnitCaptureTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitCaptureTile, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitCaptureTile_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitCaptureTile_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitCaptureTile_02);
    }

    const focusUnit = war.getUnitMap().getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if (focusUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitCaptureTile_03);
    }

    const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
    if (!focusUnit.checkCanCaptureTile(tile)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitCaptureTile_04);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitCaptureTile : {
            path         : revisedPath.toProtoMovePath().toJson(),
            launchUnitId : launchUnitId,
        },
    }), revisedPath);
}
