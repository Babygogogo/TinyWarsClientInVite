import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecExpressionJson extends $ProtoSchemaJsonBase {
    expression?: string | null | undefined;
}

export class WecExpression extends $ProtoSchemaBase {
    private _expression?: string | null | undefined;

    public static fromJson(obj: WecExpressionJson): WecExpression {
        return new WecExpression().loadJson(obj);
    }
    public override loadJson(obj: WecExpressionJson): this {
        this.setExpression(obj.expression);
        return this;
    }
    public override toJson(obj?: WecExpressionJson): WecExpressionJson {
        obj ??= ({} as WecExpressionJson);

        {
            const value = this.getExpression();
            (value != null) && (obj.expression = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getExpression();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecExpression {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecExpression();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExpression(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecExpression {
        return WecExpression.decode(this.encode());
    }

    public override getSchemaName(): "WecExpression" {
        return "WecExpression";
    }

    public checkHasExpression(): boolean {
        return this._expression != null;
    }
    public getExpression(): string | null | undefined {
        return this._expression;
    }
    public setExpression(value: string | null | undefined): void {
        this._expression = value;
    }
}
