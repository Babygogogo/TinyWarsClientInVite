import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { TaskObjective as $Message$CommonProto$TaskObjectives$TaskObjective, type TaskObjectiveJson as $Json$CommonProto$TaskObjectives$TaskObjective } from "./TaskObjective.js";

export interface TaskObjectiveFullDataJson extends $ProtoSchemaJsonBase {
    taskObjectiveArray: $Json$CommonProto$TaskObjectives$TaskObjective[];
}

export class TaskObjectiveFullData extends $ProtoSchemaBase {
    private _taskObjectiveArray: $Message$CommonProto$TaskObjectives$TaskObjective[] = [];

    public static fromJson(obj: TaskObjectiveFullDataJson): TaskObjectiveFullData {
        return new TaskObjectiveFullData().loadJson(obj);
    }
    public override loadJson(obj: TaskObjectiveFullDataJson): this {
        this.setTaskObjectiveArray(obj.taskObjectiveArray?.map(v => $Message$CommonProto$TaskObjectives$TaskObjective.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: TaskObjectiveFullDataJson): TaskObjectiveFullDataJson {
        obj ??= ({} as TaskObjectiveFullDataJson);

        {
            obj.taskObjectiveArray = this.getTaskObjectiveArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTaskObjectiveArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TaskObjectiveFullData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TaskObjectiveFullData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._taskObjectiveArray;
                        arr.push($Message$CommonProto$TaskObjectives$TaskObjective.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TaskObjectiveFullData {
        return TaskObjectiveFullData.decode(this.encode());
    }

    public override getSchemaName(): "TaskObjectiveFullData" {
        return "TaskObjectiveFullData";
    }

    public getTaskObjectiveArray(): $Message$CommonProto$TaskObjectives$TaskObjective[] {
        return this._taskObjectiveArray;
    }
    public setTaskObjectiveArray(value: $Message$CommonProto$TaskObjectives$TaskObjective[]): void {
        this._taskObjectiveArray = value;
    }
}
