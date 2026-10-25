import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TextCfgJson extends $ProtoSchemaJsonBase {
    textId?: number | null | undefined;
    textArray0: string[];
    textArray1: string[];
    textArray2: string[];
}

export class TextCfg extends $ProtoSchemaBase {
    private _textId?: number | null | undefined;
    private _textArray0: string[] = [];
    private _textArray1: string[] = [];
    private _textArray2: string[] = [];

    public static fromJson(obj: TextCfgJson): TextCfg {
        return new TextCfg().loadJson(obj);
    }
    public override loadJson(obj: TextCfgJson): this {
        this.setTextId(obj.textId);
        this.setTextArray0(obj.textArray0?.concat() ?? []);
        this.setTextArray1(obj.textArray1?.concat() ?? []);
        this.setTextArray2(obj.textArray2?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TextCfgJson): TextCfgJson {
        obj ??= ({} as TextCfgJson);

        {
            const value = this.getTextId();
            (value != null) && (obj.textId = value);
        }

        {
            obj.textArray0 = this.getTextArray0().concat();
        }

        {
            obj.textArray1 = this.getTextArray1().concat();
        }

        {
            obj.textArray2 = this.getTextArray2().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTextArray0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(18).string(value[i]!);
                }
            }
        }

        {
            const value = this.getTextArray1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(26).string(value[i]!);
                }
            }
        }

        {
            const value = this.getTextArray2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(34).string(value[i]!);
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TextCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TextCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTextId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._textArray0;
                        arr.push(reader.string());
                    }
                    break;

                case 3:
                    {
                        const arr = msg._textArray1;
                        arr.push(reader.string());
                    }
                    break;

                case 4:
                    {
                        const arr = msg._textArray2;
                        arr.push(reader.string());
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TextCfg {
        return TextCfg.decode(this.encode());
    }

    public override getSchemaName(): "TextCfg" {
        return "TextCfg";
    }

    public checkHasTextId(): boolean {
        return this._textId != null;
    }
    public getTextId(): number {
        return this._textId ?? 0;
    }
    public setTextId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._textId = null;
        } else {
            this._textId = value;
        }
    }

    public getTextArray0(): string[] {
        return this._textArray0;
    }
    public setTextArray0(value: string[]): void {
        this._textArray0 = value;
    }

    public getTextArray1(): string[] {
        return this._textArray1;
    }
    public setTextArray1(value: string[]): void {
        this._textArray1 = value;
    }

    public getTextArray2(): string[] {
        return this._textArray2;
    }
    public setTextArray2(value: string[]): void {
        this._textArray2 = value;
    }
}
