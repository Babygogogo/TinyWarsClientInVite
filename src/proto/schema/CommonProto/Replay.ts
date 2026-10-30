import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface ReplayJson extends $ProtoSchemaJsonBase {
}

export class Replay extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: ReplayJson): Replay {
        return new Replay().loadJson(obj);
    }
    public override loadJson(_obj: ReplayJson): this {
        return this;
    }
    public override toJson(obj?: ReplayJson): ReplayJson {
        obj ??= ({} as ReplayJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Replay {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Replay();
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

    public override clone(): Replay {
        return Replay.decode(this.encode());
    }

    public override getSchemaName(): "Replay" {
        return "Replay";
    }

    // No member data accessors.
}
