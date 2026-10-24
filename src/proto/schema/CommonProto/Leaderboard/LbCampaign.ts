import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SingleData as $Message$CommonProto$Leaderboard$LbCampaign$SingleData, type SingleDataJson as $Json$CommonProto$Leaderboard$LbCampaign$SingleData } from "./LbCampaign/SingleData.js";

export interface LbCampaignJson extends $ProtoSchemaJsonBase {
    configVersion?: string | null | undefined;
    campaignId?: number | null | undefined;
    dataArray: $Json$CommonProto$Leaderboard$LbCampaign$SingleData[];
}

export class LbCampaign extends $ProtoSchemaBase {
    private _configVersion?: string | null | undefined;
    private _campaignId?: number | null | undefined;
    private _dataArray: $Message$CommonProto$Leaderboard$LbCampaign$SingleData[] = [];

    public static fromJson(obj: LbCampaignJson): LbCampaign {
        return new LbCampaign().loadJson(obj);
    }
    public override loadJson(obj: LbCampaignJson): this {
        this.setConfigVersion(obj.configVersion);
        this.setCampaignId(obj.campaignId);
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Leaderboard$LbCampaign$SingleData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbCampaignJson): LbCampaignJson {
        obj ??= ({} as LbCampaignJson);

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
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
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbCampaign {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbCampaign();
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
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Leaderboard$LbCampaign$SingleData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbCampaign {
        return LbCampaign.decode(this.encode());
    }

    public override getSchemaName(): "LbCampaign" {
        return "LbCampaign";
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

    public getDataArray(): $Message$CommonProto$Leaderboard$LbCampaign$SingleData[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Leaderboard$LbCampaign$SingleData[]): void {
        this._dataArray = value;
    }
}
