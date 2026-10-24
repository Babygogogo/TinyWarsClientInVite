import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface WecCommonDataJson extends $ProtoSchemaJsonBase {
    conditionId?: number | null | undefined;
    conditionNameArray: $Json$CommonProto$Structure$LanguageText[];
}

export class WecCommonData extends $ProtoSchemaBase {
    private _conditionId?: number | null | undefined;
    private _conditionNameArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: WecCommonDataJson): WecCommonData {
        return new WecCommonData().loadJson(obj);
    }
    public override loadJson(obj: WecCommonDataJson): this {
        this.setConditionId(obj.conditionId);
        this.setConditionNameArray(obj.conditionNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WecCommonDataJson): WecCommonDataJson {
        obj ??= ({} as WecCommonDataJson);

        {
            const value = this.getConditionId();
            (value != null) && (obj.conditionId = value);
        }

        {
            obj.conditionNameArray = this.getConditionNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConditionId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getConditionNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecCommonData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecCommonData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditionId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._conditionNameArray;
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

    public override clone(): WecCommonData {
        return WecCommonData.decode(this.encode());
    }

    public override getSchemaName(): "WecCommonData" {
        return "WecCommonData";
    }

    public checkHasConditionId(): boolean {
        return this._conditionId != null;
    }
    public getConditionId(): number {
        return this._conditionId ?? 0;
    }
    public setConditionId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._conditionId = null;
        } else {
            this._conditionId = value;
        }
    }

    public getConditionNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._conditionNameArray;
    }
    public setConditionNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._conditionNameArray = value;
    }
}
