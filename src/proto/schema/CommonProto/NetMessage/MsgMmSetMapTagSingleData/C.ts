import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapTagSingleData as $Message$CommonProto$Map$MapTag$MapTagSingleData, type MapTagSingleDataJson as $Json$CommonProto$Map$MapTag$MapTagSingleData } from "../../Map/MapTag/MapTagSingleData.js";

export interface CJson extends $ProtoSchemaJsonBase {
    data?: $Json$CommonProto$Map$MapTag$MapTagSingleData | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _data?: $Message$CommonProto$Map$MapTag$MapTagSingleData | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setData(obj.data != null ? $Message$CommonProto$Map$MapTag$MapTagSingleData.fromJson(obj.data) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getData();
            (value != null) && (obj.data = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getData();
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
                    msg.setData($Message$CommonProto$Map$MapTag$MapTagSingleData.decode(reader, reader.uint32()));
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

    public checkHasData(): boolean {
        return this._data != null;
    }
    public getData(): $Message$CommonProto$Map$MapTag$MapTagSingleData | null | undefined {
        return this._data;
    }
    public setData(value: $Message$CommonProto$Map$MapTag$MapTagSingleData | null | undefined): void {
        this._data = value;
    }
    public createIfNotExistsData(): $Message$CommonProto$Map$MapTag$MapTagSingleData {
        return this._data ??= new $Message$CommonProto$Map$MapTag$MapTagSingleData();
    }
}
