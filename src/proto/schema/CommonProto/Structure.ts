import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface StructureJson extends $ProtoSchemaJsonBase {
}

export class Structure extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: StructureJson): Structure {
        return new Structure().loadJson(obj);
    }
    public override loadJson(_obj: StructureJson): this {
        return this;
    }
    public override toJson(obj?: StructureJson): StructureJson {
        obj ??= ({} as StructureJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Structure {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Structure();
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

    public override clone(): Structure {
        return Structure.decode(this.encode());
    }

    public override getSchemaName(): "Structure" {
        return "Structure";
    }

    // No member data accessors.
}
