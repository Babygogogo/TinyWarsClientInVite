import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface GridIndexJson extends $ProtoSchemaJsonBase {
    x?: number | null | undefined;
    y?: number | null | undefined;
}

export class GridIndex extends $ProtoSchemaBase {
    private _x?: number | null | undefined;
    private _y?: number | null | undefined;

    public static fromJson(obj: GridIndexJson): GridIndex {
        return new GridIndex().loadJson(obj);
    }
    public override loadJson(obj: GridIndexJson): this {
        this.setX(obj.x);
        this.setY(obj.y);
        return this;
    }
    public override toJson(obj?: GridIndexJson): GridIndexJson {
        obj ??= ({} as GridIndexJson);

        {
            const value = this.getX();
            (value != null) && (obj.x = value);
        }

        {
            const value = this.getY();
            (value != null) && (obj.y = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getX();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getY();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GridIndex {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GridIndex();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setX(reader.int32());
                    break;

                case 2:
                    msg.setY(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GridIndex {
        return GridIndex.decode(this.encode());
    }

    public override getSchemaName(): "GridIndex" {
        return "GridIndex";
    }

    public checkHasX(): boolean {
        return this._x != null;
    }
    public getX(): number | null | undefined {
        return this._x;
    }
    public setX(value: number | null | undefined): void {
        this._x = value;
    }

    public checkHasY(): boolean {
        return this._y != null;
    }
    public getY(): number | null | undefined {
        return this._y;
    }
    public setY(value: number | null | undefined): void {
        this._y = value;
    }
}
