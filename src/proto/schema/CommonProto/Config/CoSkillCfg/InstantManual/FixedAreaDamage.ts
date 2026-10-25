import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface FixedAreaDamageJson extends $ProtoSchemaJsonBase {
    targetTypeId?: number | null | undefined;
    radius?: number | null | undefined;
    damage?: number | null | undefined;
    isIndiscriminate?: boolean | null | undefined;
    changeUnitActionStateId?: number | null | undefined;
    canDestroy?: boolean | null | undefined;
}

export class FixedAreaDamage extends $ProtoSchemaBase {
    private _targetTypeId?: number | null | undefined;
    private _radius?: number | null | undefined;
    private _damage?: number | null | undefined;
    private _isIndiscriminate?: boolean | null | undefined;
    private _changeUnitActionStateId?: number | null | undefined;
    private _canDestroy?: boolean | null | undefined;

    public static fromJson(obj: FixedAreaDamageJson): FixedAreaDamage {
        return new FixedAreaDamage().loadJson(obj);
    }
    public override loadJson(obj: FixedAreaDamageJson): this {
        this.setTargetTypeId(obj.targetTypeId);
        this.setRadius(obj.radius);
        this.setDamage(obj.damage);
        this.setIsIndiscriminate(obj.isIndiscriminate);
        this.setChangeUnitActionStateId(obj.changeUnitActionStateId);
        this.setCanDestroy(obj.canDestroy);
        return this;
    }
    public override toJson(obj?: FixedAreaDamageJson): FixedAreaDamageJson {
        obj ??= ({} as FixedAreaDamageJson);

        {
            const value = this.getTargetTypeId();
            (value != null) && (obj.targetTypeId = value);
        }

        {
            const value = this.getRadius();
            (value != null) && (obj.radius = value);
        }

        {
            const value = this.getDamage();
            (value != null) && (obj.damage = value);
        }

        {
            const value = this.getIsIndiscriminate();
            (value != null) && (obj.isIndiscriminate = value);
        }

        {
            const value = this.getChangeUnitActionStateId();
            (value != null) && (obj.changeUnitActionStateId = value);
        }

        {
            const value = this.getCanDestroy();
            (value != null) && (obj.canDestroy = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTargetTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRadius();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getDamage();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsIndiscriminate();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getChangeUnitActionStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCanDestroy();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): FixedAreaDamage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new FixedAreaDamage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTargetTypeId(reader.int32());
                    break;

                case 2:
                    msg.setRadius(reader.int32());
                    break;

                case 3:
                    msg.setDamage(reader.int32());
                    break;

                case 4:
                    msg.setIsIndiscriminate(reader.bool());
                    break;

                case 5:
                    msg.setChangeUnitActionStateId(reader.int32());
                    break;

                case 6:
                    msg.setCanDestroy(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): FixedAreaDamage {
        return FixedAreaDamage.decode(this.encode());
    }

    public override getSchemaName(): "FixedAreaDamage" {
        return "FixedAreaDamage";
    }

    public checkHasTargetTypeId(): boolean {
        return this._targetTypeId != null;
    }
    public getTargetTypeId(): number {
        return this._targetTypeId ?? 0;
    }
    public setTargetTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._targetTypeId = null;
        } else {
            this._targetTypeId = value;
        }
    }

    public checkHasRadius(): boolean {
        return this._radius != null;
    }
    public getRadius(): number {
        return this._radius ?? 0;
    }
    public setRadius(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._radius = null;
        } else {
            this._radius = value;
        }
    }

    public checkHasDamage(): boolean {
        return this._damage != null;
    }
    public getDamage(): number {
        return this._damage ?? 0;
    }
    public setDamage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._damage = null;
        } else {
            this._damage = value;
        }
    }

    public checkHasIsIndiscriminate(): boolean {
        return this._isIndiscriminate != null;
    }
    public getIsIndiscriminate(): boolean {
        return this._isIndiscriminate ?? false;
    }
    public setIsIndiscriminate(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isIndiscriminate = null;
        } else {
            this._isIndiscriminate = value;
        }
    }

    public checkHasChangeUnitActionStateId(): boolean {
        return this._changeUnitActionStateId != null;
    }
    public getChangeUnitActionStateId(): number {
        return this._changeUnitActionStateId ?? 0;
    }
    public setChangeUnitActionStateId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._changeUnitActionStateId = null;
        } else {
            this._changeUnitActionStateId = value;
        }
    }

    public checkHasCanDestroy(): boolean {
        return this._canDestroy != null;
    }
    public getCanDestroy(): boolean {
        return this._canDestroy ?? false;
    }
    public setCanDestroy(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canDestroy = null;
        } else {
            this._canDestroy = value;
        }
    }
}
