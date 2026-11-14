import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    Helpers_Misc,
    Helpers_Team,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoUnitJoinUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitJoinUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitJoinUnit(war, action);
    } else {
        await normalExeUnitJoinUnit(war, action);
    }
}

function fastExeUnitJoinUnit(war: BaseWar_Model_War.War, action: WoUnitJoinUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitJoinUnit_00),
            isFastExecute   : true,
            isUnitJoinUnit  : true,
        });
    } else {
        const path              = Helpers_Misc.getExisted(action.getPath());
        const pathNodes         = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId      = action.getLaunchUnitId();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.getIsBlocked()) {
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const targetUnit    = Helpers_Misc.getExisted(unitMap.getUnitOnMap(endingGridIndex));
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.deleteUnitOnMap(endingGridIndex, true)?.dispose();
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            {
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : focusUnit.getUnitTypeId(),
                        dstPlayerIndex             : focusUnit.getPlayerIndex(),
                        unitGain                   : 0,
                        unitLoss                   : 1,
                        normalizedHpGain           : 0,
                        normalizedHpLoss           : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
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
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel(),
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

async function normalExeUnitJoinUnit(war: BaseWar_Model_War.War, action: WoUnitJoinUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitJoinUnit(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : null,
            callback          : undefined,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_01);
            if (unitMap.getUnitOnMap(gridIndex)) {
                unitMap.deleteUnitOnMap(gridIndex, true)?.dispose();
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
            isUnitJoinUnit  : true,
        });

    } else {
        const path              = Helpers_Misc.getExisted(action.getPath());
        const pathNodes         = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId      = action.getLaunchUnitId();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

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
                isBlocked           : path.getIsBlocked(),
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            const targetUnit    = Helpers_Misc.getExisted(unitMap.deleteUnitOnMap(endingGridIndex, false));
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            {
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                    war       : war,
                    gridIndex : endingGridIndex,
                });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : focusUnit.getUnitTypeId(),
                        dstPlayerIndex             : focusUnit.getPlayerIndex(),
                        unitGain                   : 0,
                        unitLoss                   : 1,
                        normalizedHpGain           : 0,
                        normalizedHpLoss           : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
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
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel(),
            ));

            {
                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        focusUnit.getCurrentBuildMaterial() + targetUnit.getCurrentBuildMaterial(),
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
                        focusUnit.getFlareCurrentAmmo() + targetUnit.getFlareCurrentAmmo(),
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
                isBlocked           : path.getIsBlocked(),
                aiming              : null,
                updateViewAfterMove : true,
            });

            {
                const view = targetUnit.getView();
                if (view) {
                    unitMap.getView()?.deleteUnitView(view);
                }
                targetUnit.dispose();
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitJoinUnit, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();

    if (revisedPath.getIsBlocked()) {
        const changedThings = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

        return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
            war                                  : war,
            allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
            visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
            visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
            changedThings                        : changedThings.mergeFrom(extraChangedThings),
            thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(unitGridIdsForEachTeamBeforeAction, focusUnitDataBeforeAction, revisedPath, undefined),
            createMessage                        : commonExtraData => {
                const woContainer = new WoContainer();
                woContainer.setOperationId(operationId);
                woContainer.createIfNotExistsWoUnitJoinUnit().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

                return woContainer;
            },
        });

    } else {
        const endingGridIndex = pathNodes[pathNodes.length - 1];
        const targetUnit      = Helpers_Misc.getExisted(unitMap.getUnitOnMap(endingGridIndex));
        const player          = focusUnit.getPlayer();
        unitMap.deleteUnitOnMap(endingGridIndex, true)?.dispose();

        const changedThings = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        changedThings.addUnit(targetUnit);

        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : endingGridIndex });
        if (observerTeamIndexes != null) {
            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                   : focusUnit.getUnitTypeId(),
                dstPlayerIndex             : focusUnit.getPlayerIndex(),
                unitGain                   : 0,
                unitLoss                   : 1,
                normalizedHpGain           : 0,
                normalizedHpLoss           : Math.max(0, targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp()),
                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
            }));
        }

        focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

        if (focusUnit.checkHasPrimaryWeapon()) {
            focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
        }

        const joinIncome = focusUnit.getJoinIncome(targetUnit);
        if (joinIncome !== 0) {
            player.setFund(player.getFund() + joinIncome);
            changedThings.addPlayer(player);
        }

        focusUnit.setCurrentHp(Math.min(focusUnit.getMaxHp(), (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * Units_Constants.Hp.Normalizer));

        focusUnit.setCurrentFuel(Math.min(focusUnit.getMaxFuel(), focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()));

        const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
        if (maxBuildMaterial != null) {
            focusUnit.setCurrentBuildMaterial(Math.min(maxBuildMaterial, focusUnit.getCurrentBuildMaterial() + targetUnit.getCurrentBuildMaterial()));
        }

        if (focusUnit.getMaxProduceMaterial() != null) {
            focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
        }

        focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

        const maxAmmo = focusUnit.getFlareMaxAmmo();
        if (maxAmmo != null) {
            focusUnit.setFlareCurrentAmmo(Math.min(maxAmmo, focusUnit.getFlareCurrentAmmo() + targetUnit.getFlareCurrentAmmo()));
        }

        focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());

        for (const buff of targetUnit.getBuffList()) {
            focusUnit.addBuff(buff.clone(), false, false);
        }

        changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

        return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
            war                                  : war,
            allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
            visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
            visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
            changedThings                        : changedThings.mergeFrom(extraChangedThings),
            thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(unitGridIdsForEachTeamBeforeAction, focusUnitDataBeforeAction, revisedPath, undefined),
            createMessage                        : commonExtraData => {
                const woContainer = new WoContainer();
                woContainer.setOperationId(operationId);
                woContainer.createIfNotExistsWoUnitJoinUnit().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

                return woContainer;
            },
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitJoinUnit): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0103)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
