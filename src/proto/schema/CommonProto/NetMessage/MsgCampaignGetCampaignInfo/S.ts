import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CampaignInfo as $Message$CommonProto$Campaign$CampaignInfo, type CampaignInfoJson as $Json$CommonProto$Campaign$CampaignInfo } from "../../Campaign/CampaignInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    campaignId?: number | null | undefined;
    campaignInfo?: $Json$CommonProto$Campaign$CampaignInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _campaignId?: number | null | undefined;
    private _campaignInfo?: $Message$CommonProto$Campaign$CampaignInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setCampaignId(obj.campaignId);
        this.setCampaignInfo(obj.campaignInfo != null ? $Message$CommonProto$Campaign$CampaignInfo.fromJson(obj.campaignInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
        }

        {
            const value = this.getCampaignInfo();
            (value != null) && (obj.campaignInfo = value.toJson());
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
            const value = this.getCampaignId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCampaignInfo();
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
                    msg.setCampaignId(reader.int32());
                    break;

                case 3:
                    msg.setCampaignInfo($Message$CommonProto$Campaign$CampaignInfo.decode(reader, reader.uint32()));
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

    public checkHasCampaignId(): boolean {
        return this._campaignId != null;
    }
    public getCampaignId(): number | null | undefined {
        return this._campaignId;
    }
    public setCampaignId(value: number | null | undefined): void {
        this._campaignId = value;
    }

    public checkHasCampaignInfo(): boolean {
        return this._campaignInfo != null;
    }
    public getCampaignInfo(): $Message$CommonProto$Campaign$CampaignInfo | null | undefined {
        return this._campaignInfo;
    }
    public setCampaignInfo(value: $Message$CommonProto$Campaign$CampaignInfo | null | undefined): void {
        this._campaignInfo = value;
    }
    public createIfNotExistsCampaignInfo(): $Message$CommonProto$Campaign$CampaignInfo {
        return this._campaignInfo ??= new $Message$CommonProto$Campaign$CampaignInfo();
    }
}
