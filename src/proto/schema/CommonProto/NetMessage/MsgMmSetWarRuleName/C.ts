import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface CJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    ruleId?: number | null | undefined;
    ruleNameArray: $Json$CommonProto$Structure$LanguageText[];
}

export class C extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _ruleId?: number | null | undefined;
    private _ruleNameArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setRuleId(obj.ruleId);
        this.setRuleNameArray(obj.ruleNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }

        {
            obj.ruleNameArray = this.getRuleNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRuleId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRuleNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
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
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setRuleId(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._ruleNameArray;
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number | null | undefined {
        return this._ruleId;
    }
    public setRuleId(value: number | null | undefined): void {
        this._ruleId = value;
    }

    public getRuleNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._ruleNameArray;
    }
    public setRuleNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._ruleNameArray = value;
    }
}
