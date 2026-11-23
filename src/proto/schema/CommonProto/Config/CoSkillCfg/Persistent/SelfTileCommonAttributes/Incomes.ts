import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface IncomesJson extends $ProtoSchemaJsonBase {
    multiplierPct?: number | null | undefined;
}

export class Incomes extends $ProtoSchemaBase {
    private _multiplierPct?: number | null | undefined;

    public static fromJson(obj: IncomesJson): Incomes {
        return new Incomes().loadJson(obj);
    }
    public override loadJson(obj: IncomesJson): this {
        this.setMultiplierPct(obj.multiplierPct);
        return this;
    }
    public override toJson(obj?: IncomesJson): IncomesJson {
        obj ??= ({} as IncomesJson);

        {
            const value = this.getMultiplierPct();
            (value != null) && (obj.multiplierPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMultiplierPct();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Incomes {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Incomes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMultiplierPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Incomes {
        return Incomes.decode(this.encode());
    }

    public override getSchemaName(): "Incomes" {
        return "Incomes";
    }

    public checkHasMultiplierPct(): boolean {
        return this._multiplierPct != null;
    }
    public getMultiplierPct(): number | null | undefined {
        return this._multiplierPct;
    }
    public setMultiplierPct(value: number | null | undefined): void {
        this._multiplierPct = value;
    }
}
