import {
    Destructions_Utils,
    HalfwayReplayWar_Model_HrwWar,
    Helpers_Misc,
    Lang_Constants, Lang_TextType,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), isFast
        ? Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemDestroyPlayerForce_00
        : Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemDestroyPlayerForce_00);
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
    war.getDrawVoteManager().handlePlayerForceDestruction();

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemDestroyPlayerForce): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const playerIndex                          = Helpers_Misc.getExisted(operation.getTargetPlayerIndex());
    const changedThings                        = Destructions_Utils.destroyPlayerForce(war, playerIndex, false);

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

            const warOp     = woContainer.createIfNotExistsWoSystemDestroyPlayerForce();
            const extraData = warOp.createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);
            extraData.setTargetPlayerIndex(playerIndex);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
    Destructions_Utils.destroyPlayerForce(war, Helpers_Misc.getExisted(action.getTargetPlayerIndex()), !isFast);
    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce): Promise<string | null> {
    if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_TextType.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_TextType.TextType.B0450)}`;
    } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_TextType.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        const playerIndex = Helpers_Misc.getExisted(action.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_TextType.TextType.B0450)}`;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
