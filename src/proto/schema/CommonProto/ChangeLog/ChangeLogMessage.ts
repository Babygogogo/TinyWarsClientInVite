import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface ChangeLogMessageJson extends $ProtoSchemaJsonBase {
    messageId?: number | null | undefined;
    textList: $Json$CommonProto$Structure$LanguageText[];
    createTimestamp?: number | null | undefined;
}

export class ChangeLogMessage extends $ProtoSchemaBase {
    private _messageId?: number | null | undefined;
    private _textList: $Message$CommonProto$Structure$LanguageText[] = [];
    private _createTimestamp?: number | null | undefined;

    public static fromJson(obj: ChangeLogMessageJson): ChangeLogMessage {
        return new ChangeLogMessage().loadJson(obj);
    }
    public override loadJson(obj: ChangeLogMessageJson): this {
        this.setMessageId(obj.messageId);
        this.setTextList(obj.textList?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setCreateTimestamp(obj.createTimestamp);
        return this;
    }
    public override toJson(obj?: ChangeLogMessageJson): ChangeLogMessageJson {
        obj ??= ({} as ChangeLogMessageJson);

        {
            const value = this.getMessageId();
            (value != null) && (obj.messageId = value);
        }

        {
            obj.textList = this.getTextList().map(v => v.toJson());
        }

        {
            const value = this.getCreateTimestamp();
            (value != null) && (obj.createTimestamp = value);
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
            const value = this.getCreateTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChangeLogMessage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChangeLogMessage();
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
                    msg.setCreateTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ChangeLogMessage {
        return ChangeLogMessage.decode(this.encode());
    }

    public override getSchemaName(): "ChangeLogMessage" {
        return "ChangeLogMessage";
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

    public checkHasCreateTimestamp(): boolean {
        return this._createTimestamp != null;
    }
    public getCreateTimestamp(): number {
        return this._createTimestamp ?? 0;
    }
    public setCreateTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._createTimestamp = null;
        } else {
            this._createTimestamp = value;
        }
    }
}
