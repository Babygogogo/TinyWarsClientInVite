import {
    FloatText,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemEndWar } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoSystemEndWar, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    const commonExtraData = action.getExtraData()?.getCommonExtraData();
    if (commonExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({ war : war, commonExtraData : commonExtraData, isFastExecute : isFast });
        war.updateTilesAndUnitsOnVisibilityChanged(isFast);
    }

    war.setIsEnded(true);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemEndWar): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    war.setIsEnded(true);

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : extraChangedThings,
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoSystemEndWar().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemEndWar, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    war.setIsEnded(true);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemEndWar): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)}`;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)}`;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
