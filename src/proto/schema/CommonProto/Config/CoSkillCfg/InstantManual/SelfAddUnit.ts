import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfAddUnitJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    unitTypeId?: number | null | undefined;
    hp?: number | null | undefined;
    unitActionStateId?: number | null | undefined;
}

export class SelfAddUnit extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _unitTypeId?: number | null | undefined;
    private _hp?: number | null | undefined;
    private _unitActionStateId?: number | null | undefined;

    public static fromJson(obj: SelfAddUnitJson): SelfAddUnit {
        return new SelfAddUnit().loadJson(obj);
    }
    public override loadJson(obj: SelfAddUnitJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setUnitTypeId(obj.unitTypeId);
        this.setHp(obj.hp);
        this.setUnitActionStateId(obj.unitActionStateId);
        return this;
    }
    public override toJson(obj?: SelfAddUnitJson): SelfAddUnitJson {
        obj ??= ({} as SelfAddUnitJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            const value = this.getUnitTypeId();
            (value != null) && (obj.unitTypeId = value);
        }

        {
            const value = this.getHp();
            (value != null) && (obj.hp = value);
        }

        {
            const value = this.getUnitActionStateId();
            (value != null) && (obj.unitActionStateId = value);
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
            const value = this.getTileCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUnitTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUnitActionStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfAddUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfAddUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setUnitTypeId(reader.int32());
                    break;

                case 4:
                    msg.setHp(reader.int32());
                    break;

                case 5:
                    msg.setUnitActionStateId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfAddUnit {
        return SelfAddUnit.decode(this.encode());
    }

    public override getSchemaName(): "SelfAddUnit" {
        return "SelfAddUnit";
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

    public checkHasUnitTypeId(): boolean {
        return this._unitTypeId != null;
    }
    public getUnitTypeId(): number {
        return this._unitTypeId ?? 0;
    }
    public setUnitTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitTypeId = null;
        } else {
            this._unitTypeId = value;
        }
    }

    public checkHasHp(): boolean {
        return this._hp != null;
    }
    public getHp(): number {
        return this._hp ?? 0;
    }
    public setHp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._hp = null;
        } else {
            this._hp = value;
        }
    }

    public checkHasUnitActionStateId(): boolean {
        return this._unitActionStateId != null;
    }
    public getUnitActionStateId(): number {
        return this._unitActionStateId ?? 0;
    }
    public setUnitActionStateId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitActionStateId = null;
        } else {
            this._unitActionStateId = value;
        }
    }
}
