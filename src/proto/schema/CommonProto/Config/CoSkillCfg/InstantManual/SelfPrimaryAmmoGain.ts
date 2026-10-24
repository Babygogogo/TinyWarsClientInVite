import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfPrimaryAmmoGainJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    gainPct?: number | null | undefined;
}

export class SelfPrimaryAmmoGain extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _gainPct?: number | null | undefined;

    public static fromJson(obj: SelfPrimaryAmmoGainJson): SelfPrimaryAmmoGain {
        return new SelfPrimaryAmmoGain().loadJson(obj);
    }
    public override loadJson(obj: SelfPrimaryAmmoGainJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setGainPct(obj.gainPct);
        return this;
    }
    public override toJson(obj?: SelfPrimaryAmmoGainJson): SelfPrimaryAmmoGainJson {
        obj ??= ({} as SelfPrimaryAmmoGainJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getGainPct();
            (value != null) && (obj.gainPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoSkillAreaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getGainPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfPrimaryAmmoGain {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfPrimaryAmmoGain();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setGainPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfPrimaryAmmoGain {
        return SelfPrimaryAmmoGain.decode(this.encode());
    }

    public override getSchemaName(): "SelfPrimaryAmmoGain" {
        return "SelfPrimaryAmmoGain";
    }

    public checkHasCoSkillAreaTypeId(): boolean {
        return this._coSkillAreaTypeId != null;
    }
    public getCoSkillAreaTypeId(): number {
        return this._coSkillAreaTypeId ?? 0;
    }
    public setCoSkillAreaTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coSkillAreaTypeId = null;
        } else {
            this._coSkillAreaTypeId = value;
        }
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number {
        return this._unitCategoryId ?? 0;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitCategoryId = null;
        } else {
            this._unitCategoryId = value;
        }
    }

    public checkHasGainPct(): boolean {
        return this._gainPct != null;
    }
    public getGainPct(): number {
        return this._gainPct ?? 0;
    }
    public setGainPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._gainPct = null;
        } else {
            this._gainPct = value;
        }
    }
}
