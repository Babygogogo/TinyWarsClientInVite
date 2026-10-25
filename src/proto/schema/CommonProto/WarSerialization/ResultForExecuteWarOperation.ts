import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WoContainer as $Message$CommonProto$WarOperation$WoContainer, type WoContainerJson as $Json$CommonProto$WarOperation$WoContainer } from "../WarOperation/WoContainer.js";
import { HalfwayData as $Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData, type HalfwayDataJson as $Json$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData } from "./ResultForExecuteWarOperation/HalfwayData.js";

export interface ResultForExecuteWarOperationJson extends $ProtoSchemaJsonBase {
    executedAction?: $Json$CommonProto$WarOperation$WoContainer | null | undefined;
    halfwayDataArray: $Json$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData[];
}

export class ResultForExecuteWarOperation extends $ProtoSchemaBase {
    private _executedAction?: $Message$CommonProto$WarOperation$WoContainer | null | undefined;
    private _halfwayDataArray: $Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData[] = [];

    public static fromJson(obj: ResultForExecuteWarOperationJson): ResultForExecuteWarOperation {
        return new ResultForExecuteWarOperation().loadJson(obj);
    }
    public override loadJson(obj: ResultForExecuteWarOperationJson): this {
        this.setExecutedAction(obj.executedAction != null ? $Message$CommonProto$WarOperation$WoContainer.fromJson(obj.executedAction) : null);
        this.setHalfwayDataArray(obj.halfwayDataArray?.map(v => $Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: ResultForExecuteWarOperationJson): ResultForExecuteWarOperationJson {
        obj ??= ({} as ResultForExecuteWarOperationJson);

        {
            const value = this.getExecutedAction();
            (value != null) && (obj.executedAction = value.toJson());
        }

        {
            obj.halfwayDataArray = this.getHalfwayDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getExecutedAction();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getHalfwayDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ResultForExecuteWarOperation {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ResultForExecuteWarOperation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExecutedAction($Message$CommonProto$WarOperation$WoContainer.decode(reader, reader.uint32()));
                    break;

                case 2:
                    {
                        const arr = msg._halfwayDataArray;
                        arr.push($Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ResultForExecuteWarOperation {
        return ResultForExecuteWarOperation.decode(this.encode());
    }

    public override getSchemaName(): "ResultForExecuteWarOperation" {
        return "ResultForExecuteWarOperation";
    }

    public checkHasExecutedAction(): boolean {
        return this._executedAction != null;
    }
    public getExecutedAction(): $Message$CommonProto$WarOperation$WoContainer | null | undefined {
        return this._executedAction;
    }
    public setExecutedAction(value: $Message$CommonProto$WarOperation$WoContainer | null | undefined): void {
        this._executedAction = value;
    }
    public createIfNotExistsExecutedAction(): $Message$CommonProto$WarOperation$WoContainer {
        return this._executedAction ??= new $Message$CommonProto$WarOperation$WoContainer();
    }

    public getHalfwayDataArray(): $Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData[] {
        return this._halfwayDataArray;
    }
    public setHalfwayDataArray(value: $Message$CommonProto$WarSerialization$ResultForExecuteWarOperation$HalfwayData[]): void {
        this._halfwayDataArray = value;
    }
}
