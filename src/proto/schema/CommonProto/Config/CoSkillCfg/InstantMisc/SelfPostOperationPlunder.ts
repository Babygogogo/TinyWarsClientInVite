import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfPostOperationPlunderJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    targetTileCategoryId?: number | null | undefined;
    canPlunderEnemy?: boolean | null | undefined;
    canPlunderSelf?: boolean | null | undefined;
    canPlunderNeutral?: boolean | null | undefined;
    multiple?: number | null | undefined;
}

export class SelfPostOperationPlunder extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _targetTileCategoryId?: number | null | undefined;
    private _canPlunderEnemy?: boolean | null | undefined;
    private _canPlunderSelf?: boolean | null | undefined;
    private _canPlunderNeutral?: boolean | null | undefined;
    private _multiple?: number | null | undefined;

    public static fromJson(obj: SelfPostOperationPlunderJson): SelfPostOperationPlunder {
        return new SelfPostOperationPlunder().loadJson(obj);
    }
    public override loadJson(obj: SelfPostOperationPlunderJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTargetTileCategoryId(obj.targetTileCategoryId);
        this.setCanPlunderEnemy(obj.canPlunderEnemy);
        this.setCanPlunderSelf(obj.canPlunderSelf);
        this.setCanPlunderNeutral(obj.canPlunderNeutral);
        this.setMultiple(obj.multiple);
        return this;
    }
    public override toJson(obj?: SelfPostOperationPlunderJson): SelfPostOperationPlunderJson {
        obj ??= ({} as SelfPostOperationPlunderJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getTargetTileCategoryId();
            (value != null) && (obj.targetTileCategoryId = value);
        }

        {
            const value = this.getCanPlunderEnemy();
            (value != null) && (obj.canPlunderEnemy = value);
        }

        {
            const value = this.getCanPlunderSelf();
            (value != null) && (obj.canPlunderSelf = value);
        }

        {
            const value = this.getCanPlunderNeutral();
            (value != null) && (obj.canPlunderNeutral = value);
        }

        {
            const value = this.getMultiple();
            (value != null) && (obj.multiple = value);
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
            const value = this.getTargetTileCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getCanPlunderEnemy();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getCanPlunderSelf();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getCanPlunderNeutral();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getMultiple();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfPostOperationPlunder {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfPostOperationPlunder();
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
                    msg.setTargetTileCategoryId(reader.int32());
                    break;

                case 4:
                    msg.setCanPlunderEnemy(reader.bool());
                    break;

                case 5:
                    msg.setCanPlunderSelf(reader.bool());
                    break;

                case 6:
                    msg.setCanPlunderNeutral(reader.bool());
                    break;

                case 7:
                    msg.setMultiple(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfPostOperationPlunder {
        return SelfPostOperationPlunder.decode(this.encode());
    }

    public override getSchemaName(): "SelfPostOperationPlunder" {
        return "SelfPostOperationPlunder";
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

    public checkHasTargetTileCategoryId(): boolean {
        return this._targetTileCategoryId != null;
    }
    public getTargetTileCategoryId(): number {
        return this._targetTileCategoryId ?? 0;
    }
    public setTargetTileCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._targetTileCategoryId = null;
        } else {
            this._targetTileCategoryId = value;
        }
    }

    public checkHasCanPlunderEnemy(): boolean {
        return this._canPlunderEnemy != null;
    }
    public getCanPlunderEnemy(): boolean {
        return this._canPlunderEnemy ?? false;
    }
    public setCanPlunderEnemy(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canPlunderEnemy = null;
        } else {
            this._canPlunderEnemy = value;
        }
    }

    public checkHasCanPlunderSelf(): boolean {
        return this._canPlunderSelf != null;
    }
    public getCanPlunderSelf(): boolean {
        return this._canPlunderSelf ?? false;
    }
    public setCanPlunderSelf(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canPlunderSelf = null;
        } else {
            this._canPlunderSelf = value;
        }
    }

    public checkHasCanPlunderNeutral(): boolean {
        return this._canPlunderNeutral != null;
    }
    public getCanPlunderNeutral(): boolean {
        return this._canPlunderNeutral ?? false;
    }
    public setCanPlunderNeutral(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canPlunderNeutral = null;
        } else {
            this._canPlunderNeutral = value;
        }
    }

    public checkHasMultiple(): boolean {
        return this._multiple != null;
    }
    public getMultiple(): number {
        return this._multiple ?? 0;
    }
    public setMultiple(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._multiple = null;
        } else {
            this._multiple = value;
        }
    }
}
