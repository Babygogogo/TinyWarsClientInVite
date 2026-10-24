import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfPrimaryAmmoRecoveryJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    ammoGainPct?: number | null | undefined;
    unitLoadedStateId?: number | null | undefined;
    timing?: number | null | undefined;
}

export class SelfPrimaryAmmoRecovery extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _ammoGainPct?: number | null | undefined;
    private _unitLoadedStateId?: number | null | undefined;
    private _timing?: number | null | undefined;

    public static fromJson(obj: SelfPrimaryAmmoRecoveryJson): SelfPrimaryAmmoRecovery {
        return new SelfPrimaryAmmoRecovery().loadJson(obj);
    }
    public override loadJson(obj: SelfPrimaryAmmoRecoveryJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setAmmoGainPct(obj.ammoGainPct);
        this.setUnitLoadedStateId(obj.unitLoadedStateId);
        this.setTiming(obj.timing);
        return this;
    }
    public override toJson(obj?: SelfPrimaryAmmoRecoveryJson): SelfPrimaryAmmoRecoveryJson {
        obj ??= ({} as SelfPrimaryAmmoRecoveryJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getAmmoGainPct();
            (value != null) && (obj.ammoGainPct = value);
        }

        {
            const value = this.getUnitLoadedStateId();
            (value != null) && (obj.unitLoadedStateId = value);
        }

        {
            const value = this.getTiming();
            (value != null) && (obj.timing = value);
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
            const value = this.getAmmoGainPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getUnitLoadedStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getTiming();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfPrimaryAmmoRecovery {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfPrimaryAmmoRecovery();
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
                    msg.setAmmoGainPct(reader.int32());
                    break;

                case 4:
                    msg.setUnitLoadedStateId(reader.int32());
                    break;

                case 5:
                    msg.setTiming(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfPrimaryAmmoRecovery {
        return SelfPrimaryAmmoRecovery.decode(this.encode());
    }

    public override getSchemaName(): "SelfPrimaryAmmoRecovery" {
        return "SelfPrimaryAmmoRecovery";
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

    public checkHasAmmoGainPct(): boolean {
        return this._ammoGainPct != null;
    }
    public getAmmoGainPct(): number {
        return this._ammoGainPct ?? 0;
    }
    public setAmmoGainPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._ammoGainPct = null;
        } else {
            this._ammoGainPct = value;
        }
    }

    public checkHasUnitLoadedStateId(): boolean {
        return this._unitLoadedStateId != null;
    }
    public getUnitLoadedStateId(): number {
        return this._unitLoadedStateId ?? 0;
    }
    public setUnitLoadedStateId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitLoadedStateId = null;
        } else {
            this._unitLoadedStateId = value;
        }
    }

    public checkHasTiming(): boolean {
        return this._timing != null;
    }
    public getTiming(): number {
        return this._timing ?? 0;
    }
    public setTiming(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._timing = null;
        } else {
            this._timing = value;
        }
    }
}
