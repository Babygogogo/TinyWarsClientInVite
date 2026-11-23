import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface RepairAmountsJson extends $ProtoSchemaJsonBase {
    offset?: number | null | undefined;
}

export class RepairAmounts extends $ProtoSchemaBase {
    private _offset?: number | null | undefined;

    public static fromJson(obj: RepairAmountsJson): RepairAmounts {
        return new RepairAmounts().loadJson(obj);
    }
    public override loadJson(obj: RepairAmountsJson): this {
        this.setOffset(obj.offset);
        return this;
    }
    public override toJson(obj?: RepairAmountsJson): RepairAmountsJson {
        obj ??= ({} as RepairAmountsJson);

        {
            const value = this.getOffset();
            (value != null) && (obj.offset = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): RepairAmounts {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new RepairAmounts();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): RepairAmounts {
        return RepairAmounts.decode(this.encode());
    }

    public override getSchemaName(): "RepairAmounts" {
        return "RepairAmounts";
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
