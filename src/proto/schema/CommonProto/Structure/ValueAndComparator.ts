import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ValueAndComparatorJson extends $ProtoSchemaJsonBase {
    value?: number | null | undefined;
    comparator?: number | null | undefined;
}

export class ValueAndComparator extends $ProtoSchemaBase {
    private _value?: number | null | undefined;
    private _comparator?: number | null | undefined;

    public static fromJson(obj: ValueAndComparatorJson): ValueAndComparator {
        return new ValueAndComparator().loadJson(obj);
    }
    public override loadJson(obj: ValueAndComparatorJson): this {
        this.setValue(obj.value);
        this.setComparator(obj.comparator);
        return this;
    }
    public override toJson(obj?: ValueAndComparatorJson): ValueAndComparatorJson {
        obj ??= ({} as ValueAndComparatorJson);

        {
            const value = this.getValue();
            (value != null) && (obj.value = value);
        }

        {
            const value = this.getComparator();
            (value != null) && (obj.comparator = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getValue();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getComparator();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ValueAndComparator {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ValueAndComparator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setValue(reader.int32());
                    break;

                case 2:
                    msg.setComparator(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ValueAndComparator {
        return ValueAndComparator.decode(this.encode());
    }

    public override getSchemaName(): "ValueAndComparator" {
        return "ValueAndComparator";
    }

    public checkHasValue(): boolean {
        return this._value != null;
    }
    public getValue(): number {
        return this._value ?? 0;
    }
    public setValue(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._value = null;
        } else {
            this._value = value;
        }
    }

    public checkHasComparator(): boolean {
        return this._comparator != null;
    }
    public getComparator(): number {
        return this._comparator ?? 0;
    }
    public setComparator(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._comparator = null;
        } else {
            this._comparator = value;
        }
    }
}
