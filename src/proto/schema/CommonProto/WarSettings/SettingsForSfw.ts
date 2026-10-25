import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../WarSerialization/SerialWar.js";

export interface SettingsForSfwJson extends $ProtoSchemaJsonBase {
    initialWarData?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
}

export class SettingsForSfw extends $ProtoSchemaBase {
    private _initialWarData?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;

    public static fromJson(obj: SettingsForSfwJson): SettingsForSfw {
        return new SettingsForSfw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForSfwJson): this {
        this.setInitialWarData(obj.initialWarData != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.initialWarData) : null);
        return this;
    }
    public override toJson(obj?: SettingsForSfwJson): SettingsForSfwJson {
        obj ??= ({} as SettingsForSfwJson);

        {
            const value = this.getInitialWarData();
            (value != null) && (obj.initialWarData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getInitialWarData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForSfw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForSfw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setInitialWarData($Message$CommonProto$WarSerialization$SerialWar.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForSfw {
        return SettingsForSfw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForSfw" {
        return "SettingsForSfw";
    }

    public checkHasInitialWarData(): boolean {
        return this._initialWarData != null;
    }
    public getInitialWarData(): $Message$CommonProto$WarSerialization$SerialWar | null | undefined {
        return this._initialWarData;
    }
    public setInitialWarData(value: $Message$CommonProto$WarSerialization$SerialWar | null | undefined): void {
        this._initialWarData = value;
    }
    public createIfNotExistsInitialWarData(): $Message$CommonProto$WarSerialization$SerialWar {
        return this._initialWarData ??= new $Message$CommonProto$WarSerialization$SerialWar();
    }
}
