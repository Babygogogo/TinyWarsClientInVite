import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { InstanceWarRule as $Message$CommonProto$WarRule$InstanceWarRule, type InstanceWarRuleJson as $Json$CommonProto$WarRule$InstanceWarRule } from "../WarRule/InstanceWarRule.js";

export interface SettingsForCommonJson extends $ProtoSchemaJsonBase {
    configVersion?: string | null | undefined;
    warOperationsLimit?: number | null | undefined;
    turnsLimit?: number | null | undefined;
    instanceWarRule?: $Json$CommonProto$WarRule$InstanceWarRule | null | undefined;
}

export class SettingsForCommon extends $ProtoSchemaBase {
    private _configVersion?: string | null | undefined;
    private _warOperationsLimit?: number | null | undefined;
    private _turnsLimit?: number | null | undefined;
    private _instanceWarRule?: $Message$CommonProto$WarRule$InstanceWarRule | null | undefined;

    public static fromJson(obj: SettingsForCommonJson): SettingsForCommon {
        return new SettingsForCommon().loadJson(obj);
    }
    public override loadJson(obj: SettingsForCommonJson): this {
        this.setConfigVersion(obj.configVersion);
        this.setWarOperationsLimit(obj.warOperationsLimit);
        this.setTurnsLimit(obj.turnsLimit);
        this.setInstanceWarRule(obj.instanceWarRule != null ? $Message$CommonProto$WarRule$InstanceWarRule.fromJson(obj.instanceWarRule) : null);
        return this;
    }
    public override toJson(obj?: SettingsForCommonJson): SettingsForCommonJson {
        obj ??= ({} as SettingsForCommonJson);

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            const value = this.getWarOperationsLimit();
            (value != null) && (obj.warOperationsLimit = value);
        }

        {
            const value = this.getTurnsLimit();
            (value != null) && (obj.turnsLimit = value);
        }

        {
            const value = this.getInstanceWarRule();
            (value != null) && (obj.instanceWarRule = value.toJson());
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
            const value = this.getWarOperationsLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTurnsLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getInstanceWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForCommon {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForCommon();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConfigVersion(reader.string());
                    break;

                case 3:
                    msg.setWarOperationsLimit(reader.int32());
                    break;

                case 4:
                    msg.setTurnsLimit(reader.int32());
                    break;

                case 5:
                    msg.setInstanceWarRule($Message$CommonProto$WarRule$InstanceWarRule.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForCommon {
        return SettingsForCommon.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForCommon" {
        return "SettingsForCommon";
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

    public checkHasWarOperationsLimit(): boolean {
        return this._warOperationsLimit != null;
    }
    public getWarOperationsLimit(): number {
        return this._warOperationsLimit ?? 0;
    }
    public setWarOperationsLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warOperationsLimit = null;
        } else {
            this._warOperationsLimit = value;
        }
    }

    public checkHasTurnsLimit(): boolean {
        return this._turnsLimit != null;
    }
    public getTurnsLimit(): number {
        return this._turnsLimit ?? 0;
    }
    public setTurnsLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turnsLimit = null;
        } else {
            this._turnsLimit = value;
        }
    }

    public checkHasInstanceWarRule(): boolean {
        return this._instanceWarRule != null;
    }
    public getInstanceWarRule(): $Message$CommonProto$WarRule$InstanceWarRule | null | undefined {
        return this._instanceWarRule;
    }
    public setInstanceWarRule(value: $Message$CommonProto$WarRule$InstanceWarRule | null | undefined): void {
        this._instanceWarRule = value;
    }
    public createIfNotExistsInstanceWarRule(): $Message$CommonProto$WarRule$InstanceWarRule {
        return this._instanceWarRule ??= new $Message$CommonProto$WarRule$InstanceWarRule();
    }
}
