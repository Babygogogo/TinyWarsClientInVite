import { AllSkillTypeIdArray, SkillTypeId } from "../Constants.ts";
import { newError } from "../../helpers/Misc.ts";
import type { CoBasicCfg as ProtoSchemaCommonProtoConfigCoBasicCfg } from "../../proto/schema/CommonProto/Config/CoBasicCfg.ts";

type CoBasicCfg         = ProtoSchemaCommonProtoConfigCoBasicCfg;

export function checkIsValidSkillTypeId(skillTypeId: number): boolean {
    return AllSkillTypeIdArray.includes(skillTypeId);
}
export function checkIsValidSkillTypeIdSubset(subset: number[]): boolean {
    return ((new Set(subset)).size === subset.length)
        && (subset.every(v => checkIsValidSkillTypeId(v)));
}

export function getPowerSkillTargetsCount(coConfig: CoBasicCfg, skillType: number): number {
    const arr = coConfig.getPowerSkillTargetsCountArray();
    switch (skillType) {
        case SkillTypeId.Power        : return arr[0] ?? 0;
        case SkillTypeId.SuperPower   : return arr[1] ?? 0;
        default                         : throw newError(`Invalid skillType: ${skillType}`);
    }
}
