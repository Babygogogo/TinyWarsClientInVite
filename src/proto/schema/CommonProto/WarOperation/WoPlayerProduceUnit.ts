import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { ExtraDataForPlayerProduceUnit as $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit, type ExtraDataForPlayerProduceUnitJson as $Json$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit } from "./WoPlayerProduceUnit/ExtraDataForPlayerProduceUnit.js";

export interface WoPlayerProduceUnitJson extends $ProtoSchemaJsonBase {
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    unitType?: number | null | undefined;
    unitHp?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit | null | undefined;
}

export class WoPlayerProduceUnit extends $ProtoSchemaBase {
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _unitType?: number | null | undefined;
    private _unitHp?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit | null | undefined;

    public static fromJson(obj: WoPlayerProduceUnitJson): WoPlayerProduceUnit {
        return new WoPlayerProduceUnit().loadJson(obj);
    }
    public override loadJson(obj: WoPlayerProduceUnitJson): this {
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setUnitType(obj.unitType);
        this.setUnitHp(obj.unitHp);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoPlayerProduceUnitJson): WoPlayerProduceUnitJson {
        obj ??= ({} as WoPlayerProduceUnitJson);

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
        }

        {
            const value = this.getUnitType();
            (value != null) && (obj.unitType = value);
        }

        {
            const value = this.getUnitHp();
            (value != null) && (obj.unitHp = value);
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getUnitType();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUnitHp();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoPlayerProduceUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoPlayerProduceUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setUnitType(reader.int32());
                    break;

                case 3:
                    msg.setUnitHp(reader.int32());
                    break;

                case 4:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoPlayerProduceUnit {
        return WoPlayerProduceUnit.decode(this.encode());
    }

    public override getSchemaName(): "WoPlayerProduceUnit" {
        return "WoPlayerProduceUnit";
    }

    public checkHasGridIndex(): boolean {
        return this._gridIndex != null;
    }
    public getGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._gridIndex;
    }
    public setGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._gridIndex = value;
    }
    public createIfNotExistsGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._gridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasUnitType(): boolean {
        return this._unitType != null;
    }
    public getUnitType(): number | null | undefined {
        return this._unitType;
    }
    public setUnitType(value: number | null | undefined): void {
        this._unitType = value;
    }

    public checkHasUnitHp(): boolean {
        return this._unitHp != null;
    }
    public getUnitHp(): number | null | undefined {
        return this._unitHp;
    }
    public setUnitHp(value: number | null | undefined): void {
        this._unitHp = value;
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoPlayerProduceUnit$ExtraDataForPlayerProduceUnit();
    }
}
