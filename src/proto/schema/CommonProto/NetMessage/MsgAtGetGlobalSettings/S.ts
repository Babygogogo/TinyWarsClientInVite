import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { GlobalSettings as $Message$CommonProto$AutoTourney$GlobalSettings, type GlobalSettingsJson as $Json$CommonProto$AutoTourney$GlobalSettings } from "../../AutoTourney/GlobalSettings.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    globalSettings?: $Json$CommonProto$AutoTourney$GlobalSettings | null | undefined;
    lastCreateTimestamp?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _globalSettings?: $Message$CommonProto$AutoTourney$GlobalSettings | null | undefined;
    private _lastCreateTimestamp?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setGlobalSettings(obj.globalSettings != null ? $Message$CommonProto$AutoTourney$GlobalSettings.fromJson(obj.globalSettings) : null);
        this.setLastCreateTimestamp(obj.lastCreateTimestamp);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getGlobalSettings();
            (value != null) && (obj.globalSettings = value.toJson());
        }

        {
            const value = this.getLastCreateTimestamp();
            (value != null) && (obj.lastCreateTimestamp = value);
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
            const value = this.getGlobalSettings();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getLastCreateTimestamp();
            if (value != null) {
                writer.uint32(24).uint32(value);
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
                    msg.setGlobalSettings($Message$CommonProto$AutoTourney$GlobalSettings.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setLastCreateTimestamp(reader.uint32());
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

    public checkHasGlobalSettings(): boolean {
        return this._globalSettings != null;
    }
    public getGlobalSettings(): $Message$CommonProto$AutoTourney$GlobalSettings | null | undefined {
        return this._globalSettings;
    }
    public setGlobalSettings(value: $Message$CommonProto$AutoTourney$GlobalSettings | null | undefined): void {
        this._globalSettings = value;
    }
    public createIfNotExistsGlobalSettings(): $Message$CommonProto$AutoTourney$GlobalSettings {
        return this._globalSettings ??= new $Message$CommonProto$AutoTourney$GlobalSettings();
    }

    public checkHasLastCreateTimestamp(): boolean {
        return this._lastCreateTimestamp != null;
    }
    public getLastCreateTimestamp(): number | null | undefined {
        return this._lastCreateTimestamp;
    }
    public setLastCreateTimestamp(value: number | null | undefined): void {
        this._lastCreateTimestamp = value;
    }
}
