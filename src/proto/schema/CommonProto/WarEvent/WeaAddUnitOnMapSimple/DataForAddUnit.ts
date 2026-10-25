import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../../WarSerialization/SerialUnit.js";

export interface DataForAddUnitJson extends $ProtoSchemaJsonBase {
    unitData?: $Json$CommonProto$WarSerialization$SerialUnit | null | undefined;
    canBeBlockedByUnit?: boolean | null | undefined;
    needMovableTile?: boolean | null | undefined;
}

export class DataForAddUnit extends $ProtoSchemaBase {
    private _unitData?: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined;
    private _canBeBlockedByUnit?: boolean | null | undefined;
    private _needMovableTile?: boolean | null | undefined;

    public static fromJson(obj: DataForAddUnitJson): DataForAddUnit {
        return new DataForAddUnit().loadJson(obj);
    }
    public override loadJson(obj: DataForAddUnitJson): this {
        this.setUnitData(obj.unitData != null ? $Message$CommonProto$WarSerialization$SerialUnit.fromJson(obj.unitData) : null);
        this.setCanBeBlockedByUnit(obj.canBeBlockedByUnit);
        this.setNeedMovableTile(obj.needMovableTile);
        return this;
    }
    public override toJson(obj?: DataForAddUnitJson): DataForAddUnitJson {
        obj ??= ({} as DataForAddUnitJson);

        {
            const value = this.getUnitData();
            (value != null) && (obj.unitData = value.toJson());
        }

        {
            const value = this.getCanBeBlockedByUnit();
            (value != null) && (obj.canBeBlockedByUnit = value);
        }

        {
            const value = this.getNeedMovableTile();
            (value != null) && (obj.needMovableTile = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getCanBeBlockedByUnit();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getNeedMovableTile();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForAddUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForAddUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitData($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setCanBeBlockedByUnit(reader.bool());
                    break;

                case 3:
                    msg.setNeedMovableTile(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForAddUnit {
        return DataForAddUnit.decode(this.encode());
    }

    public override getSchemaName(): "DataForAddUnit" {
        return "DataForAddUnit";
    }

    public checkHasUnitData(): boolean {
        return this._unitData != null;
    }
    public getUnitData(): $Message$CommonProto$WarSerialization$SerialUnit | null | undefined {
        return this._unitData;
    }
    public setUnitData(value: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined): void {
        this._unitData = value;
    }
    public createIfNotExistsUnitData(): $Message$CommonProto$WarSerialization$SerialUnit {
        return this._unitData ??= new $Message$CommonProto$WarSerialization$SerialUnit();
    }

    public checkHasCanBeBlockedByUnit(): boolean {
        return this._canBeBlockedByUnit != null;
    }
    public getCanBeBlockedByUnit(): boolean | null | undefined {
        return this._canBeBlockedByUnit;
    }
    public setCanBeBlockedByUnit(value: boolean | null | undefined): void {
        this._canBeBlockedByUnit = value;
    }

    public checkHasNeedMovableTile(): boolean {
        return this._needMovableTile != null;
    }
    public getNeedMovableTile(): boolean | null | undefined {
        return this._needMovableTile;
    }
    public setNeedMovableTile(value: boolean | null | undefined): void {
        this._needMovableTile = value;
    }
}
