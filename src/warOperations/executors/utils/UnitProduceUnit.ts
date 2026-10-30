import {
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    Units_Unit,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Units_Utils_Serialization,
    Helpers_Misc,
    Helpers_Team,
    Visibilities_Utils,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    type Units_IUnit,
} from "../../../internal.ts";

import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitProduceUnit(war, action);
    } else {
        await normalExeUnitProduceUnit(war, action);
    }
}

function fastExeUnitProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitProduceUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new Units_Unit.Unit();
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
                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
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

async function normalExeUnitProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitProduceUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath     : movingUnitAndPath,
            aiming                : null,
            deleteViewAfterMoving : true,
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
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new Units_Unit.Unit();
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

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.addAndValidateCurrentProduceMaterial(-1);

            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
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
                isBlocked           : path.isBlocked,
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

function getPromotionForUnitProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, producerUnit: Units_IUnit.IUnit, targetUnitType: number): number {
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
                coSkillAreaType : cfg.getCoSkillAreaTypeId(),
                getCoGridIndexArrayOnMap,
                coZoneRadius,
            })))
        ) {
            promotion += cfg.getBonus();
        }
    }

    return promotion;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitProduceUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0106)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
