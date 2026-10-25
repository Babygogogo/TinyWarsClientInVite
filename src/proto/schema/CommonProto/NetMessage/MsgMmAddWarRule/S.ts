import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { TemplateWarRule as $Message$CommonProto$WarRule$TemplateWarRule, type TemplateWarRuleJson as $Json$CommonProto$WarRule$TemplateWarRule } from "../../WarRule/TemplateWarRule.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    normalMapId?: number | null | undefined;
    templateWarRule?: $Json$CommonProto$WarRule$TemplateWarRule | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _templateWarRule?: $Message$CommonProto$WarRule$TemplateWarRule | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setNormalMapId(obj.normalMapId);
        this.setTemplateWarRule(obj.templateWarRule != null ? $Message$CommonProto$WarRule$TemplateWarRule.fromJson(obj.templateWarRule) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

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
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTemplateWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setTemplateWarRule($Message$CommonProto$WarRule$TemplateWarRule.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
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
