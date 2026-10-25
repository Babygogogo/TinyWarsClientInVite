import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserBriefInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    nickname?: string | null | undefined;
    showMedalIdArray: number[];
    avatarId?: number | null | undefined;
}

export class UserBriefInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _nickname?: string | null | undefined;
    private _showMedalIdArray: number[] = [];
    private _avatarId?: number | null | undefined;

    public static fromJson(obj: UserBriefInfoJson): UserBriefInfo {
        return new UserBriefInfo().loadJson(obj);
    }
    public override loadJson(obj: UserBriefInfoJson): this {
        this.setUserId(obj.userId);
        this.setNickname(obj.nickname);
        this.setShowMedalIdArray(obj.showMedalIdArray?.concat() ?? []);
        this.setAvatarId(obj.avatarId);
        return this;
    }
    public override toJson(obj?: UserBriefInfoJson): UserBriefInfoJson {
        obj ??= ({} as UserBriefInfoJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getNickname();
            (value != null) && (obj.nickname = value);
        }

        {
            obj.showMedalIdArray = this.getShowMedalIdArray().concat();
        }

        {
            const value = this.getAvatarId();
            (value != null) && (obj.avatarId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getNickname();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getShowMedalIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getAvatarId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserBriefInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserBriefInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setNickname(reader.string());
                    break;

                case 3:
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

                case 4:
                    msg.setAvatarId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserBriefInfo {
        return UserBriefInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserBriefInfo" {
        return "UserBriefInfo";
    }

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasNickname(): boolean {
        return this._nickname != null;
    }
    public getNickname(): string | null | undefined {
        return this._nickname;
    }
    public setNickname(value: string | null | undefined): void {
        this._nickname = value;
    }

    public getShowMedalIdArray(): number[] {
        return this._showMedalIdArray;
    }
    public setShowMedalIdArray(value: number[]): void {
        this._showMedalIdArray = value;
    }

    public checkHasAvatarId(): boolean {
        return this._avatarId != null;
    }
    public getAvatarId(): number | null | undefined {
        return this._avatarId;
    }
    public setAvatarId(value: number | null | undefined): void {
        this._avatarId = value;
    }
}
