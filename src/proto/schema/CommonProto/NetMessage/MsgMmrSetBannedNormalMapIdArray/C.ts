import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    bannedNormalMapIdArrayForStd: number[];
    bannedNormalMapIdArrayForFog: number[];
}

export class C extends $ProtoSchemaBase {
    private _bannedNormalMapIdArrayForStd: number[] = [];
    private _bannedNormalMapIdArrayForFog: number[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setBannedNormalMapIdArrayForStd(obj.bannedNormalMapIdArrayForStd?.concat() ?? []);
        this.setBannedNormalMapIdArrayForFog(obj.bannedNormalMapIdArrayForFog?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            obj.bannedNormalMapIdArrayForStd = this.getBannedNormalMapIdArrayForStd().concat();
        }

        {
            obj.bannedNormalMapIdArrayForFog = this.getBannedNormalMapIdArrayForFog().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBannedNormalMapIdArrayForStd();
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
            const value = this.getBannedNormalMapIdArrayForFog();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._bannedNormalMapIdArrayForStd;
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
                        const arr = msg._bannedNormalMapIdArrayForFog;
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

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public getBannedNormalMapIdArrayForStd(): number[] {
        return this._bannedNormalMapIdArrayForStd;
    }
    public setBannedNormalMapIdArrayForStd(value: number[]): void {
        this._bannedNormalMapIdArrayForStd = value;
    }

    public getBannedNormalMapIdArrayForFog(): number[] {
        return this._bannedNormalMapIdArrayForFog;
    }
    public setBannedNormalMapIdArrayForFog(value: number[]): void {
        this._bannedNormalMapIdArrayForFog = value;
    }
}
