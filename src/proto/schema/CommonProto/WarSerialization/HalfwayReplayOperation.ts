import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WoContainer as $Message$CommonProto$WarOperation$WoContainer, type WoContainerJson as $Json$CommonProto$WarOperation$WoContainer } from "../WarOperation/WoContainer.js";

export interface HalfwayReplayOperationJson extends $ProtoSchemaJsonBase {
    teamIndex?: number | null | undefined;
    operationArray: $Json$CommonProto$WarOperation$WoContainer[];
}

export class HalfwayReplayOperation extends $ProtoSchemaBase {
    private _teamIndex?: number | null | undefined;
    private _operationArray: $Message$CommonProto$WarOperation$WoContainer[] = [];

    public static fromJson(obj: HalfwayReplayOperationJson): HalfwayReplayOperation {
        return new HalfwayReplayOperation().loadJson(obj);
    }
    public override loadJson(obj: HalfwayReplayOperationJson): this {
        this.setTeamIndex(obj.teamIndex);
        this.setOperationArray(obj.operationArray?.map(v => $Message$CommonProto$WarOperation$WoContainer.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: HalfwayReplayOperationJson): HalfwayReplayOperationJson {
        obj ??= ({} as HalfwayReplayOperationJson);

        {
            const value = this.getTeamIndex();
            (value != null) && (obj.teamIndex = value);
        }

        {
            obj.operationArray = this.getOperationArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTeamIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getOperationArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): HalfwayReplayOperation {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new HalfwayReplayOperation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTeamIndex(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._operationArray;
                        arr.push($Message$CommonProto$WarOperation$WoContainer.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): HalfwayReplayOperation {
        return HalfwayReplayOperation.decode(this.encode());
    }

    public override getSchemaName(): "HalfwayReplayOperation" {
        return "HalfwayReplayOperation";
    }

    public checkHasTeamIndex(): boolean {
        return this._teamIndex != null;
    }
    public getTeamIndex(): number {
        return this._teamIndex ?? 0;
    }
    public setTeamIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._teamIndex = null;
        } else {
            this._teamIndex = value;
        }
    }

    public getOperationArray(): $Message$CommonProto$WarOperation$WoContainer[] {
        return this._operationArray;
    }
    public setOperationArray(value: $Message$CommonProto$WarOperation$WoContainer[]): void {
        this._operationArray = value;
    }
}
