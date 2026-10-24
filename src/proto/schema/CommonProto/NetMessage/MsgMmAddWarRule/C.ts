import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { TemplateWarRule as $Message$CommonProto$WarRule$TemplateWarRule, type TemplateWarRuleJson as $Json$CommonProto$WarRule$TemplateWarRule } from "../../WarRule/TemplateWarRule.js";

export interface CJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    templateWarRule?: $Json$CommonProto$WarRule$TemplateWarRule | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _templateWarRule?: $Message$CommonProto$WarRule$TemplateWarRule | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setTemplateWarRule(obj.templateWarRule != null ? $Message$CommonProto$WarRule$TemplateWarRule.fromJson(obj.templateWarRule) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getTemplateWarRule();
            (value != null) && (obj.templateWarRule = value.toJson());
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
            const value = this.getTemplateWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setTemplateWarRule($Message$CommonProto$WarRule$TemplateWarRule.decode(reader, reader.uint32()));
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

    public checkHasTemplateWarRule(): boolean {
        return this._templateWarRule != null;
    }
    public getTemplateWarRule(): $Message$CommonProto$WarRule$TemplateWarRule | null | undefined {
        return this._templateWarRule;
    }
    public setTemplateWarRule(value: $Message$CommonProto$WarRule$TemplateWarRule | null | undefined): void {
        this._templateWarRule = value;
    }
    public createIfNotExistsTemplateWarRule(): $Message$CommonProto$WarRule$TemplateWarRule {
        return this._templateWarRule ??= new $Message$CommonProto$WarRule$TemplateWarRule();
    }
}
