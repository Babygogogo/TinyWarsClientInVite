import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserDiscordInfo as $Message$CommonProto$User$UserDiscordInfo, type UserDiscordInfoJson as $Json$CommonProto$User$UserDiscordInfo } from "./UserDiscordInfo.js";
import { UserMapRating as $Message$CommonProto$User$UserMapRating, type UserMapRatingJson as $Json$CommonProto$User$UserMapRating } from "./UserMapRating.js";
import { UserMedalInfo as $Message$CommonProto$User$UserMedalInfo, type UserMedalInfoJson as $Json$CommonProto$User$UserMedalInfo } from "./UserMedalInfo.js";
import { UserPrivilege as $Message$CommonProto$User$UserPrivilege, type UserPrivilegeJson as $Json$CommonProto$User$UserPrivilege } from "./UserPrivilege.js";
import { UserRankInfo as $Message$CommonProto$User$UserRankInfo, type UserRankInfoJson as $Json$CommonProto$User$UserRankInfo } from "./UserRankInfo.js";
import { UserSettings as $Message$CommonProto$User$UserSettings, type UserSettingsJson as $Json$CommonProto$User$UserSettings } from "./UserSettings.js";
import { UserWarHistory as $Message$CommonProto$User$UserWarHistory, type UserWarHistoryJson as $Json$CommonProto$User$UserWarHistory } from "./UserWarHistory.js";
import { UserWarStatistics as $Message$CommonProto$User$UserWarStatistics, type UserWarStatisticsJson as $Json$CommonProto$User$UserWarStatistics } from "./UserWarStatistics.js";

export interface UserComplexInfoJson extends $ProtoSchemaJsonBase {
    userPrivilege?: $Json$CommonProto$User$UserPrivilege | null | undefined;
    userRankInfo?: $Json$CommonProto$User$UserRankInfo | null | undefined;
    userWarStatistics?: $Json$CommonProto$User$UserWarStatistics | null | undefined;
    userSettings?: $Json$CommonProto$User$UserSettings | null | undefined;
    userMapRatingArray: $Json$CommonProto$User$UserMapRating[];
    lastChatTime?: number | null | undefined;
    avatarId?: number | null | undefined;
    mapEditorAutoSaveTime?: number | null | undefined;
    userWarHistory?: $Json$CommonProto$User$UserWarHistory | null | undefined;
    userDiscordInfo?: $Json$CommonProto$User$UserDiscordInfo | null | undefined;
    watchDstMpwIdArray: number[];
    userMedalInfo?: $Json$CommonProto$User$UserMedalInfo | null | undefined;
    favoriteReplayIdArray: number[];
    unverifiedEmailAddress?: string | null | undefined;
    emailVerificationCode?: string | null | undefined;
    emailVerificationEndTimestamp?: number | null | undefined;
    passwordVerificationCode?: string | null | undefined;
    passwordVerificationEndTimestamp?: number | null | undefined;
}

export class UserComplexInfo extends $ProtoSchemaBase {
    private _userPrivilege?: $Message$CommonProto$User$UserPrivilege | null | undefined;
    private _userRankInfo?: $Message$CommonProto$User$UserRankInfo | null | undefined;
    private _userWarStatistics?: $Message$CommonProto$User$UserWarStatistics | null | undefined;
    private _userSettings?: $Message$CommonProto$User$UserSettings | null | undefined;
    private _userMapRatingArray: $Message$CommonProto$User$UserMapRating[] = [];
    private _lastChatTime?: number | null | undefined;
    private _avatarId?: number | null | undefined;
    private _mapEditorAutoSaveTime?: number | null | undefined;
    private _userWarHistory?: $Message$CommonProto$User$UserWarHistory | null | undefined;
    private _userDiscordInfo?: $Message$CommonProto$User$UserDiscordInfo | null | undefined;
    private _watchDstMpwIdArray: number[] = [];
    private _userMedalInfo?: $Message$CommonProto$User$UserMedalInfo | null | undefined;
    private _favoriteReplayIdArray: number[] = [];
    private _unverifiedEmailAddress?: string | null | undefined;
    private _emailVerificationCode?: string | null | undefined;
    private _emailVerificationEndTimestamp?: number | null | undefined;
    private _passwordVerificationCode?: string | null | undefined;
    private _passwordVerificationEndTimestamp?: number | null | undefined;

    public static fromJson(obj: UserComplexInfoJson): UserComplexInfo {
        return new UserComplexInfo().loadJson(obj);
    }
    public override loadJson(obj: UserComplexInfoJson): this {
        this.setUserPrivilege(obj.userPrivilege != null ? $Message$CommonProto$User$UserPrivilege.fromJson(obj.userPrivilege) : null);
        this.setUserRankInfo(obj.userRankInfo != null ? $Message$CommonProto$User$UserRankInfo.fromJson(obj.userRankInfo) : null);
        this.setUserWarStatistics(obj.userWarStatistics != null ? $Message$CommonProto$User$UserWarStatistics.fromJson(obj.userWarStatistics) : null);
        this.setUserSettings(obj.userSettings != null ? $Message$CommonProto$User$UserSettings.fromJson(obj.userSettings) : null);
        this.setUserMapRatingArray(obj.userMapRatingArray?.map(v => $Message$CommonProto$User$UserMapRating.fromJson(v)) ?? []);
        this.setLastChatTime(obj.lastChatTime);
        this.setAvatarId(obj.avatarId);
        this.setMapEditorAutoSaveTime(obj.mapEditorAutoSaveTime);
        this.setUserWarHistory(obj.userWarHistory != null ? $Message$CommonProto$User$UserWarHistory.fromJson(obj.userWarHistory) : null);
        this.setUserDiscordInfo(obj.userDiscordInfo != null ? $Message$CommonProto$User$UserDiscordInfo.fromJson(obj.userDiscordInfo) : null);
        this.setWatchDstMpwIdArray(obj.watchDstMpwIdArray?.concat() ?? []);
        this.setUserMedalInfo(obj.userMedalInfo != null ? $Message$CommonProto$User$UserMedalInfo.fromJson(obj.userMedalInfo) : null);
        this.setFavoriteReplayIdArray(obj.favoriteReplayIdArray?.concat() ?? []);
        this.setUnverifiedEmailAddress(obj.unverifiedEmailAddress);
        this.setEmailVerificationCode(obj.emailVerificationCode);
        this.setEmailVerificationEndTimestamp(obj.emailVerificationEndTimestamp);
        this.setPasswordVerificationCode(obj.passwordVerificationCode);
        this.setPasswordVerificationEndTimestamp(obj.passwordVerificationEndTimestamp);
        return this;
    }
    public override toJson(obj?: UserComplexInfoJson): UserComplexInfoJson {
        obj ??= ({} as UserComplexInfoJson);

        {
            const value = this.getUserPrivilege();
            (value != null) && (obj.userPrivilege = value.toJson());
        }

        {
            const value = this.getUserRankInfo();
            (value != null) && (obj.userRankInfo = value.toJson());
        }

        {
            const value = this.getUserWarStatistics();
            (value != null) && (obj.userWarStatistics = value.toJson());
        }

        {
            const value = this.getUserSettings();
            (value != null) && (obj.userSettings = value.toJson());
        }

        {
            obj.userMapRatingArray = this.getUserMapRatingArray().map(v => v.toJson());
        }

        {
            const value = this.getLastChatTime();
            (value != null) && (obj.lastChatTime = value);
        }

        {
            const value = this.getAvatarId();
            (value != null) && (obj.avatarId = value);
        }

        {
            const value = this.getMapEditorAutoSaveTime();
            (value != null) && (obj.mapEditorAutoSaveTime = value);
        }

        {
            const value = this.getUserWarHistory();
            (value != null) && (obj.userWarHistory = value.toJson());
        }

        {
            const value = this.getUserDiscordInfo();
            (value != null) && (obj.userDiscordInfo = value.toJson());
        }

        {
            obj.watchDstMpwIdArray = this.getWatchDstMpwIdArray().concat();
        }

        {
            const value = this.getUserMedalInfo();
            (value != null) && (obj.userMedalInfo = value.toJson());
        }

        {
            obj.favoriteReplayIdArray = this.getFavoriteReplayIdArray().concat();
        }

        {
            const value = this.getUnverifiedEmailAddress();
            (value != null) && (obj.unverifiedEmailAddress = value);
        }

        {
            const value = this.getEmailVerificationCode();
            (value != null) && (obj.emailVerificationCode = value);
        }

        {
            const value = this.getEmailVerificationEndTimestamp();
            (value != null) && (obj.emailVerificationEndTimestamp = value);
        }

        {
            const value = this.getPasswordVerificationCode();
            (value != null) && (obj.passwordVerificationCode = value);
        }

        {
            const value = this.getPasswordVerificationEndTimestamp();
            (value != null) && (obj.passwordVerificationEndTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserPrivilege();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getUserRankInfo();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getUserWarStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getUserSettings();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getUserMapRatingArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getLastChatTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getAvatarId();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getMapEditorAutoSaveTime();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getUserWarHistory();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getUserDiscordInfo();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getWatchDstMpwIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getUserMedalInfo();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getFavoriteReplayIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(106).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getUnverifiedEmailAddress();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getEmailVerificationCode();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getEmailVerificationEndTimestamp();
            if (value != null) {
                writer.uint32(128).uint32(value);
            }
        }

        {
            const value = this.getPasswordVerificationCode();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getPasswordVerificationEndTimestamp();
            if (value != null) {
                writer.uint32(144).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserComplexInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserComplexInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUserPrivilege($Message$CommonProto$User$UserPrivilege.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setUserRankInfo($Message$CommonProto$User$UserRankInfo.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setUserWarStatistics($Message$CommonProto$User$UserWarStatistics.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setUserSettings($Message$CommonProto$User$UserSettings.decode(reader, reader.uint32()));
                    break;

                case 5:
                    {
                        const arr = msg._userMapRatingArray;
                        arr.push($Message$CommonProto$User$UserMapRating.decode(reader, reader.uint32()));
                    }
                    break;

                case 6:
                    msg.setLastChatTime(reader.uint32());
                    break;

                case 7:
                    msg.setAvatarId(reader.int32());
                    break;

                case 8:
                    msg.setMapEditorAutoSaveTime(reader.int32());
                    break;

                case 9:
                    msg.setUserWarHistory($Message$CommonProto$User$UserWarHistory.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setUserDiscordInfo($Message$CommonProto$User$UserDiscordInfo.decode(reader, reader.uint32()));
                    break;

                case 11:
                    {
                        const arr = msg._watchDstMpwIdArray;
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

                case 12:
                    msg.setUserMedalInfo($Message$CommonProto$User$UserMedalInfo.decode(reader, reader.uint32()));
                    break;

                case 13:
                    {
                        const arr = msg._favoriteReplayIdArray;
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

                case 14:
                    msg.setUnverifiedEmailAddress(reader.string());
                    break;

                case 15:
                    msg.setEmailVerificationCode(reader.string());
                    break;

                case 16:
                    msg.setEmailVerificationEndTimestamp(reader.uint32());
                    break;

                case 17:
                    msg.setPasswordVerificationCode(reader.string());
                    break;

                case 18:
                    msg.setPasswordVerificationEndTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserComplexInfo {
        return UserComplexInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserComplexInfo" {
        return "UserComplexInfo";
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

    public checkHasUserRankInfo(): boolean {
        return this._userRankInfo != null;
    }
    public getUserRankInfo(): $Message$CommonProto$User$UserRankInfo | null | undefined {
        return this._userRankInfo;
    }
    public setUserRankInfo(value: $Message$CommonProto$User$UserRankInfo | null | undefined): void {
        this._userRankInfo = value;
    }
    public createIfNotExistsUserRankInfo(): $Message$CommonProto$User$UserRankInfo {
        return this._userRankInfo ??= new $Message$CommonProto$User$UserRankInfo();
    }

    public checkHasUserWarStatistics(): boolean {
        return this._userWarStatistics != null;
    }
    public getUserWarStatistics(): $Message$CommonProto$User$UserWarStatistics | null | undefined {
        return this._userWarStatistics;
    }
    public setUserWarStatistics(value: $Message$CommonProto$User$UserWarStatistics | null | undefined): void {
        this._userWarStatistics = value;
    }
    public createIfNotExistsUserWarStatistics(): $Message$CommonProto$User$UserWarStatistics {
        return this._userWarStatistics ??= new $Message$CommonProto$User$UserWarStatistics();
    }

    public checkHasUserSettings(): boolean {
        return this._userSettings != null;
    }
    public getUserSettings(): $Message$CommonProto$User$UserSettings | null | undefined {
        return this._userSettings;
    }
    public setUserSettings(value: $Message$CommonProto$User$UserSettings | null | undefined): void {
        this._userSettings = value;
    }
    public createIfNotExistsUserSettings(): $Message$CommonProto$User$UserSettings {
        return this._userSettings ??= new $Message$CommonProto$User$UserSettings();
    }

    public getUserMapRatingArray(): $Message$CommonProto$User$UserMapRating[] {
        return this._userMapRatingArray;
    }
    public setUserMapRatingArray(value: $Message$CommonProto$User$UserMapRating[]): void {
        this._userMapRatingArray = value;
    }

    public checkHasLastChatTime(): boolean {
        return this._lastChatTime != null;
    }
    public getLastChatTime(): number {
        return this._lastChatTime ?? 0;
    }
    public setLastChatTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._lastChatTime = null;
        } else {
            this._lastChatTime = value;
        }
    }

    public checkHasAvatarId(): boolean {
        return this._avatarId != null;
    }
    public getAvatarId(): number {
        return this._avatarId ?? 0;
    }
    public setAvatarId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._avatarId = null;
        } else {
            this._avatarId = value;
        }
    }

    public checkHasMapEditorAutoSaveTime(): boolean {
        return this._mapEditorAutoSaveTime != null;
    }
    public getMapEditorAutoSaveTime(): number | null | undefined {
        return this._mapEditorAutoSaveTime;
    }
    public setMapEditorAutoSaveTime(value: number | null | undefined): void {
        this._mapEditorAutoSaveTime = value;
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

    public checkHasUserDiscordInfo(): boolean {
        return this._userDiscordInfo != null;
    }
    public getUserDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo | null | undefined {
        return this._userDiscordInfo;
    }
    public setUserDiscordInfo(value: $Message$CommonProto$User$UserDiscordInfo | null | undefined): void {
        this._userDiscordInfo = value;
    }
    public createIfNotExistsUserDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo {
        return this._userDiscordInfo ??= new $Message$CommonProto$User$UserDiscordInfo();
    }

    public getWatchDstMpwIdArray(): number[] {
        return this._watchDstMpwIdArray;
    }
    public setWatchDstMpwIdArray(value: number[]): void {
        this._watchDstMpwIdArray = value;
    }

    public checkHasUserMedalInfo(): boolean {
        return this._userMedalInfo != null;
    }
    public getUserMedalInfo(): $Message$CommonProto$User$UserMedalInfo | null | undefined {
        return this._userMedalInfo;
    }
    public setUserMedalInfo(value: $Message$CommonProto$User$UserMedalInfo | null | undefined): void {
        this._userMedalInfo = value;
    }
    public createIfNotExistsUserMedalInfo(): $Message$CommonProto$User$UserMedalInfo {
        return this._userMedalInfo ??= new $Message$CommonProto$User$UserMedalInfo();
    }

    public getFavoriteReplayIdArray(): number[] {
        return this._favoriteReplayIdArray;
    }
    public setFavoriteReplayIdArray(value: number[]): void {
        this._favoriteReplayIdArray = value;
    }

    public checkHasUnverifiedEmailAddress(): boolean {
        return this._unverifiedEmailAddress != null;
    }
    public getUnverifiedEmailAddress(): string | null | undefined {
        return this._unverifiedEmailAddress;
    }
    public setUnverifiedEmailAddress(value: string | null | undefined): void {
        this._unverifiedEmailAddress = value;
    }

    public checkHasEmailVerificationCode(): boolean {
        return this._emailVerificationCode != null;
    }
    public getEmailVerificationCode(): string | null | undefined {
        return this._emailVerificationCode;
    }
    public setEmailVerificationCode(value: string | null | undefined): void {
        this._emailVerificationCode = value;
    }

    public checkHasEmailVerificationEndTimestamp(): boolean {
        return this._emailVerificationEndTimestamp != null;
    }
    public getEmailVerificationEndTimestamp(): number | null | undefined {
        return this._emailVerificationEndTimestamp;
    }
    public setEmailVerificationEndTimestamp(value: number | null | undefined): void {
        this._emailVerificationEndTimestamp = value;
    }

    public checkHasPasswordVerificationCode(): boolean {
        return this._passwordVerificationCode != null;
    }
    public getPasswordVerificationCode(): string | null | undefined {
        return this._passwordVerificationCode;
    }
    public setPasswordVerificationCode(value: string | null | undefined): void {
        this._passwordVerificationCode = value;
    }

    public checkHasPasswordVerificationEndTimestamp(): boolean {
        return this._passwordVerificationEndTimestamp != null;
    }
    public getPasswordVerificationEndTimestamp(): number | null | undefined {
        return this._passwordVerificationEndTimestamp;
    }
    public setPasswordVerificationEndTimestamp(value: number | null | undefined): void {
        this._passwordVerificationEndTimestamp = value;
    }
}
