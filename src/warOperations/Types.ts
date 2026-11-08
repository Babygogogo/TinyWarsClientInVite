import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export interface WarOperationAndUserId {
    warOperation    : WoContainer;
    userId          : number | undefined;
}
