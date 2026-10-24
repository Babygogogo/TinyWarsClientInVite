import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MovePath as $Message$CommonProto$Structure$MovePath, type MovePathJson as $Json$CommonProto$Structure$MovePath } from "../Structure/MovePath.js";
import { ExtraDataForUnitBoardedByCo as $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo, type ExtraDataForUnitBoardedByCoJson as $Json$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo } from "./WoUnitBoardedByCo/ExtraDataForUnitBoardedByCo.js";

export interface WoUnitBoardedByCoJson extends $ProtoSchemaJsonBase {
    path?: $Json$CommonProto$Structure$MovePath | null | undefined;
    launchUnitId?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo | null | undefined;
}

export class WoUnitBoardedByCo extends $ProtoSchemaBase {
    private _path?: $Message$CommonProto$Structure$MovePath | null | undefined;
    private _launchUnitId?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo | null | undefined;

    public static fromJson(obj: WoUnitBoardedByCoJson): WoUnitBoardedByCo {
        return new WoUnitBoardedByCo().loadJson(obj);
    }
    public override loadJson(obj: WoUnitBoardedByCoJson): this {
        this.setPath(obj.path != null ? $Message$CommonProto$Structure$MovePath.fromJson(obj.path) : null);
        this.setLaunchUnitId(obj.launchUnitId);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoUnitBoardedByCoJson): WoUnitBoardedByCoJson {
        obj ??= ({} as WoUnitBoardedByCoJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoUnitBoardedByCo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoUnitBoardedByCo();
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
                    msg.setExtraData($Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoUnitBoardedByCo {
        return WoUnitBoardedByCo.decode(this.encode());
    }

    public override getSchemaName(): "WoUnitBoardedByCo" {
        return "WoUnitBoardedByCo";
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
    public getExtraData(): $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoUnitBoardedByCo$ExtraDataForUnitBoardedByCo();
    }
}
