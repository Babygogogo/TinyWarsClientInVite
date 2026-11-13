import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    UnitBuffs_Utils_Common,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfUnitBuffGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfUnitBuffGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfUnitBuffGain();
    if (cfg == null) {
        return changedThings;
    }

    const war                   = player.getWar();
    const playerIndex           = player.getPlayerIndex();
    const zoneRadius            = player.getCoZoneRadius();
    const turnIndex             = war.getTurnManager().getTurnIndex();
    const gameConfig            = war.getGcData();
    const unitCategoryId        = cfg.getUnitCategoryId();
    const unitBuffTypeId        = cfg.getUnitBuffTypeId();
    const unitLoadedStateId     = cfg.getUnitLoadedStateId();
    const coSkillAreaTypeId     = cfg.getCoSkillAreaTypeId();
    const turns                 = cfg.getTurns();
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getPlayerIndex() === playerIndex)                                                                     &&
            (unit.checkIsMeetLoadedState(unitLoadedStateId))                                                            &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitTypeId(), unitCategoryId)))    &&
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
                    expiringPlayerIndex : playerIndex,
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
