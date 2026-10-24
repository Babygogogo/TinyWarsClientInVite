import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigJson extends $ProtoSchemaJsonBase {
}

export class Config extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: ConfigJson): Config {
        return new Config().loadJson(obj);
    }
    public override loadJson(_obj: ConfigJson): this {
        return this;
    }
    public override toJson(obj?: ConfigJson): ConfigJson {
        obj ??= ({} as ConfigJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Config {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Config();
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

    public override clone(): Config {
        return Config.decode(this.encode());
    }

    public override getSchemaName(): "Config" {
        return "Config";
    }

    // No member data accessors.
}
