import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface CJson extends $ProtoSchemaJsonBase {
    textList: $Json$CommonProto$Structure$LanguageText[];
    startTime?: number | null | undefined;
    endTime?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _textList: $Message$CommonProto$Structure$LanguageText[] = [];
    private _startTime?: number | null | undefined;
    private _endTime?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setTextList(obj.textList?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setStartTime(obj.startTime);
        this.setEndTime(obj.endTime);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

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
            const value = this.getTextList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getStartTime();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getEndTime();
            if (value != null) {
                writer.uint32(24).uint32(value);
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
                    {
                        const arr = msg._textList;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    msg.setStartTime(reader.uint32());
                    break;

                case 3:
                    msg.setEndTime(reader.uint32());
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

    public getTextList(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textList;
    }
    public setTextList(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textList = value;
    }

    public checkHasStartTime(): boolean {
        return this._startTime != null;
    }
    public getStartTime(): number | null | undefined {
        return this._startTime;
    }
    public setStartTime(value: number | null | undefined): void {
        this._startTime = value;
    }

    public checkHasEndTime(): boolean {
        return this._endTime != null;
    }
    public getEndTime(): number | null | undefined {
        return this._endTime;
    }
    public setEndTime(value: number | null | undefined): void {
        this._endTime = value;
    }
}
