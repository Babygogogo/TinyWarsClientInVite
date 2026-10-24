import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfCannotCounterAttackJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
}

export class SelfCannotCounterAttack extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;

    public static fromJson(obj: SelfCannotCounterAttackJson): SelfCannotCounterAttack {
        return new SelfCannotCounterAttack().loadJson(obj);
    }
    public override loadJson(obj: SelfCannotCounterAttackJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTileCategoryId(obj.tileCategoryId);
        return this;
    }
    public override toJson(obj?: SelfCannotCounterAttackJson): SelfCannotCounterAttackJson {
        obj ??= ({} as SelfCannotCounterAttackJson);

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
            const value = this.getTileCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfCannotCounterAttack {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfCannotCounterAttack();
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfCannotCounterAttack {
        return SelfCannotCounterAttack.decode(this.encode());
    }

    public override getSchemaName(): "SelfCannotCounterAttack" {
        return "SelfCannotCounterAttack";
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

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number {
        return this._tileCategoryId ?? 0;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileCategoryId = null;
        } else {
            this._tileCategoryId = value;
        }
    }
}
