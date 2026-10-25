import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { MovePath as $Message$CommonProto$Structure$MovePath, type MovePathJson as $Json$CommonProto$Structure$MovePath } from "../Structure/MovePath.js";
import { ExtraDataForUnitLaunchSilo as $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo, type ExtraDataForUnitLaunchSiloJson as $Json$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo } from "./WoUnitLaunchSilo/ExtraDataForUnitLaunchSilo.js";

export interface WoUnitLaunchSiloJson extends $ProtoSchemaJsonBase {
    path?: $Json$CommonProto$Structure$MovePath | null | undefined;
    launchUnitId?: number | null | undefined;
    targetGridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo | null | undefined;
}

export class WoUnitLaunchSilo extends $ProtoSchemaBase {
    private _path?: $Message$CommonProto$Structure$MovePath | null | undefined;
    private _launchUnitId?: number | null | undefined;
    private _targetGridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo | null | undefined;

    public static fromJson(obj: WoUnitLaunchSiloJson): WoUnitLaunchSilo {
        return new WoUnitLaunchSilo().loadJson(obj);
    }
    public override loadJson(obj: WoUnitLaunchSiloJson): this {
        this.setPath(obj.path != null ? $Message$CommonProto$Structure$MovePath.fromJson(obj.path) : null);
        this.setLaunchUnitId(obj.launchUnitId);
        this.setTargetGridIndex(obj.targetGridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.targetGridIndex) : null);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoUnitLaunchSiloJson): WoUnitLaunchSiloJson {
        obj ??= ({} as WoUnitLaunchSiloJson);

        {
            const value = this.getPath();
            (value != null) && (obj.path = value.toJson());
        }

        {
            const value = this.getLaunchUnitId();
            (value != null) && (obj.launchUnitId = value);
        }

        {
            const value = this.getTargetGridIndex();
            (value != null) && (obj.targetGridIndex = value.toJson());
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPath();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getLaunchUnitId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTargetGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoUnitLaunchSilo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoUnitLaunchSilo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPath($Message$CommonProto$Structure$MovePath.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setLaunchUnitId(reader.int32());
                    break;

                case 3:
                    msg.setTargetGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoUnitLaunchSilo {
        return WoUnitLaunchSilo.decode(this.encode());
    }

    public override getSchemaName(): "WoUnitLaunchSilo" {
        return "WoUnitLaunchSilo";
    }

    public checkHasPath(): boolean {
        return this._path != null;
    }
    public getPath(): $Message$CommonProto$Structure$MovePath | null | undefined {
        return this._path;
    }
    public setPath(value: $Message$CommonProto$Structure$MovePath | null | undefined): void {
        this._path = value;
    }
    public createIfNotExistsPath(): $Message$CommonProto$Structure$MovePath {
        return this._path ??= new $Message$CommonProto$Structure$MovePath();
    }

    public checkHasLaunchUnitId(): boolean {
        return this._launchUnitId != null;
    }
    public getLaunchUnitId(): number | null | undefined {
        return this._launchUnitId;
    }
    public setLaunchUnitId(value: number | null | undefined): void {
        this._launchUnitId = value;
    }

    public checkHasTargetGridIndex(): boolean {
        return this._targetGridIndex != null;
    }
    public getTargetGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._targetGridIndex;
    }
    public setTargetGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._targetGridIndex = value;
    }
    public createIfNotExistsTargetGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._targetGridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoUnitLaunchSilo$ExtraDataForUnitLaunchSilo();
    }
}
