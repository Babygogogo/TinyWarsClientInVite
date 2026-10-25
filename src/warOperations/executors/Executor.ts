import { ExecutingAction } from "../../actionPlanners/states/ExecutingAction.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getSpwWarClass, getRwWarClass } from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { execute } from "./utils/PlayerDeleteUnit.ts";
import { execute as WarOperationsExecutorsUtilsPlayerEndTurnExecute } from "./utils/PlayerEndTurn.ts";
import { execute as WarOperationsExecutorsUtilsPlayerProduceUnitExecute } from "./utils/PlayerProduceUnit.ts";
import { execute as WarOperationsExecutorsUtilsPlayerSurrenderExecute } from "./utils/PlayerSurrender.ts";
import { execute as WarOperationsExecutorsUtilsPlayerUseCoSkillExecute } from "./utils/PlayerUseCoSkill.ts";
import { execute as WarOperationsExecutorsUtilsPlayerVoteForDrawExecute } from "./utils/PlayerVoteForDraw.ts";
import { execute as WarOperationsExecutorsUtilsSystemBeginTurnExecute } from "./utils/SystemBeginTurn.ts";
import { execute as WarOperationsExecutorsUtilsSystemCallWarEventExecute } from "./utils/SystemCallWarEvent.ts";
import { execute as WarOperationsExecutorsUtilsSystemDestroyPlayerForceExecute } from "./utils/SystemDestroyPlayerForce.ts";
import { execute as WarOperationsExecutorsUtilsSystemEndTurnExecute } from "./utils/SystemEndTurn.ts";
import { execute as WarOperationsExecutorsUtilsSystemEndWarExecute } from "./utils/SystemEndWar.ts";
import { execute as WarOperationsExecutorsUtilsSystemHandleBootPlayerExecute } from "./utils/SystemHandleBootPlayer.ts";
import { execute as WarOperationsExecutorsUtilsSystemVoteForDrawExecute } from "./utils/SystemVoteForDraw.ts";
import { execute as WarOperationsExecutorsUtilsUnitAttackTileExecute } from "./utils/UnitAttackTile.ts";
import { execute as WarOperationsExecutorsUtilsUnitAttackUnitExecute } from "./utils/UnitAttackUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitBeLoadedExecute } from "./utils/UnitBeLoaded.ts";
import { execute as WarOperationsExecutorsUtilsUnitBoardedByCoExecute } from "./utils/UnitBoardedByCo.ts";
import { execute as WarOperationsExecutorsUtilsUnitBuildTileExecute } from "./utils/UnitBuildTile.ts";
import { execute as WarOperationsExecutorsUtilsUnitCaptureTileExecute } from "./utils/UnitCaptureTile.ts";
import { execute as WarOperationsExecutorsUtilsUnitCrushUnitExecute } from "./utils/UnitCrushUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitDiveExecute } from "./utils/UnitDive.ts";
import { execute as WarOperationsExecutorsUtilsUnitDropUnitExecute } from "./utils/UnitDropUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitJoinUnitExecute } from "./utils/UnitJoinUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitLaunchFlareExecute } from "./utils/UnitLaunchFlare.ts";
import { execute as WarOperationsExecutorsUtilsUnitLaunchSiloExecute } from "./utils/UnitLaunchSilo.ts";
import { execute as WarOperationsExecutorsUtilsUnitProduceUnitExecute } from "./utils/UnitProduceUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitRepairUnitExecute } from "./utils/UnitRepairUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitSelfDetonateExecute } from "./utils/UnitSelfDetonate.ts";
import { execute as WarOperationsExecutorsUtilsUnitSupplyUnitExecute } from "./utils/UnitSupplyUnit.ts";
import { execute as WarOperationsExecutorsUtilsUnitSurfaceExecute } from "./utils/UnitSurface.ts";
import { execute as WarOperationsExecutorsUtilsUnitUseCoSkillExecute } from "./utils/UnitUseCoSkill.ts";
import { execute as WarOperationsExecutorsUtilsUnitWaitExecute } from "./utils/UnitWait.ts";
import { fastExeUnknownAction } from "./utils/Unknown.ts";

export async function checkAndExecute(war: IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    if (!war.getIsRunning()) {
        throw newError(`!war.getIsRunning().`, ClientErrorCode.WarOperationExecutor_CheckAndExecute_00);
    }
    if (war.getIsExecutingAction()) {
        throw newError(`war.getIsExecutingAction().`, ClientErrorCode.WarOperationExecutor_CheckAndExecute_01);
    }
    if (war.getIsEnded()) {
        throw newError(`war.getIsEnded().`, ClientErrorCode.WarOperationExecutor_CheckAndExecute_02);
    }

    // 结束回合会改写turnIndex和playerIndex，所以要提前保存
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const actionPlanner = war.getActionPlanner();
    war.setIsExecutingAction(true);
    ExecutingAction.getInstance().apply(actionPlanner);

    await executeAction(war, action, isFast);

    {
        const executedOperationManager = war.getExecutedOperationManager();
        executedOperationManager.tickExecutedOperationsCount();
        executedOperationManager.addExecutedOperation(action);

        if (checkIsPlayerManualOperation(action)) {
            war.getWarStatisticsManager().tickPlayerManualActionsCount(turnIndex, playerIndex);
        }

        if ((war instanceof getSpwWarClass()) ||
            (war instanceof getRwWarClass())
        ) {
            war.getTaskObjectiveManager().autoUpdateAllCurrentProgresses();
        }
    }

    Idle.getInstance().apply(actionPlanner);
    war.setIsExecutingAction(false);

    if (!isFast) {
        dispatch(TypeId.WarOperationNormalExecuted);
    }
}

async function executeAction(war: IBwWar, action: WoContainer, isFast: boolean): Promise<void> {
    const woPlayerDeleteUnit = action.getWoPlayerDeleteUnit();
    if (woPlayerDeleteUnit) {
        return await execute(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await WarOperationsExecutorsUtilsPlayerEndTurnExecute(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await WarOperationsExecutorsUtilsPlayerProduceUnitExecute(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await WarOperationsExecutorsUtilsPlayerSurrenderExecute(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await WarOperationsExecutorsUtilsPlayerUseCoSkillExecute(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await WarOperationsExecutorsUtilsPlayerVoteForDrawExecute(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await WarOperationsExecutorsUtilsSystemBeginTurnExecute(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await WarOperationsExecutorsUtilsSystemCallWarEventExecute(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await WarOperationsExecutorsUtilsSystemDestroyPlayerForceExecute(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await WarOperationsExecutorsUtilsSystemEndTurnExecute(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await WarOperationsExecutorsUtilsSystemEndWarExecute(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await WarOperationsExecutorsUtilsSystemHandleBootPlayerExecute(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await WarOperationsExecutorsUtilsSystemVoteForDrawExecute(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await WarOperationsExecutorsUtilsUnitAttackTileExecute(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await WarOperationsExecutorsUtilsUnitAttackUnitExecute(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await WarOperationsExecutorsUtilsUnitBeLoadedExecute(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await WarOperationsExecutorsUtilsUnitBoardedByCoExecute(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await WarOperationsExecutorsUtilsUnitBuildTileExecute(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await WarOperationsExecutorsUtilsUnitCaptureTileExecute(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await WarOperationsExecutorsUtilsUnitCrushUnitExecute(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await WarOperationsExecutorsUtilsUnitDiveExecute(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await WarOperationsExecutorsUtilsUnitDropUnitExecute(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await WarOperationsExecutorsUtilsUnitJoinUnitExecute(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await WarOperationsExecutorsUtilsUnitLaunchFlareExecute(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await WarOperationsExecutorsUtilsUnitLaunchSiloExecute(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await WarOperationsExecutorsUtilsUnitProduceUnitExecute(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await WarOperationsExecutorsUtilsUnitRepairUnitExecute(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await WarOperationsExecutorsUtilsUnitSelfDetonateExecute(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await WarOperationsExecutorsUtilsUnitSupplyUnitExecute(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await WarOperationsExecutorsUtilsUnitSurfaceExecute(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await WarOperationsExecutorsUtilsUnitUseCoSkillExecute(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await WarOperationsExecutorsUtilsUnitWaitExecute(war, woUnitWait, isFast);
    }

    return await fastExeUnknownAction();
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
