import {
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    DamageCalculators_Utils,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitAttackTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackTile(war, action);
    } else {
        await normalExeUnitAttackTile(war, action);
    }
}

function fastExeUnitAttackTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitAttackTile_00),
            isFastExecute   : true,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = DamageCalculators_Utils.runBattleForAttackTile({
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex())),
                maxAttackRange2       : null,
                canAttackAfterMoving2 : false,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            const unitMapView = unitMap.getView();
            for (const [, unit] of battleInfo.destroyedUnits) {
                unitMapView.removeUnit(unit.getView());
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
async function normalExeUnitAttackTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackTile): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackTile(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_00);
        const targetGridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : targetGridIndex,
            deleteViewAfterMoving : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        const path              = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const gridIndex2        = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_01);
            const allVisibleUnits   = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : gridIndex2,
                updateViewAfterMove : false,
            });

            const battleInfo = DamageCalculators_Utils.runBattleForAttackTile({
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : gridIndex2,
                maxAttackRange2       : null,
                canAttackAfterMoving2 : false,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            WarOperations_Executors_Utils_Common.handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackTile): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0097)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
