import {
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Turns_Phases_Handler,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoPlayerEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoPlayerEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerEndTurn(war, action);
    } else {
        await normalExePlayerEndTurn(war, action);
    }
}

function fastExePlayerEndTurn(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    const turnManager = war.getTurnManager();
    if (action.getExtraData()) {
        Turns_Phases_Handler.endPhaseMainAsOuterWar(turnManager, action, true);
    } else {
        Turns_Phases_Handler.endPhaseMainAsInnerWar(turnManager);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExePlayerEndTurn(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    const turnManager = war.getTurnManager();
    if (action.getExtraData()) {
        Turns_Phases_Handler.endPhaseMainAsOuterWar(turnManager, action, false);
    } else {
        Turns_Phases_Handler.endPhaseMainAsInnerWar(turnManager);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerEndTurn): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const changedThings                        = Turns_Phases_Handler.endPhaseMainAsInnerWar(war.getTurnManager());

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
            woContainer.createIfNotExistsWoPlayerEndTurn().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExecuteAsUnifiedWar(war, action);
    } else {
        await normalExecuteAsUnifiedWar(war, action);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fastExecuteAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    const turnManager = war.getTurnManager();
    Turns_Phases_Handler.endPhaseMainAsUnifiedWar(turnManager, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function normalExecuteAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    const turnManager = war.getTurnManager();
    Turns_Phases_Handler.endPhaseMainAsUnifiedWar(turnManager, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn())} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
