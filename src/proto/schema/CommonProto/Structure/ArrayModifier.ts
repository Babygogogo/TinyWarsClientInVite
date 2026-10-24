import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ArrayModifierJson extends $ProtoSchemaJsonBase {
    addIntArray: number[];
    deleteIntArray: number[];
}

export class ArrayModifier extends $ProtoSchemaBase {
    private _addIntArray: number[] = [];
    private _deleteIntArray: number[] = [];

    public static fromJson(obj: ArrayModifierJson): ArrayModifier {
        return new ArrayModifier().loadJson(obj);
    }
    public override loadJson(obj: ArrayModifierJson): this {
        this.setAddIntArray(obj.addIntArray?.concat() ?? []);
        this.setDeleteIntArray(obj.deleteIntArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: ArrayModifierJson): ArrayModifierJson {
        obj ??= ({} as ArrayModifierJson);

        {
            obj.addIntArray = this.getAddIntArray().concat();
        }

        {
            obj.deleteIntArray = this.getDeleteIntArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getAddIntArray();
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
            const value = this.getDeleteIntArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ArrayModifier {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ArrayModifier();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._addIntArray;
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
                    {
                        const arr = msg._deleteIntArray;
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ArrayModifier {
        return ArrayModifier.decode(this.encode());
    }

    public override getSchemaName(): "ArrayModifier" {
        return "ArrayModifier";
    }

    public getAddIntArray(): number[] {
        return this._addIntArray;
    }
    public setAddIntArray(value: number[]): void {
        this._addIntArray = value;
    }

    public getDeleteIntArray(): number[] {
        return this._deleteIntArray;
    }
    public setDeleteIntArray(value: number[]): void {
        this._deleteIntArray = value;
    }
}
