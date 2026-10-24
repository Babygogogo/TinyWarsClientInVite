import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { AtrRoomInfo as $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo, type AtrRoomInfoJson as $Json$CommonProto$AutoTourneyRoom$AtrRoomInfo } from "../../AutoTourneyRoom/AtrRoomInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    roomId?: number | null | undefined;
    roomInfo?: $Json$CommonProto$AutoTourneyRoom$AtrRoomInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _roomId?: number | null | undefined;
    private _roomInfo?: $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRoomId(obj.roomId);
        this.setRoomInfo(obj.roomInfo != null ? $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo.fromJson(obj.roomInfo) : null);
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
            const value = this.getRoomInfo();
            (value != null) && (obj.roomInfo = value.toJson());
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
            const value = this.getRoomInfo();
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
                    msg.setRoomInfo($Message$CommonProto$AutoTourneyRoom$AtrRoomInfo.decode(reader, reader.uint32()));
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

    public checkHasRoomInfo(): boolean {
        return this._roomInfo != null;
    }
    public getRoomInfo(): $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo | null | undefined {
        return this._roomInfo;
    }
    public setRoomInfo(value: $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo | null | undefined): void {
        this._roomInfo = value;
    }
    public createIfNotExistsRoomInfo(): $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo {
        return this._roomInfo ??= new $Message$CommonProto$AutoTourneyRoom$AtrRoomInfo();
    }
}
