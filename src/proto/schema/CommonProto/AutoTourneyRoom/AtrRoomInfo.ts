import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForPlayerInRoom as $Message$CommonProto$Structure$DataForPlayerInRoom, type DataForPlayerInRoomJson as $Json$CommonProto$Structure$DataForPlayerInRoom } from "../Structure/DataForPlayerInRoom.js";
import { SettingsForAtw as $Message$CommonProto$WarSettings$SettingsForAtw, type SettingsForAtwJson as $Json$CommonProto$WarSettings$SettingsForAtw } from "../WarSettings/SettingsForAtw.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../WarSettings/SettingsForCommon.js";

export interface AtrRoomInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    timeForCreateRoom?: number | null | undefined;
    timeForStartSetSelfSettings?: number | null | undefined;
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForAtw?: $Json$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    playerDataList: $Json$CommonProto$Structure$DataForPlayerInRoom[];
}

export class AtrRoomInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _timeForCreateRoom?: number | null | undefined;
    private _timeForStartSetSelfSettings?: number | null | undefined;
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForAtw?: $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    private _playerDataList: $Message$CommonProto$Structure$DataForPlayerInRoom[] = [];

    public static fromJson(obj: AtrRoomInfoJson): AtrRoomInfo {
        return new AtrRoomInfo().loadJson(obj);
    }
    public override loadJson(obj: AtrRoomInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setTimeForCreateRoom(obj.timeForCreateRoom);
        this.setTimeForStartSetSelfSettings(obj.timeForStartSetSelfSettings);
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForAtw(obj.settingsForAtw != null ? $Message$CommonProto$WarSettings$SettingsForAtw.fromJson(obj.settingsForAtw) : null);
        this.setPlayerDataList(obj.playerDataList?.map(v => $Message$CommonProto$Structure$DataForPlayerInRoom.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: AtrRoomInfoJson): AtrRoomInfoJson {
        obj ??= ({} as AtrRoomInfoJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getTimeForCreateRoom();
            (value != null) && (obj.timeForCreateRoom = value);
        }

        {
            const value = this.getTimeForStartSetSelfSettings();
            (value != null) && (obj.timeForStartSetSelfSettings = value);
        }

        {
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getSettingsForAtw();
            (value != null) && (obj.settingsForAtw = value.toJson());
        }

        {
            obj.playerDataList = this.getPlayerDataList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRoomId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTimeForCreateRoom();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getTimeForStartSetSelfSettings();
            if (value != null) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForAtw();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getPlayerDataList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(162).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AtrRoomInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AtrRoomInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setTimeForCreateRoom(reader.uint32());
                    break;

                case 3:
                    msg.setTimeForStartSetSelfSettings(reader.uint32());
                    break;

                case 10:
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setSettingsForAtw($Message$CommonProto$WarSettings$SettingsForAtw.decode(reader, reader.uint32()));
                    break;

                case 20:
                    {
                        const arr = msg._playerDataList;
                        arr.push($Message$CommonProto$Structure$DataForPlayerInRoom.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): AtrRoomInfo {
        return AtrRoomInfo.decode(this.encode());
    }

    public override getSchemaName(): "AtrRoomInfo" {
        return "AtrRoomInfo";
    }

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number {
        return this._roomId ?? 0;
    }
    public setRoomId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._roomId = null;
        } else {
            this._roomId = value;
        }
    }

    public checkHasTimeForCreateRoom(): boolean {
        return this._timeForCreateRoom != null;
    }
    public getTimeForCreateRoom(): number {
        return this._timeForCreateRoom ?? 0;
    }
    public setTimeForCreateRoom(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._timeForCreateRoom = null;
        } else {
            this._timeForCreateRoom = value;
        }
    }

    public checkHasTimeForStartSetSelfSettings(): boolean {
        return this._timeForStartSetSelfSettings != null;
    }
    public getTimeForStartSetSelfSettings(): number | null | undefined {
        return this._timeForStartSetSelfSettings;
    }
    public setTimeForStartSetSelfSettings(value: number | null | undefined): void {
        this._timeForStartSetSelfSettings = value;
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

    public getPlayerDataList(): $Message$CommonProto$Structure$DataForPlayerInRoom[] {
        return this._playerDataList;
    }
    public setPlayerDataList(value: $Message$CommonProto$Structure$DataForPlayerInRoom[]): void {
        this._playerDataList = value;
    }
}
