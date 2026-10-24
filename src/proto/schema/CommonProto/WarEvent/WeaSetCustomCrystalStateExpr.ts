import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetCustomCrystalStateExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    actRadius?: string | null | undefined;
    actPriority?: string | null | undefined;
    actCanAffectSelf?: string | null | undefined;
    actCanAffectAlly?: string | null | undefined;
    actCanAffectEnemy?: string | null | undefined;
    actOffsetFund?: string | null | undefined;
    actOffsetEnergyPercentage?: string | null | undefined;
    actOffsetHp?: string | null | undefined;
    actOffsetFuelPercentage?: string | null | undefined;
    actOffsetPrimaryAmmoPercentage?: string | null | undefined;
    actCanBeFatal?: string | null | undefined;
}

export class WeaSetCustomCrystalStateExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _actRadius?: string | null | undefined;
    private _actPriority?: string | null | undefined;
    private _actCanAffectSelf?: string | null | undefined;
    private _actCanAffectAlly?: string | null | undefined;
    private _actCanAffectEnemy?: string | null | undefined;
    private _actOffsetFund?: string | null | undefined;
    private _actOffsetEnergyPercentage?: string | null | undefined;
    private _actOffsetHp?: string | null | undefined;
    private _actOffsetFuelPercentage?: string | null | undefined;
    private _actOffsetPrimaryAmmoPercentage?: string | null | undefined;
    private _actCanBeFatal?: string | null | undefined;

    public static fromJson(obj: WeaSetCustomCrystalStateExprJson): WeaSetCustomCrystalStateExpr {
        return new WeaSetCustomCrystalStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomCrystalStateExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setActRadius(obj.actRadius);
        this.setActPriority(obj.actPriority);
        this.setActCanAffectSelf(obj.actCanAffectSelf);
        this.setActCanAffectAlly(obj.actCanAffectAlly);
        this.setActCanAffectEnemy(obj.actCanAffectEnemy);
        this.setActOffsetFund(obj.actOffsetFund);
        this.setActOffsetEnergyPercentage(obj.actOffsetEnergyPercentage);
        this.setActOffsetHp(obj.actOffsetHp);
        this.setActOffsetFuelPercentage(obj.actOffsetFuelPercentage);
        this.setActOffsetPrimaryAmmoPercentage(obj.actOffsetPrimaryAmmoPercentage);
        this.setActCanBeFatal(obj.actCanBeFatal);
        return this;
    }
    public override toJson(obj?: WeaSetCustomCrystalStateExprJson): WeaSetCustomCrystalStateExprJson {
        obj ??= ({} as WeaSetCustomCrystalStateExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getActRadius();
            (value != null) && (obj.actRadius = value);
        }

        {
            const value = this.getActPriority();
            (value != null) && (obj.actPriority = value);
        }

        {
            const value = this.getActCanAffectSelf();
            (value != null) && (obj.actCanAffectSelf = value);
        }

        {
            const value = this.getActCanAffectAlly();
            (value != null) && (obj.actCanAffectAlly = value);
        }

        {
            const value = this.getActCanAffectEnemy();
            (value != null) && (obj.actCanAffectEnemy = value);
        }

        {
            const value = this.getActOffsetFund();
            (value != null) && (obj.actOffsetFund = value);
        }

        {
            const value = this.getActOffsetEnergyPercentage();
            (value != null) && (obj.actOffsetEnergyPercentage = value);
        }

        {
            const value = this.getActOffsetHp();
            (value != null) && (obj.actOffsetHp = value);
        }

        {
            const value = this.getActOffsetFuelPercentage();
            (value != null) && (obj.actOffsetFuelPercentage = value);
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            (value != null) && (obj.actOffsetPrimaryAmmoPercentage = value);
        }

        {
            const value = this.getActCanBeFatal();
            (value != null) && (obj.actCanBeFatal = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActRadius();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActPriority();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActCanAffectSelf();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActCanAffectAlly();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActCanAffectEnemy();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActOffsetFund();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActOffsetEnergyPercentage();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getActOffsetHp();
            if (value != null) {
                writer.uint32(146).string(value);
            }
        }

        {
            const value = this.getActOffsetFuelPercentage();
            if (value != null) {
                writer.uint32(154).string(value);
            }
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            if (value != null) {
                writer.uint32(162).string(value);
            }
        }

        {
            const value = this.getActCanBeFatal();
            if (value != null) {
                writer.uint32(170).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomCrystalStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomCrystalStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 11:
                    msg.setActRadius(reader.string());
                    break;

                case 12:
                    msg.setActPriority(reader.string());
                    break;

                case 13:
                    msg.setActCanAffectSelf(reader.string());
                    break;

                case 14:
                    msg.setActCanAffectAlly(reader.string());
                    break;

                case 15:
                    msg.setActCanAffectEnemy(reader.string());
                    break;

                case 16:
                    msg.setActOffsetFund(reader.string());
                    break;

                case 17:
                    msg.setActOffsetEnergyPercentage(reader.string());
                    break;

                case 18:
                    msg.setActOffsetHp(reader.string());
                    break;

                case 19:
                    msg.setActOffsetFuelPercentage(reader.string());
                    break;

                case 20:
                    msg.setActOffsetPrimaryAmmoPercentage(reader.string());
                    break;

                case 21:
                    msg.setActCanBeFatal(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomCrystalStateExpr {
        return WeaSetCustomCrystalStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomCrystalStateExpr" {
        return "WeaSetCustomCrystalStateExpr";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): string | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: string | null | undefined): void {
        this._conTileFilter = value;
    }

    public checkHasActRadius(): boolean {
        return this._actRadius != null;
    }
    public getActRadius(): string | null | undefined {
        return this._actRadius;
    }
    public setActRadius(value: string | null | undefined): void {
        this._actRadius = value;
    }

    public checkHasActPriority(): boolean {
        return this._actPriority != null;
    }
    public getActPriority(): string | null | undefined {
        return this._actPriority;
    }
    public setActPriority(value: string | null | undefined): void {
        this._actPriority = value;
    }

    public checkHasActCanAffectSelf(): boolean {
        return this._actCanAffectSelf != null;
    }
    public getActCanAffectSelf(): string | null | undefined {
        return this._actCanAffectSelf;
    }
    public setActCanAffectSelf(value: string | null | undefined): void {
        this._actCanAffectSelf = value;
    }

    public checkHasActCanAffectAlly(): boolean {
        return this._actCanAffectAlly != null;
    }
    public getActCanAffectAlly(): string | null | undefined {
        return this._actCanAffectAlly;
    }
    public setActCanAffectAlly(value: string | null | undefined): void {
        this._actCanAffectAlly = value;
    }

    public checkHasActCanAffectEnemy(): boolean {
        return this._actCanAffectEnemy != null;
    }
    public getActCanAffectEnemy(): string | null | undefined {
        return this._actCanAffectEnemy;
    }
    public setActCanAffectEnemy(value: string | null | undefined): void {
        this._actCanAffectEnemy = value;
    }

    public checkHasActOffsetFund(): boolean {
        return this._actOffsetFund != null;
    }
    public getActOffsetFund(): string | null | undefined {
        return this._actOffsetFund;
    }
    public setActOffsetFund(value: string | null | undefined): void {
        this._actOffsetFund = value;
    }

    public checkHasActOffsetEnergyPercentage(): boolean {
        return this._actOffsetEnergyPercentage != null;
    }
    public getActOffsetEnergyPercentage(): string | null | undefined {
        return this._actOffsetEnergyPercentage;
    }
    public setActOffsetEnergyPercentage(value: string | null | undefined): void {
        this._actOffsetEnergyPercentage = value;
    }

    public checkHasActOffsetHp(): boolean {
        return this._actOffsetHp != null;
    }
    public getActOffsetHp(): string | null | undefined {
        return this._actOffsetHp;
    }
    public setActOffsetHp(value: string | null | undefined): void {
        this._actOffsetHp = value;
    }

    public checkHasActOffsetFuelPercentage(): boolean {
        return this._actOffsetFuelPercentage != null;
    }
    public getActOffsetFuelPercentage(): string | null | undefined {
        return this._actOffsetFuelPercentage;
    }
    public setActOffsetFuelPercentage(value: string | null | undefined): void {
        this._actOffsetFuelPercentage = value;
    }

    public checkHasActOffsetPrimaryAmmoPercentage(): boolean {
        return this._actOffsetPrimaryAmmoPercentage != null;
    }
    public getActOffsetPrimaryAmmoPercentage(): string | null | undefined {
        return this._actOffsetPrimaryAmmoPercentage;
    }
    public setActOffsetPrimaryAmmoPercentage(value: string | null | undefined): void {
        this._actOffsetPrimaryAmmoPercentage = value;
    }

    public checkHasActCanBeFatal(): boolean {
        return this._actCanBeFatal != null;
    }
    public getActCanBeFatal(): string | null | undefined {
        return this._actCanBeFatal;
    }
    public setActCanBeFatal(value: string | null | undefined): void {
        this._actCanBeFatal = value;
    }
}
