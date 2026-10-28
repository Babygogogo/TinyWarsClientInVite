import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    getUnitClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarBaseClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import { getExisted, createLazyFunc } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { create } from "../../../units/utils/Serialization.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

type IBwUnit                = IUnit;
let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitProduceUnit(war, action);
    } else {
        await normalExeUnitProduceUnit(war, action);
    }
}

function fastExeUnitProduceUnit(war: IBwWar, action: WoUnitProduceUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_00),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new (getUnitClass())();
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitType          = getExisted(focusUnit.getProduceUnitTypeId(), ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_01);
            const unitTemplateCfg   = getExisted(gameConfig.getUnitTemplateCfg(unitType));
            producedUnit.init(create({
                unitType                        : unitType,
                unitId                          : producedUnitId,
                playerIndex                     : playerIndex,
                gridIndex                       : gridIndex.toProto().toJson(),

                actionState                     : ActionStateId.Acted,
                currentHp                       : unitTemplateCfg.getMaxHp(),
                aiMode                          : null,
                groupedTagId                    : null,
                customNameId                    : null,

                currentPromotion                : getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                isDiving                        : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
                isCoOnboard                     : null,
                currentBuildMaterial            : unitTemplateCfg.getMaxBuildMaterial() ?? null,

                aiWeightedDestination           : null,
                forbiddenGroupedLocationIdArray : [],
                buffArray                       : [],

                primaryWeaponCurrentAmmo        : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
                flareCurrentAmmo                : unitTemplateCfg.getFlareMaxAmmo() ?? null,
                currentProduceMaterial          : unitTemplateCfg.getMaxProduceMaterial() ?? null,
                currentFuel                     : unitTemplateCfg.getMaxFuel(),
                loaderUnitId                    : focusUnit.getUnitId(),
            }), gameConfig);
            producedUnit.startRunning(war);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.addAndValidateCurrentProduceMaterial(-1);

            {
                const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : unitType,
                        dstPlayerIndex              : playerIndex,
                        normalizedHpGain            : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitProduceUnit(war: IBwWar, action: WoUnitProduceUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath       : movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
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
                    playShortSfx(ShortSfxCode.UnitProduction);
                }
            }
        }

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

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
            const producedUnit      = new (getUnitClass())();
            const unitType          = getExisted(focusUnit.getProduceUnitTypeId(), ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_01);
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitTemplateCfg   = getExisted(gameConfig.getUnitTemplateCfg(unitType));

            producedUnit.init(create({
                unitType                        : unitType,
                unitId                          : producedUnitId,
                playerIndex                     : playerIndex,
                gridIndex                       : gridIndex.toProto().toJson(),

                actionState                     : ActionStateId.Acted,
                currentHp                       : unitTemplateCfg.getMaxHp(),
                aiMode                          : null,
                groupedTagId                    : null,
                customNameId                    : null,

                currentPromotion                : getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                isDiving                        : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
                isCoOnboard                     : null,
                currentBuildMaterial            : unitTemplateCfg.getMaxBuildMaterial() ?? null,

                aiWeightedDestination           : null,
                forbiddenGroupedLocationIdArray : [],
                buffArray                       : [],

                primaryWeaponCurrentAmmo        : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
                flareCurrentAmmo                : unitTemplateCfg.getFlareMaxAmmo() ?? null,
                currentProduceMaterial          : unitTemplateCfg.getMaxProduceMaterial() ?? null,
                currentFuel                     : unitTemplateCfg.getMaxFuel(),
                loaderUnitId                    : focusUnit.getUnitId(),
            }), gameConfig);
            producedUnit.startRunning(war);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.addAndValidateCurrentProduceMaterial(-1);

            const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
            {
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : unitType,
                        dstPlayerIndex              : playerIndex,
                        normalizedHpGain            : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
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
                playShortSfx(ShortSfxCode.UnitProduction);
            }
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function getPromotionForUnitProduceUnit(war: IBwWar, producerUnit: IBwUnit, targetUnitType: number): number {
    const player                    = producerUnit.getPlayer();
    const coZoneRadius              = player.getCoZoneRadius();
    const gridIndex                 = producerUnit.getGridIndex();
    const gameConfig                = war.getGcData();
    const isCoOnboard               = producerUnit.getIsCoOnboard();
    const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
    let promotion                   = 0;
    for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfPromotionBonusByProduce();
        if ((cfg)                                                                           &&
            (gameConfig.checkIsUnitTypeInCategory(targetUnitType, cfg.getUnitCategoryId())) &&
            ((isCoOnboard) || (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType         : cfg.getCoSkillAreaTypeId(),
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
async function getDesc(war: IBwWar, action: WoUnitProduceUnit): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0106)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
