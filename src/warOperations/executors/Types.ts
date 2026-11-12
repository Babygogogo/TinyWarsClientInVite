import type { AuxiliaryTypes_ChangedThingsForWarOperation } from "../../internal";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer";

export type ExecutionResultForInnerWarOperation = (
    extraChangedThings  : AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation,
    operationId         : number,
) => Map<number, WoContainer>;
