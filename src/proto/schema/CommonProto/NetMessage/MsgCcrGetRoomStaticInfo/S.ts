import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CcrRoomStaticInfo as $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo, type CcrRoomStaticInfoJson as $Json$CommonProto$CoopCustomRoom$CcrRoomStaticInfo } from "../../CoopCustomRoom/CcrRoomStaticInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    roomId?: number | null | undefined;
    roomStaticInfo?: $Json$CommonProto$CoopCustomRoom$CcrRoomStaticInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _roomId?: number | null | undefined;
    private _roomStaticInfo?: $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRoomId(obj.roomId);
        this.setRoomStaticInfo(obj.roomStaticInfo != null ? $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo.fromJson(obj.roomStaticInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getRoomStaticInfo();
            (value != null) && (obj.roomStaticInfo = value.toJson());
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
            const value = this.getRoomId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRoomStaticInfo();
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
                    msg.setRoomId(reader.int32());
                    break;

                case 3:
                    msg.setRoomStaticInfo($Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo.decode(reader, reader.uint32()));
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

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number | null | undefined {
        return this._roomId;
    }
    public setRoomId(value: number | null | undefined): void {
        this._roomId = value;
    }

    public checkHasRoomStaticInfo(): boolean {
        return this._roomStaticInfo != null;
    }
    public getRoomStaticInfo(): $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo | null | undefined {
        return this._roomStaticInfo;
    }
    public setRoomStaticInfo(value: $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo | null | undefined): void {
        this._roomStaticInfo = value;
    }
    public createIfNotExistsRoomStaticInfo(): $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo {
        return this._roomStaticInfo ??= new $Message$CommonProto$CoopCustomRoom$CcrRoomStaticInfo();
    }
}
