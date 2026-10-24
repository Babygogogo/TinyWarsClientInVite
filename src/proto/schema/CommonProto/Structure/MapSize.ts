import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MapSizeJson extends $ProtoSchemaJsonBase {
    width?: number | null | undefined;
    height?: number | null | undefined;
}

export class MapSize extends $ProtoSchemaBase {
    private _width?: number | null | undefined;
    private _height?: number | null | undefined;

    public static fromJson(obj: MapSizeJson): MapSize {
        return new MapSize().loadJson(obj);
    }
    public override loadJson(obj: MapSizeJson): this {
        this.setWidth(obj.width);
        this.setHeight(obj.height);
        return this;
    }
    public override toJson(obj?: MapSizeJson): MapSizeJson {
        obj ??= ({} as MapSizeJson);

        {
            const value = this.getWidth();
            (value != null) && (obj.width = value);
        }

        {
            const value = this.getHeight();
            (value != null) && (obj.height = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWidth();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getHeight();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapSize {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapSize();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWidth(reader.int32());
                    break;

                case 2:
                    msg.setHeight(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapSize {
        return MapSize.decode(this.encode());
    }

    public override getSchemaName(): "MapSize" {
        return "MapSize";
    }

    public checkHasWidth(): boolean {
        return this._width != null;
    }
    public getWidth(): number | null | undefined {
        return this._width;
    }
    public setWidth(value: number | null | undefined): void {
        this._width = value;
    }

    public checkHasHeight(): boolean {
        return this._height != null;
    }
    public getHeight(): number | null | undefined {
        return this._height;
    }
    public setHeight(value: number | null | undefined): void {
        this._height = value;
    }
}
