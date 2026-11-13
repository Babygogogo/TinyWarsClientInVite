import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    UnitBuffs_Utils_Common,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeEnemyUnitBuffGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeEnemyUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getEnemyUnitBuffGain();
    if (cfg == null) {
        return changedThings;
    }

    const war                   = player.getWar();
    const playerIndexInTurn     = player.getPlayerIndex();
    const teamIndex             = player.getTeamIndex();
    const zoneRadius            = player.getCoZoneRadius();
    const turnIndex             = war.getTurnManager().getTurnIndex();
    const gameConfig            = war.getGcData();
    const unitCategoryId        = cfg.getUnitCategoryId();
    const unitBuffTypeId        = cfg.getUnitBuffTypeId();
    const unitLoadedStateId     = cfg.getUnitLoadedStateId();
    const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId();
    const turns                 = cfg.getTurns();
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getTeamIndex() !== teamIndex)                                                                         &&
            (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                            &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitTypeId(), unitCategoryId)))  &&
            (unit.getGridIndex().checkIsInsideCoSkillArea({
                coSkillAreaType          : coSkillAreaTypeId,
                getCoGridIndexArrayOnMap : () => coGridIndexList,
                coZoneRadius             : zoneRadius,
            }))
        ) {
            if (turns > 0) {
                unit.addBuff(UnitBuffs_Utils_Common.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : turnIndex + turns,
                    expiringPlayerIndex : playerIndexInTurn,
                    extraParams         : null,
                }), false, true);
            } else {
                unit.addBuff(UnitBuffs_Utils_Common.create({
                    buffTypeId          : unitBuffTypeId,
                    expiringTurnIndex   : null,
                    expiringPlayerIndex : null,
                    extraParams         : null,
                }), false, true);
            }
            changedThings.addUnit(unit);

            if (!isFastExecute) {
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}
