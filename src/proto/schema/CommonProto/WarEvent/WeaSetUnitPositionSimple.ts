import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";

export interface WeaSetUnitPositionSimpleJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    actTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    actPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
}

export class WeaSetUnitPositionSimple extends $ProtoSchemaBase {
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _actTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _actPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;

    public static fromJson(obj: WeaSetUnitPositionSimpleJson): WeaSetUnitPositionSimple {
        return new WeaSetUnitPositionSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitPositionSimpleJson): this {
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setActTileFilter(obj.actTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.actTileFilter) : null);
        this.setActPlayerFilter(obj.actPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.actPlayerFilter) : null);
        return this;
    }
    public override toJson(obj?: WeaSetUnitPositionSimpleJson): WeaSetUnitPositionSimpleJson {
        obj ??= ({} as WeaSetUnitPositionSimpleJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value.toJson());
        }

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value.toJson());
        }

        {
            const value = this.getActTileFilter();
            (value != null) && (obj.actTileFilter = value.toJson());
        }

        {
            const value = this.getActPlayerFilter();
            (value != null) && (obj.actPlayerFilter = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getActTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitPositionSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitPositionSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setActTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitPositionSimple {
        return WeaSetUnitPositionSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitPositionSimple" {
        return "WeaSetUnitPositionSimple";
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

    public checkHasActTileFilter(): boolean {
        return this._actTileFilter != null;
    }
    public getActTileFilter(): $Message$CommonProto$Structure$TileFilter | null | undefined {
        return this._actTileFilter;
    }
    public setActTileFilter(value: $Message$CommonProto$Structure$TileFilter | null | undefined): void {
        this._actTileFilter = value;
    }
    public createIfNotExistsActTileFilter(): $Message$CommonProto$Structure$TileFilter {
        return this._actTileFilter ??= new $Message$CommonProto$Structure$TileFilter();
    }

    public checkHasActPlayerFilter(): boolean {
        return this._actPlayerFilter != null;
    }
    public getActPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter | null | undefined {
        return this._actPlayerFilter;
    }
    public setActPlayerFilter(value: $Message$CommonProto$Structure$PlayerFilter | null | undefined): void {
        this._actPlayerFilter = value;
    }
    public createIfNotExistsActPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter {
        return this._actPlayerFilter ??= new $Message$CommonProto$Structure$PlayerFilter();
    }
}
