import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsPlayerDeleteUnit from "./utils/PlayerDeleteUnit.ts";
import * as WarOperationsRevisersUtilsPlayerEndTurn from "./utils/PlayerEndTurn.ts";
import * as WarOperationsRevisersUtilsPlayerProduceUnit from "./utils/PlayerProduceUnit.ts";
import * as WarOperationsRevisersUtilsPlayerSurrender from "./utils/PlayerSurrender.ts";
import * as WarOperationsRevisersUtilsPlayerUseCoSkill from "./utils/PlayerUseCoSkill.ts";
import * as WarOperationsRevisersUtilsPlayerVoteForDraw from "./utils/PlayerVoteForDraw.ts";
import * as WarOperationsRevisersUtilsSystemBeginTurn from "./utils/SystemBeginTurn.ts";
import * as WarOperationsRevisersUtilsSystemCallWarEvent from "./utils/SystemCallWarEvent.ts";
import * as WarOperationsRevisersUtilsSystemDestroyPlayerForce from "./utils/SystemDestroyPlayerForce.ts";
import * as WarOperationsRevisersUtilsSystemEndTurn from "./utils/SystemEndTurn.ts";
import * as WarOperationsRevisersUtilsSystemEndWar from "./utils/SystemEndWar.ts";
import * as WarOperationsRevisersUtilsSystemHandleBootPlayer from "./utils/SystemHandleBootPlayer.ts";
import * as WarOperationsRevisersUtilsSystemVoteForDraw from "./utils/SystemVoteForDraw.ts";
import * as WarOperationsRevisersUtilsUnitAttackTile from "./utils/UnitAttackTile.ts";
import * as WarOperationsRevisersUtilsUnitAttackUnit from "./utils/UnitAttackUnit.ts";
import * as WarOperationsRevisersUtilsUnitBeLoaded from "./utils/UnitBeLoaded.ts";
import * as WarOperationsRevisersUtilsUnitBoardedByCo from "./utils/UnitBoardedByCo.ts";
import * as WarOperationsRevisersUtilsUnitBuildTile from "./utils/UnitBuildTile.ts";
import * as WarOperationsRevisersUtilsUnitCaptureTile from "./utils/UnitCaptureTile.ts";
import * as WarOperationsRevisersUtilsUnitCrushUnit from "./utils/UnitCrushUnit.ts";
import * as WarOperationsRevisersUtilsUnitDive from "./utils/UnitDive.ts";
import * as WarOperationsRevisersUtilsUnitDropUnit from "./utils/UnitDropUnit.ts";
import * as WarOperationsRevisersUtilsUnitJoinUnit from "./utils/UnitJoinUnit.ts";
import * as WarOperationsRevisersUtilsUnitLaunchFlare from "./utils/UnitLaunchFlare.ts";
import * as WarOperationsRevisersUtilsUnitLaunchSilo from "./utils/UnitLaunchSilo.ts";
import * as WarOperationsRevisersUtilsUnitProduceUnit from "./utils/UnitProduceUnit.ts";
import * as WarOperationsRevisersUtilsUnitRepairUnit from "./utils/UnitRepairUnit.ts";
import * as WarOperationsRevisersUtilsUnitSelfDetonate from "./utils/UnitSelfDetonate.ts";
import * as WarOperationsRevisersUtilsUnitSupplyUnit from "./utils/UnitSupplyUnit.ts";
import * as WarOperationsRevisersUtilsUnitSurface from "./utils/UnitSurface.ts";
import * as WarOperationsRevisersUtilsUnitUseCoSkill from "./utils/UnitUseCoSkill.ts";
import * as WarOperationsRevisersUtilsUnitWait from "./utils/UnitWait.ts";
import * as WarOperationsRevisersUtilsUnknown from "./utils/Unknown.ts";

type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    // if (Object.keys(rawAction).length !== 2) {
    //     throw Helpers.Misc.newError(`Invalid rawAction.keys.`, ClientErrorCode.WarOperationReviser_Revise_00);
    // }

    const operationId = rawAction.getOperationId();
    if ((operationId == null) || (operationId !== war.getExecutedOperationManager().getExecutedOperationsCount())) {
        throw HelpersMisc.newError(`Invalid actionId: ${operationId}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_Revise_01);
    }

    const action = doRevise(war, rawAction, requesterUserId);
    action.setOperationId(operationId);
    return action;
}

function doRevise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    const woPlayerDeleteUnit = rawAction.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return WarOperationsRevisersUtilsPlayerDeleteUnit.revise(war, woPlayerDeleteUnit, requesterUserId);
    }

    const woPlayerEndTurn = rawAction.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return WarOperationsRevisersUtilsPlayerEndTurn.revise(war, woPlayerEndTurn, requesterUserId);
    }

    const woPlayerProduceUnit = rawAction.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return WarOperationsRevisersUtilsPlayerProduceUnit.revise(war, woPlayerProduceUnit, requesterUserId);
    }

    const woPlayerSurrender = rawAction.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return WarOperationsRevisersUtilsPlayerSurrender.revise(war, woPlayerSurrender, requesterUserId);
    }

    const woPlayerVoteForDraw = rawAction.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return WarOperationsRevisersUtilsPlayerVoteForDraw.revise(war, woPlayerVoteForDraw, requesterUserId);
    }

    const woPlayerUseCoSkill = rawAction.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return WarOperationsRevisersUtilsPlayerUseCoSkill.revise(war, woPlayerUseCoSkill, requesterUserId);
    }

    const woSystemBeginTurn = rawAction.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return WarOperationsRevisersUtilsSystemBeginTurn.revise(war, woSystemBeginTurn, requesterUserId);
    }

    const woSystemCallWarEvent = rawAction.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return WarOperationsRevisersUtilsSystemCallWarEvent.revise(war, woSystemCallWarEvent, requesterUserId);
    }

    const woSystemDestroyPlayerForce = rawAction.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return WarOperationsRevisersUtilsSystemDestroyPlayerForce.revise(war, woSystemDestroyPlayerForce, requesterUserId);
    }

    const woSystemEndWar = rawAction.getWoSystemEndWar();
    if (woSystemEndWar) {
        return WarOperationsRevisersUtilsSystemEndWar.revise(war, woSystemEndWar, requesterUserId);
    }

    const woSystemEndTurn = rawAction.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return WarOperationsRevisersUtilsSystemEndTurn.revise(war, woSystemEndTurn, requesterUserId);
    }

    const woSystemHandleBootPlayer = rawAction.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return WarOperationsRevisersUtilsSystemHandleBootPlayer.revise(war, woSystemHandleBootPlayer, requesterUserId);
    }

    const woSystemVoteForDraw = rawAction.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return WarOperationsRevisersUtilsSystemVoteForDraw.revise(war, woSystemVoteForDraw, requesterUserId);
    }

    const woUnitAttackTile = rawAction.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return WarOperationsRevisersUtilsUnitAttackTile.revise(war, woUnitAttackTile, requesterUserId);
    }

    const woUnitAttackUnit = rawAction.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return WarOperationsRevisersUtilsUnitAttackUnit.revise(war, woUnitAttackUnit, requesterUserId);
    }

    const woUnitBeLoaded = rawAction.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return WarOperationsRevisersUtilsUnitBeLoaded.revise(war, woUnitBeLoaded, requesterUserId);
    }

    const woUnitBuildTile = rawAction.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return WarOperationsRevisersUtilsUnitBuildTile.revise(war, woUnitBuildTile, requesterUserId);
    }

    const woUnitCaptureTile = rawAction.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return WarOperationsRevisersUtilsUnitCaptureTile.revise(war, woUnitCaptureTile, requesterUserId);
    }

    const woUnitCrushUnit = rawAction.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return WarOperationsRevisersUtilsUnitCrushUnit.revise(war, woUnitCrushUnit, requesterUserId);
    }

    const woUnitDive = rawAction.getWoUnitDive();
    if (woUnitDive) {
        return WarOperationsRevisersUtilsUnitDive.revise(war, woUnitDive, requesterUserId);
    }

    const woUnitDropUnit = rawAction.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return WarOperationsRevisersUtilsUnitDropUnit.revise(war, woUnitDropUnit, requesterUserId);
    }

    const woUnitJoinUnit = rawAction.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return WarOperationsRevisersUtilsUnitJoinUnit.revise(war, woUnitJoinUnit, requesterUserId);
    }

    const woUnitLaunchFlare = rawAction.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return WarOperationsRevisersUtilsUnitLaunchFlare.revise(war, woUnitLaunchFlare, requesterUserId);
    }

    const woUnitLaunchSilo = rawAction.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return WarOperationsRevisersUtilsUnitLaunchSilo.revise(war, woUnitLaunchSilo, requesterUserId);
    }

    const woUnitBoardedByCo = rawAction.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return WarOperationsRevisersUtilsUnitBoardedByCo.revise(war, woUnitBoardedByCo, requesterUserId);
    }

    const woUnitProduceUnit = rawAction.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return WarOperationsRevisersUtilsUnitProduceUnit.revise(war, woUnitProduceUnit, requesterUserId);
    }

    const woUnitRepairUnit = rawAction.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return WarOperationsRevisersUtilsUnitRepairUnit.revise(war, woUnitRepairUnit, requesterUserId);
    }

    const woUnitSelfDetonate = rawAction.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return WarOperationsRevisersUtilsUnitSelfDetonate.revise(war, woUnitSelfDetonate, requesterUserId);
    }

    const woUnitSupplyUnit = rawAction.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return WarOperationsRevisersUtilsUnitSupplyUnit.revise(war, woUnitSupplyUnit, requesterUserId);
    }

    const woUnitSurface = rawAction.getWoUnitSurface();
    if (woUnitSurface) {
        return WarOperationsRevisersUtilsUnitSurface.revise(war, woUnitSurface, requesterUserId);
    }

    const woUnitUseCoSkill = rawAction.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return WarOperationsRevisersUtilsUnitUseCoSkill.revise(war, woUnitUseCoSkill, requesterUserId);
    }

    const woUnitWait = rawAction.getWoUnitWait();
    if (woUnitWait) {
        return WarOperationsRevisersUtilsUnitWait.revise(war, woUnitWait, requesterUserId);
    }

    return WarOperationsRevisersUtilsUnknown.revise();
}
