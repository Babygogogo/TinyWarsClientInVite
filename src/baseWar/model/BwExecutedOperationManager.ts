import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwExecutedOperationManager from "../interface/IBwExecutedOperationManager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";

export class BwExecutedOperationManager implements BaseWarInterfaceIBwExecutedOperationManager.IBwExecutedOperationManager {
    private _isNeedExecutedOperations?  : boolean;
    private _executedOperationArray?    : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[];
    private _executedOperationsCount    = 0;

    public init({ isNeedExecutedOperations, data }: {
        isNeedExecutedOperations    : boolean;
        data                        : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager>;
    }): void {
        this._setIsNeedExecutedOperations(isNeedExecutedOperations);

        const executedOperationArray = data?.getExecutedOperationArray() ?? [];
        this._setAllExecutedOperationArray(executedOperationArray);
        this.setExecutedOperationsCount(data?.getExecutedOperationsCount() ?? executedOperationArray.length);
    }
    public fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager>): void {
        const executedOperationArray = data?.getExecutedOperationArray() ?? [];
        this._setAllExecutedOperationArray(executedOperationArray);
        this.setExecutedOperationsCount(data?.getExecutedOperationsCount() ?? executedOperationArray.length);
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager {
        return ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager.fromJson({
            executedOperationArray      : this.getAllExecutedOperationArray().map(v => v.toJson()),
            executedOperationsCount     : this.getExecutedOperationsCount(),
            halfwayReplayOperationArray : [],
        });
    }
    public serializeForSrwValidation(): ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager {
        return ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager.fromJson({
            executedOperationArray      : this.getAllExecutedOperationArray().map(v => v.toJson()),
            executedOperationsCount     : null,
            halfwayReplayOperationArray : [],
        });
    }
    public serializeForCawValidation(): ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager {
        return ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager.fromJson({
            executedOperationArray      : this.getAllExecutedOperationArray().map(v => v.toJson()),
            executedOperationsCount     : null,
            halfwayReplayOperationArray : [],
        });
    }
    public serializeForReplayCheckpoint(): ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager {
        return ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager.fromJson({
            executedOperationArray      : [],
            executedOperationsCount     : this.getExecutedOperationsCount(),
            halfwayReplayOperationArray : [],
        });
    }

    private _setIsNeedExecutedOperations(isNeedReplay: boolean): void {
        this._isNeedExecutedOperations = isNeedReplay;
    }
    private _getIsNeedExecutedOperations(): boolean {
        return HelpersMisc.getExisted(this._isNeedExecutedOperations);
    }

    public setExecutedOperationsCount(count: number): void {
        this._executedOperationsCount = count;
    }
    public getExecutedOperationsCount(): number {
        return this._executedOperationsCount;
    }
    public tickExecutedOperationsCount(): void {
        ++this._executedOperationsCount;
    }

    private _setAllExecutedOperationArray(operations: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[]): void {
        this._executedOperationArray = operations;
    }
    public getAllExecutedOperationArray(): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[] {
        return HelpersMisc.getExisted(this._executedOperationArray);
    }

    public getExecutedOperation(operationId: number): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null {
        const array = this.getAllExecutedOperationArray();
        if (!array.length) {
            return null;
        }

        return array[operationId - (array[0].getOperationId() ?? 0)];
    }
    public getLastExecutedOperation(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer> {
        const arr = this.getAllExecutedOperationArray();
        if (arr == null) {
            return null;
        }

        return arr[arr.length - 1];
    }
    // public addExecutedOperation(rawOperation: IWoContainer): void {
        /** 目前存在一个bug，服务器是执行战局操作的具体顺序是操作数递增-执行操作-保存操作，与前端不同，会导致相关战局事件判定出错 */
    //     const executedOperationsCount = this.getExecutedOperationsCount();
    //     if (rawOperation.operationId !== executedOperationsCount) {
    //         throw Helpers.newError(`Invalid operationId: ${rawOperation.operationId}`);
    //     }

    //     this._setExecutedOperationsCount(executedOperationsCount + 1);

    //     if (this._getIsNeedExecutedOperations()) {
    //         this.getAllExecutedOperationArray().push(Helpers.deepClone(rawOperation));
    //     }
    // }
    public addExecutedOperation(rawOperation: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer): void {
        const executedOperationsCount   = this.getExecutedOperationsCount();
        const operationId               = rawOperation.getOperationId();
        if (operationId !== executedOperationsCount - 1) {
            throw HelpersMisc.newError(`Invalid operationId: ${operationId}, expected: ${executedOperationsCount}`);
        }

        if (this._getIsNeedExecutedOperations()) {
            this.getAllExecutedOperationArray().push(rawOperation.clone());
        }
    }
}
