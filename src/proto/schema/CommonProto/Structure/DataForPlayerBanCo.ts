import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DataForPlayerBanCoJson extends $ProtoSchemaJsonBase {
    srcPlayerIndex?: number | null | undefined;
    bannedCoIdArray: number[];
}

export class DataForPlayerBanCo extends $ProtoSchemaBase {
    private _srcPlayerIndex?: number | null | undefined;
    private _bannedCoIdArray: number[] = [];

    public static fromJson(obj: DataForPlayerBanCoJson): DataForPlayerBanCo {
        return new DataForPlayerBanCo().loadJson(obj);
    }
    public override loadJson(obj: DataForPlayerBanCoJson): this {
        this.setSrcPlayerIndex(obj.srcPlayerIndex);
        this.setBannedCoIdArray(obj.bannedCoIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: DataForPlayerBanCoJson): DataForPlayerBanCoJson {
        obj ??= ({} as DataForPlayerBanCoJson);

        {
            const value = this.getSrcPlayerIndex();
            (value != null) && (obj.srcPlayerIndex = value);
        }

        {
            obj.bannedCoIdArray = this.getBannedCoIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSrcPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getBannedCoIdArray();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForPlayerBanCo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForPlayerBanCo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSrcPlayerIndex(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._bannedCoIdArray;
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

    public override clone(): DataForPlayerBanCo {
        return DataForPlayerBanCo.decode(this.encode());
    }

    public override getSchemaName(): "DataForPlayerBanCo" {
        return "DataForPlayerBanCo";
    }

    public checkHasSrcPlayerIndex(): boolean {
        return this._srcPlayerIndex != null;
    }
    public getSrcPlayerIndex(): number {
        return this._srcPlayerIndex ?? 0;
    }
    public setSrcPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._srcPlayerIndex = null;
        } else {
            this._srcPlayerIndex = value;
        }
    }

    public getBannedCoIdArray(): number[] {
        return this._bannedCoIdArray;
    }
    public setBannedCoIdArray(value: number[]): void {
        this._bannedCoIdArray = value;
    }
}
