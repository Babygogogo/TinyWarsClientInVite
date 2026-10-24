import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapExtraText as $Message$CommonProto$Map$MapExtraText, type MapExtraTextJson as $Json$CommonProto$Map$MapExtraText } from "../../Map/MapExtraText.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    mapExtraText?: $Json$CommonProto$Map$MapExtraText | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _mapExtraText?: $Message$CommonProto$Map$MapExtraText | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setMapExtraText(obj.mapExtraText != null ? $Message$CommonProto$Map$MapExtraText.fromJson(obj.mapExtraText) : null);
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
            const value = this.getCampaignMapId();
            (value != null) && (obj.campaignMapId = value);
        }

        {
            const value = this.getMapExtraText();
            (value != null) && (obj.mapExtraText = value.toJson());
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
            const value = this.getCampaignMapId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMapExtraText();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
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
                    msg.setCampaignMapId(reader.int32());
                    break;

                case 4:
                    msg.setMapExtraText($Message$CommonProto$Map$MapExtraText.decode(reader, reader.uint32()));
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

    public checkHasCampaignMapId(): boolean {
        return this._campaignMapId != null;
    }
    public getCampaignMapId(): number | null | undefined {
        return this._campaignMapId;
    }
    public setCampaignMapId(value: number | null | undefined): void {
        this._campaignMapId = value;
    }

    public checkHasMapExtraText(): boolean {
        return this._mapExtraText != null;
    }
    public getMapExtraText(): $Message$CommonProto$Map$MapExtraText | null | undefined {
        return this._mapExtraText;
    }
    public setMapExtraText(value: $Message$CommonProto$Map$MapExtraText | null | undefined): void {
        this._mapExtraText = value;
    }
    public createIfNotExistsMapExtraText(): $Message$CommonProto$Map$MapExtraText {
        return this._mapExtraText ??= new $Message$CommonProto$Map$MapExtraText();
    }
}
