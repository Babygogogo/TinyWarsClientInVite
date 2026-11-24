import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_InstantManual_Conditions,
    Helpers_Misc,
    type Players_Player,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function executeAsOuterWar({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

export function executeAsLocalWar({ skillCfg, player, skillUserCoGridIndexList, skillUserCoZoneRadius, isFastExecute }: {
    skillCfg             : CoSkillCfg;
    player               : Players_Player.Player;
    skillUserCoGridIndexList      : AuxiliaryTypes_GridIndex.GridIndex[];
    skillUserCoZoneRadius: number;
    isFastExecute        : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const attributes    = skillCfg.getInstantManual()?.getUnitAttributes();
    const modifier      = attributes?.getSelfPrimaryAmmo()?.getOffsetPct();
    const conditions    = attributes?.getConditions();
    if ((modifier != null) && (conditions != null)) {
        const playerIndex   = player.getPlayerIndex();
        const war           = player.getWar();
        const gameConfig    = war.getGcData();
        const tileMap       = war.getTileMap();
        const weatherTypeId = Helpers_Misc.getExisted(war.getWeatherManager().getCurrentWeatherType());
        for (const unit of war.getUnitMap().getAllUnits()) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                continue;
            }

            if ((unit.getPlayerIndex() === playerIndex) &&
                (CoSkills_Utils_InstantManual_Conditions.checkIsMeet({
                    conditions               : conditions,
                    unit                     : unit,
                    tileMap                  : tileMap,
                    weatherTypeId            : weatherTypeId,
                    skillUserCoGridIndexList : skillUserCoGridIndexList,
                    skillUserCoZoneRadius    : skillUserCoZoneRadius,
                    gameConfig               : gameConfig,
                    isSkillUserCoOnboard     : false,
                }))
            ) {
                if (modifier > 0) {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * modifier / 100);
                } else {
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(unit.getPrimaryWeaponCurrentAmmo() * modifier / 100);
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
