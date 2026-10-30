import { ExecutingAction } from "../../actionPlanners/states/ExecutingAction.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import {
    getSpwWarClass,
    getRwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { newError } from "../../helpers/Misc.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { execute as playerDeleteUnitExecute } from "./utils/PlayerDeleteUnit.ts";
import { execute as playerEndTurnExecute } from "./utils/PlayerEndTurn.ts";
import { execute as playerProduceUnitExecute } from "./utils/PlayerProduceUnit.ts";
import { execute as playerSurrenderExecute } from "./utils/PlayerSurrender.ts";
import { execute as playerUseCoSkillExecute } from "./utils/PlayerUseCoSkill.ts";
import { execute as playerVoteForDrawExecute } from "./utils/PlayerVoteForDraw.ts";
import { execute as systemBeginTurnExecute } from "./utils/SystemBeginTurn.ts";
import { execute as systemCallWarEventExecute } from "./utils/SystemCallWarEvent.ts";
import { execute as systemDestroyPlayerForceExecute } from "./utils/SystemDestroyPlayerForce.ts";
import { execute as systemEndTurnExecute } from "./utils/SystemEndTurn.ts";
import { execute as systemEndWarExecute } from "./utils/SystemEndWar.ts";
import { execute as systemHandleBootPlayerExecute } from "./utils/SystemHandleBootPlayer.ts";
import { execute as systemVoteForDrawExecute } from "./utils/SystemVoteForDraw.ts";
import { execute as unitAttackTileExecute } from "./utils/UnitAttackTile.ts";
import { execute as unitAttackUnitExecute } from "./utils/UnitAttackUnit.ts";
import { execute as unitBeLoadedExecute } from "./utils/UnitBeLoaded.ts";
import { execute as unitBoardedByCoExecute } from "./utils/UnitBoardedByCo.ts";
import { execute as unitBuildTileExecute } from "./utils/UnitBuildTile.ts";
import { execute as unitCaptureTileExecute } from "./utils/UnitCaptureTile.ts";
import { execute as unitCrushUnitExecute } from "./utils/UnitCrushUnit.ts";
import { execute as unitDiveExecute } from "./utils/UnitDive.ts";
import { execute as unitDropUnitExecute } from "./utils/UnitDropUnit.ts";
import { execute as unitJoinUnitExecute } from "./utils/UnitJoinUnit.ts";
import { execute as unitLaunchFlareExecute } from "./utils/UnitLaunchFlare.ts";
import { execute as unitLaunchSiloExecute } from "./utils/UnitLaunchSilo.ts";
import { execute as unitProduceUnitExecute } from "./utils/UnitProduceUnit.ts";
import { execute as unitRepairUnitExecute } from "./utils/UnitRepairUnit.ts";
import { execute as unitSelfDetonateExecute } from "./utils/UnitSelfDetonate.ts";
import { execute as unitSupplyUnitExecute } from "./utils/UnitSupplyUnit.ts";
import { execute as unitSurfaceExecute } from "./utils/UnitSurface.ts";
import { execute as unitUseCoSkillExecute } from "./utils/UnitUseCoSkill.ts";
import { execute as unitWaitExecute } from "./utils/UnitWait.ts";
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
        return await playerDeleteUnitExecute(war, woPlayerDeleteUnit, isFast);
    }

    const woPlayerEndTurn = action.getWoPlayerEndTurn();
    if (woPlayerEndTurn) {
        return await playerEndTurnExecute(war, woPlayerEndTurn, isFast);
    }

    const woPlayerProduceUnit = action.getWoPlayerProduceUnit();
    if (woPlayerProduceUnit) {
        return await playerProduceUnitExecute(war, woPlayerProduceUnit, isFast);
    }

    const woPlayerSurrender = action.getWoPlayerSurrender();
    if (woPlayerSurrender) {
        return await playerSurrenderExecute(war, woPlayerSurrender, isFast);
    }

    const woPlayerUseCoSkill = action.getWoPlayerUseCoSkill();
    if (woPlayerUseCoSkill) {
        return await playerUseCoSkillExecute(war, woPlayerUseCoSkill, isFast);
    }

    const woPlayerVoteForDraw = action.getWoPlayerVoteForDraw();
    if (woPlayerVoteForDraw) {
        return await playerVoteForDrawExecute(war, woPlayerVoteForDraw, isFast);
    }

    const woSystemBeginTurn = action.getWoSystemBeginTurn();
    if (woSystemBeginTurn) {
        return await systemBeginTurnExecute(war, woSystemBeginTurn, isFast);
    }

    const woSystemCallWarEvent = action.getWoSystemCallWarEvent();
    if (woSystemCallWarEvent) {
        return await systemCallWarEventExecute(war, woSystemCallWarEvent, isFast);
    }

    const woSystemDestroyPlayerForce = action.getWoSystemDestroyPlayerForce();
    if (woSystemDestroyPlayerForce) {
        return await systemDestroyPlayerForceExecute(war, woSystemDestroyPlayerForce, isFast);
    }

    const woSystemEndTurn = action.getWoSystemEndTurn();
    if (woSystemEndTurn) {
        return await systemEndTurnExecute(war, woSystemEndTurn, isFast);
    }

    const woSystemEndWar = action.getWoSystemEndWar();
    if (woSystemEndWar) {
        return await systemEndWarExecute(war, woSystemEndWar, isFast);
    }

    const woSystemHandleBootPlayer = action.getWoSystemHandleBootPlayer();
    if (woSystemHandleBootPlayer) {
        return await systemHandleBootPlayerExecute(war, woSystemHandleBootPlayer, isFast);
    }

    const woSystemVoteForDraw = action.getWoSystemVoteForDraw();
    if (woSystemVoteForDraw) {
        return await systemVoteForDrawExecute(war, woSystemVoteForDraw, isFast);
    }

    const woUnitAttackTile = action.getWoUnitAttackTile();
    if (woUnitAttackTile) {
        return await unitAttackTileExecute(war, woUnitAttackTile, isFast);
    }

    const woUnitAttackUnit = action.getWoUnitAttackUnit();
    if (woUnitAttackUnit) {
        return await unitAttackUnitExecute(war, woUnitAttackUnit, isFast);
    }

    const woUnitBeLoaded = action.getWoUnitBeLoaded();
    if (woUnitBeLoaded) {
        return await unitBeLoadedExecute(war, woUnitBeLoaded, isFast);
    }

    const woUnitBoardedByCo = action.getWoUnitBoardedByCo();
    if (woUnitBoardedByCo) {
        return await unitBoardedByCoExecute(war, woUnitBoardedByCo, isFast);
    }

    const woUnitBuildTile = action.getWoUnitBuildTile();
    if (woUnitBuildTile) {
        return await unitBuildTileExecute(war, woUnitBuildTile, isFast);
    }

    const woUnitCaptureTile = action.getWoUnitCaptureTile();
    if (woUnitCaptureTile) {
        return await unitCaptureTileExecute(war, woUnitCaptureTile, isFast);
    }

    const woUnitCrushUnit = action.getWoUnitCrushUnit();
    if (woUnitCrushUnit) {
        return await unitCrushUnitExecute(war, woUnitCrushUnit, isFast);
    }

    const woUnitDive = action.getWoUnitDive();
    if (woUnitDive) {
        return await unitDiveExecute(war, woUnitDive, isFast);
    }

    const woUnitDropUnit = action.getWoUnitDropUnit();
    if (woUnitDropUnit) {
        return await unitDropUnitExecute(war, woUnitDropUnit, isFast);
    }

    const woUnitJoinUnit = action.getWoUnitJoinUnit();
    if (woUnitJoinUnit) {
        return await unitJoinUnitExecute(war, woUnitJoinUnit, isFast);
    }

    const woUnitLaunchFlare = action.getWoUnitLaunchFlare();
    if (woUnitLaunchFlare) {
        return await unitLaunchFlareExecute(war, woUnitLaunchFlare, isFast);
    }

    const woUnitLaunchSilo = action.getWoUnitLaunchSilo();
    if (woUnitLaunchSilo) {
        return await unitLaunchSiloExecute(war, woUnitLaunchSilo, isFast);
    }

    const woUnitProduceUnit = action.getWoUnitProduceUnit();
    if (woUnitProduceUnit) {
        return await unitProduceUnitExecute(war, woUnitProduceUnit, isFast);
    }

    const woUnitRepairUnit = action.getWoUnitRepairUnit();
    if (woUnitRepairUnit) {
        return await unitRepairUnitExecute(war, woUnitRepairUnit, isFast);
    }

    const woUnitSelfDetonate = action.getWoUnitSelfDetonate();
    if (woUnitSelfDetonate) {
        return await unitSelfDetonateExecute(war, woUnitSelfDetonate, isFast);
    }

    const woUnitSupplyUnit = action.getWoUnitSupplyUnit();
    if (woUnitSupplyUnit) {
        return await unitSupplyUnitExecute(war, woUnitSupplyUnit, isFast);
    }

    const woUnitSurface = action.getWoUnitSurface();
    if (woUnitSurface) {
        return await unitSurfaceExecute(war, woUnitSurface, isFast);
    }

    const woUnitUseCoSkill = action.getWoUnitUseCoSkill();
    if (woUnitUseCoSkill) {
        return await unitUseCoSkillExecute(war, woUnitUseCoSkill, isFast);
    }

    const woUnitWait = action.getWoUnitWait();
    if (woUnitWait) {
        return await unitWaitExecute(war, woUnitWait, isFast);
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
