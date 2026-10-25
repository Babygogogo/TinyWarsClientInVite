import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MultiPlayerWarJson extends $ProtoSchemaJsonBase {
}

export class MultiPlayerWar extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: MultiPlayerWarJson): MultiPlayerWar {
        return new MultiPlayerWar().loadJson(obj);
    }
    public override loadJson(_obj: MultiPlayerWarJson): this {
        return this;
    }
    public override toJson(obj?: MultiPlayerWarJson): MultiPlayerWarJson {
        obj ??= ({} as MultiPlayerWarJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiPlayerWar {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiPlayerWar();
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

    public override clone(): MultiPlayerWar {
        return MultiPlayerWar.decode(this.encode());
    }

    public override getSchemaName(): "MultiPlayerWar" {
        return "MultiPlayerWar";
    }

    // No member data accessors.
}
