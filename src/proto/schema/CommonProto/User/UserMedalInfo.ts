import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserMedalSingleInfo as $Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo, type UserMedalSingleInfoJson as $Json$CommonProto$User$UserMedalInfo$UserMedalSingleInfo } from "./UserMedalInfo/UserMedalSingleInfo.js";

export interface UserMedalInfoJson extends $ProtoSchemaJsonBase {
    showMedalIdArray: number[];
    ownMedalArray: $Json$CommonProto$User$UserMedalInfo$UserMedalSingleInfo[];
}

export class UserMedalInfo extends $ProtoSchemaBase {
    private _showMedalIdArray: number[] = [];
    private _ownMedalArray: $Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo[] = [];

    public static fromJson(obj: UserMedalInfoJson): UserMedalInfo {
        return new UserMedalInfo().loadJson(obj);
    }
    public override loadJson(obj: UserMedalInfoJson): this {
        this.setShowMedalIdArray(obj.showMedalIdArray?.concat() ?? []);
        this.setOwnMedalArray(obj.ownMedalArray?.map(v => $Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: UserMedalInfoJson): UserMedalInfoJson {
        obj ??= ({} as UserMedalInfoJson);

        {
            obj.showMedalIdArray = this.getShowMedalIdArray().concat();
        }

        {
            obj.ownMedalArray = this.getOwnMedalArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getShowMedalIdArray();
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
            const value = this.getOwnMedalArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMedalInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMedalInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._showMedalIdArray;
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
                        const arr = msg._ownMedalArray;
                        arr.push($Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserMedalInfo {
        return UserMedalInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserMedalInfo" {
        return "UserMedalInfo";
    }

    public getShowMedalIdArray(): number[] {
        return this._showMedalIdArray;
    }
    public setShowMedalIdArray(value: number[]): void {
        this._showMedalIdArray = value;
    }

    public getOwnMedalArray(): $Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo[] {
        return this._ownMedalArray;
    }
    public setOwnMedalArray(value: $Message$CommonProto$User$UserMedalInfo$UserMedalSingleInfo[]): void {
        this._ownMedalArray = value;
    }
}
