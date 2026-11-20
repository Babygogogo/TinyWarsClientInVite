import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface AttackRangeOffsetsJson extends $ProtoSchemaJsonBase {
    upperOffset?: number | null | undefined;
}

export class AttackRangeOffsets extends $ProtoSchemaBase {
    private _upperOffset?: number | null | undefined;

    public static fromJson(obj: AttackRangeOffsetsJson): AttackRangeOffsets {
        return new AttackRangeOffsets().loadJson(obj);
    }
    public override loadJson(obj: AttackRangeOffsetsJson): this {
        this.setUpperOffset(obj.upperOffset);
        return this;
    }
    public override toJson(obj?: AttackRangeOffsetsJson): AttackRangeOffsetsJson {
        obj ??= ({} as AttackRangeOffsetsJson);

        {
            const value = this.getUpperOffset();
            (value != null) && (obj.upperOffset = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUpperOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AttackRangeOffsets {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AttackRangeOffsets();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUpperOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): AttackRangeOffsets {
        return AttackRangeOffsets.decode(this.encode());
    }

    public override getSchemaName(): "AttackRangeOffsets" {
        return "AttackRangeOffsets";
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
