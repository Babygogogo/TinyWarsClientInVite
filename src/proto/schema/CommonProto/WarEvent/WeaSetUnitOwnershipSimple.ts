import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";

export interface WeaSetUnitOwnershipSimpleJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    actPlayerIndex?: number | null | undefined;
}

export class WeaSetUnitOwnershipSimple extends $ProtoSchemaBase {
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _actPlayerIndex?: number | null | undefined;

    public static fromJson(obj: WeaSetUnitOwnershipSimpleJson): WeaSetUnitOwnershipSimple {
        return new WeaSetUnitOwnershipSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitOwnershipSimpleJson): this {
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setActPlayerIndex(obj.actPlayerIndex);
        return this;
    }
    public override toJson(obj?: WeaSetUnitOwnershipSimpleJson): WeaSetUnitOwnershipSimpleJson {
        obj ??= ({} as WeaSetUnitOwnershipSimpleJson);

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
            const value = this.getActPlayerIndex();
            (value != null) && (obj.actPlayerIndex = value);
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
            const value = this.getActPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitOwnershipSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitOwnershipSimple();
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
                    msg.setActPlayerIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitOwnershipSimple {
        return WeaSetUnitOwnershipSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitOwnershipSimple" {
        return "WeaSetUnitOwnershipSimple";
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

    public checkHasActPlayerIndex(): boolean {
        return this._actPlayerIndex != null;
    }
    public getActPlayerIndex(): number {
        return this._actPlayerIndex ?? 0;
    }
    public setActPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actPlayerIndex = null;
        } else {
            this._actPlayerIndex = value;
        }
    }
}
