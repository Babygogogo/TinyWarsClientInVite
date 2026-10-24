import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { ExtraDataForPlayerDeleteUnit as $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit, type ExtraDataForPlayerDeleteUnitJson as $Json$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit } from "./WoPlayerDeleteUnit/ExtraDataForPlayerDeleteUnit.js";

export interface WoPlayerDeleteUnitJson extends $ProtoSchemaJsonBase {
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit | null | undefined;
}

export class WoPlayerDeleteUnit extends $ProtoSchemaBase {
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit | null | undefined;

    public static fromJson(obj: WoPlayerDeleteUnitJson): WoPlayerDeleteUnit {
        return new WoPlayerDeleteUnit().loadJson(obj);
    }
    public override loadJson(obj: WoPlayerDeleteUnitJson): this {
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoPlayerDeleteUnitJson): WoPlayerDeleteUnitJson {
        obj ??= ({} as WoPlayerDeleteUnitJson);

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
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
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoPlayerDeleteUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoPlayerDeleteUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoPlayerDeleteUnit {
        return WoPlayerDeleteUnit.decode(this.encode());
    }

    public override getSchemaName(): "WoPlayerDeleteUnit" {
        return "WoPlayerDeleteUnit";
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

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoPlayerDeleteUnit$ExtraDataForPlayerDeleteUnit();
    }
}
