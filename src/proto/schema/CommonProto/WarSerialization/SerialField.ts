import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SerialFogMap as $Message$CommonProto$WarSerialization$SerialFogMap, type SerialFogMapJson as $Json$CommonProto$WarSerialization$SerialFogMap } from "./SerialFogMap.js";
import { SerialTileMap as $Message$CommonProto$WarSerialization$SerialTileMap, type SerialTileMapJson as $Json$CommonProto$WarSerialization$SerialTileMap } from "./SerialTileMap.js";
import { SerialUnitMap as $Message$CommonProto$WarSerialization$SerialUnitMap, type SerialUnitMapJson as $Json$CommonProto$WarSerialization$SerialUnitMap } from "./SerialUnitMap.js";

export interface SerialFieldJson extends $ProtoSchemaJsonBase {
    fogMap?: $Json$CommonProto$WarSerialization$SerialFogMap | null | undefined;
    tileMap?: $Json$CommonProto$WarSerialization$SerialTileMap | null | undefined;
    unitMap?: $Json$CommonProto$WarSerialization$SerialUnitMap | null | undefined;
}

export class SerialField extends $ProtoSchemaBase {
    private _fogMap?: $Message$CommonProto$WarSerialization$SerialFogMap | null | undefined;
    private _tileMap?: $Message$CommonProto$WarSerialization$SerialTileMap | null | undefined;
    private _unitMap?: $Message$CommonProto$WarSerialization$SerialUnitMap | null | undefined;

    public static fromJson(obj: SerialFieldJson): SerialField {
        return new SerialField().loadJson(obj);
    }
    public override loadJson(obj: SerialFieldJson): this {
        this.setFogMap(obj.fogMap != null ? $Message$CommonProto$WarSerialization$SerialFogMap.fromJson(obj.fogMap) : null);
        this.setTileMap(obj.tileMap != null ? $Message$CommonProto$WarSerialization$SerialTileMap.fromJson(obj.tileMap) : null);
        this.setUnitMap(obj.unitMap != null ? $Message$CommonProto$WarSerialization$SerialUnitMap.fromJson(obj.unitMap) : null);
        return this;
    }
    public override toJson(obj?: SerialFieldJson): SerialFieldJson {
        obj ??= ({} as SerialFieldJson);

        {
            const value = this.getFogMap();
            (value != null) && (obj.fogMap = value.toJson());
        }

        {
            const value = this.getTileMap();
            (value != null) && (obj.tileMap = value.toJson());
        }

        {
            const value = this.getUnitMap();
            (value != null) && (obj.unitMap = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getFogMap();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getTileMap();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getUnitMap();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialField {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialField();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setFogMap($Message$CommonProto$WarSerialization$SerialFogMap.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setTileMap($Message$CommonProto$WarSerialization$SerialTileMap.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setUnitMap($Message$CommonProto$WarSerialization$SerialUnitMap.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialField {
        return SerialField.decode(this.encode());
    }

    public override getSchemaName(): "SerialField" {
        return "SerialField";
    }

    public checkHasFogMap(): boolean {
        return this._fogMap != null;
    }
    public getFogMap(): $Message$CommonProto$WarSerialization$SerialFogMap | null | undefined {
        return this._fogMap;
    }
    public setFogMap(value: $Message$CommonProto$WarSerialization$SerialFogMap | null | undefined): void {
        this._fogMap = value;
    }
    public createIfNotExistsFogMap(): $Message$CommonProto$WarSerialization$SerialFogMap {
        return this._fogMap ??= new $Message$CommonProto$WarSerialization$SerialFogMap();
    }

    public checkHasTileMap(): boolean {
        return this._tileMap != null;
    }
    public getTileMap(): $Message$CommonProto$WarSerialization$SerialTileMap | null | undefined {
        return this._tileMap;
    }
    public setTileMap(value: $Message$CommonProto$WarSerialization$SerialTileMap | null | undefined): void {
        this._tileMap = value;
    }
    public createIfNotExistsTileMap(): $Message$CommonProto$WarSerialization$SerialTileMap {
        return this._tileMap ??= new $Message$CommonProto$WarSerialization$SerialTileMap();
    }

    public checkHasUnitMap(): boolean {
        return this._unitMap != null;
    }
    public getUnitMap(): $Message$CommonProto$WarSerialization$SerialUnitMap | null | undefined {
        return this._unitMap;
    }
    public setUnitMap(value: $Message$CommonProto$WarSerialization$SerialUnitMap | null | undefined): void {
        this._unitMap = value;
    }
    public createIfNotExistsUnitMap(): $Message$CommonProto$WarSerialization$SerialUnitMap {
        return this._unitMap ??= new $Message$CommonProto$WarSerialization$SerialUnitMap();
    }
}
