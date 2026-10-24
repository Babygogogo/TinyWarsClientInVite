import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UnitCustomName as $Message$CommonProto$Structure$UnitCustomName, type UnitCustomNameJson as $Json$CommonProto$Structure$UnitCustomName } from "../Structure/UnitCustomName.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "./SerialUnit.js";

export interface SerialUnitMapJson extends $ProtoSchemaJsonBase {
    nextUnitId?: number | null | undefined;
    units: $Json$CommonProto$WarSerialization$SerialUnit[];
    unitCustomNameArray: $Json$CommonProto$Structure$UnitCustomName[];
}

export class SerialUnitMap extends $ProtoSchemaBase {
    private _nextUnitId?: number | null | undefined;
    private _units: $Message$CommonProto$WarSerialization$SerialUnit[] = [];
    private _unitCustomNameArray: $Message$CommonProto$Structure$UnitCustomName[] = [];

    public static fromJson(obj: SerialUnitMapJson): SerialUnitMap {
        return new SerialUnitMap().loadJson(obj);
    }
    public override loadJson(obj: SerialUnitMapJson): this {
        this.setNextUnitId(obj.nextUnitId);
        this.setUnits(obj.units?.map(v => $Message$CommonProto$WarSerialization$SerialUnit.fromJson(v)) ?? []);
        this.setUnitCustomNameArray(obj.unitCustomNameArray?.map(v => $Message$CommonProto$Structure$UnitCustomName.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialUnitMapJson): SerialUnitMapJson {
        obj ??= ({} as SerialUnitMapJson);

        {
            const value = this.getNextUnitId();
            (value != null) && (obj.nextUnitId = value);
        }

        {
            obj.units = this.getUnits().map(v => v.toJson());
        }

        {
            obj.unitCustomNameArray = this.getUnitCustomNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNextUnitId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnits();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitCustomNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialUnitMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialUnitMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNextUnitId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._units;
                        arr.push($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._unitCustomNameArray;
                        arr.push($Message$CommonProto$Structure$UnitCustomName.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialUnitMap {
        return SerialUnitMap.decode(this.encode());
    }

    public override getSchemaName(): "SerialUnitMap" {
        return "SerialUnitMap";
    }

    public checkHasNextUnitId(): boolean {
        return this._nextUnitId != null;
    }
    public getNextUnitId(): number {
        return this._nextUnitId ?? 0;
    }
    public setNextUnitId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nextUnitId = null;
        } else {
            this._nextUnitId = value;
        }
    }

    public getUnits(): $Message$CommonProto$WarSerialization$SerialUnit[] {
        return this._units;
    }
    public setUnits(value: $Message$CommonProto$WarSerialization$SerialUnit[]): void {
        this._units = value;
    }

    public getUnitCustomNameArray(): $Message$CommonProto$Structure$UnitCustomName[] {
        return this._unitCustomNameArray;
    }
    public setUnitCustomNameArray(value: $Message$CommonProto$Structure$UnitCustomName[]): void {
        this._unitCustomNameArray = value;
    }
}
