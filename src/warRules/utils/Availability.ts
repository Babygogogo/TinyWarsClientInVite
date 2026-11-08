import type { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";

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
