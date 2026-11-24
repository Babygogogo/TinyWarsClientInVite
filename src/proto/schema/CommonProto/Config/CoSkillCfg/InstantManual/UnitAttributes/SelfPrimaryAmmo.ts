import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface SelfPrimaryAmmoJson extends $ProtoSchemaJsonBase {
    offsetPct?: number | null | undefined;
}

export class SelfPrimaryAmmo extends $ProtoSchemaBase {
    private _offsetPct?: number | null | undefined;

    public static fromJson(obj: SelfPrimaryAmmoJson): SelfPrimaryAmmo {
        return new SelfPrimaryAmmo().loadJson(obj);
    }
    public override loadJson(obj: SelfPrimaryAmmoJson): this {
        this.setOffsetPct(obj.offsetPct);
        return this;
    }
    public override toJson(obj?: SelfPrimaryAmmoJson): SelfPrimaryAmmoJson {
        obj ??= ({} as SelfPrimaryAmmoJson);

        {
            const value = this.getOffsetPct();
            (value != null) && (obj.offsetPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOffsetPct();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfPrimaryAmmo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfPrimaryAmmo();
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

    public override clone(): SelfPrimaryAmmo {
        return SelfPrimaryAmmo.decode(this.encode());
    }

    public override getSchemaName(): "SelfPrimaryAmmo" {
        return "SelfPrimaryAmmo";
    }

    public checkHasOffsetPct(): boolean {
        return this._offsetPct != null;
    }
    public getOffsetPct(): number | null | undefined {
        return this._offsetPct;
    }
    public setOffsetPct(value: number | null | undefined): void {
        this._offsetPct = value;
    }
}
