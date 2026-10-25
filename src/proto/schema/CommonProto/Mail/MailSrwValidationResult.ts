import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailSrwValidationResultJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    templateWarRuleId?: number | null | undefined;
    score?: number | null | undefined;
    isValid?: boolean | null | undefined;
    errorCode?: number | null | undefined;
}

export class MailSrwValidationResult extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _templateWarRuleId?: number | null | undefined;
    private _score?: number | null | undefined;
    private _isValid?: boolean | null | undefined;
    private _errorCode?: number | null | undefined;

    public static fromJson(obj: MailSrwValidationResultJson): MailSrwValidationResult {
        return new MailSrwValidationResult().loadJson(obj);
    }
    public override loadJson(obj: MailSrwValidationResultJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setTemplateWarRuleId(obj.templateWarRuleId);
        this.setScore(obj.score);
        this.setIsValid(obj.isValid);
        this.setErrorCode(obj.errorCode);
        return this;
    }
    public override toJson(obj?: MailSrwValidationResultJson): MailSrwValidationResultJson {
        obj ??= ({} as MailSrwValidationResultJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getTemplateWarRuleId();
            (value != null) && (obj.templateWarRuleId = value);
        }

        {
            const value = this.getScore();
            (value != null) && (obj.score = value);
        }

        {
            const value = this.getIsValid();
            (value != null) && (obj.isValid = value);
        }

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
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
            const value = this.getTemplateWarRuleId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getScore();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsValid();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailSrwValidationResult {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailSrwValidationResult();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setTemplateWarRuleId(reader.int32());
                    break;

                case 3:
                    msg.setScore(reader.int32());
                    break;

                case 4:
                    msg.setIsValid(reader.bool());
                    break;

                case 5:
                    msg.setErrorCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailSrwValidationResult {
        return MailSrwValidationResult.decode(this.encode());
    }

    public override getSchemaName(): "MailSrwValidationResult" {
        return "MailSrwValidationResult";
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

    public checkHasTemplateWarRuleId(): boolean {
        return this._templateWarRuleId != null;
    }
    public getTemplateWarRuleId(): number | null | undefined {
        return this._templateWarRuleId;
    }
    public setTemplateWarRuleId(value: number | null | undefined): void {
        this._templateWarRuleId = value;
    }

    public checkHasScore(): boolean {
        return this._score != null;
    }
    public getScore(): number | null | undefined {
        return this._score;
    }
    public setScore(value: number | null | undefined): void {
        this._score = value;
    }

    public checkHasIsValid(): boolean {
        return this._isValid != null;
    }
    public getIsValid(): boolean | null | undefined {
        return this._isValid;
    }
    public setIsValid(value: boolean | null | undefined): void {
        this._isValid = value;
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
}
