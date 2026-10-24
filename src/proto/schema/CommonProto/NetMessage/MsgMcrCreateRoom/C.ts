import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../../WarSettings/SettingsForCommon.js";
import { SettingsForMcw as $Message$CommonProto$WarSettings$SettingsForMcw, type SettingsForMcwJson as $Json$CommonProto$WarSettings$SettingsForMcw } from "../../WarSettings/SettingsForMcw.js";

export interface CJson extends $ProtoSchemaJsonBase {
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForMcw?: $Json$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    selfPlayerIndex?: number | null | undefined;
    selfCoId?: number | null | undefined;
    selfUnitAndTileSkinId?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForMcw?: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    private _selfPlayerIndex?: number | null | undefined;
    private _selfCoId?: number | null | undefined;
    private _selfUnitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForMcw(obj.settingsForMcw != null ? $Message$CommonProto$WarSettings$SettingsForMcw.fromJson(obj.settingsForMcw) : null);
        this.setSelfPlayerIndex(obj.selfPlayerIndex);
        this.setSelfCoId(obj.selfCoId);
        this.setSelfUnitAndTileSkinId(obj.selfUnitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getSettingsForMcw();
            (value != null) && (obj.settingsForMcw = value.toJson());
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
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMcw();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setSettingsForMcw($Message$CommonProto$WarSettings$SettingsForMcw.decode(reader, reader.uint32()));
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

    public checkHasSettingsForCommon(): boolean {
        return this._settingsForCommon != null;
    }
    public getSettingsForCommon(): $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined {
        return this._settingsForCommon;
    }
    public setSettingsForCommon(value: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined): void {
        this._settingsForCommon = value;
    }
    public createIfNotExistsSettingsForCommon(): $Message$CommonProto$WarSettings$SettingsForCommon {
        return this._settingsForCommon ??= new $Message$CommonProto$WarSettings$SettingsForCommon();
    }

    public checkHasSettingsForMcw(): boolean {
        return this._settingsForMcw != null;
    }
    public getSettingsForMcw(): $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined {
        return this._settingsForMcw;
    }
    public setSettingsForMcw(value: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined): void {
        this._settingsForMcw = value;
    }
    public createIfNotExistsSettingsForMcw(): $Message$CommonProto$WarSettings$SettingsForMcw {
        return this._settingsForMcw ??= new $Message$CommonProto$WarSettings$SettingsForMcw();
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
