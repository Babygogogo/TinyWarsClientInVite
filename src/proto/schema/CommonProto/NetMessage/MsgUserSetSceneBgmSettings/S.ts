import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SceneBgmSettings as $Message$CommonProto$User$UserSettings$SceneBgmSettings, type SceneBgmSettingsJson as $Json$CommonProto$User$UserSettings$SceneBgmSettings } from "../../User/UserSettings/SceneBgmSettings.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    sceneBgmSettings?: $Json$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _sceneBgmSettings?: $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setSceneBgmSettings(obj.sceneBgmSettings != null ? $Message$CommonProto$User$UserSettings$SceneBgmSettings.fromJson(obj.sceneBgmSettings) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getSceneBgmSettings();
            (value != null) && (obj.sceneBgmSettings = value.toJson());
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
            const value = this.getSceneBgmSettings();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setSceneBgmSettings($Message$CommonProto$User$UserSettings$SceneBgmSettings.decode(reader, reader.uint32()));
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

    public checkHasSceneBgmSettings(): boolean {
        return this._sceneBgmSettings != null;
    }
    public getSceneBgmSettings(): $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined {
        return this._sceneBgmSettings;
    }
    public setSceneBgmSettings(value: $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined): void {
        this._sceneBgmSettings = value;
    }
    public createIfNotExistsSceneBgmSettings(): $Message$CommonProto$User$UserSettings$SceneBgmSettings {
        return this._sceneBgmSettings ??= new $Message$CommonProto$User$UserSettings$SceneBgmSettings();
    }
}
