import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { GlobalSettings as $Message$CommonProto$AutoTourney$GlobalSettings, type GlobalSettingsJson as $Json$CommonProto$AutoTourney$GlobalSettings } from "../../AutoTourney/GlobalSettings.js";

export interface CJson extends $ProtoSchemaJsonBase {
    globalSettings?: $Json$CommonProto$AutoTourney$GlobalSettings | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _globalSettings?: $Message$CommonProto$AutoTourney$GlobalSettings | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setGlobalSettings(obj.globalSettings != null ? $Message$CommonProto$AutoTourney$GlobalSettings.fromJson(obj.globalSettings) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getGlobalSettings();
            (value != null) && (obj.globalSettings = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGlobalSettings();
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
                    msg.setGlobalSettings($Message$CommonProto$AutoTourney$GlobalSettings.decode(reader, reader.uint32()));
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
}
