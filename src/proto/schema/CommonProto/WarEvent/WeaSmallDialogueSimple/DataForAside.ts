import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface DataForAsideJson extends $ProtoSchemaJsonBase {
    side?: number | null | undefined;
    textArray: $Json$CommonProto$Structure$LanguageText[];
}

export class DataForAside extends $ProtoSchemaBase {
    private _side?: number | null | undefined;
    private _textArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: DataForAsideJson): DataForAside {
        return new DataForAside().loadJson(obj);
    }
    public override loadJson(obj: DataForAsideJson): this {
        this.setSide(obj.side);
        this.setTextArray(obj.textArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: DataForAsideJson): DataForAsideJson {
        obj ??= ({} as DataForAsideJson);

        {
            const value = this.getSide();
            (value != null) && (obj.side = value);
        }

        {
            obj.textArray = this.getTextArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSide();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTextArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForAside {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForAside();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSide(reader.int32());
                    break;

                case 2:
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

    public override clone(): DataForAside {
        return DataForAside.decode(this.encode());
    }

    public override getSchemaName(): "DataForAside" {
        return "DataForAside";
    }

    public checkHasSide(): boolean {
        return this._side != null;
    }
    public getSide(): number | null | undefined {
        return this._side;
    }
    public setSide(value: number | null | undefined): void {
        this._side = value;
    }

    public getTextArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textArray;
    }
    public setTextArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textArray = value;
    }
}
