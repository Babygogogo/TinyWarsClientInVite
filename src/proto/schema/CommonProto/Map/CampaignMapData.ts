import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CampaignMapDataJson extends $ProtoSchemaJsonBase {
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    revision?: number | null | undefined;
}

export class CampaignMapData extends $ProtoSchemaBase {
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _revision?: number | null | undefined;

    public static fromJson(obj: CampaignMapDataJson): CampaignMapData {
        return new CampaignMapData().loadJson(obj);
    }
    public override loadJson(obj: CampaignMapDataJson): this {
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setRevision(obj.revision);
        return this;
    }
    public override toJson(obj?: CampaignMapDataJson): CampaignMapDataJson {
        obj ??= ({} as CampaignMapDataJson);

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
        }

        {
            const value = this.getCampaignMapId();
            (value != null) && (obj.campaignMapId = value);
        }

        {
            const value = this.getRevision();
            (value != null) && (obj.revision = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCampaignId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCampaignMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRevision();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CampaignMapData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CampaignMapData();
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
                    msg.setRevision(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CampaignMapData {
        return CampaignMapData.decode(this.encode());
    }

    public override getSchemaName(): "CampaignMapData" {
        return "CampaignMapData";
    }

    public checkHasCampaignId(): boolean {
        return this._campaignId != null;
    }
    public getCampaignId(): number {
        return this._campaignId ?? 0;
    }
    public setCampaignId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._campaignId = null;
        } else {
            this._campaignId = value;
        }
    }

    public checkHasCampaignMapId(): boolean {
        return this._campaignMapId != null;
    }
    public getCampaignMapId(): number {
        return this._campaignMapId ?? 0;
    }
    public setCampaignMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._campaignMapId = null;
        } else {
            this._campaignMapId = value;
        }
    }

    public checkHasRevision(): boolean {
        return this._revision != null;
    }
    public getRevision(): number {
        return this._revision ?? 0;
    }
    public setRevision(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._revision = null;
        } else {
            this._revision = value;
        }
    }
}
