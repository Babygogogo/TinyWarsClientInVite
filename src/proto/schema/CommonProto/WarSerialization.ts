import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface WarSerializationJson extends $ProtoSchemaJsonBase {
}

export class WarSerialization extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: WarSerializationJson): WarSerialization {
        return new WarSerialization().loadJson(obj);
    }
    public override loadJson(_obj: WarSerializationJson): this {
        return this;
    }
    public override toJson(obj?: WarSerializationJson): WarSerializationJson {
        obj ??= ({} as WarSerializationJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarSerialization {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarSerialization();
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

    public override clone(): WarSerialization {
        return WarSerialization.decode(this.encode());
    }

    public override getSchemaName(): "WarSerialization" {
        return "WarSerialization";
    }

    // No member data accessors.
}
