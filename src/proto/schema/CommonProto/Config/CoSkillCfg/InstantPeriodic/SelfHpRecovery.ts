import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfHpRecoveryJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    hpGain?: number | null | undefined;
    unitLoadedStateId?: number | null | undefined;
    unitActionStateId?: number | null | undefined;
    costMultiplierPct?: number | null | undefined;
    timing?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    conNeedOwnTile?: boolean | null | undefined;
}

export class SelfHpRecovery extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _hpGain?: number | null | undefined;
    private _unitLoadedStateId?: number | null | undefined;
    private _unitActionStateId?: number | null | undefined;
    private _costMultiplierPct?: number | null | undefined;
    private _timing?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _conNeedOwnTile?: boolean | null | undefined;

    public static fromJson(obj: SelfHpRecoveryJson): SelfHpRecovery {
        return new SelfHpRecovery().loadJson(obj);
    }
    public override loadJson(obj: SelfHpRecoveryJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setHpGain(obj.hpGain);
        this.setUnitLoadedStateId(obj.unitLoadedStateId);
        this.setUnitActionStateId(obj.unitActionStateId);
        this.setCostMultiplierPct(obj.costMultiplierPct);
        this.setTiming(obj.timing);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setConNeedOwnTile(obj.conNeedOwnTile);
        return this;
    }
    public override toJson(obj?: SelfHpRecoveryJson): SelfHpRecoveryJson {
        obj ??= ({} as SelfHpRecoveryJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getHpGain();
            (value != null) && (obj.hpGain = value);
        }

        {
            const value = this.getUnitLoadedStateId();
            (value != null) && (obj.unitLoadedStateId = value);
        }

        {
            const value = this.getUnitActionStateId();
            (value != null) && (obj.unitActionStateId = value);
        }

        {
            const value = this.getCostMultiplierPct();
            (value != null) && (obj.costMultiplierPct = value);
        }

        {
            const value = this.getTiming();
            (value != null) && (obj.timing = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            const value = this.getConNeedOwnTile();
            (value != null) && (obj.conNeedOwnTile = value);
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
            const value = this.getHpGain();
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
            const value = this.getUnitActionStateId();
            if (value != null) {
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
            const value = this.getTiming();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getTileCategoryId();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getConNeedOwnTile();
            if (value != null) {
                writer.uint32(72).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfHpRecovery {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfHpRecovery();
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
                    msg.setHpGain(reader.int32());
                    break;

                case 4:
                    msg.setUnitLoadedStateId(reader.int32());
                    break;

                case 5:
                    msg.setUnitActionStateId(reader.int32());
                    break;

                case 6:
                    msg.setCostMultiplierPct(reader.int32());
                    break;

                case 7:
                    msg.setTiming(reader.int32());
                    break;

                case 8:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 9:
                    msg.setConNeedOwnTile(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfHpRecovery {
        return SelfHpRecovery.decode(this.encode());
    }

    public override getSchemaName(): "SelfHpRecovery" {
        return "SelfHpRecovery";
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

    public checkHasHpGain(): boolean {
        return this._hpGain != null;
    }
    public getHpGain(): number {
        return this._hpGain ?? 0;
    }
    public setHpGain(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._hpGain = null;
        } else {
            this._hpGain = value;
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

    public checkHasUnitActionStateId(): boolean {
        return this._unitActionStateId != null;
    }
    public getUnitActionStateId(): number | null | undefined {
        return this._unitActionStateId;
    }
    public setUnitActionStateId(value: number | null | undefined): void {
        this._unitActionStateId = value;
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

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number | null | undefined {
        return this._tileCategoryId;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        this._tileCategoryId = value;
    }

    public checkHasConNeedOwnTile(): boolean {
        return this._conNeedOwnTile != null;
    }
    public getConNeedOwnTile(): boolean | null | undefined {
        return this._conNeedOwnTile;
    }
    public setConNeedOwnTile(value: boolean | null | undefined): void {
        this._conNeedOwnTile = value;
    }
}
