import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface SelfHpJson extends $ProtoSchemaJsonBase {
    regularHpOffset?: number | null | undefined;
    costMultiplierPct?: number | null | undefined;
}

export class SelfHp extends $ProtoSchemaBase {
    private _regularHpOffset?: number | null | undefined;
    private _costMultiplierPct?: number | null | undefined;

    public static fromJson(obj: SelfHpJson): SelfHp {
        return new SelfHp().loadJson(obj);
    }
    public override loadJson(obj: SelfHpJson): this {
        this.setRegularHpOffset(obj.regularHpOffset);
        this.setCostMultiplierPct(obj.costMultiplierPct);
        return this;
    }
    public override toJson(obj?: SelfHpJson): SelfHpJson {
        obj ??= ({} as SelfHpJson);

        {
            const value = this.getRegularHpOffset();
            (value != null) && (obj.regularHpOffset = value);
        }

        {
            const value = this.getCostMultiplierPct();
            (value != null) && (obj.costMultiplierPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRegularHpOffset();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCostMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfHp {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfHp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRegularHpOffset(reader.int32());
                    break;

                case 2:
                    msg.setCostMultiplierPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfHp {
        return SelfHp.decode(this.encode());
    }

    public override getSchemaName(): "SelfHp" {
        return "SelfHp";
    }

    public checkHasRegularHpOffset(): boolean {
        return this._regularHpOffset != null;
    }
    public getRegularHpOffset(): number | null | undefined {
        return this._regularHpOffset;
    }
    public setRegularHpOffset(value: number | null | undefined): void {
        this._regularHpOffset = value;
    }

    public checkHasCostMultiplierPct(): boolean {
        return this._costMultiplierPct != null;
    }
    public getCostMultiplierPct(): number {
        return this._costMultiplierPct ?? 0;
    }
    public setCostMultiplierPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._costMultiplierPct = null;
        } else {
            this._costMultiplierPct = value;
        }
    }
}
