import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../WarSettings/SettingsForCommon.js";
import { SettingsForMcw as $Message$CommonProto$WarSettings$SettingsForMcw, type SettingsForMcwJson as $Json$CommonProto$WarSettings$SettingsForMcw } from "../WarSettings/SettingsForMcw.js";

export interface McrRoomStaticInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    createTime?: number | null | undefined;
    creatorUserId?: number | null | undefined;
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForMcw?: $Json$CommonProto$WarSettings$SettingsForMcw | null | undefined;
}

export class McrRoomStaticInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _createTime?: number | null | undefined;
    private _creatorUserId?: number | null | undefined;
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForMcw?: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined;

    public static fromJson(obj: McrRoomStaticInfoJson): McrRoomStaticInfo {
        return new McrRoomStaticInfo().loadJson(obj);
    }
    public override loadJson(obj: McrRoomStaticInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setCreateTime(obj.createTime);
        this.setCreatorUserId(obj.creatorUserId);
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForMcw(obj.settingsForMcw != null ? $Message$CommonProto$WarSettings$SettingsForMcw.fromJson(obj.settingsForMcw) : null);
        return this;
    }
    public override toJson(obj?: McrRoomStaticInfoJson): McrRoomStaticInfoJson {
        obj ??= ({} as McrRoomStaticInfoJson);

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
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getSettingsForMcw();
            (value != null) && (obj.settingsForMcw = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRoomId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCreateTime();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getCreatorUserId();
            if (value != null) {
                writer.uint32(24).int32(value);
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): McrRoomStaticInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new McrRoomStaticInfo();
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

                case 10:
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setSettingsForMcw($Message$CommonProto$WarSettings$SettingsForMcw.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): McrRoomStaticInfo {
        return McrRoomStaticInfo.decode(this.encode());
    }

    public override getSchemaName(): "McrRoomStaticInfo" {
        return "McrRoomStaticInfo";
    }

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number | null | undefined {
        return this._roomId;
    }
    public setRoomId(value: number | null | undefined): void {
        this._roomId = value;
    }

    public checkHasCreateTime(): boolean {
        return this._createTime != null;
    }
    public getCreateTime(): number | null | undefined {
        return this._createTime;
    }
    public setCreateTime(value: number | null | undefined): void {
        this._createTime = value;
    }

    public checkHasCreatorUserId(): boolean {
        return this._creatorUserId != null;
    }
    public getCreatorUserId(): number | null | undefined {
        return this._creatorUserId;
    }
    public setCreatorUserId(value: number | null | undefined): void {
        this._creatorUserId = value;
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
}
