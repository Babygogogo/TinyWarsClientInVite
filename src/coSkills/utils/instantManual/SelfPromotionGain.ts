import {
    type AuxiliaryTypes_GridIndex,
    type Players_Player,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfPromotionGainWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfPromotionGainWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfPromotionGain();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const zoneRadius        = player.getCoZoneRadius();
        const gameConfig        = war.getGcData();
        const maxPromotion      = gameConfig.getUnitMaxPromotion();
        const unitCategory      = cfg.getUnitCategoryId();
        const conIsCoOnboard    = cfg.getIsCoOnboard();
        const modifier          = cfg.getGain();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                ((conIsCoOnboard == null) || (conIsCoOnboard === unit.getIsCoOnboard()))                    &&
                ((unitCategory == null) || (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory)))  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                const currentPromotion = unit.getCurrentPromotion();
                unit.setCurrentPromotion(Math.max(
                    0,
                    Math.min(
                        maxPromotion,
                        currentPromotion + modifier,
                    ),
                ));
                changedThings.addUnit(unit);

                if (!isFastExecute) {
                    unit.flushDataToView();
                }
            }
        }
    }
    return changedThings;
}
