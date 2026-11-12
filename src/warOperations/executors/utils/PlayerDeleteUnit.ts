import {
    Destructions_Utils,
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
    type BaseWar_Model_War,
    WarOperations_Executors_Types,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoPlayerDeleteUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerDeleteUnit(war, action);
    } else {
        await normalExePlayerDeleteUnit(war, action);
    }
}

function fastExePlayerDeleteUnit(war: BaseWar_Model_War.War, action: WoPlayerDeleteUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerDeleteUnit_00),
            isFastExecute   : true,
        });
    } else {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit           : focusUnit,
                    unitVisionInfo : focusUnit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            Destructions_Utils.destroyUnitOnMap(war, gridIndex, false);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExePlayerDeleteUnit(war: BaseWar_Model_War.War, action: WoPlayerDeleteUnit): Promise<void> {
    // const desc = await war.getDescForExePlayerDeleteUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerDeleteUnit_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit           : focusUnit,
                    unitVisionInfo : focusUnit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            Destructions_Utils.destroyUnitOnMap(war, gridIndex, true);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerDeleteUnit): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const gridIndex                             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(operation.getGridIndex()));
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const focusUnit                             = Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex));
    if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
        war.getFogMap().updateMapFromPathsByUnitAndPath({
            unit           : focusUnit,
            unitVisionInfo : focusUnit.getVisionInfo(),
            path           : [gridIndex],
        });
    }

    const changedThings = Destructions_Utils.destroyUnitOnMap(war, gridIndex, false);
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
            woContainer.createIfNotExistsWoPlayerDeleteUnit().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerDeleteUnit): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0081)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
