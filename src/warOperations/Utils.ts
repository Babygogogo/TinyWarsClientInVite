import * as BotsBot from "../bots/Bot.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as PlayersConstants from "../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../singlePlayerWar/interface/ISpwWar.ts";
import * as TurnsConstants from "../turns/Constants.ts";
import * as UsersUtils from "../users/Utils.ts";
import * as WarOperationsConstants from "./Constants.ts";
import type * as WarOperationsTypes from "./Types.ts";

export function checkIsValidWarOperationsLimit(warOperationsLimit: number): boolean {
    return (warOperationsLimit >= WarOperationsConstants.Common.MinLimit)
        && (warOperationsLimit <= WarOperationsConstants.Common.MaxLimit);
}

export async function getNextSystemOrBotOperation(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): Promise<WarOperationsTypes.WarOperationAndUserId | undefined> {
    if ((war == null) || (war.getIsEnded())) {
        return undefined;
    }

    // Handle turns limit.
    const playerManager     = war.getPlayerManager();
    const turnPhaseCode     = war.getTurnPhaseCode();
    const drawVoteManager   = war.getDrawVoteManager();
    const resultOperation   = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
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

        if (turnPhaseCode === TurnsConstants.PhaseCode.WaitBeginTurn) {
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
    if (turnPhaseCode === TurnsConstants.PhaseCode.WaitBeginTurn) {
        resultOperation.createIfNotExistsWoSystemBeginTurn();
        return {
            warOperation    : resultOperation,
            userId          : undefined,
        };
    } else if (turnPhaseCode != TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turn phase code: ${turnPhaseCode}.`);
    }

    // Handle the dying players (destroy force).
    const playerInTurn      = playerManager.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    for (const playerIndex of playerManager.getPlayerIndexArray(playerIndexInTurn + 1, false)) {
        if (playerManager.getPlayer(playerIndex).getAliveState() === PlayersConstants.AliveStateId.Dying) {
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
                    (player.getAliveState() === PlayersConstants.AliveStateId.Dead)    ||
                    (userId == null)
                ) {
                    const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                    resultData.setPlayerIndex(playerIndex);
                    resultData.setIsAgree(true);
                    return {
                        warOperation    : resultOperation,
                        userId          : undefined,
                    };

                } else if (UsersUtils.checkIsDummy(userId)) {
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
        (playerInTurn.getAliveState() === PlayersConstants.AliveStateId.Dead)  ||
        (playerInTurn.getIsSkipTurn())
    ) {
        if (drawVoteManager.checkNeedVoteBeforeEndTurn(playerIndexInTurn)) {
            const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
            resultData.setPlayerIndex(playerIndexInTurn);
            resultData.setIsAgree((playerInTurn.getUserId() == null) || (playerInTurn.getAliveState() === PlayersConstants.AliveStateId.Dead));
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
                warOperation    : await BotsBot.getNextOperation(war),
                userId          : undefined,
            };
        } else if (UsersUtils.checkIsDummy(userId)) {
            return {
                warOperation    : await BotsBot.getNextOperation(war),
                userId          : userId,
            };
        }
    }

    // No system action available.
    return undefined;
}
