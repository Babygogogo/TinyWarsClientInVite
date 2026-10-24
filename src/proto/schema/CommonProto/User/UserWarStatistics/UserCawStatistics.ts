import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserCawStatisticsJson extends $ProtoSchemaJsonBase {
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    campaignMapRevision?: number | null | undefined;
    configVersion?: string | null | undefined;
    highScore?: number | null | undefined;
}

export class UserCawStatistics extends $ProtoSchemaBase {
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _campaignMapRevision?: number | null | undefined;
    private _configVersion?: string | null | undefined;
    private _highScore?: number | null | undefined;

    public static fromJson(obj: UserCawStatisticsJson): UserCawStatistics {
        return new UserCawStatistics().loadJson(obj);
    }
    public override loadJson(obj: UserCawStatisticsJson): this {
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setCampaignMapRevision(obj.campaignMapRevision);
        this.setConfigVersion(obj.configVersion);
        this.setHighScore(obj.highScore);
        return this;
    }
    public override toJson(obj?: UserCawStatisticsJson): UserCawStatisticsJson {
        obj ??= ({} as UserCawStatisticsJson);

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
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            const value = this.getHighScore();
            (value != null) && (obj.highScore = value);
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
            const value = this.getCampaignMapRevision();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getHighScore();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserCawStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserCawStatistics();
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
                    msg.setConfigVersion(reader.string());
                    break;

                case 5:
                    msg.setHighScore(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserCawStatistics {
        return UserCawStatistics.decode(this.encode());
    }

    public override getSchemaName(): "UserCawStatistics" {
        return "UserCawStatistics";
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

    public checkHasCampaignMapRevision(): boolean {
        return this._campaignMapRevision != null;
    }
    public getCampaignMapRevision(): number {
        return this._campaignMapRevision ?? 0;
    }
    public setCampaignMapRevision(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._campaignMapRevision = null;
        } else {
            this._campaignMapRevision = value;
        }
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

    public checkHasHighScore(): boolean {
        return this._highScore != null;
    }
    public getHighScore(): number | null | undefined {
        return this._highScore;
    }
    public setHighScore(value: number | null | undefined): void {
        this._highScore = value;
    }
}
