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

import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoPlayerSurrender, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerSurrender(war, action);
    } else {
        await normalExePlayerSurrender(war, action);
    }
}

function fastExePlayerSurrender(war: BaseWar_Model_War.War, action: WoPlayerSurrender): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerSurrender_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

async function normalExePlayerSurrender(war: BaseWar_Model_War.War, action: WoPlayerSurrender): Promise<void> {
    const desc = await getDesc(war, action);
    if (desc) {
        FloatText.show(desc);
    }

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerSurrender_00);
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
        war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerSurrender): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const playerIndex                           = Helpers_Misc.getExisted(operation.getPlayerIndex());
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const player                                = war.getPlayer(playerIndex);
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

            const actionData = woContainer.createIfNotExistsWoPlayerSurrender();
            actionData.setPlayerIndex(playerIndex);
            actionData.createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerSurrender): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0008,
            await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname(),
        );
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0055)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0008,
            await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname(),
        );
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
