import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SystemCfgJson extends $ProtoSchemaJsonBase {
    dorEnergyGainRates: number[];
    trilogyEnergyGainRates: number[];
    maxBanCoNumber?: number | null | undefined;
    damageFormulaTypeId?: number | null | undefined;
    canUnitGetPromotionAfterDestroyingUnit?: boolean | null | undefined;
    isPathVisionEnabled?: boolean | null | undefined;
    defaultLuckUpperLimit?: number | null | undefined;
}

export class SystemCfg extends $ProtoSchemaBase {
    private _dorEnergyGainRates: number[] = [];
    private _trilogyEnergyGainRates: number[] = [];
    private _maxBanCoNumber?: number | null | undefined;
    private _damageFormulaTypeId?: number | null | undefined;
    private _canUnitGetPromotionAfterDestroyingUnit?: boolean | null | undefined;
    private _isPathVisionEnabled?: boolean | null | undefined;
    private _defaultLuckUpperLimit?: number | null | undefined;

    public static fromJson(obj: SystemCfgJson): SystemCfg {
        return new SystemCfg().loadJson(obj);
    }
    public override loadJson(obj: SystemCfgJson): this {
        this.setDorEnergyGainRates(obj.dorEnergyGainRates?.concat() ?? []);
        this.setTrilogyEnergyGainRates(obj.trilogyEnergyGainRates?.concat() ?? []);
        this.setMaxBanCoNumber(obj.maxBanCoNumber);
        this.setDamageFormulaTypeId(obj.damageFormulaTypeId);
        this.setCanUnitGetPromotionAfterDestroyingUnit(obj.canUnitGetPromotionAfterDestroyingUnit);
        this.setIsPathVisionEnabled(obj.isPathVisionEnabled);
        this.setDefaultLuckUpperLimit(obj.defaultLuckUpperLimit);
        return this;
    }
    public override toJson(obj?: SystemCfgJson): SystemCfgJson {
        obj ??= ({} as SystemCfgJson);

        {
            obj.dorEnergyGainRates = this.getDorEnergyGainRates().concat();
        }

        {
            obj.trilogyEnergyGainRates = this.getTrilogyEnergyGainRates().concat();
        }

        {
            const value = this.getMaxBanCoNumber();
            (value != null) && (obj.maxBanCoNumber = value);
        }

        {
            const value = this.getDamageFormulaTypeId();
            (value != null) && (obj.damageFormulaTypeId = value);
        }

        {
            const value = this.getCanUnitGetPromotionAfterDestroyingUnit();
            (value != null) && (obj.canUnitGetPromotionAfterDestroyingUnit = value);
        }

        {
            const value = this.getIsPathVisionEnabled();
            (value != null) && (obj.isPathVisionEnabled = value);
        }

        {
            const value = this.getDefaultLuckUpperLimit();
            (value != null) && (obj.defaultLuckUpperLimit = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDorEnergyGainRates();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getTrilogyEnergyGainRates();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMaxBanCoNumber();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getDamageFormulaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getCanUnitGetPromotionAfterDestroyingUnit();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getIsPathVisionEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getDefaultLuckUpperLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SystemCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SystemCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._dorEnergyGainRates;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 2:
                    {
                        const arr = msg._trilogyEnergyGainRates;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 3:
                    msg.setMaxBanCoNumber(reader.int32());
                    break;

                case 4:
                    msg.setDamageFormulaTypeId(reader.int32());
                    break;

                case 5:
                    msg.setCanUnitGetPromotionAfterDestroyingUnit(reader.bool());
                    break;

                case 6:
                    msg.setIsPathVisionEnabled(reader.bool());
                    break;

                case 7:
                    msg.setDefaultLuckUpperLimit(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SystemCfg {
        return SystemCfg.decode(this.encode());
    }

    public override getSchemaName(): "SystemCfg" {
        return "SystemCfg";
    }

    public getDorEnergyGainRates(): number[] {
        return this._dorEnergyGainRates;
    }
    public setDorEnergyGainRates(value: number[]): void {
        this._dorEnergyGainRates = value;
    }

    public getTrilogyEnergyGainRates(): number[] {
        return this._trilogyEnergyGainRates;
    }
    public setTrilogyEnergyGainRates(value: number[]): void {
        this._trilogyEnergyGainRates = value;
    }

    public checkHasMaxBanCoNumber(): boolean {
        return this._maxBanCoNumber != null;
    }
    public getMaxBanCoNumber(): number {
        return this._maxBanCoNumber ?? 0;
    }
    public setMaxBanCoNumber(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxBanCoNumber = null;
        } else {
            this._maxBanCoNumber = value;
        }
    }

    public checkHasDamageFormulaTypeId(): boolean {
        return this._damageFormulaTypeId != null;
    }
    public getDamageFormulaTypeId(): number {
        return this._damageFormulaTypeId ?? 0;
    }
    public setDamageFormulaTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._damageFormulaTypeId = null;
        } else {
            this._damageFormulaTypeId = value;
        }
    }

    public checkHasCanUnitGetPromotionAfterDestroyingUnit(): boolean {
        return this._canUnitGetPromotionAfterDestroyingUnit != null;
    }
    public getCanUnitGetPromotionAfterDestroyingUnit(): boolean {
        return this._canUnitGetPromotionAfterDestroyingUnit ?? false;
    }
    public setCanUnitGetPromotionAfterDestroyingUnit(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canUnitGetPromotionAfterDestroyingUnit = null;
        } else {
            this._canUnitGetPromotionAfterDestroyingUnit = value;
        }
    }

    public checkHasIsPathVisionEnabled(): boolean {
        return this._isPathVisionEnabled != null;
    }
    public getIsPathVisionEnabled(): boolean {
        return this._isPathVisionEnabled ?? false;
    }
    public setIsPathVisionEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isPathVisionEnabled = null;
        } else {
            this._isPathVisionEnabled = value;
        }
    }

    public checkHasDefaultLuckUpperLimit(): boolean {
        return this._defaultLuckUpperLimit != null;
    }
    public getDefaultLuckUpperLimit(): number {
        return this._defaultLuckUpperLimit ?? 0;
    }
    public setDefaultLuckUpperLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._defaultLuckUpperLimit = null;
        } else {
            this._defaultLuckUpperLimit = value;
        }
    }
}
