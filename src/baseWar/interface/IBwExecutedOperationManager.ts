import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type {
    WoContainer as ProtoSchemaCommonProtoWarOperationWoContainer,
} from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type {
    SerialExecutedOperationManager as ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager,
} from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";

type WoContainer                    = ProtoSchemaCommonProtoWarOperationWoContainer;
type SerialExecutedOperationManager = ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager;

export interface IBwExecutedOperationManager {
    init({ isNeedExecutedOperations, data }: {
        isNeedExecutedOperations    : boolean;
        data                        : Undefinable<SerialExecutedOperationManager>;
    }): void;
    fastInit(data: Undefinable<SerialExecutedOperationManager>): void;

    serialize(): SerialExecutedOperationManager;
    serializeForSrwValidation(): SerialExecutedOperationManager;
    serializeForCawValidation(): SerialExecutedOperationManager;
    serializeForReplayCheckpoint(): SerialExecutedOperationManager;

    setExecutedOperationsCount(count: number): void;
    getExecutedOperationsCount(): number;
    tickExecutedOperationsCount(): void;

    getAllExecutedOperationArray(): WoContainer[];

    getExecutedOperation(operationId: number): WoContainer | null;
    getLastExecutedOperation(): Undefinable<WoContainer>;
    addExecutedOperation(rawOperation: WoContainer): void;
}
