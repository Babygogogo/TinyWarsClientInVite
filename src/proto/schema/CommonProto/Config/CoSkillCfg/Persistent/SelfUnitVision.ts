import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitVisionJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    rangeOffset?: number | null | undefined;
    canSeeThrough?: boolean | null | undefined;
}

export class SelfUnitVision extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _rangeOffset?: number | null | undefined;
    private _canSeeThrough?: boolean | null | undefined;

    public static fromJson(obj: SelfUnitVisionJson): SelfUnitVision {
        return new SelfUnitVision().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitVisionJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setRangeOffset(obj.rangeOffset);
        this.setCanSeeThrough(obj.canSeeThrough);
        return this;
    }
    public override toJson(obj?: SelfUnitVisionJson): SelfUnitVisionJson {
        obj ??= ({} as SelfUnitVisionJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getRangeOffset();
            (value != null) && (obj.rangeOffset = value);
        }

        {
            const value = this.getCanSeeThrough();
            (value != null) && (obj.canSeeThrough = value);
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
            const value = this.getRangeOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getCanSeeThrough();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitVision {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitVision();
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
                    msg.setRangeOffset(reader.int32());
                    break;

                case 4:
                    msg.setCanSeeThrough(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitVision {
        return SelfUnitVision.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitVision" {
        return "SelfUnitVision";
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

    public checkHasRangeOffset(): boolean {
        return this._rangeOffset != null;
    }
    public getRangeOffset(): number {
        return this._rangeOffset ?? 0;
    }
    public setRangeOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeOffset = null;
        } else {
            this._rangeOffset = value;
        }
    }

    public checkHasCanSeeThrough(): boolean {
        return this._canSeeThrough != null;
    }
    public getCanSeeThrough(): boolean {
        return this._canSeeThrough ?? false;
    }
    public setCanSeeThrough(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canSeeThrough = null;
        } else {
            this._canSeeThrough = value;
        }
    }
}
