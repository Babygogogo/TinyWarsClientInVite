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
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerSurrender, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
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
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerSurrender): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
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
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerSurrender, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).setAliveState(Players_Constants.AliveStateId.Dying);
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
