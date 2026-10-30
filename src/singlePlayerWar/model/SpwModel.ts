import {
    GameConfigs_Provider,
    Campaigns_Mains_Gateway,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    FloatText,
    SingleRankWar_Model_SrwWar,
    Campaigns_Wars_War,
    Players_Constants,
    WarOperations_Executors_Executor,
    Utils_ClientErrorCode,
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Utils,
    MultiPlayerWar_Model_MpwModel,
    Users_Model,
    Helpers_GameFlow,
    SinglePlayerWars_Constants,
    SinglePlayerMode_Model_SpmProxy,
    WarOperations_Revisers_Reviser,
    Lang_Constants,
    Logger,
    type SinglePlayerWar_Interface_ISpwWar,
} from "../../internal.ts";

import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

let _war: SinglePlayerWar_Interface_ISpwWar.ISpwWar | null = null;

export function init(): void {
    // nothing to do.
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar({ warData, slotIndex, slotExtraData }: {
    warData         : SerialWar;
    slotIndex       : number | null;
    slotExtraData   : SpmWarSaveSlotExtraData | null;
}): Promise<SinglePlayerWar_Interface_ISpwWar.ISpwWar> {
    if (getWar()) {
        Logger.warn(`SpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const data  = warData.clone();
    const war   = createWarByWarData(data);
    war.setSaveSlotIndex(slotIndex);
    war.setSaveSlotExtraData(slotExtraData?.clone());
    war.init(data, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(data.getSettingsForCommon()?.getConfigVersion())));
    war.startRunning().startRunningView();
    setWar(war);

    return war;
}

export function unloadWar(): void {
    const war = getWar();
    if (war) {
        war.stopRunning();
        setWar(null);
    }
}

export function getWar(): SinglePlayerWar_Interface_ISpwWar.ISpwWar | null {
    return _war;
}
function setWar(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar | null): void {
    _war = war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Util functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warsWithRobotRunning = new Set<SinglePlayerWar_Interface_ISpwWar.ISpwWar>();

export async function handlePlayerActionAndAutoActions(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar, action: WoContainer): Promise<void> {
    if (war.getIsEnded()) {
        throw Helpers_Misc.newError(`war.getIsEnded() is true.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00);
    }
    if (war.getIsExecutingAction()) {
        throw Helpers_Misc.newError(`war.getIsExecutingAction() is true.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_01);
    }
    if (!war.getIsRunning()) {
        throw Helpers_Misc.newError(`war.getIsRunning() is false.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_02);
    }

    await WarOperations_Executors_Executor.checkAndExecute(
        war,
        WarOperations_Revisers_Reviser.revise(war, action, Users_Model.getSelfUserId()),
        false,
    );

    await checkAndHandleAutoActionsAndRobotRecursively(war);
}

export async function checkAndHandleAutoActionsAndRobotRecursively(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): Promise<void> {
    if (_warsWithRobotRunning.has(war)) {
        return;
    }
    _warsWithRobotRunning.add(war);

    while (true) {
        if ((checkAndEndWar(war))       ||
            (!war.getIsRunning())       ||
            (war.getIsAiPaused())       ||
            (war.getIsViewingWarInfo())
        ) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        const data = await WarOperations_Utils.getNextSystemOrBotOperation(war);
        if ((checkAndEndWar(war))       ||
            (!war.getIsRunning())       ||
            (war.getIsAiPaused())       ||
            (war.getIsViewingWarInfo())
        ) {
            _warsWithRobotRunning.delete(war);
            return;
        }
        if (!data) {
            break;
        }

        await WarOperations_Executors_Executor.checkAndExecute(
            war,
            WarOperations_Revisers_Reviser.revise(war, data.warOperation, data.userId),
            false,
        );
    }

    if (war.checkIsHumanInTurn()) {
        const retractManager = war.getRetractManager();
        if (retractManager.getCanRetract()) {
            retractManager.addRetractState(war.serialize().encode());
        }
    }

    _warsWithRobotRunning.delete(war);
}

function checkAndEndWar(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): boolean {
    if (!war.getIsEnded()) {
        return false;
    }

    const mpwWarId = war instanceof SingleFreeWar_Model_SfwWar.SfwWar
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
                    if (war instanceof SingleRankWar_Model_SrwWar.SrwWar) {
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
                                if ((existingInfo == null)                                                                          ||
                                    ((settingsForCaw.getCampaignMapRevision()) > (existingInfo.getCampaignMapRevision())) ||
                                    (newScore > (existingInfo.getHighScore() ?? 0))                                                 ||
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

function createWarByWarData(warData: SerialWar): SinglePlayerWar_Interface_ISpwWar.ISpwWar {
    if (warData.getSettingsForScw()) {
        return new SingleCustomWar_Model_ScwWar.ScwWar();
    } else if (warData.getSettingsForSfw()) {
        return new SingleFreeWar_Model_SfwWar.SfwWar();
    } else if (warData.getSettingsForSrw()) {
        return new SingleRankWar_Model_SrwWar.SrwWar();
    } else if (warData.getSettingsForCaw()) {
        return new Campaigns_Wars_War.War();
    } else {
        throw Helpers_Misc.newError(`Invalid warData.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_CreateWarByWarData_00);
    }
}
