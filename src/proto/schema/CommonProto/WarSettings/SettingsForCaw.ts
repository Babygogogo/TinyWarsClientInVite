import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SettingsForCawJson extends $ProtoSchemaJsonBase {
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    campaignMapRevision?: number | null | undefined;
    warSignature?: string | null | undefined;
    totalScore?: number | null | undefined;
    initialCoIdArray: number[];
}

export class SettingsForCaw extends $ProtoSchemaBase {
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _campaignMapRevision?: number | null | undefined;
    private _warSignature?: string | null | undefined;
    private _totalScore?: number | null | undefined;
    private _initialCoIdArray: number[] = [];

    public static fromJson(obj: SettingsForCawJson): SettingsForCaw {
        return new SettingsForCaw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForCawJson): this {
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setCampaignMapRevision(obj.campaignMapRevision);
        this.setWarSignature(obj.warSignature);
        this.setTotalScore(obj.totalScore);
        this.setInitialCoIdArray(obj.initialCoIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SettingsForCawJson): SettingsForCawJson {
        obj ??= ({} as SettingsForCawJson);

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
            const value = this.getWarSignature();
            (value != null) && (obj.warSignature = value);
        }

        {
            const value = this.getTotalScore();
            (value != null) && (obj.totalScore = value);
        }

        {
            obj.initialCoIdArray = this.getInitialCoIdArray().concat();
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
            const value = this.getWarSignature();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getTotalScore();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getInitialCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForCaw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForCaw();
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
                    msg.setWarSignature(reader.string());
                    break;

                case 10:
                    msg.setTotalScore(reader.int32());
                    break;

                case 11:
                    {
                        const arr = msg._initialCoIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForCaw {
        return SettingsForCaw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForCaw" {
        return "SettingsForCaw";
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

    public checkHasWarSignature(): boolean {
        return this._warSignature != null;
    }
    public getWarSignature(): string | null | undefined {
        return this._warSignature;
    }
    public setWarSignature(value: string | null | undefined): void {
        this._warSignature = value;
    }

    public checkHasTotalScore(): boolean {
        return this._totalScore != null;
    }
    public getTotalScore(): number | null | undefined {
        return this._totalScore;
    }
    public setTotalScore(value: number | null | undefined): void {
        this._totalScore = value;
    }

    public getInitialCoIdArray(): number[] {
        return this._initialCoIdArray;
    }
    public setInitialCoIdArray(value: number[]): void {
        this._initialCoIdArray = value;
    }
}
