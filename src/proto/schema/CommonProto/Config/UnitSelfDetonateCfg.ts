import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitSelfDetonateCfgJson extends $ProtoSchemaJsonBase {
    radius?: number | null | undefined;
    damage?: number | null | undefined;
}

export class UnitSelfDetonateCfg extends $ProtoSchemaBase {
    private _radius?: number | null | undefined;
    private _damage?: number | null | undefined;

    public static fromJson(obj: UnitSelfDetonateCfgJson): UnitSelfDetonateCfg {
        return new UnitSelfDetonateCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitSelfDetonateCfgJson): this {
        this.setRadius(obj.radius);
        this.setDamage(obj.damage);
        return this;
    }
    public override toJson(obj?: UnitSelfDetonateCfgJson): UnitSelfDetonateCfgJson {
        obj ??= ({} as UnitSelfDetonateCfgJson);

        {
            const value = this.getRadius();
            (value != null) && (obj.radius = value);
        }

        {
            const value = this.getDamage();
            (value != null) && (obj.damage = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRadius();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDamage();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitSelfDetonateCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitSelfDetonateCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRadius(reader.int32());
                    break;

                case 2:
                    msg.setDamage(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitSelfDetonateCfg {
        return UnitSelfDetonateCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitSelfDetonateCfg" {
        return "UnitSelfDetonateCfg";
    }

    public checkHasRadius(): boolean {
        return this._radius != null;
    }
    public getRadius(): number {
        return this._radius ?? 0;
    }
    public setRadius(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._radius = null;
        } else {
            this._radius = value;
        }
    }

    public checkHasDamage(): boolean {
        return this._damage != null;
    }
    public getDamage(): number {
        return this._damage ?? 0;
    }
    public setDamage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._damage = null;
        } else {
            this._damage = value;
        }
    }
}
