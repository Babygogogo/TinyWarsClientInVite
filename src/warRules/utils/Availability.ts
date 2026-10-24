import type * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";

type RuleAvailability = ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability;

export function checkIsValid(availability: RuleAvailability): boolean {
    // const {
    //     canMcw,     canScw,     canMrw,     canSrw,     canCcw
    // } = availability;
    // return (!!canMcw)
    //     || (!!canScw)
    //     || (!!canMrw)
    //     || (!!canSrw)
    //     || (!!canCcw);
    return availability != null;
}
