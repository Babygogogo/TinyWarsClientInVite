import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { NormalMapBriefData as $Message$CommonProto$Map$NormalMapBriefData, type NormalMapBriefDataJson as $Json$CommonProto$Map$NormalMapBriefData } from "../../Map/NormalMapBriefData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    normalMapId?: number | null | undefined;
    normalMapBriefData?: $Json$CommonProto$Map$NormalMapBriefData | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _normalMapBriefData?: $Message$CommonProto$Map$NormalMapBriefData | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setNormalMapId(obj.normalMapId);
        this.setNormalMapBriefData(obj.normalMapBriefData != null ? $Message$CommonProto$Map$NormalMapBriefData.fromJson(obj.normalMapBriefData) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getNormalMapBriefData();
            (value != null) && (obj.normalMapBriefData = value.toJson());
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
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getNormalMapBriefData();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
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
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setNormalMapBriefData($Message$CommonProto$Map$NormalMapBriefData.decode(reader, reader.uint32()));
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasNormalMapBriefData(): boolean {
        return this._normalMapBriefData != null;
    }
    public getNormalMapBriefData(): $Message$CommonProto$Map$NormalMapBriefData | null | undefined {
        return this._normalMapBriefData;
    }
    public setNormalMapBriefData(value: $Message$CommonProto$Map$NormalMapBriefData | null | undefined): void {
        this._normalMapBriefData = value;
    }
    public createIfNotExistsNormalMapBriefData(): $Message$CommonProto$Map$NormalMapBriefData {
        return this._normalMapBriefData ??= new $Message$CommonProto$Map$NormalMapBriefData();
    }
}
