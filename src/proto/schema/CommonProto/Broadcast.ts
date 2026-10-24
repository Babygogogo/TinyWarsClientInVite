import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BroadcastJson extends $ProtoSchemaJsonBase {
}

export class Broadcast extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: BroadcastJson): Broadcast {
        return new Broadcast().loadJson(obj);
    }
    public override loadJson(_obj: BroadcastJson): this {
        return this;
    }
    public override toJson(obj?: BroadcastJson): BroadcastJson {
        obj ??= ({} as BroadcastJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Broadcast {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Broadcast();
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

    public override clone(): Broadcast {
        return Broadcast.decode(this.encode());
    }

    public override getSchemaName(): "Broadcast" {
        return "Broadcast";
    }

    // No member data accessors.
}
