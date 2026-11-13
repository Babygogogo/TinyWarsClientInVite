import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfFlareAmmoGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfFlareAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfFlareAmmoGain();
    if (cfg) {
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const war           = player.getWar();
        const category      = cfg.getUnitCategoryId();
        const modifier      = cfg.getGainPct();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            const unitType      = unit.getUnitTypeId();
            const gridIndex     = unit.getGridIndex();
            const currentAmmo   = unit.getFlareCurrentAmmo();
            if ((unit.getPlayerIndex() === playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                if (modifier > 0) {
                    unit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        currentAmmo + Math.floor(maxAmmo * modifier / 100),
                    ));
                } else {
                    unit.setFlareCurrentAmmo(Math.max(
                        0,
                        Math.floor(currentAmmo * (100 + modifier) / 100),
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
