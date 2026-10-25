import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapRawData as $Message$CommonProto$Map$MapRawData, type MapRawDataJson as $Json$CommonProto$Map$MapRawData } from "../../Map/MapRawData.js";

export interface CJson extends $ProtoSchemaJsonBase {
    mapRawData?: $Json$CommonProto$Map$MapRawData | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _mapRawData?: $Message$CommonProto$Map$MapRawData | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setMapRawData(obj.mapRawData != null ? $Message$CommonProto$Map$MapRawData.fromJson(obj.mapRawData) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getMapRawData();
            (value != null) && (obj.mapRawData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMapRawData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMapRawData($Message$CommonProto$Map$MapRawData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasMapRawData(): boolean {
        return this._mapRawData != null;
    }
    public getMapRawData(): $Message$CommonProto$Map$MapRawData | null | undefined {
        return this._mapRawData;
    }
    public setMapRawData(value: $Message$CommonProto$Map$MapRawData | null | undefined): void {
        this._mapRawData = value;
    }
    public createIfNotExistsMapRawData(): $Message$CommonProto$Map$MapRawData {
        return this._mapRawData ??= new $Message$CommonProto$Map$MapRawData();
    }
}
