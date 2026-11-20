import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface VisionsJson extends $ProtoSchemaJsonBase {
    rangeOffset?: number | null | undefined;
    canSeeThrough?: boolean | null | undefined;
}

export class Visions extends $ProtoSchemaBase {
    private _rangeOffset?: number | null | undefined;
    private _canSeeThrough?: boolean | null | undefined;

    public static fromJson(obj: VisionsJson): Visions {
        return new Visions().loadJson(obj);
    }
    public override loadJson(obj: VisionsJson): this {
        this.setRangeOffset(obj.rangeOffset);
        this.setCanSeeThrough(obj.canSeeThrough);
        return this;
    }
    public override toJson(obj?: VisionsJson): VisionsJson {
        obj ??= ({} as VisionsJson);

        {
            const value = this.getRangeOffset();
            (value != null) && (obj.rangeOffset = value);
        }

        {
            const value = this.getCanSeeThrough();
            (value != null) && (obj.canSeeThrough = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRangeOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCanSeeThrough();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Visions {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Visions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRangeOffset(reader.int32());
                    break;

                case 2:
                    msg.setCanSeeThrough(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Visions {
        return Visions.decode(this.encode());
    }

    public override getSchemaName(): "Visions" {
        return "Visions";
    }

    public checkHasRangeOffset(): boolean {
        return this._rangeOffset != null;
    }
    public getRangeOffset(): number {
        return this._rangeOffset ?? 0;
    }
    public setRangeOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._rangeOffset = null;
        } else {
            this._rangeOffset = value;
        }
    }

    public checkHasCanSeeThrough(): boolean {
        return this._canSeeThrough != null;
    }
    public getCanSeeThrough(): boolean {
        return this._canSeeThrough ?? false;
    }
    public setCanSeeThrough(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canSeeThrough = null;
        } else {
            this._canSeeThrough = value;
        }
    }
}
