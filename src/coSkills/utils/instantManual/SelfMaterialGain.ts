import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfMaterialGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfMaterialGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfMaterialGain();
    if (cfg) {
        const war           = player.getWar();
        const playerIndex   = player.getPlayerIndex();
        const zoneRadius    = player.getCoZoneRadius();
        const category      = cfg.getUnitCategoryId();
        const modifier      = cfg.getGainPct();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxBuildMaterial      = unit.getMaxBuildMaterial();
            const maxProduceMaterial    = unit.getMaxProduceMaterial();
            if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                continue;
            }

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
                if (maxBuildMaterial != null) {
                    const currentBuildMaterial = unit.getCurrentBuildMaterial();
                    if (modifier > 0) {
                        unit.setCurrentBuildMaterial(Math.min(
                            maxBuildMaterial,
                            currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100),
                        ));
                    } else {
                        unit.setCurrentBuildMaterial(Math.max(
                            0,
                            Math.floor(currentBuildMaterial * (100 + modifier) / 100),
                        ));
                    }
                    changedThings.addUnit(unit);

                    if (!isFastExecute) {
                        unit.flushDataToView();
                    }
                }

                if (maxProduceMaterial != null) {
                    const currentProduceMaterial = unit.getCurrentProduceMaterial();
                    if (modifier > 0) {
                        unit.addAndValidateCurrentProduceMaterial(maxProduceMaterial * modifier / 100);
                    } else {
                        unit.addAndValidateCurrentProduceMaterial(currentProduceMaterial * modifier / 100);
                    }
                    changedThings.addUnit(unit);

                    if (!isFastExecute) {
                        unit.flushDataToView();
                    }
                }
            }
        }
    }

    return changedThings;
}
