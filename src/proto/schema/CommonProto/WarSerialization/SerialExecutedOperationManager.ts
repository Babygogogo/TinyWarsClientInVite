import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WoContainer as $Message$CommonProto$WarOperation$WoContainer, type WoContainerJson as $Json$CommonProto$WarOperation$WoContainer } from "../WarOperation/WoContainer.js";
import { HalfwayReplayOperation as $Message$CommonProto$WarSerialization$HalfwayReplayOperation, type HalfwayReplayOperationJson as $Json$CommonProto$WarSerialization$HalfwayReplayOperation } from "./HalfwayReplayOperation.js";

export interface SerialExecutedOperationManagerJson extends $ProtoSchemaJsonBase {
    executedOperationsCount?: number | null | undefined;
    executedOperationArray: $Json$CommonProto$WarOperation$WoContainer[];
    halfwayReplayOperationArray: $Json$CommonProto$WarSerialization$HalfwayReplayOperation[];
}

export class SerialExecutedOperationManager extends $ProtoSchemaBase {
    private _executedOperationsCount?: number | null | undefined;
    private _executedOperationArray: $Message$CommonProto$WarOperation$WoContainer[] = [];
    private _halfwayReplayOperationArray: $Message$CommonProto$WarSerialization$HalfwayReplayOperation[] = [];

    public static fromJson(obj: SerialExecutedOperationManagerJson): SerialExecutedOperationManager {
        return new SerialExecutedOperationManager().loadJson(obj);
    }
    public override loadJson(obj: SerialExecutedOperationManagerJson): this {
        this.setExecutedOperationsCount(obj.executedOperationsCount);
        this.setExecutedOperationArray(obj.executedOperationArray?.map(v => $Message$CommonProto$WarOperation$WoContainer.fromJson(v)) ?? []);
        this.setHalfwayReplayOperationArray(obj.halfwayReplayOperationArray?.map(v => $Message$CommonProto$WarSerialization$HalfwayReplayOperation.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialExecutedOperationManagerJson): SerialExecutedOperationManagerJson {
        obj ??= ({} as SerialExecutedOperationManagerJson);

        {
            const value = this.getExecutedOperationsCount();
            (value != null) && (obj.executedOperationsCount = value);
        }

        {
            obj.executedOperationArray = this.getExecutedOperationArray().map(v => v.toJson());
        }

        {
            obj.halfwayReplayOperationArray = this.getHalfwayReplayOperationArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getExecutedOperationsCount();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExecutedOperationArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getHalfwayReplayOperationArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialExecutedOperationManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialExecutedOperationManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExecutedOperationsCount(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._executedOperationArray;
                        arr.push($Message$CommonProto$WarOperation$WoContainer.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    {
                        const arr = msg._halfwayReplayOperationArray;
                        arr.push($Message$CommonProto$WarSerialization$HalfwayReplayOperation.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialExecutedOperationManager {
        return SerialExecutedOperationManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialExecutedOperationManager" {
        return "SerialExecutedOperationManager";
    }

    public checkHasExecutedOperationsCount(): boolean {
        return this._executedOperationsCount != null;
    }
    public getExecutedOperationsCount(): number | null | undefined {
        return this._executedOperationsCount;
    }
    public setExecutedOperationsCount(value: number | null | undefined): void {
        this._executedOperationsCount = value;
    }

    public getExecutedOperationArray(): $Message$CommonProto$WarOperation$WoContainer[] {
        return this._executedOperationArray;
    }
    public setExecutedOperationArray(value: $Message$CommonProto$WarOperation$WoContainer[]): void {
        this._executedOperationArray = value;
    }

    public getHalfwayReplayOperationArray(): $Message$CommonProto$WarSerialization$HalfwayReplayOperation[] {
        return this._halfwayReplayOperationArray;
    }
    public setHalfwayReplayOperationArray(value: $Message$CommonProto$WarSerialization$HalfwayReplayOperation[]): void {
        this._halfwayReplayOperationArray = value;
    }
}
