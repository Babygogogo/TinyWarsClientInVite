import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetViewpointSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actNeedFocusEffect?: boolean | null | undefined;
    actIsOneByOne?: boolean | null | undefined;
    actInterval?: number | null | undefined;
}

export class WeaSetViewpointSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actNeedFocusEffect?: boolean | null | undefined;
    private _actIsOneByOne?: boolean | null | undefined;
    private _actInterval?: number | null | undefined;

    public static fromJson(obj: WeaSetViewpointSimpleJson): WeaSetViewpointSimple {
        return new WeaSetViewpointSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetViewpointSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActNeedFocusEffect(obj.actNeedFocusEffect);
        this.setActIsOneByOne(obj.actIsOneByOne);
        this.setActInterval(obj.actInterval);
        return this;
    }
    public override toJson(obj?: WeaSetViewpointSimpleJson): WeaSetViewpointSimpleJson {
        obj ??= ({} as WeaSetViewpointSimpleJson);

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
            const value = this.getActNeedFocusEffect();
            (value != null) && (obj.actNeedFocusEffect = value);
        }

        {
            const value = this.getActIsOneByOne();
            (value != null) && (obj.actIsOneByOne = value);
        }

        {
            const value = this.getActInterval();
            (value != null) && (obj.actInterval = value);
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
            const value = this.getActNeedFocusEffect();
            if ((value != null) && (value != false)) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getActIsOneByOne();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getActInterval();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetViewpointSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetViewpointSimple();
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

                case 10:
                    msg.setActNeedFocusEffect(reader.bool());
                    break;

                case 11:
                    msg.setActIsOneByOne(reader.bool());
                    break;

                case 12:
                    msg.setActInterval(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetViewpointSimple {
        return WeaSetViewpointSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetViewpointSimple" {
        return "WeaSetViewpointSimple";
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

    public checkHasActNeedFocusEffect(): boolean {
        return this._actNeedFocusEffect != null;
    }
    public getActNeedFocusEffect(): boolean {
        return this._actNeedFocusEffect ?? false;
    }
    public setActNeedFocusEffect(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actNeedFocusEffect = null;
        } else {
            this._actNeedFocusEffect = value;
        }
    }

    public checkHasActIsOneByOne(): boolean {
        return this._actIsOneByOne != null;
    }
    public getActIsOneByOne(): boolean {
        return this._actIsOneByOne ?? false;
    }
    public setActIsOneByOne(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actIsOneByOne = null;
        } else {
            this._actIsOneByOne = value;
        }
    }

    public checkHasActInterval(): boolean {
        return this._actInterval != null;
    }
    public getActInterval(): number {
        return this._actInterval ?? 0;
    }
    public setActInterval(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actInterval = null;
        } else {
            this._actInterval = value;
        }
    }
}
