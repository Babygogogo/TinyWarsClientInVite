import {
    CoSkills_Constants,
    Helpers_Misc,
} from "../../internal.ts";
import type { CoBasicCfg } from "../../proto/schema/CommonProto/Config/CoBasicCfg.ts";

export function checkIsValidSkillTypeId(skillTypeId: number): boolean {
    return CoSkills_Constants.AllSkillTypeIdArray.includes(skillTypeId);
}
export function checkIsValidSkillTypeIdSubset(subset: number[]): boolean {
    return ((new Set(subset)).size === subset.length)
        && (subset.every(v => checkIsValidSkillTypeId(v)));
}

export function getPowerSkillTargetsCount(coConfig: CoBasicCfg, skillType: number): number {
    const arr = coConfig.getPowerSkillTargetsCountArray();
    switch (skillType) {
        case CoSkills_Constants.SkillTypeId.Power        : return arr[0] ?? 0;
        case CoSkills_Constants.SkillTypeId.SuperPower   : return arr[1] ?? 0;
        default                         : throw Helpers_Misc.newError(`Invalid skillType: ${skillType}`);
    }
}
