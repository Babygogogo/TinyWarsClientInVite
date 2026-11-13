import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeEnemyPrimaryAmmoGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getEnemyPrimaryAmmoGain();
    if (cfg) {
        const war           = player.getWar();
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const category      = cfg.getUnitCategoryId();
        const modifier      = cfg.getGainPct();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            const unitType      = unit.getUnitTypeId();
            const gridIndex     = unit.getGridIndex();
            const currentAmmo   = unit.getPrimaryWeaponCurrentAmmo();
            if ((unit.getPlayerIndex() !== playerIndex)                     &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                if (modifier > 0) {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * modifier / 100);
                } else {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * modifier / 100);
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
