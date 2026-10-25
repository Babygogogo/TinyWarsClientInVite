import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DamageChartCfgJson extends $ProtoSchemaJsonBase {
    attackerUnitTypeId?: number | null | undefined;
    armorTypeId?: number | null | undefined;
    unitWeaponTypeId?: number | null | undefined;
    damage?: number | null | undefined;
}

export class DamageChartCfg extends $ProtoSchemaBase {
    private _attackerUnitTypeId?: number | null | undefined;
    private _armorTypeId?: number | null | undefined;
    private _unitWeaponTypeId?: number | null | undefined;
    private _damage?: number | null | undefined;

    public static fromJson(obj: DamageChartCfgJson): DamageChartCfg {
        return new DamageChartCfg().loadJson(obj);
    }
    public override loadJson(obj: DamageChartCfgJson): this {
        this.setAttackerUnitTypeId(obj.attackerUnitTypeId);
        this.setArmorTypeId(obj.armorTypeId);
        this.setUnitWeaponTypeId(obj.unitWeaponTypeId);
        this.setDamage(obj.damage);
        return this;
    }
    public override toJson(obj?: DamageChartCfgJson): DamageChartCfgJson {
        obj ??= ({} as DamageChartCfgJson);

        {
            const value = this.getAttackerUnitTypeId();
            (value != null) && (obj.attackerUnitTypeId = value);
        }

        {
            const value = this.getArmorTypeId();
            (value != null) && (obj.armorTypeId = value);
        }

        {
            const value = this.getUnitWeaponTypeId();
            (value != null) && (obj.unitWeaponTypeId = value);
        }

        {
            const value = this.getDamage();
            (value != null) && (obj.damage = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getAttackerUnitTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getArmorTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUnitWeaponTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getDamage();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DamageChartCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DamageChartCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setAttackerUnitTypeId(reader.int32());
                    break;

                case 2:
                    msg.setArmorTypeId(reader.int32());
                    break;

                case 3:
                    msg.setUnitWeaponTypeId(reader.int32());
                    break;

                case 4:
                    msg.setDamage(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DamageChartCfg {
        return DamageChartCfg.decode(this.encode());
    }

    public override getSchemaName(): "DamageChartCfg" {
        return "DamageChartCfg";
    }

    public checkHasAttackerUnitTypeId(): boolean {
        return this._attackerUnitTypeId != null;
    }
    public getAttackerUnitTypeId(): number {
        return this._attackerUnitTypeId ?? 0;
    }
    public setAttackerUnitTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._attackerUnitTypeId = null;
        } else {
            this._attackerUnitTypeId = value;
        }
    }

    public checkHasArmorTypeId(): boolean {
        return this._armorTypeId != null;
    }
    public getArmorTypeId(): number {
        return this._armorTypeId ?? 0;
    }
    public setArmorTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._armorTypeId = null;
        } else {
            this._armorTypeId = value;
        }
    }

    public checkHasUnitWeaponTypeId(): boolean {
        return this._unitWeaponTypeId != null;
    }
    public getUnitWeaponTypeId(): number {
        return this._unitWeaponTypeId ?? 0;
    }
    public setUnitWeaponTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitWeaponTypeId = null;
        } else {
            this._unitWeaponTypeId = value;
        }
    }

    public checkHasDamage(): boolean {
        return this._damage != null;
    }
    public getDamage(): number | null | undefined {
        return this._damage;
    }
    public setDamage(value: number | null | undefined): void {
        this._damage = value;
    }
}
