import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MfrRoomPlayerInfo as $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo, type MfrRoomPlayerInfoJson as $Json$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo } from "../../MultiFreeRoom/MfrRoomPlayerInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    roomId?: number | null | undefined;
    roomPlayerInfo?: $Json$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _roomId?: number | null | undefined;
    private _roomPlayerInfo?: $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRoomId(obj.roomId);
        this.setRoomPlayerInfo(obj.roomPlayerInfo != null ? $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo.fromJson(obj.roomPlayerInfo) : null);
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
            const value = this.getRoomPlayerInfo();
            (value != null) && (obj.roomPlayerInfo = value.toJson());
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
            const value = this.getRoomPlayerInfo();
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
                    msg.setRoomPlayerInfo($Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo.decode(reader, reader.uint32()));
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

    public checkHasRoomPlayerInfo(): boolean {
        return this._roomPlayerInfo != null;
    }
    public getRoomPlayerInfo(): $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo | null | undefined {
        return this._roomPlayerInfo;
    }
    public setRoomPlayerInfo(value: $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo | null | undefined): void {
        this._roomPlayerInfo = value;
    }
    public createIfNotExistsRoomPlayerInfo(): $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo {
        return this._roomPlayerInfo ??= new $Message$CommonProto$MultiFreeRoom$MfrRoomPlayerInfo();
    }
}
