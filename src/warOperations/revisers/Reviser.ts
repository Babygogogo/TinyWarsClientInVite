import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { newError } from "../../helpers/Misc.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { revise as revisePlayerDeleteUnit } from "./utils/PlayerDeleteUnit.ts";
import { revise as revisePlayerEndTurn } from "./utils/PlayerEndTurn.ts";
import { revise as revisePlayerProduceUnit } from "./utils/PlayerProduceUnit.ts";
import { revise as revisePlayerSurrender } from "./utils/PlayerSurrender.ts";
import { revise as revisePlayerUseCoSkill } from "./utils/PlayerUseCoSkill.ts";
import { revise as revisePlayerVoteForDraw } from "./utils/PlayerVoteForDraw.ts";
import { revise as reviseSystemBeginTurn } from "./utils/SystemBeginTurn.ts";
import { revise as reviseSystemCallWarEvent } from "./utils/SystemCallWarEvent.ts";
import { revise as reviseSystemDestroyPlayerForce } from "./utils/SystemDestroyPlayerForce.ts";
import { revise as reviseSystemEndTurn } from "./utils/SystemEndTurn.ts";
import { revise as reviseSystemEndWar } from "./utils/SystemEndWar.ts";
import { revise as reviseSystemHandleBootPlayer } from "./utils/SystemHandleBootPlayer.ts";
import { revise as reviseSystemVoteForDraw } from "./utils/SystemVoteForDraw.ts";
import { revise as reviseUnitAttackTile } from "./utils/UnitAttackTile.ts";
import { revise as reviseUnitAttackUnit } from "./utils/UnitAttackUnit.ts";
import { revise as reviseUnitBeLoaded } from "./utils/UnitBeLoaded.ts";
import { revise as reviseUnitBoardedByCo } from "./utils/UnitBoardedByCo.ts";
import { revise as reviseUnitBuildTile } from "./utils/UnitBuildTile.ts";
import { revise as reviseUnitCaptureTile } from "./utils/UnitCaptureTile.ts";
import { revise as reviseUnitCrushUnit } from "./utils/UnitCrushUnit.ts";
import { revise as reviseUnitDive } from "./utils/UnitDive.ts";
import { revise as reviseUnitDropUnit } from "./utils/UnitDropUnit.ts";
import { revise as reviseUnitJoinUnit } from "./utils/UnitJoinUnit.ts";
import { revise as reviseUnitLaunchFlare } from "./utils/UnitLaunchFlare.ts";
import { revise as reviseUnitLaunchSilo } from "./utils/UnitLaunchSilo.ts";
import { revise as reviseUnitProduceUnit } from "./utils/UnitProduceUnit.ts";
import { revise as reviseUnitRepairUnit } from "./utils/UnitRepairUnit.ts";
import { revise as reviseUnitSelfDetonate } from "./utils/UnitSelfDetonate.ts";
import { revise as reviseUnitSupplyUnit } from "./utils/UnitSupplyUnit.ts";
import { revise as reviseUnitSurface } from "./utils/UnitSurface.ts";
import { revise as reviseUnitUseCoSkill } from "./utils/UnitUseCoSkill.ts";
import { revise as reviseUnitWait } from "./utils/UnitWait.ts";
import { revise as reviseUnknown } from "./utils/Unknown.ts";

export function revise(war: IBwWar, rawAction: WoContainer, requesterUserId: Undefinable<number>): WoContainer {
    // if (Object.keys(rawAction).length !== 2) {
    //     throw Helpers.Misc.newError(`Invalid rawAction.keys.`, ClientErrorCode.WarOperationReviser_Revise_00);
    // }

    const operationId = rawAction.getOperationId();
    if ((operationId == null) || (operationId !== war.getExecutedOperationManager().getExecutedOperationsCount())) {
        throw newError(`Invalid actionId: ${operationId}`, ClientErrorCode.WarOperationReviser_Revise_01);
    }

    const action = doRevise(war, rawAction, requesterUserId);
    action.setOperationId(operationId);
    return action;
}

function doRevise(war: IBwWar, rawAction: WoContainer, requesterUserId: Undefinable<number>): WoContainer {
    const woPlayerDeleteUnit = rawAction.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return revisePlayerDeleteUnit(war, woPlayerDeleteUnit, requesterUserId);
    }

    const woPlayerEndTurn = rawAction.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return revisePlayerEndTurn(war, woPlayerEndTurn, requesterUserId);
    }

    const woPlayerProduceUnit = rawAction.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return revisePlayerProduceUnit(war, woPlayerProduceUnit, requesterUserId);
    }

    const woPlayerSurrender = rawAction.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return revisePlayerSurrender(war, woPlayerSurrender, requesterUserId);
    }

    const woPlayerVoteForDraw = rawAction.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return revisePlayerVoteForDraw(war, woPlayerVoteForDraw, requesterUserId);
    }

    const woPlayerUseCoSkill = rawAction.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return revisePlayerUseCoSkill(war, woPlayerUseCoSkill, requesterUserId);
    }

    const woSystemBeginTurn = rawAction.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return reviseSystemBeginTurn(war, woSystemBeginTurn, requesterUserId);
    }

    const woSystemCallWarEvent = rawAction.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return reviseSystemCallWarEvent(war, woSystemCallWarEvent, requesterUserId);
    }

    const woSystemDestroyPlayerForce = rawAction.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return reviseSystemDestroyPlayerForce(war, woSystemDestroyPlayerForce, requesterUserId);
    }

    const woSystemEndWar = rawAction.getWoSystemEndWar();
    if (woSystemEndWar) {
        return reviseSystemEndWar(war, woSystemEndWar, requesterUserId);
    }

    const woSystemEndTurn = rawAction.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return reviseSystemEndTurn(war, woSystemEndTurn, requesterUserId);
    }

    const woSystemHandleBootPlayer = rawAction.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return reviseSystemHandleBootPlayer(war, woSystemHandleBootPlayer, requesterUserId);
    }

    const woSystemVoteForDraw = rawAction.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return reviseSystemVoteForDraw(war, woSystemVoteForDraw, requesterUserId);
    }

    const woUnitAttackTile = rawAction.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return reviseUnitAttackTile(war, woUnitAttackTile, requesterUserId);
    }

    const woUnitAttackUnit = rawAction.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return reviseUnitAttackUnit(war, woUnitAttackUnit, requesterUserId);
    }

    const woUnitBeLoaded = rawAction.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return reviseUnitBeLoaded(war, woUnitBeLoaded, requesterUserId);
    }

    const woUnitBuildTile = rawAction.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return reviseUnitBuildTile(war, woUnitBuildTile, requesterUserId);
    }

    const woUnitCaptureTile = rawAction.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return reviseUnitCaptureTile(war, woUnitCaptureTile, requesterUserId);
    }

    const woUnitCrushUnit = rawAction.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return reviseUnitCrushUnit(war, woUnitCrushUnit, requesterUserId);
    }

    const woUnitDive = rawAction.getWoUnitDive();
    if (woUnitDive) {
        return reviseUnitDive(war, woUnitDive, requesterUserId);
    }

    const woUnitDropUnit = rawAction.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return reviseUnitDropUnit(war, woUnitDropUnit, requesterUserId);
    }

    const woUnitJoinUnit = rawAction.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return reviseUnitJoinUnit(war, woUnitJoinUnit, requesterUserId);
    }

    const woUnitLaunchFlare = rawAction.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return reviseUnitLaunchFlare(war, woUnitLaunchFlare, requesterUserId);
    }

    const woUnitLaunchSilo = rawAction.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return reviseUnitLaunchSilo(war, woUnitLaunchSilo, requesterUserId);
    }

    const woUnitBoardedByCo = rawAction.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return reviseUnitBoardedByCo(war, woUnitBoardedByCo, requesterUserId);
    }

    const woUnitProduceUnit = rawAction.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return reviseUnitProduceUnit(war, woUnitProduceUnit, requesterUserId);
    }

    const woUnitRepairUnit = rawAction.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return reviseUnitRepairUnit(war, woUnitRepairUnit, requesterUserId);
    }

    const woUnitSelfDetonate = rawAction.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return reviseUnitSelfDetonate(war, woUnitSelfDetonate, requesterUserId);
    }

    const woUnitSupplyUnit = rawAction.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return reviseUnitSupplyUnit(war, woUnitSupplyUnit, requesterUserId);
    }

    const woUnitSurface = rawAction.getWoUnitSurface();
    if (woUnitSurface) {
        return reviseUnitSurface(war, woUnitSurface, requesterUserId);
    }

    const woUnitUseCoSkill = rawAction.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return reviseUnitUseCoSkill(war, woUnitUseCoSkill, requesterUserId);
    }

    const woUnitWait = rawAction.getWoUnitWait();
    if (woUnitWait) {
        return reviseUnitWait(war, woUnitWait, requesterUserId);
    }

    return reviseUnknown();
}
