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
    Sounds_Constants,
    Sounds_SoundPlayer,
    TestWar_Model_TwWar,
    Units_Constants,
    Units_Unit,
    Units_Utils_Serialization,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitProduceUnit(war, action);
    } else {
        await normalExeUnitProduceUnit(war, action);
    }
}

function fastExeUnitProduceUnit(war: BaseWar_Model_War.War, action: WoUnitProduceUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_00),
            isFastExecute   : true,
        });
    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.getIsBlocked()) {
            // nothing to do.
        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new Units_Unit.Unit(true);
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitType          = Helpers_Misc.getExisted(focusUnit.getProduceUnitTypeId(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_01);
            const unitTemplateCfg   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
            producedUnit.init(Units_Utils_Serialization.create({
                unitType    : unitType,
                unitId      : producedUnitId,
                playerIndex : playerIndex,
                gridIndex   : gridIndex.toProto().toJson(),

                actionState  : Units_Constants.ActionStateId.Acted,
                currentHp    : unitTemplateCfg.getMaxHp(),
                aiMode       : null,
                groupedTagId : null,
                customNameId : null,

                currentPromotion     : getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                isDiving             : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
                isCoOnboard          : null,
                currentBuildMaterial : unitTemplateCfg.getMaxBuildMaterial() ?? null,

                aiWeightedDestination           : null,
                forbiddenGroupedLocationIdArray : [],
                buffArray                       : [],

                primaryWeaponCurrentAmmo : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
                flareCurrentAmmo         : unitTemplateCfg.getFlareMaxAmmo() ?? null,
                currentProduceMaterial   : unitTemplateCfg.getMaxProduceMaterial() ?? null,
                currentFuel              : unitTemplateCfg.getMaxFuel(),
                loaderUnitId             : focusUnit.getUnitId(),
            }), gameConfig);
            producedUnit.startRunning(war);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.addAndValidateCurrentProduceMaterial(-1);

            {
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : unitType,
                        dstPlayerIndex             : playerIndex,
                        normalizedHpGain           : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss           : 0,
                        unitGain                   : 1,
                        unitLoss                   : 0,
                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitProduceUnit(war: BaseWar_Model_War.War, action: WoUnitProduceUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

        if (movingUnitAndPath) {
            const path = movingUnitAndPath.getPath();
            if (path) {
                const length    = path.length;
                const node      = length ? path[length - 1] : null;
                if ((node?.getIsVisible()) && (!node.getIsBlocked())) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.UnitProduction);
                }
            }
        }

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.getIsBlocked()) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.getIsBlocked(),
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new Units_Unit.Unit(true);
            const unitType          = Helpers_Misc.getExisted(focusUnit.getProduceUnitTypeId(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_01);
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitTemplateCfg   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType));

            producedUnit.init(Units_Utils_Serialization.create({
                unitType    : unitType,
                unitId      : producedUnitId,
                playerIndex : playerIndex,
                gridIndex   : gridIndex.toProto().toJson(),

                actionState  : Units_Constants.ActionStateId.Acted,
                currentHp    : unitTemplateCfg.getMaxHp(),
                aiMode       : null,
                groupedTagId : null,
                customNameId : null,

                currentPromotion     : getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                isDiving             : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
                isCoOnboard          : null,
                currentBuildMaterial : unitTemplateCfg.getMaxBuildMaterial() ?? null,

                aiWeightedDestination           : null,
                forbiddenGroupedLocationIdArray : [],
                buffArray                       : [],

                primaryWeaponCurrentAmmo : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
                flareCurrentAmmo         : unitTemplateCfg.getFlareMaxAmmo() ?? null,
                currentProduceMaterial   : unitTemplateCfg.getMaxProduceMaterial() ?? null,
                currentFuel              : unitTemplateCfg.getMaxFuel(),
                loaderUnitId             : focusUnit.getUnitId(),
            }), gameConfig);
            producedUnit.startRunning(war);
            producedUnit.flushDataToView();

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.addAndValidateCurrentProduceMaterial(-1);

            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
            {
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : unitType,
                        dstPlayerIndex             : playerIndex,
                        normalizedHpGain           : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss           : 0,
                        unitGain                   : 1,
                        unitLoss                   : 0,
                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.getIsBlocked(),
                aiming              : null,
                updateViewAfterMove : true,
            });

            if ((observerTeamIndexes?.length) &&
                (war.getPlayerManager().getAllPlayers(false).some(v => (v.getUserId() != null) && (observerTeamIndexes.indexOf(v.getTeamIndex()) >= 0)))
            ) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.UnitProduction);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function getPromotionForUnitProduceUnit(war: BaseWar_Model_War.War, producerUnit: Units_Unit.Unit, targetUnitType: number): number {
    const player                    = producerUnit.getPlayer();
    const coZoneRadius              = player.getCoZoneRadius();
    const gridIndex                 = producerUnit.getGridIndex();
    const gameConfig                = war.getGcData();
    const isCoOnboard               = producerUnit.getIsCoOnboard();
    const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
    let promotion                   = 0;
    for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfPromotionBonusByProduce();
        if ((cfg)                                                                           &&
            (gameConfig.checkIsUnitTypeInCategory(targetUnitType, cfg.getUnitCategoryId())) &&
            ((isCoOnboard) || (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                coZoneRadius             : coZoneRadius,
            })))
        ) {
            promotion += cfg.getBonus();
        }
    }

    return promotion;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitProduceUnit, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const playerInTurn                         = war.getPlayerInTurn();
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const cost                                 = focusUnit.getProduceUnitCost();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                        = war.moveUnit({ pathNodes : pathNodes, launchUnitId : launchUnitId, fuelConsumption : revisedPath.getFuelConsumption() });
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

    if (!revisedPath.getIsBlocked()) {
        const producedUnitId  = unitMap.getNextUnitId();
        const unitType        = Helpers_Misc.getExisted(focusUnit.getProduceUnitTypeId());
        const playerIndex     = focusUnit.getPlayerIndex();
        const gridIndex       = focusUnit.getGridIndex();
        const gameConfig      = war.getGcData();
        const unitTemplateCfg = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
        const producedUnit    = new Units_Unit.Unit(false);
        producedUnit.init(Units_Utils_Serialization.create({
            unitType                        : unitType,
            unitId                          : producedUnitId,
            playerIndex                     : playerIndex,
            gridIndex                       : gridIndex.toProto().toJson(),
            actionState                     : Units_Constants.ActionStateId.Acted,
            currentHp                       : unitTemplateCfg.getMaxHp(),
            aiMode                          : 0,
            groupedTagId                    : 0,
            customNameId                    : null,
            currentPromotion                : getPromotionForUnitProduceUnit(war, focusUnit, unitType),
            isDiving                        : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? false,
            isCoOnboard                     : false,
            currentBuildMaterial            : unitTemplateCfg.getMaxBuildMaterial() ?? 0,
            aiWeightedDestination           : null,
            forbiddenGroupedLocationIdArray : [],
            buffArray                       : [],
            primaryWeaponCurrentAmmo        : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? 0,
            flareCurrentAmmo                : unitTemplateCfg.getFlareMaxAmmo() ?? 0,
            currentProduceMaterial          : unitTemplateCfg.getMaxProduceMaterial() ?? 0,
            currentFuel                     : unitTemplateCfg.getMaxFuel(),
            loaderUnitId                    : focusUnit.getUnitId(),
        }), gameConfig);
        producedUnit.startRunning(war);
        changedThings.addUnit(producedUnit);

        playerInTurn.setFund(playerInTurn.getFund() - cost);
        unitMap.setNextUnitId(producedUnitId + 1);
        unitMap.setUnitLoaded(producedUnit);
        focusUnit.addAndValidateCurrentProduceMaterial(-1);
        changedThings.addPlayer(playerInTurn);

        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
        if (observerTeamIndexes != null) {
            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                   : unitType,
                dstPlayerIndex             : playerIndex,
                normalizedHpGain           : producedUnit.getNormalizedCurrentHp(),
                normalizedHpLoss           : 0,
                unitGain                   : 1,
                unitLoss                   : 0,
                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
            }));
        }
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
            woContainer.createIfNotExistsWoUnitProduceUnit().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitProduceUnit): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0106)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
