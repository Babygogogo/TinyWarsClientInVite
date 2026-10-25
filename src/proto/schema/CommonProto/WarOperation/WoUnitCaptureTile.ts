import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MovePath as $Message$CommonProto$Structure$MovePath, type MovePathJson as $Json$CommonProto$Structure$MovePath } from "../Structure/MovePath.js";
import { ExtraDataForUnitCaptureTile as $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile, type ExtraDataForUnitCaptureTileJson as $Json$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile } from "./WoUnitCaptureTile/ExtraDataForUnitCaptureTile.js";

export interface WoUnitCaptureTileJson extends $ProtoSchemaJsonBase {
    path?: $Json$CommonProto$Structure$MovePath | null | undefined;
    launchUnitId?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile | null | undefined;
}

export class WoUnitCaptureTile extends $ProtoSchemaBase {
    private _path?: $Message$CommonProto$Structure$MovePath | null | undefined;
    private _launchUnitId?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile | null | undefined;

    public static fromJson(obj: WoUnitCaptureTileJson): WoUnitCaptureTile {
        return new WoUnitCaptureTile().loadJson(obj);
    }
    public override loadJson(obj: WoUnitCaptureTileJson): this {
        this.setPath(obj.path != null ? $Message$CommonProto$Structure$MovePath.fromJson(obj.path) : null);
        this.setLaunchUnitId(obj.launchUnitId);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoUnitCaptureTileJson): WoUnitCaptureTileJson {
        obj ??= ({} as WoUnitCaptureTileJson);

        {
            const value = this.getPath();
            (value != null) && (obj.path = value.toJson());
        }

        {
            const value = this.getLaunchUnitId();
            (value != null) && (obj.launchUnitId = value);
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
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoUnitCaptureTile {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoUnitCaptureTile();
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
                    msg.setExtraData($Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoUnitCaptureTile {
        return WoUnitCaptureTile.decode(this.encode());
    }

    public override getSchemaName(): "WoUnitCaptureTile" {
        return "WoUnitCaptureTile";
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

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoUnitCaptureTile$ExtraDataForUnitCaptureTile();
    }
}
