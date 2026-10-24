import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileTypeMappingCfgJson extends $ProtoSchemaJsonBase {
    tileBaseTypeId?: number | null | undefined;
    tileObjectTypeId?: number | null | undefined;
    tileTypeId?: number | null | undefined;
}

export class TileTypeMappingCfg extends $ProtoSchemaBase {
    private _tileBaseTypeId?: number | null | undefined;
    private _tileObjectTypeId?: number | null | undefined;
    private _tileTypeId?: number | null | undefined;

    public static fromJson(obj: TileTypeMappingCfgJson): TileTypeMappingCfg {
        return new TileTypeMappingCfg().loadJson(obj);
    }
    public override loadJson(obj: TileTypeMappingCfgJson): this {
        this.setTileBaseTypeId(obj.tileBaseTypeId);
        this.setTileObjectTypeId(obj.tileObjectTypeId);
        this.setTileTypeId(obj.tileTypeId);
        return this;
    }
    public override toJson(obj?: TileTypeMappingCfgJson): TileTypeMappingCfgJson {
        obj ??= ({} as TileTypeMappingCfgJson);

        {
            const value = this.getTileBaseTypeId();
            (value != null) && (obj.tileBaseTypeId = value);
        }

        {
            const value = this.getTileObjectTypeId();
            (value != null) && (obj.tileObjectTypeId = value);
        }

        {
            const value = this.getTileTypeId();
            (value != null) && (obj.tileTypeId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTileBaseTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileObjectTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTileTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileTypeMappingCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileTypeMappingCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTileBaseTypeId(reader.int32());
                    break;

                case 2:
                    msg.setTileObjectTypeId(reader.int32());
                    break;

                case 3:
                    msg.setTileTypeId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TileTypeMappingCfg {
        return TileTypeMappingCfg.decode(this.encode());
    }

    public override getSchemaName(): "TileTypeMappingCfg" {
        return "TileTypeMappingCfg";
    }

    public checkHasTileBaseTypeId(): boolean {
        return this._tileBaseTypeId != null;
    }
    public getTileBaseTypeId(): number {
        return this._tileBaseTypeId ?? 0;
    }
    public setTileBaseTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileBaseTypeId = null;
        } else {
            this._tileBaseTypeId = value;
        }
    }

    public checkHasTileObjectTypeId(): boolean {
        return this._tileObjectTypeId != null;
    }
    public getTileObjectTypeId(): number {
        return this._tileObjectTypeId ?? 0;
    }
    public setTileObjectTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileObjectTypeId = null;
        } else {
            this._tileObjectTypeId = value;
        }
    }

    public checkHasTileTypeId(): boolean {
        return this._tileTypeId != null;
    }
    public getTileTypeId(): number {
        return this._tileTypeId ?? 0;
    }
    public setTileTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileTypeId = null;
        } else {
            this._tileTypeId = value;
        }
    }
}
