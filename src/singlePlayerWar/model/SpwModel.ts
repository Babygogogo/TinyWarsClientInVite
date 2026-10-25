import { reqCampaignValidateWar } from "../../campaigns/mains/Gateway.ts";
import { showLang } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { SinglePlayerWar } from "../../gameConfig/GcWar.ts";
import { getSfwWarClass, getSrwWarClass, getCawWarClass, getScwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { gotoMultiPlayerWar, gotoLobby, gotoCampaignCreateMapsPanel } from "../../helpers/GameFlow.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText } from "../../lang/Utils.ts";
import { warn } from "../../Logger.ts";
import { getOngoingWarData } from "../../multiPlayerWar/model/MpwModel.ts";
import { AliveStateId } from "../../players/Constants.ts";
import type {
    SpmWarSaveSlotExtraData as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData,
} from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type {
    SerialWar as ProtoSchemaCommonProtoWarSerializationSerialWar,
} from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { reqSpmValidateSrw } from "../../singlePlayerMode/model/SpmProxy.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { getSelfUserId, getSelfCawHighScoreInfo } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { checkAndExecute } from "../../warOperations/executors/Executor.ts";
import { revise } from "../../warOperations/revisers/Reviser.ts";
import { getNextSystemOrBotOperation } from "../../warOperations/Utils.ts";

type SerialWar                  = ProtoSchemaCommonProtoWarSerializationSerialWar;
type SpmWarSaveSlotExtraData    = ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData;

let _war: ISpwWar | null = null;

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
}): Promise<ISpwWar> {
    if (getWar()) {
        warn(`SpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const data  = warData.clone();
    const war   = createWarByWarData(data);
    war.setSaveSlotIndex(slotIndex);
    war.setSaveSlotExtraData(slotExtraData?.clone());
    war.init(data, await getGameConfig(getExisted(data.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): ISpwWar | null {
    return _war;
}
function setWar(war: ISpwWar | null): void {
    _war = war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Util functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warsWithRobotRunning = new Set<ISpwWar>();

export async function handlePlayerActionAndAutoActions(war: ISpwWar, action: WoContainer): Promise<void> {
    if (war.getIsEnded()) {
        throw newError(`war.getIsEnded() is true.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00);
    }
    if (war.getIsExecutingAction()) {
        throw newError(`war.getIsExecutingAction() is true.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_01);
    }
    if (!war.getIsRunning()) {
        throw newError(`war.getIsRunning() is false.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_02);
    }

    await checkAndExecute(
        war,
        revise(war, action, getSelfUserId()),
        false
    );

    await checkAndHandleAutoActionsAndRobotRecursively(war);
}

export async function checkAndHandleAutoActionsAndRobotRecursively(war: ISpwWar): Promise<void> {
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

        const data = await getNextSystemOrBotOperation(war);
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

        await checkAndExecute(
            war,
            revise(war, data.warOperation, data.userId),
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

function checkAndEndWar(war: ISpwWar): boolean {
    if (!war.getIsEnded()) {
        return false;
    }

    const mpwWarId = war instanceof getSfwWarClass()
        ? war.getSaveSlotExtraData()?.getMpwWarId()
        : null;
    if (mpwWarId != null) {
        openPanel(getDict().CommonConfirmPanel, {
            getTitle            : () => getText(TextType.B0088),
            getContent          : () => getText(TextType.A0964),
            getTextForConfirm   : () => getText(TextType.B0711),
            getTextForCancel    : () => getText(TextType.B1446),
            callback            : async () => {
                openPanel(getDict().CommonBlockPanel, {
                    title   : getText(TextType.B0088),
                    content : getText(TextType.A0040),
                });

                const warData = await getOngoingWarData(mpwWarId);
                if (warData) {
                    gotoMultiPlayerWar(warData);
                } else {
                    showLang(TextType.YouCanNotDoThisRightNow);
                }

                closePanel(getDict().CommonBlockPanel);
            },
            callbackOnCancel    : () => {
                war.setIsEnded(false);
                war.getDrawVoteManager().clearAllVotes();
                for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
                    player.setHasVotedForDraw(false);
                    player.setAliveState(AliveStateId.Alive);
                }
            },
        });
    } else {
        if (war.getDrawVoteManager().checkIsDraw()) {
            openPanel(getDict().CommonAlertPanel, {
                getTitle    : () => getText(TextType.B0088),
                getContent  : () => getText(TextType.A0030),
                callback    : () => gotoLobby(),
            });
        } else {
            const humanPlayerArray = war.getPlayerManager().getHumanPlayers();
            if (humanPlayerArray.length <= 0) {
                openPanel(getDict().CommonAlertPanel, {
                    getTitle    : () => getText(TextType.B0088),
                    getContent  : () => getText(TextType.A0035),
                    callback    : () => gotoLobby(),
                });
            } else {
                if (humanPlayerArray.every(v => v.getAliveState() === AliveStateId.Dead)) {
                    openPanel(getDict().CommonAlertPanel, {
                        getTitle    : () => getText(TextType.B0088),
                        getContent  : () => getText(TextType.A0023),
                        callback    : () => gotoLobby(),
                    });
                } else {
                    if (war instanceof getSrwWarClass()) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        openPanel(getDict().CommonAlertPanel, {
                            getTitle   : () => getText(TextType.B0088),
                            getContent : () => getFormattedText(
                                TextType.F0127,
                                SinglePlayerWar.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                war.calculateTotalScore(),
                            ),
                            callback: () => {
                                gotoLobby();

                                openPanel(getDict().CommonConfirmPanel, {
                                    getContent : () => getText(TextType.A0277),
                                    callback: () => {
                                        reqSpmValidateSrw(war);
                                    },
                                });
                            },
                        });

                    } else if (war instanceof getCawWarClass()) {
                        const turnIndex     = war.getTurnManager().getTurnIndex();
                        const actionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
                        const newScore      = war.calculateTotalScore();
                        openPanel(getDict().CommonAlertPanel, {
                            getTitle   : () => getText(TextType.B0088),
                            getContent : () => getFormattedText(
                                TextType.F0127,
                                SinglePlayerWar.PlayerScore.BaseScore,
                                `${(turnIndex - 1) * -1000} (${turnIndex})`,
                                `${-actionsCount} (${actionsCount})`,
                                war.getTaskObjectiveManager().getScore(),
                                newScore,
                            ),
                            callback: () => {
                                const settingsForCaw    = war.getSettingsForCaw();
                                const campaignId        = settingsForCaw.getCampaignId() ?? 0;
                                const existingInfo      = getSelfCawHighScoreInfo(campaignId, settingsForCaw.getCampaignMapId() ?? 0);
                                if ((existingInfo == null)                                                                          ||
                                    ((settingsForCaw.getCampaignMapRevision() ?? 0) > (existingInfo.getCampaignMapRevision() ?? 0)) ||
                                    (newScore > (existingInfo.getHighScore() ?? 0))                                                 ||
                                    (war.getGcData().getVersion() !== existingInfo.getConfigVersion())
                                ) {
                                    reqCampaignValidateWar(war);
                                }

                                gotoCampaignCreateMapsPanel(campaignId);
                            },
                        });

                    } else {
                        openPanel(getDict().CommonAlertPanel, {
                            getTitle    : () => getText(TextType.B0088),
                            getContent  : () => getText(TextType.A0022),
                            callback    : () => gotoLobby(),
                        });
                    }
                }
            }
        }
    }

    return true;
}

function createWarByWarData(warData: SerialWar): ISpwWar {
    if (warData.getSettingsForScw()) {
        return new (getScwWarClass())();
    } else if (warData.getSettingsForSfw()) {
        return new (getSfwWarClass())();
    } else if (warData.getSettingsForSrw()) {
        return new (getSrwWarClass())();
    } else if (warData.getSettingsForCaw()) {
        return new (getCawWarClass())();
    } else {
        throw newError(`Invalid warData.`, ClientErrorCode.SpwModel_CreateWarByWarData_00);
    }
}
