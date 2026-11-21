import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface CaptureAmountsJson extends $ProtoSchemaJsonBase {
    offsetPct?: number | null | undefined;
}

export class CaptureAmounts extends $ProtoSchemaBase {
    private _offsetPct?: number | null | undefined;

    public static fromJson(obj: CaptureAmountsJson): CaptureAmounts {
        return new CaptureAmounts().loadJson(obj);
    }
    public override loadJson(obj: CaptureAmountsJson): this {
        this.setOffsetPct(obj.offsetPct);
        return this;
    }
    public override toJson(obj?: CaptureAmountsJson): CaptureAmountsJson {
        obj ??= ({} as CaptureAmountsJson);

        {
            const value = this.getOffsetPct();
            (value != null) && (obj.offsetPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOffsetPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CaptureAmounts {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CaptureAmounts();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setOffsetPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CaptureAmounts {
        return CaptureAmounts.decode(this.encode());
    }

    public override getSchemaName(): "CaptureAmounts" {
        return "CaptureAmounts";
    }

    public checkHasOffsetPct(): boolean {
        return this._offsetPct != null;
    }
    public getOffsetPct(): number {
        return this._offsetPct ?? 0;
    }
    public setOffsetPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPct = null;
        } else {
            this._offsetPct = value;
        }
    }
}
