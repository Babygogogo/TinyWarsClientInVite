import {
    ActionPlanners_States_ExecutingAction,
    ActionPlanners_States_Idle,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    type BaseWar_Interface_IBwWar,
    Utils_ClientErrorCode,
    Notifications_Dispatcher,
    WarOperations_Executors_Utils_Unknown,
    Helpers_Misc,
    WarOperations_Executors_Utils_PlayerDeleteUnit,
    WarOperations_Executors_Utils_PlayerEndTurn,
    WarOperations_Executors_Utils_PlayerProduceUnit,
    WarOperations_Executors_Utils_PlayerSurrender,
    WarOperations_Executors_Utils_PlayerUseCoSkill,
    WarOperations_Executors_Utils_PlayerVoteForDraw,
    WarOperations_Executors_Utils_SystemBeginTurn,
    WarOperations_Executors_Utils_SystemCallWarEvent,
    WarOperations_Executors_Utils_SystemDestroyPlayerForce,
    WarOperations_Executors_Utils_SystemEndTurn,
    WarOperations_Executors_Utils_SystemEndWar,
    WarOperations_Executors_Utils_SystemHandleBootPlayer,
    WarOperations_Executors_Utils_SystemVoteForDraw,
    WarOperations_Executors_Utils_UnitAttackTile,
    WarOperations_Executors_Utils_UnitAttackUnit,
    WarOperations_Executors_Utils_UnitBeLoaded,
    WarOperations_Executors_Utils_UnitBoardedByCo,
    WarOperations_Executors_Utils_UnitBuildTile,
    WarOperations_Executors_Utils_UnitCaptureTile,
    WarOperations_Executors_Utils_UnitCrushUnit,
    WarOperations_Executors_Utils_UnitDive,
    WarOperations_Executors_Utils_UnitDropUnit,
    WarOperations_Executors_Utils_UnitJoinUnit,
    WarOperations_Executors_Utils_UnitLaunchFlare,
    WarOperations_Executors_Utils_UnitLaunchSilo,
    WarOperations_Executors_Utils_UnitProduceUnit,
    WarOperations_Executors_Utils_UnitRepairUnit,
    WarOperations_Executors_Utils_UnitSelfDetonate,
    WarOperations_Executors_Utils_UnitSupplyUnit,
    WarOperations_Executors_Utils_UnitSurface,
    WarOperations_Executors_Utils_UnitUseCoSkill,
    WarOperations_Executors_Utils_UnitWait,
} from "../../internal.ts";

import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function checkAndExecute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    if (!war.getIsRunning()) {
        throw Helpers_Misc.newError(`!war.getIsRunning().`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_00);
    }
    if (war.getIsExecutingAction()) {
        throw Helpers_Misc.newError(`war.getIsExecutingAction().`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_01);
    }
    if (war.getIsEnded()) {
        throw Helpers_Misc.newError(`war.getIsEnded().`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_CheckAndExecute_02);
    }

    // 结束回合会改写turnIndex和playerIndex，所以要提前保存
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const actionPlanner = war.getActionPlanner();
    war.setIsExecutingAction(true);
    ActionPlanners_States_ExecutingAction.ExecutingAction.getInstance().apply(actionPlanner);

    await executeAction(war, action, isFast);

    {
        const executedOperationManager = war.getExecutedOperationManager();
        executedOperationManager.tickExecutedOperationsCount();
        executedOperationManager.addExecutedOperation(action);

        if (checkIsPlayerManualOperation(action)) {
            war.getWarStatisticsManager().tickPlayerManualActionsCount(turnIndex, playerIndex);
        }

        if ((war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) ||
            (war instanceof ReplayWar_Model_RwWar.RwWar)
        ) {
            war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses();
        }
    }

    ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
    war.setIsExecutingAction(false);

    if (!isFast) {
        Notifications_Dispatcher.dispatch("WarOperationNormalExecuted");
    }
}

async function executeAction(war: BaseWar_Interface_IBwWar.IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    const woPlayerDeleteUnit = action.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return await WarOperations_Executors_Utils_PlayerDeleteUnit.execute(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await WarOperations_Executors_Utils_PlayerEndTurn.execute(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await WarOperations_Executors_Utils_PlayerProduceUnit.execute(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await WarOperations_Executors_Utils_PlayerSurrender.execute(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await WarOperations_Executors_Utils_PlayerUseCoSkill.execute(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await WarOperations_Executors_Utils_PlayerVoteForDraw.execute(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await WarOperations_Executors_Utils_SystemBeginTurn.execute(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await WarOperations_Executors_Utils_SystemCallWarEvent.execute(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await WarOperations_Executors_Utils_SystemDestroyPlayerForce.execute(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await WarOperations_Executors_Utils_SystemEndTurn.execute(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await WarOperations_Executors_Utils_SystemEndWar.execute(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await WarOperations_Executors_Utils_SystemHandleBootPlayer.execute(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await WarOperations_Executors_Utils_SystemVoteForDraw.execute(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await WarOperations_Executors_Utils_UnitAttackTile.execute(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await WarOperations_Executors_Utils_UnitAttackUnit.execute(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await WarOperations_Executors_Utils_UnitBeLoaded.execute(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await WarOperations_Executors_Utils_UnitBoardedByCo.execute(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await WarOperations_Executors_Utils_UnitBuildTile.execute(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await WarOperations_Executors_Utils_UnitCaptureTile.execute(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await WarOperations_Executors_Utils_UnitCrushUnit.execute(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await WarOperations_Executors_Utils_UnitDive.execute(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await WarOperations_Executors_Utils_UnitDropUnit.execute(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await WarOperations_Executors_Utils_UnitJoinUnit.execute(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await WarOperations_Executors_Utils_UnitLaunchFlare.execute(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await WarOperations_Executors_Utils_UnitLaunchSilo.execute(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await WarOperations_Executors_Utils_UnitProduceUnit.execute(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await WarOperations_Executors_Utils_UnitRepairUnit.execute(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await WarOperations_Executors_Utils_UnitSelfDetonate.execute(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await WarOperations_Executors_Utils_UnitSupplyUnit.execute(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await WarOperations_Executors_Utils_UnitSurface.execute(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await WarOperations_Executors_Utils_UnitUseCoSkill.execute(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await WarOperations_Executors_Utils_UnitWait.execute(war, woUnitWait, isFast);
    }

    return await WarOperations_Executors_Utils_Unknown.fastExeUnknownAction();
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
