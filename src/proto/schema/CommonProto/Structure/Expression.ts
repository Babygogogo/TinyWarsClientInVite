import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExpressionJson extends $ProtoSchemaJsonBase {
}

export class Expression extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: ExpressionJson): Expression {
        return new Expression().loadJson(obj);
    }
    public override loadJson(_obj: ExpressionJson): this {
        return this;
    }
    public override toJson(obj?: ExpressionJson): ExpressionJson {
        obj ??= ({} as ExpressionJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Expression {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Expression();
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

    public override clone(): Expression {
        return Expression.decode(this.encode());
    }

    public override getSchemaName(): "Expression" {
        return "Expression";
    }

    // No member data accessors.
}
