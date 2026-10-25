import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ChatMessageJson extends $ProtoSchemaJsonBase {
    messageId?: number | null | undefined;
    fromUserId?: number | null | undefined;
    toCategory?: number | null | undefined;
    toTarget?: number | null | undefined;
    content?: string | null | undefined;
    timestamp?: number | null | undefined;
}

export class ChatMessage extends $ProtoSchemaBase {
    private _messageId?: number | null | undefined;
    private _fromUserId?: number | null | undefined;
    private _toCategory?: number | null | undefined;
    private _toTarget?: number | null | undefined;
    private _content?: string | null | undefined;
    private _timestamp?: number | null | undefined;

    public static fromJson(obj: ChatMessageJson): ChatMessage {
        return new ChatMessage().loadJson(obj);
    }
    public override loadJson(obj: ChatMessageJson): this {
        this.setMessageId(obj.messageId);
        this.setFromUserId(obj.fromUserId);
        this.setToCategory(obj.toCategory);
        this.setToTarget(obj.toTarget);
        this.setContent(obj.content);
        this.setTimestamp(obj.timestamp);
        return this;
    }
    public override toJson(obj?: ChatMessageJson): ChatMessageJson {
        obj ??= ({} as ChatMessageJson);

        {
            const value = this.getMessageId();
            (value != null) && (obj.messageId = value);
        }

        {
            const value = this.getFromUserId();
            (value != null) && (obj.fromUserId = value);
        }

        {
            const value = this.getToCategory();
            (value != null) && (obj.toCategory = value);
        }

        {
            const value = this.getToTarget();
            (value != null) && (obj.toTarget = value);
        }

        {
            const value = this.getContent();
            (value != null) && (obj.content = value);
        }

        {
            const value = this.getTimestamp();
            (value != null) && (obj.timestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMessageId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getFromUserId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getToCategory();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getToTarget();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getContent();
            if (value != null) {
                writer.uint32(42).string(value);
            }
        }

        {
            const value = this.getTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChatMessage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChatMessage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMessageId(reader.int32());
                    break;

                case 2:
                    msg.setFromUserId(reader.int32());
                    break;

                case 3:
                    msg.setToCategory(reader.int32());
                    break;

                case 4:
                    msg.setToTarget(reader.int32());
                    break;

                case 5:
                    msg.setContent(reader.string());
                    break;

                case 6:
                    msg.setTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ChatMessage {
        return ChatMessage.decode(this.encode());
    }

    public override getSchemaName(): "ChatMessage" {
        return "ChatMessage";
    }

    public checkHasMessageId(): boolean {
        return this._messageId != null;
    }
    public getMessageId(): number {
        return this._messageId ?? 0;
    }
    public setMessageId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._messageId = null;
        } else {
            this._messageId = value;
        }
    }

    public checkHasFromUserId(): boolean {
        return this._fromUserId != null;
    }
    public getFromUserId(): number {
        return this._fromUserId ?? 0;
    }
    public setFromUserId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fromUserId = null;
        } else {
            this._fromUserId = value;
        }
    }

    public checkHasToCategory(): boolean {
        return this._toCategory != null;
    }
    public getToCategory(): number {
        return this._toCategory ?? 0;
    }
    public setToCategory(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toCategory = null;
        } else {
            this._toCategory = value;
        }
    }

    public checkHasToTarget(): boolean {
        return this._toTarget != null;
    }
    public getToTarget(): number {
        return this._toTarget ?? 0;
    }
    public setToTarget(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toTarget = null;
        } else {
            this._toTarget = value;
        }
    }

    public checkHasContent(): boolean {
        return this._content != null;
    }
    public getContent(): string | null | undefined {
        return this._content;
    }
    public setContent(value: string | null | undefined): void {
        this._content = value;
    }

    public checkHasTimestamp(): boolean {
        return this._timestamp != null;
    }
    public getTimestamp(): number {
        return this._timestamp ?? 0;
    }
    public setTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._timestamp = null;
        } else {
            this._timestamp = value;
        }
    }
}
