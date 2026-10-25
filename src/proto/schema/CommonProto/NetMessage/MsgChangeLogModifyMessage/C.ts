import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface CJson extends $ProtoSchemaJsonBase {
    messageId?: number | null | undefined;
    textList: $Json$CommonProto$Structure$LanguageText[];
}

export class C extends $ProtoSchemaBase {
    private _messageId?: number | null | undefined;
    private _textList: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setMessageId(obj.messageId);
        this.setTextList(obj.textList?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getMessageId();
            (value != null) && (obj.messageId = value);
        }

        {
            obj.textList = this.getTextList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMessageId();
            if (value != null) {
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
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

    public getTextList(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textList;
    }
    public setTextList(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textList = value;
    }
}
