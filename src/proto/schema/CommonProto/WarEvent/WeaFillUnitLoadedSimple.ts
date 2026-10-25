import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../WarSerialization/SerialUnit.js";

export interface WeaFillUnitLoadedSimpleJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    actUnitData?: $Json$CommonProto$WarSerialization$SerialUnit | null | undefined;
    actLoadCount?: number | null | undefined;
}

export class WeaFillUnitLoadedSimple extends $ProtoSchemaBase {
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _actUnitData?: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined;
    private _actLoadCount?: number | null | undefined;

    public static fromJson(obj: WeaFillUnitLoadedSimpleJson): WeaFillUnitLoadedSimple {
        return new WeaFillUnitLoadedSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaFillUnitLoadedSimpleJson): this {
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setActUnitData(obj.actUnitData != null ? $Message$CommonProto$WarSerialization$SerialUnit.fromJson(obj.actUnitData) : null);
        this.setActLoadCount(obj.actLoadCount);
        return this;
    }
    public override toJson(obj?: WeaFillUnitLoadedSimpleJson): WeaFillUnitLoadedSimpleJson {
        obj ??= ({} as WeaFillUnitLoadedSimpleJson);

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
            const value = this.getActUnitData();
            (value != null) && (obj.actUnitData = value.toJson());
        }

        {
            const value = this.getActLoadCount();
            (value != null) && (obj.actLoadCount = value);
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
            const value = this.getActUnitData();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActLoadCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaFillUnitLoadedSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaFillUnitLoadedSimple();
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
                    msg.setActUnitData($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActLoadCount(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaFillUnitLoadedSimple {
        return WeaFillUnitLoadedSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaFillUnitLoadedSimple" {
        return "WeaFillUnitLoadedSimple";
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

    public checkHasActUnitData(): boolean {
        return this._actUnitData != null;
    }
    public getActUnitData(): $Message$CommonProto$WarSerialization$SerialUnit | null | undefined {
        return this._actUnitData;
    }
    public setActUnitData(value: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined): void {
        this._actUnitData = value;
    }
    public createIfNotExistsActUnitData(): $Message$CommonProto$WarSerialization$SerialUnit {
        return this._actUnitData ??= new $Message$CommonProto$WarSerialization$SerialUnit();
    }

    public checkHasActLoadCount(): boolean {
        return this._actLoadCount != null;
    }
    public getActLoadCount(): number {
        return this._actLoadCount ?? 0;
    }
    public setActLoadCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actLoadCount = null;
        } else {
            this._actLoadCount = value;
        }
    }
}
