import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DropDestination as $Message$CommonProto$Structure$DropDestination, type DropDestinationJson as $Json$CommonProto$Structure$DropDestination } from "../Structure/DropDestination.js";
import { MovePath as $Message$CommonProto$Structure$MovePath, type MovePathJson as $Json$CommonProto$Structure$MovePath } from "../Structure/MovePath.js";
import { ExtraDataForUnitDropUnit as $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit, type ExtraDataForUnitDropUnitJson as $Json$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit } from "./WoUnitDropUnit/ExtraDataForUnitDropUnit.js";

export interface WoUnitDropUnitJson extends $ProtoSchemaJsonBase {
    path?: $Json$CommonProto$Structure$MovePath | null | undefined;
    launchUnitId?: number | null | undefined;
    dropDestinations: $Json$CommonProto$Structure$DropDestination[];
    isDropBlocked?: boolean | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit | null | undefined;
}

export class WoUnitDropUnit extends $ProtoSchemaBase {
    private _path?: $Message$CommonProto$Structure$MovePath | null | undefined;
    private _launchUnitId?: number | null | undefined;
    private _dropDestinations: $Message$CommonProto$Structure$DropDestination[] = [];
    private _isDropBlocked?: boolean | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit | null | undefined;

    public static fromJson(obj: WoUnitDropUnitJson): WoUnitDropUnit {
        return new WoUnitDropUnit().loadJson(obj);
    }
    public override loadJson(obj: WoUnitDropUnitJson): this {
        this.setPath(obj.path != null ? $Message$CommonProto$Structure$MovePath.fromJson(obj.path) : null);
        this.setLaunchUnitId(obj.launchUnitId);
        this.setDropDestinations(obj.dropDestinations?.map(v => $Message$CommonProto$Structure$DropDestination.fromJson(v)) ?? []);
        this.setIsDropBlocked(obj.isDropBlocked);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoUnitDropUnitJson): WoUnitDropUnitJson {
        obj ??= ({} as WoUnitDropUnitJson);

        {
            const value = this.getPath();
            (value != null) && (obj.path = value.toJson());
        }

        {
            const value = this.getLaunchUnitId();
            (value != null) && (obj.launchUnitId = value);
        }

        {
            obj.dropDestinations = this.getDropDestinations().map(v => v.toJson());
        }

        {
            const value = this.getIsDropBlocked();
            (value != null) && (obj.isDropBlocked = value);
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
            const value = this.getDropDestinations();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getIsDropBlocked();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoUnitDropUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoUnitDropUnit();
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
                    {
                        const arr = msg._dropDestinations;
                        arr.push($Message$CommonProto$Structure$DropDestination.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    msg.setIsDropBlocked(reader.bool());
                    break;

                case 5:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoUnitDropUnit {
        return WoUnitDropUnit.decode(this.encode());
    }

    public override getSchemaName(): "WoUnitDropUnit" {
        return "WoUnitDropUnit";
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

    public getDropDestinations(): $Message$CommonProto$Structure$DropDestination[] {
        return this._dropDestinations;
    }
    public setDropDestinations(value: $Message$CommonProto$Structure$DropDestination[]): void {
        this._dropDestinations = value;
    }

    public checkHasIsDropBlocked(): boolean {
        return this._isDropBlocked != null;
    }
    public getIsDropBlocked(): boolean | null | undefined {
        return this._isDropBlocked;
    }
    public setIsDropBlocked(value: boolean | null | undefined): void {
        this._isDropBlocked = value;
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoUnitDropUnit$ExtraDataForUnitDropUnit();
    }
}
