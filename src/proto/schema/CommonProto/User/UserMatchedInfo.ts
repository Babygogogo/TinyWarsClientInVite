import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserMatchedInfoJson extends $ProtoSchemaJsonBase {
    matchedUserIdArray: number[];
}

export class UserMatchedInfo extends $ProtoSchemaBase {
    private _matchedUserIdArray: number[] = [];

    public static fromJson(obj: UserMatchedInfoJson): UserMatchedInfo {
        return new UserMatchedInfo().loadJson(obj);
    }
    public override loadJson(obj: UserMatchedInfoJson): this {
        this.setMatchedUserIdArray(obj.matchedUserIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UserMatchedInfoJson): UserMatchedInfoJson {
        obj ??= ({} as UserMatchedInfoJson);

        {
            obj.matchedUserIdArray = this.getMatchedUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMatchedUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMatchedInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMatchedInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._matchedUserIdArray;
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

    public override clone(): UserMatchedInfo {
        return UserMatchedInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserMatchedInfo" {
        return "UserMatchedInfo";
    }

    public getMatchedUserIdArray(): number[] {
        return this._matchedUserIdArray;
    }
    public setMatchedUserIdArray(value: number[]): void {
        this._matchedUserIdArray = value;
    }
}
