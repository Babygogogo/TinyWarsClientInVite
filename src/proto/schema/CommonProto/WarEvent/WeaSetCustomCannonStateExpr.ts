import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetCustomCannonStateExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    actRangeForUp?: string | null | undefined;
    actRangeForDown?: string | null | undefined;
    actRangeForLeft?: string | null | undefined;
    actRangeForRight?: string | null | undefined;
    actPriority?: string | null | undefined;
    actCanAffectSelf?: string | null | undefined;
    actCanAffectAlly?: string | null | undefined;
    actCanAffectEnemy?: string | null | undefined;
    actMaxTargetCount?: string | null | undefined;
    actOffsetHp?: string | null | undefined;
    actOffsetFuelPercentage?: string | null | undefined;
    actOffsetPrimaryAmmoPercentage?: string | null | undefined;
    actCanBeFatal?: string | null | undefined;
}

export class WeaSetCustomCannonStateExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _actRangeForUp?: string | null | undefined;
    private _actRangeForDown?: string | null | undefined;
    private _actRangeForLeft?: string | null | undefined;
    private _actRangeForRight?: string | null | undefined;
    private _actPriority?: string | null | undefined;
    private _actCanAffectSelf?: string | null | undefined;
    private _actCanAffectAlly?: string | null | undefined;
    private _actCanAffectEnemy?: string | null | undefined;
    private _actMaxTargetCount?: string | null | undefined;
    private _actOffsetHp?: string | null | undefined;
    private _actOffsetFuelPercentage?: string | null | undefined;
    private _actOffsetPrimaryAmmoPercentage?: string | null | undefined;
    private _actCanBeFatal?: string | null | undefined;

    public static fromJson(obj: WeaSetCustomCannonStateExprJson): WeaSetCustomCannonStateExpr {
        return new WeaSetCustomCannonStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomCannonStateExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setActRangeForUp(obj.actRangeForUp);
        this.setActRangeForDown(obj.actRangeForDown);
        this.setActRangeForLeft(obj.actRangeForLeft);
        this.setActRangeForRight(obj.actRangeForRight);
        this.setActPriority(obj.actPriority);
        this.setActCanAffectSelf(obj.actCanAffectSelf);
        this.setActCanAffectAlly(obj.actCanAffectAlly);
        this.setActCanAffectEnemy(obj.actCanAffectEnemy);
        this.setActMaxTargetCount(obj.actMaxTargetCount);
        this.setActOffsetHp(obj.actOffsetHp);
        this.setActOffsetFuelPercentage(obj.actOffsetFuelPercentage);
        this.setActOffsetPrimaryAmmoPercentage(obj.actOffsetPrimaryAmmoPercentage);
        this.setActCanBeFatal(obj.actCanBeFatal);
        return this;
    }
    public override toJson(obj?: WeaSetCustomCannonStateExprJson): WeaSetCustomCannonStateExprJson {
        obj ??= ({} as WeaSetCustomCannonStateExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getActRangeForUp();
            (value != null) && (obj.actRangeForUp = value);
        }

        {
            const value = this.getActRangeForDown();
            (value != null) && (obj.actRangeForDown = value);
        }

        {
            const value = this.getActRangeForLeft();
            (value != null) && (obj.actRangeForLeft = value);
        }

        {
            const value = this.getActRangeForRight();
            (value != null) && (obj.actRangeForRight = value);
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
            const value = this.getActMaxTargetCount();
            (value != null) && (obj.actMaxTargetCount = value);
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
            const value = this.getActRangeForUp();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActRangeForDown();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActRangeForLeft();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActRangeForRight();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActPriority();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActCanAffectSelf();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActCanAffectAlly();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getActCanAffectEnemy();
            if (value != null) {
                writer.uint32(146).string(value);
            }
        }

        {
            const value = this.getActMaxTargetCount();
            if (value != null) {
                writer.uint32(154).string(value);
            }
        }

        {
            const value = this.getActOffsetHp();
            if (value != null) {
                writer.uint32(162).string(value);
            }
        }

        {
            const value = this.getActOffsetFuelPercentage();
            if (value != null) {
                writer.uint32(170).string(value);
            }
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            if (value != null) {
                writer.uint32(178).string(value);
            }
        }

        {
            const value = this.getActCanBeFatal();
            if (value != null) {
                writer.uint32(186).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomCannonStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomCannonStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 11:
                    msg.setActRangeForUp(reader.string());
                    break;

                case 12:
                    msg.setActRangeForDown(reader.string());
                    break;

                case 13:
                    msg.setActRangeForLeft(reader.string());
                    break;

                case 14:
                    msg.setActRangeForRight(reader.string());
                    break;

                case 15:
                    msg.setActPriority(reader.string());
                    break;

                case 16:
                    msg.setActCanAffectSelf(reader.string());
                    break;

                case 17:
                    msg.setActCanAffectAlly(reader.string());
                    break;

                case 18:
                    msg.setActCanAffectEnemy(reader.string());
                    break;

                case 19:
                    msg.setActMaxTargetCount(reader.string());
                    break;

                case 20:
                    msg.setActOffsetHp(reader.string());
                    break;

                case 21:
                    msg.setActOffsetFuelPercentage(reader.string());
                    break;

                case 22:
                    msg.setActOffsetPrimaryAmmoPercentage(reader.string());
                    break;

                case 23:
                    msg.setActCanBeFatal(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomCannonStateExpr {
        return WeaSetCustomCannonStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomCannonStateExpr" {
        return "WeaSetCustomCannonStateExpr";
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

    public checkHasActRangeForUp(): boolean {
        return this._actRangeForUp != null;
    }
    public getActRangeForUp(): string | null | undefined {
        return this._actRangeForUp;
    }
    public setActRangeForUp(value: string | null | undefined): void {
        this._actRangeForUp = value;
    }

    public checkHasActRangeForDown(): boolean {
        return this._actRangeForDown != null;
    }
    public getActRangeForDown(): string | null | undefined {
        return this._actRangeForDown;
    }
    public setActRangeForDown(value: string | null | undefined): void {
        this._actRangeForDown = value;
    }

    public checkHasActRangeForLeft(): boolean {
        return this._actRangeForLeft != null;
    }
    public getActRangeForLeft(): string | null | undefined {
        return this._actRangeForLeft;
    }
    public setActRangeForLeft(value: string | null | undefined): void {
        this._actRangeForLeft = value;
    }

    public checkHasActRangeForRight(): boolean {
        return this._actRangeForRight != null;
    }
    public getActRangeForRight(): string | null | undefined {
        return this._actRangeForRight;
    }
    public setActRangeForRight(value: string | null | undefined): void {
        this._actRangeForRight = value;
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

    public checkHasActMaxTargetCount(): boolean {
        return this._actMaxTargetCount != null;
    }
    public getActMaxTargetCount(): string | null | undefined {
        return this._actMaxTargetCount;
    }
    public setActMaxTargetCount(value: string | null | undefined): void {
        this._actMaxTargetCount = value;
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
