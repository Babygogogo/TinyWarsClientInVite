import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitMoveRangeJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    weatherCategoryId?: number | null | undefined;
    offset?: number | null | undefined;
}

export class SelfUnitMoveRange extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _weatherCategoryId?: number | null | undefined;
    private _offset?: number | null | undefined;

    public static fromJson(obj: SelfUnitMoveRangeJson): SelfUnitMoveRange {
        return new SelfUnitMoveRange().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitMoveRangeJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setWeatherCategoryId(obj.weatherCategoryId);
        this.setOffset(obj.offset);
        return this;
    }
    public override toJson(obj?: SelfUnitMoveRangeJson): SelfUnitMoveRangeJson {
        obj ??= ({} as SelfUnitMoveRangeJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            const value = this.getWeatherCategoryId();
            (value != null) && (obj.weatherCategoryId = value);
        }

        {
            const value = this.getOffset();
            (value != null) && (obj.offset = value);
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
            const value = this.getTileCategoryId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getWeatherCategoryId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitMoveRange {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitMoveRange();
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
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 4:
                    msg.setWeatherCategoryId(reader.int32());
                    break;

                case 5:
                    msg.setOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitMoveRange {
        return SelfUnitMoveRange.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitMoveRange" {
        return "SelfUnitMoveRange";
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

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number | null | undefined {
        return this._tileCategoryId;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        this._tileCategoryId = value;
    }

    public checkHasWeatherCategoryId(): boolean {
        return this._weatherCategoryId != null;
    }
    public getWeatherCategoryId(): number | null | undefined {
        return this._weatherCategoryId;
    }
    public setWeatherCategoryId(value: number | null | undefined): void {
        this._weatherCategoryId = value;
    }

    public checkHasOffset(): boolean {
        return this._offset != null;
    }
    public getOffset(): number {
        return this._offset ?? 0;
    }
    public setOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offset = null;
        } else {
            this._offset = value;
        }
    }
}
