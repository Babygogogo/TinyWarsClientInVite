import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapTagSingleData as $Message$CommonProto$Map$MapTag$MapTagSingleData, type MapTagSingleDataJson as $Json$CommonProto$Map$MapTag$MapTagSingleData } from "./MapTag/MapTagSingleData.js";

export interface MapTagJson extends $ProtoSchemaJsonBase {
    mapTagDataArray: $Json$CommonProto$Map$MapTag$MapTagSingleData[];
}

export class MapTag extends $ProtoSchemaBase {
    private _mapTagDataArray: $Message$CommonProto$Map$MapTag$MapTagSingleData[] = [];

    public static fromJson(obj: MapTagJson): MapTag {
        return new MapTag().loadJson(obj);
    }
    public override loadJson(obj: MapTagJson): this {
        this.setMapTagDataArray(obj.mapTagDataArray?.map(v => $Message$CommonProto$Map$MapTag$MapTagSingleData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapTagJson): MapTagJson {
        obj ??= ({} as MapTagJson);

        {
            obj.mapTagDataArray = this.getMapTagDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMapTagDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapTag {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapTag();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._mapTagDataArray;
                        arr.push($Message$CommonProto$Map$MapTag$MapTagSingleData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapTag {
        return MapTag.decode(this.encode());
    }

    public override getSchemaName(): "MapTag" {
        return "MapTag";
    }

    public getMapTagDataArray(): $Message$CommonProto$Map$MapTag$MapTagSingleData[] {
        return this._mapTagDataArray;
    }
    public setMapTagDataArray(value: $Message$CommonProto$Map$MapTag$MapTagSingleData[]): void {
        this._mapTagDataArray = value;
    }
}
