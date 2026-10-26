import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { SelfUnitHpAfterWait } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfUnitHpAfterWait.ts";
import { Hp } from "../../../units/Constants.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    maxHp,
    currentHp,
}: {
    cfg         : SelfUnitHpAfterWait;
    gameConfig  : GcData;
    maxHp       : number;
    currentHp   : number;
}): number {
    const realHpOffset  = cfg.getRealHpOffset() ?? 0;
    let newHp           = getValueInRange({
        maxValue    : maxHp,
        minValue    : 1,
        rawValue    : currentHp + realHpOffset,
    });
    if (realHpOffset > 0) {
        const remainder = newHp % Hp.Normalizer;
        if (remainder != 0) {
            newHp += Hp.Normalizer - remainder;
        }
    }
    return newHp - currentHp;
}
