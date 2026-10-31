import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SinglePlayerModeJson extends $ProtoSchemaJsonBase {
}

export class SinglePlayerMode extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: SinglePlayerModeJson): SinglePlayerMode {
        return new SinglePlayerMode().loadJson(obj);
    }
    public override loadJson(_obj: SinglePlayerModeJson): this {
        return this;
    }
    public override toJson(obj?: SinglePlayerModeJson): SinglePlayerModeJson {
        obj ??= ({} as SinglePlayerModeJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SinglePlayerMode {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SinglePlayerMode();
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

    public override clone(): SinglePlayerMode {
        return SinglePlayerMode.decode(this.encode());
    }

    public override getSchemaName(): "SinglePlayerMode" {
        return "SinglePlayerMode";
    }

    // No member data accessors.
}
