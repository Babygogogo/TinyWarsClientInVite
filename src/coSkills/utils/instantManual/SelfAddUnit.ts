import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    Helpers_Misc,
    Helpers_Team,
    Players_Constants,
    Players_Player,
    Units_Unit,
    Units_Utils_Serialization,
    Utils_ClientErrorCode,
    Visibilities_Utils,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfAddUnitWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfAddUnitWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfAddUnit();
    if (cfg == null) {
        return changedThings;
    }

    const selfPlayerIndex = player.getPlayerIndex();
    if ((selfPlayerIndex == null) || (selfPlayerIndex === Players_Constants.PlayerIndex.Neutral)) {
        throw Helpers_Misc.newError(`Invalid selfPlayerIndex: ${selfPlayerIndex}.`, Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeSelfAddUnit_00);
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
        if ((!gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId()))   ||
            (!gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                getCoGridIndexArrayOnMap : () => coGridIndexList,
                coZoneRadius             : coZoneRadius,
            }))
        ) {
            continue;
        }

        // cfg:（范围类别，地形类别，部队种类，hp，状态（0=未行动，1=已行动））
        const unitId            = unitMap.getNextUnitId();
        const unitTypeId        = cfg.getUnitTypeId();
        const unitTemplateCfg   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitTypeId));
        const unit              = new Units_Unit.Unit(true);
        unit.init(Units_Utils_Serialization.create({
            unitType    : unitTypeId,
            unitId      : unitId,
            playerIndex : selfPlayerIndex,
            gridIndex   : gridIndex.toProto().toJson(),

            actionState  : cfg.getUnitActionStateId(),
            currentHp    : cfg.getHp(),
            aiMode       : null,
            groupedTagId : null,
            customNameId : null,

            currentPromotion     : null,
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
            loaderUnitId             : null,
        }), gameConfig);

        unit.startRunning(war);
        unit.flushDataToView();
        unitMap.setNextUnitId(unitId + 1);
        unitMap.setUnitOnMap(unit);

        {
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                war       : war,
                gridIndex : gridIndex,
            });
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unitTypeId,
                    dstPlayerIndex             : selfPlayerIndex,
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    normalizedHpGain           : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss           : 0,
                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }

        changedThings.addUnit(unit);
    }

    return changedThings;
}
