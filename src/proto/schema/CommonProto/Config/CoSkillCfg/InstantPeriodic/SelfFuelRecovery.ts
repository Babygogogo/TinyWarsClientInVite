import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfFuelRecoveryJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    fuelGainPct?: number | null | undefined;
    unitLoadedStateId?: number | null | undefined;
    timing?: number | null | undefined;
}

export class SelfFuelRecovery extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _fuelGainPct?: number | null | undefined;
    private _unitLoadedStateId?: number | null | undefined;
    private _timing?: number | null | undefined;

    public static fromJson(obj: SelfFuelRecoveryJson): SelfFuelRecovery {
        return new SelfFuelRecovery().loadJson(obj);
    }
    public override loadJson(obj: SelfFuelRecoveryJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setFuelGainPct(obj.fuelGainPct);
        this.setUnitLoadedStateId(obj.unitLoadedStateId);
        this.setTiming(obj.timing);
        return this;
    }
    public override toJson(obj?: SelfFuelRecoveryJson): SelfFuelRecoveryJson {
        obj ??= ({} as SelfFuelRecoveryJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getFuelGainPct();
            (value != null) && (obj.fuelGainPct = value);
        }

        {
            const value = this.getUnitLoadedStateId();
            (value != null) && (obj.unitLoadedStateId = value);
        }

        {
            const value = this.getTiming();
            (value != null) && (obj.timing = value);
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
            const value = this.getFuelGainPct();
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
            const value = this.getTiming();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfFuelRecovery {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfFuelRecovery();
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
                    msg.setFuelGainPct(reader.int32());
                    break;

                case 4:
                    msg.setUnitLoadedStateId(reader.int32());
                    break;

                case 5:
                    msg.setTiming(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfFuelRecovery {
        return SelfFuelRecovery.decode(this.encode());
    }

    public override getSchemaName(): "SelfFuelRecovery" {
        return "SelfFuelRecovery";
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

    public checkHasFuelGainPct(): boolean {
        return this._fuelGainPct != null;
    }
    public getFuelGainPct(): number {
        return this._fuelGainPct ?? 0;
    }
    public setFuelGainPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fuelGainPct = null;
        } else {
            this._fuelGainPct = value;
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
}
