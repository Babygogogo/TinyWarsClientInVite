import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface ChangeLogJson extends $ProtoSchemaJsonBase {
}

export class ChangeLog extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: ChangeLogJson): ChangeLog {
        return new ChangeLog().loadJson(obj);
    }
    public override loadJson(_obj: ChangeLogJson): this {
        return this;
    }
    public override toJson(obj?: ChangeLogJson): ChangeLogJson {
        obj ??= ({} as ChangeLogJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChangeLog {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChangeLog();
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

    public override clone(): ChangeLog {
        return ChangeLog.decode(this.encode());
    }

    public override getSchemaName(): "ChangeLog" {
        return "ChangeLog";
    }

    // No member data accessors.
}
