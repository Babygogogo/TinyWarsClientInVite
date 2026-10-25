import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecCustomCounterJson extends $ProtoSchemaJsonBase {
    counterIdArray: number[];
    counterCount?: number | null | undefined;
    counterCountComparator?: number | null | undefined;
    value?: number | null | undefined;
    valueComparator?: number | null | undefined;
    valueDivider?: number | null | undefined;
    valueRemainder?: number | null | undefined;
    valueRemainderComparator?: number | null | undefined;
}

export class WecCustomCounter extends $ProtoSchemaBase {
    private _counterIdArray: number[] = [];
    private _counterCount?: number | null | undefined;
    private _counterCountComparator?: number | null | undefined;
    private _value?: number | null | undefined;
    private _valueComparator?: number | null | undefined;
    private _valueDivider?: number | null | undefined;
    private _valueRemainder?: number | null | undefined;
    private _valueRemainderComparator?: number | null | undefined;

    public static fromJson(obj: WecCustomCounterJson): WecCustomCounter {
        return new WecCustomCounter().loadJson(obj);
    }
    public override loadJson(obj: WecCustomCounterJson): this {
        this.setCounterIdArray(obj.counterIdArray?.concat() ?? []);
        this.setCounterCount(obj.counterCount);
        this.setCounterCountComparator(obj.counterCountComparator);
        this.setValue(obj.value);
        this.setValueComparator(obj.valueComparator);
        this.setValueDivider(obj.valueDivider);
        this.setValueRemainder(obj.valueRemainder);
        this.setValueRemainderComparator(obj.valueRemainderComparator);
        return this;
    }
    public override toJson(obj?: WecCustomCounterJson): WecCustomCounterJson {
        obj ??= ({} as WecCustomCounterJson);

        {
            obj.counterIdArray = this.getCounterIdArray().concat();
        }

        {
            const value = this.getCounterCount();
            (value != null) && (obj.counterCount = value);
        }

        {
            const value = this.getCounterCountComparator();
            (value != null) && (obj.counterCountComparator = value);
        }

        {
            const value = this.getValue();
            (value != null) && (obj.value = value);
        }

        {
            const value = this.getValueComparator();
            (value != null) && (obj.valueComparator = value);
        }

        {
            const value = this.getValueDivider();
            (value != null) && (obj.valueDivider = value);
        }

        {
            const value = this.getValueRemainder();
            (value != null) && (obj.valueRemainder = value);
        }

        {
            const value = this.getValueRemainderComparator();
            (value != null) && (obj.valueRemainderComparator = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCounterIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCounterCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCounterCountComparator();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getValue();
            if (value != null) {
                writer.uint32(32).sint32(value);
            }
        }

        {
            const value = this.getValueComparator();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getValueDivider();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getValueRemainder();
            if (value != null) {
                writer.uint32(56).sint32(value);
            }
        }

        {
            const value = this.getValueRemainderComparator();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecCustomCounter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecCustomCounter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._counterIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 2:
                    msg.setCounterCount(reader.int32());
                    break;

                case 3:
                    msg.setCounterCountComparator(reader.int32());
                    break;

                case 4:
                    msg.setValue(reader.sint32());
                    break;

                case 5:
                    msg.setValueComparator(reader.int32());
                    break;

                case 6:
                    msg.setValueDivider(reader.int32());
                    break;

                case 7:
                    msg.setValueRemainder(reader.sint32());
                    break;

                case 8:
                    msg.setValueRemainderComparator(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecCustomCounter {
        return WecCustomCounter.decode(this.encode());
    }

    public override getSchemaName(): "WecCustomCounter" {
        return "WecCustomCounter";
    }

    public getCounterIdArray(): number[] {
        return this._counterIdArray;
    }
    public setCounterIdArray(value: number[]): void {
        this._counterIdArray = value;
    }

    public checkHasCounterCount(): boolean {
        return this._counterCount != null;
    }
    public getCounterCount(): number {
        return this._counterCount ?? 0;
    }
    public setCounterCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._counterCount = null;
        } else {
            this._counterCount = value;
        }
    }

    public checkHasCounterCountComparator(): boolean {
        return this._counterCountComparator != null;
    }
    public getCounterCountComparator(): number {
        return this._counterCountComparator ?? 0;
    }
    public setCounterCountComparator(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._counterCountComparator = null;
        } else {
            this._counterCountComparator = value;
        }
    }

    public checkHasValue(): boolean {
        return this._value != null;
    }
    public getValue(): number | null | undefined {
        return this._value;
    }
    public setValue(value: number | null | undefined): void {
        this._value = value;
    }

    public checkHasValueComparator(): boolean {
        return this._valueComparator != null;
    }
    public getValueComparator(): number | null | undefined {
        return this._valueComparator;
    }
    public setValueComparator(value: number | null | undefined): void {
        this._valueComparator = value;
    }

    public checkHasValueDivider(): boolean {
        return this._valueDivider != null;
    }
    public getValueDivider(): number | null | undefined {
        return this._valueDivider;
    }
    public setValueDivider(value: number | null | undefined): void {
        this._valueDivider = value;
    }

    public checkHasValueRemainder(): boolean {
        return this._valueRemainder != null;
    }
    public getValueRemainder(): number | null | undefined {
        return this._valueRemainder;
    }
    public setValueRemainder(value: number | null | undefined): void {
        this._valueRemainder = value;
    }

    public checkHasValueRemainderComparator(): boolean {
        return this._valueRemainderComparator != null;
    }
    public getValueRemainderComparator(): number | null | undefined {
        return this._valueRemainderComparator;
    }
    public setValueRemainderComparator(value: number | null | undefined): void {
        this._valueRemainderComparator = value;
    }
}
