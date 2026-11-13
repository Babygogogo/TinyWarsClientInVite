import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
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
export function exeSelfHpGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfHpGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfUnitHp();
    if (cfg) {
        const war                   = player.getWar();
        const playerIndex           = player.getPlayerIndex();
        const zoneRadius            = player.getCoZoneRadius();
        const unitCategoryId        = cfg.getUnitCategoryId();
        const regularHpOffset       = cfg.getRegularHpOffset();
        const unitLoadedStateId     = cfg.getUnitLoadedStateId();
        const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId();
        const costMultiplier        = (cfg.getCostMultiplierPct()) / 100 / 10;
        const gameConfig            = war.getGcData();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const hpOffset              = regularHpOffset * Units_Constants.Hp.Normalizer;
        let totalCost               = 0;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            const maxHp     = unit.getMaxHp();
            const currentHp = unit.getCurrentHp();
            if ((unit.getPlayerIndex() === playerIndex)                                                         &&
                (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                &&
                ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategoryId)))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : coSkillAreaTypeId,
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
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
            player.setFund(Players_Utils_Common.getValidFund(player.getFund() - totalCost));
            changedThings.addPlayer(player);
        }
    }

    return changedThings;
}
