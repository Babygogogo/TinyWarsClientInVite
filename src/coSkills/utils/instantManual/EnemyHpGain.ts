import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    Helpers_Team,
    Players_Player,
    Units_Constants,
    Visibilities_Utils,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeEnemyHpGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeEnemyHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getEnemyUnitHp();
    if (cfg) {
        const teamIndex             = player.getTeamIndex();
        const zoneRadius            = player.getCoZoneRadius();
        const war                   = player.getWar();
        const tileMap               = war.getTileMap();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const unitCategory          = cfg.getUnitCategoryId();
        const tileCategory          = cfg.getTileCategoryId();
        const deltaHp               = cfg.getHpGain();
        const loadedState           = cfg.getUnitLoadedStateId();
        const gameConfig            = war.getGcData();
        const modifier              = deltaHp * Units_Constants.Hp.Normalizer;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            const maxHp     = unit.getMaxHp();
            const currentHp = unit.getCurrentHp();
            const tileType  = tileMap.getTile(gridIndex)?.getTileTypeId();
            if ((unit.getTeamIndex() !== teamIndex)                             &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory))  &&
                (gameConfig.checkIsTileTypeInCategory(tileType, tileCategory))  &&
                (unit.checkIsMeetLoadedState(loadedState))                      &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                const oldNormalizedHp = unit.getNormalizedCurrentHp();
                if (deltaHp > 0) {
                    unit.setCurrentHp(Math.min(
                        maxHp,
                        (unit.getNormalizedCurrentHp() + deltaHp) * Units_Constants.Hp.Normalizer),
                    );
                } else {
                    unit.setCurrentHp(Math.max(
                        1,
                        currentHp + modifier,
                    ));
                }

                {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                            war       : war,
                            gridIndex : gridIndex,
                        });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : unitType,
                                dstPlayerIndex             : unit.getPlayerIndex(),
                                unitGain                   : 0,
                                unitLoss                   : 0,
                                normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }

                changedThings.addUnit(unit);

                if (!isFastExecute) {
                    unit.flushDataToView();
                }
            }
        }
    }

    return changedThings;
}
