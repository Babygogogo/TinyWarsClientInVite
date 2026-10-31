import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WarSettingsJson extends $ProtoSchemaJsonBase {
}

export class WarSettings extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: WarSettingsJson): WarSettings {
        return new WarSettings().loadJson(obj);
    }
    public override loadJson(_obj: WarSettingsJson): this {
        return this;
    }
    public override toJson(obj?: WarSettingsJson): WarSettingsJson {
        obj ??= ({} as WarSettingsJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarSettings();
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

    public override clone(): WarSettings {
        return WarSettings.decode(this.encode());
    }

    public override getSchemaName(): "WarSettings" {
        return "WarSettings";
    }

    // No member data accessors.
}
