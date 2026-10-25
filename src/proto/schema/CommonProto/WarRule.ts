import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WarRuleJson extends $ProtoSchemaJsonBase {
}

export class WarRule extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: WarRuleJson): WarRule {
        return new WarRule().loadJson(obj);
    }
    public override loadJson(_obj: WarRuleJson): this {
        return this;
    }
    public override toJson(obj?: WarRuleJson): WarRuleJson {
        obj ??= ({} as WarRuleJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarRule();
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

    public override clone(): WarRule {
        return WarRule.decode(this.encode());
    }

    public override getSchemaName(): "WarRule" {
        return "WarRule";
    }

    // No member data accessors.
}
