import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserCawStatistics as $Message$CommonProto$User$UserWarStatistics$UserCawStatistics, type UserCawStatisticsJson as $Json$CommonProto$User$UserWarStatistics$UserCawStatistics } from "./UserWarStatistics/UserCawStatistics.js";
import { UserMpwStatistics as $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics, type UserMpwStatisticsJson as $Json$CommonProto$User$UserWarStatistics$UserMpwStatistics } from "./UserWarStatistics/UserMpwStatistics.js";
import { UserSrwStatistics as $Message$CommonProto$User$UserWarStatistics$UserSrwStatistics, type UserSrwStatisticsJson as $Json$CommonProto$User$UserWarStatistics$UserSrwStatistics } from "./UserWarStatistics/UserSrwStatistics.js";

export interface UserWarStatisticsJson extends $ProtoSchemaJsonBase {
    mpwArray: $Json$CommonProto$User$UserWarStatistics$UserMpwStatistics[];
    srwArray: $Json$CommonProto$User$UserWarStatistics$UserSrwStatistics[];
    cawArray: $Json$CommonProto$User$UserWarStatistics$UserCawStatistics[];
}

export class UserWarStatistics extends $ProtoSchemaBase {
    private _mpwArray: $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[] = [];
    private _srwArray: $Message$CommonProto$User$UserWarStatistics$UserSrwStatistics[] = [];
    private _cawArray: $Message$CommonProto$User$UserWarStatistics$UserCawStatistics[] = [];

    public static fromJson(obj: UserWarStatisticsJson): UserWarStatistics {
        return new UserWarStatistics().loadJson(obj);
    }
    public override loadJson(obj: UserWarStatisticsJson): this {
        this.setMpwArray(obj.mpwArray?.map(v => $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics.fromJson(v)) ?? []);
        this.setSrwArray(obj.srwArray?.map(v => $Message$CommonProto$User$UserWarStatistics$UserSrwStatistics.fromJson(v)) ?? []);
        this.setCawArray(obj.cawArray?.map(v => $Message$CommonProto$User$UserWarStatistics$UserCawStatistics.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: UserWarStatisticsJson): UserWarStatisticsJson {
        obj ??= ({} as UserWarStatisticsJson);

        {
            obj.mpwArray = this.getMpwArray().map(v => v.toJson());
        }

        {
            obj.srwArray = this.getSrwArray().map(v => v.toJson());
        }

        {
            obj.cawArray = this.getCawArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMpwArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getSrwArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCawArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserWarStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserWarStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._mpwArray;
                        arr.push($Message$CommonProto$User$UserWarStatistics$UserMpwStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._srwArray;
                        arr.push($Message$CommonProto$User$UserWarStatistics$UserSrwStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._cawArray;
                        arr.push($Message$CommonProto$User$UserWarStatistics$UserCawStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserWarStatistics {
        return UserWarStatistics.decode(this.encode());
    }

    public override getSchemaName(): "UserWarStatistics" {
        return "UserWarStatistics";
    }

    public getMpwArray(): $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[] {
        return this._mpwArray;
    }
    public setMpwArray(value: $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[]): void {
        this._mpwArray = value;
    }

    public getSrwArray(): $Message$CommonProto$User$UserWarStatistics$UserSrwStatistics[] {
        return this._srwArray;
    }
    public setSrwArray(value: $Message$CommonProto$User$UserWarStatistics$UserSrwStatistics[]): void {
        this._srwArray = value;
    }

    public getCawArray(): $Message$CommonProto$User$UserWarStatistics$UserCawStatistics[] {
        return this._cawArray;
    }
    public setCawArray(value: $Message$CommonProto$User$UserWarStatistics$UserCawStatistics[]): void {
        this._cawArray = value;
    }
}
