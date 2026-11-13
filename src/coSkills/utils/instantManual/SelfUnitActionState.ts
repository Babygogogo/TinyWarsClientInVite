import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    Helpers_Misc,
    Players_Player,
    Units_Constants,
    Utils_ClientErrorCode,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfUnitActionStateWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function exeSelfUnitActionStateWithoutExtraData({ skillCfg, player, coGridIndexList, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    coGridIndexList : AuxiliaryTypes_GridIndex.GridIndex[];
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfUnitActionState();
    if (cfg) {
        const playerIndex       = player.getPlayerIndex();
        const zoneRadius        = player.getCoZoneRadius();
        const category          = cfg.getUnitCategoryId();
        const conIsCoOnboard    = cfg.getConIsCoOnboard();
        const actionState       = cfg.getUnitActionStateId();
        if ((actionState !== Units_Constants.ActionStateId.Acted) && (actionState !== Units_Constants.ActionStateId.Idle)) {
            throw Helpers_Misc.newError(`Invalid actionState: ${actionState}`, Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeSelfUnitActionState_00);
        }

        const war           = player.getWar();
        const gameConfig    = war.getGcData();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitType  = unit.getUnitTypeId();
            const gridIndex = unit.getGridIndex();
            if ((unit.getPlayerIndex() === playerIndex)                                     &&
                ((conIsCoOnboard == null) || (unit.getIsCoOnboard() === conIsCoOnboard))    &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, category))                  &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                    getCoGridIndexArrayOnMap : () => coGridIndexList,
                    coZoneRadius             : zoneRadius,
                }))
            ) {
                unit.setActionState(actionState);
                changedThings.addUnit(unit);

                if (!isFastExecute) {
                    unit.flushDataToView();
                }
            }
        }
    }
    return changedThings;
}
