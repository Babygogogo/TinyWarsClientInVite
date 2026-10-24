import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SettingsForMfw as $Message$CommonProto$WarSettings$SettingsForMfw, type SettingsForMfwJson as $Json$CommonProto$WarSettings$SettingsForMfw } from "../../WarSettings/SettingsForMfw.js";

export interface CJson extends $ProtoSchemaJsonBase {
    settingsForMfw?: $Json$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    selfPlayerIndex?: number | null | undefined;
    selfCoId?: number | null | undefined;
    selfUnitAndTileSkinId?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _settingsForMfw?: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    private _selfPlayerIndex?: number | null | undefined;
    private _selfCoId?: number | null | undefined;
    private _selfUnitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSettingsForMfw(obj.settingsForMfw != null ? $Message$CommonProto$WarSettings$SettingsForMfw.fromJson(obj.settingsForMfw) : null);
        this.setSelfPlayerIndex(obj.selfPlayerIndex);
        this.setSelfCoId(obj.selfCoId);
        this.setSelfUnitAndTileSkinId(obj.selfUnitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSettingsForMfw();
            (value != null) && (obj.settingsForMfw = value.toJson());
        }

        {
            const value = this.getSelfPlayerIndex();
            (value != null) && (obj.selfPlayerIndex = value);
        }

        {
            const value = this.getSelfCoId();
            (value != null) && (obj.selfCoId = value);
        }

        {
            const value = this.getSelfUnitAndTileSkinId();
            (value != null) && (obj.selfUnitAndTileSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSettingsForMfw();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPlayerIndex();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getSelfCoId();
            if (value != null) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getSelfUnitAndTileSkinId();
            if (value != null) {
                writer.uint32(96).int32(value);
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
                    msg.setSettingsForMfw($Message$CommonProto$WarSettings$SettingsForMfw.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setSelfPlayerIndex(reader.int32());
                    break;

                case 11:
                    msg.setSelfCoId(reader.int32());
                    break;

                case 12:
                    msg.setSelfUnitAndTileSkinId(reader.int32());
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

    public checkHasSettingsForMfw(): boolean {
        return this._settingsForMfw != null;
    }
    public getSettingsForMfw(): $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined {
        return this._settingsForMfw;
    }
    public setSettingsForMfw(value: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined): void {
        this._settingsForMfw = value;
    }
    public createIfNotExistsSettingsForMfw(): $Message$CommonProto$WarSettings$SettingsForMfw {
        return this._settingsForMfw ??= new $Message$CommonProto$WarSettings$SettingsForMfw();
    }

    public checkHasSelfPlayerIndex(): boolean {
        return this._selfPlayerIndex != null;
    }
    public getSelfPlayerIndex(): number | null | undefined {
        return this._selfPlayerIndex;
    }
    public setSelfPlayerIndex(value: number | null | undefined): void {
        this._selfPlayerIndex = value;
    }

    public checkHasSelfCoId(): boolean {
        return this._selfCoId != null;
    }
    public getSelfCoId(): number | null | undefined {
        return this._selfCoId;
    }
    public setSelfCoId(value: number | null | undefined): void {
        this._selfCoId = value;
    }

    public checkHasSelfUnitAndTileSkinId(): boolean {
        return this._selfUnitAndTileSkinId != null;
    }
    public getSelfUnitAndTileSkinId(): number | null | undefined {
        return this._selfUnitAndTileSkinId;
    }
    public setSelfUnitAndTileSkinId(value: number | null | undefined): void {
        this._selfUnitAndTileSkinId = value;
    }
}
