import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserSrwStatisticsJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    ruleId?: number | null | undefined;
    highScore?: number | null | undefined;
    configVersion?: string | null | undefined;
    templateWarRuleTimestamp?: number | null | undefined;
}

export class UserSrwStatistics extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _ruleId?: number | null | undefined;
    private _highScore?: number | null | undefined;
    private _configVersion?: string | null | undefined;
    private _templateWarRuleTimestamp?: number | null | undefined;

    public static fromJson(obj: UserSrwStatisticsJson): UserSrwStatistics {
        return new UserSrwStatistics().loadJson(obj);
    }
    public override loadJson(obj: UserSrwStatisticsJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setRuleId(obj.ruleId);
        this.setHighScore(obj.highScore);
        this.setConfigVersion(obj.configVersion);
        this.setTemplateWarRuleTimestamp(obj.templateWarRuleTimestamp);
        return this;
    }
    public override toJson(obj?: UserSrwStatisticsJson): UserSrwStatisticsJson {
        obj ??= ({} as UserSrwStatisticsJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }

        {
            const value = this.getHighScore();
            (value != null) && (obj.highScore = value);
        }

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            const value = this.getTemplateWarRuleTimestamp();
            (value != null) && (obj.templateWarRuleTimestamp = value);
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
            const value = this.getRuleId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getHighScore();
            if (value != null) {
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
            const value = this.getTemplateWarRuleTimestamp();
            if (value != null) {
                writer.uint32(40).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserSrwStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserSrwStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setRuleId(reader.int32());
                    break;

                case 3:
                    msg.setHighScore(reader.int32());
                    break;

                case 4:
                    msg.setConfigVersion(reader.string());
                    break;

                case 5:
                    msg.setTemplateWarRuleTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserSrwStatistics {
        return UserSrwStatistics.decode(this.encode());
    }

    public override getSchemaName(): "UserSrwStatistics" {
        return "UserSrwStatistics";
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

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number | null | undefined {
        return this._ruleId;
    }
    public setRuleId(value: number | null | undefined): void {
        this._ruleId = value;
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

    public checkHasConfigVersion(): boolean {
        return this._configVersion != null;
    }
    public getConfigVersion(): string | null | undefined {
        return this._configVersion;
    }
    public setConfigVersion(value: string | null | undefined): void {
        this._configVersion = value;
    }

    public checkHasTemplateWarRuleTimestamp(): boolean {
        return this._templateWarRuleTimestamp != null;
    }
    public getTemplateWarRuleTimestamp(): number | null | undefined {
        return this._templateWarRuleTimestamp;
    }
    public setTemplateWarRuleTimestamp(value: number | null | undefined): void {
        this._templateWarRuleTimestamp = value;
    }
}
