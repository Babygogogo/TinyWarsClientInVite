import * as ActionPlannersStatesExecutingAction from "../../actionPlanners/states/ExecutingAction.ts";
import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsPlayerDeleteUnit from "./utils/PlayerDeleteUnit.ts";
import * as WarOperationsExecutorsUtilsPlayerEndTurn from "./utils/PlayerEndTurn.ts";
import * as WarOperationsExecutorsUtilsPlayerProduceUnit from "./utils/PlayerProduceUnit.ts";
import * as WarOperationsExecutorsUtilsPlayerSurrender from "./utils/PlayerSurrender.ts";
import * as WarOperationsExecutorsUtilsPlayerUseCoSkill from "./utils/PlayerUseCoSkill.ts";
import * as WarOperationsExecutorsUtilsPlayerVoteForDraw from "./utils/PlayerVoteForDraw.ts";
import * as WarOperationsExecutorsUtilsSystemBeginTurn from "./utils/SystemBeginTurn.ts";
import * as WarOperationsExecutorsUtilsSystemCallWarEvent from "./utils/SystemCallWarEvent.ts";
import * as WarOperationsExecutorsUtilsSystemDestroyPlayerForce from "./utils/SystemDestroyPlayerForce.ts";
import * as WarOperationsExecutorsUtilsSystemEndTurn from "./utils/SystemEndTurn.ts";
import * as WarOperationsExecutorsUtilsSystemEndWar from "./utils/SystemEndWar.ts";
import * as WarOperationsExecutorsUtilsSystemHandleBootPlayer from "./utils/SystemHandleBootPlayer.ts";
import * as WarOperationsExecutorsUtilsSystemVoteForDraw from "./utils/SystemVoteForDraw.ts";
import * as WarOperationsExecutorsUtilsUnitAttackTile from "./utils/UnitAttackTile.ts";
import * as WarOperationsExecutorsUtilsUnitAttackUnit from "./utils/UnitAttackUnit.ts";
import * as WarOperationsExecutorsUtilsUnitBeLoaded from "./utils/UnitBeLoaded.ts";
import * as WarOperationsExecutorsUtilsUnitBoardedByCo from "./utils/UnitBoardedByCo.ts";
import * as WarOperationsExecutorsUtilsUnitBuildTile from "./utils/UnitBuildTile.ts";
import * as WarOperationsExecutorsUtilsUnitCaptureTile from "./utils/UnitCaptureTile.ts";
import * as WarOperationsExecutorsUtilsUnitCrushUnit from "./utils/UnitCrushUnit.ts";
import * as WarOperationsExecutorsUtilsUnitDive from "./utils/UnitDive.ts";
import * as WarOperationsExecutorsUtilsUnitDropUnit from "./utils/UnitDropUnit.ts";
import * as WarOperationsExecutorsUtilsUnitJoinUnit from "./utils/UnitJoinUnit.ts";
import * as WarOperationsExecutorsUtilsUnitLaunchFlare from "./utils/UnitLaunchFlare.ts";
import * as WarOperationsExecutorsUtilsUnitLaunchSilo from "./utils/UnitLaunchSilo.ts";
import * as WarOperationsExecutorsUtilsUnitProduceUnit from "./utils/UnitProduceUnit.ts";
import * as WarOperationsExecutorsUtilsUnitRepairUnit from "./utils/UnitRepairUnit.ts";
import * as WarOperationsExecutorsUtilsUnitSelfDetonate from "./utils/UnitSelfDetonate.ts";
import * as WarOperationsExecutorsUtilsUnitSupplyUnit from "./utils/UnitSupplyUnit.ts";
import * as WarOperationsExecutorsUtilsUnitSurface from "./utils/UnitSurface.ts";
import * as WarOperationsExecutorsUtilsUnitUseCoSkill from "./utils/UnitUseCoSkill.ts";
import * as WarOperationsExecutorsUtilsUnitWait from "./utils/UnitWait.ts";
import * as WarOperationsExecutorsUtilsUnknown from "./utils/Unknown.ts";

type WoContainer        = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

export async function checkAndExecute(war: IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    if (!war.getIsRunning()) {
        throw HelpersMisc.newError(`!war.getIsRunning().`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_00);
    }
    if (war.getIsExecutingAction()) {
        throw HelpersMisc.newError(`war.getIsExecutingAction().`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_01);
    }
    if (war.getIsEnded()) {
        throw HelpersMisc.newError(`war.getIsEnded().`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_02);
    }

    // 结束回合会改写turnIndex和playerIndex，所以要提前保存
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const actionPlanner = war.getActionPlanner();
    war.setIsExecutingAction(true);
    ActionPlannersStatesExecutingAction.ExecutingAction.getInstance().apply(actionPlanner);

    await executeAction(war, action, isFast);

    {
        const executedOperationManager = war.getExecutedOperationManager();
        executedOperationManager.tickExecutedOperationsCount();
        executedOperationManager.addExecutedOperation(action);

        if (checkIsPlayerManualOperation(action)) {
            war.getWarStatisticsManager().tickPlayerManualActionsCount(turnIndex, playerIndex);
        }

        if ((war instanceof GameHelpersGhFactory.getSpwWarClass()) ||
            (war instanceof GameHelpersGhFactory.getRwWarClass())
        ) {
            war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses();
        }
    }

    ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
    war.setIsExecutingAction(false);

    if (!isFast) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarOperationNormalExecuted);
    }
}

async function executeAction(war: IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    const woPlayerDeleteUnit = action.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return await WarOperationsExecutorsUtilsPlayerDeleteUnit.execute(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await WarOperationsExecutorsUtilsPlayerEndTurn.execute(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await WarOperationsExecutorsUtilsPlayerProduceUnit.execute(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await WarOperationsExecutorsUtilsPlayerSurrender.execute(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await WarOperationsExecutorsUtilsPlayerUseCoSkill.execute(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await WarOperationsExecutorsUtilsPlayerVoteForDraw.execute(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await WarOperationsExecutorsUtilsSystemBeginTurn.execute(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await WarOperationsExecutorsUtilsSystemCallWarEvent.execute(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await WarOperationsExecutorsUtilsSystemDestroyPlayerForce.execute(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await WarOperationsExecutorsUtilsSystemEndTurn.execute(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await WarOperationsExecutorsUtilsSystemEndWar.execute(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await WarOperationsExecutorsUtilsSystemHandleBootPlayer.execute(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await WarOperationsExecutorsUtilsSystemVoteForDraw.execute(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await WarOperationsExecutorsUtilsUnitAttackTile.execute(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await WarOperationsExecutorsUtilsUnitAttackUnit.execute(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await WarOperationsExecutorsUtilsUnitBeLoaded.execute(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await WarOperationsExecutorsUtilsUnitBoardedByCo.execute(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await WarOperationsExecutorsUtilsUnitBuildTile.execute(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await WarOperationsExecutorsUtilsUnitCaptureTile.execute(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await WarOperationsExecutorsUtilsUnitCrushUnit.execute(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await WarOperationsExecutorsUtilsUnitDive.execute(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await WarOperationsExecutorsUtilsUnitDropUnit.execute(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await WarOperationsExecutorsUtilsUnitJoinUnit.execute(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await WarOperationsExecutorsUtilsUnitLaunchFlare.execute(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await WarOperationsExecutorsUtilsUnitLaunchSilo.execute(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await WarOperationsExecutorsUtilsUnitProduceUnit.execute(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await WarOperationsExecutorsUtilsUnitRepairUnit.execute(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await WarOperationsExecutorsUtilsUnitSelfDetonate.execute(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await WarOperationsExecutorsUtilsUnitSupplyUnit.execute(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await WarOperationsExecutorsUtilsUnitSurface.execute(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await WarOperationsExecutorsUtilsUnitUseCoSkill.execute(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await WarOperationsExecutorsUtilsUnitWait.execute(war, woUnitWait, isFast);
    }

    return await WarOperationsExecutorsUtilsUnknown.fastExeUnknownAction();
}

function checkIsPlayerManualOperation(operationContainer: WoContainer): boolean {
    return (operationContainer.getWoPlayerDeleteUnit() != null)
        || (operationContainer.getWoPlayerEndTurn() != null)
        || (operationContainer.getWoPlayerProduceUnit() != null)
        || (operationContainer.getWoPlayerSurrender() != null)
        || (operationContainer.getWoPlayerUseCoSkill() != null)
        || (operationContainer.getWoPlayerVoteForDraw() != null)

        || (operationContainer.getWoUnitAttackTile() != null)
        || (operationContainer.getWoUnitAttackUnit() != null)
        || (operationContainer.getWoUnitBeLoaded() != null)
        || (operationContainer.getWoUnitBoardedByCo() != null)
        || (operationContainer.getWoUnitBuildTile() != null)
        || (operationContainer.getWoUnitCaptureTile() != null)
        || (operationContainer.getWoUnitCrushUnit() != null)
        || (operationContainer.getWoUnitDive() != null)
        || (operationContainer.getWoUnitDropUnit() != null)
        || (operationContainer.getWoUnitJoinUnit() != null)
        || (operationContainer.getWoUnitLaunchFlare() != null)
        || (operationContainer.getWoUnitLaunchSilo() != null)
        || (operationContainer.getWoUnitProduceUnit() != null)
        || (operationContainer.getWoUnitRepairUnit() != null)
        || (operationContainer.getWoUnitSelfDetonate() != null)
        || (operationContainer.getWoUnitSupplyUnit() != null)
        || (operationContainer.getWoUnitSurface() != null)
        || (operationContainer.getWoUnitUseCoSkill() != null)
        || (operationContainer.getWoUnitWait() != null);
}
