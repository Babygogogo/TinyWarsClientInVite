import * as CampaignsMainsGateway from "../../campaigns/mains/Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as Logger2 from "../../Logger.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as SinglePlayerModeModelSpmProxy from "../../singlePlayerMode/model/SpmProxy.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../interface/ISpwWar.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsExecutor from "../../warOperations/executors/Executor.ts";
import * as WarOperationsRevisersReviser from "../../warOperations/revisers/Reviser.ts";
import * as WarOperationsUtils from "../../warOperations/Utils.ts";

type SerialWar                  = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SpmWarSaveSlotExtraData    = ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData;

let _war: SinglePlayerWarInterfaceISpwWar.ISpwWar | null = null;

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
}): Promise<SinglePlayerWarInterfaceISpwWar.ISpwWar> {
    if (getWar()) {
        Logger2.warn(`SpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const data  = warData.clone();
    const war   = createWarByWarData(data);
    war.setSaveSlotIndex(slotIndex);
    war.setSaveSlotExtraData(slotExtraData?.clone());
    war.init(data, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(data.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): SinglePlayerWarInterfaceISpwWar.ISpwWar | null {
    return _war;
}
function setWar(war: SinglePlayerWarInterfaceISpwWar.ISpwWar | null): void {
    _war = war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Util functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warsWithRobotRunning = new Set<SinglePlayerWarInterfaceISpwWar.ISpwWar>();

export async function handlePlayerActionAndAutoActions(war: SinglePlayerWarInterfaceISpwWar.ISpwWar, action: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer): Promise<void> {
    if (war.getIsEnded()) {
        throw HelpersMisc.newError(`war.getIsEnded() is true.`, UtilsClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00);
    }
    if (war.getIsExecutingAction()) {
        throw HelpersMisc.newError(`war.getIsExecutingAction() is true.`, UtilsClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_01);
    }
    if (!war.getIsRunning()) {
        throw HelpersMisc.newError(`war.getIsRunning() is false.`, UtilsClientErrorCode.ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_02);
    }

    await WarOperationsExecutorsExecutor.checkAndExecute(
        war,
        WarOperationsRevisersReviser.revise(war, action, UsersModel.getSelfUserId()),
        false
    );

    await checkAndHandleAutoActionsAndRobotRecursively(war);
}

export async function checkAndHandleAutoActionsAndRobotRecursively(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): Promise<void> {
    if (_warsWithRobotRunning.has(war)) {
        return;
    }
    _warsWithRobotRunning.add(war);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if ((checkAndEndWar(war))       ||
            (!war.getIsRunning())       ||
            (war.getIsAiPaused())       ||
            (war.getIsViewingWarInfo())
        ) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        const data = await WarOperationsUtils.getNextSystemOrBotOperation(war);
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

        await WarOperationsExecutorsExecutor.checkAndExecute(
            war,
            WarOperationsRevisersReviser.revise(war, data.warOperation, data.userId),
            false
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

function checkAndEndWar(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): boolean {
    if (!war.getIsEnded()) {
        return false;
    }

    const mpwWarId = war instanceof GameHelpersGhFactory.getSfwWarClass()
        ? war.getSaveSlotExtraData()?.getMpwWarId()
        : null;
    if (mpwWarId != null) {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle            : () => LangUtils.getText(LangConstants.TextType.B0088),
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0964),
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0711),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B1446),
            callback            : async () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                    title   : LangUtils.getText(LangConstants.TextType.B0088),
                    content : LangUtils.getText(LangConstants.TextType.A0040),
                });

                const warData = await MultiPlayerWarModelMpwModel.getOngoingWarData(mpwWarId);
                if (warData) {
                    HelpersGameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            },
            callbackOnCancel    : () => {
                war.setIsEnded(false);
                war.getDrawVoteManager().clearAllVotes();
                for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
                    player.setHasVotedForDraw(false);
                    player.setAliveState(PlayersConstants.AliveStateId.Alive);
                }
            },
        });
    } else {
        if (war.getDrawVoteManager().checkIsDraw()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                getTitle    : () => LangUtils.getText(LangConstants.TextType.B0088),
                getContent  : () => LangUtils.getText(LangConstants.TextType.A0030),
                callback    : () => HelpersGameFlow.gotoLobby(),
            });
        } else {
            const humanPlayerArray = war.getPlayerManager().getHumanPlayers();
            if (humanPlayerArray.length <= 0) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                    getTitle    : () => LangUtils.getText(LangConstants.TextType.B0088),
                    getContent  : () => LangUtils.getText(LangConstants.TextType.A0035),
                    callback    : () => HelpersGameFlow.gotoLobby(),
                });
            } else {
                if (humanPlayerArray.every(v => v.getAliveState() === PlayersConstants.AliveStateId.Dead)) {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                        getTitle    : () => LangUtils.getText(LangConstants.TextType.B0088),
                        getContent  : () => LangUtils.getText(LangConstants.TextType.A0023),
                        callback    : () => HelpersGameFlow.gotoLobby(),
                    });
                } else {
                    if (war instanceof GameHelpersGhFactory.getSrwWarClass()) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                            getContent : () => LangUtils.getFormattedText(
                                LangConstants.TextType.F0127,
                                GameConfigGcWar.SinglePlayerWar.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                war.calculateTotalScore(),
                            ),
                            callback: () => {
                                HelpersGameFlow.gotoLobby();

                                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                                    getContent : () => LangUtils.getText(LangConstants.TextType.A0277),
                                    callback: () => {
                                        SinglePlayerModeModelSpmProxy.reqSpmValidateSrw(war);
                                    },
                                });
                            },
                        });

                    } else if (war instanceof GameHelpersGhFactory.getCawWarClass()) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        const newScore      = war.calculateTotalScore();
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                            getContent : () => LangUtils.getFormattedText(
                                LangConstants.TextType.F0127,
                                GameConfigGcWar.SinglePlayerWar.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                newScore,
                            ),
                            callback: () => {
                                const settingsForCaw    = war.getSettingsForCaw();
                                const campaignId        = settingsForCaw.getCampaignId() ?? 0;
                                const existingInfo      = UsersModel.getSelfCawHighScoreInfo(campaignId, settingsForCaw.getCampaignMapId() ?? 0);
                                if ((existingInfo == null)                                                                          ||
                                    ((settingsForCaw.getCampaignMapRevision() ?? 0) > (existingInfo.getCampaignMapRevision() ?? 0)) ||
                                    (newScore > (existingInfo.getHighScore() ?? 0))                                                 ||
                                    (war.getGcData().getVersion() !== existingInfo.getConfigVersion())
                                ) {
                                    CampaignsMainsGateway.reqCampaignValidateWar(war);
                                }

                                HelpersGameFlow.gotoCampaignCreateMapsPanel(campaignId);
                            },
                        });

                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                            getTitle    : () => LangUtils.getText(LangConstants.TextType.B0088),
                            getContent  : () => LangUtils.getText(LangConstants.TextType.A0022),
                            callback    : () => HelpersGameFlow.gotoLobby(),
                        });
                    }
                }
            }
        }
    }

    return true;
}

function createWarByWarData(warData: SerialWar): SinglePlayerWarInterfaceISpwWar.ISpwWar {
    if (warData.getSettingsForScw()) {
        return new (GameHelpersGhFactory.getScwWarClass())();
    } else if (warData.getSettingsForSfw()) {
        return new (GameHelpersGhFactory.getSfwWarClass())();
    } else if (warData.getSettingsForSrw()) {
        return new (GameHelpersGhFactory.getSrwWarClass())();
    } else if (warData.getSettingsForCaw()) {
        return new (GameHelpersGhFactory.getCawWarClass())();
    } else {
        throw HelpersMisc.newError(`Invalid warData.`, UtilsClientErrorCode.ClientErrorCode.SpwModel_CreateWarByWarData_00);
    }
}
