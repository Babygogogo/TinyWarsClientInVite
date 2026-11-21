import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface LuckRangeOffsetsJson extends $ProtoSchemaJsonBase {
    lowerOffset?: number | null | undefined;
    upperOffset?: number | null | undefined;
}

export class LuckRangeOffsets extends $ProtoSchemaBase {
    private _lowerOffset?: number | null | undefined;
    private _upperOffset?: number | null | undefined;

    public static fromJson(obj: LuckRangeOffsetsJson): LuckRangeOffsets {
        return new LuckRangeOffsets().loadJson(obj);
    }
    public override loadJson(obj: LuckRangeOffsetsJson): this {
        this.setLowerOffset(obj.lowerOffset);
        this.setUpperOffset(obj.upperOffset);
        return this;
    }
    public override toJson(obj?: LuckRangeOffsetsJson): LuckRangeOffsetsJson {
        obj ??= ({} as LuckRangeOffsetsJson);

        {
            const value = this.getLowerOffset();
            (value != null) && (obj.lowerOffset = value);
        }

        {
            const value = this.getUpperOffset();
            (value != null) && (obj.upperOffset = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getLowerOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUpperOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LuckRangeOffsets {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LuckRangeOffsets();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setLowerOffset(reader.int32());
                    break;

                case 2:
                    msg.setUpperOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LuckRangeOffsets {
        return LuckRangeOffsets.decode(this.encode());
    }

    public override getSchemaName(): "LuckRangeOffsets" {
        return "LuckRangeOffsets";
    }

    public checkHasLowerOffset(): boolean {
        return this._lowerOffset != null;
    }
    public getLowerOffset(): number {
        return this._lowerOffset ?? 0;
    }
    public setLowerOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._lowerOffset = null;
        } else {
            this._lowerOffset = value;
        }
    }

    public checkHasUpperOffset(): boolean {
        return this._upperOffset != null;
    }
    public getUpperOffset(): number {
        return this._upperOffset ?? 0;
    }
    public setUpperOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._upperOffset = null;
        } else {
            this._upperOffset = value;
        }
    }
}
