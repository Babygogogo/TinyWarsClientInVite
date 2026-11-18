import {
    ActionPlanners_States_ExecutingAction,
    ActionPlanners_States_Idle,
    Helpers_Misc,
    Notifications_Dispatcher,
    ReplayWar_Model_RwWar,
    SinglePlayerWars_War,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
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
    WarOperations_Executors_Utils_Unknown,
    WarOperations_Revisers_Result,
    type BaseWar_Model_War,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function checkAndExecuteAsOuterWar(war: BaseWar_Model_War.War, action: WoContainer, isFast: boolean): Promise<void> {
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
    if (actionPlanner) {
        ActionPlanners_States_ExecutingAction.ExecutingAction.getInstance().apply(actionPlanner);
    }

    await executeActionAsOuterWar(war, action, isFast);

    {
        const executedOperationManager = war.getExecutedOperationManager();
        executedOperationManager.tickExecutedOperationsCount();
        executedOperationManager.addExecutedOperation(action);

        if (checkIsPlayerManualOperation(action)) {
            war.getWarStatisticsManager().tickPlayerManualOperationsCount(turnIndex, playerIndex);
        }

        if ((war instanceof SinglePlayerWars_War.War) ||
            (war instanceof ReplayWar_Model_RwWar.RwWar)
        ) {
            war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses();
        }
    }

    if (actionPlanner) {
        ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
    }
    war.setIsExecutingAction(false);

    if (!isFast) {
        Notifications_Dispatcher.dispatch("WarOperationNormalExecuted");
    }
}

async function executeActionAsOuterWar(war: BaseWar_Model_War.War, action: WoContainer, isFast: boolean): Promise<void> {
    const woPlayerDeleteUnit = action.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return await WarOperations_Executors_Utils_PlayerDeleteUnit.executeAsOuterWar(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await WarOperations_Executors_Utils_PlayerEndTurn.executeAsOuterWar(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await WarOperations_Executors_Utils_PlayerProduceUnit.executeAsOuterWar(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await WarOperations_Executors_Utils_PlayerSurrender.executeAsOuterWar(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await WarOperations_Executors_Utils_PlayerUseCoSkill.executeAsOuterWar(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await WarOperations_Executors_Utils_PlayerVoteForDraw.executeAsOuterWar(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await WarOperations_Executors_Utils_SystemBeginTurn.executeAsOuterWar(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await WarOperations_Executors_Utils_SystemCallWarEvent.executeAsOuterWar(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await WarOperations_Executors_Utils_SystemDestroyPlayerForce.executeAsOuterWar(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await WarOperations_Executors_Utils_SystemEndTurn.executeAsOuterWar(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await WarOperations_Executors_Utils_SystemEndWar.executeAsOuterWar(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await WarOperations_Executors_Utils_SystemHandleBootPlayer.executeAsOuterWar(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await WarOperations_Executors_Utils_SystemVoteForDraw.executeAsOuterWar(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await WarOperations_Executors_Utils_UnitAttackTile.executeAsOuterWar(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await WarOperations_Executors_Utils_UnitAttackUnit.executeAsOuterWar(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await WarOperations_Executors_Utils_UnitBeLoaded.executeAsOuterWar(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await WarOperations_Executors_Utils_UnitBoardedByCo.executeAsOuterWar(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await WarOperations_Executors_Utils_UnitBuildTile.executeAsOuterWar(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await WarOperations_Executors_Utils_UnitCaptureTile.executeAsOuterWar(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await WarOperations_Executors_Utils_UnitCrushUnit.executeAsOuterWar(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await WarOperations_Executors_Utils_UnitDive.executeAsOuterWar(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await WarOperations_Executors_Utils_UnitDropUnit.executeAsOuterWar(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await WarOperations_Executors_Utils_UnitJoinUnit.executeAsOuterWar(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await WarOperations_Executors_Utils_UnitLaunchFlare.executeAsOuterWar(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await WarOperations_Executors_Utils_UnitLaunchSilo.executeAsOuterWar(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await WarOperations_Executors_Utils_UnitProduceUnit.executeAsOuterWar(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await WarOperations_Executors_Utils_UnitRepairUnit.executeAsOuterWar(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await WarOperations_Executors_Utils_UnitSelfDetonate.executeAsOuterWar(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await WarOperations_Executors_Utils_UnitSupplyUnit.executeAsOuterWar(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await WarOperations_Executors_Utils_UnitSurface.executeAsOuterWar(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await WarOperations_Executors_Utils_UnitUseCoSkill.executeAsOuterWar(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await WarOperations_Executors_Utils_UnitWait.executeAsOuterWar(war, woUnitWait, isFast);
    }

    return await WarOperations_Executors_Utils_Unknown.fastExeUnknownAction();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeAsInnerWar(war: SinglePlayerWars_War.War, revisedResult: WarOperations_Revisers_Result.Result, requesterUserId: number): Promise<Map<number, WoContainer>> {
    {
        const errorCode = revisedResult.errorCode;
        if (errorCode !== Utils_ClientErrorCode.ClientErrorCode.NoError) {
            throw Helpers_Misc.newError(`Revised result error: ${errorCode}`, errorCode);
        }
    }

    const operationContainer = revisedResult.operation;
    if (operationContainer == null) {
        throw Helpers_Misc.newError(`Operation container is null`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_ExecuteForInnerWar_00);
    }

    // 结束回合会改写turnIndex和playerIndex，所以要提前保存
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    const playerIndex   = turnManager.getPlayerIndexInTurn();

    let outerWarOpCreator: WarOperations_Executors_Types.ExecutionResultForInnerWarOperation | undefined;
    {
        const operation = operationContainer.getWoPlayerDeleteUnit();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerDeleteUnit.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoPlayerEndTurn();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerEndTurn.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoPlayerProduceUnit();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerProduceUnit.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoPlayerSurrender();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerSurrender.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoPlayerVoteForDraw();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerVoteForDraw.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoPlayerUseCoSkill();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_PlayerUseCoSkill.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemBeginTurn();
        if (operation) {
            outerWarOpCreator = await WarOperations_Executors_Utils_SystemBeginTurn.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemCallWarEvent();
        if (operation) {
            outerWarOpCreator = await WarOperations_Executors_Utils_SystemCallWarEvent.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemDestroyPlayerForce();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_SystemDestroyPlayerForce.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemEndTurn();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_SystemEndTurn.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemEndWar();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_SystemEndWar.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemHandleBootPlayer();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_SystemHandleBootPlayer.executeAsInnerWar(war, operation);
        }
    }
    {
        const operation = operationContainer.getWoSystemVoteForDraw();
        if (operation) {
            outerWarOpCreator = WarOperations_Executors_Utils_SystemVoteForDraw.executeAsInnerWar(war, operation);
        }
    }

    if (outerWarOpCreator == null) {
        const movePath = Helpers_Misc.getExisted(revisedResult.movePath, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_ExecuteForInnerWar_01);
        {
            const operation = operationContainer.getWoUnitAttackTile();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitAttackTile.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitAttackUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitAttackUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitBeLoaded();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitBeLoaded.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitBoardedByCo();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitBoardedByCo.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitBuildTile();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitBuildTile.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitCaptureTile();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitCaptureTile.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitCrushUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitCrushUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitDive();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitDive.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitDropUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitDropUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitJoinUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitJoinUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitLaunchFlare();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitLaunchFlare.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitLaunchSilo();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitLaunchSilo.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitProduceUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitProduceUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitRepairUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitRepairUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitSelfDetonate();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitSelfDetonate.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitSupplyUnit();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitSupplyUnit.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitSurface();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitSurface.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitUseCoSkill();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitUseCoSkill.executeAsInnerWar(war, operation, movePath);
            }
        }
        {
            const operation = operationContainer.getWoUnitWait();
            if (operation) {
                outerWarOpCreator = WarOperations_Executors_Utils_UnitWait.executeAsInnerWar(war, operation, movePath);
            }
        }
    }

    if (outerWarOpCreator == null) {
        throw Helpers_Misc.newError(`Operation container is null`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_ExecuteForInnerWar_02);
    }

    const executedOperationManager  = war.getExecutedOperationManager();
    const operationId               = executedOperationManager.tickExecutedOperationsCount();
    executedOperationManager.addExecutedOperation(operationContainer);

    if (checkIsPlayerManualOperation(operationContainer)) {
        war.getWarStatisticsManager().tickPlayerManualOperationsCount(turnIndex, playerIndex);
    }

    return outerWarOpCreator(
        war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses(),
        operationId,
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function checkAndExecuteAsUnifiedWar(war: BaseWar_Model_War.War, action: WoContainer, isFast: boolean): Promise<void> {
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
    if (actionPlanner) {
        ActionPlanners_States_ExecutingAction.ExecutingAction.getInstance().apply(actionPlanner);
    }

    await executeActionAsUnifiedWar(war, action, isFast);

    {
        const executedOperationManager = war.getExecutedOperationManager();
        executedOperationManager.tickExecutedOperationsCount();
        executedOperationManager.addExecutedOperation(action);

        if (checkIsPlayerManualOperation(action)) {
            war.getWarStatisticsManager().tickPlayerManualOperationsCount(turnIndex, playerIndex);
        }

        if ((war instanceof SinglePlayerWars_War.War) ||
            (war instanceof ReplayWar_Model_RwWar.RwWar)
        ) {
            war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses();
        }
    }

    if (actionPlanner) {
        ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
    }
    war.setIsExecutingAction(false);

    if (!isFast) {
        Notifications_Dispatcher.dispatch("WarOperationNormalExecuted");
    }
}

async function executeActionAsUnifiedWar(war: BaseWar_Model_War.War, action: WoContainer, isFast: boolean): Promise<void> {
    const woPlayerDeleteUnit = action.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return await WarOperations_Executors_Utils_PlayerDeleteUnit.executeAsUnifiedWar(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await WarOperations_Executors_Utils_PlayerEndTurn.executeAsUnifiedWar(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await WarOperations_Executors_Utils_PlayerProduceUnit.executeAsUnifiedWar(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await WarOperations_Executors_Utils_PlayerSurrender.executeAsUnifiedWar(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await WarOperations_Executors_Utils_PlayerUseCoSkill.executeAsUnifiedWar(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await WarOperations_Executors_Utils_PlayerVoteForDraw.executeAsUnifiedWar(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await WarOperations_Executors_Utils_SystemBeginTurn.executeAsUnifiedWar(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await WarOperations_Executors_Utils_SystemCallWarEvent.executeAsUnifiedWar(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await WarOperations_Executors_Utils_SystemDestroyPlayerForce.executeAsUnifiedWar(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await WarOperations_Executors_Utils_SystemEndTurn.executeAsUnifiedWar(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await WarOperations_Executors_Utils_SystemEndWar.executeAsUnifiedWar(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await WarOperations_Executors_Utils_SystemHandleBootPlayer.executeAsUnifiedWar(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await WarOperations_Executors_Utils_SystemVoteForDraw.executeAsUnifiedWar(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await WarOperations_Executors_Utils_UnitAttackTile.executeAsUnifiedWar(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await WarOperations_Executors_Utils_UnitAttackUnit.executeAsUnifiedWar(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await WarOperations_Executors_Utils_UnitBeLoaded.executeAsUnifiedWar(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await WarOperations_Executors_Utils_UnitBoardedByCo.executeAsUnifiedWar(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await WarOperations_Executors_Utils_UnitBuildTile.executeAsUnifiedWar(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await WarOperations_Executors_Utils_UnitCaptureTile.executeAsUnifiedWar(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await WarOperations_Executors_Utils_UnitCrushUnit.executeAsUnifiedWar(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await WarOperations_Executors_Utils_UnitDive.executeAsUnifiedWar(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await WarOperations_Executors_Utils_UnitDropUnit.executeAsUnifiedWar(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await WarOperations_Executors_Utils_UnitJoinUnit.executeAsUnifiedWar(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await WarOperations_Executors_Utils_UnitLaunchFlare.executeAsUnifiedWar(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await WarOperations_Executors_Utils_UnitLaunchSilo.executeAsUnifiedWar(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await WarOperations_Executors_Utils_UnitProduceUnit.executeAsUnifiedWar(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await WarOperations_Executors_Utils_UnitRepairUnit.executeAsUnifiedWar(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await WarOperations_Executors_Utils_UnitSelfDetonate.executeAsUnifiedWar(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await WarOperations_Executors_Utils_UnitSupplyUnit.executeAsUnifiedWar(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await WarOperations_Executors_Utils_UnitSurface.executeAsUnifiedWar(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await WarOperations_Executors_Utils_UnitUseCoSkill.executeAsUnifiedWar(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await WarOperations_Executors_Utils_UnitWait.executeAsUnifiedWar(war, woUnitWait, isFast);
    }

    return await WarOperations_Executors_Utils_Unknown.fastExeUnknownAction();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
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
