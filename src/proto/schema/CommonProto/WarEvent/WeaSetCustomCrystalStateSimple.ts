import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetCustomCrystalStateSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actRadius?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actPriority?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCanAffectSelf?: boolean | null | undefined;
    actCanAffectAlly?: boolean | null | undefined;
    actCanAffectEnemy?: boolean | null | undefined;
    actOffsetFund?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetEnergyPercentage?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetHp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetFuelPercentage?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actOffsetPrimaryAmmoPercentage?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCanBeFatal?: boolean | null | undefined;
}

export class WeaSetCustomCrystalStateSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actRadius?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actPriority?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCanAffectSelf?: boolean | null | undefined;
    private _actCanAffectAlly?: boolean | null | undefined;
    private _actCanAffectEnemy?: boolean | null | undefined;
    private _actOffsetFund?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetEnergyPercentage?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetHp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetFuelPercentage?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actOffsetPrimaryAmmoPercentage?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCanBeFatal?: boolean | null | undefined;

    public static fromJson(obj: WeaSetCustomCrystalStateSimpleJson): WeaSetCustomCrystalStateSimple {
        return new WeaSetCustomCrystalStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomCrystalStateSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActRadius(obj.actRadius != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRadius) : null);
        this.setActPriority(obj.actPriority != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actPriority) : null);
        this.setActCanAffectSelf(obj.actCanAffectSelf);
        this.setActCanAffectAlly(obj.actCanAffectAlly);
        this.setActCanAffectEnemy(obj.actCanAffectEnemy);
        this.setActOffsetFund(obj.actOffsetFund != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetFund) : null);
        this.setActOffsetEnergyPercentage(obj.actOffsetEnergyPercentage != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetEnergyPercentage) : null);
        this.setActOffsetHp(obj.actOffsetHp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetHp) : null);
        this.setActOffsetFuelPercentage(obj.actOffsetFuelPercentage != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetFuelPercentage) : null);
        this.setActOffsetPrimaryAmmoPercentage(obj.actOffsetPrimaryAmmoPercentage != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actOffsetPrimaryAmmoPercentage) : null);
        this.setActCanBeFatal(obj.actCanBeFatal);
        return this;
    }
    public override toJson(obj?: WeaSetCustomCrystalStateSimpleJson): WeaSetCustomCrystalStateSimpleJson {
        obj ??= ({} as WeaSetCustomCrystalStateSimpleJson);

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
            const value = this.getActRadius();
            (value != null) && (obj.actRadius = value.toJson());
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
            const value = this.getActOffsetFund();
            (value != null) && (obj.actOffsetFund = value.toJson());
        }

        {
            const value = this.getActOffsetEnergyPercentage();
            (value != null) && (obj.actOffsetEnergyPercentage = value.toJson());
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
            const value = this.getActRadius();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActPriority();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getActCanAffectSelf();
            if (value != null) {
                writer.uint32(104).bool(value);
            }
        }

        {
            const value = this.getActCanAffectAlly();
            if (value != null) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getActCanAffectEnemy();
            if (value != null) {
                writer.uint32(120).bool(value);
            }
        }

        {
            const value = this.getActOffsetFund();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetEnergyPercentage();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetHp();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetFuelPercentage();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        {
            const value = this.getActOffsetPrimaryAmmoPercentage();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getActCanBeFatal();
            if (value != null) {
                writer.uint32(168).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomCrystalStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomCrystalStateSimple();
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
                    msg.setActRadius($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActPriority($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setActCanAffectSelf(reader.bool());
                    break;

                case 14:
                    msg.setActCanAffectAlly(reader.bool());
                    break;

                case 15:
                    msg.setActCanAffectEnemy(reader.bool());
                    break;

                case 16:
                    msg.setActOffsetFund($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setActOffsetEnergyPercentage($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setActOffsetHp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setActOffsetFuelPercentage($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setActOffsetPrimaryAmmoPercentage($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setActCanBeFatal(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomCrystalStateSimple {
        return WeaSetCustomCrystalStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomCrystalStateSimple" {
        return "WeaSetCustomCrystalStateSimple";
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

    public checkHasActRadius(): boolean {
        return this._actRadius != null;
    }
    public getActRadius(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRadius;
    }
    public setActRadius(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRadius = value;
    }
    public createIfNotExistsActRadius(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRadius ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
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

    public checkHasActOffsetFund(): boolean {
        return this._actOffsetFund != null;
    }
    public getActOffsetFund(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actOffsetFund;
    }
    public setActOffsetFund(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actOffsetFund = value;
    }
    public createIfNotExistsActOffsetFund(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actOffsetFund ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActOffsetEnergyPercentage(): boolean {
        return this._actOffsetEnergyPercentage != null;
    }
    public getActOffsetEnergyPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actOffsetEnergyPercentage;
    }
    public setActOffsetEnergyPercentage(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actOffsetEnergyPercentage = value;
    }
    public createIfNotExistsActOffsetEnergyPercentage(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actOffsetEnergyPercentage ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
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
