import * as CoSkillsConstants from "../Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoConfigCoBasicCfg from "../../proto/schema/CommonProto/Config/CoBasicCfg.ts";

type CoBasicCfg         = ProtoSchemaCommonProtoConfigCoBasicCfg.CoBasicCfg;

export function checkIsValidSkillTypeId(skillTypeId: number): boolean {
    return CoSkillsConstants.AllSkillTypeIdArray.includes(skillTypeId);
}
export function checkIsValidSkillTypeIdSubset(subset: number[]): boolean {
    return ((new Set(subset)).size === subset.length)
        && (subset.every(v => checkIsValidSkillTypeId(v)));
}

export function getPowerSkillTargetsCount(coConfig: CoBasicCfg, skillType: number): number {
    const arr = coConfig.getPowerSkillTargetsCountArray();
    switch (skillType) {
        case CoSkillsConstants.SkillTypeId.Power        : return arr[0] ?? 0;
        case CoSkillsConstants.SkillTypeId.SuperPower   : return arr[1] ?? 0;
        default                         : throw HelpersMisc.newError(`Invalid skillType: ${skillType}`);
    }
}
