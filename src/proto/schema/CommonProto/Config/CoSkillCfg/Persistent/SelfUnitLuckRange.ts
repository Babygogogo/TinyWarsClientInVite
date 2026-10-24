import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitLuckRangeJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    lowerOffset?: number | null | undefined;
    upperOffset?: number | null | undefined;
}

export class SelfUnitLuckRange extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _lowerOffset?: number | null | undefined;
    private _upperOffset?: number | null | undefined;

    public static fromJson(obj: SelfUnitLuckRangeJson): SelfUnitLuckRange {
        return new SelfUnitLuckRange().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitLuckRangeJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setLowerOffset(obj.lowerOffset);
        this.setUpperOffset(obj.upperOffset);
        return this;
    }
    public override toJson(obj?: SelfUnitLuckRangeJson): SelfUnitLuckRangeJson {
        obj ??= ({} as SelfUnitLuckRangeJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getLowerOffset();
            (value != null) && (obj.lowerOffset = value);
        }

        {
            const value = this.getUpperOffset();
            (value != null) && (obj.upperOffset = value);
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
            const value = this.getLowerOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getUpperOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitLuckRange {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitLuckRange();
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
                    msg.setLowerOffset(reader.int32());
                    break;

                case 4:
                    msg.setUpperOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitLuckRange {
        return SelfUnitLuckRange.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitLuckRange" {
        return "SelfUnitLuckRange";
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

    public checkHasLowerOffset(): boolean {
        return this._lowerOffset != null;
    }
    public getLowerOffset(): number {
        return this._lowerOffset ?? 0;
    }
    public setLowerOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._lowerOffset = null;
        } else {
            this._lowerOffset = value;
        }
    }

    public checkHasUpperOffset(): boolean {
        return this._upperOffset != null;
    }
    public getUpperOffset(): number {
        return this._upperOffset ?? 0;
    }
    public setUpperOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._upperOffset = null;
        } else {
            this._upperOffset = value;
        }
    }
}
