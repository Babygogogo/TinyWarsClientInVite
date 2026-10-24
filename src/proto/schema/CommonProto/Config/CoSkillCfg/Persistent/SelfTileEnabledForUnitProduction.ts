import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfTileEnabledForUnitProductionJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    hpLowerLimit?: number | null | undefined;
    hpUpperLimit?: number | null | undefined;
    costMultiplierPct?: number | null | undefined;
    unitActionStateId?: number | null | undefined;
}

export class SelfTileEnabledForUnitProduction extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _hpLowerLimit?: number | null | undefined;
    private _hpUpperLimit?: number | null | undefined;
    private _costMultiplierPct?: number | null | undefined;
    private _unitActionStateId?: number | null | undefined;

    public static fromJson(obj: SelfTileEnabledForUnitProductionJson): SelfTileEnabledForUnitProduction {
        return new SelfTileEnabledForUnitProduction().loadJson(obj);
    }
    public override loadJson(obj: SelfTileEnabledForUnitProductionJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setHpLowerLimit(obj.hpLowerLimit);
        this.setHpUpperLimit(obj.hpUpperLimit);
        this.setCostMultiplierPct(obj.costMultiplierPct);
        this.setUnitActionStateId(obj.unitActionStateId);
        return this;
    }
    public override toJson(obj?: SelfTileEnabledForUnitProductionJson): SelfTileEnabledForUnitProductionJson {
        obj ??= ({} as SelfTileEnabledForUnitProductionJson);

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
            const value = this.getHpLowerLimit();
            (value != null) && (obj.hpLowerLimit = value);
        }

        {
            const value = this.getHpUpperLimit();
            (value != null) && (obj.hpUpperLimit = value);
        }

        {
            const value = this.getCostMultiplierPct();
            (value != null) && (obj.costMultiplierPct = value);
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
            const value = this.getHpLowerLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getHpUpperLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCostMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getUnitActionStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfTileEnabledForUnitProduction {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfTileEnabledForUnitProduction();
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
                    msg.setHpLowerLimit(reader.int32());
                    break;

                case 5:
                    msg.setHpUpperLimit(reader.int32());
                    break;

                case 6:
                    msg.setCostMultiplierPct(reader.int32());
                    break;

                case 7:
                    msg.setUnitActionStateId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfTileEnabledForUnitProduction {
        return SelfTileEnabledForUnitProduction.decode(this.encode());
    }

    public override getSchemaName(): "SelfTileEnabledForUnitProduction" {
        return "SelfTileEnabledForUnitProduction";
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

    public checkHasHpLowerLimit(): boolean {
        return this._hpLowerLimit != null;
    }
    public getHpLowerLimit(): number {
        return this._hpLowerLimit ?? 0;
    }
    public setHpLowerLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._hpLowerLimit = null;
        } else {
            this._hpLowerLimit = value;
        }
    }

    public checkHasHpUpperLimit(): boolean {
        return this._hpUpperLimit != null;
    }
    public getHpUpperLimit(): number {
        return this._hpUpperLimit ?? 0;
    }
    public setHpUpperLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._hpUpperLimit = null;
        } else {
            this._hpUpperLimit = value;
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
