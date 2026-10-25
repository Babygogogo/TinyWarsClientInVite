import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface GridIdAndMarkTypeIdJson extends $ProtoSchemaJsonBase {
    gridId?: number | null | undefined;
    markTypeId?: number | null | undefined;
}

export class GridIdAndMarkTypeId extends $ProtoSchemaBase {
    private _gridId?: number | null | undefined;
    private _markTypeId?: number | null | undefined;

    public static fromJson(obj: GridIdAndMarkTypeIdJson): GridIdAndMarkTypeId {
        return new GridIdAndMarkTypeId().loadJson(obj);
    }
    public override loadJson(obj: GridIdAndMarkTypeIdJson): this {
        this.setGridId(obj.gridId);
        this.setMarkTypeId(obj.markTypeId);
        return this;
    }
    public override toJson(obj?: GridIdAndMarkTypeIdJson): GridIdAndMarkTypeIdJson {
        obj ??= ({} as GridIdAndMarkTypeIdJson);

        {
            const value = this.getGridId();
            (value != null) && (obj.gridId = value);
        }

        {
            const value = this.getMarkTypeId();
            (value != null) && (obj.markTypeId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMarkTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GridIdAndMarkTypeId {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GridIdAndMarkTypeId();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setGridId(reader.int32());
                    break;

                case 2:
                    msg.setMarkTypeId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GridIdAndMarkTypeId {
        return GridIdAndMarkTypeId.decode(this.encode());
    }

    public override getSchemaName(): "GridIdAndMarkTypeId" {
        return "GridIdAndMarkTypeId";
    }

    public checkHasGridId(): boolean {
        return this._gridId != null;
    }
    public getGridId(): number {
        return this._gridId ?? 0;
    }
    public setGridId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._gridId = null;
        } else {
            this._gridId = value;
        }
    }

    public checkHasMarkTypeId(): boolean {
        return this._markTypeId != null;
    }
    public getMarkTypeId(): number {
        return this._markTypeId ?? 0;
    }
    public setMarkTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._markTypeId = null;
        } else {
            this._markTypeId = value;
        }
    }
}
