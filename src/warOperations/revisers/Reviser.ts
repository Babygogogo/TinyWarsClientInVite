import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../baseWar/interface/IBwWar.ts";
import { newError } from "../../helpers/Misc.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { revise as WarOperationsRevisersUtilsPlayerDeleteUnitRevise } from "./utils/PlayerDeleteUnit.ts";
import { revise as WarOperationsRevisersUtilsPlayerEndTurnRevise } from "./utils/PlayerEndTurn.ts";
import { revise as WarOperationsRevisersUtilsPlayerProduceUnitRevise } from "./utils/PlayerProduceUnit.ts";
import { revise as WarOperationsRevisersUtilsPlayerSurrenderRevise } from "./utils/PlayerSurrender.ts";
import { revise as WarOperationsRevisersUtilsPlayerUseCoSkillRevise } from "./utils/PlayerUseCoSkill.ts";
import { revise as WarOperationsRevisersUtilsPlayerVoteForDrawRevise } from "./utils/PlayerVoteForDraw.ts";
import { revise as WarOperationsRevisersUtilsSystemBeginTurnRevise } from "./utils/SystemBeginTurn.ts";
import { revise as WarOperationsRevisersUtilsSystemCallWarEventRevise } from "./utils/SystemCallWarEvent.ts";
import { revise as WarOperationsRevisersUtilsSystemDestroyPlayerForceRevise } from "./utils/SystemDestroyPlayerForce.ts";
import { revise as WarOperationsRevisersUtilsSystemEndTurnRevise } from "./utils/SystemEndTurn.ts";
import { revise as WarOperationsRevisersUtilsSystemEndWarRevise } from "./utils/SystemEndWar.ts";
import { revise as WarOperationsRevisersUtilsSystemHandleBootPlayerRevise } from "./utils/SystemHandleBootPlayer.ts";
import { revise as WarOperationsRevisersUtilsSystemVoteForDrawRevise } from "./utils/SystemVoteForDraw.ts";
import { revise as WarOperationsRevisersUtilsUnitAttackTileRevise } from "./utils/UnitAttackTile.ts";
import { revise as WarOperationsRevisersUtilsUnitAttackUnitRevise } from "./utils/UnitAttackUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitBeLoadedRevise } from "./utils/UnitBeLoaded.ts";
import { revise as WarOperationsRevisersUtilsUnitBoardedByCoRevise } from "./utils/UnitBoardedByCo.ts";
import { revise as WarOperationsRevisersUtilsUnitBuildTileRevise } from "./utils/UnitBuildTile.ts";
import { revise as WarOperationsRevisersUtilsUnitCaptureTileRevise } from "./utils/UnitCaptureTile.ts";
import { revise as WarOperationsRevisersUtilsUnitCrushUnitRevise } from "./utils/UnitCrushUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitDiveRevise } from "./utils/UnitDive.ts";
import { revise as WarOperationsRevisersUtilsUnitDropUnitRevise } from "./utils/UnitDropUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitJoinUnitRevise } from "./utils/UnitJoinUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitLaunchFlareRevise } from "./utils/UnitLaunchFlare.ts";
import { revise as WarOperationsRevisersUtilsUnitLaunchSiloRevise } from "./utils/UnitLaunchSilo.ts";
import { revise as WarOperationsRevisersUtilsUnitProduceUnitRevise } from "./utils/UnitProduceUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitRepairUnitRevise } from "./utils/UnitRepairUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitSelfDetonateRevise } from "./utils/UnitSelfDetonate.ts";
import { revise as WarOperationsRevisersUtilsUnitSupplyUnitRevise } from "./utils/UnitSupplyUnit.ts";
import { revise as WarOperationsRevisersUtilsUnitSurfaceRevise } from "./utils/UnitSurface.ts";
import { revise as WarOperationsRevisersUtilsUnitUseCoSkillRevise } from "./utils/UnitUseCoSkill.ts";
import { revise as WarOperationsRevisersUtilsUnitWaitRevise } from "./utils/UnitWait.ts";
import { revise as WarOperationsRevisersUtilsUnknownRevise } from "./utils/Unknown.ts";

type IBwWar             = BaseWarInterfaceIBwWar;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

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
        return WarOperationsRevisersUtilsPlayerDeleteUnitRevise(war, woPlayerDeleteUnit, requesterUserId);
    }

    const woPlayerEndTurn = rawAction.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return WarOperationsRevisersUtilsPlayerEndTurnRevise(war, woPlayerEndTurn, requesterUserId);
    }

    const woPlayerProduceUnit = rawAction.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return WarOperationsRevisersUtilsPlayerProduceUnitRevise(war, woPlayerProduceUnit, requesterUserId);
    }

    const woPlayerSurrender = rawAction.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return WarOperationsRevisersUtilsPlayerSurrenderRevise(war, woPlayerSurrender, requesterUserId);
    }

    const woPlayerVoteForDraw = rawAction.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return WarOperationsRevisersUtilsPlayerVoteForDrawRevise(war, woPlayerVoteForDraw, requesterUserId);
    }

    const woPlayerUseCoSkill = rawAction.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return WarOperationsRevisersUtilsPlayerUseCoSkillRevise(war, woPlayerUseCoSkill, requesterUserId);
    }

    const woSystemBeginTurn = rawAction.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return WarOperationsRevisersUtilsSystemBeginTurnRevise(war, woSystemBeginTurn, requesterUserId);
    }

    const woSystemCallWarEvent = rawAction.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return WarOperationsRevisersUtilsSystemCallWarEventRevise(war, woSystemCallWarEvent, requesterUserId);
    }

    const woSystemDestroyPlayerForce = rawAction.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return WarOperationsRevisersUtilsSystemDestroyPlayerForceRevise(war, woSystemDestroyPlayerForce, requesterUserId);
    }

    const woSystemEndWar = rawAction.getWoSystemEndWar();
    if (woSystemEndWar) {
        return WarOperationsRevisersUtilsSystemEndWarRevise(war, woSystemEndWar, requesterUserId);
    }

    const woSystemEndTurn = rawAction.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return WarOperationsRevisersUtilsSystemEndTurnRevise(war, woSystemEndTurn, requesterUserId);
    }

    const woSystemHandleBootPlayer = rawAction.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return WarOperationsRevisersUtilsSystemHandleBootPlayerRevise(war, woSystemHandleBootPlayer, requesterUserId);
    }

    const woSystemVoteForDraw = rawAction.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return WarOperationsRevisersUtilsSystemVoteForDrawRevise(war, woSystemVoteForDraw, requesterUserId);
    }

    const woUnitAttackTile = rawAction.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return WarOperationsRevisersUtilsUnitAttackTileRevise(war, woUnitAttackTile, requesterUserId);
    }

    const woUnitAttackUnit = rawAction.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return WarOperationsRevisersUtilsUnitAttackUnitRevise(war, woUnitAttackUnit, requesterUserId);
    }

    const woUnitBeLoaded = rawAction.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return WarOperationsRevisersUtilsUnitBeLoadedRevise(war, woUnitBeLoaded, requesterUserId);
    }

    const woUnitBuildTile = rawAction.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return WarOperationsRevisersUtilsUnitBuildTileRevise(war, woUnitBuildTile, requesterUserId);
    }

    const woUnitCaptureTile = rawAction.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return WarOperationsRevisersUtilsUnitCaptureTileRevise(war, woUnitCaptureTile, requesterUserId);
    }

    const woUnitCrushUnit = rawAction.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return WarOperationsRevisersUtilsUnitCrushUnitRevise(war, woUnitCrushUnit, requesterUserId);
    }

    const woUnitDive = rawAction.getWoUnitDive();
    if (woUnitDive) {
        return WarOperationsRevisersUtilsUnitDiveRevise(war, woUnitDive, requesterUserId);
    }

    const woUnitDropUnit = rawAction.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return WarOperationsRevisersUtilsUnitDropUnitRevise(war, woUnitDropUnit, requesterUserId);
    }

    const woUnitJoinUnit = rawAction.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return WarOperationsRevisersUtilsUnitJoinUnitRevise(war, woUnitJoinUnit, requesterUserId);
    }

    const woUnitLaunchFlare = rawAction.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return WarOperationsRevisersUtilsUnitLaunchFlareRevise(war, woUnitLaunchFlare, requesterUserId);
    }

    const woUnitLaunchSilo = rawAction.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return WarOperationsRevisersUtilsUnitLaunchSiloRevise(war, woUnitLaunchSilo, requesterUserId);
    }

    const woUnitBoardedByCo = rawAction.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return WarOperationsRevisersUtilsUnitBoardedByCoRevise(war, woUnitBoardedByCo, requesterUserId);
    }

    const woUnitProduceUnit = rawAction.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return WarOperationsRevisersUtilsUnitProduceUnitRevise(war, woUnitProduceUnit, requesterUserId);
    }

    const woUnitRepairUnit = rawAction.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return WarOperationsRevisersUtilsUnitRepairUnitRevise(war, woUnitRepairUnit, requesterUserId);
    }

    const woUnitSelfDetonate = rawAction.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return WarOperationsRevisersUtilsUnitSelfDetonateRevise(war, woUnitSelfDetonate, requesterUserId);
    }

    const woUnitSupplyUnit = rawAction.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return WarOperationsRevisersUtilsUnitSupplyUnitRevise(war, woUnitSupplyUnit, requesterUserId);
    }

    const woUnitSurface = rawAction.getWoUnitSurface();
    if (woUnitSurface) {
        return WarOperationsRevisersUtilsUnitSurfaceRevise(war, woUnitSurface, requesterUserId);
    }

    const woUnitUseCoSkill = rawAction.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return WarOperationsRevisersUtilsUnitUseCoSkillRevise(war, woUnitUseCoSkill, requesterUserId);
    }

    const woUnitWait = rawAction.getWoUnitWait();
    if (woUnitWait) {
        return WarOperationsRevisersUtilsUnitWaitRevise(war, woUnitWait, requesterUserId);
    }

    return WarOperationsRevisersUtilsUnknownRevise();
}
