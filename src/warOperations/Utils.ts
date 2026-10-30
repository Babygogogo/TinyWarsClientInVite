import {
    Players_Constants,
    Users_Utils,
    WarOperations_Constants,
    Bots_Bot,
    Helpers_Misc,
    Turns_Constants,
    type SinglePlayerWar_Interface_ISpwWar,
    type WarOperations_Types,
} from "../internal.ts";
import { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export function checkIsValidWarOperationsLimit(warOperationsLimit: number): boolean {
    return (warOperationsLimit >= WarOperations_Constants.Common.MinLimit)
        && (warOperationsLimit <= WarOperations_Constants.Common.MaxLimit);
}

export async function getNextSystemOrBotOperation(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): Promise<WarOperations_Types.WarOperationAndUserId | undefined> {
    if ((war == null) || (war.getIsEnded())) {
        return undefined;
    }

    // Handle turns limit.
    const playerManager     = war.getPlayerManager();
    const turnPhaseCode     = war.getTurnPhaseCode();
    const drawVoteManager   = war.getDrawVoteManager();
    const resultOperation   = WoContainer.fromJson({
        operationId : war.getExecutedOperationManager().getExecutedOperationsCount(),
    });

    if (war.checkIsExceedTurnsOrWarOperationsLimit()) {
        if (war.checkCanEnd()) {
            resultOperation.createIfNotExistsWoSystemEndWar();
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        }

        if (turnPhaseCode === Turns_Constants.PhaseCode.WaitBeginTurn) {
            resultOperation.createIfNotExistsWoSystemBeginTurn();
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        }

        for (const player of playerManager.getAllPlayers(true)) {
            const playerIndex = player.getPlayerIndex();
            if (drawVoteManager.checkCanVote(playerIndex, true)) {
                const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                resultData.setPlayerIndex(playerIndex);
                resultData.setIsAgree(true);
                return {
                    warOperation    : resultOperation,
                    userId          : undefined,
                };
            }
        }

        resultOperation.createIfNotExistsWoSystemEndTurn();
        return {
            warOperation    : resultOperation,
            userId          : undefined,
        };
    }

    // Handle war events.
    {
        const warEventIdAndDataIndex = war.getWarEventManager().getCallableWarEventIdAndDataIndex();
        if (warEventIdAndDataIndex != null) {
            const resultData = resultOperation.createIfNotExistsWoSystemCallWarEvent();
            resultData.setWarEventId(warEventIdAndDataIndex.warEventId);
            resultData.setNodeAndActionsIndex(warEventIdAndDataIndex.dataIndex);
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        }
    }

    // Handle the ending war.
    if (war.checkCanEnd()) {
        resultOperation.createIfNotExistsWoSystemEndWar();
        return {
            warOperation    : resultOperation,
            userId          : undefined,
        };
    }

    // Handle the WaitBeginTurn phase.
    if (turnPhaseCode === Turns_Constants.PhaseCode.WaitBeginTurn) {
        resultOperation.createIfNotExistsWoSystemBeginTurn();
        return {
            warOperation    : resultOperation,
            userId          : undefined,
        };
    } else if (turnPhaseCode != Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turn phase code: ${turnPhaseCode}.`);
    }

    // Handle the dying players (destroy force).
    const playerInTurn      = playerManager.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    for (const playerIndex of playerManager.getPlayerIndexArray(playerIndexInTurn + 1, false)) {
        if (playerManager.getPlayer(playerIndex).getAliveState() === Players_Constants.AliveStateId.Dying) {
            const resultData = resultOperation.createIfNotExistsWoSystemDestroyPlayerForce();
            resultData.setTargetPlayerIndex(playerIndex);
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        }
    }

    // Handle the booted players (make them dying or end turn).
    if (war.checkIsBoot()) {
        if (!war.getWarStatisticsManager().getManualActionsCount(war.getTurnManager().getTurnIndex(), playerIndexInTurn)) {
            resultOperation.createIfNotExistsWoSystemHandleBootPlayer();
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        } else {
            if (drawVoteManager.checkNeedVoteBeforeEndTurn(playerIndexInTurn)) {
                const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                resultData.setPlayerIndex(playerIndexInTurn);
                resultData.setIsAgree(false);
                return {
                    warOperation    : resultOperation,
                    userId          : undefined,
                };
            } else {
                resultOperation.createIfNotExistsWoSystemEndTurn();
                return {
                    warOperation    : resultOperation,
                    userId          : undefined,
                };
            }
        }
    }

    // Handle system vote for draw.
    if (drawVoteManager.checkHasOngoingVote()) {
        // 以前是只让中立AI、以及挂掉的真人玩家（AI代持），轮到自己的回合时才投赞成票
        // 现在是让上述两类玩家，以及参战AI玩家都直接投票，不用等到它们自己的回合
        // 严格来说参战AI玩家只能由robot在自己的回合时通过playerVoteForDraw投票
        // 但是这里忽略这个限制，直接通过systemVoteForDraw投票以避免玩家无谓等待
        for (const player of playerManager.getAllPlayers(true)) {
            const playerIndex = player.getPlayerIndex();
            if (drawVoteManager.checkCanVote(playerIndex, true)) {
                const userId = player.getUserId();
                if ((player.checkIsNeutral())                               ||
                    (player.getAliveState() === Players_Constants.AliveStateId.Dead)    ||
                    (userId == null)
                ) {
                    const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                    resultData.setPlayerIndex(playerIndex);
                    resultData.setIsAgree(true);
                    return {
                        warOperation    : resultOperation,
                        userId          : undefined,
                    };

                } else if (Users_Utils.checkIsDummy(userId)) {
                    const resultData = resultOperation.createIfNotExistsWoPlayerVoteForDraw();
                    resultData.setPlayerIndex(playerIndex);
                    resultData.setIsAgree(true);
                    return {
                        warOperation    : resultOperation,
                        userId          : userId,
                    };
                }
            }
        }
    }

    // Handle system end turn.
    if ((playerInTurn.checkIsNeutral())                             ||
        (playerInTurn.getAliveState() === Players_Constants.AliveStateId.Dead)  ||
        (playerInTurn.getIsSkipTurn())
    ) {
        if (drawVoteManager.checkNeedVoteBeforeEndTurn(playerIndexInTurn)) {
            const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
            resultData.setPlayerIndex(playerIndexInTurn);
            resultData.setIsAgree((playerInTurn.getUserId() == null) || (playerInTurn.getAliveState() === Players_Constants.AliveStateId.Dead));
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };

        } else {
            resultOperation.createIfNotExistsWoSystemEndTurn();
            return {
                warOperation    : resultOperation,
                userId          : undefined,
            };
        }
    }

    // Handle the robot action.
    {
        const userId = playerInTurn.getUserId();
        if (userId == null) {
            return {
                warOperation    : await Bots_Bot.getNextOperation(war),
                userId          : undefined,
            };
        } else if (Users_Utils.checkIsDummy(userId)) {
            return {
                warOperation    : await Bots_Bot.getNextOperation(war),
                userId          : userId,
            };
        }
    }

    // No system action available.
    return undefined;
}
