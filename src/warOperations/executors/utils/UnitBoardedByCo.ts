import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
    type WarOperations_Executors_Types,
} from "../../../internal.ts";

import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBoardedByCo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitBoardedByCo, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBoardedByCo(war, action);
    } else {
        await normalExeUnitBoardedByCo(war, action);
    }
}

function fastExeUnitBoardedByCo(war: BaseWar_Model_War.War, action: WoUnitBoardedByCo): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBoardedByCo_00),
            isFastExecute   : true,
        });
    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);

        if (path.getIsBlocked()) {
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        } else {
            const playerIndex           = focusUnit.getPlayerIndex();
            const energyAddPctOnCoBoard = war.getCommonSettingManager().getPlayerRule(playerIndex).getEnergyAddPctOnCoBoard();
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setIsCoOnboard(true);

            const player        = war.getPlayer(playerIndex);
            const coMaxEnergy   = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getCoBoardCost());
            player.addAndValidateCoCurrentEnergy(coMaxEnergy * energyAddPctOnCoBoard / 100);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBoardedByCo(war: BaseWar_Model_War.War, action: WoUnitBoardedByCo): Promise<void> {
    // const desc = await war.getDescForExeUnitLoadCo(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBoardedByCo_00);
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
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);

        if (path.getIsBlocked()) {
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        } else {
            const playerIndex           = focusUnit.getPlayerIndex();
            const energyAddPctOnCoBoard = war.getCommonSettingManager().getPlayerRule(playerIndex).getEnergyAddPctOnCoBoard();
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setIsCoOnboard(true);

            const player        = war.getPlayer(playerIndex);
            const coMaxEnergy   = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getCoBoardCost());
            player.addAndValidateCoCurrentEnergy(coMaxEnergy * energyAddPctOnCoBoard / 100);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.getIsBlocked(),
            aiming              : null,
            updateViewAfterMove : true,
        });

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitBoardedByCo, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                               = war.getUnitMap();
    const pathNodes                             = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                          = revisedPath.getLaunchUnitId();
    const focusUnit                             = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction             = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction    = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                         = war.moveUnit({
        pathNodes       : pathNodes,
        launchUnitId    : launchUnitId,
        fuelConsumption : revisedPath.getFuelConsumption(),
    });
    unitMap.setUnitOnMap(focusUnit);

    if (revisedPath.getIsBlocked()) {
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
    } else {
        focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
        focusUnit.setIsCoOnboard(true);

        const player                = focusUnit.getPlayer();
        const energyAddPctOnCoBoard = war.getCommonSettingManager().getPlayerRule(player.getPlayerIndex()).getEnergyAddPctOnCoBoard();
        player.setFund(player.getFund() - focusUnit.getCoBoardCost());
        player.addAndValidateCoCurrentEnergy(player.getCoMaxEnergy() * energyAddPctOnCoBoard / 100);
        changedThings.addPlayer(player);
    }
    changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(
            unitGridIdsForEachTeamBeforeAction,
            focusUnitDataBeforeAction,
            revisedPath,
            undefined,
        ),
        createMessage : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoUnitBoardedByCo().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitBoardedByCo): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0139)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
