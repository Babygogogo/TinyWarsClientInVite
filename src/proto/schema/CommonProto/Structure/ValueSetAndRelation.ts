import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ValueSetAndRelationJson extends $ProtoSchemaJsonBase {
    valueArray: number[];
    setRelation?: number | null | undefined;
}

export class ValueSetAndRelation extends $ProtoSchemaBase {
    private _valueArray: number[] = [];
    private _setRelation?: number | null | undefined;

    public static fromJson(obj: ValueSetAndRelationJson): ValueSetAndRelation {
        return new ValueSetAndRelation().loadJson(obj);
    }
    public override loadJson(obj: ValueSetAndRelationJson): this {
        this.setValueArray(obj.valueArray?.concat() ?? []);
        this.setSetRelation(obj.setRelation);
        return this;
    }
    public override toJson(obj?: ValueSetAndRelationJson): ValueSetAndRelationJson {
        obj ??= ({} as ValueSetAndRelationJson);

        {
            obj.valueArray = this.getValueArray().concat();
        }

        {
            const value = this.getSetRelation();
            (value != null) && (obj.setRelation = value);
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
            const value = this.getSetRelation();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ValueSetAndRelation {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ValueSetAndRelation();
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
                    msg.setSetRelation(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ValueSetAndRelation {
        return ValueSetAndRelation.decode(this.encode());
    }

    public override getSchemaName(): "ValueSetAndRelation" {
        return "ValueSetAndRelation";
    }

    public getValueArray(): number[] {
        return this._valueArray;
    }
    public setValueArray(value: number[]): void {
        this._valueArray = value;
    }

    public checkHasSetRelation(): boolean {
        return this._setRelation != null;
    }
    public getSetRelation(): number {
        return this._setRelation ?? 0;
    }
    public setSetRelation(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._setRelation = null;
        } else {
            this._setRelation = value;
        }
    }
}
