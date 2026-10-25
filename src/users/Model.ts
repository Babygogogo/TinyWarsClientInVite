import { Common } from "../autoTourneys/Constants.ts";
import type { Undefinable, UserOnlineState } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../auxiliaryTypes/CachedDataAccessor.ts";
import { reqGetAllMessages, reqGetAllReadProgressList } from "../chat/Proxy.ts";
import { updateOnUnitAndTileTextureVersionChanged } from "../common/model/CommonModel.ts";
import { showLang } from "../FloatText.ts";
import { TypeName } from "../gameVersions/Constants.ts";
import { getCurrentGameEssentialConfig } from "../gameVersions/Utils.ts";
import { TextureVersionId, TextureResolutionId } from "../graphics/Constants.ts";
import { addElementToListIfNotExists, deleteElementFromList } from "../helpers/Collection.ts";
import { setDocumentTitle } from "../helpers/Compatibility.ts";
import { getExisted } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import { addEventListeners, dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S } from "../proto/schema/CommonProto/NetMessage/MsgCampaignGetScore/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS,
} from "../proto/schema/CommonProto/NetMessage/MsgCampaignValidateWar/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS,
} from "../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgUserLoginS } from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS } from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
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
import { BgmSfxCode } from "../sounds/Constants.ts";
import { LogoutTypeId } from "./Constants.ts";
import { reqUserGetPublicInfo, reqUserGetBriefInfo, reqUserGetOnlineState, reqUserSetSettings } from "./Proxy.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { Event } from "../vendor/egret/Egret.ts";
import { WarTypeId } from "../warTypes/Constants.ts";
import { reqMpwWatchRequestedWarIdArray } from "../watchWar/model/WwProxy.ts";

let _isLoggedIn                 = false;
let _selfInfo                   : UserSelfInfo | null = null;
let _selfAccount                : string;
let _selfPassword               : string | null = null;
let _selfGuestUserId            : Undefinable<number>;
const _userPublicInfoAccessor   = new CachedDataAccessor<number, UserPublicInfo>({
    reqData                     : (userId: number) => reqUserGetPublicInfo(userId),
});
const _userBriefInfoAccessor    = new CachedDataAccessor<number, UserBriefInfo>({
    reqData                     : (userId: number) => reqUserGetBriefInfo(userId),
});
const _userOnlineStateAccessor  = new CachedDataAccessor<number, UserOnlineState>({
    reqData         : userId => reqUserGetOnlineState(userId),
    dataExpireTime  : 5,
});

export function init(): void {
    addEventListeners([
        { type: TypeId.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
        { type: TypeId.MsgUserLogout,          callback: _onNotifyMsgUserLogout, },
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
function getSelfUserComplexInfo(): Undefinable<UserComplexInfo> {
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

export function getSelfUserPrivilege(): Undefinable<UserPrivilege> {
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

export function getSelfDiscordInfo(): Undefinable<UserDiscordInfo> {
    return getSelfUserComplexInfo()?.getUserDiscordInfo();
}
function setSelfDiscordInfo(discordInfo: Undefinable<UserDiscordInfo>): void {
    getSelfUserComplexInfo()?.setUserDiscordInfo(discordInfo);
}

export function checkHasUserPublicInfo(userId: number): boolean {
    return _userPublicInfoAccessor.getHasKey(userId);
}
export function getUserPublicInfo(userId: number): Promise<Undefinable<UserPublicInfo>> {
    return _userPublicInfoAccessor.getData(userId);
}
function setUserPublicInfo(userId: number, info: Undefinable<UserPublicInfo>): void {
    _userPublicInfoAccessor.setData(userId, info);
}

export function getUserBriefInfo(userId: number): Promise<Undefinable<UserBriefInfo>> {
    return _userBriefInfoAccessor.getData(userId);
}
function setUserBriefInfo(userId: number, info: Undefinable<UserBriefInfo>): void {
    _userBriefInfoAccessor.setData(userId, info);
}

export function getUserOnlineState(userId: number): Promise<Undefinable<UserOnlineState>> {
    return _userOnlineStateAccessor.getData(userId);
}
function setUserOnlineState(userId: number, state: Undefinable<UserOnlineState>): void {
    _userOnlineStateAccessor.setData(userId, state);
}

export async function getUserNickname(userId: number): Promise<Undefinable<string>> {
    return (await getUserPublicInfo(userId))?.getNickname();
}
export async function getUserMrwRankScoreInfo(userId: number, warType: WarTypeId, playersCount: number): Promise<Undefinable<UserMrwRankInfo>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMrwRankInfoArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export async function getUserMpwStatisticsData(userId: number, warType: WarTypeId, playersCount: number): Promise<Undefinable<UserMpwStatistics>> {
    return (await getUserPublicInfo(userId))
        ?.getUserMpwStatisticsArray()
        ?.find(v => (v.getWarType() === warType) && (v.getPlayersCountUnneutral() === playersCount));
}
export function getMapRating(normalMapId: number): Undefinable<number> {
    return getSelfUserComplexInfo()?.getUserMapRatingArray()?.find(v => v.getNormalMapId() === normalMapId)?.getRating();
}

export function checkCanRegisterAutoTourney(): boolean {
    return getSelfUserComplexInfo()?.getUserRankInfo()?.getMrwArray()?.find(v =>
        ((v.getWarType() === WarTypeId.MrwFog) || (v.getWarType() === WarTypeId.MrwStd))  &&
        (v.getPlayersCountUnneutral() === Common.PlayersCountUnneutral)
    )?.getLastWarEndTime() != null;
}

export function getSelfSettings(): Undefinable<UserSettings> {
    return getSelfUserComplexInfo()?.getUserSettings();
}
export function getSelfSettingsTextureVersion(): TextureVersionId {
    return getCurrentGameEssentialConfig().textureResolutionTypeId === TextureResolutionId.Trilogy
        ? TextureVersionId.V1
        : (getSelfSettings()?.getUnitAndTileTextureVersion() ?? TextureVersionId.V0);
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
    return getSelfSettings()?.getSceneBgmSettings()?.getLobbyBgmCode() ?? BgmSfxCode.Lobby;
}
export function getSelfSettingsBgmCodeForMapEditor(): number {
    return getSelfSettings()?.getSceneBgmSettings()?.getMapEditorBgmCode() ?? BgmSfxCode.MapEditor;
}
export function getSelfSettingsCoBgmCodeArray(coCategoryId: number): Undefinable<number[]> {
    return getSelfSettings()?.getCoBgmSettings()?.find(v => (v.getCoCategoryId() ?? 0) === coCategoryId)?.getBgmCodeArray();
}
export function getSelfSettingsIsScreenVibrationEnabled(): boolean {
    return getSelfSettings()?.getIsScreenVibrationEnabled() ?? true;
}

export function getSelfSettingsOpacitySettings(): Undefinable<UserOpacitySettings> {
    return getSelfSettings()?.getOpacitySettings() ?? null;
}
export function setSelfSettingsOpacitySettings(opacitySettings: UserOpacitySettings): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    selfSettings.setOpacitySettings(opacitySettings);
    dispatch(TypeId.UserSettingsOpacitySettingsChanged);
}
export function reqTickSelfSettingsUnitOpacity(): void {
    const unitOpacity = getSelfSettingsOpacitySettings()?.getUnitOpacity();
    if ((unitOpacity === 100) || (unitOpacity == null)) {
        reqUserSetSettings({ opacitySettings: { unitOpacity: 75 }, coBgmSettings: [] });
    } else if (unitOpacity === 75) {
        reqUserSetSettings({ opacitySettings: { unitOpacity: 50 }, coBgmSettings: [] });
    } else if (unitOpacity === 50) {
        reqUserSetSettings({ opacitySettings: { unitOpacity: 0 }, coBgmSettings: [] });
    } else {
        reqUserSetSettings({ opacitySettings: { unitOpacity: 100 }, coBgmSettings: [] });
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

    dispatch(TypeId.UserSettingsOpacitySettingsChanged);
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

export function getSelfCawHighScoreInfo(campaignId: number, campaignMapId: number): Undefinable<UserCawStatistics> {
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
        cawArray.push(UserCawStatistics.fromJson({
            configVersion       : configVersion,
            campaignId          : campaignId,
            campaignMapId       : campaignMapId,
            campaignMapRevision : campaignMapRevision,
            highScore           : highScore,
        }));
    }
}

export function updateOnMsgUserLogin(data: ProtoSchemaCommonProtoNetMessageMsgUserLoginS): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    (userSelfInfo) && (setSelfInfo(userSelfInfo));

    _updateDocumentTitle();
    reqGetAllMessages();
    reqGetAllReadProgressList();
    reqMpwWatchRequestedWarIdArray();
}
export function updateOnMsgUserLoginAsGuest(data: ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.getUserSelfInfo();
    if (userSelfInfo) {
        setSelfInfo(userSelfInfo);
        setSelfGuestUserId(userSelfInfo.getUserId());
    }

    _updateDocumentTitle();
    reqGetAllMessages();
    reqGetAllReadProgressList();
}

export function updateOnMsgUserGetOnlineState(data: ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS): void {
    setUserOnlineState(
        data.getUserId() ?? 0,
        {
            isOnline                : !!data.getIsOnline(),
            lastActivityTimestamp   : data.getLastActivityTime() ?? 0,
        }
    );
}
export function updateOnFailedMsgUserGetOnlineState(data: ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userOnlineStateAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS): void {
    setUserPublicInfo(data.getUserId() ?? 0, data.getUserPublicInfo());
}
export function updateOnFailedMsgUserGetPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userPublicInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserGetBriefInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS): void {
    setUserBriefInfo(data.getUserId() ?? 0, data.getUserBriefInfo() ?? null);
}
export function updateOnFailedMsgUserGetBriefInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS): void {
    const userId = data.getUserId();
    if (userId != null) {
        _userBriefInfoAccessor.updateOnRequestFailed(userId);
    }
}

export function updateOnMsgUserSetNickname(data: ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS): void {
    setSelfNickname(getExisted(data.getNickname()));

    _updateDocumentTitle();
}
export function updateOnMsgUserSetDiscordInfo(data: ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS): void {
    setSelfDiscordInfo(data.getDiscordInfo());
}
export function updateOnMsgGmSetUserPrivilege(data: ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS): void {
    const userId = data.getUserId() ?? 0;
    if (userId === getSelfUserId()) {
        setSelfUserPrivilege(data.getUserPrivilege() ?? new UserPrivilege());
    }
}
export function updateOnMsgUserSetSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS): void {
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
        updateOnUnitAndTileTextureVersionChanged();
        dispatch(TypeId.UnitAndTileTextureVersionChanged);
    }
    if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
        dispatch(TypeId.UserSettingsIsShowGridBorderChanged);
    }
    if (oldIsAutoScrollMap !== getSelfSettingsIsAutoScrollMap()) {
        dispatch(TypeId.UserSettingsIsAutoScrollMapChanged);
    }
    if (oldIsUnitFlickeringOnFullEnergy !== getSelfSettingsIsUnitFlickeringOnFullEnergy()) {
        dispatch(TypeId.UserSettingsIsUnitFlickeringOnFullEnergyChanged);
    }
    if (oldUnitMoveAniSpeedMultiplierPct !== getSelfSettingsUnitMoveAniSpeedMultiplierPct()) {
        dispatch(TypeId.UserSettingsUnitMoveAniSpeedMultiplierPctChanged);
    }
    if (oldIsReplayResultVisible !== getSelfSettingsIsReplayResultVisible()) {
        dispatch(TypeId.UserSettingsIsReplayResultVisibleChanged);
    }
    if (oldIsSetPathMode !== getSelfSettingsIsSetPathMode()) {
        dispatch(TypeId.UserSettingsIsSetPathModeChanged);
    }
    if (oldCanAcceptNotFollowingMessages !== getSelfSettingsCanAcceptNotFollowingMessages()) {
        dispatch(TypeId.UserSettingsCanAcceptNotFollowingMessagesChanged);
    }
    if (oldIsScreenVibrationEnabled !== getSelfSettingsIsScreenVibrationEnabled()) {
        dispatch(TypeId.UserSettingsIsScreenVibrationEnabledChanged);
    }
}
export function updateOnMsgUserSetMapRating(data: ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS): void {
    const complexInfo   = getExisted(getSelfUserComplexInfo());
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
export function updateOnMsgUserSetAvatarId(data: ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS): void {
    setSelfAvatarId(getExisted(data.getAvatarId(), ClientErrorCode.UserModel_UpdateOnMsgUserSetAvatarId_00));
}
export function updateOnMsgUserSetMapEditorAutoSaveTime(data: ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS): void {
    setSelfMapEditorAutoSaveTime(data.getTime());
}
export function updateOnMsgUserSetCoBgmSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS): void {
    const selfSettings = getSelfSettings();
    if (selfSettings == null) {
        return;
    }

    const coCategoryId  = getExisted(data.getCoCategoryId());
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
                coCategoryId    : coCategoryId,
                bgmCodeArray    : bgmCodeArray,
            }));
        }
    }
}
export function updateOnMsgUserSetSceneBgmSettings(data: ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS): void {
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
export function updateOnMsgUserSetRelation(data: ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    const userId                = getExisted(data.getTargetUserId());
    const relationInfo          = selfInfo.createIfNotExistsUserRelationInfo();
    const followingUserIdArray  = relationInfo.getFollowingUserIdArray();
    if (data.getIsFollowing()) {
        addElementToListIfNotExists(followingUserIdArray, userId);
    } else {
        deleteElementFromList(followingUserIdArray, userId);
    }

    const blockingUserIdArray = relationInfo.getBlockingUserIdArray();
    if (data.getIsBlocking()) {
        addElementToListIfNotExists(blockingUserIdArray, userId);
    } else {
        deleteElementFromList(blockingUserIdArray, userId);
    }
}
export function updateOnMsgUserSetShowMedalIdArray(data: ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS): void {
    const selfInfo = getSelfInfo();
    if (selfInfo == null) {
        return;
    }

    selfInfo.createIfNotExistsUserComplexInfo().createIfNotExistsUserMedalInfo().setShowMedalIdArray(data.getShowMedalIdArray());
}
export function updateOnMsgUserModifyFavoriteReplayIdArray(data: ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS): void {
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
export function updateOnMsgUserRequestEmailVerificationCode(data: ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS): void {
    const selfInfo = getSelfInfo();
    if (selfInfo) {
        const complexInfo = selfInfo.createIfNotExistsUserComplexInfo();
        complexInfo.setUnverifiedEmailAddress(data.getEmailAddress());
        complexInfo.setEmailVerificationEndTimestamp(data.getEndTimestamp());
    }
}
export function updateOnMsgUserVerifyEmail(data: ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS): void {
    const info = getSelfInfo();
    if (info) {
        info.setEmailAddress(data.getEmailAddress());
    }
}

export function updateOnMsgCampaignValidateWar(data: ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS): void {
    setSelfCawHighScore({
        configVersion       : data.getConfigVersion() ?? ``,
        campaignId          : data.getCampaignId() ?? 0,
        campaignMapId       : data.getCampaignMapId() ?? 0,
        campaignMapRevision : data.getCampaignMapRevision() ?? 0,
        highScore           : null,
    });
}
export function updateOnMsgCampaignGetScore(data:S): void {
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
function _onNotifyMsgUserLogout(e: Event): void {
    const reason = (e.data as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS).getReason();
    if (reason === LogoutTypeId.SelfRequest) {
        showLang(TextType.A0005);
    } else if (reason === LogoutTypeId.LoginCollision) {
        showLang(TextType.A0006);
    } else if (reason === LogoutTypeId.NetworkFailure) {
        showLang(TextType.A0013);
    }

    setIsLoggedIn(false);
}

function _updateDocumentTitle(): void {
    const nickname  = getSelfNickname();
    const prefix    = _getDocumentTitlePrefix();
    setDocumentTitle(nickname == null ? prefix : `${prefix} - ${nickname}`);
}
function _getDocumentTitlePrefix(): string {
    switch (window.GAME_VERSION) {
        case TypeName.Legacy       : return `TW Classic`;
        case TypeName.Trilogy      : return `TW Tri.`;
        case TypeName.Test         : return `TW Exp.`;
        case TypeName.Dor          : return `TW DoR`;
        case TypeName.TinyWars2    : return `TW2`;
        default                                             : return `TW`;
    }
}
