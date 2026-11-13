import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Players_Player,
    Players_Utils_Common,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfFundWithExtraData({ isFastExecute }: {
    isFastExecute   : boolean;
}): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exeSelfFundWithoutExtraData({ skillCfg, player, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getSelfFund();
    if (cfg == null) {
        return changedThings;
    }

    const offsetByIncome = (cfg.getIncomeConversionPct()) == 0
        ? 0
        : player.getWar().getTileMap().getTotalIncomeForPlayer(player.getPlayerIndex()) * (cfg.getIncomeConversionPct()) / 100;

    player.setFund(Players_Utils_Common.getValidFund(
        player.getFund() * (cfg.getMultiplierPct()) / 100 + (cfg.getOffset()) + offsetByIncome),
    );

    changedThings.addPlayer(player);
    return changedThings;
}
