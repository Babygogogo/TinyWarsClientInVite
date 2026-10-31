import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WarEventJson extends $ProtoSchemaJsonBase {
}

export class WarEvent extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: WarEventJson): WarEvent {
        return new WarEvent().loadJson(obj);
    }
    public override loadJson(_obj: WarEventJson): this {
        return this;
    }
    public override toJson(obj?: WarEventJson): WarEventJson {
        obj ??= ({} as WarEventJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarEvent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarEvent();
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

    public override clone(): WarEvent {
        return WarEvent.decode(this.encode());
    }

    public override getSchemaName(): "WarEvent" {
        return "WarEvent";
    }

    // No member data accessors.
}
