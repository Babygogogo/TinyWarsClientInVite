import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    CoSkills_Utils_InstantManual_Conditions,
    Helpers_Misc,
    Helpers_Team,
    Players_Player,
    Units_Constants,
    Visibilities_Utils,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeAsOuterWar({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function executeAsLocalWar({ skillCfg, player, skillUserCoGridIndexList, skillUserCoZoneRadius, isFastExecute }: {
    skillCfg                    : CoSkillCfg;
    player                      : Players_Player.Player;
    skillUserCoGridIndexList    : AuxiliaryTypes_GridIndex.GridIndex[];
    skillUserCoZoneRadius       : number;
    isFastExecute               : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const attributes    = skillCfg.getInstantManual()?.getUnitAttributes();
    const deltaHp       = attributes?.getEnemyHp()?.getRegularHpOffset();
    const conditions    = attributes?.getConditions();
    if ((deltaHp != null) && (conditions != null)) {
        const teamIndex             = player.getTeamIndex();
        const war                   = player.getWar();
        const tileMap               = war.getTileMap();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const weatherTypeId         = Helpers_Misc.getExisted(war.getWeatherManager().getCurrentWeatherType());
        const gameConfig            = war.getGcData();
        const modifier              = deltaHp * Units_Constants.Hp.Normalizer;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            const maxHp     = unit.getMaxHp();
            const currentHp = unit.getCurrentHp();
            if ((unit.getTeamIndex() !== teamIndex) &&
                (CoSkills_Utils_InstantManual_Conditions.checkIsMeet({
                    conditions               : conditions,
                    unit                     : unit,
                    tileMap                  : tileMap,
                    weatherTypeId            : weatherTypeId,
                    skillUserCoGridIndexList : skillUserCoGridIndexList,
                    skillUserCoZoneRadius    : skillUserCoZoneRadius,
                    gameConfig               : gameConfig,
                    isSkillUserCoOnboard     : false,
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
