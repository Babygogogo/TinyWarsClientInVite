import {
    Bots_Bot,
    Campaigns_Mains_Gateway,
    Campaigns_Wars_War,
    FloatText,
    GamePanels_Dict,
    GamePanels_Manager,
    Helpers_GameFlow,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MultiPlayerWar_Model_MpwModel,
    Players_Constants,
    SingleFreeWars_War,
    SinglePlayerMode_Model_SpmProxy,
    SinglePlayerWars_Constants,
    SinglePlayerWars_War,
    SingleRankedWars_Provider,
    SingleRankedWars_War,
    Turns_Constants,
    Users_Model,
    Users_Utils,
    Utils_ClientErrorCode,
    WarOperations_Executors_Executor,
    WarOperations_Revisers_Reviser,
    WarOperations_Types,
} from "../internal";
import { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer";

const _warsWithRobotRunning = new Set<SinglePlayerWars_War.War>();

export async function handlePlayerOpAndAutoOps(outerWar: SinglePlayerWars_War.War, action: WoContainer): Promise<void> {
    const innerWar = outerWar instanceof SingleRankedWars_War.War
        ? SingleRankedWars_Provider.getOuterWar()
        : undefined;
    if (innerWar == null) {
        throw Helpers_Misc.newError(`No inner war.`);
    }

    if (innerWar.getIsEnded()) {
        throw Helpers_Misc.newError(`war.getIsEnded() is true.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00);
    }
    if (innerWar.getIsExecutingAction()) {
        throw Helpers_Misc.newError(`war.getIsExecutingAction() is true.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_01);
    }
    if (!innerWar.getIsRunning()) {
        throw Helpers_Misc.newError(`war.getIsRunning() is false.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_02);
    }

    await WarOperations_Executors_Executor.checkAndExecute(
        innerWar,
        WarOperations_Revisers_Reviser.revise(innerWar, action, Users_Model.getSelfUserId()),
        false,
    );

    await generateAndRunAutoOps(outerWar);
}

export async function generateAndRunAutoOps(outerWar: SinglePlayerWars_War.War): Promise<void> {
    if (_warsWithRobotRunning.has(outerWar)) {
        return;
    }
    _warsWithRobotRunning.add(outerWar);

    while (true) {
        if ((checkAndEndWar(outerWar))       ||
            (!outerWar.getIsRunning())       ||
            (outerWar.getIsAiPaused())       ||
            (outerWar.getIsViewingWarInfo())
        ) {
            _warsWithRobotRunning.delete(outerWar);
            return;
        }

        const data = await generateNextAutoOp(outerWar);
        if ((checkAndEndWar(outerWar))       ||
            (!outerWar.getIsRunning())       ||
            (outerWar.getIsAiPaused())       ||
            (outerWar.getIsViewingWarInfo())
        ) {
            _warsWithRobotRunning.delete(outerWar);
            return;
        }
        if (!data) {
            break;
        }

        await WarOperations_Executors_Executor.checkAndExecute(
            outerWar,
            WarOperations_Revisers_Reviser.revise(outerWar, data.warOperation, data.userId),
            false,
        );
    }

    if (outerWar.checkIsHumanInTurn()) {
        const retractManager = outerWar.getRetractManager();
        if (retractManager.getCanRetract()) {
            retractManager.addRetractState(outerWar.serialize().encode());
        }
    }

    _warsWithRobotRunning.delete(outerWar);
}

function checkAndEndWar(war: SinglePlayerWars_War.War): boolean {
    if (!war.getIsEnded()) {
        return false;
    }

    const mpwWarId = war instanceof SingleFreeWars_War.War
        ? war.getSaveSlotExtraData()?.getMpwWarId()
        : null;
    if (mpwWarId != null) {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle          : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0964),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0711),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B1446),
            callback          : async () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                    title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
                });

                const warData = await MultiPlayerWar_Model_MpwModel.getOngoingWarData(mpwWarId);
                if (warData) {
                    Helpers_GameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            },
            callbackOnCancel : () => {
                war.setIsEnded(false);
                war.getDrawVoteManager().clearAllVotes();
                for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
                    player.setHasVotedForDraw(false);
                    player.setAliveState(Players_Constants.AliveStateId.Alive);
                }
            },
        });
    } else {
        if (war.getDrawVoteManager().checkIsDraw()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0030),
                callback   : () => Helpers_GameFlow.gotoLobby(),
            });
        } else {
            const humanPlayerArray = war.getPlayerManager().getHumanPlayers();
            if (humanPlayerArray.length <= 0) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                    getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0035),
                    callback   : () => Helpers_GameFlow.gotoLobby(),
                });
            } else {
                if (humanPlayerArray.every(v => v.getAliveState() === Players_Constants.AliveStateId.Dead)) {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0023),
                        callback   : () => Helpers_GameFlow.gotoLobby(),
                    });
                } else {
                    if (war instanceof SingleRankedWars_War.War) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                            getContent : () => Lang_Utils.getFormattedText(
                                Lang_Constants.TextType.F0127,
                                SinglePlayerWars_Constants.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                war.calculateTotalScore(),
                            ),
                            callback : () => {
                                Helpers_GameFlow.gotoLobby();

                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0277),
                                    callback   : () => {
                                        SinglePlayerMode_Model_SpmProxy.reqSpmValidateSrw(war);
                                    },
                                });
                            },
                        });

                    } else if (war instanceof Campaigns_Wars_War.War) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        const newScore      = war.calculateTotalScore();
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                            getContent : () => Lang_Utils.getFormattedText(
                                Lang_Constants.TextType.F0127,
                                SinglePlayerWars_Constants.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                newScore,
                            ),
                            callback : () => {
                                const settingsForCaw    = war.getSettingsForCaw();
                                const campaignId        = settingsForCaw.getCampaignId();
                                const existingInfo      = Users_Model.getSelfCawHighScoreInfo(campaignId, settingsForCaw.getCampaignMapId());
                                if ((existingInfo == null)                                                                  ||
                                    ((settingsForCaw.getCampaignMapRevision()) > (existingInfo.getCampaignMapRevision()))   ||
                                    (newScore > (existingInfo.getHighScore() ?? 0))                                         ||
                                    (war.getGcData().getVersion() !== existingInfo.getConfigVersion())
                                ) {
                                    Campaigns_Mains_Gateway.reqCampaignValidateWar(war);
                                }

                                Helpers_GameFlow.gotoCampaignCreateMapsPanel(campaignId);
                            },
                        });

                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0022),
                            callback   : () => Helpers_GameFlow.gotoLobby(),
                        });
                    }
                }
            }
        }
    }

    return true;
}

async function generateNextAutoOp(war: SinglePlayerWars_War.War): Promise<WarOperations_Types.WarOperationAndUserId | undefined> {
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
                warOperation : resultOperation,
                userId       : undefined,
            };
        }

        if (turnPhaseCode === Turns_Constants.PhaseCode.WaitBeginTurn) {
            resultOperation.createIfNotExistsWoSystemBeginTurn();
            return {
                warOperation : resultOperation,
                userId       : undefined,
            };
        }

        for (const player of playerManager.getAllPlayers(true)) {
            const playerIndex = player.getPlayerIndex();
            if (drawVoteManager.checkCanVote(playerIndex, true)) {
                const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                resultData.setPlayerIndex(playerIndex);
                resultData.setIsAgree(true);
                return {
                    warOperation : resultOperation,
                    userId       : undefined,
                };
            }
        }

        resultOperation.createIfNotExistsWoSystemEndTurn();
        return {
            warOperation : resultOperation,
            userId       : undefined,
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
                warOperation : resultOperation,
                userId       : undefined,
            };
        }
    }

    // Handle the ending war.
    if (war.checkCanEnd()) {
        resultOperation.createIfNotExistsWoSystemEndWar();
        return {
            warOperation : resultOperation,
            userId       : undefined,
        };
    }

    // Handle the WaitBeginTurn phase.
    if (turnPhaseCode === Turns_Constants.PhaseCode.WaitBeginTurn) {
        resultOperation.createIfNotExistsWoSystemBeginTurn();
        return {
            warOperation : resultOperation,
            userId       : undefined,
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
                warOperation : resultOperation,
                userId       : undefined,
            };
        }
    }

    // Handle the booted players (make them dying or end turn).
    if (war.checkIsBoot()) {
        if (!war.getWarStatisticsManager().getManualActionsCount(war.getTurnManager().getTurnIndex(), playerIndexInTurn)) {
            resultOperation.createIfNotExistsWoSystemHandleBootPlayer();
            return {
                warOperation : resultOperation,
                userId       : undefined,
            };
        } else {
            if (drawVoteManager.checkNeedVoteBeforeEndTurn(playerIndexInTurn)) {
                const resultData = resultOperation.createIfNotExistsWoSystemVoteForDraw();
                resultData.setPlayerIndex(playerIndexInTurn);
                resultData.setIsAgree(false);
                return {
                    warOperation : resultOperation,
                    userId       : undefined,
                };
            } else {
                resultOperation.createIfNotExistsWoSystemEndTurn();
                return {
                    warOperation : resultOperation,
                    userId       : undefined,
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
                        warOperation : resultOperation,
                        userId       : undefined,
                    };

                } else if (Users_Utils.checkIsDummy(userId)) {
                    const resultData = resultOperation.createIfNotExistsWoPlayerVoteForDraw();
                    resultData.setPlayerIndex(playerIndex);
                    resultData.setIsAgree(true);
                    return {
                        warOperation : resultOperation,
                        userId       : userId,
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
                warOperation : resultOperation,
                userId       : undefined,
            };

        } else {
            resultOperation.createIfNotExistsWoSystemEndTurn();
            return {
                warOperation : resultOperation,
                userId       : undefined,
            };
        }
    }

    // Handle the robot action.
    {
        const userId = playerInTurn.getUserId();
        if (userId == null) {
            return {
                warOperation : await Bots_Bot.getNextOperation(war),
                userId       : undefined,
            };
        } else if (Users_Utils.checkIsDummy(userId)) {
            return {
                warOperation : await Bots_Bot.getNextOperation(war),
                userId       : userId,
            };
        }
    }

    // No system action available.
    return undefined;
}
