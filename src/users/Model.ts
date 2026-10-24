import * as AutoTourneysConstants from "../autoTourneys/Constants.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../auxiliaryTypes/CachedDataAccessor.ts";
import * as ChatProxy from "../chat/Proxy.ts";
import * as CommonModelCommonModel from "../common/model/CommonModel.ts";
import * as FloatText2 from "../FloatText.ts";
import * as GameVersionsConstants from "../gameVersions/Constants.ts";
import * as GameVersionsUtils from "../gameVersions/Utils.ts";
import * as GraphicsConstants from "../graphics/Constants.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersCompatibility from "../helpers/Compatibility.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetScoreS from "../proto/schema/CommonProto/NetMessage/MsgCampaignGetScore/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS from "../proto/schema/CommonProto/NetMessage/MsgCampaignValidateWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS from "../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLoginS from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
import type * as ProtoSchemaCommonProtoUserUserBriefInfo from "../proto/schema/CommonProto/User/UserBriefInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserComplexInfo from "../proto/schema/CommonProto/User/UserComplexInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserDiscordInfo from "../proto/schema/CommonProto/User/UserDiscordInfo.ts";
import * as ProtoSchemaCommonProtoUserUserMapRating from "../proto/schema/CommonProto/User/UserMapRating.ts";
import * as ProtoSchemaCommonProtoUserUserOpacitySettings from "../proto/schema/CommonProto/User/UserOpacitySettings.ts";
import * as ProtoSchemaCommonProtoUserUserPrivilege from "../proto/schema/CommonProto/User/UserPrivilege.ts";
import type * as ProtoSchemaCommonProtoUserUserPublicInfo from "../proto/schema/CommonProto/User/UserPublicInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserRankInfoUserMrwRankInfo from "../proto/schema/CommonProto/User/UserRankInfo/UserMrwRankInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserSelfInfo from "../proto/schema/CommonProto/User/UserSelfInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserSettings from "../proto/schema/CommonProto/User/UserSettings.ts";
import * as ProtoSchemaCommonProtoUserUserSettingsCoBgmSettings from "../proto/schema/CommonProto/User/UserSettings/CoBgmSettings.ts";
import * as ProtoSchemaCommonProtoUserUserWarStatisticsUserCawStatistics from "../proto/schema/CommonProto/User/UserWarStatistics/UserCawStatistics.ts";
import type * as ProtoSchemaCommonProtoUserUserWarStatisticsUserMpwStatistics from "../proto/schema/CommonProto/User/UserWarStatistics/UserMpwStatistics.ts";
import * as SoundsConstants from "../sounds/Constants.ts";
import * as UsersConstants from "./Constants.ts";
import * as UsersProxy from "./Proxy.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../warTypes/Constants.ts";
import * as WatchWarModelWwProxy from "../watchWar/model/WwProxy.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _isLoggedIn                 = false;
let _selfInfo                   : ProtoSchemaCommonProtoUserUserSelfInfo.UserSelfInfo | null = null;
let _selfAccount                : string;
let _selfPassword               : string | null = null;
let _selfGuestUserId            : Undefinable<number>;
const _userPublicInfoAccessor   = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoUserUserPublicInfo.UserPublicInfo>({
    reqData                     : (userId: number) => UsersProxy.reqUserGetPublicInfo(userId),
});
const _userBriefInfoAccessor    = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoUserUserBriefInfo.UserBriefInfo>({
    reqData                     : (userId: number) => UsersProxy.reqUserGetBriefInfo(userId),
});
const _userOnlineStateAccessor  = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, AuxiliaryTypesAuxiliaryTypes.UserOnlineState>({
    reqData         : userId => UsersProxy.reqUserGetOnlineState(userId),
    dataExpireTime  : 5,
});

export function init(): void {
    NotificationsDispatcher.addEventListeners([
        { type: NotificationsTypeId.TypeId.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
        { type: NotificationsTypeId.TypeId.MsgUserLogout,          callback: _onNotifyMsgUserLogout, },
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

function setSelfInfo(selfInfo: ProtoSchemaCommonProtoUserUserSelfInfo.UserSelfInfo | null): void {
    _selfInfo = selfInfo;
}
export function getSelfInfo(): ProtoSchemaCommonProtoUserUserSelfInfo.UserSelfInfo | null {
    return _selfInfo;
}
function getSelfUserComplexInfo(): Undefinable<ProtoSchemaCommonProtoUserUserComplexInfo.UserComplexInfo> {
    return getSelfInfo()?.getUserComplexInfo();
}

export function getSelfUserId(): Undefinable<number> {
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

export function getSelfGuestUserId(): Undefinable<number> {
    return _selfGuestUserId;
}
function setSelfGuestUserId(guestUserId: Undefinable<number>) {
    _selfGuestUserId = guestUserId;
}

export function getSelfUserPrivilege(): Undefinable<ProtoSchemaCommonProtoUserUserPrivilege.UserPrivilege> {
    return getSelfUserComplexInfo()?.getUserPrivilege();
}
function setSelfUserPrivilege(userPrivilege: ProtoSchemaCommonProtoUserUserPrivilege.UserPrivilege): void {
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

export function getSelfNickname(): Undefinable<string> {
    return getSelfInfo()?.getNickname();
}
function setSelfNickname(nickname: string): void {
    getSelfInfo()?.setNickname(nickname);
}

export function getSelfAvatarId(): Undefinable<number> {
    return getSelfInfo()?.getUserComplexInfo()?.getAvatarId();
}
export function setSelfAvatarId(avatarId: number): void {
    getSelfInfo()?.getUserComplexInfo()?.setAvatarId(avatarId);
}

export function getSelfShowMedalIdArray(): number[] {
    return getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getShowMedalIdArray() ?? [];
}

export function getSelfMapEditorAutoSaveTime(): Undefinable<number> {
    return getSelfInfo()?.getUserComplexInfo()?.getMapEditorAutoSaveTime();
}
export function setSelfMapEditorAutoSaveTime(time: Undefinable<number>): void {
    getSelfInfo()?.getUserComplexInfo()?.setMapEditorAutoSaveTime(time);
}

export function getSelfDiscordInfo(): Undefinable<ProtoSchemaCommonProtoUserUserDiscordInfo.UserDiscordInfo> {
    return getSelfUserComplexInfo()?.getUserDiscordInfo();
}
function setSelfDiscordInfo(discordInfo: Undefinable<ProtoSchemaCommonProtoUserUserDiscordInfo.UserDiscordInfo>): void {
    getSelfUserComplexInfo()?.setUserDiscordInfo(discordInfo);
}

export function checkHasUserPublicInfo(userId: number): boolean {
    return _userPublicInfoAccessor.getHasKey(userId);
}
export function getUserPublicInfo(userId: number): Promise<Undefinable<ProtoSchemaCommonProtoUserUserPublicInfo.UserPublicInfo>> {
    return _userPublicInfoAccessor.getData(userId);
}
function setUserPublicInfo(userId: number, info: Undefinable<ProtoSchemaCommonProtoUserUserPublicInfo.UserPublicInfo>): void {
    _userPublicInfoAccessor.setData(userId, info);
}

export function getUserBriefInfo(userId: number): Promise<Undefinable<ProtoSchemaCommonProtoUserUserBriefInfo.UserBriefInfo>> {
    return _userBriefInfoAccessor.getData(userId);
}
function setUserBriefInfo(userId: number, info: Undefinable<ProtoSchemaCommonProtoUserUserBriefInfo.UserBriefInfo>): void {
    _userBriefInfoAccessor.setData(userId, info);
}

export function getUserOnlineState(userId: number): Promise<Undefinable<AuxiliaryTypesAuxiliaryTypes.UserOnlineState>> {
    return _userOnlineStateAccessor.getData(userId);
}
function setUserOnlineState(userId: number, state: Undefinable<AuxiliaryTypesAuxiliaryTypes.UserOnlineState>): void {
    _userOnlineStateAccessor.setData(userId, state);
}

export async function getUserNickname(userId: number): Promise<Undefinable<string>> {
    return (await getUserPublicInfo(userId))?.getNickname();
}
export async function getUserMrwRankScoreInfo(userId: number, warType: WarTypesConstants.WarTypeId, playersCount: number): Promise<Undefinable<ProtoSchemaCommonProtoUserUserRankInfoUserMrwRankInfo.UserMrwRankInfo>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMrwRankInfoArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export async function getUserMpwStatisticsData(userId: number, warType: WarTypesConstants.WarTypeId, playersCount: number): Promise<Undefinable<ProtoSchemaCommonProtoUserUserWarStatisticsUserMpwStatistics.UserMpwStatistics>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMpwStatisticsArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export function getMapRating(normalMapId: number): Undefinable<number> {
    return getSelfUserComplexInfo()?.getUserMapRatingArray()?.find(v => v.getNormalMapId() === normalMapId)?.getRating();
}

export function checkCanRegisterAutoTourney(): boolean {
    return getSelfUserComplexInfo()?.getUserRankInfo()?.getMrwArray()?.find(v =>
        ((v.getWarType() === WarTypesConstants.WarTypeId.MrwFog) || (v.getWarType() === WarTypesConstants.WarTypeId.MrwStd))  &&
        (v.getPlayersCountUnneutral() === AutoTourneysConstants.Common.PlayersCountUnneutral)
    )?.getLastWarEndTime() != null;
}

export function getSelfSettings(): Undefinable<ProtoSchemaCommonProtoUserUserSettings.UserSettings> {
    return getSelfUserComplexInfo()?.getUserSettings();
}
export function getSelfSettingsTextureVersion(): GraphicsConstants.TextureVersionId {
    return GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId === GraphicsConstants.TextureResolutionId.Trilogy
        ? GraphicsConstants.TextureVersionId.V1
        : (getSelfSettings()?.getUnitAndTileTextureVersion() ?? GraphicsConstants.TextureVersionId.V0);
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
    return getSelfSettings()?.getSceneBgmSettings()?.getLobbyBgmCode() ?? SoundsConstants.BgmSfxCode.Lobby;
}
export function getSelfSettingsBgmCodeForMapEditor(): number {
    return getSelfSettings()?.getSceneBgmSettings()?.getMapEditorBgmCode() ?? SoundsConstants.BgmSfxCode.MapEditor;
}
export function getSelfSettingsCoBgmCodeArray(coCategoryId: number): Undefinable<number[]> {
    return getSelfSettings()?.getCoBgmSettings()?.find(v => (v.getCoCategoryId() ?? 0) === coCategoryId)?.getBgmCodeArray();
}
export function getSelfSettingsIsScreenVibrationEnabled(): boolean {
    return getSelfSettings()?.getIsScreenVibrationEnabled() ?? true;
}

export function getSelfSettingsOpacitySettings(): Undefinable<ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings> {
    return getSelfSettings()?.getOpacitySettings() ?? null;
}
export function setSelfSettingsOpacitySettings(opacitySettings: ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    selfSettings.setOpacitySettings(opacitySettings);
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsOpacitySettingsChanged);
}
export function reqTickSelfSettingsUnitOpacity(): void {
    const unitOpacity = getSelfSettingsOpacitySettings()?.getUnitOpacity();
    if ((unitOpacity === 100) || (unitOpacity == null)) {
        UsersProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 75 }, coBgmSettings: [] });
    } else if (unitOpacity === 75) {
        UsersProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 50 }, coBgmSettings: [] });
    } else if (unitOpacity === 50) {
        UsersProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 0 }, coBgmSettings: [] });
    } else {
        UsersProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 100 }, coBgmSettings: [] });
    }
}
function mergeSelfSettingsOpacitySettings(newOpacitySettings: ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const currentOpacitySettings = selfSettings.getOpacitySettings();
    if (currentOpacitySettings == null) {
        selfSettings.setOpacitySettings(ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings.decode(newOpacitySettings.encode()));
    } else {
        currentOpacitySettings.setTileBaseOpacity(newOpacitySettings.getTileBaseOpacity() ?? currentOpacitySettings.getTileBaseOpacity());
        currentOpacitySettings.setTileDecorationOpacity(newOpacitySettings.getTileDecorationOpacity() ?? currentOpacitySettings.getTileDecorationOpacity());
        currentOpacitySettings.setTileObjectOpacity(newOpacitySettings.getTileObjectOpacity() ?? currentOpacitySettings.getTileObjectOpacity());
        currentOpacitySettings.setUnitOpacity(newOpacitySettings.getUnitOpacity() ?? currentOpacitySettings.getUnitOpacity());
    }

    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsOpacitySettingsChanged);
}

export function getFollowingUserIdArray(): Undefinable<number[]> {
    return getSelfInfo()?.getUserRelationInfo()?.getFollowingUserIdArray();
}
export function checkIsFollowingUser(userId: Undefinable<number>): boolean {
    return userId == null
        ? false
        : !!getFollowingUserIdArray()?.includes(userId);
}
export function checkIsBlockingUser(userId: Undefinable<number>): boolean {
    return userId == null
        ? false
        : !!getSelfInfo()?.getUserRelationInfo()?.getBlockingUserIdArray()?.includes(userId);
}

export function getFavoriteReplayIdArray(): Undefinable<number[]> {
    return getSelfUserComplexInfo()?.getFavoriteReplayIdArray();
}
export function checkIsFavoriteReplayId(replayId: number): Undefinable<boolean> {
    return getSelfUserComplexInfo()?.getFavoriteReplayIdArray().includes(replayId);
}

export function getSelfCawHighScoreInfo(campaignId: number, campaignMapId: number): Undefinable<ProtoSchemaCommonProtoUserUserWarStatisticsUserCawStatistics.UserCawStatistics> {
    return getSelfUserComplexInfo()
        ?.getUserWarStatistics()
        ?.getCawArray()
        ?.find(v => ((v.getCampaignId() ?? 0) == campaignId) && ((v.getCampaignMapId() ?? 0) == campaignMapId));
}
function setSelfCawHighScore({ configVersion, campaignId, campaignMapId, campaignMapRevision, highScore }: {
    configVersion       : string;
    campaignId          : number;
    campaignMapId       : number;
    campaignMapRevision : number;
    highScore           : Undefinable<number>;
}): void {
    const userComplexInfo = getSelfUserComplexInfo();
    if (userComplexInfo == null) {
        return;
    }

    const cawArray      = userComplexInfo.createIfNotExistsUserWarStatistics().getCawArray();
    const existingInfo  = cawArray.find(v => ((v.getCampaignId() ?? 0) == campaignId) && ((v.getCampaignMapId() ?? 0) == campaignMapId));
    if (existingInfo != null) {
        const existingConfigVersion = existingInfo.getConfigVersion() ?? ``;
        const existingMapRevision   = existingInfo.getCampaignMapRevision() ?? 0;
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
        cawArray.push(ProtoSchemaCommonProtoUserUserWarStatisticsUserCawStatistics.UserCawStatistics.fromJson({
            configVersion       : configVersion,
            campaignId          : campaignId,
            campaignMapId       : campaignMapId,
            campaignMapRevision : campaignMapRevision,
            highScore           : highScore,
        }));
    }
}

export function updateOnMsgUserLogin(data: ProtoSchemaCommonProtoNetMessageMsgUserLoginS.S): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    (userSelfInfo) && (setSelfInfo(userSelfInfo));

    _updateDocumentTitle();
    ChatProxy.reqGetAllMessages();
    ChatProxy.reqGetAllReadProgressList();
    WatchWarModelWwProxy.reqMpwWatchRequestedWarIdArray();
}
export function updateOnMsgUserLoginAsGuest(data: ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS.S): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    if (userSelfInfo) {
        setSelfInfo(userSelfInfo);
        setSelfGuestUserId(userSelfInfo.getUserId());
    }

    _updateDocumentTitle();
    ChatProxy.reqGetAllMessages();
    ChatProxy.reqGetAllReadProgressList();
}

export function updateOnMsgUserGetOnlineState(data: ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS.S): void {
    setUserOnlineState(
        data.getUserId() ?? 0,
        {
            isOnline                : !!data.getIsOnline(),
            lastActivityTimestamp   : data.getLastActivityTime() ?? 0,
        }
    );
}
export function updateOnFailedMsgUserGetOnlineState(data: ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS.S): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userOnlineStateAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS.S): void {
    setUserPublicInfo(data.getUserId() ?? 0, data.getUserPublicInfo());
}
export function updateOnFailedMsgUserGetPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS.S): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userPublicInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetBriefInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS.S): void {
    setUserBriefInfo(data.getUserId() ?? 0, data.getUserBriefInfo() ?? null);
}
export function updateOnFailedMsgUserGetBriefInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS.S): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userBriefInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserSetNickname(data: ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS.S): void {
    setSelfNickname(HelpersMisc.getExisted(data.getNickname()));

    _updateDocumentTitle();
}
export function updateOnMsgUserSetDiscordInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS.S): void {
    setSelfDiscordInfo(data.getDiscordInfo());
}
export function updateOnMsgGmSetUserPrivilege(data: ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS.S): void {
    const userId = data.getUserId() ?? 0;
    if (userId === getSelfUserId()) {
        setSelfUserPrivilege(data.getUserPrivilege() ?? new ProtoSchemaCommonProtoUserUserPrivilege.UserPrivilege());
    }
}
export function updateOnMsgUserSetSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS.S): void {
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
        CommonModelCommonModel.updateOnUnitAndTileTextureVersionChanged();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UnitAndTileTextureVersionChanged);
    }
    if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsShowGridBorderChanged);
    }
    if (oldIsAutoScrollMap !== getSelfSettingsIsAutoScrollMap()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsAutoScrollMapChanged);
    }
    if (oldIsUnitFlickeringOnFullEnergy !== getSelfSettingsIsUnitFlickeringOnFullEnergy()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsUnitFlickeringOnFullEnergyChanged);
    }
    if (oldUnitMoveAniSpeedMultiplierPct !== getSelfSettingsUnitMoveAniSpeedMultiplierPct()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsUnitMoveAniSpeedMultiplierPctChanged);
    }
    if (oldIsReplayResultVisible !== getSelfSettingsIsReplayResultVisible()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsReplayResultVisibleChanged);
    }
    if (oldIsSetPathMode !== getSelfSettingsIsSetPathMode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsSetPathModeChanged);
    }
    if (oldCanAcceptNotFollowingMessages !== getSelfSettingsCanAcceptNotFollowingMessages()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsCanAcceptNotFollowingMessagesChanged);
    }
    if (oldIsScreenVibrationEnabled !== getSelfSettingsIsScreenVibrationEnabled()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UserSettingsIsScreenVibrationEnabledChanged);
    }
}
export function updateOnMsgUserSetMapRating(data: ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS.S): void {
    const complexInfo   = HelpersMisc.getExisted(getSelfUserComplexInfo());
    const normalMapId   = data.getNormalMapId();
    const rating        = data.getRating();
    const array         = complexInfo.getUserMapRatingArray();
    const info          = array.find(v => v.getNormalMapId() === normalMapId);
    if (info) {
        info.setRating(rating);
    } else {
        array.push(ProtoSchemaCommonProtoUserUserMapRating.UserMapRating.fromJson({
            normalMapId : normalMapId,
            rating      : rating,
        }));
    }
}
export function updateOnMsgUserSetAvatarId(data: ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS.S): void {
    setSelfAvatarId(HelpersMisc.getExisted(data.getAvatarId(), UtilsClientErrorCode.ClientErrorCode.UserModel_UpdateOnMsgUserSetAvatarId_00));
}
export function updateOnMsgUserSetMapEditorAutoSaveTime(data: ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS.S): void {
    setSelfMapEditorAutoSaveTime(data.getTime());
}
export function updateOnMsgUserSetCoBgmSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS.S): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const coCategoryId  = HelpersMisc.getExisted(data.getCoCategoryId());
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
            coBgmSettings.push(ProtoSchemaCommonProtoUserUserSettingsCoBgmSettings.CoBgmSettings.fromJson({
                coCategoryId    : coCategoryId,
                bgmCodeArray    : bgmCodeArray,
            }));
        }
    }
}
export function updateOnMsgUserSetSceneBgmSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS.S): void {
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
export function updateOnMsgUserSetRelation(data: ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS.S): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    const userId                = HelpersMisc.getExisted(data.getTargetUserId());
    const relationInfo          = selfInfo.createIfNotExistsUserRelationInfo();
    const followingUserIdArray  = relationInfo.getFollowingUserIdArray();
    if (data.getIsFollowing()) {
        HelpersCollection.addElementToListIfNotExists(followingUserIdArray, userId);
    } else {
        HelpersCollection.deleteElementFromList(followingUserIdArray, userId);
    }

    const blockingUserIdArray = relationInfo.getBlockingUserIdArray();
    if (data.getIsBlocking()) {
        HelpersCollection.addElementToListIfNotExists(blockingUserIdArray, userId);
    } else {
        HelpersCollection.deleteElementFromList(blockingUserIdArray, userId);
    }
}
export function updateOnMsgUserSetShowMedalIdArray(data: ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS.S): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    selfInfo.createIfNotExistsUserComplexInfo().createIfNotExistsUserMedalInfo().setShowMedalIdArray(data.getShowMedalIdArray());
}
export function updateOnMsgUserModifyFavoriteReplayIdArray(data: ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS.S): void {
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
export function updateOnMsgUserRequestEmailVerificationCode(data: ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS.S): void {
    const selfInfo = getSelfInfo();
    if (selfInfo) {
        const complexInfo = selfInfo.createIfNotExistsUserComplexInfo();
        complexInfo.setUnverifiedEmailAddress(data.getEmailAddress());
        complexInfo.setEmailVerificationEndTimestamp(data.getEndTimestamp());
    }
}
export function updateOnMsgUserVerifyEmail(data: ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS.S): void {
    const info = getSelfInfo();
    if (info) {
        info.setEmailAddress(data.getEmailAddress());
    }
}

export function updateOnMsgCampaignValidateWar(data: ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS.S): void {
    setSelfCawHighScore({
        configVersion       : data.getConfigVersion() ?? ``,
        campaignId          : data.getCampaignId() ?? 0,
        campaignMapId       : data.getCampaignMapId() ?? 0,
        campaignMapRevision : data.getCampaignMapRevision() ?? 0,
        highScore           : null,
    });
}
export function updateOnMsgCampaignGetScore(data:ProtoSchemaCommonProtoNetMessageMsgCampaignGetScoreS.S): void {
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
function _onNotifyMsgUserLogout(e: VendorEgretEgret.Event): void {
    const reason = (e.data as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS.S).getReason();
    if (reason === UsersConstants.LogoutTypeId.SelfRequest) {
        FloatText2.showLang(LangConstants.TextType.A0005);
    } else if (reason === UsersConstants.LogoutTypeId.LoginCollision) {
        FloatText2.showLang(LangConstants.TextType.A0006);
    } else if (reason === UsersConstants.LogoutTypeId.NetworkFailure) {
        FloatText2.showLang(LangConstants.TextType.A0013);
    }

    setIsLoggedIn(false);
}

function _updateDocumentTitle(): void {
    const nickname  = getSelfNickname();
    const prefix    = _getDocumentTitlePrefix();
    HelpersCompatibility.setDocumentTitle(nickname == null ? prefix : `${prefix} - ${nickname}`);
}
function _getDocumentTitlePrefix(): string {
    switch (window.GAME_VERSION) {
        case GameVersionsConstants.TypeName.Legacy       : return `TW Classic`;
        case GameVersionsConstants.TypeName.Trilogy      : return `TW Tri.`;
        case GameVersionsConstants.TypeName.Test         : return `TW Exp.`;
        case GameVersionsConstants.TypeName.Dor          : return `TW DoR`;
        case GameVersionsConstants.TypeName.TinyWars2    : return `TW2`;
        default                                             : return `TW`;
    }
}
