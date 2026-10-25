import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WarOperationJson extends $ProtoSchemaJsonBase {
}

export class WarOperation extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: WarOperationJson): WarOperation {
        return new WarOperation().loadJson(obj);
    }
    public override loadJson(_obj: WarOperationJson): this {
        return this;
    }
    public override toJson(obj?: WarOperationJson): WarOperationJson {
        obj ??= ({} as WarOperationJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarOperation {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarOperation();
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

    public override clone(): WarOperation {
        return WarOperation.decode(this.encode());
    }

    public override getSchemaName(): "WarOperation" {
        return "WarOperation";
    }

    // No member data accessors.
}
