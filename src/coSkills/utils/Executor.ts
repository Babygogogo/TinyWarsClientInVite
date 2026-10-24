import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as CoSkillsConstants from "../Constants.ts";
import * as DestructionsUtils from "../../destructions/Utils.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersTeam from "../../helpers/Team.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfg from "../../proto/schema/CommonProto/Config/CoSkillCfg.ts";
import type * as ProtoSchemaCommonProtoStructureDataForUseCoSkill from "../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndex from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as UnitBuffsUtilsCommon from "../../unitBuffs/utils/Common.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type CoSkillCfg                     = ProtoSchemaCommonProtoConfigCoSkillCfg.CoSkillCfg;
type IBwPlayer                      = PlayersIPlayer.IPlayer;

export function executeInstantSkill({ player, skillId, skillData, targetGridIndexes, hasExtraData, isFastExecute }: {
    player              : IBwPlayer;
    skillId             : number;
    skillData           : ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureGridIndex.GridIndex[]>;
    hasExtraData        : boolean;
    isFastExecute       : boolean;
}): void {
    const war               = player.getWar();
    const skillCfg          = HelpersMisc.getExisted(war.getGcData().getCoSkillCfg(skillId));
    const coGridIndexList   = player.getCoGridIndexListOnMap();

    if (hasExtraData) {
        exeSelfFundWithExtraData({ isFastExecute });
        exeEnemyEnergyWithExtraData({ isFastExecute });
        exeSelfAddUnitWithExtraData({ isFastExecute });
        exeSelfHpGainWithExtraData({ isFastExecute });
        exeEnemyHpGainWithExtraData({ isFastExecute });
        exeSelfFuelGainWithExtraData({ isFastExecute });
        exeEnemyFuelGainWithExtraData({ isFastExecute });
        exeSelfMaterialGainWithExtraData({ isFastExecute });
        exeEnemyMaterialGainWithExtraData({ isFastExecute });
        exeSelfPrimaryAmmoGainWithExtraData({ isFastExecute });
        exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute });
        exeSelfUnitBuffGainWithExtraData({ isFastExecute });
        exeEnemyUnitBuffGainWithExtraData({ isFastExecute });
        exeFixedAreaDamageWithExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute });
        exeSelfPromotionGainWithExtraData({ isFastExecute });
        exeSelfUnitActionStateWithExtraData({ isFastExecute });
        exeSelfFlareAmmoGainWithExtraData({ isFastExecute });
        exeChangeWeatherWithExtraData({ skillCfg, player, skillData, isFastExecute });
        exeSelfCoOnboardWithExtraData({ isFastExecute });
    } else {
        exeSelfFundWithoutExtraData({ skillCfg, player, isFastExecute });
        exeEnemyEnergyWithoutExtraData({ skillCfg, player, isFastExecute });
        exeSelfAddUnitWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeEnemyHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfFuelGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeEnemyFuelGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfMaterialGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeEnemyMaterialGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfPrimaryAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeEnemyPrimaryAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeEnemyUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeFixedAreaDamageWithoutExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute });
        exeSelfPromotionGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfUnitActionStateWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeSelfFlareAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
        exeChangeWeatherWithoutExtraData({ skillCfg, player, skillData, isFastExecute });
        exeSelfCoOnboardWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfFundWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfFundWithoutExtraData({ skillCfg, player, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfFund();
    if (cfg == null) {
        return;
    }

    const offsetByIncome = (cfg.getIncomeConversionPct() ?? 0) == 0
        ? 0
        : player.getWar().getTileMap().getTotalIncomeForPlayer(player.getPlayerIndex()) * (cfg.getIncomeConversionPct() ?? 0) / 100;

    player.setFund(PlayersUtilsCommon.getValidFund(
        player.getFund() * (cfg.getMultiplierPct() ?? 0) / 100 + (cfg.getOffset() ?? 0) + offsetByIncome)
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyEnergyWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyEnergyWithoutExtraData({ skillCfg, player, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyEnergy();
    if (cfg == null) {
        return;
    }

    const selfFund      = player.getFund();
    const selfTeamIndex = player.getTeamIndex();
    const modifier      = (cfg.getFuncConversionPct() ?? 0) * selfFund / 10000 + (cfg.getOffsetPct() ?? 0);
    for (const p of player.getWar().getPlayerManager().getAllPlayers()) {
        const teamIndex = p.getTeamIndex();
        if ((teamIndex === selfTeamIndex) || (teamIndex === TeamsConstants.TeamIndex.Neutral)) {
            continue;
        }

        p.addAndValidateCoCurrentEnergy(p.getCoCurrentEnergy() * modifier / 100);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfAddUnitWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfAddUnitWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfAddUnit();
    if (cfg == null) {
        return;
    }

    const selfPlayerIndex = player.getPlayerIndex();
    if ((selfPlayerIndex == null) || (selfPlayerIndex === PlayersConstants.PlayerIndex.Neutral)) {
        throw HelpersMisc.newError(`Invalid selfPlayerIndex: ${selfPlayerIndex}.`, UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeSelfAddUnit_00);
    }

    const war                   = player.getWar();
    const coZoneRadius          = player.getCoZoneRadius();
    const unitMap               = war.getUnitMap();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const gameConfig            = war.getGcData();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (tile.getPlayerIndex() !== selfPlayerIndex) {
            continue;
        }

        const gridIndex = tile.getGridIndex();
        if (unitMap.getUnitOnMap(gridIndex)) {
            continue;
        }

        const tileType = tile.getTileTypeId();
        if ((!gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId() ?? 0))   ||
            (!gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                getCoGridIndexArrayOnMap: () => coGridIndexList,
                coZoneRadius,
            }))
        ) {
            continue;
        }

        // cfg:（范围类别，地形类别，部队种类，hp，状态（0=未行动，1=已行动））
        const unitId            = unitMap.getNextUnitId();
        const unitTypeId        = cfg.getUnitTypeId();
        const unitTemplateCfg   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitTypeId));
        const unit              = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(UnitsUtilsSerialization.create({
            unitType                        : unitTypeId,
            unitId                          : unitId,
            playerIndex                     : selfPlayerIndex,
            gridIndex                       : gridIndex.toProto().toJson(),

            actionState                     : cfg.getUnitActionStateId(),
            currentHp                       : cfg.getHp(),
            aiMode                          : null,
            groupedTagId                    : null,
            customNameId                    : null,

            currentPromotion                : null,
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
            loaderUnitId                    : null,
        }), gameConfig);

        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setNextUnitId(unitId + 1);
        unitMap.setUnitOnMap(unit);

        {
            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unitTypeId,
                    dstPlayerIndex              : selfPlayerIndex,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfHpGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfUnitHp();
    if (cfg) {
        const war                   = player.getWar();
        const playerIndex           = player.getPlayerIndex();
        const zoneRadius            = player.getCoZoneRadius();
        const unitCategoryId        = cfg.getUnitCategoryId();
        const regularHpOffset       = cfg.getRegularHpOffset() ?? 0;
        const unitLoadedStateId     = cfg.getUnitLoadedStateId() ?? 0;
        const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId() ?? 0;
        const costMultiplier        = (cfg.getCostMultiplierPct() ?? 0) / 100 / 10;
        const gameConfig            = war.getGcData();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const hpOffset              = regularHpOffset * UnitsConstants.Hp.Normalizer;
        let totalCost               = 0;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            const maxHp     = unit.getMaxHp();
            const currentHp = unit.getCurrentHp();
            if ((unit.getPlayerIndex() === playerIndex)                                                         &&
                (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                &&
                ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategoryId)))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : coSkillAreaTypeId,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                const oldNormalizedHp = unit.getNormalizedCurrentHp();
                if (regularHpOffset >= 0) {
                    unit.setCurrentHp(NumbersUtils.getValueInRange({
                        minValue    : 1,
                        maxValue    : maxHp,
                        rawValue    : (unit.getNormalizedCurrentHp() + regularHpOffset) * UnitsConstants.Hp.Normalizer
                    }));
                } else {
                    unit.setCurrentHp(NumbersUtils.getValueInRange({
                        rawValue    : currentHp + hpOffset,
                        minValue    : 1,
                        maxValue    : maxHp,
                    }));
                }

                {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        if (costMultiplier !== 0) {
                            totalCost += unit.getProductionFinalCost(costMultiplier * offsetNormalizedHp);
                        }

                        const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                unitType                    : unitType,
                                dstPlayerIndex              : playerIndex,
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }

                (!isFastExecute) && (unit.updateView());
            }
        }

        if (totalCost !== 0) {
            player.setFund(PlayersUtilsCommon.getValidFund(player.getFund() - totalCost));
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyHpGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeEnemyHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyUnitHp();
    if (cfg) {
        const teamIndex             = player.getTeamIndex();
        const zoneRadius            = player.getCoZoneRadius();
        const war                   = player.getWar();
        const tileMap               = war.getTileMap();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const unitCategory          = cfg.getUnitCategoryId() ?? 0;
        const tileCategory          = cfg.getTileCategoryId() ?? 0;
        const deltaHp               = cfg.getHpGain() ?? 0;
        const loadedState           = cfg.getUnitLoadedStateId() ?? 0;
        const gameConfig            = war.getGcData();
        const modifier              = deltaHp * UnitsConstants.Hp.Normalizer;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            const maxHp     = unit.getMaxHp();
            const currentHp = unit.getCurrentHp();
            const tileType  = tileMap.getTile(gridIndex)?.getTileTypeId();
            if ((unit.getTeamIndex() !== teamIndex)                             &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory))  &&
                (gameConfig.checkIsTileTypeInCategory(tileType, tileCategory))  &&
                (unit.checkIsMeetLoadedState(loadedState))                      &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                const oldNormalizedHp = unit.getNormalizedCurrentHp();
                if (deltaHp > 0) {
                    unit.setCurrentHp(Math.min(
                        maxHp,
                        (unit.getNormalizedCurrentHp() + deltaHp) * UnitsConstants.Hp.Normalizer)
                    );
                } else {
                    unit.setCurrentHp(Math.max(
                        1,
                        currentHp + modifier
                    ));
                }

                {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                unitType                    : unitType,
                                dstPlayerIndex              : unit.getPlayerIndex(),
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }

                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfFuelGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfFuelGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfFuelGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                const maxFuel       = unit.getMaxFuel();
                const currentFuel   = unit.getCurrentFuel();
                if (modifier > 0) {
                    unit.setCurrentFuel(Math.min(
                        maxFuel,
                        currentFuel + Math.floor(maxFuel * modifier / 100)
                    ));
                } else {
                    unit.setCurrentFuel(Math.max(
                        0,
                        Math.floor(currentFuel * (100 + modifier) / 100)
                    ));
                }
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyFuelGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeEnemyFuelGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyFuelGain();
    if (cfg == null) {
        return;
    }

    const teamIndex     = player.getTeamIndex();
    const zoneRadius    = player.getCoZoneRadius();
    const war           = player.getWar();
    const category      = cfg.getUnitCategoryId() ?? 0;
    const modifier      = cfg.getGainPct() ?? 0;
    const loadedState   = cfg.getUnitLoadedStateId() ?? 0;
    const gameConfig    = war.getGcData();
    for (const unit of war.getUnitMap().getAllUnits()) {
        const unitType  = unit.getUnitType();
        const gridIndex = unit.getGridIndex();
        if ((unit.getTeamIndex() !== teamIndex)                         &&
            (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
            (unit.checkIsMeetLoadedState(loadedState))                  &&
            (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                getCoGridIndexArrayOnMap: () => coGridIndexList,
                coZoneRadius            : zoneRadius
            }))
        ) {
            const maxFuel       = unit.getMaxFuel();
            const currentFuel   = unit.getCurrentFuel();
            if (modifier > 0) {
                unit.setCurrentFuel(Math.min(
                    maxFuel,
                    currentFuel + Math.floor(maxFuel * modifier / 100)
                ));
            } else {
                unit.setCurrentFuel(Math.max(
                    0,
                    Math.floor(currentFuel * (100 + modifier) / 100)
                ));
            }
            (!isFastExecute) && (unit.updateView());
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfMaterialGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfMaterialGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfMaterialGain();
    if (cfg) {
        const war           = player.getWar();
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxBuildMaterial      = unit.getMaxBuildMaterial();
            const maxProduceMaterial    = unit.getMaxProduceMaterial();
            if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                continue;
            }

            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                if (maxBuildMaterial != null) {
                    const currentBuildMaterial = HelpersMisc.getExisted(unit.getCurrentBuildMaterial());
                    if (modifier > 0) {
                        unit.setCurrentBuildMaterial(Math.min(
                            maxBuildMaterial,
                            currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentBuildMaterial(Math.max(
                            0,
                            Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }

                if (maxProduceMaterial != null) {
                    const currentProduceMaterial = HelpersMisc.getExisted(unit.getCurrentProduceMaterial());
                    if (modifier > 0) {
                        unit.addAndValidateCurrentProduceMaterial(maxProduceMaterial * modifier / 100);
                    } else {
                        unit.addAndValidateCurrentProduceMaterial(currentProduceMaterial * modifier / 100);
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyMaterialGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeEnemyMaterialGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyMaterialGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxBuildMaterial      = unit.getMaxBuildMaterial();
            const maxProduceMaterial    = unit.getMaxProduceMaterial();
            if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                continue;
            }

            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() !== playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                if (maxBuildMaterial != null) {
                    const currentBuildMaterial = HelpersMisc.getExisted(unit.getCurrentBuildMaterial());
                    if (modifier > 0) {
                        unit.setCurrentBuildMaterial(Math.min(
                            maxBuildMaterial,
                            currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentBuildMaterial(Math.max(
                            0,
                            Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }

                if (maxProduceMaterial != null) {
                    const currentProduceMaterial = HelpersMisc.getExisted(unit.getCurrentProduceMaterial());
                    if (modifier > 0) {
                        unit.addAndValidateCurrentProduceMaterial(maxProduceMaterial * modifier / 100);
                    } else {
                        unit.addAndValidateCurrentProduceMaterial(currentProduceMaterial * modifier / 100);
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfPrimaryAmmoGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfPrimaryAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfPrimaryAmmoGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            const unitType      = unit.getUnitType();
            const gridIndex     = unit.getGridIndex();
            const currentAmmo   = HelpersMisc.getExisted(unit.getPrimaryWeaponCurrentAmmo());
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                if (modifier > 0) {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * modifier / 100);
                } else {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * modifier / 100);
                }
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeEnemyPrimaryAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyPrimaryAmmoGain();
    if (cfg) {
        const war           = player.getWar();
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            const unitType      = unit.getUnitType();
            const gridIndex     = unit.getGridIndex();
            const currentAmmo   = HelpersMisc.getExisted(unit.getPrimaryWeaponCurrentAmmo());
            if ((unit.getPlayerIndex() !== playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                if (modifier > 0) {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * modifier / 100);
                } else {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * modifier / 100);
                }
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfUnitBuffGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfUnitBuffGain();
    if (cfg == null) {
        return;
    }

    const war                   = player.getWar();
    const playerIndex           = player.getPlayerIndex();
    const zoneRadius            = player.getCoZoneRadius();
    const turnIndex             = war.getTurnManager().getTurnIndex();
    const gameConfig            = war.getGcData();
    const unitCategoryId        = cfg.getUnitCategoryId();
    const unitBuffTypeId        = cfg.getUnitBuffTypeId() ?? 0;
    const unitLoadedStateId     = cfg.getUnitLoadedStateId() ?? 0;
    const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId() ?? 0;
    const turns                 = cfg.getTurns() ?? 0;
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getPlayerIndex() === playerIndex)                                                                     &&
            (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                            &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitType(), unitCategoryId)))    &&
            (unit.getGridIndex().checkIsInsideCoSkillArea({
                coSkillAreaType         : coSkillAreaTypeId,
                getCoGridIndexArrayOnMap: () => coGridIndexList,
                coZoneRadius            : zoneRadius,
            }))
        ) {
            if (turns > 0) {
                unit.addBuff(UnitBuffsUtilsCommon.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : turnIndex + turns,
                    expiringPlayerIndex : playerIndex,
                    extraParams         : null,
                }), false, true);
            } else {
                unit.addBuff(UnitBuffsUtilsCommon.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : null,
                    expiringPlayerIndex : null,
                    extraParams         : null,
                }), false, true);
            }

            (!isFastExecute) && (unit.updateView());
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeEnemyUnitBuffGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeEnemyUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getEnemyUnitBuffGain();
    if (cfg == null) {
        return;
    }

    const war                   = player.getWar();
    const playerIndexInTurn     = player.getPlayerIndex();
    const teamIndex             = player.getTeamIndex();
    const zoneRadius            = player.getCoZoneRadius();
    const turnIndex             = war.getTurnManager().getTurnIndex();
    const gameConfig            = war.getGcData();
    const unitCategoryId        = cfg.getUnitCategoryId();
    const unitBuffTypeId        = cfg.getUnitBuffTypeId() ?? 0;
    const unitLoadedStateId     = cfg.getUnitLoadedStateId() ?? 0;
    const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId() ?? 0;
    const turns                 = cfg.getTurns() ?? 0;
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getTeamIndex() !== teamIndex)                                                                         &&
            (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                            &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitType(), unitCategoryId)))    &&
            (unit.getGridIndex().checkIsInsideCoSkillArea({
                coSkillAreaType         : coSkillAreaTypeId,
                getCoGridIndexArrayOnMap: () => coGridIndexList,
                coZoneRadius            : zoneRadius,
            }))
        ) {
            if (turns > 0) {
                unit.addBuff(UnitBuffsUtilsCommon.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : turnIndex + turns,
                    expiringPlayerIndex : playerIndexInTurn,
                    extraParams         : null,
                }), false, true);
            } else {
                unit.addBuff(UnitBuffsUtilsCommon.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : null,
                    expiringPlayerIndex : null,
                    extraParams         : null,
                }), false, true);
            }

            (!isFastExecute) && (unit.updateView());
        }
    }
}

function exeFixedAreaDamageWithExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute }: {
    skillCfg            : CoSkillCfg;
    player              : IBwPlayer;
    skillData           : ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureGridIndex.GridIndex[]>;
    isFastExecute       : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getFixedAreaDamage();
    if (cfg == null) {
        return;
    }

    if (isFastExecute) {
        return;
    }

    const centerArray: AuxiliaryTypesGridIndex.GridIndex[] = [];
    if (cfg.getTargetTypeId() === CoSkillsConstants.FixedAreaDamageTargetTypeId.Appointed) {
        for (const protoGridIndex of targetGridIndexes ?? []) {
            centerArray.push(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(protoGridIndex)));
        }
    } else {
        centerArray.push(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(skillData.getFixedAreaDamageCenter())));
    }

    const gridVisualEffect  = player.getWar().getGridVisualEffect();
    for (const center of centerArray) {
        for (const gridIndex of center.getGridsWithinDistance({
            minDistance : 0,
            maxDistance : cfg.getRadius() ?? 0,
            mapSize     : player.getWar().getTileMap().getMapSize(),
        })) {
            gridVisualEffect.showEffectExplosion(gridIndex);
        }
    }
}
function exeFixedAreaDamageWithoutExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute }: {
    skillCfg            : CoSkillCfg;
    player              : IBwPlayer;
    skillData           : ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureGridIndex.GridIndex[]>;
    isFastExecute       : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getFixedAreaDamage();
    if (cfg == null) {
        return;
    }

    const centerArray: AuxiliaryTypesGridIndex.GridIndex[] = [];
    if (cfg.getTargetTypeId() === CoSkillsConstants.FixedAreaDamageTargetTypeId.Appointed) {
        for (const protoGridIndex of targetGridIndexes ?? []) {
            centerArray.push(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(protoGridIndex)));
        }
    } else {
        centerArray.push(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(skillData.getFixedAreaDamageCenter())));
    }

    const war                   = player.getWar();
    const unitMap               = war.getUnitMap();
    const mapSize               = unitMap.getMapSize();
    const hpDamage              = (cfg.getDamage() ?? 0) * UnitsConstants.Hp.Normalizer;
    const isIndiscriminate      = !!cfg.getIsIndiscriminate();
    const actionState           = cfg.getChangeUnitActionStateId() ?? 0;
    const canDestroy            = !!cfg.getCanDestroy();
    const teamIndex             = player.getTeamIndex();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const gridVisualEffect      = war.getGridVisualEffect();
    for (const center of centerArray) {
        for (const gridIndex of center.getGridsWithinDistance({ minDistance: 0, maxDistance: cfg.getRadius() ?? 0, mapSize })) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                      &&
                ((isIndiscriminate) || (unit.getTeamIndex() !== teamIndex))
            ) {
                const rawNewHp = unit.getCurrentHp() - hpDamage;
                if ((canDestroy) && (rawNewHp <= 0)) {
                    DestructionsUtils.destroyUnitOnMap(war, gridIndex, false);
                } else {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    unit.setCurrentHp(NumbersUtils.getValueInRange({
                        maxValue    : unit.getMaxHp(),
                        minValue    : 1,
                        rawValue    : rawNewHp,
                    }));
                    if (actionState >= 0) {
                        unit.setActionState(actionState);
                    }

                    {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    }

                    (!isFastExecute) && (unit.updateView());
                }
            }

            if (!isFastExecute) {
                gridVisualEffect.showEffectExplosion(gridIndex);
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfPromotionGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfPromotionGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfPromotionGain();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const zoneRadius        = player.getCoZoneRadius();
        const gameConfig        = war.getGcData();
        const maxPromotion      = gameConfig.getUnitMaxPromotion();
        const unitCategory      = cfg.getUnitCategoryId();
        const conIsCoOnboard    = cfg.getIsCoOnboard();
        const modifier          = cfg.getGain() ?? 0;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                ((conIsCoOnboard == null) || (conIsCoOnboard === unit.getIsCoOnboard()))                    &&
                ((unitCategory == null) || (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory)))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius
                }))
            ) {
                const currentPromotion = HelpersMisc.getExisted(unit.getCurrentPromotion());
                unit.setCurrentPromotion(Math.max(
                    0,
                    Math.min(
                        maxPromotion,
                        currentPromotion + modifier
                    ),
                ));
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfUnitActionStateWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfUnitActionStateWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfUnitActionState();
    if (cfg) {
        const playerIndex       = player.getPlayerIndex();
        const zoneRadius        = player.getCoZoneRadius();
        const category          = cfg.getUnitCategoryId() ?? 0;
        const conIsCoOnboard    = cfg.getConIsCoOnboard();
        const actionState       = cfg.getUnitActionStateId() ?? 0;
        if ((actionState !== UnitsConstants.ActionStateId.Acted) && (actionState !== UnitsConstants.ActionStateId.Idle)) {
            throw HelpersMisc.newError(`Invalid actionState: ${actionState}`, UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeSelfUnitActionState_00);
        }

        const war           = player.getWar();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitType();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                                     &&
                ((conIsCoOnboard == null) || (unit.getIsCoOnboard() === conIsCoOnboard))    &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))                  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius
                }))
            ) {
                unit.setActionState(actionState);
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfFlareAmmoGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfFlareAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfFlareAmmoGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId() ?? 0;
        const modifier      = cfg.getGainPct() ?? 0;
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            const unitType      = unit.getUnitType();
            const gridIndex     = unit.getGridIndex();
            const currentAmmo   = HelpersMisc.getExisted(unit.getFlareCurrentAmmo(), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeSelfFlareAmmoGain_00);
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius            : zoneRadius,
                }))
            ) {
                if (modifier > 0) {
                    unit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        currentAmmo + Math.floor(maxAmmo * modifier / 100)
                    ));
                } else {
                    unit.setFlareCurrentAmmo(Math.max(
                        0,
                        Math.floor(currentAmmo * (100 + modifier) / 100)
                    ));
                }
                (!isFastExecute) && (unit.updateView());
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeChangeWeatherWithExtraData({ skillCfg, player, skillData, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    skillData       : ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill;
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getChangeWeather();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const weatherManager    = war.getWeatherManager();
        const fogMap            = war.getFogMap();
        const hasFog            = fogMap.checkHasFogCurrently();
        weatherManager.setForceWeatherType(HelpersMisc.getExisted(skillData.getNewWeatherType(), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithExtraData_00));
        weatherManager.setExpirePlayerIndex(playerIndex);
        weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + (cfg.getTurns() ?? 0));
        // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
        if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg.getKeepVision())) {
            const mapSize           = fogMap.getMapSize();
            const visibilityArray   : GameConfigGcWar.VisibilityTypeId[] = new Array(mapSize.getWidth() * mapSize.getHeight());
            visibilityArray.fill(GameConfigGcWar.VisibilityTypeId.Penetrating);
            fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
        }

        if (!isFastExecute) {
            weatherManager.getView().resetView(false);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeChangeWeatherWithoutExtraData({ skillCfg, player, skillData, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    skillData       : ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill;
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getChangeWeather();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const weatherManager    = war.getWeatherManager();
        const fogMap            = war.getFogMap();
        const hasFog            = fogMap.checkHasFogCurrently();
        weatherManager.setForceWeatherType(HelpersMisc.getExisted(skillData.getNewWeatherType(), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithoutExtraData_00));
        weatherManager.setExpirePlayerIndex(playerIndex);
        weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + (cfg.getTurns() ?? 0));
        // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
        if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg.getKeepVision())) {
            const mapSize           = fogMap.getMapSize();
            const visibilityArray   : GameConfigGcWar.VisibilityTypeId[] = new Array(mapSize.getWidth() * mapSize.getHeight());
            visibilityArray.fill(GameConfigGcWar.VisibilityTypeId.Penetrating);
            fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
        }

        if (!isFastExecute) {
            weatherManager.getView().resetView(false);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exeSelfCoOnboardWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}
function exeSelfCoOnboardWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : IBwPlayer;
    coGridIndexList : AuxiliaryTypesGridIndex.GridIndex[];
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getSelfCoOnboard();
    if (cfg == null) {
        return;
    }

    const playerIndex           = player.getPlayerIndex();
    const zoneRadius            = player.getCoZoneRadius();
    const war                   = player.getWar();
    const gameConfig            = war.getGcData();
    const unitCategoryId        = cfg.getUnitCategoryId();
    const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId() ?? 0;
    const isCoOnboard           = !!cfg.getIsCoOnboard();
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getPlayerIndex() === playerIndex)                                                                     &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitType(), unitCategoryId)))    &&
            (unit.getIsCoOnboard() !== isCoOnboard)                                                                     &&
            (unit.getGridIndex().checkIsInsideCoSkillArea({
                coSkillAreaType         : coSkillAreaTypeId,
                getCoGridIndexArrayOnMap: () => coGridIndexList,
                coZoneRadius            : zoneRadius,
            }))
        ) {
            unit.setIsCoOnboard(isCoOnboard);
            (!isFastExecute) && (unit.updateView());
        }
    }
}
