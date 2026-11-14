import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type SinglePlayerWars_War,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemVoteForDraw(war, action);
    } else {
        await normalExeSystemVoteForDraw(war, action);
    }
}

function fastExeSystemVoteForDraw(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemVoteForDraw_00),
            isFastExecute   : true,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

async function normalExeSystemVoteForDraw(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw): Promise<void> {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemVoteForDraw_00);
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
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemVoteForDraw): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
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
