import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForPlayerInRoom as $Message$CommonProto$Structure$DataForPlayerInRoom, type DataForPlayerInRoomJson as $Json$CommonProto$Structure$DataForPlayerInRoom } from "../Structure/DataForPlayerInRoom.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../WarSettings/SettingsForCommon.js";
import { SettingsForMcw as $Message$CommonProto$WarSettings$SettingsForMcw, type SettingsForMcwJson as $Json$CommonProto$WarSettings$SettingsForMcw } from "../WarSettings/SettingsForMcw.js";

export interface McrRoomInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    createTime?: number | null | undefined;
    creatorUserId?: number | null | undefined;
    ownerPlayerIndex?: number | null | undefined;
    forbiddenUserIdArray: number[];
    lastNotificationTimestamp?: number | null | undefined;
    invitedUserIdArray: number[];
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForMcw?: $Json$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    playerDataList: $Json$CommonProto$Structure$DataForPlayerInRoom[];
}

export class McrRoomInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _createTime?: number | null | undefined;
    private _creatorUserId?: number | null | undefined;
    private _ownerPlayerIndex?: number | null | undefined;
    private _forbiddenUserIdArray: number[] = [];
    private _lastNotificationTimestamp?: number | null | undefined;
    private _invitedUserIdArray: number[] = [];
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForMcw?: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    private _playerDataList: $Message$CommonProto$Structure$DataForPlayerInRoom[] = [];

    public static fromJson(obj: McrRoomInfoJson): McrRoomInfo {
        return new McrRoomInfo().loadJson(obj);
    }
    public override loadJson(obj: McrRoomInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setCreateTime(obj.createTime);
        this.setCreatorUserId(obj.creatorUserId);
        this.setOwnerPlayerIndex(obj.ownerPlayerIndex);
        this.setForbiddenUserIdArray(obj.forbiddenUserIdArray?.concat() ?? []);
        this.setLastNotificationTimestamp(obj.lastNotificationTimestamp);
        this.setInvitedUserIdArray(obj.invitedUserIdArray?.concat() ?? []);
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForMcw(obj.settingsForMcw != null ? $Message$CommonProto$WarSettings$SettingsForMcw.fromJson(obj.settingsForMcw) : null);
        this.setPlayerDataList(obj.playerDataList?.map(v => $Message$CommonProto$Structure$DataForPlayerInRoom.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: McrRoomInfoJson): McrRoomInfoJson {
        obj ??= ({} as McrRoomInfoJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getCreateTime();
            (value != null) && (obj.createTime = value);
        }

        {
            const value = this.getCreatorUserId();
            (value != null) && (obj.creatorUserId = value);
        }

        {
            const value = this.getOwnerPlayerIndex();
            (value != null) && (obj.ownerPlayerIndex = value);
        }

        {
            obj.forbiddenUserIdArray = this.getForbiddenUserIdArray().concat();
        }

        {
            const value = this.getLastNotificationTimestamp();
            (value != null) && (obj.lastNotificationTimestamp = value);
        }

        {
            obj.invitedUserIdArray = this.getInvitedUserIdArray().concat();
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
            const value = this.getCreateTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getCreatorUserId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getOwnerPlayerIndex();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getForbiddenUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getLastNotificationTimestamp();
            if (value != null) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getInvitedUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMcw();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): McrRoomInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new McrRoomInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setCreateTime(reader.uint32());
                    break;

                case 3:
                    msg.setCreatorUserId(reader.int32());
                    break;

                case 4:
                    msg.setOwnerPlayerIndex(reader.int32());
                    break;

                case 5:
                    {
                        const arr = msg._forbiddenUserIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 6:
                    msg.setLastNotificationTimestamp(reader.uint32());
                    break;

                case 7:
                    {
                        const arr = msg._invitedUserIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 10:
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setSettingsForMcw($Message$CommonProto$WarSettings$SettingsForMcw.decode(reader, reader.uint32()));
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

    public override clone(): McrRoomInfo {
        return McrRoomInfo.decode(this.encode());
    }

    public override getSchemaName(): "McrRoomInfo" {
        return "McrRoomInfo";
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

    public checkHasCreateTime(): boolean {
        return this._createTime != null;
    }
    public getCreateTime(): number {
        return this._createTime ?? 0;
    }
    public setCreateTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._createTime = null;
        } else {
            this._createTime = value;
        }
    }

    public checkHasCreatorUserId(): boolean {
        return this._creatorUserId != null;
    }
    public getCreatorUserId(): number {
        return this._creatorUserId ?? 0;
    }
    public setCreatorUserId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._creatorUserId = null;
        } else {
            this._creatorUserId = value;
        }
    }

    public checkHasOwnerPlayerIndex(): boolean {
        return this._ownerPlayerIndex != null;
    }
    public getOwnerPlayerIndex(): number | null | undefined {
        return this._ownerPlayerIndex;
    }
    public setOwnerPlayerIndex(value: number | null | undefined): void {
        this._ownerPlayerIndex = value;
    }

    public getForbiddenUserIdArray(): number[] {
        return this._forbiddenUserIdArray;
    }
    public setForbiddenUserIdArray(value: number[]): void {
        this._forbiddenUserIdArray = value;
    }

    public checkHasLastNotificationTimestamp(): boolean {
        return this._lastNotificationTimestamp != null;
    }
    public getLastNotificationTimestamp(): number | null | undefined {
        return this._lastNotificationTimestamp;
    }
    public setLastNotificationTimestamp(value: number | null | undefined): void {
        this._lastNotificationTimestamp = value;
    }

    public getInvitedUserIdArray(): number[] {
        return this._invitedUserIdArray;
    }
    public setInvitedUserIdArray(value: number[]): void {
        this._invitedUserIdArray = value;
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

    public getPlayerDataList(): $Message$CommonProto$Structure$DataForPlayerInRoom[] {
        return this._playerDataList;
    }
    public setPlayerDataList(value: $Message$CommonProto$Structure$DataForPlayerInRoom[]): void {
        this._playerDataList = value;
    }
}
