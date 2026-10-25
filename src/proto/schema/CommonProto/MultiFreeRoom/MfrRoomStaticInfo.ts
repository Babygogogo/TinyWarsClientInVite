import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SettingsForMfw as $Message$CommonProto$WarSettings$SettingsForMfw, type SettingsForMfwJson as $Json$CommonProto$WarSettings$SettingsForMfw } from "../WarSettings/SettingsForMfw.js";

export interface MfrRoomStaticInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    createTime?: number | null | undefined;
    creatorUserId?: number | null | undefined;
    settingsForMfw?: $Json$CommonProto$WarSettings$SettingsForMfw | null | undefined;
}

export class MfrRoomStaticInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _createTime?: number | null | undefined;
    private _creatorUserId?: number | null | undefined;
    private _settingsForMfw?: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined;

    public static fromJson(obj: MfrRoomStaticInfoJson): MfrRoomStaticInfo {
        return new MfrRoomStaticInfo().loadJson(obj);
    }
    public override loadJson(obj: MfrRoomStaticInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setCreateTime(obj.createTime);
        this.setCreatorUserId(obj.creatorUserId);
        this.setSettingsForMfw(obj.settingsForMfw != null ? $Message$CommonProto$WarSettings$SettingsForMfw.fromJson(obj.settingsForMfw) : null);
        return this;
    }
    public override toJson(obj?: MfrRoomStaticInfoJson): MfrRoomStaticInfoJson {
        obj ??= ({} as MfrRoomStaticInfoJson);

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
            const value = this.getSettingsForMfw();
            (value != null) && (obj.settingsForMfw = value.toJson());
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
            const value = this.getSettingsForMfw();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MfrRoomStaticInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MfrRoomStaticInfo();
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
                    msg.setSettingsForMfw($Message$CommonProto$WarSettings$SettingsForMfw.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MfrRoomStaticInfo {
        return MfrRoomStaticInfo.decode(this.encode());
    }

    public override getSchemaName(): "MfrRoomStaticInfo" {
        return "MfrRoomStaticInfo";
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
}
