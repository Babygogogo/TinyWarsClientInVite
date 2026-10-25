import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SingleData as $Message$CommonProto$Leaderboard$LbCampaignMap$SingleData, type SingleDataJson as $Json$CommonProto$Leaderboard$LbCampaignMap$SingleData } from "./LbCampaignMap/SingleData.js";

export interface LbCampaignMapJson extends $ProtoSchemaJsonBase {
    configVersion?: string | null | undefined;
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    campaignMapRevision?: number | null | undefined;
    dataArray: $Json$CommonProto$Leaderboard$LbCampaignMap$SingleData[];
}

export class LbCampaignMap extends $ProtoSchemaBase {
    private _configVersion?: string | null | undefined;
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _campaignMapRevision?: number | null | undefined;
    private _dataArray: $Message$CommonProto$Leaderboard$LbCampaignMap$SingleData[] = [];

    public static fromJson(obj: LbCampaignMapJson): LbCampaignMap {
        return new LbCampaignMap().loadJson(obj);
    }
    public override loadJson(obj: LbCampaignMapJson): this {
        this.setConfigVersion(obj.configVersion);
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setCampaignMapRevision(obj.campaignMapRevision);
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Leaderboard$LbCampaignMap$SingleData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbCampaignMapJson): LbCampaignMapJson {
        obj ??= ({} as LbCampaignMapJson);

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
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
            const value = this.getCampaignMapRevision();
            (value != null) && (obj.campaignMapRevision = value);
        }

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(10).string(value);
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
            const value = this.getCampaignMapRevision();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbCampaignMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbCampaignMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConfigVersion(reader.string());
                    break;

                case 2:
                    msg.setCampaignId(reader.int32());
                    break;

                case 3:
                    msg.setCampaignMapId(reader.int32());
                    break;

                case 4:
                    msg.setCampaignMapRevision(reader.int32());
                    break;

                case 5:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Leaderboard$LbCampaignMap$SingleData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbCampaignMap {
        return LbCampaignMap.decode(this.encode());
    }

    public override getSchemaName(): "LbCampaignMap" {
        return "LbCampaignMap";
    }

    public checkHasConfigVersion(): boolean {
        return this._configVersion != null;
    }
    public getConfigVersion(): string | null | undefined {
        return this._configVersion;
    }
    public setConfigVersion(value: string | null | undefined): void {
        this._configVersion = value;
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

    public getDataArray(): $Message$CommonProto$Leaderboard$LbCampaignMap$SingleData[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Leaderboard$LbCampaignMap$SingleData[]): void {
        this._dataArray = value;
    }
}
