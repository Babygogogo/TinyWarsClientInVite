import {
    type Notifications_Mapping,
    Helpers_Collection,
    Notifications_Dispatcher,
    Sounds_Constants,
    AuxiliaryTypes_CachedDataAccessor,
    Utils_ClientErrorCode,
    AutoTourneys_Constants,
    GameVersions_Utils,
    Helpers_Misc,
    Users_Constants,
    Chat_Proxy,
    WatchWar_Model_WwProxy,
    Users_Proxy,
    Helpers_Compatibility,
    FloatText,
    Lang_Constants,
    Graphics_Constants,
    GameVersions_Constants,
    Common_Model_CommonModel,
    WarTypes_Constants,
    type Egret_Egret,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { S as CampaignGetScoreResponse } from "../proto/schema/CommonProto/NetMessage/MsgCampaignGetScore/S.ts";
import type { S as CampaignValidateWarResponse } from "../proto/schema/CommonProto/NetMessage/MsgCampaignValidateWar/S.ts";
import type { S as GmSetUserPrivilegeResponse } from "../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type { S as UserGetBriefInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type { S as UserGetOnlineStateResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type { S as UserGetPublicInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type { S as UserLoginResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type { S as UserLoginAsGuestResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type { S as UserLogoutResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type { S as UserModifyFavoriteReplayIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type { S as UserRequestEmailVerificationCodeResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type { S as UserSetAvatarIdResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type { S as UserSetCoBgmSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type { S as UserSetDiscordInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type { S as UserSetMapEditorAutoSaveTimeResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type { S as UserSetMapRatingResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type { S as UserSetNicknameResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type { S as UserSetRelationResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type { S as UserSetSceneBgmSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type { S as UserSetSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type { S as UserSetShowMedalIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type { S as UserVerifyEmailResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
import type { UserBriefInfo } from "../proto/schema/CommonProto/User/UserBriefInfo.ts";
import type { UserComplexInfo } from "../proto/schema/CommonProto/User/UserComplexInfo.ts";
import type { UserDiscordInfo } from "../proto/schema/CommonProto/User/UserDiscordInfo.ts";
import { UserMapRating } from "../proto/schema/CommonProto/User/UserMapRating.ts";
import { UserOpacitySettings } from "../proto/schema/CommonProto/User/UserOpacitySettings.ts";
import { UserPrivilege } from "../proto/schema/CommonProto/User/UserPrivilege.ts";
import type { UserPublicInfo } from "../proto/schema/CommonProto/User/UserPublicInfo.ts";
import type { UserMrwRankInfo } from "../proto/schema/CommonProto/User/UserRankInfo/UserMrwRankInfo.ts";
import type { UserSelfInfo } from "../proto/schema/CommonProto/User/UserSelfInfo.ts";
import type { UserSettings } from "../proto/schema/CommonProto/User/UserSettings.ts";
import { CoBgmSettings } from "../proto/schema/CommonProto/User/UserSettings/CoBgmSettings.ts";
import { UserCawStatistics } from "../proto/schema/CommonProto/User/UserWarStatistics/UserCawStatistics.ts";
import type { UserMpwStatistics } from "../proto/schema/CommonProto/User/UserWarStatistics/UserMpwStatistics.ts";

let _isLoggedIn                 = false;
let _selfInfo                   : UserSelfInfo | null = null;
let _selfAccount                : string;
let _selfPassword               : string | null = null;
let _selfGuestUserId            : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
const _userPublicInfoAccessor   = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, UserPublicInfo>({
    reqData : (userId: number) => Users_Proxy.reqUserGetPublicInfo(userId),
});
const _userBriefInfoAccessor    = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, UserBriefInfo>({
    reqData : (userId: number) => Users_Proxy.reqUserGetBriefInfo(userId),
});
const _userOnlineStateAccessor  = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, AuxiliaryTypes_AuxiliaryTypes.UserOnlineState>({
    reqData        : userId => Users_Proxy.reqUserGetOnlineState(userId),
    dataExpireTime : 5,
});

export function init(): void {
    Notifications_Dispatcher.addEventListeners([
        { type : "NetworkDisconnected",    callback : _onNotifyNetworkDisconnected },
        { type : "MsgUserLogout",          callback : _onNotifyMsgUserLogout },
    ], null);
}

export function updateOnMsgUserLogout(): void {
    setIsLoggedIn(false);
    setSelfInfo(null);
    setSelfPassword(null);
}

function setIsLoggedIn(isLoggedIn: boolean): void {
    _isLoggedIn = isLoggedIn;
}
export function getIsLoggedIn(): boolean {
    return _isLoggedIn;
}

function setSelfInfo(selfInfo: UserSelfInfo | null): void {
    _selfInfo = selfInfo;
}
export function getSelfInfo(): UserSelfInfo | null {
    return _selfInfo;
}
function getSelfUserComplexInfo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserComplexInfo> {
    return getSelfInfo()?.getUserComplexInfo();
}

export function getSelfUserId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return getSelfInfo()?.getUserId();
}

export function setSelfAccount(account: string): void {
    _selfAccount = account;
}
export function getSelfAccount(): string {
    return _selfAccount;
}

export function setSelfPassword(password: string | null): void {
    _selfPassword = password;
}
export function getSelfPassword(): string | null {
    return _selfPassword;
}

export function getSelfGuestUserId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return _selfGuestUserId;
}
function setSelfGuestUserId(guestUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>) {
    _selfGuestUserId = guestUserId;
}

export function getSelfUserPrivilege(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserPrivilege> {
    return getSelfUserComplexInfo()?.getUserPrivilege();
}
function setSelfUserPrivilege(userPrivilege: UserPrivilege): void {
    getSelfUserComplexInfo()?.setUserPrivilege(userPrivilege);
}
export function getIsSelfAdmin(): boolean {
    return !!getSelfUserPrivilege()?.getIsAdmin();
}
export function getIsSelfMapCommittee(): boolean {
    return !!getSelfUserPrivilege()?.getIsMapCommittee();
}
export function checkCanSelfEditChangeLog(): boolean {
    const privilege = getSelfUserPrivilege();
    return (!!privilege)
        && ((!!privilege.getIsAdmin()) || (!!privilege.getIsChangeLogEditor()));
}
export function getIsSelfChatManager(): boolean {
    return !!getSelfUserPrivilege()?.getIsChatManager();
}
export function getIsSelfAutoTourneyCommittee(): boolean {
    return !!getSelfUserPrivilege()?.getIsAutoTourneyCommittee();
}
export function getIsSelfCampaignManager(): boolean {
    return !!getSelfUserPrivilege()?.getIsCampaignManager();
}

export function getSelfNickname(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
    return getSelfInfo()?.getNickname();
}
function setSelfNickname(nickname: string): void {
    getSelfInfo()?.setNickname(nickname);
}

export function getSelfAvatarId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return getSelfInfo()?.getUserComplexInfo()?.getAvatarId();
}
export function setSelfAvatarId(avatarId: number): void {
    getSelfInfo()?.getUserComplexInfo()?.setAvatarId(avatarId);
}

export function getSelfShowMedalIdArray(): number[] {
    return getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getShowMedalIdArray() ?? [];
}

export function getSelfMapEditorAutoSaveTime(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return getSelfInfo()?.getUserComplexInfo()?.getMapEditorAutoSaveTime();
}
export function setSelfMapEditorAutoSaveTime(time: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
    getSelfInfo()?.getUserComplexInfo()?.setMapEditorAutoSaveTime(time);
}

export function getSelfDiscordInfo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserDiscordInfo> {
    return getSelfUserComplexInfo()?.getUserDiscordInfo();
}
function setSelfDiscordInfo(discordInfo: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserDiscordInfo>): void {
    getSelfUserComplexInfo()?.setUserDiscordInfo(discordInfo);
}

export function checkHasUserPublicInfo(userId: number): boolean {
    return _userPublicInfoAccessor.getHasKey(userId);
}
export function getUserPublicInfo(userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserPublicInfo>> {
    return _userPublicInfoAccessor.getData(userId);
}
function setUserPublicInfo(userId: number, info: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserPublicInfo>): void {
    _userPublicInfoAccessor.setData(userId, info);
}

export function getUserBriefInfo(userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserBriefInfo>> {
    return _userBriefInfoAccessor.getData(userId);
}
function setUserBriefInfo(userId: number, info: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserBriefInfo>): void {
    _userBriefInfoAccessor.setData(userId, info);
}

export function getUserOnlineState(userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.UserOnlineState>> {
    return _userOnlineStateAccessor.getData(userId);
}
function setUserOnlineState(userId: number, state: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.UserOnlineState>): void {
    _userOnlineStateAccessor.setData(userId, state);
}

export async function getUserNickname(userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>> {
    return (await getUserPublicInfo(userId))?.getNickname();
}
export async function getUserMrwRankScoreInfo(userId: number, warType: WarTypes_Constants.WarTypeId, playersCount: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserMrwRankInfo>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMrwRankInfoArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export async function getUserMpwStatisticsData(userId: number, warType: WarTypes_Constants.WarTypeId, playersCount: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserMpwStatistics>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMpwStatisticsArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export function getMapRating(normalMapId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return getSelfUserComplexInfo()?.getUserMapRatingArray()?.find(v => v.getNormalMapId() === normalMapId)?.getRating();
}

export function checkCanRegisterAutoTourney(): boolean {
    return getSelfUserComplexInfo()?.getUserRankInfo()?.getMrwArray()?.find(v =>
        ((v.getWarType() === WarTypes_Constants.WarTypeId.MrwFog) || (v.getWarType() === WarTypes_Constants.WarTypeId.MrwStd))  &&
        (v.getPlayersCountUnneutral() === AutoTourneys_Constants.Common.PlayersCountUnneutral),
    )?.getLastWarEndTime() != null;
}

export function getSelfSettings(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserSettings> {
    return getSelfUserComplexInfo()?.getUserSettings();
}
export function getSelfSettingsTextureVersion(): Graphics_Constants.TextureVersionId {
    return GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId === Graphics_Constants.TextureResolutionId.Trilogy
        ? Graphics_Constants.TextureVersionId.V1
        : (getSelfSettings()?.getUnitAndTileTextureVersion() ?? Graphics_Constants.TextureVersionId.V0);
}
export function getSelfSettingsIsSetPathMode(): boolean {
    return getSelfSettings()?.getIsSetPathMode() ?? false;
}
export function getSelfSettingsCanAcceptNotFollowingMessages(): boolean {
    return !!getSelfSettings()?.getCanAcceptNotFollowingMessages();
}
export function getSelfSettingsIsShowGridBorder(): boolean {
    return !!getSelfSettings()?.getIsShowGridBorder();
}
export function getSelfSettingsIsAutoScrollMap(): boolean {
    return !!getSelfSettings()?.getIsAutoScrollMap();
}
export function getSelfSettingsIsUnitFlickeringOnFullEnergy(): boolean {
    return getSelfSettings()?.getIsUnitFlickeringOnFullEnergy() ?? true;
}
export function getSelfSettingsUnitMoveAniSpeedMultiplierPct(): number {
    return getSelfSettings()?.getUnitMoveAniSpeedMultiplierPct() ?? 100;
}
export function getSelfSettingsIsReplayResultVisible(): boolean {
    return getSelfSettings()?.getIsReplayResultVisible() ?? true;
}
export function getSelfSettingsBgmCodeForLobby(): number {
    return getSelfSettings()?.getSceneBgmSettings()?.getLobbyBgmCode() ?? Sounds_Constants.BgmSfxCode.Lobby;
}
export function getSelfSettingsBgmCodeForMapEditor(): number {
    return getSelfSettings()?.getSceneBgmSettings()?.getMapEditorBgmCode() ?? Sounds_Constants.BgmSfxCode.MapEditor;
}
export function getSelfSettingsCoBgmCodeArray(coCategoryId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
    return getSelfSettings()?.getCoBgmSettings()?.find(v => (v.getCoCategoryId() ?? 0) === coCategoryId)?.getBgmCodeArray();
}
export function getSelfSettingsIsScreenVibrationEnabled(): boolean {
    return getSelfSettings()?.getIsScreenVibrationEnabled() ?? true;
}

export function getSelfSettingsOpacitySettings(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserOpacitySettings> {
    return getSelfSettings()?.getOpacitySettings() ?? null;
}
export function setSelfSettingsOpacitySettings(opacitySettings: UserOpacitySettings): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    selfSettings.setOpacitySettings(opacitySettings);
    Notifications_Dispatcher.dispatch("UserSettingsOpacitySettingsChanged");
}
export function reqTickSelfSettingsUnitOpacity(): void {
    const unitOpacity = getSelfSettingsOpacitySettings()?.getUnitOpacity();
    if ((unitOpacity === 100) || (unitOpacity == null)) {
        Users_Proxy.reqUserSetSettings({ opacitySettings : { unitOpacity : 75 }, coBgmSettings : [] });
    } else if (unitOpacity === 75) {
        Users_Proxy.reqUserSetSettings({ opacitySettings : { unitOpacity : 50 }, coBgmSettings : [] });
    } else if (unitOpacity === 50) {
        Users_Proxy.reqUserSetSettings({ opacitySettings : { unitOpacity : 0 }, coBgmSettings : [] });
    } else {
        Users_Proxy.reqUserSetSettings({ opacitySettings : { unitOpacity : 100 }, coBgmSettings : [] });
    }
}
function mergeSelfSettingsOpacitySettings(newOpacitySettings: UserOpacitySettings): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const currentOpacitySettings = selfSettings.getOpacitySettings();
    if (currentOpacitySettings == null) {
        selfSettings.setOpacitySettings(UserOpacitySettings.decode(newOpacitySettings.encode()));
    } else {
        currentOpacitySettings.setTileBaseOpacity(newOpacitySettings.getTileBaseOpacity() ?? currentOpacitySettings.getTileBaseOpacity());
        currentOpacitySettings.setTileDecorationOpacity(newOpacitySettings.getTileDecorationOpacity() ?? currentOpacitySettings.getTileDecorationOpacity());
        currentOpacitySettings.setTileObjectOpacity(newOpacitySettings.getTileObjectOpacity() ?? currentOpacitySettings.getTileObjectOpacity());
        currentOpacitySettings.setUnitOpacity(newOpacitySettings.getUnitOpacity() ?? currentOpacitySettings.getUnitOpacity());
    }

    Notifications_Dispatcher.dispatch("UserSettingsOpacitySettingsChanged");
}

export function getFollowingUserIdArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
    return getSelfInfo()?.getUserRelationInfo()?.getFollowingUserIdArray();
}
export function checkIsFollowingUser(userId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return userId == null
        ? false
        : !!getFollowingUserIdArray()?.includes(userId);
}
export function checkIsBlockingUser(userId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return userId == null
        ? false
        : !!getSelfInfo()?.getUserRelationInfo()?.getBlockingUserIdArray()?.includes(userId);
}

export function getFavoriteReplayIdArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]> {
    return getSelfUserComplexInfo()?.getFavoriteReplayIdArray();
}
export function checkIsFavoriteReplayId(replayId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean> {
    return getSelfUserComplexInfo()?.getFavoriteReplayIdArray().includes(replayId);
}

export function getSelfCawHighScoreInfo(campaignId: number, campaignMapId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UserCawStatistics> {
    return getSelfUserComplexInfo()
        ?.getUserWarStatistics()
        ?.getCawArray()
        ?.find(v => ((v.getCampaignId()) == campaignId) && ((v.getCampaignMapId()) == campaignMapId));
}
function setSelfCawHighScore({ configVersion, campaignId, campaignMapId, campaignMapRevision, highScore }: {
    configVersion       : string;
    campaignId          : number;
    campaignMapId       : number;
    campaignMapRevision : number;
    highScore           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}): void {
    const userComplexInfo = getSelfUserComplexInfo();
    if (userComplexInfo == null) {
        return;
    }

    const cawArray      = userComplexInfo.createIfNotExistsUserWarStatistics().getCawArray();
    const existingInfo  = cawArray.find(v => ((v.getCampaignId()) == campaignId) && ((v.getCampaignMapId()) == campaignMapId));
    if (existingInfo != null) {
        const existingConfigVersion = existingInfo.getConfigVersion() ?? ``;
        const existingMapRevision   = existingInfo.getCampaignMapRevision();
        if ((existingConfigVersion == configVersion) && (existingMapRevision == campaignMapRevision)) {
            if ((highScore != null) && (highScore >= (existingInfo.getHighScore() ?? 0))) {
                existingInfo.setHighScore(highScore);
            }

        } else if ((campaignMapRevision > existingMapRevision) || (configVersion.toLowerCase() > existingConfigVersion.toLowerCase())) {
            existingInfo.setCampaignMapRevision(campaignMapRevision);
            existingInfo.setConfigVersion(configVersion);
            existingInfo.setHighScore(highScore);
        }

    } else {
        cawArray.push(UserCawStatistics.fromJson({
            configVersion       : configVersion,
            campaignId          : campaignId,
            campaignMapId       : campaignMapId,
            campaignMapRevision : campaignMapRevision,
            highScore           : highScore,
        }));
    }
}

export function updateOnMsgUserLogin(data: UserLoginResponse): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    (userSelfInfo) && (setSelfInfo(userSelfInfo));

    _updateDocumentTitle();
    Chat_Proxy.reqGetAllMessages();
    Chat_Proxy.reqGetAllReadProgressList();
    WatchWar_Model_WwProxy.reqMpwWatchRequestedWarIdArray();
}
export function updateOnMsgUserLoginAsGuest(data: UserLoginAsGuestResponse): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    if (userSelfInfo) {
        setSelfInfo(userSelfInfo);
        setSelfGuestUserId(userSelfInfo.getUserId());
    }

    _updateDocumentTitle();
    Chat_Proxy.reqGetAllMessages();
    Chat_Proxy.reqGetAllReadProgressList();
}

export function updateOnMsgUserGetOnlineState(data: UserGetOnlineStateResponse): void {
    setUserOnlineState(
        data.getUserId() ?? 0,
        {
            isOnline              : !!data.getIsOnline(),
            lastActivityTimestamp : data.getLastActivityTime() ?? 0,
        },
    );
}
export function updateOnFailedMsgUserGetOnlineState(data: UserGetOnlineStateResponse): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userOnlineStateAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetPublicInfo(data: UserGetPublicInfoResponse): void {
    setUserPublicInfo(data.getUserId() ?? 0, data.getUserPublicInfo());
}
export function updateOnFailedMsgUserGetPublicInfo(data: UserGetPublicInfoResponse): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userPublicInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetBriefInfo(data: UserGetBriefInfoResponse): void {
    setUserBriefInfo(data.getUserId() ?? 0, data.getUserBriefInfo() ?? null);
}
export function updateOnFailedMsgUserGetBriefInfo(data: UserGetBriefInfoResponse): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userBriefInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserSetNickname(data: UserSetNicknameResponse): void {
    setSelfNickname(Helpers_Misc.getExisted(data.getNickname()));

    _updateDocumentTitle();
}
export function updateOnMsgUserSetDiscordInfo(data: UserSetDiscordInfoResponse): void {
    setSelfDiscordInfo(data.getDiscordInfo());
}
export function updateOnMsgGmSetUserPrivilege(data: GmSetUserPrivilegeResponse): void {
    const userId = data.getUserId() ?? 0;
    if (userId === getSelfUserId()) {
        setSelfUserPrivilege(data.getUserPrivilege() ?? new UserPrivilege());
    }
}
export function updateOnMsgUserSetSettings(data: UserSetSettingsResponse): void {
    const selfSettings  = getSelfSettings();
    const newSettings   = data.getUserSettings();
    if ((selfSettings == null) || (newSettings == null)) {
        return;
    }

    const oldIsShowGridBorder               = getSelfSettingsIsShowGridBorder();
    const oldVersion                        = getSelfSettingsTextureVersion();
    const oldIsAutoScrollMap                = getSelfSettingsIsAutoScrollMap();
    const oldIsUnitFlickeringOnFullEnergy   = getSelfSettingsIsUnitFlickeringOnFullEnergy();
    const oldIsReplayResultVisible          = getSelfSettingsIsReplayResultVisible();
    const oldIsSetPathMode                  = getSelfSettingsIsSetPathMode();
    const oldUnitMoveAniSpeedMultiplierPct  = getSelfSettingsUnitMoveAniSpeedMultiplierPct();
    const oldCanAcceptNotFollowingMessages  = getSelfSettingsCanAcceptNotFollowingMessages();
    const oldIsScreenVibrationEnabled       = getSelfSettingsIsScreenVibrationEnabled();
    (newSettings.getIsSetPathMode() != null)                 && (selfSettings.setIsSetPathMode(newSettings.getIsSetPathMode()));
    (newSettings.getIsShowGridBorder() != null)              && (selfSettings.setIsShowGridBorder(newSettings.getIsShowGridBorder()));
    (newSettings.getUnitAndTileTextureVersion() != null)     && (selfSettings.setUnitAndTileTextureVersion(newSettings.getUnitAndTileTextureVersion()));
    (newSettings.getIsAutoScrollMap() != null)               && (selfSettings.setIsAutoScrollMap(newSettings.getIsAutoScrollMap()));
    (newSettings.getIsUnitFlickeringOnFullEnergy() != null)  && (selfSettings.setIsUnitFlickeringOnFullEnergy(newSettings.getIsUnitFlickeringOnFullEnergy()));
    (newSettings.getUnitMoveAniSpeedMultiplierPct() != null) && (selfSettings.setUnitMoveAniSpeedMultiplierPct(newSettings.getUnitMoveAniSpeedMultiplierPct()));
    (newSettings.getIsReplayResultVisible() != null)         && (selfSettings.setIsReplayResultVisible(newSettings.getIsReplayResultVisible()));
    (newSettings.getCanAcceptNotFollowingMessages() != null) && (selfSettings.setCanAcceptNotFollowingMessages(newSettings.getCanAcceptNotFollowingMessages()));
    (newSettings.getIsScreenVibrationEnabled() != null)      && (selfSettings.setIsScreenVibrationEnabled(newSettings.getIsScreenVibrationEnabled()));

    {
        const opacitySettings = newSettings.getOpacitySettings();
        (opacitySettings != null) && (mergeSelfSettingsOpacitySettings(opacitySettings));
    }

    if (oldVersion !== getSelfSettingsTextureVersion()) {
        Common_Model_CommonModel.updateOnUnitAndTileTextureVersionChanged();
        Notifications_Dispatcher.dispatch("UnitAndTileTextureVersionChanged");
    }
    if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsShowGridBorderChanged");
    }
    if (oldIsAutoScrollMap !== getSelfSettingsIsAutoScrollMap()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsAutoScrollMapChanged");
    }
    if (oldIsUnitFlickeringOnFullEnergy !== getSelfSettingsIsUnitFlickeringOnFullEnergy()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsUnitFlickeringOnFullEnergyChanged");
    }
    if (oldUnitMoveAniSpeedMultiplierPct !== getSelfSettingsUnitMoveAniSpeedMultiplierPct()) {
        Notifications_Dispatcher.dispatch("UserSettingsUnitMoveAniSpeedMultiplierPctChanged");
    }
    if (oldIsReplayResultVisible !== getSelfSettingsIsReplayResultVisible()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsReplayResultVisibleChanged");
    }
    if (oldIsSetPathMode !== getSelfSettingsIsSetPathMode()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsSetPathModeChanged");
    }
    if (oldCanAcceptNotFollowingMessages !== getSelfSettingsCanAcceptNotFollowingMessages()) {
        Notifications_Dispatcher.dispatch("UserSettingsCanAcceptNotFollowingMessagesChanged");
    }
    if (oldIsScreenVibrationEnabled !== getSelfSettingsIsScreenVibrationEnabled()) {
        Notifications_Dispatcher.dispatch("UserSettingsIsScreenVibrationEnabledChanged");
    }
}
export function updateOnMsgUserSetMapRating(data: UserSetMapRatingResponse): void {
    const complexInfo   = Helpers_Misc.getExisted(getSelfUserComplexInfo());
    const normalMapId   = data.getNormalMapId();
    const rating        = data.getRating();
    const array         = complexInfo.getUserMapRatingArray();
    const info          = array.find(v => v.getNormalMapId() === normalMapId);
    if (info) {
        info.setRating(rating);
    } else {
        array.push(UserMapRating.fromJson({
            normalMapId : normalMapId,
            rating      : rating,
        }));
    }
}
export function updateOnMsgUserSetAvatarId(data: UserSetAvatarIdResponse): void {
    setSelfAvatarId(Helpers_Misc.getExisted(data.getAvatarId(), Utils_ClientErrorCode.ClientErrorCode.UserModel_UpdateOnMsgUserSetAvatarId_00));
}
export function updateOnMsgUserSetMapEditorAutoSaveTime(data: UserSetMapEditorAutoSaveTimeResponse): void {
    setSelfMapEditorAutoSaveTime(data.getTime());
}
export function updateOnMsgUserSetCoBgmSettings(data: UserSetCoBgmSettingsResponse): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const coCategoryId  = Helpers_Misc.getExisted(data.getCoCategoryId());
    const bgmCodeArray  = data.getBgmCodeArray();
    const coBgmSettings = selfSettings.getCoBgmSettings();
    const index         = coBgmSettings.findIndex(v => v.getCoCategoryId() === coCategoryId);
    if (index >= 0) {
        if (bgmCodeArray) {
            coBgmSettings[index].setBgmCodeArray(bgmCodeArray);
        } else {
            coBgmSettings.splice(index, 1);
        }
    } else {
        if (bgmCodeArray) {
            coBgmSettings.push(CoBgmSettings.fromJson({
                coCategoryId : coCategoryId,
                bgmCodeArray : bgmCodeArray,
            }));
        }
    }
}
export function updateOnMsgUserSetSceneBgmSettings(data: UserSetSceneBgmSettingsResponse): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const oldSceneBgmSettings   = selfSettings.createIfNotExistsSceneBgmSettings();
    const newSceneBgmSettings   = data.getSceneBgmSettings();
    {
        const lobbyBgmCode = newSceneBgmSettings?.getLobbyBgmCode();
        if (lobbyBgmCode != null) {
            oldSceneBgmSettings.setLobbyBgmCode(lobbyBgmCode);
        }
    }
    {
        const mapEditorBgmCode = newSceneBgmSettings?.getMapEditorBgmCode();
        if (mapEditorBgmCode != null) {
            oldSceneBgmSettings.setMapEditorBgmCode(mapEditorBgmCode);
        }
    }
}
export function updateOnMsgUserSetRelation(data: UserSetRelationResponse): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    const userId                = Helpers_Misc.getExisted(data.getTargetUserId());
    const relationInfo          = selfInfo.createIfNotExistsUserRelationInfo();
    const followingUserIdArray  = relationInfo.getFollowingUserIdArray();
    if (data.getIsFollowing()) {
        Helpers_Collection.addElementToListIfNotExists(followingUserIdArray, userId);
    } else {
        Helpers_Collection.deleteElementFromList(followingUserIdArray, userId);
    }

    const blockingUserIdArray = relationInfo.getBlockingUserIdArray();
    if (data.getIsBlocking()) {
        Helpers_Collection.addElementToListIfNotExists(blockingUserIdArray, userId);
    } else {
        Helpers_Collection.deleteElementFromList(blockingUserIdArray, userId);
    }
}
export function updateOnMsgUserSetShowMedalIdArray(data: UserSetShowMedalIdArrayResponse): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    selfInfo.createIfNotExistsUserComplexInfo().createIfNotExistsUserMedalInfo().setShowMedalIdArray(data.getShowMedalIdArray());
}
export function updateOnMsgUserModifyFavoriteReplayIdArray(data: UserModifyFavoriteReplayIdArrayResponse): void {
    const info = getSelfUserComplexInfo();
    if (info == null) {
        return;
    }

    const replayIdSet = new Set(info.getFavoriteReplayIdArray());
    for (const replayId of data.getAddIdArray()) {
        replayIdSet.add(replayId);
    }
    for (const replayId of data.getDeleteIdArray()) {
        replayIdSet.delete(replayId);
    }
    info.setFavoriteReplayIdArray([...replayIdSet]);
}
export function updateOnMsgUserRequestEmailVerificationCode(data: UserRequestEmailVerificationCodeResponse): void {
    const selfInfo = getSelfInfo();
    if (selfInfo) {
        const complexInfo = selfInfo.createIfNotExistsUserComplexInfo();
        complexInfo.setUnverifiedEmailAddress(data.getEmailAddress());
        complexInfo.setEmailVerificationEndTimestamp(data.getEndTimestamp());
    }
}
export function updateOnMsgUserVerifyEmail(data: UserVerifyEmailResponse): void {
    const info = getSelfInfo();
    if (info) {
        info.setEmailAddress(data.getEmailAddress());
    }
}

export function updateOnMsgCampaignValidateWar(data: CampaignValidateWarResponse): void {
    setSelfCawHighScore({
        configVersion       : data.getConfigVersion() ?? ``,
        campaignId          : data.getCampaignId() ?? 0,
        campaignMapId       : data.getCampaignMapId() ?? 0,
        campaignMapRevision : data.getCampaignMapRevision() ?? 0,
        highScore           : null,
    });
}
export function updateOnMsgCampaignGetScore(data:CampaignGetScoreResponse): void {
    setSelfCawHighScore({
        configVersion       : data.getConfigVersion() ?? ``,
        campaignId          : data.getCampaignId() ?? 0,
        campaignMapId       : data.getCampaignMapId() ?? 0,
        campaignMapRevision : data.getCampaignMapRevision() ?? 0,
        highScore           : data.getHighScore(),
    });
}

function _onNotifyNetworkDisconnected(): void {
    setIsLoggedIn(false);
}
function _onNotifyMsgUserLogout(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserLogout"]>): void {
    const reason = ((e.data as { msg: UserLogoutResponse }).msg).getReason();
    if (reason === Users_Constants.LogoutTypeId.SelfRequest) {
        FloatText.showLang(Lang_Constants.TextType.A0005);
    } else if (reason === Users_Constants.LogoutTypeId.LoginCollision) {
        FloatText.showLang(Lang_Constants.TextType.A0006);
    } else if (reason === Users_Constants.LogoutTypeId.NetworkFailure) {
        FloatText.showLang(Lang_Constants.TextType.A0013);
    }

    setIsLoggedIn(false);
}

function _updateDocumentTitle(): void {
    const nickname  = getSelfNickname();
    const prefix    = _getDocumentTitlePrefix();
    Helpers_Compatibility.setDocumentTitle(nickname == null ? prefix : `${prefix} - ${nickname}`);
}
function _getDocumentTitlePrefix(): string {
    switch (window.GAME_VERSION) {
        case GameVersions_Constants.TypeName.Legacy       : return `TW Classic`;
        case GameVersions_Constants.TypeName.Trilogy      : return `TW Tri.`;
        case GameVersions_Constants.TypeName.Test         : return `TW Exp.`;
        case GameVersions_Constants.TypeName.Dor          : return `TW DoR`;
        case GameVersions_Constants.TypeName.TinyWars2    : return `TW2`;
        default                                             : return `TW`;
    }
}
