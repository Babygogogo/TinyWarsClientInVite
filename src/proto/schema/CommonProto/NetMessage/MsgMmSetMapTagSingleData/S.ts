import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapTagSingleData as $Message$CommonProto$Map$MapTag$MapTagSingleData, type MapTagSingleDataJson as $Json$CommonProto$Map$MapTag$MapTagSingleData } from "../../Map/MapTag/MapTagSingleData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    data?: $Json$CommonProto$Map$MapTag$MapTagSingleData | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _data?: $Message$CommonProto$Map$MapTag$MapTagSingleData | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setData(obj.data != null ? $Message$CommonProto$Map$MapTag$MapTagSingleData.fromJson(obj.data) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getData();
            (value != null) && (obj.data = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setData($Message$CommonProto$Map$MapTag$MapTagSingleData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
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
