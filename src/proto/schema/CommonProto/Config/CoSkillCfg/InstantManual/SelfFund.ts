import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfFundJson extends $ProtoSchemaJsonBase {
    multiplierPct?: number | null | undefined;
    offset?: number | null | undefined;
    incomeConversionPct?: number | null | undefined;
}

export class SelfFund extends $ProtoSchemaBase {
    private _multiplierPct?: number | null | undefined;
    private _offset?: number | null | undefined;
    private _incomeConversionPct?: number | null | undefined;

    public static fromJson(obj: SelfFundJson): SelfFund {
        return new SelfFund().loadJson(obj);
    }
    public override loadJson(obj: SelfFundJson): this {
        this.setMultiplierPct(obj.multiplierPct);
        this.setOffset(obj.offset);
        this.setIncomeConversionPct(obj.incomeConversionPct);
        return this;
    }
    public override toJson(obj?: SelfFundJson): SelfFundJson {
        obj ??= ({} as SelfFundJson);

        {
            const value = this.getMultiplierPct();
            (value != null) && (obj.multiplierPct = value);
        }

        {
            const value = this.getOffset();
            (value != null) && (obj.offset = value);
        }

        {
            const value = this.getIncomeConversionPct();
            (value != null) && (obj.incomeConversionPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getIncomeConversionPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfFund {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfFund();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMultiplierPct(reader.int32());
                    break;

                case 2:
                    msg.setOffset(reader.int32());
                    break;

                case 3:
                    msg.setIncomeConversionPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfFund {
        return SelfFund.decode(this.encode());
    }

    public override getSchemaName(): "SelfFund" {
        return "SelfFund";
    }

    public checkHasMultiplierPct(): boolean {
        return this._multiplierPct != null;
    }
    public getMultiplierPct(): number {
        return this._multiplierPct ?? 0;
    }
    public setMultiplierPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._multiplierPct = null;
        } else {
            this._multiplierPct = value;
        }
    }

    public checkHasOffset(): boolean {
        return this._offset != null;
    }
    public getOffset(): number {
        return this._offset ?? 0;
    }
    public setOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offset = null;
        } else {
            this._offset = value;
        }
    }

    public checkHasIncomeConversionPct(): boolean {
        return this._incomeConversionPct != null;
    }
    public getIncomeConversionPct(): number {
        return this._incomeConversionPct ?? 0;
    }
    public setIncomeConversionPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._incomeConversionPct = null;
        } else {
            this._incomeConversionPct = value;
        }
    }
}
