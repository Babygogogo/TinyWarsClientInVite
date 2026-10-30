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
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitAttackUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackUnit(war, action);
    } else {
        await normalExeUnitAttackUnit(war, action);
    }
}

function fastExeUnitAttackUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitAttackUnit_00),
            isFastExecute   : true,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const gridIndex2            = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const unit2                 = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex2));
            const maxAttackRange2       = unit2.getFinalMaxAttackRange() ?? null;
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = DamageCalculators_Utils.runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
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

async function normalExeUnitAttackUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackUnit(action);
    // (desc) && (FloatText.show(desc));

    const warView           = war.getView();
    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_00);
        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const movingUnitData    = movingUnitAndPath?.getUnit();
        const movingPath        = movingUnitAndPath?.getPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : targetGridIndex,
            deleteViewAfterMoving   : true,
        });

        const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
        const isWarViewVibrated     = WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

        const movingUnitId  = movingUnitData ? movingUnitData.getUnitId() : null;
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        if ((movingUnitId != null)                                      &&
            ((destroyedUnitIdArray).indexOf(movingUnitId) >= 0)    &&
            (lastNode?.getIsVisible())
        ) {
            gridVisualEffect.showEffectExplosion(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_01));
            if (!isWarViewVibrated) {
                warView.showVibration();
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
            }
        }

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
            const gridIndex2            = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_02);
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const unit2                 = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex2), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_03);
            const maxAttackRange2       = unit2.getFinalMaxAttackRange();
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const allVisibleUnits = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : allVisibleUnits.has(unit2) ? gridIndex2 : null,
                updateViewAfterMove : false,
            });

            const battleInfo = DamageCalculators_Utils.runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            WarOperations_Executors_Utils_Common.handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitAttackUnit): Promise<string | null> {

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
