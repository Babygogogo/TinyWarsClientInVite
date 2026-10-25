import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForFogMapFromPath as $Message$CommonProto$WarSerialization$DataForFogMapFromPath, type DataForFogMapFromPathJson as $Json$CommonProto$WarSerialization$DataForFogMapFromPath } from "./DataForFogMapFromPath.js";

export interface SerialFogMapJson extends $ProtoSchemaJsonBase {
    forceFogCode?: number | null | undefined;
    forceExpirePlayerIndex?: number | null | undefined;
    forceExpireTurnIndex?: number | null | undefined;
    mapsFromPath: $Json$CommonProto$WarSerialization$DataForFogMapFromPath[];
}

export class SerialFogMap extends $ProtoSchemaBase {
    private _forceFogCode?: number | null | undefined;
    private _forceExpirePlayerIndex?: number | null | undefined;
    private _forceExpireTurnIndex?: number | null | undefined;
    private _mapsFromPath: $Message$CommonProto$WarSerialization$DataForFogMapFromPath[] = [];

    public static fromJson(obj: SerialFogMapJson): SerialFogMap {
        return new SerialFogMap().loadJson(obj);
    }
    public override loadJson(obj: SerialFogMapJson): this {
        this.setForceFogCode(obj.forceFogCode);
        this.setForceExpirePlayerIndex(obj.forceExpirePlayerIndex);
        this.setForceExpireTurnIndex(obj.forceExpireTurnIndex);
        this.setMapsFromPath(obj.mapsFromPath?.map(v => $Message$CommonProto$WarSerialization$DataForFogMapFromPath.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialFogMapJson): SerialFogMapJson {
        obj ??= ({} as SerialFogMapJson);

        {
            const value = this.getForceFogCode();
            (value != null) && (obj.forceFogCode = value);
        }

        {
            const value = this.getForceExpirePlayerIndex();
            (value != null) && (obj.forceExpirePlayerIndex = value);
        }

        {
            const value = this.getForceExpireTurnIndex();
            (value != null) && (obj.forceExpireTurnIndex = value);
        }

        {
            obj.mapsFromPath = this.getMapsFromPath().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getForceFogCode();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getForceExpirePlayerIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getForceExpireTurnIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMapsFromPath();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialFogMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialFogMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setForceFogCode(reader.int32());
                    break;

                case 2:
                    msg.setForceExpirePlayerIndex(reader.int32());
                    break;

                case 3:
                    msg.setForceExpireTurnIndex(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._mapsFromPath;
                        arr.push($Message$CommonProto$WarSerialization$DataForFogMapFromPath.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialFogMap {
        return SerialFogMap.decode(this.encode());
    }

    public override getSchemaName(): "SerialFogMap" {
        return "SerialFogMap";
    }

    public checkHasForceFogCode(): boolean {
        return this._forceFogCode != null;
    }
    public getForceFogCode(): number {
        return this._forceFogCode ?? 0;
    }
    public setForceFogCode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._forceFogCode = null;
        } else {
            this._forceFogCode = value;
        }
    }

    public checkHasForceExpirePlayerIndex(): boolean {
        return this._forceExpirePlayerIndex != null;
    }
    public getForceExpirePlayerIndex(): number | null | undefined {
        return this._forceExpirePlayerIndex;
    }
    public setForceExpirePlayerIndex(value: number | null | undefined): void {
        this._forceExpirePlayerIndex = value;
    }

    public checkHasForceExpireTurnIndex(): boolean {
        return this._forceExpireTurnIndex != null;
    }
    public getForceExpireTurnIndex(): number | null | undefined {
        return this._forceExpireTurnIndex;
    }
    public setForceExpireTurnIndex(value: number | null | undefined): void {
        this._forceExpireTurnIndex = value;
    }

    public getMapsFromPath(): $Message$CommonProto$WarSerialization$DataForFogMapFromPath[] {
        return this._mapsFromPath;
    }
    public setMapsFromPath(value: $Message$CommonProto$WarSerialization$DataForFogMapFromPath[]): void {
        this._mapsFromPath = value;
    }
}
