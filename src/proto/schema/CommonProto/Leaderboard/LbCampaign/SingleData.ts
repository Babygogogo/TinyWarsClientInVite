import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SingleDataJson extends $ProtoSchemaJsonBase {
    score?: number | null | undefined;
    userIdArray: number[];
}

export class SingleData extends $ProtoSchemaBase {
    private _score?: number | null | undefined;
    private _userIdArray: number[] = [];

    public static fromJson(obj: SingleDataJson): SingleData {
        return new SingleData().loadJson(obj);
    }
    public override loadJson(obj: SingleDataJson): this {
        this.setScore(obj.score);
        this.setUserIdArray(obj.userIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SingleDataJson): SingleDataJson {
        obj ??= ({} as SingleDataJson);

        {
            const value = this.getScore();
            (value != null) && (obj.score = value);
        }

        {
            obj.userIdArray = this.getUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getScore();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUserIdArray();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SingleData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SingleData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setScore(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._userIdArray;
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

    public override clone(): SingleData {
        return SingleData.decode(this.encode());
    }

    public override getSchemaName(): "SingleData" {
        return "SingleData";
    }

    public checkHasScore(): boolean {
        return this._score != null;
    }
    public getScore(): number | null | undefined {
        return this._score;
    }
    public setScore(value: number | null | undefined): void {
        this._score = value;
    }

    public getUserIdArray(): number[] {
        return this._userIdArray;
    }
    public setUserIdArray(value: number[]): void {
        this._userIdArray = value;
    }
}
