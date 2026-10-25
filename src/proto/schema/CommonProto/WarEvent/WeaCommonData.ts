import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface WeaCommonDataJson extends $ProtoSchemaJsonBase {
    actionId?: number | null | undefined;
    actionNameArray: $Json$CommonProto$Structure$LanguageText[];
}

export class WeaCommonData extends $ProtoSchemaBase {
    private _actionId?: number | null | undefined;
    private _actionNameArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: WeaCommonDataJson): WeaCommonData {
        return new WeaCommonData().loadJson(obj);
    }
    public override loadJson(obj: WeaCommonDataJson): this {
        this.setActionId(obj.actionId);
        this.setActionNameArray(obj.actionNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WeaCommonDataJson): WeaCommonDataJson {
        obj ??= ({} as WeaCommonDataJson);

        {
            const value = this.getActionId();
            (value != null) && (obj.actionId = value);
        }

        {
            obj.actionNameArray = this.getActionNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getActionId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getActionNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaCommonData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaCommonData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setActionId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._actionNameArray;
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

    public override clone(): WeaCommonData {
        return WeaCommonData.decode(this.encode());
    }

    public override getSchemaName(): "WeaCommonData" {
        return "WeaCommonData";
    }

    public checkHasActionId(): boolean {
        return this._actionId != null;
    }
    public getActionId(): number {
        return this._actionId ?? 0;
    }
    public setActionId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actionId = null;
        } else {
            this._actionId = value;
        }
    }

    public getActionNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._actionNameArray;
    }
    public setActionNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._actionNameArray = value;
    }
}
