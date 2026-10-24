import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserSettings as $Message$CommonProto$User$UserSettings, type UserSettingsJson as $Json$CommonProto$User$UserSettings } from "../../User/UserSettings.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    userSettings?: $Json$CommonProto$User$UserSettings | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _userSettings?: $Message$CommonProto$User$UserSettings | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setUserSettings(obj.userSettings != null ? $Message$CommonProto$User$UserSettings.fromJson(obj.userSettings) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getUserSettings();
            (value != null) && (obj.userSettings = value.toJson());
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
            const value = this.getUserSettings();
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
                    msg.setUserSettings($Message$CommonProto$User$UserSettings.decode(reader, reader.uint32()));
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
