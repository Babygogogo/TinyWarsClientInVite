import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface LanguageTextJson extends $ProtoSchemaJsonBase {
    languageType?: number | null | undefined;
    text?: string | null | undefined;
}

export class LanguageText extends $ProtoSchemaBase {
    private _languageType?: number | null | undefined;
    private _text?: string | null | undefined;

    public static fromJson(obj: LanguageTextJson): LanguageText {
        return new LanguageText().loadJson(obj);
    }
    public override loadJson(obj: LanguageTextJson): this {
        this.setLanguageType(obj.languageType);
        this.setText(obj.text);
        return this;
    }
    public override toJson(obj?: LanguageTextJson): LanguageTextJson {
        obj ??= ({} as LanguageTextJson);

        {
            const value = this.getLanguageType();
            (value != null) && (obj.languageType = value);
        }

        {
            const value = this.getText();
            (value != null) && (obj.text = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getLanguageType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getText();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LanguageText {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LanguageText();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setLanguageType(reader.int32());
                    break;

                case 2:
                    msg.setText(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LanguageText {
        return LanguageText.decode(this.encode());
    }

    public override getSchemaName(): "LanguageText" {
        return "LanguageText";
    }

    public checkHasLanguageType(): boolean {
        return this._languageType != null;
    }
    public getLanguageType(): number {
        return this._languageType ?? 0;
    }
    public setLanguageType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._languageType = null;
        } else {
            this._languageType = value;
        }
    }

    public checkHasText(): boolean {
        return this._text != null;
    }
    public getText(): string | null | undefined {
        return this._text;
    }
    public setText(value: string | null | undefined): void {
        this._text = value;
    }
}
