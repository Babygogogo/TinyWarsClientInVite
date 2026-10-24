import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerInfo as $Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo, type PlayerInfoJson as $Json$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo } from "./MpwWarSettings/PlayerInfo.js";
import { SettingsForAtw as $Message$CommonProto$WarSettings$SettingsForAtw, type SettingsForAtwJson as $Json$CommonProto$WarSettings$SettingsForAtw } from "../WarSettings/SettingsForAtw.js";
import { SettingsForCcw as $Message$CommonProto$WarSettings$SettingsForCcw, type SettingsForCcwJson as $Json$CommonProto$WarSettings$SettingsForCcw } from "../WarSettings/SettingsForCcw.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../WarSettings/SettingsForCommon.js";
import { SettingsForMcw as $Message$CommonProto$WarSettings$SettingsForMcw, type SettingsForMcwJson as $Json$CommonProto$WarSettings$SettingsForMcw } from "../WarSettings/SettingsForMcw.js";
import { SettingsForMfw as $Message$CommonProto$WarSettings$SettingsForMfw, type SettingsForMfwJson as $Json$CommonProto$WarSettings$SettingsForMfw } from "../WarSettings/SettingsForMfw.js";
import { SettingsForMmw as $Message$CommonProto$WarSettings$SettingsForMmw, type SettingsForMmwJson as $Json$CommonProto$WarSettings$SettingsForMmw } from "../WarSettings/SettingsForMmw.js";
import { SettingsForMrw as $Message$CommonProto$WarSettings$SettingsForMrw, type SettingsForMrwJson as $Json$CommonProto$WarSettings$SettingsForMrw } from "../WarSettings/SettingsForMrw.js";

export interface MpwWarSettingsJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForMcw?: $Json$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    settingsForMrw?: $Json$CommonProto$WarSettings$SettingsForMrw | null | undefined;
    settingsForMfw?: $Json$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    settingsForCcw?: $Json$CommonProto$WarSettings$SettingsForCcw | null | undefined;
    settingsForMmw?: $Json$CommonProto$WarSettings$SettingsForMmw | null | undefined;
    settingsForAtw?: $Json$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    playerInfoArray: $Json$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo[];
}

export class MpwWarSettings extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForMcw?: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    private _settingsForMrw?: $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined;
    private _settingsForMfw?: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    private _settingsForCcw?: $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined;
    private _settingsForMmw?: $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined;
    private _settingsForAtw?: $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    private _playerInfoArray: $Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo[] = [];

    public static fromJson(obj: MpwWarSettingsJson): MpwWarSettings {
        return new MpwWarSettings().loadJson(obj);
    }
    public override loadJson(obj: MpwWarSettingsJson): this {
        this.setWarId(obj.warId);
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForMcw(obj.settingsForMcw != null ? $Message$CommonProto$WarSettings$SettingsForMcw.fromJson(obj.settingsForMcw) : null);
        this.setSettingsForMrw(obj.settingsForMrw != null ? $Message$CommonProto$WarSettings$SettingsForMrw.fromJson(obj.settingsForMrw) : null);
        this.setSettingsForMfw(obj.settingsForMfw != null ? $Message$CommonProto$WarSettings$SettingsForMfw.fromJson(obj.settingsForMfw) : null);
        this.setSettingsForCcw(obj.settingsForCcw != null ? $Message$CommonProto$WarSettings$SettingsForCcw.fromJson(obj.settingsForCcw) : null);
        this.setSettingsForMmw(obj.settingsForMmw != null ? $Message$CommonProto$WarSettings$SettingsForMmw.fromJson(obj.settingsForMmw) : null);
        this.setSettingsForAtw(obj.settingsForAtw != null ? $Message$CommonProto$WarSettings$SettingsForAtw.fromJson(obj.settingsForAtw) : null);
        this.setPlayerInfoArray(obj.playerInfoArray?.map(v => $Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MpwWarSettingsJson): MpwWarSettingsJson {
        obj ??= ({} as MpwWarSettingsJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getSettingsForMcw();
            (value != null) && (obj.settingsForMcw = value.toJson());
        }

        {
            const value = this.getSettingsForMrw();
            (value != null) && (obj.settingsForMrw = value.toJson());
        }

        {
            const value = this.getSettingsForMfw();
            (value != null) && (obj.settingsForMfw = value.toJson());
        }

        {
            const value = this.getSettingsForCcw();
            (value != null) && (obj.settingsForCcw = value.toJson());
        }

        {
            const value = this.getSettingsForMmw();
            (value != null) && (obj.settingsForMmw = value.toJson());
        }

        {
            const value = this.getSettingsForAtw();
            (value != null) && (obj.settingsForAtw = value.toJson());
        }

        {
            obj.playerInfoArray = this.getPlayerInfoArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMcw();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMrw();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMfw();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForCcw();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMmw();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForAtw();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getPlayerInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(162).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwWarSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwWarSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setSettingsForMcw($Message$CommonProto$WarSettings$SettingsForMcw.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setSettingsForMrw($Message$CommonProto$WarSettings$SettingsForMrw.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setSettingsForMfw($Message$CommonProto$WarSettings$SettingsForMfw.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setSettingsForCcw($Message$CommonProto$WarSettings$SettingsForCcw.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSettingsForMmw($Message$CommonProto$WarSettings$SettingsForMmw.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setSettingsForAtw($Message$CommonProto$WarSettings$SettingsForAtw.decode(reader, reader.uint32()));
                    break;

                case 20:
                    {
                        const arr = msg._playerInfoArray;
                        arr.push($Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MpwWarSettings {
        return MpwWarSettings.decode(this.encode());
    }

    public override getSchemaName(): "MpwWarSettings" {
        return "MpwWarSettings";
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
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

    public checkHasSettingsForMrw(): boolean {
        return this._settingsForMrw != null;
    }
    public getSettingsForMrw(): $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined {
        return this._settingsForMrw;
    }
    public setSettingsForMrw(value: $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined): void {
        this._settingsForMrw = value;
    }
    public createIfNotExistsSettingsForMrw(): $Message$CommonProto$WarSettings$SettingsForMrw {
        return this._settingsForMrw ??= new $Message$CommonProto$WarSettings$SettingsForMrw();
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

    public checkHasSettingsForCcw(): boolean {
        return this._settingsForCcw != null;
    }
    public getSettingsForCcw(): $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined {
        return this._settingsForCcw;
    }
    public setSettingsForCcw(value: $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined): void {
        this._settingsForCcw = value;
    }
    public createIfNotExistsSettingsForCcw(): $Message$CommonProto$WarSettings$SettingsForCcw {
        return this._settingsForCcw ??= new $Message$CommonProto$WarSettings$SettingsForCcw();
    }

    public checkHasSettingsForMmw(): boolean {
        return this._settingsForMmw != null;
    }
    public getSettingsForMmw(): $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined {
        return this._settingsForMmw;
    }
    public setSettingsForMmw(value: $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined): void {
        this._settingsForMmw = value;
    }
    public createIfNotExistsSettingsForMmw(): $Message$CommonProto$WarSettings$SettingsForMmw {
        return this._settingsForMmw ??= new $Message$CommonProto$WarSettings$SettingsForMmw();
    }

    public checkHasSettingsForAtw(): boolean {
        return this._settingsForAtw != null;
    }
    public getSettingsForAtw(): $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined {
        return this._settingsForAtw;
    }
    public setSettingsForAtw(value: $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined): void {
        this._settingsForAtw = value;
    }
    public createIfNotExistsSettingsForAtw(): $Message$CommonProto$WarSettings$SettingsForAtw {
        return this._settingsForAtw ??= new $Message$CommonProto$WarSettings$SettingsForAtw();
    }

    public getPlayerInfoArray(): $Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo[] {
        return this._playerInfoArray;
    }
    public setPlayerInfoArray(value: $Message$CommonProto$MultiPlayerWar$MpwWarSettings$PlayerInfo[]): void {
        this._playerInfoArray = value;
    }
}
