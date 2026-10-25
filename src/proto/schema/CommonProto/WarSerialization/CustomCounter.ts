import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CustomCounterJson extends $ProtoSchemaJsonBase {
    customCounterId?: number | null | undefined;
    value?: number | null | undefined;
}

export class CustomCounter extends $ProtoSchemaBase {
    private _customCounterId?: number | null | undefined;
    private _value?: number | null | undefined;

    public static fromJson(obj: CustomCounterJson): CustomCounter {
        return new CustomCounter().loadJson(obj);
    }
    public override loadJson(obj: CustomCounterJson): this {
        this.setCustomCounterId(obj.customCounterId);
        this.setValue(obj.value);
        return this;
    }
    public override toJson(obj?: CustomCounterJson): CustomCounterJson {
        obj ??= ({} as CustomCounterJson);

        {
            const value = this.getCustomCounterId();
            (value != null) && (obj.customCounterId = value);
        }

        {
            const value = this.getValue();
            (value != null) && (obj.value = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCustomCounterId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getValue();
            if ((value != null) && (value != 0)) {
                writer.uint32(17).double(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CustomCounter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CustomCounter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCustomCounterId(reader.int32());
                    break;

                case 2:
                    msg.setValue(reader.double());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CustomCounter {
        return CustomCounter.decode(this.encode());
    }

    public override getSchemaName(): "CustomCounter" {
        return "CustomCounter";
    }

    public checkHasCustomCounterId(): boolean {
        return this._customCounterId != null;
    }
    public getCustomCounterId(): number {
        return this._customCounterId ?? 0;
    }
    public setCustomCounterId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._customCounterId = null;
        } else {
            this._customCounterId = value;
        }
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
}
