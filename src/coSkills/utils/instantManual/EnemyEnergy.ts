import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Players_Player,
    Teams_Constants,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeEnemyEnergyWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeEnemyEnergyWithoutExtraData({ skillCfg, player, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getEnemyEnergy();
    if (cfg == null) {
        return changedThings;
    }

    const selfFund      = player.getFund();
    const selfTeamIndex = player.getTeamIndex();
    const modifier      = (cfg.getFuncConversionPct()) * selfFund / 10000 + (cfg.getOffsetPct());
    for (const p of player.getWar().getPlayerManager().getAllPlayers()) {
        const teamIndex = p.getTeamIndex();
        if ((teamIndex === selfTeamIndex) || (teamIndex === Teams_Constants.TeamIndex.Neutral)) {
            continue;
        }

        p.addAndValidateCoCurrentEnergy(p.getCoCurrentEnergy() * modifier / 100);
        changedThings.addPlayer(p);
    }

    return changedThings;
}
