import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserSettings as $Message$CommonProto$User$UserSettings, type UserSettingsJson as $Json$CommonProto$User$UserSettings } from "../../User/UserSettings.js";

export interface CJson extends $ProtoSchemaJsonBase {
    userSettings?: $Json$CommonProto$User$UserSettings | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _userSettings?: $Message$CommonProto$User$UserSettings | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setUserSettings(obj.userSettings != null ? $Message$CommonProto$User$UserSettings.fromJson(obj.userSettings) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getUserSettings();
            (value != null) && (obj.userSettings = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserSettings();
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
                    msg.setUserSettings($Message$CommonProto$User$UserSettings.decode(reader, reader.uint32()));
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

    public checkHasUserSettings(): boolean {
        return this._userSettings != null;
    }
    public getUserSettings(): $Message$CommonProto$User$UserSettings | null | undefined {
        return this._userSettings;
    }
    public setUserSettings(value: $Message$CommonProto$User$UserSettings | null | undefined): void {
        this._userSettings = value;
    }
    public createIfNotExistsUserSettings(): $Message$CommonProto$User$UserSettings {
        return this._userSettings ??= new $Message$CommonProto$User$UserSettings();
    }
}
