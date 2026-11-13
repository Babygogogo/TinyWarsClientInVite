import {
    FloatText,
    GamePanels_Dict,
    GamePanels_Manager,
    Lang_Constants,
    Lang_Utils,
    LocalData_Storage,
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
import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemBeginTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemBeginTurn(war, action);
    } else {
        await normalExeSystemBeginTurn(war, action);
    }
}

async function fastExeSystemBeginTurn(war: BaseWar_Model_War.War, action: WoSystemBeginTurn): Promise<void> {
    if (action.getExtraData()) {
        await war.getTurnManager().endPhaseStandbyWithExtraData(action, true);
    } else {
        war.getTurnManager().endPhaseStandbyWithoutExtraData(true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemBeginTurn(war: BaseWar_Model_War.War, action: WoSystemBeginTurn): Promise<void> {
    // const desc = await war.getDescForExeSystemBeginTurn(action);
    // (desc) && (FloatText.show(desc));

    // return war.getTurnManager().endPhaseWaitBeginTurn(action);

    const playerInTurn  = war.getPlayerInTurn();
    const playerIndex   = playerInTurn.getPlayerIndex();
    if ((playerIndex !== Players_Constants.PlayerIndex.Neutral)         &&
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Dead)
    ) {
        const nickname = await playerInTurn.getNickname();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (!LocalData_Storage.getIsShowReplayTurnStartPopup())) {
            FloatText.show(`[P${playerIndex} ${nickname}] ${Lang_Utils.getText(Lang_Constants.TextType.B0679)}`);
        } else {
            await new Promise<void>(resolve => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBeginTurnPanel, {
                    gameConfig        : war.getGcData(),
                    playerIndex       : playerIndex,
                    teamIndex         : playerInTurn.getTeamIndex(),
                    nickname          : nickname,
                    coId              : playerInTurn.getCoId(),
                    unitAndTileSkinId : playerInTurn.getUnitAndTileSkinId(),
                    callbackOnFinish  : () => resolve(),
                });
            });
        }
    }

    if (action.getExtraData()) {
        await war.getTurnManager().endPhaseStandbyWithExtraData(action, false);
    } else {
        war.getTurnManager().endPhaseStandbyWithoutExtraData(false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemBeginTurn): Promise<WarOperations_Executors_Types.ExecutionResultForInnerWarOperation> {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const changedThings                        = await war.getTurnManager().endPhaseStandbyWithoutExtraData(true);

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : undefined,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoSystemBeginTurn().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemBeginTurn): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, Lang_Utils.getText(Lang_Constants.TextType.B0111), playerIndex);
        } else {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `P${war.getPlayerIndexInTurn()} ${await war.getPlayerInTurn().getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0094)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, Lang_Utils.getText(Lang_Constants.TextType.B0111), playerIndex);
        } else {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
