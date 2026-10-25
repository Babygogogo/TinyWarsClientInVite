import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetCustomCountersJson extends $ProtoSchemaJsonBase {
    idExpression?: string | null | undefined;
    valueExpression?: string | null | undefined;
}

export class WeaSetCustomCounters extends $ProtoSchemaBase {
    private _idExpression?: string | null | undefined;
    private _valueExpression?: string | null | undefined;

    public static fromJson(obj: WeaSetCustomCountersJson): WeaSetCustomCounters {
        return new WeaSetCustomCounters().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomCountersJson): this {
        this.setIdExpression(obj.idExpression);
        this.setValueExpression(obj.valueExpression);
        return this;
    }
    public override toJson(obj?: WeaSetCustomCountersJson): WeaSetCustomCountersJson {
        obj ??= ({} as WeaSetCustomCountersJson);

        {
            const value = this.getIdExpression();
            (value != null) && (obj.idExpression = value);
        }

        {
            const value = this.getValueExpression();
            (value != null) && (obj.valueExpression = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIdExpression();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getValueExpression();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomCounters {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomCounters();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIdExpression(reader.string());
                    break;

                case 2:
                    msg.setValueExpression(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomCounters {
        return WeaSetCustomCounters.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomCounters" {
        return "WeaSetCustomCounters";
    }

    public checkHasIdExpression(): boolean {
        return this._idExpression != null;
    }
    public getIdExpression(): string | null | undefined {
        return this._idExpression;
    }
    public setIdExpression(value: string | null | undefined): void {
        this._idExpression = value;
    }

    public checkHasValueExpression(): boolean {
        return this._valueExpression != null;
    }
    public getValueExpression(): string | null | undefined {
        return this._valueExpression;
    }
    public setValueExpression(value: string | null | undefined): void {
        this._valueExpression = value;
    }
}
