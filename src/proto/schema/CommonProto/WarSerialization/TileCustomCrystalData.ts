import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileCustomCrystalDataJson extends $ProtoSchemaJsonBase {
    radius?: number | null | undefined;
    priority?: number | null | undefined;
    canAffectSelf?: boolean | null | undefined;
    canAffectAlly?: boolean | null | undefined;
    canAffectEnemy?: boolean | null | undefined;
    offsetFund?: number | null | undefined;
    offsetEnergyPercentage?: number | null | undefined;
    offsetHp?: number | null | undefined;
    offsetFuelPercentage?: number | null | undefined;
    offsetPrimaryAmmoPercentage?: number | null | undefined;
    canBeFatal?: boolean | null | undefined;
}

export class TileCustomCrystalData extends $ProtoSchemaBase {
    private _radius?: number | null | undefined;
    private _priority?: number | null | undefined;
    private _canAffectSelf?: boolean | null | undefined;
    private _canAffectAlly?: boolean | null | undefined;
    private _canAffectEnemy?: boolean | null | undefined;
    private _offsetFund?: number | null | undefined;
    private _offsetEnergyPercentage?: number | null | undefined;
    private _offsetHp?: number | null | undefined;
    private _offsetFuelPercentage?: number | null | undefined;
    private _offsetPrimaryAmmoPercentage?: number | null | undefined;
    private _canBeFatal?: boolean | null | undefined;

    public static fromJson(obj: TileCustomCrystalDataJson): TileCustomCrystalData {
        return new TileCustomCrystalData().loadJson(obj);
    }
    public override loadJson(obj: TileCustomCrystalDataJson): this {
        this.setRadius(obj.radius);
        this.setPriority(obj.priority);
        this.setCanAffectSelf(obj.canAffectSelf);
        this.setCanAffectAlly(obj.canAffectAlly);
        this.setCanAffectEnemy(obj.canAffectEnemy);
        this.setOffsetFund(obj.offsetFund);
        this.setOffsetEnergyPercentage(obj.offsetEnergyPercentage);
        this.setOffsetHp(obj.offsetHp);
        this.setOffsetFuelPercentage(obj.offsetFuelPercentage);
        this.setOffsetPrimaryAmmoPercentage(obj.offsetPrimaryAmmoPercentage);
        this.setCanBeFatal(obj.canBeFatal);
        return this;
    }
    public override toJson(obj?: TileCustomCrystalDataJson): TileCustomCrystalDataJson {
        obj ??= ({} as TileCustomCrystalDataJson);

        {
            const value = this.getRadius();
            (value != null) && (obj.radius = value);
        }

        {
            const value = this.getPriority();
            (value != null) && (obj.priority = value);
        }

        {
            const value = this.getCanAffectSelf();
            (value != null) && (obj.canAffectSelf = value);
        }

        {
            const value = this.getCanAffectAlly();
            (value != null) && (obj.canAffectAlly = value);
        }

        {
            const value = this.getCanAffectEnemy();
            (value != null) && (obj.canAffectEnemy = value);
        }

        {
            const value = this.getOffsetFund();
            (value != null) && (obj.offsetFund = value);
        }

        {
            const value = this.getOffsetEnergyPercentage();
            (value != null) && (obj.offsetEnergyPercentage = value);
        }

        {
            const value = this.getOffsetHp();
            (value != null) && (obj.offsetHp = value);
        }

        {
            const value = this.getOffsetFuelPercentage();
            (value != null) && (obj.offsetFuelPercentage = value);
        }

        {
            const value = this.getOffsetPrimaryAmmoPercentage();
            (value != null) && (obj.offsetPrimaryAmmoPercentage = value);
        }

        {
            const value = this.getCanBeFatal();
            (value != null) && (obj.canBeFatal = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRadius();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPriority();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCanAffectSelf();
            if ((value != null) && (value != false)) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getCanAffectAlly();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getCanAffectEnemy();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getOffsetFund();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).sint32(value);
            }
        }

        {
            const value = this.getOffsetEnergyPercentage();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).sint32(value);
            }
        }

        {
            const value = this.getOffsetHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(160).sint32(value);
            }
        }

        {
            const value = this.getOffsetFuelPercentage();
            if ((value != null) && (value != 0)) {
                writer.uint32(168).sint32(value);
            }
        }

        {
            const value = this.getOffsetPrimaryAmmoPercentage();
            if ((value != null) && (value != 0)) {
                writer.uint32(176).sint32(value);
            }
        }

        {
            const value = this.getCanBeFatal();
            if ((value != null) && (value != false)) {
                writer.uint32(184).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileCustomCrystalData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileCustomCrystalData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRadius(reader.int32());
                    break;

                case 2:
                    msg.setPriority(reader.int32());
                    break;

                case 3:
                    msg.setCanAffectSelf(reader.bool());
                    break;

                case 4:
                    msg.setCanAffectAlly(reader.bool());
                    break;

                case 5:
                    msg.setCanAffectEnemy(reader.bool());
                    break;

                case 10:
                    msg.setOffsetFund(reader.sint32());
                    break;

                case 11:
                    msg.setOffsetEnergyPercentage(reader.sint32());
                    break;

                case 20:
                    msg.setOffsetHp(reader.sint32());
                    break;

                case 21:
                    msg.setOffsetFuelPercentage(reader.sint32());
                    break;

                case 22:
                    msg.setOffsetPrimaryAmmoPercentage(reader.sint32());
                    break;

                case 23:
                    msg.setCanBeFatal(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TileCustomCrystalData {
        return TileCustomCrystalData.decode(this.encode());
    }

    public override getSchemaName(): "TileCustomCrystalData" {
        return "TileCustomCrystalData";
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

    public checkHasPriority(): boolean {
        return this._priority != null;
    }
    public getPriority(): number {
        return this._priority ?? 0;
    }
    public setPriority(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._priority = null;
        } else {
            this._priority = value;
        }
    }

    public checkHasCanAffectSelf(): boolean {
        return this._canAffectSelf != null;
    }
    public getCanAffectSelf(): boolean {
        return this._canAffectSelf ?? false;
    }
    public setCanAffectSelf(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canAffectSelf = null;
        } else {
            this._canAffectSelf = value;
        }
    }

    public checkHasCanAffectAlly(): boolean {
        return this._canAffectAlly != null;
    }
    public getCanAffectAlly(): boolean {
        return this._canAffectAlly ?? false;
    }
    public setCanAffectAlly(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canAffectAlly = null;
        } else {
            this._canAffectAlly = value;
        }
    }

    public checkHasCanAffectEnemy(): boolean {
        return this._canAffectEnemy != null;
    }
    public getCanAffectEnemy(): boolean {
        return this._canAffectEnemy ?? false;
    }
    public setCanAffectEnemy(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canAffectEnemy = null;
        } else {
            this._canAffectEnemy = value;
        }
    }

    public checkHasOffsetFund(): boolean {
        return this._offsetFund != null;
    }
    public getOffsetFund(): number {
        return this._offsetFund ?? 0;
    }
    public setOffsetFund(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetFund = null;
        } else {
            this._offsetFund = value;
        }
    }

    public checkHasOffsetEnergyPercentage(): boolean {
        return this._offsetEnergyPercentage != null;
    }
    public getOffsetEnergyPercentage(): number {
        return this._offsetEnergyPercentage ?? 0;
    }
    public setOffsetEnergyPercentage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetEnergyPercentage = null;
        } else {
            this._offsetEnergyPercentage = value;
        }
    }

    public checkHasOffsetHp(): boolean {
        return this._offsetHp != null;
    }
    public getOffsetHp(): number {
        return this._offsetHp ?? 0;
    }
    public setOffsetHp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetHp = null;
        } else {
            this._offsetHp = value;
        }
    }

    public checkHasOffsetFuelPercentage(): boolean {
        return this._offsetFuelPercentage != null;
    }
    public getOffsetFuelPercentage(): number {
        return this._offsetFuelPercentage ?? 0;
    }
    public setOffsetFuelPercentage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetFuelPercentage = null;
        } else {
            this._offsetFuelPercentage = value;
        }
    }

    public checkHasOffsetPrimaryAmmoPercentage(): boolean {
        return this._offsetPrimaryAmmoPercentage != null;
    }
    public getOffsetPrimaryAmmoPercentage(): number {
        return this._offsetPrimaryAmmoPercentage ?? 0;
    }
    public setOffsetPrimaryAmmoPercentage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPrimaryAmmoPercentage = null;
        } else {
            this._offsetPrimaryAmmoPercentage = value;
        }
    }

    public checkHasCanBeFatal(): boolean {
        return this._canBeFatal != null;
    }
    public getCanBeFatal(): boolean {
        return this._canBeFatal ?? false;
    }
    public setCanBeFatal(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canBeFatal = null;
        } else {
            this._canBeFatal = value;
        }
    }
}
