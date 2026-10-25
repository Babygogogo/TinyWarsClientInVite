import type { WoContainer as ProtoSchemaCommonProtoWarOperationWoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

type WoContainer        = ProtoSchemaCommonProtoWarOperationWoContainer;

export interface WarOperationAndUserId {
    warOperation    : WoContainer;
    userId          : number | undefined;
}
