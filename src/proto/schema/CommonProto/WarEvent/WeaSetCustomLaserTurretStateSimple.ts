import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetCustomLaserTurretStateSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actRangeForUp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actRangeForDown?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actRangeForLeft?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actRangeForRight?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actPriority?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCanAffectSelf?: boolean | null | undefined;
    actCanAffectAlly?: boolean | null | undefined;
    actCanAffectEnemy?: boolean | null | undefined;
    actOffsetHp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetFuelPercentage?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetPrimaryAmmoPercentage?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCanBeFatal?: boolean | null | undefined;
}

export class WeaSetCustomLaserTurretStateSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actRangeForUp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actRangeForDown?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actRangeForLeft?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actRangeForRight?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actPriority?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCanAffectSelf?: boolean | null | undefined;
    private _actCanAffectAlly?: boolean | null | undefined;
    private _actCanAffectEnemy?: boolean | null | undefined;
    private _actOffsetHp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetFuelPercentage?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetPrimaryAmmoPercentage?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCanBeFatal?: boolean | null | undefined;

    public static fromJson(obj: WeaSetCustomLaserTurretStateSimpleJson): WeaSetCustomLaserTurretStateSimple {
        return new WeaSetCustomLaserTurretStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomLaserTurretStateSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActRangeForUp(obj.actRangeForUp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRangeForUp) : null);
        this.setActRangeForDown(obj.actRangeForDown != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRangeForDown) : null);
        this.setActRangeForLeft(obj.actRangeForLeft != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRangeForLeft) : null);
        this.setActRangeForRight(obj.actRangeForRight != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRangeForRight) : null);
        this.setActPriority(obj.actPriority != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actPriority) : null);
        this.setActCanAffectSelf(obj.actCanAffectSelf);
        this.setActCanAffectAlly(obj.actCanAffectAlly);
        this.setActCanAffectEnemy(obj.actCanAffectEnemy);
        this.setActOffsetHp(obj.actOffsetHp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetHp) : null);
        this.setActOffsetFuelPercentage(obj.actOffsetFuelPercentage != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetFuelPercentage) : null);
        this.setActOffsetPrimaryAmmoPercentage(obj.actOffsetPrimaryAmmoPercentage != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetPrimaryAmmoPercentage) : null);
        this.setActCanBeFatal(obj.actCanBeFatal);
        return this;
    }
    public override toJson(obj?: WeaSetCustomLaserTurretStateSimpleJson): WeaSetCustomLaserTurretStateSimpleJson {
        obj ??= ({} as WeaSetCustomLaserTurretStateSimpleJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value.toJson());
        }

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value.toJson());
        }

        {
            const value = this.getConUnitComparator();
            (value != null) && (obj.conUnitComparator = value.toJson());
        }

        {
            const value = this.getActRangeForUp();
            (value != null) && (obj.actRangeForUp = value.toJson());
        }

        {
            const value = this.getActRangeForDown();
            (value != null) && (obj.actRangeForDown = value.toJson());
        }

        {
            const value = this.getActRangeForLeft();
            (value != null) && (obj.actRangeForLeft = value.toJson());
        }

        {
            const value = this.getActRangeForRight();
            (value != null) && (obj.actRangeForRight = value.toJson());
        }

        {
            const value = this.getActPriority();
            (value != null) && (obj.actPriority = value.toJson());
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
            const value = this.getActOffsetHp();
            (value != null) && (obj.actOffsetHp = value.toJson());
        }

        {
            const value = this.getActOffsetFuelPercentage();
            (value != null) && (obj.actOffsetFuelPercentage = value.toJson());
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            (value != null) && (obj.actOffsetPrimaryAmmoPercentage = value.toJson());
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
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitComparator();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getActRangeForUp();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActRangeForDown();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getActRangeForLeft();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getActRangeForRight();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getActPriority();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getActCanAffectSelf();
            if (value != null) {
                writer.uint32(128).bool(value);
            }
        }

        {
            const value = this.getActCanAffectAlly();
            if (value != null) {
                writer.uint32(136).bool(value);
            }
        }

        {
            const value = this.getActCanAffectEnemy();
            if (value != null) {
                writer.uint32(144).bool(value);
            }
        }

        {
            const value = this.getActOffsetHp();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetFuelPercentage();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getActCanBeFatal();
            if (value != null) {
                writer.uint32(184).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomLaserTurretStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomLaserTurretStateSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConUnitComparator($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActRangeForUp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActRangeForDown($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setActRangeForLeft($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setActRangeForRight($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setActPriority($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setActCanAffectSelf(reader.bool());
                    break;

                case 17:
                    msg.setActCanAffectAlly(reader.bool());
                    break;

                case 18:
                    msg.setActCanAffectEnemy(reader.bool());
                    break;

                case 20:
                    msg.setActOffsetHp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setActOffsetFuelPercentage($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 22:
                    msg.setActOffsetPrimaryAmmoPercentage($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setActCanBeFatal(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomLaserTurretStateSimple {
        return WeaSetCustomLaserTurretStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomLaserTurretStateSimple" {
        return "WeaSetCustomLaserTurretStateSimple";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): $Message$CommonProto$Structure$TileFilter | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: $Message$CommonProto$Structure$TileFilter | null | undefined): void {
        this._conTileFilter = value;
    }
    public createIfNotExistsConTileFilter(): $Message$CommonProto$Structure$TileFilter {
        return this._conTileFilter ??= new $Message$CommonProto$Structure$TileFilter();
    }

    public checkHasConPlayerFilter(): boolean {
        return this._conPlayerFilter != null;
    }
    public getConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter | null | undefined {
        return this._conPlayerFilter;
    }
    public setConPlayerFilter(value: $Message$CommonProto$Structure$PlayerFilter | null | undefined): void {
        this._conPlayerFilter = value;
    }
    public createIfNotExistsConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter {
        return this._conPlayerFilter ??= new $Message$CommonProto$Structure$PlayerFilter();
    }

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): $Message$CommonProto$Structure$UnitFilter | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: $Message$CommonProto$Structure$UnitFilter | null | undefined): void {
        this._conUnitFilter = value;
    }
    public createIfNotExistsConUnitFilter(): $Message$CommonProto$Structure$UnitFilter {
        return this._conUnitFilter ??= new $Message$CommonProto$Structure$UnitFilter();
    }

    public checkHasConUnitComparator(): boolean {
        return this._conUnitComparator != null;
    }
    public getConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conUnitComparator;
    }
    public setConUnitComparator(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conUnitComparator = value;
    }
    public createIfNotExistsConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conUnitComparator ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasActRangeForUp(): boolean {
        return this._actRangeForUp != null;
    }
    public getActRangeForUp(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRangeForUp;
    }
    public setActRangeForUp(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRangeForUp = value;
    }
    public createIfNotExistsActRangeForUp(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRangeForUp ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActRangeForDown(): boolean {
        return this._actRangeForDown != null;
    }
    public getActRangeForDown(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRangeForDown;
    }
    public setActRangeForDown(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRangeForDown = value;
    }
    public createIfNotExistsActRangeForDown(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRangeForDown ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActRangeForLeft(): boolean {
        return this._actRangeForLeft != null;
    }
    public getActRangeForLeft(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRangeForLeft;
    }
    public setActRangeForLeft(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRangeForLeft = value;
    }
    public createIfNotExistsActRangeForLeft(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRangeForLeft ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActRangeForRight(): boolean {
        return this._actRangeForRight != null;
    }
    public getActRangeForRight(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRangeForRight;
    }
    public setActRangeForRight(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRangeForRight = value;
    }
    public createIfNotExistsActRangeForRight(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRangeForRight ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActPriority(): boolean {
        return this._actPriority != null;
    }
    public getActPriority(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actPriority;
    }
    public setActPriority(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actPriority = value;
    }
    public createIfNotExistsActPriority(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actPriority ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCanAffectSelf(): boolean {
        return this._actCanAffectSelf != null;
    }
    public getActCanAffectSelf(): boolean | null | undefined {
        return this._actCanAffectSelf;
    }
    public setActCanAffectSelf(value: boolean | null | undefined): void {
        this._actCanAffectSelf = value;
    }

    public checkHasActCanAffectAlly(): boolean {
        return this._actCanAffectAlly != null;
    }
    public getActCanAffectAlly(): boolean | null | undefined {
        return this._actCanAffectAlly;
    }
    public setActCanAffectAlly(value: boolean | null | undefined): void {
        this._actCanAffectAlly = value;
    }

    public checkHasActCanAffectEnemy(): boolean {
        return this._actCanAffectEnemy != null;
    }
    public getActCanAffectEnemy(): boolean | null | undefined {
        return this._actCanAffectEnemy;
    }
    public setActCanAffectEnemy(value: boolean | null | undefined): void {
        this._actCanAffectEnemy = value;
    }

    public checkHasActOffsetHp(): boolean {
        return this._actOffsetHp != null;
    }
    public getActOffsetHp(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actOffsetHp;
    }
    public setActOffsetHp(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actOffsetHp = value;
    }
    public createIfNotExistsActOffsetHp(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actOffsetHp ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActOffsetFuelPercentage(): boolean {
        return this._actOffsetFuelPercentage != null;
    }
    public getActOffsetFuelPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actOffsetFuelPercentage;
    }
    public setActOffsetFuelPercentage(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actOffsetFuelPercentage = value;
    }
    public createIfNotExistsActOffsetFuelPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actOffsetFuelPercentage ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActOffsetPrimaryAmmoPercentage(): boolean {
        return this._actOffsetPrimaryAmmoPercentage != null;
    }
    public getActOffsetPrimaryAmmoPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actOffsetPrimaryAmmoPercentage;
    }
    public setActOffsetPrimaryAmmoPercentage(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actOffsetPrimaryAmmoPercentage = value;
    }
    public createIfNotExistsActOffsetPrimaryAmmoPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actOffsetPrimaryAmmoPercentage ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCanBeFatal(): boolean {
        return this._actCanBeFatal != null;
    }
    public getActCanBeFatal(): boolean | null | undefined {
        return this._actCanBeFatal;
    }
    public setActCanBeFatal(value: boolean | null | undefined): void {
        this._actCanBeFatal = value;
    }
}
