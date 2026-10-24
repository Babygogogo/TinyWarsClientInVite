import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MovePath as $Message$CommonProto$Structure$MovePath, type MovePathJson as $Json$CommonProto$Structure$MovePath } from "../Structure/MovePath.js";
import { ExtraDataForUnitBuildTile as $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile, type ExtraDataForUnitBuildTileJson as $Json$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile } from "./WoUnitBuildTile/ExtraDataForUnitBuildTile.js";

export interface WoUnitBuildTileJson extends $ProtoSchemaJsonBase {
    path?: $Json$CommonProto$Structure$MovePath | null | undefined;
    launchUnitId?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile | null | undefined;
}

export class WoUnitBuildTile extends $ProtoSchemaBase {
    private _path?: $Message$CommonProto$Structure$MovePath | null | undefined;
    private _launchUnitId?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile | null | undefined;

    public static fromJson(obj: WoUnitBuildTileJson): WoUnitBuildTile {
        return new WoUnitBuildTile().loadJson(obj);
    }
    public override loadJson(obj: WoUnitBuildTileJson): this {
        this.setPath(obj.path != null ? $Message$CommonProto$Structure$MovePath.fromJson(obj.path) : null);
        this.setLaunchUnitId(obj.launchUnitId);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoUnitBuildTileJson): WoUnitBuildTileJson {
        obj ??= ({} as WoUnitBuildTileJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoUnitBuildTile {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoUnitBuildTile();
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
                    msg.setExtraData($Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoUnitBuildTile {
        return WoUnitBuildTile.decode(this.encode());
    }

    public override getSchemaName(): "WoUnitBuildTile" {
        return "WoUnitBuildTile";
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
    public getExtraData(): $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoUnitBuildTile$ExtraDataForUnitBuildTile();
    }
}
