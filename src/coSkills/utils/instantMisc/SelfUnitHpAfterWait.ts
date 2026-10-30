import {
    Numbers_Utils,
    Units_Constants,
    type GameConfigs_GameConfig,
} from "../../../internal.ts";
import type { SelfUnitHpAfterWait } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfUnitHpAfterWait.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    maxHp,
    currentHp,
}: {
    cfg         : SelfUnitHpAfterWait;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    maxHp       : number;
    currentHp   : number;
}): number {
    const realHpOffset  = cfg.getRealHpOffset();
    let newHp           = Numbers_Utils.getValueInRange({
        maxValue    : maxHp,
        minValue    : 1,
        rawValue    : currentHp + realHpOffset,
    });
    if (realHpOffset > 0) {
        const remainder = newHp % Units_Constants.Hp.Normalizer;
        if (remainder != 0) {
            newHp += Units_Constants.Hp.Normalizer - remainder;
        }
    }
    return newHp - currentHp;
}
