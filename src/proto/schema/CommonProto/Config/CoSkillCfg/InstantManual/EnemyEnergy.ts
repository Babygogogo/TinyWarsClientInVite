import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface EnemyEnergyJson extends $ProtoSchemaJsonBase {
    funcConversionPct?: number | null | undefined;
    offsetPct?: number | null | undefined;
}

export class EnemyEnergy extends $ProtoSchemaBase {
    private _funcConversionPct?: number | null | undefined;
    private _offsetPct?: number | null | undefined;

    public static fromJson(obj: EnemyEnergyJson): EnemyEnergy {
        return new EnemyEnergy().loadJson(obj);
    }
    public override loadJson(obj: EnemyEnergyJson): this {
        this.setFuncConversionPct(obj.funcConversionPct);
        this.setOffsetPct(obj.offsetPct);
        return this;
    }
    public override toJson(obj?: EnemyEnergyJson): EnemyEnergyJson {
        obj ??= ({} as EnemyEnergyJson);

        {
            const value = this.getFuncConversionPct();
            (value != null) && (obj.funcConversionPct = value);
        }

        {
            const value = this.getOffsetPct();
            (value != null) && (obj.offsetPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getFuncConversionPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getOffsetPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): EnemyEnergy {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new EnemyEnergy();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setFuncConversionPct(reader.int32());
                    break;

                case 2:
                    msg.setOffsetPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): EnemyEnergy {
        return EnemyEnergy.decode(this.encode());
    }

    public override getSchemaName(): "EnemyEnergy" {
        return "EnemyEnergy";
    }

    public checkHasFuncConversionPct(): boolean {
        return this._funcConversionPct != null;
    }
    public getFuncConversionPct(): number {
        return this._funcConversionPct ?? 0;
    }
    public setFuncConversionPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._funcConversionPct = null;
        } else {
            this._funcConversionPct = value;
        }
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
