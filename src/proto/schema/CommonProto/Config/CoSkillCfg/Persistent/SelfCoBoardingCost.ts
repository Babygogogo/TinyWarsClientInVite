import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfCoBoardingCostJson extends $ProtoSchemaJsonBase {
    multiplierPct?: number | null | undefined;
}

export class SelfCoBoardingCost extends $ProtoSchemaBase {
    private _multiplierPct?: number | null | undefined;

    public static fromJson(obj: SelfCoBoardingCostJson): SelfCoBoardingCost {
        return new SelfCoBoardingCost().loadJson(obj);
    }
    public override loadJson(obj: SelfCoBoardingCostJson): this {
        this.setMultiplierPct(obj.multiplierPct);
        return this;
    }
    public override toJson(obj?: SelfCoBoardingCostJson): SelfCoBoardingCostJson {
        obj ??= ({} as SelfCoBoardingCostJson);

        {
            const value = this.getMultiplierPct();
            (value != null) && (obj.multiplierPct = value);
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfCoBoardingCost {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfCoBoardingCost();
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

    public override clone(): SelfCoBoardingCost {
        return SelfCoBoardingCost.decode(this.encode());
    }

    public override getSchemaName(): "SelfCoBoardingCost" {
        return "SelfCoBoardingCost";
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
}
