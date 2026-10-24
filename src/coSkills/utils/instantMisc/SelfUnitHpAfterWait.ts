import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgInstantMiscSelfUnitHpAfterWait from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfUnitHpAfterWait.ts";
import * as UnitsConstants from "../../../units/Constants.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    maxHp,
    currentHp,
}: {
    cfg         : ProtoSchemaCommonProtoConfigCoSkillCfgInstantMiscSelfUnitHpAfterWait.SelfUnitHpAfterWait;
    gameConfig  : GameConfigGcData.GcData;
    maxHp       : number;
    currentHp   : number;
}): number {
    const realHpOffset  = cfg.getRealHpOffset() ?? 0;
    let newHp           = NumbersUtils.getValueInRange({
        maxValue    : maxHp,
        minValue    : 1,
        rawValue    : currentHp + realHpOffset,
    });
    if (realHpOffset > 0) {
        const remainder = newHp % UnitsConstants.Hp.Normalizer;
        if (remainder != 0) {
            newHp += UnitsConstants.Hp.Normalizer - remainder;
        }
    }
    return newHp - currentHp;
}
