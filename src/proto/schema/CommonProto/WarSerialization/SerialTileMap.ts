import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { TileCustomName as $Message$CommonProto$Structure$TileCustomName, type TileCustomNameJson as $Json$CommonProto$Structure$TileCustomName } from "../Structure/TileCustomName.js";
import { SerialTile as $Message$CommonProto$WarSerialization$SerialTile, type SerialTileJson as $Json$CommonProto$WarSerialization$SerialTile } from "./SerialTile.js";

export interface SerialTileMapJson extends $ProtoSchemaJsonBase {
    tiles: $Json$CommonProto$WarSerialization$SerialTile[];
    tileCustomNameArray: $Json$CommonProto$Structure$TileCustomName[];
}

export class SerialTileMap extends $ProtoSchemaBase {
    private _tiles: $Message$CommonProto$WarSerialization$SerialTile[] = [];
    private _tileCustomNameArray: $Message$CommonProto$Structure$TileCustomName[] = [];

    public static fromJson(obj: SerialTileMapJson): SerialTileMap {
        return new SerialTileMap().loadJson(obj);
    }
    public override loadJson(obj: SerialTileMapJson): this {
        this.setTiles(obj.tiles?.map(v => $Message$CommonProto$WarSerialization$SerialTile.fromJson(v)) ?? []);
        this.setTileCustomNameArray(obj.tileCustomNameArray?.map(v => $Message$CommonProto$Structure$TileCustomName.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialTileMapJson): SerialTileMapJson {
        obj ??= ({} as SerialTileMapJson);

        {
            obj.tiles = this.getTiles().map(v => v.toJson());
        }

        {
            obj.tileCustomNameArray = this.getTileCustomNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTiles();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTileCustomNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialTileMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialTileMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._tiles;
                        arr.push($Message$CommonProto$WarSerialization$SerialTile.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._tileCustomNameArray;
                        arr.push($Message$CommonProto$Structure$TileCustomName.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialTileMap {
        return SerialTileMap.decode(this.encode());
    }

    public override getSchemaName(): "SerialTileMap" {
        return "SerialTileMap";
    }

    public getTiles(): $Message$CommonProto$WarSerialization$SerialTile[] {
        return this._tiles;
    }
    public setTiles(value: $Message$CommonProto$WarSerialization$SerialTile[]): void {
        this._tiles = value;
    }

    public getTileCustomNameArray(): $Message$CommonProto$Structure$TileCustomName[] {
        return this._tileCustomNameArray;
    }
    public setTileCustomNameArray(value: $Message$CommonProto$Structure$TileCustomName[]): void {
        this._tileCustomNameArray = value;
    }
}
