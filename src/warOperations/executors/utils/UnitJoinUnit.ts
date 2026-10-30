import {
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Helpers_Team,
    Helpers_Misc,
    Visibilities_Utils,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitJoinUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitJoinUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitJoinUnit(war, action);
    } else {
        await normalExeUnitJoinUnit(war, action);
    }
}

function fastExeUnitJoinUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitJoinUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitJoinUnit_00),
            isFastExecute   : true,
            isUnitJoinUnit  : true,
        });
    } else {
        const path              = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const targetUnit    = Helpers_Misc.getExisted(unitMap.getUnitOnMap(endingGridIndex));
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, true)?.stopRunning();
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            {
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * Units_Constants.Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
            if (maxBuildMaterial != null) {
                focusUnit.setCurrentBuildMaterial(Math.min(
                    maxBuildMaterial,
                    focusUnit.getCurrentBuildMaterial() + targetUnit.getCurrentBuildMaterial(),
                ));
            }

            const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
            if (maxProduceMaterial != null) {
                focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
            }

            focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

            // flare ammo
            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        focusUnit.getFlareCurrentAmmo() + targetUnit.getFlareCurrentAmmo(),
                    ));
                }
            }

            focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitJoinUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitJoinUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitJoinUnit(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_01);
            if (unitMap.getUnitOnMap(gridIndex)) {
                unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
            isUnitJoinUnit      : true,
        });

    } else {
        const path              = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            const targetUnit    = Helpers_Misc.getExisted(unitMap.removeUnitOnMap(endingGridIndex, false));
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            {
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * Units_Constants.Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            {
                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        focusUnit.getCurrentBuildMaterial() + targetUnit.getCurrentBuildMaterial()
                    ));
                }
            }

            {
                const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
                if (maxProduceMaterial != null) {
                    focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
                }
            }

            {
                focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));
            }

            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        focusUnit.getFlareCurrentAmmo() + targetUnit.getFlareCurrentAmmo()
                    ));
                }
            }

            {
                focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
            }

            {
                for (const buff of targetUnit.getBuffList()) {
                    focusUnit.addBuff(buff.clone(), false, true);
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });
            unitMap.getView().removeUnit(targetUnit.getView());
            targetUnit.stopRunning();
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitJoinUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0103)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
