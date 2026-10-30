import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface ChatJson extends $ProtoSchemaJsonBase {
}

export class Chat extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: ChatJson): Chat {
        return new Chat().loadJson(obj);
    }
    public override loadJson(_obj: ChatJson): this {
        return this;
    }
    public override toJson(obj?: ChatJson): ChatJson {
        obj ??= ({} as ChatJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Chat {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Chat();
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

    public override clone(): Chat {
        return Chat.decode(this.encode());
    }

    public override getSchemaName(): "Chat" {
        return "Chat";
    }

    // No member data accessors.
}
