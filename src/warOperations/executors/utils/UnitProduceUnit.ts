import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitProduceUnit      = ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit.WoUnitProduceUnit;
type IBwUnit                = UnitsIUnit.IUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new (GameHelpersGhFactory.getUnitClass())();
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitType          = HelpersMisc.getExisted(focusUnit.getProduceUnitTypeId(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitProduceUnit_01);
            const unitTemplateCfg   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
            producedUnit.init(UnitsUtilsSerialization.create({
                unitType                        : unitType,
                unitId                          : producedUnitId,
                playerIndex                     : playerIndex,
                gridIndex                       : gridIndex.toProto().toJson(),

                actionState                     : UnitsConstants.ActionStateId.Acted,
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
                const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : unitType,
                        dstPlayerIndex              : playerIndex,
                        normalizedHpGain            : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitProduceUnit(war: IBwWar, action: WoUnitProduceUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath       : movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
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
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.UnitProduction);
                }
            }
        }

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

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
            const producedUnit      = new (GameHelpersGhFactory.getUnitClass())();
            const unitType          = HelpersMisc.getExisted(focusUnit.getProduceUnitTypeId(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitProduceUnit_01);
            const playerIndex       = focusUnit.getPlayerIndex();
            const gameConfig        = war.getGcData();
            const unitTemplateCfg   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType));

            producedUnit.init(UnitsUtilsSerialization.create({
                unitType                        : unitType,
                unitId                          : producedUnitId,
                playerIndex                     : playerIndex,
                gridIndex                       : gridIndex.toProto().toJson(),

                actionState                     : UnitsConstants.ActionStateId.Acted,
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

            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
            {
                if (observerTeamIndexes != null) {
                    war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : unitType,
                        dstPlayerIndex              : playerIndex,
                        normalizedHpGain            : producedUnit.getNormalizedCurrentHp(),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
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
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.UnitProduction);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function getPromotionForUnitProduceUnit(war: IBwWar, producerUnit: IBwUnit, targetUnitType: number): number {
    const player                    = producerUnit.getPlayer();
    const coZoneRadius              = player.getCoZoneRadius();
    const gridIndex                 = producerUnit.getGridIndex();
    const gameConfig                = war.getGcData();
    const isCoOnboard               = producerUnit.getIsCoOnboard();
    const getCoGridIndexArrayOnMap  = HelpersMisc.createLazyFunc(() => player.getCoGridIndexListOnMap());
    let promotion                   = 0;
    for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfPromotionBonusByProduce();
        if ((cfg)                                                                           &&
            (gameConfig.checkIsUnitTypeInCategory(targetUnitType, cfg.getUnitCategoryId() ?? 0)) &&
            ((isCoOnboard) || (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                getCoGridIndexArrayOnMap,
                coZoneRadius,
            })))
        ) {
            promotion += cfg.getBonus() ?? 0;
        }
    }

    return promotion;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitProduceUnit): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0106)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
