import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileCustomLaserTurretDataJson extends $ProtoSchemaJsonBase {
    rangeForUp?: number | null | undefined;
    rangeForDown?: number | null | undefined;
    rangeForLeft?: number | null | undefined;
    rangeForRight?: number | null | undefined;
    priority?: number | null | undefined;
    canAffectSelf?: boolean | null | undefined;
    canAffectAlly?: boolean | null | undefined;
    canAffectEnemy?: boolean | null | undefined;
    offsetHp?: number | null | undefined;
    offsetFuelPercentage?: number | null | undefined;
    offsetPrimaryAmmoPercentage?: number | null | undefined;
    canBeFatal?: boolean | null | undefined;
}

export class TileCustomLaserTurretData extends $ProtoSchemaBase {
    private _rangeForUp?: number | null | undefined;
    private _rangeForDown?: number | null | undefined;
    private _rangeForLeft?: number | null | undefined;
    private _rangeForRight?: number | null | undefined;
    private _priority?: number | null | undefined;
    private _canAffectSelf?: boolean | null | undefined;
    private _canAffectAlly?: boolean | null | undefined;
    private _canAffectEnemy?: boolean | null | undefined;
    private _offsetHp?: number | null | undefined;
    private _offsetFuelPercentage?: number | null | undefined;
    private _offsetPrimaryAmmoPercentage?: number | null | undefined;
    private _canBeFatal?: boolean | null | undefined;

    public static fromJson(obj: TileCustomLaserTurretDataJson): TileCustomLaserTurretData {
        return new TileCustomLaserTurretData().loadJson(obj);
    }
    public override loadJson(obj: TileCustomLaserTurretDataJson): this {
        this.setRangeForUp(obj.rangeForUp);
        this.setRangeForDown(obj.rangeForDown);
        this.setRangeForLeft(obj.rangeForLeft);
        this.setRangeForRight(obj.rangeForRight);
        this.setPriority(obj.priority);
        this.setCanAffectSelf(obj.canAffectSelf);
        this.setCanAffectAlly(obj.canAffectAlly);
        this.setCanAffectEnemy(obj.canAffectEnemy);
        this.setOffsetHp(obj.offsetHp);
        this.setOffsetFuelPercentage(obj.offsetFuelPercentage);
        this.setOffsetPrimaryAmmoPercentage(obj.offsetPrimaryAmmoPercentage);
        this.setCanBeFatal(obj.canBeFatal);
        return this;
    }
    public override toJson(obj?: TileCustomLaserTurretDataJson): TileCustomLaserTurretDataJson {
        obj ??= ({} as TileCustomLaserTurretDataJson);

        {
            const value = this.getRangeForUp();
            (value != null) && (obj.rangeForUp = value);
        }

        {
            const value = this.getRangeForDown();
            (value != null) && (obj.rangeForDown = value);
        }

        {
            const value = this.getRangeForLeft();
            (value != null) && (obj.rangeForLeft = value);
        }

        {
            const value = this.getRangeForRight();
            (value != null) && (obj.rangeForRight = value);
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
            const value = this.getRangeForUp();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRangeForDown();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRangeForLeft();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getRangeForRight();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getPriority();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCanAffectSelf();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getCanAffectAlly();
            if ((value != null) && (value != false)) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getCanAffectEnemy();
            if ((value != null) && (value != false)) {
                writer.uint32(64).bool(value);
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileCustomLaserTurretData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileCustomLaserTurretData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRangeForUp(reader.int32());
                    break;

                case 2:
                    msg.setRangeForDown(reader.int32());
                    break;

                case 3:
                    msg.setRangeForLeft(reader.int32());
                    break;

                case 4:
                    msg.setRangeForRight(reader.int32());
                    break;

                case 5:
                    msg.setPriority(reader.int32());
                    break;

                case 6:
                    msg.setCanAffectSelf(reader.bool());
                    break;

                case 7:
                    msg.setCanAffectAlly(reader.bool());
                    break;

                case 8:
                    msg.setCanAffectEnemy(reader.bool());
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

    public override clone(): TileCustomLaserTurretData {
        return TileCustomLaserTurretData.decode(this.encode());
    }

    public override getSchemaName(): "TileCustomLaserTurretData" {
        return "TileCustomLaserTurretData";
    }

    public checkHasRangeForUp(): boolean {
        return this._rangeForUp != null;
    }
    public getRangeForUp(): number {
        return this._rangeForUp ?? 0;
    }
    public setRangeForUp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeForUp = null;
        } else {
            this._rangeForUp = value;
        }
    }

    public checkHasRangeForDown(): boolean {
        return this._rangeForDown != null;
    }
    public getRangeForDown(): number {
        return this._rangeForDown ?? 0;
    }
    public setRangeForDown(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeForDown = null;
        } else {
            this._rangeForDown = value;
        }
    }

    public checkHasRangeForLeft(): boolean {
        return this._rangeForLeft != null;
    }
    public getRangeForLeft(): number {
        return this._rangeForLeft ?? 0;
    }
    public setRangeForLeft(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeForLeft = null;
        } else {
            this._rangeForLeft = value;
        }
    }

    public checkHasRangeForRight(): boolean {
        return this._rangeForRight != null;
    }
    public getRangeForRight(): number {
        return this._rangeForRight ?? 0;
    }
    public setRangeForRight(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeForRight = null;
        } else {
            this._rangeForRight = value;
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
