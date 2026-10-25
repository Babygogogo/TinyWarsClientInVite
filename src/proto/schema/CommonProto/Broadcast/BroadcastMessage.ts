import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface BroadcastMessageJson extends $ProtoSchemaJsonBase {
    messageId?: number | null | undefined;
    textList: $Json$CommonProto$Structure$LanguageText[];
    startTime?: number | null | undefined;
    endTime?: number | null | undefined;
}

export class BroadcastMessage extends $ProtoSchemaBase {
    private _messageId?: number | null | undefined;
    private _textList: $Message$CommonProto$Structure$LanguageText[] = [];
    private _startTime?: number | null | undefined;
    private _endTime?: number | null | undefined;

    public static fromJson(obj: BroadcastMessageJson): BroadcastMessage {
        return new BroadcastMessage().loadJson(obj);
    }
    public override loadJson(obj: BroadcastMessageJson): this {
        this.setMessageId(obj.messageId);
        this.setTextList(obj.textList?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setStartTime(obj.startTime);
        this.setEndTime(obj.endTime);
        return this;
    }
    public override toJson(obj?: BroadcastMessageJson): BroadcastMessageJson {
        obj ??= ({} as BroadcastMessageJson);

        {
            const value = this.getMessageId();
            (value != null) && (obj.messageId = value);
        }

        {
            obj.textList = this.getTextList().map(v => v.toJson());
        }

        {
            const value = this.getStartTime();
            (value != null) && (obj.startTime = value);
        }

        {
            const value = this.getEndTime();
            (value != null) && (obj.endTime = value);
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
            const value = this.getTextList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getStartTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getEndTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): BroadcastMessage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new BroadcastMessage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMessageId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._textList;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setStartTime(reader.uint32());
                    break;

                case 4:
                    msg.setEndTime(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): BroadcastMessage {
        return BroadcastMessage.decode(this.encode());
    }

    public override getSchemaName(): "BroadcastMessage" {
        return "BroadcastMessage";
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

    public getTextList(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textList;
    }
    public setTextList(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textList = value;
    }

    public checkHasStartTime(): boolean {
        return this._startTime != null;
    }
    public getStartTime(): number {
        return this._startTime ?? 0;
    }
    public setStartTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._startTime = null;
        } else {
            this._startTime = value;
        }
    }

    public checkHasEndTime(): boolean {
        return this._endTime != null;
    }
    public getEndTime(): number {
        return this._endTime ?? 0;
    }
    public setEndTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._endTime = null;
        } else {
            this._endTime = value;
        }
    }
}
