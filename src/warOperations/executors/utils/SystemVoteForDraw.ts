import {
    Helpers_Misc,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
    type SinglePlayerWars_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw, isFast: boolean): Promise<void> {
    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), isFast
        ? Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemVoteForDraw_00
        : Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemVoteForDraw_00);
    if (!isFast) {
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });
    }

    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : commonExtraData,
        isFastExecute   : isFast,
    });

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemVoteForDraw): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const playerIndex                           = Helpers_Misc.getExisted(operation.getPlayerIndex());
    const isAgree                               = Helpers_Misc.getExisted(operation.getIsAgree());
    const changedThings                         = war.getDrawVoteManager().handleVote(playerIndex, isAgree);

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

            const extraData = woContainer.createIfNotExistsWoSystemVoteForDraw().createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);
            extraData.setPlayerIndex(playerIndex);
            extraData.setIsAgree(isAgree);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw, isFast: boolean): Promise<void> {
    war.getDrawVoteManager().handleVote(
        action.getPlayerIndex() ?? war.getPlayerIndexInTurn(),
        !!action.getIsAgree(),
    );
}
