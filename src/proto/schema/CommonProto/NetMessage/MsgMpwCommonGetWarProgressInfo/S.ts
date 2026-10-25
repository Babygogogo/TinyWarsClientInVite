import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MpwWarProgressInfo as $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo, type MpwWarProgressInfoJson as $Json$CommonProto$MultiPlayerWar$MpwWarProgressInfo } from "../../MultiPlayerWar/MpwWarProgressInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    warId?: number | null | undefined;
    warProgressInfo?: $Json$CommonProto$MultiPlayerWar$MpwWarProgressInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _warId?: number | null | undefined;
    private _warProgressInfo?: $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setWarId(obj.warId);
        this.setWarProgressInfo(obj.warProgressInfo != null ? $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo.fromJson(obj.warProgressInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getWarProgressInfo();
            (value != null) && (obj.warProgressInfo = value.toJson());
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
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getWarProgressInfo();
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
                    msg.setWarId(reader.int32());
                    break;

                case 3:
                    msg.setWarProgressInfo($Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo.decode(reader, reader.uint32()));
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

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public checkHasWarProgressInfo(): boolean {
        return this._warProgressInfo != null;
    }
    public getWarProgressInfo(): $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo | null | undefined {
        return this._warProgressInfo;
    }
    public setWarProgressInfo(value: $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo | null | undefined): void {
        this._warProgressInfo = value;
    }
    public createIfNotExistsWarProgressInfo(): $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo {
        return this._warProgressInfo ??= new $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo();
    }
}
