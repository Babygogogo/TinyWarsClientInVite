import {
    FloatText,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExecuteAsOuterWar(war, action);
    } else {
        await normalExecuteAsOuterWar(war, action);
    }
}

function fastExecuteAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerVoteForDraw): void {
    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerVoteForDraw_00),
        isFastExecute   : true,
    });

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

async function normalExecuteAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerVoteForDraw): Promise<void> {
    const desc = await getDesc(war, action);
    if (desc) {
        FloatText.show(desc);
    }

    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerVoteForDraw_00);
    await war.showTempUnitMoveAnimation({
        movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
        aiming            : null,
        callback          : undefined,
    });

    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : commonExtraData,
        isFastExecute   : false,
    });

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerVoteForDraw): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const playerIndex                          = Helpers_Misc.getExisted(operation.getPlayerIndex());
    const isAgree                              = Helpers_Misc.getExisted(operation.getIsAgree());
    const changedThings                        = war.getDrawVoteManager().handleVote(playerIndex, isAgree);
    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);

            const extraData = woContainer.createIfNotExistsWoPlayerVoteForDraw().createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);
            extraData.setPlayerIndex(playerIndex);
            extraData.setIsAgree(isAgree);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerVoteForDraw, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    war.getDrawVoteManager().handleVote(
        action.getPlayerIndex() ?? war.getPlayerIndexInTurn(),
        !!action.getIsAgree(),
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerVoteForDraw): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname);
            } else {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();
        const suffix        = war.getWarOperationDescSuffix();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname)} ${suffix}`;
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname)} ${suffix}`;
            } else {
                return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname)} ${suffix}`;
            }
        }
    } else if (war instanceof SinglePlayerWars_War.War) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname);
            } else {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
