import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NetMessageJson extends $ProtoSchemaJsonBase {
}

export class NetMessage extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: NetMessageJson): NetMessage {
        return new NetMessage().loadJson(obj);
    }
    public override loadJson(_obj: NetMessageJson): this {
        return this;
    }
    public override toJson(obj?: NetMessageJson): NetMessageJson {
        obj ??= ({} as NetMessageJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NetMessage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NetMessage();
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

    public override clone(): NetMessage {
        return NetMessage.decode(this.encode());
    }

    public override getSchemaName(): "NetMessage" {
        return "NetMessage";
    }

    // No member data accessors.
}
