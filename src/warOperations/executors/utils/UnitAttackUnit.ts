import {
    AuxiliaryTypes_GridIndex,
    DamageCalculators_Utils,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    Sounds_Constants,
    Sounds_SoundPlayer,
    TestWar_Model_TwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoUnitAttackUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitAttackUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackUnit(war, action);
    } else {
        await normalExeUnitAttackUnit(war, action);
    }
}

function fastExeUnitAttackUnit(war: BaseWar_Model_War.War, action: WoUnitAttackUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitAttackUnit_00),
            isFastExecute   : true,
        });

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.getIsBlocked()) {
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const gridIndex2            = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const unit2                 = Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex2));
            const maxAttackRange2       = unit2.getFinalMaxAttackRange() ?? null;
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = DamageCalculators_Utils.runBattleForAttackUnit({
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : gridIndex2,
                maxAttackRange2       : maxAttackRange2,
                canAttackAfterMoving2 : canAttackAfterMoving2,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            const unitMapView = unitMap.getView();
            for (const [, unit] of battleInfo.destroyedUnits) {
                const view = unit.getView();
                if (view) {
                    unitMapView?.deleteUnitView(view);
                }
                unit.dispose();
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitAttackUnit(war: BaseWar_Model_War.War, action: WoUnitAttackUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackUnit(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_00);
        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const movingUnitData    = movingUnitAndPath?.getUnit();
        const movingPath        = movingUnitAndPath?.getPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : targetGridIndex == null ? null : [targetGridIndex],
            callback          : undefined,
        });

        const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
        const isWarViewVibrated     = WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

        const movingUnitId  = movingUnitData ? movingUnitData.getUnitId() : null;
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        if ((movingUnitId != null)                                      &&
            ((destroyedUnitIdArray).indexOf(movingUnitId) >= 0)    &&
            (lastNode?.getIsVisible())
        ) {
            gridVisualEffect?.showEffectExplosion(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_01));
            if (!isWarViewVibrated) {
                war.getView()?.showVibration();
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
            }
        }

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.getIsBlocked()) {
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
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

            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
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
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : gridIndex2,
                maxAttackRange2       : maxAttackRange2,
                canAttackAfterMoving2 : canAttackAfterMoving2,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            WarOperations_Executors_Utils_Common.handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitAttackUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0097)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
