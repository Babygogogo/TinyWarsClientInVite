import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    FloatText,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    Players_Constants,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemHandleBootPlayer(war, action);
    } else {
        await normalExeSystemHandleBootPlayer(war, action);
    }
}

function fastExeSystemHandleBootPlayer(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemHandleBootPlayer_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

async function normalExeSystemHandleBootPlayer(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): Promise<void> {
    const desc = await getDesc(war, action);
    if (desc) {
        FloatText.show(desc);
    }

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemHandleBootPlayer_00);
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

    } else {
        war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemHandleBootPlayer): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const player                              = war.getPlayerInTurn();
    player.setAliveState(Players_Constants.AliveStateId.Dying);

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ players : [player] });
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
            woContainer.createIfNotExistsWoSystemHandleBootPlayer().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExecuteAsUnifiedWar(war, action);
    } else {
        await normalExecuteAsUnifiedWar(war, action);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fastExecuteAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): void {
    war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
}

async function normalExecuteAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): Promise<void> {
    const desc = await getDesc(war, action);
    if (desc) {
        FloatText.show(desc);
    }

    war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
