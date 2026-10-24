import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";

type WoContainer                    = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;
type SerialExecutedOperationManager = ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager;

export interface IBwExecutedOperationManager {
    init({ isNeedExecutedOperations, data }: {
        isNeedExecutedOperations    : boolean;
        data                        : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialExecutedOperationManager>;
    }): void;
    fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialExecutedOperationManager>): void;

    serialize(): SerialExecutedOperationManager;
    serializeForSrwValidation(): SerialExecutedOperationManager;
    serializeForCawValidation(): SerialExecutedOperationManager;
    serializeForReplayCheckpoint(): SerialExecutedOperationManager;

    setExecutedOperationsCount(count: number): void;
    getExecutedOperationsCount(): number;
    tickExecutedOperationsCount(): void;

    getAllExecutedOperationArray(): WoContainer[];

    getExecutedOperation(operationId: number): WoContainer | null;
    getLastExecutedOperation(): AuxiliaryTypesAuxiliaryTypes.Undefinable<WoContainer>;
    addExecutedOperation(rawOperation: WoContainer): void;
}
