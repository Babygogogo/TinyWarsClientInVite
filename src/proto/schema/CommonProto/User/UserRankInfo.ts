import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserMrwRankInfo as $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo, type UserMrwRankInfoJson as $Json$CommonProto$User$UserRankInfo$UserMrwRankInfo } from "./UserRankInfo/UserMrwRankInfo.js";

export interface UserRankInfoJson extends $ProtoSchemaJsonBase {
    mrwArray: $Json$CommonProto$User$UserRankInfo$UserMrwRankInfo[];
}

export class UserRankInfo extends $ProtoSchemaBase {
    private _mrwArray: $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[] = [];

    public static fromJson(obj: UserRankInfoJson): UserRankInfo {
        return new UserRankInfo().loadJson(obj);
    }
    public override loadJson(obj: UserRankInfoJson): this {
        this.setMrwArray(obj.mrwArray?.map(v => $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: UserRankInfoJson): UserRankInfoJson {
        obj ??= ({} as UserRankInfoJson);

        {
            obj.mrwArray = this.getMrwArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMrwArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserRankInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserRankInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._mrwArray;
                        arr.push($Message$CommonProto$User$UserRankInfo$UserMrwRankInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserRankInfo {
        return UserRankInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserRankInfo" {
        return "UserRankInfo";
    }

    public getMrwArray(): $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[] {
        return this._mrwArray;
    }
    public setMrwArray(value: $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[]): void {
        this._mrwArray = value;
    }
}
