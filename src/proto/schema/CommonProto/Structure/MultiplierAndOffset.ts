import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MultiplierAndOffsetJson extends $ProtoSchemaJsonBase {
    multiplierPct?: number | null | undefined;
    offset?: number | null | undefined;
}

export class MultiplierAndOffset extends $ProtoSchemaBase {
    private _multiplierPct?: number | null | undefined;
    private _offset?: number | null | undefined;

    public static fromJson(obj: MultiplierAndOffsetJson): MultiplierAndOffset {
        return new MultiplierAndOffset().loadJson(obj);
    }
    public override loadJson(obj: MultiplierAndOffsetJson): this {
        this.setMultiplierPct(obj.multiplierPct);
        this.setOffset(obj.offset);
        return this;
    }
    public override toJson(obj?: MultiplierAndOffsetJson): MultiplierAndOffsetJson {
        obj ??= ({} as MultiplierAndOffsetJson);

        {
            const value = this.getMultiplierPct();
            (value != null) && (obj.multiplierPct = value);
        }

        {
            const value = this.getOffset();
            (value != null) && (obj.offset = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiplierAndOffset {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiplierAndOffset();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMultiplierPct(reader.int32());
                    break;

                case 2:
                    msg.setOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MultiplierAndOffset {
        return MultiplierAndOffset.decode(this.encode());
    }

    public override getSchemaName(): "MultiplierAndOffset" {
        return "MultiplierAndOffset";
    }

    public checkHasMultiplierPct(): boolean {
        return this._multiplierPct != null;
    }
    public getMultiplierPct(): number {
        return this._multiplierPct ?? 0;
    }
    public setMultiplierPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._multiplierPct = null;
        } else {
            this._multiplierPct = value;
        }
    }

    public checkHasOffset(): boolean {
        return this._offset != null;
    }
    public getOffset(): number {
        return this._offset ?? 0;
    }
    public setOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offset = null;
        } else {
            this._offset = value;
        }
    }
}
