import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface WeaPersistentShowTextJson extends $ProtoSchemaJsonBase {
    textArray: $Json$CommonProto$Structure$LanguageText[];
}

export class WeaPersistentShowText extends $ProtoSchemaBase {
    private _textArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: WeaPersistentShowTextJson): WeaPersistentShowText {
        return new WeaPersistentShowText().loadJson(obj);
    }
    public override loadJson(obj: WeaPersistentShowTextJson): this {
        this.setTextArray(obj.textArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WeaPersistentShowTextJson): WeaPersistentShowTextJson {
        obj ??= ({} as WeaPersistentShowTextJson);

        {
            obj.textArray = this.getTextArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTextArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPersistentShowText {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPersistentShowText();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._textArray;
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

    public override clone(): WeaPersistentShowText {
        return WeaPersistentShowText.decode(this.encode());
    }

    public override getSchemaName(): "WeaPersistentShowText" {
        return "WeaPersistentShowText";
    }

    public getTextArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textArray;
    }
    public setTextArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textArray = value;
    }
}
