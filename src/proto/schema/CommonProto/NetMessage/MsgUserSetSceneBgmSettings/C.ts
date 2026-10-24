import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SceneBgmSettings as $Message$CommonProto$User$UserSettings$SceneBgmSettings, type SceneBgmSettingsJson as $Json$CommonProto$User$UserSettings$SceneBgmSettings } from "../../User/UserSettings/SceneBgmSettings.js";

export interface CJson extends $ProtoSchemaJsonBase {
    sceneBgmSettings?: $Json$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _sceneBgmSettings?: $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSceneBgmSettings(obj.sceneBgmSettings != null ? $Message$CommonProto$User$UserSettings$SceneBgmSettings.fromJson(obj.sceneBgmSettings) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSceneBgmSettings();
            (value != null) && (obj.sceneBgmSettings = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSceneBgmSettings();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSceneBgmSettings($Message$CommonProto$User$UserSettings$SceneBgmSettings.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
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
