import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ValueArrayAndPredicateJson extends $ProtoSchemaJsonBase {
    valueArray: number[];
    isOneOf?: boolean | null | undefined;
}

export class ValueArrayAndPredicate extends $ProtoSchemaBase {
    private _valueArray: number[] = [];
    private _isOneOf?: boolean | null | undefined;

    public static fromJson(obj: ValueArrayAndPredicateJson): ValueArrayAndPredicate {
        return new ValueArrayAndPredicate().loadJson(obj);
    }
    public override loadJson(obj: ValueArrayAndPredicateJson): this {
        this.setValueArray(obj.valueArray?.concat() ?? []);
        this.setIsOneOf(obj.isOneOf);
        return this;
    }
    public override toJson(obj?: ValueArrayAndPredicateJson): ValueArrayAndPredicateJson {
        obj ??= ({} as ValueArrayAndPredicateJson);

        {
            obj.valueArray = this.getValueArray().concat();
        }

        {
            const value = this.getIsOneOf();
            (value != null) && (obj.isOneOf = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getValueArray();
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
            const value = this.getIsOneOf();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ValueArrayAndPredicate {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ValueArrayAndPredicate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._valueArray;
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
                    msg.setIsOneOf(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ValueArrayAndPredicate {
        return ValueArrayAndPredicate.decode(this.encode());
    }

    public override getSchemaName(): "ValueArrayAndPredicate" {
        return "ValueArrayAndPredicate";
    }

    public getValueArray(): number[] {
        return this._valueArray;
    }
    public setValueArray(value: number[]): void {
        this._valueArray = value;
    }

    public checkHasIsOneOf(): boolean {
        return this._isOneOf != null;
    }
    public getIsOneOf(): boolean {
        return this._isOneOf ?? false;
    }
    public setIsOneOf(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isOneOf = null;
        } else {
            this._isOneOf = value;
        }
    }
}
