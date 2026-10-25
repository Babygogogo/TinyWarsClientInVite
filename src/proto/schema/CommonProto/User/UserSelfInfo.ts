import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserComplexInfo as $Message$CommonProto$User$UserComplexInfo, type UserComplexInfoJson as $Json$CommonProto$User$UserComplexInfo } from "./UserComplexInfo.js";
import { UserRelationInfo as $Message$CommonProto$User$UserRelationInfo, type UserRelationInfoJson as $Json$CommonProto$User$UserRelationInfo } from "./UserRelationInfo.js";

export interface UserSelfInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    nickname?: string | null | undefined;
    registerTime?: number | null | undefined;
    lastLoginTime?: number | null | undefined;
    loginCount?: number | null | undefined;
    onlineTime?: number | null | undefined;
    userRelationInfo?: $Json$CommonProto$User$UserRelationInfo | null | undefined;
    userComplexInfo?: $Json$CommonProto$User$UserComplexInfo | null | undefined;
    emailAddress?: string | null | undefined;
}

export class UserSelfInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _nickname?: string | null | undefined;
    private _registerTime?: number | null | undefined;
    private _lastLoginTime?: number | null | undefined;
    private _loginCount?: number | null | undefined;
    private _onlineTime?: number | null | undefined;
    private _userRelationInfo?: $Message$CommonProto$User$UserRelationInfo | null | undefined;
    private _userComplexInfo?: $Message$CommonProto$User$UserComplexInfo | null | undefined;
    private _emailAddress?: string | null | undefined;

    public static fromJson(obj: UserSelfInfoJson): UserSelfInfo {
        return new UserSelfInfo().loadJson(obj);
    }
    public override loadJson(obj: UserSelfInfoJson): this {
        this.setUserId(obj.userId);
        this.setNickname(obj.nickname);
        this.setRegisterTime(obj.registerTime);
        this.setLastLoginTime(obj.lastLoginTime);
        this.setLoginCount(obj.loginCount);
        this.setOnlineTime(obj.onlineTime);
        this.setUserRelationInfo(obj.userRelationInfo != null ? $Message$CommonProto$User$UserRelationInfo.fromJson(obj.userRelationInfo) : null);
        this.setUserComplexInfo(obj.userComplexInfo != null ? $Message$CommonProto$User$UserComplexInfo.fromJson(obj.userComplexInfo) : null);
        this.setEmailAddress(obj.emailAddress);
        return this;
    }
    public override toJson(obj?: UserSelfInfoJson): UserSelfInfoJson {
        obj ??= ({} as UserSelfInfoJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getNickname();
            (value != null) && (obj.nickname = value);
        }

        {
            const value = this.getRegisterTime();
            (value != null) && (obj.registerTime = value);
        }

        {
            const value = this.getLastLoginTime();
            (value != null) && (obj.lastLoginTime = value);
        }

        {
            const value = this.getLoginCount();
            (value != null) && (obj.loginCount = value);
        }

        {
            const value = this.getOnlineTime();
            (value != null) && (obj.onlineTime = value);
        }

        {
            const value = this.getUserRelationInfo();
            (value != null) && (obj.userRelationInfo = value.toJson());
        }

        {
            const value = this.getUserComplexInfo();
            (value != null) && (obj.userComplexInfo = value.toJson());
        }

        {
            const value = this.getEmailAddress();
            (value != null) && (obj.emailAddress = value);
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
            const value = this.getRegisterTime();
            if (value != null) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getLastLoginTime();
            if (value != null) {
                writer.uint32(32).uint32(value);
            }
        }

        {
            const value = this.getLoginCount();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getOnlineTime();
            if (value != null) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getUserRelationInfo();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getUserComplexInfo();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getEmailAddress();
            if (value != null) {
                writer.uint32(74).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserSelfInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserSelfInfo();
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
                    msg.setRegisterTime(reader.uint32());
                    break;

                case 4:
                    msg.setLastLoginTime(reader.uint32());
                    break;

                case 5:
                    msg.setLoginCount(reader.int32());
                    break;

                case 6:
                    msg.setOnlineTime(reader.uint32());
                    break;

                case 7:
                    msg.setUserRelationInfo($Message$CommonProto$User$UserRelationInfo.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setUserComplexInfo($Message$CommonProto$User$UserComplexInfo.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setEmailAddress(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserSelfInfo {
        return UserSelfInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserSelfInfo" {
        return "UserSelfInfo";
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

    public checkHasRegisterTime(): boolean {
        return this._registerTime != null;
    }
    public getRegisterTime(): number | null | undefined {
        return this._registerTime;
    }
    public setRegisterTime(value: number | null | undefined): void {
        this._registerTime = value;
    }

    public checkHasLastLoginTime(): boolean {
        return this._lastLoginTime != null;
    }
    public getLastLoginTime(): number | null | undefined {
        return this._lastLoginTime;
    }
    public setLastLoginTime(value: number | null | undefined): void {
        this._lastLoginTime = value;
    }

    public checkHasLoginCount(): boolean {
        return this._loginCount != null;
    }
    public getLoginCount(): number | null | undefined {
        return this._loginCount;
    }
    public setLoginCount(value: number | null | undefined): void {
        this._loginCount = value;
    }

    public checkHasOnlineTime(): boolean {
        return this._onlineTime != null;
    }
    public getOnlineTime(): number | null | undefined {
        return this._onlineTime;
    }
    public setOnlineTime(value: number | null | undefined): void {
        this._onlineTime = value;
    }

    public checkHasUserRelationInfo(): boolean {
        return this._userRelationInfo != null;
    }
    public getUserRelationInfo(): $Message$CommonProto$User$UserRelationInfo | null | undefined {
        return this._userRelationInfo;
    }
    public setUserRelationInfo(value: $Message$CommonProto$User$UserRelationInfo | null | undefined): void {
        this._userRelationInfo = value;
    }
    public createIfNotExistsUserRelationInfo(): $Message$CommonProto$User$UserRelationInfo {
        return this._userRelationInfo ??= new $Message$CommonProto$User$UserRelationInfo();
    }

    public checkHasUserComplexInfo(): boolean {
        return this._userComplexInfo != null;
    }
    public getUserComplexInfo(): $Message$CommonProto$User$UserComplexInfo | null | undefined {
        return this._userComplexInfo;
    }
    public setUserComplexInfo(value: $Message$CommonProto$User$UserComplexInfo | null | undefined): void {
        this._userComplexInfo = value;
    }
    public createIfNotExistsUserComplexInfo(): $Message$CommonProto$User$UserComplexInfo {
        return this._userComplexInfo ??= new $Message$CommonProto$User$UserComplexInfo();
    }

    public checkHasEmailAddress(): boolean {
        return this._emailAddress != null;
    }
    public getEmailAddress(): string | null | undefined {
        return this._emailAddress;
    }
    public setEmailAddress(value: string | null | undefined): void {
        this._emailAddress = value;
    }
}
