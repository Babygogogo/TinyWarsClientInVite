import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailCawValidationResultJson extends $ProtoSchemaJsonBase {
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    campaignMapRevision?: number | null | undefined;
    score?: number | null | undefined;
    isValid?: boolean | null | undefined;
    errorCode?: number | null | undefined;
}

export class MailCawValidationResult extends $ProtoSchemaBase {
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _campaignMapRevision?: number | null | undefined;
    private _score?: number | null | undefined;
    private _isValid?: boolean | null | undefined;
    private _errorCode?: number | null | undefined;

    public static fromJson(obj: MailCawValidationResultJson): MailCawValidationResult {
        return new MailCawValidationResult().loadJson(obj);
    }
    public override loadJson(obj: MailCawValidationResultJson): this {
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setCampaignMapRevision(obj.campaignMapRevision);
        this.setScore(obj.score);
        this.setIsValid(obj.isValid);
        this.setErrorCode(obj.errorCode);
        return this;
    }
    public override toJson(obj?: MailCawValidationResultJson): MailCawValidationResultJson {
        obj ??= ({} as MailCawValidationResultJson);

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
        }

        {
            const value = this.getCampaignMapId();
            (value != null) && (obj.campaignMapId = value);
        }

        {
            const value = this.getCampaignMapRevision();
            (value != null) && (obj.campaignMapRevision = value);
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
            const value = this.getCampaignId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCampaignMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCampaignMapRevision();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getScore();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getIsValid();
            if (value != null) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailCawValidationResult {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailCawValidationResult();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCampaignId(reader.int32());
                    break;

                case 2:
                    msg.setCampaignMapId(reader.int32());
                    break;

                case 3:
                    msg.setCampaignMapRevision(reader.int32());
                    break;

                case 4:
                    msg.setScore(reader.int32());
                    break;

                case 5:
                    msg.setIsValid(reader.bool());
                    break;

                case 6:
                    msg.setErrorCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailCawValidationResult {
        return MailCawValidationResult.decode(this.encode());
    }

    public override getSchemaName(): "MailCawValidationResult" {
        return "MailCawValidationResult";
    }

    public checkHasCampaignId(): boolean {
        return this._campaignId != null;
    }
    public getCampaignId(): number | null | undefined {
        return this._campaignId;
    }
    public setCampaignId(value: number | null | undefined): void {
        this._campaignId = value;
    }

    public checkHasCampaignMapId(): boolean {
        return this._campaignMapId != null;
    }
    public getCampaignMapId(): number | null | undefined {
        return this._campaignMapId;
    }
    public setCampaignMapId(value: number | null | undefined): void {
        this._campaignMapId = value;
    }

    public checkHasCampaignMapRevision(): boolean {
        return this._campaignMapRevision != null;
    }
    public getCampaignMapRevision(): number | null | undefined {
        return this._campaignMapRevision;
    }
    public setCampaignMapRevision(value: number | null | undefined): void {
        this._campaignMapRevision = value;
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
