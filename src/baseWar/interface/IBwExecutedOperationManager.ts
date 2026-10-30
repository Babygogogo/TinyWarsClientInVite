import {
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { SerialExecutedOperationManager } from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";

export interface IBwExecutedOperationManager {
    init({ isNeedExecutedOperations, data }: {
        isNeedExecutedOperations    : boolean;
        data                        : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialExecutedOperationManager>;
    }): void;
    fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialExecutedOperationManager>): void;

    serialize(): SerialExecutedOperationManager;
    serializeForSrwValidation(): SerialExecutedOperationManager;
    serializeForCawValidation(): SerialExecutedOperationManager;
    serializeForReplayCheckpoint(): SerialExecutedOperationManager;

    setExecutedOperationsCount(count: number): void;
    getExecutedOperationsCount(): number;
    tickExecutedOperationsCount(): void;

    getAllExecutedOperationArray(): WoContainer[];

    getExecutedOperation(operationId: number): WoContainer | null;
    getLastExecutedOperation(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WoContainer>;
    addExecutedOperation(rawOperation: WoContainer): void;
}
