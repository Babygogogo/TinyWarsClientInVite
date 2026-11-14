import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    Destructions_Utils,
    Helpers_Misc,
    Helpers_Team,
    Units_Constants,
    Units_Utils_Common,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type SinglePlayerWars_War,
    type BaseWar_Model_War,
    type Units_Unit,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSelfDetonate } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitSelfDetonate, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSelfDetonate(war, action);
    } else {
        await normalExeUnitSelfDetonate(war, action);
    }
}

function fastExeUnitSelfDetonate(war: BaseWar_Model_War.War, action: WoUnitSelfDetonate): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData()),
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
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isBlocked = path.getIsBlocked();
        if (isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = Helpers_Misc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Units_Constants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = Units_Utils_Common.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : targetUnit.getUnitTypeId(),
                                        dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                        normalizedHpGain           : 0,
                                        normalizedHpLoss           : unitLostNormalizedHp2,
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            Destructions_Utils.destroyUnitOnMap(war, destination, false);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSelfDetonate(war: BaseWar_Model_War.War, action: WoUnitSelfDetonate): Promise<void> {
    // const desc = await war.getDescForExeUnitSelfDetonate(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
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
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isBlocked = path.getIsBlocked();
        if (isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = Helpers_Misc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            const targetUnits           : Units_Unit.Unit[] = [];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    targetUnits.push(targetUnit);

                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Units_Constants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = Units_Utils_Common.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                                    war       : war,
                                    gridIndex : targetGridIndex,
                                });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : targetUnit.getUnitTypeId(),
                                        dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                        normalizedHpGain           : 0,
                                        normalizedHpLoss           : unitLostNormalizedHp2,
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

            Destructions_Utils.destroyUnitOnMap(war, destination, true);

            const gridVisionEffect = war.getGridVisualEffect();
            for (const unit of targetUnits) {
                unit.flushDataToView();
                gridVisionEffect?.showEffectDamage(unit.getGridIndex());
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitSelfDetonate, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                       = war.moveUnit({ pathNodes : pathNodes, launchUnitId : launchUnitId, fuelConsumption : revisedPath.getFuelConsumption() });
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

    if (!revisedPath.getIsBlocked()) {
        const cfg         = Helpers_Misc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
        const destination = pathNodes[pathNodes.length - 1];
        for (const targetGridIndex of destination.getGridsWithinDistance({ minDistance : 1, maxDistance : cfg.getRadius(), mapSize : unitMap.getMapSize() })) {
            const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
            if ((targetUnit != null) && (targetUnit !== focusUnit)) {
                const currentHp = targetUnit.getCurrentHp();
                const newHp     = Math.max(1, currentHp - cfg.getDamage() * Units_Constants.Hp.Normalizer);
                if (currentHp !== newHp) {
                    targetUnit.setCurrentHp(newHp);
                    changedThings.addUnit(targetUnit);

                    const lostHp = Units_Utils_Common.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                    if (lostHp !== 0) {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : targetGridIndex });
                        if (observerTeamIndexes != null) {
                            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : targetUnit.getUnitTypeId(),
                                dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                normalizedHpGain           : 0,
                                normalizedHpLoss           : lostHp,
                                unitGain                   : 0,
                                unitLoss                   : 0,
                                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }
            }
        }
        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, destination, false));
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
            woContainer.createIfNotExistsWoUnitSelfDetonate().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}
