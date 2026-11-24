import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    CoSkills_Utils_InstantManual_Conditions,
    Helpers_Misc,
    Helpers_Team,
    Numbers_Utils,
    Players_Player,
    Players_Utils_Common,
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
    const cfg           = attributes?.getSelfHp();
    const conditions    = attributes?.getConditions();
    if ((cfg != null) && (conditions != null)) {
        const war                   = player.getWar();
        const playerIndex           = player.getPlayerIndex();
        const regularHpOffset       = cfg.getRegularHpOffset() ?? 0;
        const costMultiplier        = (cfg.getCostMultiplierPct()) / 100 / 10;
        const gameConfig            = war.getGcData();
        const tileMap               = war.getTileMap();
        const weatherTypeId         = Helpers_Misc.getExisted(war.getWeatherManager().getCurrentWeatherType());
        const warStatisticsManager  = war.getWarStatisticsManager();
        const hpOffset              = regularHpOffset * Units_Constants.Hp.Normalizer;
        let totalCost               = 0;
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex) &&
                (CoSkills_Utils_InstantManual_Conditions.checkIsMeet({
                    conditions               : conditions,
                    unit                     : unit,
                    tileMap                  : tileMap,
                    weatherTypeId            : weatherTypeId,
                    skillUserCoGridIndexList : skillUserCoGridIndexList,
                    skillUserCoZoneRadius    : skillUserCoZoneRadius,
                    gameConfig               : gameConfig,
                    isSkillUserCoOnboard     : unit.getIsCoOnboard(),
                }))
            ) {
                const unitType        = unit.getUnitTypeId();
                const gridIndex       = unit.getGridIndex();
                const maxHp           = unit.getMaxHp();
                const currentHp       = unit.getCurrentHp();
                const oldNormalizedHp = unit.getNormalizedCurrentHp();
                if (regularHpOffset >= 0) {
                    unit.setCurrentHp(Numbers_Utils.getValueInRange({
                        minValue : 1,
                        maxValue : maxHp,
                        rawValue : (unit.getNormalizedCurrentHp() + regularHpOffset) * Units_Constants.Hp.Normalizer,
                    }));
                } else {
                    unit.setCurrentHp(Numbers_Utils.getValueInRange({
                        rawValue : currentHp + hpOffset,
                        minValue : 1,
                        maxValue : maxHp,
                    }));
                }

                {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        if (costMultiplier !== 0) {
                            totalCost += unit.getProductionFinalCost(costMultiplier * offsetNormalizedHp);
                        }

                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                            war       : war,
                            gridIndex : gridIndex,
                        });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : unitType,
                                dstPlayerIndex             : playerIndex,
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

        if (totalCost !== 0) {
            player.setFund(Players_Utils_Common.getValidFund(player.getFund() - totalCost), !isFastExecute);
            changedThings.addPlayer(player);
        }
    }

    return changedThings;
}
