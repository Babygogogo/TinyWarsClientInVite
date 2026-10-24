import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForPlayerInRoom as $Message$CommonProto$Structure$DataForPlayerInRoom, type DataForPlayerInRoomJson as $Json$CommonProto$Structure$DataForPlayerInRoom } from "../Structure/DataForPlayerInRoom.js";
import { SettingsForMfw as $Message$CommonProto$WarSettings$SettingsForMfw, type SettingsForMfwJson as $Json$CommonProto$WarSettings$SettingsForMfw } from "../WarSettings/SettingsForMfw.js";

export interface MfrRoomInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    createTime?: number | null | undefined;
    creatorUserId?: number | null | undefined;
    ownerPlayerIndex?: number | null | undefined;
    forbiddenUserIdArray: number[];
    lastNotificationTimestamp?: number | null | undefined;
    invitedUserIdArray: number[];
    settingsForMfw?: $Json$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    playerDataList: $Json$CommonProto$Structure$DataForPlayerInRoom[];
}

export class MfrRoomInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _createTime?: number | null | undefined;
    private _creatorUserId?: number | null | undefined;
    private _ownerPlayerIndex?: number | null | undefined;
    private _forbiddenUserIdArray: number[] = [];
    private _lastNotificationTimestamp?: number | null | undefined;
    private _invitedUserIdArray: number[] = [];
    private _settingsForMfw?: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    private _playerDataList: $Message$CommonProto$Structure$DataForPlayerInRoom[] = [];

    public static fromJson(obj: MfrRoomInfoJson): MfrRoomInfo {
        return new MfrRoomInfo().loadJson(obj);
    }
    public override loadJson(obj: MfrRoomInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setCreateTime(obj.createTime);
        this.setCreatorUserId(obj.creatorUserId);
        this.setOwnerPlayerIndex(obj.ownerPlayerIndex);
        this.setForbiddenUserIdArray(obj.forbiddenUserIdArray?.concat() ?? []);
        this.setLastNotificationTimestamp(obj.lastNotificationTimestamp);
        this.setInvitedUserIdArray(obj.invitedUserIdArray?.concat() ?? []);
        this.setSettingsForMfw(obj.settingsForMfw != null ? $Message$CommonProto$WarSettings$SettingsForMfw.fromJson(obj.settingsForMfw) : null);
        this.setPlayerDataList(obj.playerDataList?.map(v => $Message$CommonProto$Structure$DataForPlayerInRoom.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MfrRoomInfoJson): MfrRoomInfoJson {
        obj ??= ({} as MfrRoomInfoJson);

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
            const value = this.getSettingsForMfw();
            (value != null) && (obj.settingsForMfw = value.toJson());
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
            const value = this.getSettingsForMfw();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MfrRoomInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MfrRoomInfo();
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
                    msg.setSettingsForMfw($Message$CommonProto$WarSettings$SettingsForMfw.decode(reader, reader.uint32()));
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

    public override clone(): MfrRoomInfo {
        return MfrRoomInfo.decode(this.encode());
    }

    public override getSchemaName(): "MfrRoomInfo" {
        return "MfrRoomInfo";
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

    public getPlayerDataList(): $Message$CommonProto$Structure$DataForPlayerInRoom[] {
        return this._playerDataList;
    }
    public setPlayerDataList(value: $Message$CommonProto$Structure$DataForPlayerInRoom[]): void {
        this._playerDataList = value;
    }
}
