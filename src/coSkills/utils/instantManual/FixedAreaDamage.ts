import { AuxiliaryTypes_AuxiliaryTypes, AuxiliaryTypes_ChangedThingsForWarOperation, AuxiliaryTypes_GridIndex, CoSkills_Constants, Destructions_Utils, Helpers_Misc, Helpers_Team, Numbers_Utils, Players_Player, Units_Constants, Visibilities_Utils } from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";
import type { DataForUseCoSkill } from "../../../proto/schema/CommonProto/Structure/DataForUseCoSkill";
import type { GridIndex as ProtoGridIndex } from "../../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics";

export function exeFixedAreaDamageWithExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute }: {
    skillCfg            : CoSkillCfg;
    player              : Players_Player.Player;
    skillData           : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getFixedAreaDamage();
    if (cfg == null) {
        return;
    }

    if (isFastExecute) {
        return;
    }

    const centerArray: AuxiliaryTypes_GridIndex.GridIndex[] = [];
    if (cfg.getTargetTypeId() === CoSkills_Constants.FixedAreaDamageTargetTypeId.Appointed) {
        for (const protoGridIndex of targetGridIndexes ?? []) {
            centerArray.push(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex)));
        }
    } else {
        centerArray.push(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(skillData.getFixedAreaDamageCenter())));
    }

    const gridVisualEffect  = player.getWar().getGridVisualEffect();
    for (const center of centerArray) {
        for (const gridIndex of center.getGridsWithinDistance({
            minDistance : 0,
            maxDistance : cfg.getRadius(),
            mapSize     : player.getWar().getTileMap().getMapSize(),
        })) {
            gridVisualEffect?.showEffectExplosion(gridIndex);
        }
    }
}

export function exeFixedAreaDamageWithoutExtraData({ skillCfg, player, skillData, targetGridIndexes, isFastExecute }: {
    skillCfg            : CoSkillCfg;
    player              : Players_Player.Player;
    skillData           : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getFixedAreaDamage();
    if (cfg == null) {
        return changedThings;
    }

    const centerArray: AuxiliaryTypes_GridIndex.GridIndex[] = [];
    if (cfg.getTargetTypeId() === CoSkills_Constants.FixedAreaDamageTargetTypeId.Appointed) {
        for (const protoGridIndex of targetGridIndexes ?? []) {
            centerArray.push(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(protoGridIndex)));
        }
    } else {
        centerArray.push(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(skillData.getFixedAreaDamageCenter())));
    }

    const war                   = player.getWar();
    const unitMap               = war.getUnitMap();
    const mapSize               = unitMap.getMapSize();
    const hpDamage              = (cfg.getDamage()) * Units_Constants.Hp.Normalizer;
    const isIndiscriminate      = !!cfg.getIsIndiscriminate();
    const actionState           = cfg.getChangeUnitActionStateId();
    const canDestroy            = !!cfg.getCanDestroy();
    const teamIndex             = player.getTeamIndex();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const gridVisualEffect      = war.getGridVisualEffect();
    for (const center of centerArray) {
        for (const gridIndex of center.getGridsWithinDistance({
            minDistance : 0,
            maxDistance : cfg.getRadius(),
            mapSize     : mapSize,
        })) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                      &&
                ((isIndiscriminate) || (unit.getTeamIndex() !== teamIndex))
            ) {
                const rawNewHp = unit.getCurrentHp() - hpDamage;
                if ((canDestroy) && (rawNewHp <= 0)) {
                    changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, false));
                } else {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    unit.setCurrentHp(Numbers_Utils.getValueInRange({
                        maxValue : unit.getMaxHp(),
                        minValue : 1,
                        rawValue : rawNewHp,
                    }));
                    if (actionState >= 0) {
                        unit.setActionState(actionState);
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
                                    unitType                   : unit.getUnitTypeId(),
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

            if (!isFastExecute) {
                gridVisualEffect?.showEffectExplosion(gridIndex);
            }
        }
    }

    return changedThings;
}
