import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserPrivilege as $Message$CommonProto$User$UserPrivilege, type UserPrivilegeJson as $Json$CommonProto$User$UserPrivilege } from "./UserPrivilege.js";
import { UserMrwRankInfo as $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo, type UserMrwRankInfoJson as $Json$CommonProto$User$UserRankInfo$UserMrwRankInfo } from "./UserRankInfo/UserMrwRankInfo.js";
import { UserWarHistory as $Message$CommonProto$User$UserWarHistory, type UserWarHistoryJson as $Json$CommonProto$User$UserWarHistory } from "./UserWarHistory.js";
import { UserMpwStatistics as $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics, type UserMpwStatisticsJson as $Json$CommonProto$User$UserWarStatistics$UserMpwStatistics } from "./UserWarStatistics/UserMpwStatistics.js";

export interface UserPublicInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    nickname?: string | null | undefined;
    registerTime?: number | null | undefined;
    lastLoginTime?: number | null | undefined;
    loginCount?: number | null | undefined;
    onlineTime?: number | null | undefined;
    avatarId?: number | null | undefined;
    userPrivilege?: $Json$CommonProto$User$UserPrivilege | null | undefined;
    userMrwRankInfoArray: $Json$CommonProto$User$UserRankInfo$UserMrwRankInfo[];
    userMpwStatisticsArray: $Json$CommonProto$User$UserWarStatistics$UserMpwStatistics[];
    userWarHistory?: $Json$CommonProto$User$UserWarHistory | null | undefined;
    showMedalIdArray: number[];
}

export class UserPublicInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _nickname?: string | null | undefined;
    private _registerTime?: number | null | undefined;
    private _lastLoginTime?: number | null | undefined;
    private _loginCount?: number | null | undefined;
    private _onlineTime?: number | null | undefined;
    private _avatarId?: number | null | undefined;
    private _userPrivilege?: $Message$CommonProto$User$UserPrivilege | null | undefined;
    private _userMrwRankInfoArray: $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[] = [];
    private _userMpwStatisticsArray: $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[] = [];
    private _userWarHistory?: $Message$CommonProto$User$UserWarHistory | null | undefined;
    private _showMedalIdArray: number[] = [];

    public static fromJson(obj: UserPublicInfoJson): UserPublicInfo {
        return new UserPublicInfo().loadJson(obj);
    }
    public override loadJson(obj: UserPublicInfoJson): this {
        this.setUserId(obj.userId);
        this.setNickname(obj.nickname);
        this.setRegisterTime(obj.registerTime);
        this.setLastLoginTime(obj.lastLoginTime);
        this.setLoginCount(obj.loginCount);
        this.setOnlineTime(obj.onlineTime);
        this.setAvatarId(obj.avatarId);
        this.setUserPrivilege(obj.userPrivilege != null ? $Message$CommonProto$User$UserPrivilege.fromJson(obj.userPrivilege) : null);
        this.setUserMrwRankInfoArray(obj.userMrwRankInfoArray?.map(v => $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo.fromJson(v)) ?? []);
        this.setUserMpwStatisticsArray(obj.userMpwStatisticsArray?.map(v => $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics.fromJson(v)) ?? []);
        this.setUserWarHistory(obj.userWarHistory != null ? $Message$CommonProto$User$UserWarHistory.fromJson(obj.userWarHistory) : null);
        this.setShowMedalIdArray(obj.showMedalIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UserPublicInfoJson): UserPublicInfoJson {
        obj ??= ({} as UserPublicInfoJson);

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
            const value = this.getAvatarId();
            (value != null) && (obj.avatarId = value);
        }

        {
            const value = this.getUserPrivilege();
            (value != null) && (obj.userPrivilege = value.toJson());
        }

        {
            obj.userMrwRankInfoArray = this.getUserMrwRankInfoArray().map(v => v.toJson());
        }

        {
            obj.userMpwStatisticsArray = this.getUserMpwStatisticsArray().map(v => v.toJson());
        }

        {
            const value = this.getUserWarHistory();
            (value != null) && (obj.userWarHistory = value.toJson());
        }

        {
            obj.showMedalIdArray = this.getShowMedalIdArray().concat();
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
            const value = this.getAvatarId();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getUserPrivilege();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getUserMrwRankInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUserMpwStatisticsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(106).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUserWarHistory();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getShowMedalIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(122).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserPublicInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserPublicInfo();
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

                case 10:
                    msg.setAvatarId(reader.int32());
                    break;

                case 11:
                    msg.setUserPrivilege($Message$CommonProto$User$UserPrivilege.decode(reader, reader.uint32()));
                    break;

                case 12:
                    {
                        const arr = msg._userMrwRankInfoArray;
                        arr.push($Message$CommonProto$User$UserRankInfo$UserMrwRankInfo.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    {
                        const arr = msg._userMpwStatisticsArray;
                        arr.push($Message$CommonProto$User$UserWarStatistics$UserMpwStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                case 14:
                    msg.setUserWarHistory($Message$CommonProto$User$UserWarHistory.decode(reader, reader.uint32()));
                    break;

                case 15:
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserPublicInfo {
        return UserPublicInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserPublicInfo" {
        return "UserPublicInfo";
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

    public checkHasAvatarId(): boolean {
        return this._avatarId != null;
    }
    public getAvatarId(): number | null | undefined {
        return this._avatarId;
    }
    public setAvatarId(value: number | null | undefined): void {
        this._avatarId = value;
    }

    public checkHasUserPrivilege(): boolean {
        return this._userPrivilege != null;
    }
    public getUserPrivilege(): $Message$CommonProto$User$UserPrivilege | null | undefined {
        return this._userPrivilege;
    }
    public setUserPrivilege(value: $Message$CommonProto$User$UserPrivilege | null | undefined): void {
        this._userPrivilege = value;
    }
    public createIfNotExistsUserPrivilege(): $Message$CommonProto$User$UserPrivilege {
        return this._userPrivilege ??= new $Message$CommonProto$User$UserPrivilege();
    }

    public getUserMrwRankInfoArray(): $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[] {
        return this._userMrwRankInfoArray;
    }
    public setUserMrwRankInfoArray(value: $Message$CommonProto$User$UserRankInfo$UserMrwRankInfo[]): void {
        this._userMrwRankInfoArray = value;
    }

    public getUserMpwStatisticsArray(): $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[] {
        return this._userMpwStatisticsArray;
    }
    public setUserMpwStatisticsArray(value: $Message$CommonProto$User$UserWarStatistics$UserMpwStatistics[]): void {
        this._userMpwStatisticsArray = value;
    }

    public checkHasUserWarHistory(): boolean {
        return this._userWarHistory != null;
    }
    public getUserWarHistory(): $Message$CommonProto$User$UserWarHistory | null | undefined {
        return this._userWarHistory;
    }
    public setUserWarHistory(value: $Message$CommonProto$User$UserWarHistory | null | undefined): void {
        this._userWarHistory = value;
    }
    public createIfNotExistsUserWarHistory(): $Message$CommonProto$User$UserWarHistory {
        return this._userWarHistory ??= new $Message$CommonProto$User$UserWarHistory();
    }

    public getShowMedalIdArray(): number[] {
        return this._showMedalIdArray;
    }
    public setShowMedalIdArray(value: number[]): void {
        this._showMedalIdArray = value;
    }
}
