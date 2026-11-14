import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Lang_Utils,
    Lang_Constants,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoSystemEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndTurn(war, action);
    } else {
        await normalExeSystemEndTurn(war, action);
    }
}

function fastExeSystemEndTurn(war: BaseWar_Model_War.War, action: WoSystemEndTurn): void {
    if (action.getExtraData()) {
        war.getTurnManager().endPhaseMainAsOuterWar(action, true);
    } else {
        war.getTurnManager().endPhaseMainAsInnerWar(true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExeSystemEndTurn(war: BaseWar_Model_War.War, action: WoSystemEndTurn): void {
    if (action.getExtraData()) {
        war.getTurnManager().endPhaseMainAsOuterWar(action, false);
    } else {
        war.getTurnManager().endPhaseMainAsInnerWar(false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemEndTurn): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const changedThings                        = war.getTurnManager().endPhaseMainAsInnerWar(true);

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
            woContainer.createIfNotExistsWoSystemEndTurn().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemEndTurn): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
