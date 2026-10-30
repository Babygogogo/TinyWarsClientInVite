import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface MailJson extends $ProtoSchemaJsonBase {
}

export class Mail extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: MailJson): Mail {
        return new Mail().loadJson(obj);
    }
    public override loadJson(_obj: MailJson): this {
        return this;
    }
    public override toJson(obj?: MailJson): MailJson {
        obj ??= ({} as MailJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Mail {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Mail();
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

    public override clone(): Mail {
        return Mail.decode(this.encode());
    }

    public override getSchemaName(): "Mail" {
        return "Mail";
    }

    // No member data accessors.
}
