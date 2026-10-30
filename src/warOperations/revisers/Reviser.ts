import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    WarOperations_Revisers_Utils_PlayerDeleteUnit,
    WarOperations_Revisers_Utils_PlayerEndTurn,
    WarOperations_Revisers_Utils_PlayerProduceUnit,
    WarOperations_Revisers_Utils_PlayerSurrender,
    WarOperations_Revisers_Utils_PlayerUseCoSkill,
    WarOperations_Revisers_Utils_PlayerVoteForDraw,
    WarOperations_Revisers_Utils_SystemBeginTurn,
    WarOperations_Revisers_Utils_SystemCallWarEvent,
    WarOperations_Revisers_Utils_SystemDestroyPlayerForce,
    WarOperations_Revisers_Utils_SystemEndTurn,
    WarOperations_Revisers_Utils_SystemEndWar,
    WarOperations_Revisers_Utils_SystemHandleBootPlayer,
    WarOperations_Revisers_Utils_SystemVoteForDraw,
    WarOperations_Revisers_Utils_UnitAttackTile,
    WarOperations_Revisers_Utils_UnitAttackUnit,
    WarOperations_Revisers_Utils_UnitBeLoaded,
    WarOperations_Revisers_Utils_UnitBoardedByCo,
    WarOperations_Revisers_Utils_UnitBuildTile,
    WarOperations_Revisers_Utils_UnitCaptureTile,
    WarOperations_Revisers_Utils_UnitCrushUnit,
    WarOperations_Revisers_Utils_UnitDive,
    WarOperations_Revisers_Utils_UnitDropUnit,
    WarOperations_Revisers_Utils_UnitJoinUnit,
    WarOperations_Revisers_Utils_UnitLaunchFlare,
    WarOperations_Revisers_Utils_UnitLaunchSilo,
    WarOperations_Revisers_Utils_UnitProduceUnit,
    WarOperations_Revisers_Utils_UnitRepairUnit,
    WarOperations_Revisers_Utils_UnitSelfDetonate,
    WarOperations_Revisers_Utils_UnitSupplyUnit,
    WarOperations_Revisers_Utils_UnitSurface,
    WarOperations_Revisers_Utils_UnitUseCoSkill,
    WarOperations_Revisers_Utils_UnitWait,
    WarOperations_Revisers_Utils_Unknown,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoContainer, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    // if (Object.keys(rawAction).length !== 2) {
    //     throw Helpers.Misc.newError(`Invalid rawAction.keys.`, ClientErrorCode.WarOperationReviser_Revise_00);
    // }

    const operationId = rawAction.getOperationId();
    if ((operationId == null) || (operationId !== war.getExecutedOperationManager().getExecutedOperationsCount())) {
        throw Helpers_Misc.newError(`Invalid actionId: ${operationId}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_Revise_01);
    }

    const action = doRevise(war, rawAction, requesterUserId);
    action.setOperationId(operationId);
    return action;
}

function doRevise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoContainer, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    const woPlayerDeleteUnit = rawAction.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return WarOperations_Revisers_Utils_PlayerDeleteUnit.revise(war, woPlayerDeleteUnit, requesterUserId);
    }

    const woPlayerEndTurn = rawAction.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return WarOperations_Revisers_Utils_PlayerEndTurn.revise(war, woPlayerEndTurn, requesterUserId);
    }

    const woPlayerProduceUnit = rawAction.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return WarOperations_Revisers_Utils_PlayerProduceUnit.revise(war, woPlayerProduceUnit, requesterUserId);
    }

    const woPlayerSurrender = rawAction.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return WarOperations_Revisers_Utils_PlayerSurrender.revise(war, woPlayerSurrender, requesterUserId);
    }

    const woPlayerVoteForDraw = rawAction.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return WarOperations_Revisers_Utils_PlayerVoteForDraw.revise(war, woPlayerVoteForDraw, requesterUserId);
    }

    const woPlayerUseCoSkill = rawAction.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return WarOperations_Revisers_Utils_PlayerUseCoSkill.revise(war, woPlayerUseCoSkill, requesterUserId);
    }

    const woSystemBeginTurn = rawAction.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return WarOperations_Revisers_Utils_SystemBeginTurn.revise(war, woSystemBeginTurn, requesterUserId);
    }

    const woSystemCallWarEvent = rawAction.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return WarOperations_Revisers_Utils_SystemCallWarEvent.revise(war, woSystemCallWarEvent, requesterUserId);
    }

    const woSystemDestroyPlayerForce = rawAction.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return WarOperations_Revisers_Utils_SystemDestroyPlayerForce.revise(war, woSystemDestroyPlayerForce, requesterUserId);
    }

    const woSystemEndWar = rawAction.getWoSystemEndWar();
    if (woSystemEndWar) {
        return WarOperations_Revisers_Utils_SystemEndWar.revise(war, woSystemEndWar, requesterUserId);
    }

    const woSystemEndTurn = rawAction.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return WarOperations_Revisers_Utils_SystemEndTurn.revise(war, woSystemEndTurn, requesterUserId);
    }

    const woSystemHandleBootPlayer = rawAction.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return WarOperations_Revisers_Utils_SystemHandleBootPlayer.revise(war, woSystemHandleBootPlayer, requesterUserId);
    }

    const woSystemVoteForDraw = rawAction.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return WarOperations_Revisers_Utils_SystemVoteForDraw.revise(war, woSystemVoteForDraw, requesterUserId);
    }

    const woUnitAttackTile = rawAction.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return WarOperations_Revisers_Utils_UnitAttackTile.revise(war, woUnitAttackTile, requesterUserId);
    }

    const woUnitAttackUnit = rawAction.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return WarOperations_Revisers_Utils_UnitAttackUnit.revise(war, woUnitAttackUnit, requesterUserId);
    }

    const woUnitBeLoaded = rawAction.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return WarOperations_Revisers_Utils_UnitBeLoaded.revise(war, woUnitBeLoaded, requesterUserId);
    }

    const woUnitBuildTile = rawAction.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return WarOperations_Revisers_Utils_UnitBuildTile.revise(war, woUnitBuildTile, requesterUserId);
    }

    const woUnitCaptureTile = rawAction.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return WarOperations_Revisers_Utils_UnitCaptureTile.revise(war, woUnitCaptureTile, requesterUserId);
    }

    const woUnitCrushUnit = rawAction.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return WarOperations_Revisers_Utils_UnitCrushUnit.revise(war, woUnitCrushUnit, requesterUserId);
    }

    const woUnitDive = rawAction.getWoUnitDive();
    if (woUnitDive) {
        return WarOperations_Revisers_Utils_UnitDive.revise(war, woUnitDive, requesterUserId);
    }

    const woUnitDropUnit = rawAction.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return WarOperations_Revisers_Utils_UnitDropUnit.revise(war, woUnitDropUnit, requesterUserId);
    }

    const woUnitJoinUnit = rawAction.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return WarOperations_Revisers_Utils_UnitJoinUnit.revise(war, woUnitJoinUnit, requesterUserId);
    }

    const woUnitLaunchFlare = rawAction.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return WarOperations_Revisers_Utils_UnitLaunchFlare.revise(war, woUnitLaunchFlare, requesterUserId);
    }

    const woUnitLaunchSilo = rawAction.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return WarOperations_Revisers_Utils_UnitLaunchSilo.revise(war, woUnitLaunchSilo, requesterUserId);
    }

    const woUnitBoardedByCo = rawAction.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return WarOperations_Revisers_Utils_UnitBoardedByCo.revise(war, woUnitBoardedByCo, requesterUserId);
    }

    const woUnitProduceUnit = rawAction.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return WarOperations_Revisers_Utils_UnitProduceUnit.revise(war, woUnitProduceUnit, requesterUserId);
    }

    const woUnitRepairUnit = rawAction.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return WarOperations_Revisers_Utils_UnitRepairUnit.revise(war, woUnitRepairUnit, requesterUserId);
    }

    const woUnitSelfDetonate = rawAction.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return WarOperations_Revisers_Utils_UnitSelfDetonate.revise(war, woUnitSelfDetonate, requesterUserId);
    }

    const woUnitSupplyUnit = rawAction.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return WarOperations_Revisers_Utils_UnitSupplyUnit.revise(war, woUnitSupplyUnit, requesterUserId);
    }

    const woUnitSurface = rawAction.getWoUnitSurface();
    if (woUnitSurface) {
        return WarOperations_Revisers_Utils_UnitSurface.revise(war, woUnitSurface, requesterUserId);
    }

    const woUnitUseCoSkill = rawAction.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return WarOperations_Revisers_Utils_UnitUseCoSkill.revise(war, woUnitUseCoSkill, requesterUserId);
    }

    const woUnitWait = rawAction.getWoUnitWait();
    if (woUnitWait) {
        return WarOperations_Revisers_Utils_UnitWait.revise(war, woUnitWait, requesterUserId);
    }

    return WarOperations_Revisers_Utils_Unknown.revise();
}
