import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserRelationInfoJson extends $ProtoSchemaJsonBase {
    followersCount?: number | null | undefined;
    followingUserIdArray: number[];
    blockingUserIdArray: number[];
}

export class UserRelationInfo extends $ProtoSchemaBase {
    private _followersCount?: number | null | undefined;
    private _followingUserIdArray: number[] = [];
    private _blockingUserIdArray: number[] = [];

    public static fromJson(obj: UserRelationInfoJson): UserRelationInfo {
        return new UserRelationInfo().loadJson(obj);
    }
    public override loadJson(obj: UserRelationInfoJson): this {
        this.setFollowersCount(obj.followersCount);
        this.setFollowingUserIdArray(obj.followingUserIdArray?.concat() ?? []);
        this.setBlockingUserIdArray(obj.blockingUserIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UserRelationInfoJson): UserRelationInfoJson {
        obj ??= ({} as UserRelationInfoJson);

        {
            const value = this.getFollowersCount();
            (value != null) && (obj.followersCount = value);
        }

        {
            obj.followingUserIdArray = this.getFollowingUserIdArray().concat();
        }

        {
            obj.blockingUserIdArray = this.getBlockingUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getFollowersCount();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getFollowingUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBlockingUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserRelationInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserRelationInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setFollowersCount(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._followingUserIdArray;
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

                case 3:
                    {
                        const arr = msg._blockingUserIdArray;
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

    public override clone(): UserRelationInfo {
        return UserRelationInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserRelationInfo" {
        return "UserRelationInfo";
    }

    public checkHasFollowersCount(): boolean {
        return this._followersCount != null;
    }
    public getFollowersCount(): number | null | undefined {
        return this._followersCount;
    }
    public setFollowersCount(value: number | null | undefined): void {
        this._followersCount = value;
    }

    public getFollowingUserIdArray(): number[] {
        return this._followingUserIdArray;
    }
    public setFollowingUserIdArray(value: number[]): void {
        this._followingUserIdArray = value;
    }

    public getBlockingUserIdArray(): number[] {
        return this._blockingUserIdArray;
    }
    public setBlockingUserIdArray(value: number[]): void {
        this._blockingUserIdArray = value;
    }
}
