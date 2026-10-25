import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../WarSerialization/SerialUnit.js";

export interface WeaFillUnitOnMapSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    actUnitData?: $Json$CommonProto$WarSerialization$SerialUnit | null | undefined;
    actIsInTurn?: boolean | null | undefined;
    actCanBeBlockedByUnit?: boolean | null | undefined;
    actNeedMovableTile?: boolean | null | undefined;
}

export class WeaFillUnitOnMapSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _actUnitData?: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined;
    private _actIsInTurn?: boolean | null | undefined;
    private _actCanBeBlockedByUnit?: boolean | null | undefined;
    private _actNeedMovableTile?: boolean | null | undefined;

    public static fromJson(obj: WeaFillUnitOnMapSimpleJson): WeaFillUnitOnMapSimple {
        return new WeaFillUnitOnMapSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaFillUnitOnMapSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setActUnitData(obj.actUnitData != null ? $Message$CommonProto$WarSerialization$SerialUnit.fromJson(obj.actUnitData) : null);
        this.setActIsInTurn(obj.actIsInTurn);
        this.setActCanBeBlockedByUnit(obj.actCanBeBlockedByUnit);
        this.setActNeedMovableTile(obj.actNeedMovableTile);
        return this;
    }
    public override toJson(obj?: WeaFillUnitOnMapSimpleJson): WeaFillUnitOnMapSimpleJson {
        obj ??= ({} as WeaFillUnitOnMapSimpleJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getActUnitData();
            (value != null) && (obj.actUnitData = value.toJson());
        }

        {
            const value = this.getActIsInTurn();
            (value != null) && (obj.actIsInTurn = value);
        }

        {
            const value = this.getActCanBeBlockedByUnit();
            (value != null) && (obj.actCanBeBlockedByUnit = value);
        }

        {
            const value = this.getActNeedMovableTile();
            (value != null) && (obj.actNeedMovableTile = value);
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
            const value = this.getActUnitData();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActIsInTurn();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getActCanBeBlockedByUnit();
            if ((value != null) && (value != false)) {
                writer.uint32(96).bool(value);
            }
        }

        {
            const value = this.getActNeedMovableTile();
            if ((value != null) && (value != false)) {
                writer.uint32(104).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaFillUnitOnMapSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaFillUnitOnMapSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setActUnitData($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActIsInTurn(reader.bool());
                    break;

                case 12:
                    msg.setActCanBeBlockedByUnit(reader.bool());
                    break;

                case 13:
                    msg.setActNeedMovableTile(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaFillUnitOnMapSimple {
        return WeaFillUnitOnMapSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaFillUnitOnMapSimple" {
        return "WeaFillUnitOnMapSimple";
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

    public checkHasActIsInTurn(): boolean {
        return this._actIsInTurn != null;
    }
    public getActIsInTurn(): boolean {
        return this._actIsInTurn ?? false;
    }
    public setActIsInTurn(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actIsInTurn = null;
        } else {
            this._actIsInTurn = value;
        }
    }

    public checkHasActCanBeBlockedByUnit(): boolean {
        return this._actCanBeBlockedByUnit != null;
    }
    public getActCanBeBlockedByUnit(): boolean {
        return this._actCanBeBlockedByUnit ?? false;
    }
    public setActCanBeBlockedByUnit(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actCanBeBlockedByUnit = null;
        } else {
            this._actCanBeBlockedByUnit = value;
        }
    }

    public checkHasActNeedMovableTile(): boolean {
        return this._actNeedMovableTile != null;
    }
    public getActNeedMovableTile(): boolean {
        return this._actNeedMovableTile ?? false;
    }
    public setActNeedMovableTile(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actNeedMovableTile = null;
        } else {
            this._actNeedMovableTile = value;
        }
    }
}
