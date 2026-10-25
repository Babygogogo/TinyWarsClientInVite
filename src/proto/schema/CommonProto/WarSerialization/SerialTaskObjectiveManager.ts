import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { TaskObjectiveState as $Message$CommonProto$TaskObjectives$TaskObjectiveState, type TaskObjectiveStateJson as $Json$CommonProto$TaskObjectives$TaskObjectiveState } from "../TaskObjectives/TaskObjectiveState.js";

export interface SerialTaskObjectiveManagerJson extends $ProtoSchemaJsonBase {
    stateArray: $Json$CommonProto$TaskObjectives$TaskObjectiveState[];
}

export class SerialTaskObjectiveManager extends $ProtoSchemaBase {
    private _stateArray: $Message$CommonProto$TaskObjectives$TaskObjectiveState[] = [];

    public static fromJson(obj: SerialTaskObjectiveManagerJson): SerialTaskObjectiveManager {
        return new SerialTaskObjectiveManager().loadJson(obj);
    }
    public override loadJson(obj: SerialTaskObjectiveManagerJson): this {
        this.setStateArray(obj.stateArray?.map(v => $Message$CommonProto$TaskObjectives$TaskObjectiveState.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialTaskObjectiveManagerJson): SerialTaskObjectiveManagerJson {
        obj ??= ({} as SerialTaskObjectiveManagerJson);

        {
            obj.stateArray = this.getStateArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getStateArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialTaskObjectiveManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialTaskObjectiveManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._stateArray;
                        arr.push($Message$CommonProto$TaskObjectives$TaskObjectiveState.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialTaskObjectiveManager {
        return SerialTaskObjectiveManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialTaskObjectiveManager" {
        return "SerialTaskObjectiveManager";
    }

    public getStateArray(): $Message$CommonProto$TaskObjectives$TaskObjectiveState[] {
        return this._stateArray;
    }
    public setStateArray(value: $Message$CommonProto$TaskObjectives$TaskObjectiveState[]): void {
        this._stateArray = value;
    }
}
