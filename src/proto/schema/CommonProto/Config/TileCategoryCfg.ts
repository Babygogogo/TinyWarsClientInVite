import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileCategoryCfgJson extends $ProtoSchemaJsonBase {
    tileCategoryId?: number | null | undefined;
    tileTypeIds: number[];
}

export class TileCategoryCfg extends $ProtoSchemaBase {
    private _tileCategoryId?: number | null | undefined;
    private _tileTypeIds: number[] = [];

    public static fromJson(obj: TileCategoryCfgJson): TileCategoryCfg {
        return new TileCategoryCfg().loadJson(obj);
    }
    public override loadJson(obj: TileCategoryCfgJson): this {
        this.setTileCategoryId(obj.tileCategoryId);
        this.setTileTypeIds(obj.tileTypeIds?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TileCategoryCfgJson): TileCategoryCfgJson {
        obj ??= ({} as TileCategoryCfgJson);

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            obj.tileTypeIds = this.getTileTypeIds().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTileCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileTypeIds();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileCategoryCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileCategoryCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._tileTypeIds;
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TileCategoryCfg {
        return TileCategoryCfg.decode(this.encode());
    }

    public override getSchemaName(): "TileCategoryCfg" {
        return "TileCategoryCfg";
    }

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number {
        return this._tileCategoryId ?? 0;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileCategoryId = null;
        } else {
            this._tileCategoryId = value;
        }
    }

    public getTileTypeIds(): number[] {
        return this._tileTypeIds;
    }
    public setTileTypeIds(value: number[]): void {
        this._tileTypeIds = value;
    }
}
