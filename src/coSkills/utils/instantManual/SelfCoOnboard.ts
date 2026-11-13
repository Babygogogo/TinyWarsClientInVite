import {
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfCoOnboardWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfCoOnboardWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfCoOnboard();
    if (cfg == null) {
        return changedThings;
    }

    const playerIndex       = player.getPlayerIndex();
    const zoneRadius        = player.getCoZoneRadius();
    const war               = player.getWar();
    const gameConfig        = war.getGcData();
    const unitCategoryId    = cfg.getUnitCategoryId();
    const coSkillAreaTypeId = cfg.getCoSkillAreaTypeId();
    const isCoOnboard       = !!cfg.getIsCoOnboard();
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unit.getPlayerIndex() === playerIndex)                                                                     &&
            ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unit.getUnitTypeId(), unitCategoryId)))  &&
            (unit.getIsCoOnboard() !== isCoOnboard)                                                                     &&
            (unit.getGridIndex().checkIsInsideCoSkillArea({
                coSkillAreaType          : coSkillAreaTypeId,
                getCoGridIndexArrayOnMap : () => coGridIndexList,
                coZoneRadius             : zoneRadius,
            }))
        ) {
            unit.setIsCoOnboard(isCoOnboard);
            changedThings.addUnit(unit);

            if (!isFastExecute) {
                unit.flushDataToView();
            }
        }
    }
    return changedThings;
}
