import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface TaskObjectivesJson extends $ProtoSchemaJsonBase {
}

export class TaskObjectives extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: TaskObjectivesJson): TaskObjectives {
        return new TaskObjectives().loadJson(obj);
    }
    public override loadJson(_obj: TaskObjectivesJson): this {
        return this;
    }
    public override toJson(obj?: TaskObjectivesJson): TaskObjectivesJson {
        obj ??= ({} as TaskObjectivesJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TaskObjectives {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TaskObjectives();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TaskObjectives {
        return TaskObjectives.decode(this.encode());
    }

    public override getSchemaName(): "TaskObjectives" {
        return "TaskObjectives";
    }

    // No member data accessors.
}
