import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { BroadcastMessage as $Message$CommonProto$Broadcast$BroadcastMessage, type BroadcastMessageJson as $Json$CommonProto$Broadcast$BroadcastMessage } from "../../Broadcast/BroadcastMessage.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    messageId?: number | null | undefined;
    messageData?: $Json$CommonProto$Broadcast$BroadcastMessage | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _messageId?: number | null | undefined;
    private _messageData?: $Message$CommonProto$Broadcast$BroadcastMessage | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setMessageId(obj.messageId);
        this.setMessageData(obj.messageData != null ? $Message$CommonProto$Broadcast$BroadcastMessage.fromJson(obj.messageData) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getMessageId();
            (value != null) && (obj.messageId = value);
        }

        {
            const value = this.getMessageData();
            (value != null) && (obj.messageData = value.toJson());
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
            const value = this.getMessageId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getMessageData();
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
                    msg.setMessageId(reader.int32());
                    break;

                case 3:
                    msg.setMessageData($Message$CommonProto$Broadcast$BroadcastMessage.decode(reader, reader.uint32()));
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

    public checkHasMessageId(): boolean {
        return this._messageId != null;
    }
    public getMessageId(): number | null | undefined {
        return this._messageId;
    }
    public setMessageId(value: number | null | undefined): void {
        this._messageId = value;
    }

    public checkHasMessageData(): boolean {
        return this._messageData != null;
    }
    public getMessageData(): $Message$CommonProto$Broadcast$BroadcastMessage | null | undefined {
        return this._messageData;
    }
    public setMessageData(value: $Message$CommonProto$Broadcast$BroadcastMessage | null | undefined): void {
        this._messageData = value;
    }
    public createIfNotExistsMessageData(): $Message$CommonProto$Broadcast$BroadcastMessage {
        return this._messageData ??= new $Message$CommonProto$Broadcast$BroadcastMessage();
    }
}
