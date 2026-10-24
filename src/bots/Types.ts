import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

type WoContainer        = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;

export interface ScoreAndAction {
    score   : number;
    action  : WoContainer;
}
