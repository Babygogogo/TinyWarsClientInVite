import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitHpJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    unitLoadedStateId?: number | null | undefined;
    regularHpOffset?: number | null | undefined;
    costMultiplierPct?: number | null | undefined;
}

export class SelfUnitHp extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _unitLoadedStateId?: number | null | undefined;
    private _regularHpOffset?: number | null | undefined;
    private _costMultiplierPct?: number | null | undefined;

    public static fromJson(obj: SelfUnitHpJson): SelfUnitHp {
        return new SelfUnitHp().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitHpJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setUnitLoadedStateId(obj.unitLoadedStateId);
        this.setRegularHpOffset(obj.regularHpOffset);
        this.setCostMultiplierPct(obj.costMultiplierPct);
        return this;
    }
    public override toJson(obj?: SelfUnitHpJson): SelfUnitHpJson {
        obj ??= ({} as SelfUnitHpJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getUnitLoadedStateId();
            (value != null) && (obj.unitLoadedStateId = value);
        }

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
            const value = this.getCoSkillAreaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUnitLoadedStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getRegularHpOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getCostMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitHp {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitHp();
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
                    msg.setUnitLoadedStateId(reader.int32());
                    break;

                case 4:
                    msg.setRegularHpOffset(reader.int32());
                    break;

                case 5:
                    msg.setCostMultiplierPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitHp {
        return SelfUnitHp.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitHp" {
        return "SelfUnitHp";
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
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
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

    public checkHasRegularHpOffset(): boolean {
        return this._regularHpOffset != null;
    }
    public getRegularHpOffset(): number {
        return this._regularHpOffset ?? 0;
    }
    public setRegularHpOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._regularHpOffset = null;
        } else {
            this._regularHpOffset = value;
        }
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
