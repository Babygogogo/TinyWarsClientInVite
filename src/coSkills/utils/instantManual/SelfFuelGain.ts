import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfFuelGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfFuelGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfFuelGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId();
        const modifier      = cfg.getGainPct();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                const maxFuel       = unit.getMaxFuel();
                const currentFuel   = unit.getCurrentFuel();
                if (modifier > 0) {
                    unit.setCurrentFuel(Math.min(
                        maxFuel,
                        currentFuel + Math.floor(maxFuel * modifier / 100),
                    ));
                } else {
                    unit.setCurrentFuel(Math.max(
                        0,
                        Math.floor(currentFuel * (100 + modifier) / 100),
                    ));
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
